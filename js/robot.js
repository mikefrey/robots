var vector2 = require('./vector2')
var pubsub = require('./lib/pubsub')

var Ball = require('./ball')

var Robot = module.exports = function(pos) {
  this.game = require('./game').game
  this.pos = pos
  this.dir = { x:1, y:0 }
  this.queue = []
  this.freq = 400
  this.blocked = false

  pubsub.on('commandButtonPressed', this.enqueue.bind(this))
}

Robot.prototype.moveForward = function() {
  var grid = this.game.level.grid
  var newPos = vector2.add(this.pos, this.dir)
  if (!grid[newPos.y] || !grid[newPos.y][newPos.x]) {
    this.block()
  } else {
    this.pos = newPos
  }
  return this
}

Robot.prototype.moveBackward = function() {
  var grid = this.game.level.grid
  var newPos = vector2.subtract(this.pos, this.dir)
  if (!grid[newPos.y] || !grid[newPos.y][newPos.x]) {
    this.block()
  } else {
    this.pos = newPos
  }
  return this
}

Robot.prototype.turnLeft = function() {
  var x = this.dir.x
  var y = this.dir.y
  this.dir.x = y
  this.dir.y = -x
  return this
}

Robot.prototype.turnRight = function() {
  var x = this.dir.x
  var y = this.dir.y
  this.dir.x = -y
  this.dir.y = x
  return this
}

Robot.prototype.turnAround = function() {
  this.dir.x *= -1
  this.dir.y *= -1
  return this
}

Robot.prototype.pickup = function() {
  var target = this.game.entityAt(vector2.add(this.pos, this.dir), Ball)
  if (target && target.pickedUp()) {
    this.ball = target
  } else {
    this.block()
  }
  return this
}

Robot.prototype.release = function() {
  if (this.ball && this.ball.dropped()) {
    this.ball = null
  } else {
    this.block()
  }
  return this
}

Robot.prototype.moveBall = function() {
  if (this.ball) {
    this.ball.pos = vector2.add(this.pos, this.dir)
  }
}

Robot.prototype.block = function() {
  this.blocked = true
}

Robot.prototype.enqueue = function(fname) {
  if (fname === 'start') return this.start()
  if (typeof this[fname] == 'function')
    this.queue.push(fname)
}

Robot.prototype.start = function() {
  this.step()
}

Robot.prototype.stop = function() {
  if (this.timeout) {
    clearTimeout(this.timeout)
  }
}

Robot.prototype.step = function() {
  if (this.queue.length == 0) {
    return
  }
  if (this.blocked) {
    this.queue = []
    return
  }

  var action = this.queue.shift()
  this[action]()
  this.moveBall()
  this.timeout = setTimeout(this.step.bind(this), this.freq)
}

Robot.prototype.update = function() {
}

Robot.prototype.draw = function(ctx) {
  var scale = this.game.scale

  this.game.isoCtx(ctx, function() {

    ctx.save()
    ctx.translate(
      this.pos.x * scale + scale / 2,
      this.pos.y * scale + scale / 2
    )
    ctx.rotate(Math.atan2(this.dir.y, this.dir.x))
    ctx.fillStyle = this.blocked ? '#ff0000' : '#448844'

    ctx.beginPath()
    ctx.rect(
      scale * -0.3,
      scale * -0.3,
      scale * 0.6,
      scale * 0.6
    )
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(scale * (this.ball?1:0.3), 0)
    ctx.stroke()
    ctx.restore()

  }.bind(this))
  return this
}
