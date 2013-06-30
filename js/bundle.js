;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
window.stats = new Stats();
stats.setMode(1); // 0: fps, 1: ms
stats.domElement.style.position = 'fixed';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

var Game = require('./game')
var Level = require('./level')

var game = new Game({
  scale: 64,
  width: 1024,
  height: 768,
  gridSize: 10,
  topMargin: 150,
  canvas: 'game',
  bgcanvas: 'bg'
})

game.loadLevel(Level)

game.start()

// game.level.tiles.onload = function() {
//   game.draw()
// }

},{"./game":2,"./level":3}],2:[function(require,module,exports){
var vector2 = require('./vector2')
// var Level = require('./level')
var Input = require('./input')
var Ball = require('./ball')
var Switch = require('./switch')
var Robot = require('./robot')
var Exit = require('./exit')

// degrees to radians
function d2r(a) {
  return a * (Math.PI/180)
}

// radians to degress
function r2d(a) {
  return a / (Math.PI/180)
}


var Game = module.exports = function(opts) {
  Game.game = this

  this.scale = opts.scale
  var width = this.width = opts.width
  var height = this.height = opts.height
  this.gridSize = opts.gridSize
  this.topMargin = opts.topMargin

  // setup the canvases
  this.ctx = this.initCanvas(opts.canvas, width, height)
  this.bgctx = this.initCanvas(opts.bgcanvas, width, height)

  this.input = new Input(opts.canvas)
}

Game.prototype.loadLevel = function(Level) {
  var level = this.level = new Level(this)
  this.loadEntities()
}

// starts the game loop
Game.prototype.start = function() {
  this.loop()
}

// suspends the game loop
Game.prototype.stop = function() {
  cancelAnimationFrame(this.rAFID)
}
Game.prototype.pause = Game.prototype.stop

// the game loop
Game.prototype.loop = function() {
  this.rAFID = requestAnimationFrame(this.loop.bind(this), this.ctx.canvas)

  stats.begin();

  this.update()
  this.draw()

  stats.end();
}

// update all the things
Game.prototype.update = function() {
  for (var i = 0; i < this.entities.length; i+=1) {
    this.entities[i].update()
  }
}

// draw all the things
Game.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.width, this.height)
  this.bgctx.clearRect(0, 0, this.width, this.height)
  // draw the level
  this.level.draw(this.bgctx)
  // draw each entity
  var ent, i
  for (i = 0; i < this.entities.length; i+=1) {
    ent = this.entities[i]
    if (ent instanceof Switch) ent.draw(this.ctx)
  }
  for (i = 0; i < this.entities.length; i+=1) {
    ent = this.entities[i]
    if (ent instanceof Robot) ent.draw(this.ctx)
  }
  for (i = 0; i < this.entities.length; i+=1) {
    ent = this.entities[i]
    if (ent instanceof Ball) ent.draw(this.ctx)
  }
}

// get the entity at the given position
Game.prototype.entityAt = function(pos, type) {
  var entities = this.entities
  for (var i = 0; i < entities.length; i+=1) {
    var ent = entities[i]
    if (vector2.equal(ent.pos, pos) && ent instanceof type) {
      return ent
    }
  }
  return null
}

// load the entities from the level
Game.prototype.loadEntities = function() {
  var ents = this.entities = []
  var map = this.level.entityMap
  for (var y = 0; y < map.length; y+=1) {
    for (var x = 0; x < map[y].length; x+=1) {
      var Ent = map[y][x]
      if (Ent) {
        // create the entity
        var ent = new Ent({x:x,y:y})
        // check to see if it's the robot
        if (ent instanceof Robot) this.robot = ent
        // add it to the entity collection
        ents.push(ent)
      }
    }
  }
}

var theta = d2r(45)
var csTheta = Math.cos(theta)
var snTheta = Math.sin(theta)
var thetaInv = d2r(315)
var csThetaInv = Math.cos(thetaInv)
var snThetaInv = Math.sin(thetaInv)

// translate screen to world
Game.prototype.s2w = function(pos) {
  // rotate
  var x = pos.x
  var y = pos.y
  pos.x = x * csTheta - y * snTheta
  pos.y = x * snTheta + y * csTheta
  // scale
  pos.y *= 0.5
  // translate
  pos.x += this.width/2
  pos.y += this.topMargin
  return pos
}

// translate world to screen
Game.prototype.w2s = function(pos) {
  // translate
  pos.x -= this.width/2
  pos.y -= this.topMargin
  // scale
  pos.y /= 0.5
  // rotate
  var y = pos.y
  var x = pos.x
  pos.x = x * csThetaInv - y * snThetaInv
  pos.y = x * snThetaInv + y * csThetaInv
  return pos
}

// setup canvase elements to the correct size
Game.prototype.initCanvas = function(id, width, height) {
  var canvas = document.getElementById(id)
  canvas.width = width
  canvas.height = height
  return canvas.getContext('2d')
}

// transform the context into isometric
Game.prototype.isoCtx = function(ctx, fn) {
  ctx.save()

  // move the game board down a bit
  ctx.translate(0, this.topMargin)
  ctx.translate(this.width/2, 0)
  ctx.scale(1, 0.5)
  ctx.rotate(45 * Math.PI / 180)
  // ctx.transform(0.707, 0.409, -0.707, 0.409, 0, 0)
  fn()
  ctx.restore()
}

Game.prototype.d2r = d2r

Game.prototype.r2d = r2d

},{"./input":4,"./vector2":5,"./ball":6,"./switch":7,"./robot":8,"./exit":9}],3:[function(require,module,exports){

var Ball = require('./ball')
var Switch = require('./switch')
var Robot = require('./robot')
var Exit = require('./exit')
var TileSet = require('./tileset')

var _ = 0
var B = Ball
var S = Switch
var R = Robot
var E = Exit

var Level = module.exports = function(game) {
  this.game = require('./game').game
  this.tiles = new TileSet('images/isotiles.png', 64, 64, 4, 16)

  var p1 = this.game.s2w({x:0, y:0})
  var p2 = this.game.s2w({x:0, y:this.game.scale})
  this.isoTileWidth = Math.abs(p2.x - p1.x)*2
}

Level.prototype.grid = [
  [6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6],
  [_,_,_,6,6,6,6,6,6,6],
  [6,6,_,6,6,6,6,6,6,6],
  [6,6,_,6,6,6,6,6,6,6],
  [6,6,_,6,6,6,6,6,6,6],
  [4,4,_,4,4,4,4,4,4,4],
  [_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_]
]

Level.prototype.entityMap = [
  [_,_,_,_,_,_,_,_,_,_],
  [_,R,_,B,_,_,_,S,_,_],
  [_,_,_,_,_,_,_,S,_,_],
  [_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,B,_,_,_,_,_],
  [_,_,_,_,_,_,_,E,_,_],
  [_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_]
]


Level.prototype.draw = function(ctx) {
  var scale = this.game.scale
  var grid = this.grid
  var tiles = this.tiles

  for (var y = 0; y < grid.length; y+=1) {
    for (var x = 0; x < grid[y].length; x+=1) {
      var pos = this.game.s2w({x:x*scale, y:y*scale})
      tiles.draw(ctx, grid[y][x], pos.x, pos.y, this.isoTileWidth)

      // ctx.fillStyle = '#ff0000'
      // ctx.strokeStyle = '#ffffff'
      // ctx.rect(pos.x-1.5, pos.y-1.5, 3, 3)
      // ctx.fill()
      // ctx.stroke()
    }
  }


  this.game.isoCtx(ctx, function() {

    // // draw the grid tiles
    // for (var y = 0; y < grid.length; y+=1) {
    //   for (var x = 0; x < grid[y].length; x+=1) {
    //     // fill the tile
    //     if (grid[y][x]) {
    //       ctx.fillStyle = 'rgba(0,0,0,0.15)'
    //       ctx.fillRect(x*scale + scale*0.1, y*scale + scale*0.1, scale*0.8, scale*0.8)
    //     }
    //   }
    // }

    // // draw the grid lines
    // ctx.strokeStyle = '#888888'
    // for (var y = 0; y < grid.length; y+=1) {
    //   for (var x = 0; x < grid[y].length; x+=1) {
    //     if (grid[y][x]) {
    //       ctx.beginPath()
    //       ctx.rect(x*scale+0.5, y*scale+0.5, scale, scale)
    //       ctx.stroke()
    //     }
    //   }
    // }

  })



}

},{"./ball":6,"./switch":7,"./robot":8,"./exit":9,"./tileset":10,"./game":2}],4:[function(require,module,exports){
var Input = module.exports = function(id) {
  var el = document.getElementById(id)
  el.addEventListener('touchstart', this.touchStart, false)
  el.addEventListener('touchmove', this.touchMove, false)
  el.addEventListener('touchend', this.touchEnd, false)
}


Input.prototype.touchStart = function(ev) {
  this.start = ev.touches[0]
  this.touchMove(ev)
  // this.previous = this.current
  // this.current = ev.touches[0]
  // this.current.x = this.current.screenX
  // this.current.y = this.current.screenY
}

Input.prototype.touchMove = function(ev) {
  this.previous = this.current
  this.current = ev.touches[0]
  this.current.x = this.current.screenX
  this.current.y = this.current.screenY
}

Input.prototype.touchEnd = function(ev) {
  this.previous = this.current
  this.current = null
  this.start = null
}

},{}],5:[function(require,module,exports){
module.exports = {

  equal: function(a, b) {
    return a.x === b.x && a.y === b.y
  },

  add: function() {
    var args = Array.prototype.slice.call(arguments, 0)
    var v = { x:0, y:0 }
    for (var i = 0; i < args.length; i++) {
      v.x += args[i].x
      v.y += args[i].y
    }
    return v
  },

  subtract: function(v) {
    var args = Array.prototype.slice.call(arguments, 1)
    v = { x:v.x, y:v.y }
    for (var i = 0; i < args.length; i++) {
      v.x -= args[i].x
      v.y -= args[i].y
    }
    return v
  }

}

},{}],10:[function(require,module,exports){
var TileSet = module.exports = function(src, w, h, ox, oy) {
  this.width = w
  this.height = h
  this.offsetX = ox
  this.offsetY = oy
  this.isLoaded = false
  this.load(src)
}

TileSet.prototype.load = function(src) {
  var img = this.img = new Image()
  img.onload = function() {
    this.isLoaded = true
    if (this.onload) this.onload()
  }.bind(this)
  img.src = src
}

TileSet.prototype.draw = function(ctx, t, x, y, w) {
  var sx = t * this.width
  var sy = 0
  var sw = this.width
  var sh = this.height

  // the scaler is the width of the destination tile divided
  // by the "true" width of the tile in the image
  var scaler = w / (this.width - this.offsetX*2)

  var dw = this.width * scaler
  var dh = this.height * scaler
  var dx = x - dw*0.5
  var dy = y - this.offsetY * scaler

  ctx.drawImage(this.img, sx, sy, sw, sh, dx, dy, dw, dh)
}



},{}],7:[function(require,module,exports){

var Switch = module.exports = function(pos) {
  this.game = require('./game').game
  this.pos = pos
  this.state = Switch.STATE.OFF
}

Switch.prototype.turnOn = function(ent) {
  if (this.state === Switch.STATE.OFF) {
    this.state = Switch.STATE.ON
    return true
  }
  return false
}

Switch.prototype.turnOff = function(ent) {
  if (this.state === Switch.STATE.ON) {
    this.state = Switch.STATE.OFF
    return true
  }
  return false
}

Switch.prototype.update = function() {
}

Switch.prototype.draw = function(ctx) {
  var d2r = this.game.d2r
  var scale = this.game.scale
  this.game.isoCtx(ctx, function() {
    ctx.translate(
      this.pos.x * scale + scale / 2,
      this.pos.y * scale + scale / 2
    )

    var radius = scale*0.3

    // fill the square
    ctx.fillStyle = this.state === Switch.STATE.ON ? '#00FF00' : '#FF0000'
    ctx.beginPath()
    ctx.rect(-scale/2, -scale/2, scale, scale)
    ctx.fill()
    ctx.stroke()

    // draw the reciever
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(0, 0, radius, d2r(0), d2r(360))
    ctx.fill()
    ctx.stroke()
  }.bind(this))
}

Switch.STATE = {
  ON : 1,
  OFF : 0
}

},{"./game":2}],6:[function(require,module,exports){

var Ball = module.exports = function(pos) {
  this.game = require('./game').game
  this.pos = pos
}

Ball.prototype.dropped = function() {
  var target = this.game.entityAt(this.pos, Switch)
  if (target) {
    return target.turnOn(this)
  }
  return true
}

Ball.prototype.pickedUp = function() {
  var target = this.game.entityAt(this.pos, Switch)
  if (target) {
    return target.turnOff(this)
  }
  return true
}

Ball.prototype.update = function() {

}

Ball.prototype.draw = function(ctx) {
  var d2r = this.game.d2r
  var scale = this.game.scale
  this.game.isoCtx(ctx, function() {
    ctx.translate(
      this.pos.x * scale + scale / 2,
      this.pos.y * scale + scale / 2
    )

    var radius = scale*0.3

    ctx.fillStyle = '#7777FF'
    ctx.beginPath()
    ctx.arc(0, 0, radius, d2r(0), d2r(360))
    ctx.fill()
    ctx.stroke()
  }.bind(this))
}

},{"./game":2}],8:[function(require,module,exports){
var vector2 = require('./vector2')

var Robot = module.exports = function(pos) {
  this.game = require('./game').game
  this.pos = pos
  this.dir = { x:1, y:0 }
  this.queue = []
  this.freq = 400
  this.blocked = false
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

},{"./vector2":5,"./game":2}],9:[function(require,module,exports){

var Exit = module.exports = function(pos) {
  this.game = require('./game').game
  this.pos = pos
}

Exit.prototype.update = function() {
}

Exit.prototype.draw = function(ctx) {
  var scale = this.game.scale
  this.game.isoCtx(ctx, function() {
    ctx.translate(
      this.pos.x * scale + scale / 2,
      this.pos.y * scale + scale / 2
    )

    var radius = scale*0.3

    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.rect(
      scale * -0.3,
      scale * -0.3,
      scale * 0.6,
      scale * 0.6
    )
    ctx.fill()
    ctx.stroke()
  }.bind(this))
}

},{"./game":2}]},{},[1])
;