import GameEngine, { FONT_SIZE } from 'sbjr-game-framwork';

import BACKGROUND_IMG from '../assets/background-img.png';
import BALL_IMG from '../assets/ball.png';
import BONUS_IMG from '../assets/bonus-1.png';
import Ball from './Ball';
import Bonus from './Bonus'
import PLAYER_LEFT_IMG from '../assets/player-left.png';
import PLAYER_RIGHT_IMG from '../assets/player-right.png';
import Player from './Player';
import Socket from './Socket';

class Game {
	constructor() {
		this._gameEngine = new GameEngine(false, 'pixel online', null );
		this._player1 = new Player();
		this._player2 = new Player();
		this._ball = new Ball(1280/2-32, 768/2-32);
		this._bonus = new Bonus(1280/2-32, 768/2-32);
		this._bonus.moveX("LEFT")
		this._pendingStart = false;
		this._pendingStartCounter = Date.now();
		this._run = false;
		this._initEvent();
		this._socket = new Socket(this);
		console.log(this._gameEngine._canvasElt.height, this._gameEngine._canvasElt.width);
		
	}
		
	startCounterGame() {
		this._pendingStart = true;
		setTimeout(() => {
			this._pendingStart = false;
			this.startGame();
		}, 3000);
	}

	startGame() {
		this._run = true;
	}

	stopGame() {
		this._gameEngine = new GameEngine(false, 'pixel online', null );
		this._player1 = new Player('1', 0, 0);
		this._player2 = new Player('2', 0, 0);
		this._run = false;
	}

	start() {
		// ********************
		// Demarrage du jeu
		// ********************
		this._gameEngine.loop(() => {
			if (this._run || this._pendingStart) {
				// Mise à jour
				if (!this._pendingStart) {
					this._ball.update();
					this._bonus.update();
					this._player1.update();
					if (this._player2.getId() !== null) {
						this._player2.update();
					}
				}
	
				// Dessin
				const backgroundImg = GameEngine.createImage(BACKGROUND_IMG)
				const playerLeftImg = GameEngine.createImage(PLAYER_LEFT_IMG)
				const playerRightImg = GameEngine.createImage(PLAYER_RIGHT_IMG)
				const ballImg = GameEngine.createImage(BALL_IMG)
				const bonusImg = GameEngine.createImage(BONUS_IMG)


				this._gameEngine.drawImage(backgroundImg, 0, 0, this._gameEngine._canvasElt.width, this._gameEngine._canvasElt.height);

				this._gameEngine.drawImage(
					ballImg,
					this._ball.getX(),
					this._ball.getY(),
					64,
					64
				);

				this._gameEngine.drawImage(
					bonusImg,
					this._bonus.getX(),
					this._bonus.getY(),
					64,
					64
				);

				// this._gameEngine.drawText(this._player1.getName(), this._player1.getX(), this._player1.getY() - 32, 'black', '22px');
				this._gameEngine.drawImage(
					this._player1.getScreenPosition() === 'LEFT' ? playerLeftImg : playerRightImg,
					this._player1.getX(),
					this._player1.getY(),
					64,
					64
				);
				if (this._player2.getId() !== null) {
					//this._gameEngine.drawText(this._player2.getName(), this._player2.getX(), this._player2.getY() - 32, 'black', '22px');
					this._gameEngine.drawImage(
						this._player2.getScreenPosition() === 'LEFT' ? playerLeftImg : playerRightImg,
						this._player2.getX(),
						this._player2.getY(),
						64,
						64
					);
				}

				if (this._pendingStart) {
					const counterValue = parseInt((Date.now() - this._pendingStartCounter)/1000, 10);
					this._gameEngine.drawRect('black', 0, 0, this._gameEngine._canvasElt.width, this._gameEngine._canvasElt.height, 0.2);
					this._gameEngine.drawText(3 - counterValue, this._gameEngine._canvasElt.width / 2 - 20, this._gameEngine._canvasElt.height / 2 - 50, 'black', '80px');
					
				}
			} else {
				this._gameEngine.drawText('En attente d\'un joueur', 0, 0, 'black', '22px');
			}
		});
		this._gameEngine.run();
	}

	_initEvent() {
		// Evenements - touche clavier appuyé
		window.document.addEventListener('keydown', (event) => {
			if (this._run) {
				if (event.keyCode === 38) {
					// player1.moveY('TOP')
					this._socket.getSocket().emit('playerMove', { direction: 'TOP', id: this._socket.getSocket().id})
					
				} else if (event.keyCode === 40) {
					// player1.moveY('BOTTOM')
					this._socket.getSocket().emit('playerMove', { direction: 'BOTTOM', id: this._socket.getSocket().id})
				}
				if (event.keyCode === 37) {
					// player1.moveX('LEFT')
					this._socket.getSocket().emit('playerMove', { direction: 'LEFT', id: this._socket.getSocket().id})
					
				} else if (event.keyCode === 39) {
					// player1.moveX('RIGHT')
					this._socket.getSocket().emit('playerMove', { direction: 'RIGHT', id: this._socket.getSocket().id})
				}
			}
		})
	
		// Evenements - touche clavier relaché
		window.document.addEventListener('keyup', (event) => {
			if (this._run) {
				if (event.keyCode === 38) {
					// player1.moveY('STOP_TOP')
					this._socket.getSocket().emit('playerMove', { direction: 'STOP_TOP', id: this._socket.getSocket().id})
					
				} else if (event.keyCode === 40) {
					// player1.moveY('STOP_BOTTOM')
					this._socket.getSocket().emit('playerMove', { direction: 'STOP_BOTTOM', id: this._socket.getSocket().id})
				}
				if (event.keyCode === 37) {
					// player1.moveX('STOP_LEFT')
					this._socket.getSocket().emit('playerMove', { direction: 'STOP_LEFT', id: this._socket.getSocket().id})
					
				} else if (event.keyCode === 39) {
					// player1.moveX('STOP_RIGHT')
					this._socket.getSocket().emit('playerMove', { direction: 'STOP_RIGHT', id: this._socket.getSocket().id})
				}
			}
		})
	}
}

export default Game;