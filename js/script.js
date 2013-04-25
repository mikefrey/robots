

var canvas = document.getElementById('game')
var ctx = canvas.getContext('2d')
var width = canvas.width
var height = canvas.height
var SCALE = 64
var GRIDSIZE = 12

function setupBackground() {

  var bgcanvas = document.getElementById('bg')
  var bgctx = bgcanvas.getContext('2d')

  isoCtx(bgctx, function() {

    for (var i = 0; i < GRIDSIZE+1; i+=1) {
      bgctx.beginPath()
      bgctx.moveTo(i*SCALE+0.5, 0)
      bgctx.lineTo(i*SCALE+0.5, SCALE*GRIDSIZE)
      bgctx.stroke()
    }

    for (var i = 0; i < GRIDSIZE+1; i+=1) {
      bgctx.beginPath()
      bgctx.moveTo(0, i*SCALE+0.5)
      bgctx.lineTo(SCALE*GRIDSIZE, i*SCALE+0.5)
      bgctx.stroke()
    }

  })

}


function isoCtx(ctx, fn) {
  ctx.save()
  ctx.translate(width/2, 0)
  ctx.scale(1, 0.5)
  ctx.rotate(45 * Math.PI / 180)
  fn()
  ctx.restore()
}




var robot = {

  pos: { x:1, y:1 },
  dir: { x:1, y:0 },
  queue: [],
  freq: 400,

  moveForward: function() {
    this.pos = vector.add(this.pos, this.dir)
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

    return this
  },

  release: function() {

    return this
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
    var action = this.queue.shift()
    this[action]().draw()
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
      ctx.strokeRect(
        SCALE * -0.3,
        SCALE * -0.3,
        SCALE * 0.6,
        SCALE * 0.6
      )
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(SCALE * 0.3, 0)
      ctx.stroke()
      ctx.restore()

    }.bind(this))
    return this
  }

}

var grid = [



]


var d2r = function(a) {
  return a * (Math.PI/180)
}
var r2d = function(a) {
  return a / (Math.PI/180)
}

var vector = {

  add: function() {
    var args = Array.prototype.slice.call(arguments, 0)
    var v = { x:0, y:0 }
    for (var i = 0; i < args.length; i++) {
      v.x += args[i].x
      v.y += args[i].y
    }
    return v
  }

}





var btnLeft = document.getElementById('left')
btnLeft.addEventListener('click', robot.enqueue.bind(robot, 'turnLeft'), false)

var btnRight = document.getElementById('right')
btnRight.addEventListener('click', robot.enqueue.bind(robot, 'turnRight'), false)

var btnForward = document.getElementById('forward')
btnForward.addEventListener('click', robot.enqueue.bind(robot, 'moveForward'), false)

var btnStart = document.getElementById('start')
btnStart.addEventListener('click', robot.start.bind(robot), false)


setupBackground()

robot.draw()

