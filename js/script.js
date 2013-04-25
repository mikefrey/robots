

var canvas = document.getElementById('game')
var ctx = canvas.getContext('2d')
var width = canvas.width
var height = canvas.height
var SCALE = 64

function setupBackground() {

  var bgcanvas = document.getElementById('bg')
  var bgctx = bgcanvas.getContext('2d')

  for (var i = 0; i < width; i+=SCALE) {
    bgctx.beginPath()
    bgctx.moveTo(i+0.5, 0)
    bgctx.lineTo(i+0.5, height)
    bgctx.stroke()
  }

  for (var i = 0; i < height; i+=SCALE) {
    bgctx.beginPath()
    bgctx.moveTo(0, i+0.5)
    bgctx.lineTo(width, i+0.5)
    bgctx.stroke()
  }

}




var robot = {

  pos: { x:1, y:1 },
  dir: { x:1, y:0 },  // u, d, l, r

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

  draw: function() {
    ctx.clearRect(0,0,width,height)
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
btnLeft.addEventListener('click', function () { robot.turnLeft().draw() }, false)

var btnRight = document.getElementById('right')
btnRight.addEventListener('click', function() { robot.turnRight().draw() }, false)

var btnForward = document.getElementById('forward')
btnForward.addEventListener('click', function() { robot.moveForward().draw() }, false)


setupBackground()

robot.draw()

