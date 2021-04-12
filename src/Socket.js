import { io } from "socket.io-client";

const DEFAULT_HOST = process.env.HOST;

class Socket {
	constructor(game) {
		this._game = game;
		this._socket = io(DEFAULT_HOST, {
			query: {
				name: '',
			}
		});	
		this._initEvent();	
	}

	getSocket() {
		return this._socket;
	}

	_initEvent() {
		this._socket.on("connect", () => {
			this._game._player1.setId(this._socket.id);
		});
	
		this._socket.on("disconnect", (reason) => {
			document.body.innerHTML = reason
		});
	
		this._socket.on("connectUser", (params) => {       
			this._game._player2.setName(params.name);
			console.log('this._game: ', this._game);
			if (params.position === 'LEFT') {
				this._game._player2.setScreenPosition('LEFT');
				this._game._player2.setX(32);
				this._game._player2.setY((this._game._gameEngine._canvasElt.height-64)/2);
				this._game._player1.setScreenPosition('RIGHT');
				this._game._player1.setX(this._game._gameEngine._canvasElt.width-96);
				this._game._player1.setY((this._game._gameEngine._canvasElt.height-64)/2);
				this._socket.emit('updateMove', ({
					x: this._game._player1.getX(),
					y: this._game._player1.getY(),
			}))
			} else {
				this._game._player2.setScreenPosition('RIGHT');
				this._game._player2.setX(this._game._gameEngine._canvasElt.width-96);
				this._game._player2.setY((this._game._gameEngine._canvasElt.height-64)/2);
				this._game._player1.setScreenPosition('LEFT');
				this._game._player1.setX(32);
				this._game._player1.setY((this._game._gameEngine._canvasElt.height-64)/2);
				this._socket.emit('updateMove', ({
					x: this._game._player1.getX(),
					y: this._game._player1.getY(),
			}))
			}
			this._game._player2.setId(params.id);
		});
	
		this._socket.on("deconnectUser", () => {
			this._game._player2.setId(null);
		});

		this._socket.on("startGame", () => {
			this._game.startCounterGame();
		});

		this._socket.on("stopGame", () => {
			this._game.resetGame()
		});
	
		setInterval(() => {
			this._socket.emit('updateMove', ({
				x: this._game._player1.getX(),
				y: this._game._player1.getY(),
			}))
		}, 1000);
	
		this._socket.on('updateMove', ({x, y, id}) => {
			if (this._game._player2.getId() === id) {
				this._game._player2.setX(x)
				this._game._player2.setY(y)
			}
		})
	
		this._socket.on('playerMove', ({
			id,
			direction,
		}) => {
			// if (
			//   this._game._player1.getId() !== null &&
			//   this._game._player1.getId() === id &&
			//  ( direction === 'LEFT' ||
			//   direction === 'RIGHT' ||
			//   direction === 'STOP_LEFT' ||
			//   direction === 'STOP_RIGHT') 
			// ) {
			//   this._game._player1.moveX(direction)
			// }
	
			if (
				this._game._player1.getId() !== null &&
				this._game._player1.getId() === id &&
				(direction === 'TOP' ||
				direction === 'BOTTOM' ||
				direction === 'STOP_TOP' ||
				direction === 'STOP_BOTTOM') 
			) {
				this._game._player1.moveY(direction)
			}
			// if (
			//   this._game._player2.getId() !== null &&
			//   this._game._player2.getId() === id &&
			//   (direction === 'LEFT' ||
			//   direction === 'RIGHT' ||
			//   direction === 'STOP_LEFT' ||
			//   direction === 'STOP_RIGHT' )
			// ) {
			//   this._game._player2.moveX(direction)
			// }
	
			if (
				this._game._player2.getId() !== null &&
				this._game._player2.getId() === id &&
				(direction === 'TOP' ||
				direction === 'BOTTOM' ||
				direction === 'STOP_TOP' ||
				direction === 'STOP_BOTTOM' )
			) {
				this._game._player2.moveY(direction)
			}
		});
	}
}

export default Socket;