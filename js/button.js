// var extendable = require('./lib/extendable')

var Button = module.exports = function(pos, width, height, sprite) {
  this.game = require('./game').game
  this.pos = pos
  this.width = width
  this.height = height
  this.state = Button.STATE.NORMAL
}

Button.prototype.tapped = function() {}

Button.prototype.update = function() {
  this.state = Button.STATE.NORMAL
  if (this.game.input.current) {
    if (this.contains(this.game.input.current) && this.contains(this.game.input.start)) {
      this.state = Button.STATE.DOWN
    }
  }
  else if (this.game.input.prev && this.contains(this.game.input.prev)) {
    this.tapped()
    this.game.input.prev = null
  }
}

Button.prototype.draw = function(ctx) {
  ctx.save()
  ctx.translate(this.pos.x, this.pos.y)

  ctx.beginPath()
  ctx.lineStyle = '#000000'
  ctx.lineWidth = 2
  ctx.rect(0, 0, this.width, this.height)
  ctx.stroke()

  ctx.restore()
}

Button.prototype.contains = function(point) {
  return !(
    this.pos.x > point.x ||
    this.pos.x + this.width < point.x ||
    this.pos.y > point.y ||
    this.pos.y + this.height < point.y
  )
}

// Button.extend = extendable

Button.STATE = {
  NORMAL: 'normal',
  DOWN: 'down'
}
