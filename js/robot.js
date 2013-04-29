var robot = {

  pos: { x:1, y:1 },
  dir: { x:1, y:0 },
  queue: [],
  freq: 400,
  blocked: false,

  moveForward: function() {
    var newPos = vector2.add(this.pos, this.dir)
    if (grid[newPos.y][newPos.x] === 1) {
      this.blocked = true
    } else {
      this.pos = newPos
    }
    return this
  },

  moveBackward: function() {
    var newPos = vector2.subtract(this.pos, this.dir)
    if (grid[newPos.y][newPos.x] === 1) {
      this.blocked = true
    } else {
      this.pos = newPos
    }
    return this
  },

  turnLeft: function() {
    var x = this.dir.x
    var y = this.dir.y
    this.dir.x = y
    this.dir.y = -x
    return this
  },

  turnRight: function() {
    var x = this.dir.x
    var y = this.dir.y
    this.dir.x = -y
    this.dir.y = x
    return this
  },

  turnAround: function() {
    this.dir.x *= -1
    this.dir.y *= -1
    return this
  },

  pickup: function() {
    if (vector2.equal(ball.pos, vector2.add(this.pos, this.dir))) {
      this.ball = ball
    }
    return this
  },

  release: function() {
    this.ball = null
    return this
  },

  moveBall: function() {
    if (this.ball) {
      this.ball.pos = vector2.add(this.pos, this.dir)
    }
  },

  enqueue: function(fname) {
    if (typeof this[fname] == 'function')
      this.queue.push(fname)
  },

  start: function() {
    this.step()
  },

  stop: function() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  },

  step: function() {
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
    this.draw()
    ball.draw()
    this.timeout = setTimeout(this.step.bind(this), this.freq)
  },

  draw: function() {
    ctx.clearRect(0,0,width,height)

    isoCtx(ctx, function() {

      ctx.save()
      ctx.translate(
        this.pos.x * SCALE + SCALE / 2,
        this.pos.y * SCALE + SCALE / 2
      )
      ctx.rotate(Math.atan2(this.dir.y, this.dir.x))
      ctx.fillStyle = this.blocked ? '#ff0000' : '#448844'
      ctx.fillRect(
        SCALE * -0.3,
        SCALE * -0.3,
        SCALE * 0.6,
        SCALE * 0.6
      )
      ctx.strokeRect(
        SCALE * -0.3,
        SCALE * -0.3,
        SCALE * 0.6,
        SCALE * 0.6
      )
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(SCALE * (this.ball?1:0.3), 0)
      ctx.stroke()
      ctx.restore()

    }.bind(this))
    return this
  }

}
