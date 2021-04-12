import Game, { FONT_SIZE } from 'sbjr-game-framwork';

import Player from './Player';
import { io } from "socket.io-client";

const DEFAULT_NAME = 'Anonyme';
console.log('process.env: ', process);
const DEFAULT_HOST = process.env.HOST;

window.addEventListener('load', () => {

  // ********************
  // Demarrage du jeu
  // ********************

  // Initialisation du moteur de jeu sbjr-framework
	const game = new Game(
		false,					// If true, activate the debug mode
		'pixel online', 		// The name of the application
		null, // The id of the element of the Dom that will be used as a container. If null, the engine will generate one inside the body
  );
  
   // Choic du serveur
   let host = prompt('Choissisez un serveur ?')
   if (host === null) {
     host = DEFAULT_HOST
   }

  // Initialisation du jouer
  let name = prompt('Choissisez votre nom:')
  if (name === null) {
    name = DEFAULT_NAME
  }

  const player1 = new Player(name, 32, 32);

  const player2 = new Player('ReSeau di hommemy', 32, 32);

  // Initialisation au serveur socket
  const socket = io(host, {
    query: {
      name: player1.getName()
    }
  });

  socket.on("connect", () => {
    console.log('socket: ', socket);
    player1.setId(socket.id);
  });

  socket.on("connectUser", (params) => {
    alert('Nouvelle utilisateur: ' + params.name);
    player2.setName(params.name);
    console.log('params.id: ', params.id);
    player2.setId(params.id);
  });

  socket.on("deconnectUser", () => {
    player2.setId(null);
  });

  setInterval(() => {
    socket.emit('updateMove', ({
      x: player1.getX(),
      y: player1.getY(),
    }))
  }, 1000);

  socket.on('updateMove', ({x, y, id}) => {
    if (player2.getId() === id) {
      player2.setX(x)
      player2.setY(y)
    }
  })

  socket.on('playerMove', ({
    id,
    direction,
  }) => {
    if (
      player1.getId() !== null &&
      player1.getId() === id &&
     ( direction === 'LEFT' ||
      direction === 'RIGHT' ||
      direction === 'STOP_LEFT' ||
      direction === 'STOP_RIGHT') 
    ) {
      player1.moveX(direction)
    }

    if (
      player1.getId() !== null &&
      player1.getId() === id &&
      (direction === 'TOP' ||
      direction === 'BOTTOM' ||
      direction === 'STOP_TOP' ||
      direction === 'STOP_BOTTOM') 
    ) {
      player1.moveY(direction)
    }
    if (
      player2.getId() !== null &&
      player2.getId() === id &&
      (direction === 'LEFT' ||
      direction === 'RIGHT' ||
      direction === 'STOP_LEFT' ||
      direction === 'STOP_RIGHT' )
    ) {
      player2.moveX(direction)
    }

    if (
      player2.getId() !== null &&
      player2.getId() === id &&
      (direction === 'TOP' ||
      direction === 'BOTTOM' ||
      direction === 'STOP_TOP' ||
      direction === 'STOP_BOTTOM' )
    ) {
      player2.moveY(direction)
    }
  });


  
  // Evenements - touche clavier appuyé
  window.document.addEventListener('keydown', (event) => {
    if (event.keyCode === 38) {
      // player1.moveY('TOP')
      socket.emit('playerMove', { direction: 'TOP', id: socket.id})

    } else if (event.keyCode === 40) {
      // player1.moveY('BOTTOM')
      socket.emit('playerMove', { direction: 'BOTTOM', id: socket.id})
    }
    if (event.keyCode === 37) {
      // player1.moveX('LEFT')
      socket.emit('playerMove', { direction: 'LEFT', id: socket.id})
      
    } else if (event.keyCode === 39) {
      // player1.moveX('RIGHT')
      socket.emit('playerMove', { direction: 'RIGHT', id: socket.id})
    }
  })

  // Evenements - touche clavier relaché
  window.document.addEventListener('keyup', (event) => {
    if (event.keyCode === 38) {
      // player1.moveY('STOP_TOP')
      socket.emit('playerMove', { direction: 'STOP_TOP', id: socket.id})

    } else if (event.keyCode === 40) {
      // player1.moveY('STOP_BOTTOM')
      socket.emit('playerMove', { direction: 'STOP_BOTTOM', id: socket.id})
    }
    if (event.keyCode === 37) {
      // player1.moveX('STOP_LEFT')
      socket.emit('playerMove', { direction: 'STOP_LEFT', id: socket.id})
      
    } else if (event.keyCode === 39) {
      // player1.moveX('STOP_RIGHT')
      socket.emit('playerMove', { direction: 'STOP_RIGHT', id: socket.id})
    }
  })

	game.loop(() => {
        // Mise à jour
        
        // TODO: deplacement
        player1.update();
        if (player2.getId() !== null) {
          player2.update();
        }

        // Dessin
        game.drawText(player1.getName(), player1.getX(), player1.getY() - 32, 'black', '22px');
        game.drawRect('blue', player1.getX(), player1.getY(), 32, 32);
        if (player2.getId() !== null) {
          game.drawText(player2.getName(), player2.getX(), player2.getY() - 32, 'black', '22px');
          game.drawRect('red', player2.getX(), player2.getY(), 32, 32);
        }
	});
	game.run();
});
