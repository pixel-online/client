import Game, { FONT_SIZE } from 'sbjr-game-framwork';

import Player from './Player';
import { io } from "socket.io-client";

window.addEventListener('load',() => {

  // ********************
  // Demarrage du jeu
  // ********************

  // Initialisation du moteur de jeu sbjr-framework
	const game = new Game(
		false,					// If true, activate the debug mode
		'pixel online', 		// The name of the application
		null, // The id of the element of the Dom that will be used as a container. If null, the engine will generate one inside the body
  );
  
  // Initialisation du jouer
  const player1 = new Player('Mr Pique sel', 32, 32);
  const player2 = new Player('ReSeau di hommemy', 64, 64);

  // Initialisation au serveur socket
  const socket = io("http://localhost:1337");

  socket.on('playerMove', (direction) => {
    if (
      direction === 'LEFT' ||
      direction === 'RIGHT' ||
      direction === 'STOP_LEFT' ||
      direction === 'STOP_RIGHT' 
    ) {
      console.log('hello');
      player2.moveX(direction)
    }

    if (
      direction === 'TOP' ||
      direction === 'BOTTOM' ||
      direction === 'STOP_TOP' ||
      direction === 'STOP_BOTTOM' 
    ) {
      player2.moveY(direction)
    }
  });


  
  // Evenements - touche clavier appuyé
  window.document.addEventListener('keydown', (event) => {
    if (event.keyCode === 38) {
      player1.moveY('TOP')
      socket.emit('playerMove', 'TOP')

    } else if (event.keyCode === 40) {
      player1.moveY('BOTTOM')
      socket.emit('playerMove', 'BOTTOM')
    }
    if (event.keyCode === 37) {
      player1.moveX('LEFT')
      socket.emit('playerMove', 'LEFT')
      
    } else if (event.keyCode === 39) {
      player1.moveX('RIGHT')
      socket.emit('playerMove', 'RIGHT')
    }
  })

  // Evenements - touche clavier relaché
  window.document.addEventListener('keyup', (event) => {
    if (event.keyCode === 38) {
      player1.moveY('STOP_TOP')
      socket.emit('playerMove', 'STOP_TOP')

    } else if (event.keyCode === 40) {
      player1.moveY('STOP_BOTTOM')
      socket.emit('playerMove', 'STOP_BOTTOM')
    }
    if (event.keyCode === 37) {
      player1.moveX('STOP_LEFT')
      socket.emit('playerMove', 'STOP_LEFT')
      
    } else if (event.keyCode === 39) {
      player1.moveX('STOP_RIGHT')
      socket.emit('playerMove', 'STOP_RIGHT')
    }
  })

	game.loop(() => {
        // Mise à jour
        
        // TODO: deplacement
        player1.update();
        player2.update()

        // Dessin
        game.drawText(player1.getName(), player1.getX(), player1.getY() - 32, 'black', '22px');
        game.drawRect('blue', player1.getX(), player1.getY(), 32, 32);

        game.drawText(player2.getName(), player2.getX(), player2.getY() - 32, 'black', '22px');
        game.drawRect('red', player2.getX(), player2.getY(), 32, 32);
	});
	game.run();
});

// player1.moveX('RIGHT')
// player1.moveX('STOP')
// player1.moveX('LEFT')

// player1.moveY('TOP')
// player1.moveY('STOP')
// player1.moveY('LEFT')