var pubsub = require('./lib/pubsub')

var Button = module.exports = function(btn) {
  this.game = require('./game').game
  // copy over the btn properties
  for (var k in btn) {
    this[k] = btn[k]
  }
  this.state = Button.STATE.NORMAL
}

Button.prototype.tapped = function() {
  console.log('TAPPED', this.command)
  pubsub.trigger('commandButtonPressed', [this.command])
}

Button.prototype.update = function() {
  this.state = Button.STATE.NORMAL
  var start = this.game.input.start
  var current = this.game.input.current
  var previous = this.game.input.previous

  if (current) {
    if (this.contains(current) && this.contains(start)) {
      this.state = Button.STATE.DOWN
    }
  }
  else if (previous && this.contains(previous.end) && this.contains(previous.start)) {
    this.tapped()
    this.game.input.previous = null
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

Button.STATE = {
  NORMAL: 'normal',
  DOWN: 'down'
}
