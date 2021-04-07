class Player {
  constructor(name = 'Anonyme', xPosition = 0, yPosition = 0) {
    this._name = name;
    this._x = xPosition;
    this._y = yPosition;
    this._moveToLeft = false
    this._moveToRight = false
    this._moveToTop = false
    this._moveToBottom = false
  }

  getName() {
    return this._name;
  }

  getX() {
    return this._x;
  }

  getY() {
    return this._y;
  }

  moveX(move) {
    if (move === 'RIGHT') {
      this._moveToRight = true
      this._moveToLeft = false
    } else if (move === 'LEFT') {
      this._moveToLeft = true
      this._moveToRight = false
    } else if (move === 'STOP_LEFT') {
      this._moveToLeft = false
    } else if (move === 'STOP_RIGHT') {
      this._moveToRight = false
    }
  }

  moveY(move) {
    if (move === 'TOP') {
      this._moveToTop = true
      this._moveToBottom = false
    } else if (move === 'BOTTOM') {
      this._moveToTop = false
      this._moveToBottom = true
    } else if (move === 'STOP_TOP') {
      this._moveToTop = false
    } else if (move === 'STOP_BOTTOM') {
      this._moveToBottom = false
    }
    return
  }

  update() {
    if (this._moveToRight) {
      this._x += 2
    } else if (this._moveToLeft) {
      this._x -= 2
    }

    if (this._moveToTop) {
      this._y -= 2
    } else if (this._moveToBottom) {
      this._y += 2
    }
  }
}

export default Player