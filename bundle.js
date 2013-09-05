;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
window.stats = new Stats();
stats.setMode(1); // 0: fps, 1: ms
stats.domElement.style.position = 'fixed';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

var Game = require('./game')
var Level = require('./level')

var game = window.game = new Game({
  scale: 64,
  width: 1024,
  height: 768,
  gridSize: 10,
  topMargin: 150,
  canvas: 'game'
})

game.loadLevel(Level)

game.start()

// game.level.tiles.onload = function() {
//   game.draw()
// }

},{"./game":2,"./level":3}],3:[function(require,module,exports){

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
  [_,_,_,6,6,6,9,6,6,6],
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
  [_,_,_,_,B,_,_,_,_,_],
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

},{"./ball":4,"./exit":7,"./game":2,"./robot":6,"./switch":5,"./tileset":8}],2:[function(require,module,exports){
var vector2 = require('./vector2')
// var Level = require('./level')
var Input = require('./input')
var ButtonManager = require('./buttonManager')
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
  // this.bgctx = this.initCanvas(opts.bgcanvas, width, height)

  this.input = new Input(opts.canvas)
  this.buttonManager = new ButtonManager()
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
  this.buttonManager.update()
  for (var i = 0; i < this.entities.length; i+=1) {
    this.entities[i].update()
  }
}

// draw all the things
Game.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.width, this.height)
  // this.bgctx.clearRect(0, 0, this.width, this.height)
  // draw the level
  this.level.draw(this.ctx)
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

  // draw any UI last
  this.buttonManager.draw(this.ctx)
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

},{"./ball":4,"./buttonManager":11,"./exit":7,"./input":10,"./robot":6,"./switch":5,"./vector2":9}],4:[function(require,module,exports){
var Switch = require('./switch')

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

},{"./game":2,"./switch":5}],6:[function(require,module,exports){
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

},{"./ball":4,"./game":2,"./lib/pubsub":12,"./vector2":9}],10:[function(require,module,exports){
var Input = module.exports = function(id) {
  var el = document.getElementById(id)
  el.addEventListener('touchstart', this.touchStart.bind(this), false)
  el.addEventListener('touchmove', this.touchMove.bind(this), false)
  el.addEventListener('touchend', this.touchEnd.bind(this), false)
}


Input.prototype.touchStart = function(ev) {
  this.start = ev.touches[0]
  this.touchMove(ev)
}

Input.prototype.touchMove = function(ev) {
  this.previous = this.current
  this.current = ev.touches[0]
  this.current.x = this.current.clientX
  this.current.y = this.current.clientY
}

Input.prototype.touchEnd = function(ev) {
  this.previous = {
    start: this.start,
    end: this.current
  }
  this.current = null
  this.start = null
}

},{}],7:[function(require,module,exports){

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

},{"./game":2}],8:[function(require,module,exports){
var pubsub = require('./lib/pubsub')
var Texture = require('./texture')

var TileSet = module.exports = function(src, w, h, ox, oy) {
  this.width = w
  this.height = h
  this.offsetX = ox
  this.offsetY = oy

  this.texture = new Texture(src)
  this.echo('load', this.texture)
}

pubsub.extend(TileSet.prototype)

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

  ctx.drawImage(this.texture.img, sx, sy, sw, sh, dx, dy, dw, dh)
}



},{"./lib/pubsub":12,"./texture":13}],5:[function(require,module,exports){

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

},{"./game":2}],11:[function(require,module,exports){
var buttonDefs = require('./buttons')
var Button = require('./button')
var Sprite = require('./sprite')

var ButtonManager = module.exports = function() {
  this.sprites = {}
  for (var key in buttonDefs.sprites) {
    var spr = buttonDefs.sprites[key]
    var sprite = new Sprite(spr)
    this.sprites[key] = sprite
  }

  this.buttons = []
  for (var key in buttonDefs.buttons) {
    var btn = buttonDefs.buttons[key]
    btn.sprite = this.sprites[btn.sprite]
    var button = new Button(btn)
    this.buttons.push(button)
  }
}

ButtonManager.prototype.update = function() {
  for (var i = 0; i < this.buttons.length; i+=1) {
    this.buttons[i].update()
  }
}

ButtonManager.prototype.draw = function(ctx) {
  for (var i = 0; i < this.buttons.length; i+=1) {
    this.buttons[i].draw(ctx)
  }
}

},{"./button":15,"./buttons":14,"./sprite":16}],9:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
module.exports = {

  sprites: {
    buttons: {
      texture: 'images/buttons.png',
      width: 80,
      height: 80
    }
  },

  buttons: {

    forward: {
      pos: { x:0, y:0 },
      width:80,
      height:80,
      sprite: 'buttons',
      frameOff:0,
      frameOn:1,
      command: 'moveForward'
    },

    backward: {
      pos: { x:80, y:0 },
      width:80,
      height:80,
      sprite: 'buttons',
      frameOff:2,
      frameOn:3,
      command: 'moveBackward'
    },

    left: {
      pos: { x:170, y:0 },
      width:80,
      height:80,
      sprite: 'buttons',
      frameOff:4,
      frameOn:5,
      command: 'turnLeft'
    },

    right: {
      pos: { x:250, y:0 },
      width:80,
      height:80,
      sprite: 'buttons',
      frameOff:6,
      frameOn:7,
      command: 'turnRight'
    },

    pickup: {
      pos: { x:340, y:0 },
      width:80,
      height:80,
      sprite: 'buttons',
      frameOff:8,
      frameOn:9,
      command: 'pickup'
    },

    release: {
      pos: { x:420, y:0 },
      width:80,
      height:80,
      sprite: 'buttons',
      frameOff:10,
      frameOn:11,
      command: 'release'
    },

    start: {
      pos: { x:540, y:0 },
      width:80,
      height:80,
      sprite: 'buttons',
      frameOff:12,
      frameOn:13,
      command: 'start'
    },

    turnAround: {
      pos: { x:660, y:0 },
      width:80,
      height:80,
      sprite: 'buttons',
      frameOff:6,
      frameOn:7,
      command: 'turnAround'
    },

    restart: {
      pos: { x:780, y:0 },
      width:40,
      height:40,
      sprite: 'buttons',
      frameOff:6,
      frameOn:7,
      command: 'restart'
    }

  }
}

},{}],13:[function(require,module,exports){
var pubsub = require('./lib/pubsub')

var cache = {}

var Texture = module.exports = function(src) {
  if (cache[src]) return cache[src]

  this.isLoaded = false
  this.load(src)
  cache[src] = this
}

var api = Texture.prototype
pubsub.extend(api)

api.load = function(src) {
  var img = this.img = new Image()
  img.onload = function() {
    this.isLoaded = true
    this.width = img.width
    this.height = img.height
    this.trigger('load')
  }.bind(this)
  img.src = src
}


},{"./lib/pubsub":12}],16:[function(require,module,exports){
var pubsub = require('./lib/pubsub')
var Texture = require('./texture')

var Sprite = module.exports = function(options) {
  this.width = options.width
  this.height = options.height
  this.frames = []
  this.texture = new Texture(options.texture)
  this.texture.on('load', this.calculateFrames.bind(this))
}

var api = Sprite.prototype
pubsub.extend(api)

api.calculateFrames = function() {
  console.log('LOADED SPRITE', this.texture.img.src)
  var x = (this.texture.width / this.width) | 0
  var y = (this.texture.height / this.height) | 0

  for (var iy = 0; iy < y; iy++) {
    for (var ix = 0; ix < x; ix++) {
      this.frames.push({
        x: ix * this.width,
        y: iy * this.height,
        x2: ix * this.width + this.width,
        y2: iy * this.height + this.height,
        w: this.width,
        h: this.height
      })
    }
  }
  this.trigger('load')
}

api.draw = function(ctx, frame, rect) {
  var f = this.frames[frame]
  if (!f) return
  ctx.drawImage(this.texture.img,
    f.x, f.y, f.w, f.h,
    rect.x, rect.y, rect.w, rect.h)
}




},{"./lib/pubsub":12,"./texture":13}],12:[function(require,module,exports){
var extend = require('./extend')

var Events = {}

Events.trigger = function(/* String */ topic, /* Array? */ args) {
  // summary:
  //    Publish some data on a named topic.
  // topic: String
  //    The channel to publish on
  // args: Array?
  //    The data to publish. Each array item is converted into an ordered
  //    arguments on the subscribed functions.
  //
  // example:
  //    Publish stuff on '/some/topic'. Anything subscribed will be called
  //    with a function signature like: function(a,b,c) { ... }
  //
  //    trigger("/some/topic", ["a","b","c"])
  if (!this._events) return

  var subs = this._events[topic],
    len = subs ? subs.length : 0

  //can change loop or reverse array if the order matters
  while (len--) {
    subs[len].apply(Events, args || [])
  }
}

Events.on = function(/* String */ topic, /* Function */ callback) {
  // summary:
  //    Register a callback on a named topic.
  // topic: String
  //    The channel to subscribe to
  // callback: Function
  //    The handler event. Anytime something is trigger'ed on a
  //    subscribed channel, the callback will be called with the
  //    published array as ordered arguments.
  //
  // returns: Array
  //    A handle which can be used to unsubscribe this particular subscription.
  //
  // example:
  //    on("/some/topic", function(a, b, c) { /* handle data */ })

  this._events || (this._events = {})

  if (!this._events[topic]) {
    this._events[topic] = []
  }
  this._events[topic].push(callback)
  return [topic, callback] // Array
}

Events.off = function(/* Array or String */ handle) {
  // summary:
  //    Disconnect a subscribed function for a topic.
  // handle: Array or String
  //    The return value from an `on` call.
  // example:
  //    var handle = on("/some/topic", function() {})
  //    off(handle)
  if (!this._events) return

  var subs = this._events[typeof handle === 'string' ? handle : handle[0]]
  var callback = typeof handle === 'string' ? handle[1] : false
  var len = subs ? subs.length : 0

  while (len--) {
    if (subs[len] === callback || !callback) {
      subs.splice(len, 1)
    }
  }
}

Events.echo = function(/* String */ topic, /* Object */ emitter) {
  emitter.on(topic, function() {
    this.trigger(topic, arguments)
  }.bind(this))
}


var pubsub = module.exports = {}

pubsub.Events = Events
pubsub.extend = function(obj) {
  extend(obj, Events)
}
pubsub.extend(pubsub)

},{"./extend":17}],15:[function(require,module,exports){
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

  // ctx.beginPath()
  // ctx.lineStyle = '#000000'
  // ctx.lineWidth = 2
  // ctx.rect(0, 0, this.width, this.height)
  // ctx.stroke()

  var rect = { x:0, y:0, w:this.width, h:this.height }
  this.sprite.draw(ctx, this.frameOff, rect)

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

},{"./game":2,"./lib/pubsub":12}],17:[function(require,module,exports){
// Extend a given object with all the properties in passed-in object(s).
var extend = module.exports = function(obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function(source) {
    if (source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL3NjcmlwdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGV2ZWwuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2dhbWUuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2JhbGwuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL3JvYm90LmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9pbnB1dC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvZXhpdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGlsZXNldC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvc3dpdGNoLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9idXR0b25NYW5hZ2VyLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy92ZWN0b3IyLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9idXR0b25zLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy90ZXh0dXJlLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9zcHJpdGUuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2xpYi9wdWJzdWIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2J1dHRvbi5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2V4dGVuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuc3RhdHMgPSBuZXcgU3RhdHMoKTtcbnN0YXRzLnNldE1vZGUoMSk7IC8vIDA6IGZwcywgMTogbXNcbnN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5yaWdodCA9ICcwcHgnO1xuc3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHN0YXRzLmRvbUVsZW1lbnQgKTtcblxudmFyIEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKVxudmFyIExldmVsID0gcmVxdWlyZSgnLi9sZXZlbCcpXG5cbnZhciBnYW1lID0gd2luZG93LmdhbWUgPSBuZXcgR2FtZSh7XG4gIHNjYWxlOiA2NCxcbiAgd2lkdGg6IDEwMjQsXG4gIGhlaWdodDogNzY4LFxuICBncmlkU2l6ZTogMTAsXG4gIHRvcE1hcmdpbjogMTUwLFxuICBjYW52YXM6ICdnYW1lJ1xufSlcblxuZ2FtZS5sb2FkTGV2ZWwoTGV2ZWwpXG5cbmdhbWUuc3RhcnQoKVxuXG4vLyBnYW1lLmxldmVsLnRpbGVzLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gICBnYW1lLmRyYXcoKVxuLy8gfVxuIiwiXG52YXIgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbCcpXG52YXIgU3dpdGNoID0gcmVxdWlyZSgnLi9zd2l0Y2gnKVxudmFyIFJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG52YXIgRXhpdCA9IHJlcXVpcmUoJy4vZXhpdCcpXG52YXIgVGlsZVNldCA9IHJlcXVpcmUoJy4vdGlsZXNldCcpXG5cbnZhciBfID0gMFxudmFyIEIgPSBCYWxsXG52YXIgUyA9IFN3aXRjaFxudmFyIFIgPSBSb2JvdFxudmFyIEUgPSBFeGl0XG5cbnZhciBMZXZlbCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZ2FtZSkge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIHRoaXMudGlsZXMgPSBuZXcgVGlsZVNldCgnaW1hZ2VzL2lzb3RpbGVzLnBuZycsIDY0LCA2NCwgNCwgMTYpXG5cbiAgdmFyIHAxID0gdGhpcy5nYW1lLnMydyh7eDowLCB5OjB9KVxuICB2YXIgcDIgPSB0aGlzLmdhbWUuczJ3KHt4OjAsIHk6dGhpcy5nYW1lLnNjYWxlfSlcbiAgdGhpcy5pc29UaWxlV2lkdGggPSBNYXRoLmFicyhwMi54IC0gcDEueCkqMlxufVxuXG5MZXZlbC5wcm90b3R5cGUuZ3JpZCA9IFtcbiAgWzYsNiw2LDYsNiw2LDYsNiw2LDZdLFxuICBbNiw2LDYsNiw2LDYsNiw2LDYsNl0sXG4gIFs2LDYsNiw2LDYsNiw2LDYsNiw2XSxcbiAgW18sXyxfLDYsNiw2LDksNiw2LDZdLFxuICBbNiw2LF8sNiw2LDYsNiw2LDYsNl0sXG4gIFs2LDYsXyw2LDYsNiw2LDYsNiw2XSxcbiAgWzYsNixfLDYsNiw2LDYsNiw2LDZdLFxuICBbNCw0LF8sNCw0LDQsNCw0LDQsNF0sXG4gIFtfLF8sXyxfLF8sXyxfLF8sXyxfXSxcbiAgW18sXyxfLF8sXyxfLF8sXyxfLF9dXG5dXG5cbkxldmVsLnByb3RvdHlwZS5lbnRpdHlNYXAgPSBbXG4gIFtfLF8sXyxfLF8sXyxfLF8sXyxfXSxcbiAgW18sUixfLEIsXyxfLF8sUyxfLF9dLFxuICBbXyxfLF8sXyxfLF8sXyxTLF8sX10sXG4gIFtfLF8sXyxfLEIsXyxfLF8sXyxfXSxcbiAgW18sXyxfLF8sXyxfLF8sXyxfLF9dLFxuICBbXyxfLF8sXyxfLF8sXyxfLF8sX10sXG4gIFtfLF8sXyxfLEIsXyxfLF8sXyxfXSxcbiAgW18sXyxfLF8sXyxfLF8sRSxfLF9dLFxuICBbXyxfLF8sXyxfLF8sXyxfLF8sX10sXG4gIFtfLF8sXyxfLF8sXyxfLF8sXyxfXVxuXVxuXG5cbkxldmVsLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZFxuICB2YXIgdGlsZXMgPSB0aGlzLnRpbGVzXG5cbiAgZm9yICh2YXIgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSs9MSkge1xuICAgIGZvciAodmFyIHggPSAwOyB4IDwgZ3JpZFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgICAgIHZhciBwb3MgPSB0aGlzLmdhbWUuczJ3KHt4Ongqc2NhbGUsIHk6eSpzY2FsZX0pXG4gICAgICB0aWxlcy5kcmF3KGN0eCwgZ3JpZFt5XVt4XSwgcG9zLngsIHBvcy55LCB0aGlzLmlzb1RpbGVXaWR0aClcblxuICAgICAgLy8gY3R4LmZpbGxTdHlsZSA9ICcjZmYwMDAwJ1xuICAgICAgLy8gY3R4LnN0cm9rZVN0eWxlID0gJyNmZmZmZmYnXG4gICAgICAvLyBjdHgucmVjdChwb3MueC0xLjUsIHBvcy55LTEuNSwgMywgMylcbiAgICAgIC8vIGN0eC5maWxsKClcbiAgICAgIC8vIGN0eC5zdHJva2UoKVxuICAgIH1cbiAgfVxuXG5cbiAgdGhpcy5nYW1lLmlzb0N0eChjdHgsIGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gLy8gZHJhdyB0aGUgZ3JpZCB0aWxlc1xuICAgIC8vIGZvciAodmFyIHkgPSAwOyB5IDwgZ3JpZC5sZW5ndGg7IHkrPTEpIHtcbiAgICAvLyAgIGZvciAodmFyIHggPSAwOyB4IDwgZ3JpZFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgICAvLyAgICAgLy8gZmlsbCB0aGUgdGlsZVxuICAgIC8vICAgICBpZiAoZ3JpZFt5XVt4XSkge1xuICAgIC8vICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwwLjE1KSdcbiAgICAvLyAgICAgICBjdHguZmlsbFJlY3QoeCpzY2FsZSArIHNjYWxlKjAuMSwgeSpzY2FsZSArIHNjYWxlKjAuMSwgc2NhbGUqMC44LCBzY2FsZSowLjgpXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAvLyBkcmF3IHRoZSBncmlkIGxpbmVzXG4gICAgLy8gY3R4LnN0cm9rZVN0eWxlID0gJyM4ODg4ODgnXG4gICAgLy8gZm9yICh2YXIgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSs9MSkge1xuICAgIC8vICAgZm9yICh2YXIgeCA9IDA7IHggPCBncmlkW3ldLmxlbmd0aDsgeCs9MSkge1xuICAgIC8vICAgICBpZiAoZ3JpZFt5XVt4XSkge1xuICAgIC8vICAgICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIC8vICAgICAgIGN0eC5yZWN0KHgqc2NhbGUrMC41LCB5KnNjYWxlKzAuNSwgc2NhbGUsIHNjYWxlKVxuICAgIC8vICAgICAgIGN0eC5zdHJva2UoKVxuICAgIC8vICAgICB9XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gIH0pXG5cblxuXG59XG4iLCJ2YXIgdmVjdG9yMiA9IHJlcXVpcmUoJy4vdmVjdG9yMicpXG4vLyB2YXIgTGV2ZWwgPSByZXF1aXJlKCcuL2xldmVsJylcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKVxudmFyIEJ1dHRvbk1hbmFnZXIgPSByZXF1aXJlKCcuL2J1dHRvbk1hbmFnZXInKVxudmFyIEJhbGwgPSByZXF1aXJlKCcuL2JhbGwnKVxudmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vc3dpdGNoJylcbnZhciBSb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxudmFyIEV4aXQgPSByZXF1aXJlKCcuL2V4aXQnKVxuXG4vLyBkZWdyZWVzIHRvIHJhZGlhbnNcbmZ1bmN0aW9uIGQycihhKSB7XG4gIHJldHVybiBhICogKE1hdGguUEkvMTgwKVxufVxuXG4vLyByYWRpYW5zIHRvIGRlZ3Jlc3NcbmZ1bmN0aW9uIHIyZChhKSB7XG4gIHJldHVybiBhIC8gKE1hdGguUEkvMTgwKVxufVxuXG5cbnZhciBHYW1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzKSB7XG4gIEdhbWUuZ2FtZSA9IHRoaXNcblxuICB0aGlzLnNjYWxlID0gb3B0cy5zY2FsZVxuICB2YXIgd2lkdGggPSB0aGlzLndpZHRoID0gb3B0cy53aWR0aFxuICB2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSBvcHRzLmhlaWdodFxuICB0aGlzLmdyaWRTaXplID0gb3B0cy5ncmlkU2l6ZVxuICB0aGlzLnRvcE1hcmdpbiA9IG9wdHMudG9wTWFyZ2luXG5cbiAgLy8gc2V0dXAgdGhlIGNhbnZhc2VzXG4gIHRoaXMuY3R4ID0gdGhpcy5pbml0Q2FudmFzKG9wdHMuY2FudmFzLCB3aWR0aCwgaGVpZ2h0KVxuICAvLyB0aGlzLmJnY3R4ID0gdGhpcy5pbml0Q2FudmFzKG9wdHMuYmdjYW52YXMsIHdpZHRoLCBoZWlnaHQpXG5cbiAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dChvcHRzLmNhbnZhcylcbiAgdGhpcy5idXR0b25NYW5hZ2VyID0gbmV3IEJ1dHRvbk1hbmFnZXIoKVxufVxuXG5HYW1lLnByb3RvdHlwZS5sb2FkTGV2ZWwgPSBmdW5jdGlvbihMZXZlbCkge1xuICB2YXIgbGV2ZWwgPSB0aGlzLmxldmVsID0gbmV3IExldmVsKHRoaXMpXG4gIHRoaXMubG9hZEVudGl0aWVzKClcbn1cblxuLy8gc3RhcnRzIHRoZSBnYW1lIGxvb3BcbkdhbWUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubG9vcCgpXG59XG5cbi8vIHN1c3BlbmRzIHRoZSBnYW1lIGxvb3BcbkdhbWUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yQUZJRClcbn1cbkdhbWUucHJvdG90eXBlLnBhdXNlID0gR2FtZS5wcm90b3R5cGUuc3RvcFxuXG4vLyB0aGUgZ2FtZSBsb29wXG5HYW1lLnByb3RvdHlwZS5sb29wID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuckFGSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcyksIHRoaXMuY3R4LmNhbnZhcylcblxuICBzdGF0cy5iZWdpbigpO1xuXG4gIHRoaXMudXBkYXRlKClcbiAgdGhpcy5kcmF3KClcblxuICBzdGF0cy5lbmQoKTtcbn1cblxuLy8gdXBkYXRlIGFsbCB0aGUgdGhpbmdzXG5HYW1lLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5idXR0b25NYW5hZ2VyLnVwZGF0ZSgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrPTEpIHtcbiAgICB0aGlzLmVudGl0aWVzW2ldLnVwZGF0ZSgpXG4gIH1cbn1cblxuLy8gZHJhdyBhbGwgdGhlIHRoaW5nc1xuR2FtZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG4gIC8vIHRoaXMuYmdjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAvLyBkcmF3IHRoZSBsZXZlbFxuICB0aGlzLmxldmVsLmRyYXcodGhpcy5jdHgpXG4gIC8vIGRyYXcgZWFjaCBlbnRpdHlcbiAgdmFyIGVudCwgaVxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllcy5sZW5ndGg7IGkrPTEpIHtcbiAgICBlbnQgPSB0aGlzLmVudGl0aWVzW2ldXG4gICAgaWYgKGVudCBpbnN0YW5jZW9mIFN3aXRjaCkgZW50LmRyYXcodGhpcy5jdHgpXG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50ID0gdGhpcy5lbnRpdGllc1tpXVxuICAgIGlmIChlbnQgaW5zdGFuY2VvZiBSb2JvdCkgZW50LmRyYXcodGhpcy5jdHgpXG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IHRoaXMuZW50aXRpZXMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50ID0gdGhpcy5lbnRpdGllc1tpXVxuICAgIGlmIChlbnQgaW5zdGFuY2VvZiBCYWxsKSBlbnQuZHJhdyh0aGlzLmN0eClcbiAgfVxuXG4gIC8vIGRyYXcgYW55IFVJIGxhc3RcbiAgdGhpcy5idXR0b25NYW5hZ2VyLmRyYXcodGhpcy5jdHgpXG59XG5cbi8vIGdldCB0aGUgZW50aXR5IGF0IHRoZSBnaXZlbiBwb3NpdGlvblxuR2FtZS5wcm90b3R5cGUuZW50aXR5QXQgPSBmdW5jdGlvbihwb3MsIHR5cGUpIHtcbiAgdmFyIGVudGl0aWVzID0gdGhpcy5lbnRpdGllc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSs9MSkge1xuICAgIHZhciBlbnQgPSBlbnRpdGllc1tpXVxuICAgIGlmICh2ZWN0b3IyLmVxdWFsKGVudC5wb3MsIHBvcykgJiYgZW50IGluc3RhbmNlb2YgdHlwZSkge1xuICAgICAgcmV0dXJuIGVudFxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG4vLyBsb2FkIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBsZXZlbFxuR2FtZS5wcm90b3R5cGUubG9hZEVudGl0aWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlbnRzID0gdGhpcy5lbnRpdGllcyA9IFtdXG4gIHZhciBtYXAgPSB0aGlzLmxldmVsLmVudGl0eU1hcFxuICBmb3IgKHZhciB5ID0gMDsgeSA8IG1hcC5sZW5ndGg7IHkrPTEpIHtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG1hcFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgICAgIHZhciBFbnQgPSBtYXBbeV1beF1cbiAgICAgIGlmIChFbnQpIHtcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBlbnRpdHlcbiAgICAgICAgdmFyIGVudCA9IG5ldyBFbnQoe3g6eCx5Onl9KVxuICAgICAgICAvLyBjaGVjayB0byBzZWUgaWYgaXQncyB0aGUgcm9ib3RcbiAgICAgICAgaWYgKGVudCBpbnN0YW5jZW9mIFJvYm90KSB0aGlzLnJvYm90ID0gZW50XG4gICAgICAgIC8vIGFkZCBpdCB0byB0aGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICAgICAgZW50cy5wdXNoKGVudClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxudmFyIHRoZXRhID0gZDJyKDQ1KVxudmFyIGNzVGhldGEgPSBNYXRoLmNvcyh0aGV0YSlcbnZhciBzblRoZXRhID0gTWF0aC5zaW4odGhldGEpXG52YXIgdGhldGFJbnYgPSBkMnIoMzE1KVxudmFyIGNzVGhldGFJbnYgPSBNYXRoLmNvcyh0aGV0YUludilcbnZhciBzblRoZXRhSW52ID0gTWF0aC5zaW4odGhldGFJbnYpXG5cbi8vIHRyYW5zbGF0ZSBzY3JlZW4gdG8gd29ybGRcbkdhbWUucHJvdG90eXBlLnMydyA9IGZ1bmN0aW9uKHBvcykge1xuICAvLyByb3RhdGVcbiAgdmFyIHggPSBwb3MueFxuICB2YXIgeSA9IHBvcy55XG4gIHBvcy54ID0geCAqIGNzVGhldGEgLSB5ICogc25UaGV0YVxuICBwb3MueSA9IHggKiBzblRoZXRhICsgeSAqIGNzVGhldGFcbiAgLy8gc2NhbGVcbiAgcG9zLnkgKj0gMC41XG4gIC8vIHRyYW5zbGF0ZVxuICBwb3MueCArPSB0aGlzLndpZHRoLzJcbiAgcG9zLnkgKz0gdGhpcy50b3BNYXJnaW5cbiAgcmV0dXJuIHBvc1xufVxuXG4vLyB0cmFuc2xhdGUgd29ybGQgdG8gc2NyZWVuXG5HYW1lLnByb3RvdHlwZS53MnMgPSBmdW5jdGlvbihwb3MpIHtcbiAgLy8gdHJhbnNsYXRlXG4gIHBvcy54IC09IHRoaXMud2lkdGgvMlxuICBwb3MueSAtPSB0aGlzLnRvcE1hcmdpblxuICAvLyBzY2FsZVxuICBwb3MueSAvPSAwLjVcbiAgLy8gcm90YXRlXG4gIHZhciB5ID0gcG9zLnlcbiAgdmFyIHggPSBwb3MueFxuICBwb3MueCA9IHggKiBjc1RoZXRhSW52IC0geSAqIHNuVGhldGFJbnZcbiAgcG9zLnkgPSB4ICogc25UaGV0YUludiArIHkgKiBjc1RoZXRhSW52XG4gIHJldHVybiBwb3Ncbn1cblxuLy8gc2V0dXAgY2FudmFzZSBlbGVtZW50cyB0byB0aGUgY29ycmVjdCBzaXplXG5HYW1lLnByb3RvdHlwZS5pbml0Q2FudmFzID0gZnVuY3Rpb24oaWQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICBjYW52YXMud2lkdGggPSB3aWR0aFxuICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIHJldHVybiBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxufVxuXG4vLyB0cmFuc2Zvcm0gdGhlIGNvbnRleHQgaW50byBpc29tZXRyaWNcbkdhbWUucHJvdG90eXBlLmlzb0N0eCA9IGZ1bmN0aW9uKGN0eCwgZm4pIHtcbiAgY3R4LnNhdmUoKVxuXG4gIC8vIG1vdmUgdGhlIGdhbWUgYm9hcmQgZG93biBhIGJpdFxuICBjdHgudHJhbnNsYXRlKDAsIHRoaXMudG9wTWFyZ2luKVxuICBjdHgudHJhbnNsYXRlKHRoaXMud2lkdGgvMiwgMClcbiAgY3R4LnNjYWxlKDEsIDAuNSlcbiAgY3R4LnJvdGF0ZSg0NSAqIE1hdGguUEkgLyAxODApXG4gIC8vIGN0eC50cmFuc2Zvcm0oMC43MDcsIDAuNDA5LCAtMC43MDcsIDAuNDA5LCAwLCAwKVxuICBmbigpXG4gIGN0eC5yZXN0b3JlKClcbn1cblxuR2FtZS5wcm90b3R5cGUuZDJyID0gZDJyXG5cbkdhbWUucHJvdG90eXBlLnIyZCA9IHIyZFxuIiwidmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vc3dpdGNoJylcblxudmFyIEJhbGwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHBvcykge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIHRoaXMucG9zID0gcG9zXG59XG5cbkJhbGwucHJvdG90eXBlLmRyb3BwZWQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRhcmdldCA9IHRoaXMuZ2FtZS5lbnRpdHlBdCh0aGlzLnBvcywgU3dpdGNoKVxuICBpZiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRhcmdldC50dXJuT24odGhpcylcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5CYWxsLnByb3RvdHlwZS5waWNrZWRVcCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGFyZ2V0ID0gdGhpcy5nYW1lLmVudGl0eUF0KHRoaXMucG9zLCBTd2l0Y2gpXG4gIGlmICh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGFyZ2V0LnR1cm5PZmYodGhpcylcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5CYWxsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcblxufVxuXG5CYWxsLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBkMnIgPSB0aGlzLmdhbWUuZDJyXG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICB0aGlzLmdhbWUuaXNvQ3R4KGN0eCwgZnVuY3Rpb24oKSB7XG4gICAgY3R4LnRyYW5zbGF0ZShcbiAgICAgIHRoaXMucG9zLnggKiBzY2FsZSArIHNjYWxlIC8gMixcbiAgICAgIHRoaXMucG9zLnkgKiBzY2FsZSArIHNjYWxlIC8gMlxuICAgIClcblxuICAgIHZhciByYWRpdXMgPSBzY2FsZSowLjNcblxuICAgIGN0eC5maWxsU3R5bGUgPSAnIzc3NzdGRidcbiAgICBjdHguYmVnaW5QYXRoKClcbiAgICBjdHguYXJjKDAsIDAsIHJhZGl1cywgZDJyKDApLCBkMnIoMzYwKSlcbiAgICBjdHguZmlsbCgpXG4gICAgY3R4LnN0cm9rZSgpXG4gIH0uYmluZCh0aGlzKSlcbn1cbiIsInZhciB2ZWN0b3IyID0gcmVxdWlyZSgnLi92ZWN0b3IyJylcbnZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxuXG52YXIgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbCcpXG5cbnZhciBSb2JvdCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3NcbiAgdGhpcy5kaXIgPSB7IHg6MSwgeTowIH1cbiAgdGhpcy5xdWV1ZSA9IFtdXG4gIHRoaXMuZnJlcSA9IDQwMFxuICB0aGlzLmJsb2NrZWQgPSBmYWxzZVxuXG4gIHB1YnN1Yi5vbignY29tbWFuZEJ1dHRvblByZXNzZWQnLCB0aGlzLmVucXVldWUuYmluZCh0aGlzKSlcbn1cblxuUm9ib3QucHJvdG90eXBlLm1vdmVGb3J3YXJkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBncmlkID0gdGhpcy5nYW1lLmxldmVsLmdyaWRcbiAgdmFyIG5ld1BvcyA9IHZlY3RvcjIuYWRkKHRoaXMucG9zLCB0aGlzLmRpcilcbiAgaWYgKCFncmlkW25ld1Bvcy55XSB8fCAhZ3JpZFtuZXdQb3MueV1bbmV3UG9zLnhdKSB7XG4gICAgdGhpcy5ibG9jaygpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wb3MgPSBuZXdQb3NcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUubW92ZUJhY2t3YXJkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBncmlkID0gdGhpcy5nYW1lLmxldmVsLmdyaWRcbiAgdmFyIG5ld1BvcyA9IHZlY3RvcjIuc3VidHJhY3QodGhpcy5wb3MsIHRoaXMuZGlyKVxuICBpZiAoIWdyaWRbbmV3UG9zLnldIHx8ICFncmlkW25ld1Bvcy55XVtuZXdQb3MueF0pIHtcbiAgICB0aGlzLmJsb2NrKClcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnBvcyA9IG5ld1Bvc1xuICB9XG4gIHJldHVybiB0aGlzXG59XG5cblJvYm90LnByb3RvdHlwZS50dXJuTGVmdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IHRoaXMuZGlyLnhcbiAgdmFyIHkgPSB0aGlzLmRpci55XG4gIHRoaXMuZGlyLnggPSB5XG4gIHRoaXMuZGlyLnkgPSAteFxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUudHVyblJpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciB4ID0gdGhpcy5kaXIueFxuICB2YXIgeSA9IHRoaXMuZGlyLnlcbiAgdGhpcy5kaXIueCA9IC15XG4gIHRoaXMuZGlyLnkgPSB4XG4gIHJldHVybiB0aGlzXG59XG5cblJvYm90LnByb3RvdHlwZS50dXJuQXJvdW5kID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZGlyLnggKj0gLTFcbiAgdGhpcy5kaXIueSAqPSAtMVxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUucGlja3VwID0gZnVuY3Rpb24oKSB7XG4gIHZhciB0YXJnZXQgPSB0aGlzLmdhbWUuZW50aXR5QXQodmVjdG9yMi5hZGQodGhpcy5wb3MsIHRoaXMuZGlyKSwgQmFsbClcbiAgaWYgKHRhcmdldCAmJiB0YXJnZXQucGlja2VkVXAoKSkge1xuICAgIHRoaXMuYmFsbCA9IHRhcmdldFxuICB9IGVsc2Uge1xuICAgIHRoaXMuYmxvY2soKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cblJvYm90LnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmJhbGwgJiYgdGhpcy5iYWxsLmRyb3BwZWQoKSkge1xuICAgIHRoaXMuYmFsbCA9IG51bGxcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmJsb2NrKClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUubW92ZUJhbGwgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYmFsbCkge1xuICAgIHRoaXMuYmFsbC5wb3MgPSB2ZWN0b3IyLmFkZCh0aGlzLnBvcywgdGhpcy5kaXIpXG4gIH1cbn1cblxuUm9ib3QucHJvdG90eXBlLmJsb2NrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuYmxvY2tlZCA9IHRydWVcbn1cblxuUm9ib3QucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbihmbmFtZSkge1xuICBpZiAoZm5hbWUgPT09ICdzdGFydCcpIHJldHVybiB0aGlzLnN0YXJ0KClcbiAgaWYgKHR5cGVvZiB0aGlzW2ZuYW1lXSA9PSAnZnVuY3Rpb24nKVxuICAgIHRoaXMucXVldWUucHVzaChmbmFtZSlcbn1cblxuUm9ib3QucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RlcCgpXG59XG5cblJvYm90LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICB9XG59XG5cblJvYm90LnByb3RvdHlwZS5zdGVwID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKHRoaXMuYmxvY2tlZCkge1xuICAgIHRoaXMucXVldWUgPSBbXVxuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIGFjdGlvbiA9IHRoaXMucXVldWUuc2hpZnQoKVxuICB0aGlzW2FjdGlvbl0oKVxuICB0aGlzLm1vdmVCYWxsKClcbiAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLnN0ZXAuYmluZCh0aGlzKSwgdGhpcy5mcmVxKVxufVxuXG5Sb2JvdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG59XG5cblJvYm90LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuXG4gIHRoaXMuZ2FtZS5pc29DdHgoY3R4LCBmdW5jdGlvbigpIHtcblxuICAgIGN0eC5zYXZlKClcbiAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgdGhpcy5wb3MueCAqIHNjYWxlICsgc2NhbGUgLyAyLFxuICAgICAgdGhpcy5wb3MueSAqIHNjYWxlICsgc2NhbGUgLyAyXG4gICAgKVxuICAgIGN0eC5yb3RhdGUoTWF0aC5hdGFuMih0aGlzLmRpci55LCB0aGlzLmRpci54KSlcbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5ibG9ja2VkID8gJyNmZjAwMDAnIDogJyM0NDg4NDQnXG5cbiAgICBjdHguYmVnaW5QYXRoKClcbiAgICBjdHgucmVjdChcbiAgICAgIHNjYWxlICogLTAuMyxcbiAgICAgIHNjYWxlICogLTAuMyxcbiAgICAgIHNjYWxlICogMC42LFxuICAgICAgc2NhbGUgKiAwLjZcbiAgICApXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4Lm1vdmVUbygwLCAwKVxuICAgIGN0eC5saW5lVG8oc2NhbGUgKiAodGhpcy5iYWxsPzE6MC4zKSwgMClcbiAgICBjdHguc3Ryb2tlKClcbiAgICBjdHgucmVzdG9yZSgpXG5cbiAgfS5iaW5kKHRoaXMpKVxuICByZXR1cm4gdGhpc1xufVxuIiwidmFyIElucHV0ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpZCkge1xuICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMudG91Y2hTdGFydC5iaW5kKHRoaXMpLCBmYWxzZSlcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy50b3VjaE1vdmUuYmluZCh0aGlzKSwgZmFsc2UpXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy50b3VjaEVuZC5iaW5kKHRoaXMpLCBmYWxzZSlcbn1cblxuXG5JbnB1dC5wcm90b3R5cGUudG91Y2hTdGFydCA9IGZ1bmN0aW9uKGV2KSB7XG4gIHRoaXMuc3RhcnQgPSBldi50b3VjaGVzWzBdXG4gIHRoaXMudG91Y2hNb3ZlKGV2KVxufVxuXG5JbnB1dC5wcm90b3R5cGUudG91Y2hNb3ZlID0gZnVuY3Rpb24oZXYpIHtcbiAgdGhpcy5wcmV2aW91cyA9IHRoaXMuY3VycmVudFxuICB0aGlzLmN1cnJlbnQgPSBldi50b3VjaGVzWzBdXG4gIHRoaXMuY3VycmVudC54ID0gdGhpcy5jdXJyZW50LmNsaWVudFhcbiAgdGhpcy5jdXJyZW50LnkgPSB0aGlzLmN1cnJlbnQuY2xpZW50WVxufVxuXG5JbnB1dC5wcm90b3R5cGUudG91Y2hFbmQgPSBmdW5jdGlvbihldikge1xuICB0aGlzLnByZXZpb3VzID0ge1xuICAgIHN0YXJ0OiB0aGlzLnN0YXJ0LFxuICAgIGVuZDogdGhpcy5jdXJyZW50XG4gIH1cbiAgdGhpcy5jdXJyZW50ID0gbnVsbFxuICB0aGlzLnN0YXJ0ID0gbnVsbFxufVxuIiwiXG52YXIgRXhpdCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3Ncbn1cblxuRXhpdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG59XG5cbkV4aXQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgdmFyIHNjYWxlID0gdGhpcy5nYW1lLnNjYWxlXG4gIHRoaXMuZ2FtZS5pc29DdHgoY3R4LCBmdW5jdGlvbigpIHtcbiAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgdGhpcy5wb3MueCAqIHNjYWxlICsgc2NhbGUgLyAyLFxuICAgICAgdGhpcy5wb3MueSAqIHNjYWxlICsgc2NhbGUgLyAyXG4gICAgKVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5yZWN0KFxuICAgICAgc2NhbGUgKiAtMC4zLFxuICAgICAgc2NhbGUgKiAtMC4zLFxuICAgICAgc2NhbGUgKiAwLjYsXG4gICAgICBzY2FsZSAqIDAuNlxuICAgIClcbiAgICBjdHguZmlsbCgpXG4gICAgY3R4LnN0cm9rZSgpXG4gIH0uYmluZCh0aGlzKSlcbn1cbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIFRleHR1cmUgPSByZXF1aXJlKCcuL3RleHR1cmUnKVxuXG52YXIgVGlsZVNldCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3JjLCB3LCBoLCBveCwgb3kpIHtcbiAgdGhpcy53aWR0aCA9IHdcbiAgdGhpcy5oZWlnaHQgPSBoXG4gIHRoaXMub2Zmc2V0WCA9IG94XG4gIHRoaXMub2Zmc2V0WSA9IG95XG5cbiAgdGhpcy50ZXh0dXJlID0gbmV3IFRleHR1cmUoc3JjKVxuICB0aGlzLmVjaG8oJ2xvYWQnLCB0aGlzLnRleHR1cmUpXG59XG5cbnB1YnN1Yi5leHRlbmQoVGlsZVNldC5wcm90b3R5cGUpXG5cblRpbGVTZXQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgsIHQsIHgsIHksIHcpIHtcbiAgdmFyIHN4ID0gdCAqIHRoaXMud2lkdGhcbiAgdmFyIHN5ID0gMFxuICB2YXIgc3cgPSB0aGlzLndpZHRoXG4gIHZhciBzaCA9IHRoaXMuaGVpZ2h0XG5cbiAgLy8gdGhlIHNjYWxlciBpcyB0aGUgd2lkdGggb2YgdGhlIGRlc3RpbmF0aW9uIHRpbGUgZGl2aWRlZFxuICAvLyBieSB0aGUgXCJ0cnVlXCIgd2lkdGggb2YgdGhlIHRpbGUgaW4gdGhlIGltYWdlXG4gIHZhciBzY2FsZXIgPSB3IC8gKHRoaXMud2lkdGggLSB0aGlzLm9mZnNldFgqMilcblxuICB2YXIgZHcgPSB0aGlzLndpZHRoICogc2NhbGVyXG4gIHZhciBkaCA9IHRoaXMuaGVpZ2h0ICogc2NhbGVyXG4gIHZhciBkeCA9IHggLSBkdyowLjVcbiAgdmFyIGR5ID0geSAtIHRoaXMub2Zmc2V0WSAqIHNjYWxlclxuXG4gIGN0eC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLmltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoKVxufVxuXG5cbiIsIlxudmFyIFN3aXRjaCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3NcbiAgdGhpcy5zdGF0ZSA9IFN3aXRjaC5TVEFURS5PRkZcbn1cblxuU3dpdGNoLnByb3RvdHlwZS50dXJuT24gPSBmdW5jdGlvbihlbnQpIHtcbiAgaWYgKHRoaXMuc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PRkYpIHtcbiAgICB0aGlzLnN0YXRlID0gU3dpdGNoLlNUQVRFLk9OXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuU3dpdGNoLnByb3RvdHlwZS50dXJuT2ZmID0gZnVuY3Rpb24oZW50KSB7XG4gIGlmICh0aGlzLnN0YXRlID09PSBTd2l0Y2guU1RBVEUuT04pIHtcbiAgICB0aGlzLnN0YXRlID0gU3dpdGNoLlNUQVRFLk9GRlxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cblN3aXRjaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG59XG5cblN3aXRjaC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICB2YXIgZDJyID0gdGhpcy5nYW1lLmQyclxuICB2YXIgc2NhbGUgPSB0aGlzLmdhbWUuc2NhbGVcbiAgdGhpcy5nYW1lLmlzb0N0eChjdHgsIGZ1bmN0aW9uKCkge1xuICAgIGN0eC50cmFuc2xhdGUoXG4gICAgICB0aGlzLnBvcy54ICogc2NhbGUgKyBzY2FsZSAvIDIsXG4gICAgICB0aGlzLnBvcy55ICogc2NhbGUgKyBzY2FsZSAvIDJcbiAgICApXG5cbiAgICB2YXIgcmFkaXVzID0gc2NhbGUqMC4zXG5cbiAgICAvLyBmaWxsIHRoZSBzcXVhcmVcbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5zdGF0ZSA9PT0gU3dpdGNoLlNUQVRFLk9OID8gJyMwMEZGMDAnIDogJyNGRjAwMDAnXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LnJlY3QoLXNjYWxlLzIsIC1zY2FsZS8yLCBzY2FsZSwgc2NhbGUpXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuXG4gICAgLy8gZHJhdyB0aGUgcmVjaWV2ZXJcbiAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LmFyYygwLCAwLCByYWRpdXMsIGQycigwKSwgZDJyKDM2MCkpXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuICB9LmJpbmQodGhpcykpXG59XG5cblN3aXRjaC5TVEFURSA9IHtcbiAgT04gOiAxLFxuICBPRkYgOiAwXG59XG4iLCJ2YXIgYnV0dG9uRGVmcyA9IHJlcXVpcmUoJy4vYnV0dG9ucycpXG52YXIgQnV0dG9uID0gcmVxdWlyZSgnLi9idXR0b24nKVxudmFyIFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJylcblxudmFyIEJ1dHRvbk1hbmFnZXIgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwcml0ZXMgPSB7fVxuICBmb3IgKHZhciBrZXkgaW4gYnV0dG9uRGVmcy5zcHJpdGVzKSB7XG4gICAgdmFyIHNwciA9IGJ1dHRvbkRlZnMuc3ByaXRlc1trZXldXG4gICAgdmFyIHNwcml0ZSA9IG5ldyBTcHJpdGUoc3ByKVxuICAgIHRoaXMuc3ByaXRlc1trZXldID0gc3ByaXRlXG4gIH1cblxuICB0aGlzLmJ1dHRvbnMgPSBbXVxuICBmb3IgKHZhciBrZXkgaW4gYnV0dG9uRGVmcy5idXR0b25zKSB7XG4gICAgdmFyIGJ0biA9IGJ1dHRvbkRlZnMuYnV0dG9uc1trZXldXG4gICAgYnRuLnNwcml0ZSA9IHRoaXMuc3ByaXRlc1tidG4uc3ByaXRlXVxuICAgIHZhciBidXR0b24gPSBuZXcgQnV0dG9uKGJ0bilcbiAgICB0aGlzLmJ1dHRvbnMucHVzaChidXR0b24pXG4gIH1cbn1cblxuQnV0dG9uTWFuYWdlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGUoKVxuICB9XG59XG5cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKz0xKSB7XG4gICAgdGhpcy5idXR0b25zW2ldLmRyYXcoY3R4KVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBlcXVhbDogZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueVxuICB9LFxuXG4gIGFkZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG4gICAgdmFyIHYgPSB7IHg6MCwgeTowIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHYueCArPSBhcmdzW2ldLnhcbiAgICAgIHYueSArPSBhcmdzW2ldLnlcbiAgICB9XG4gICAgcmV0dXJuIHZcbiAgfSxcblxuICBzdWJ0cmFjdDogZnVuY3Rpb24odikge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgIHYgPSB7IHg6di54LCB5OnYueSB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2LnggLT0gYXJnc1tpXS54XG4gICAgICB2LnkgLT0gYXJnc1tpXS55XG4gICAgfVxuICAgIHJldHVybiB2XG4gIH1cblxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgc3ByaXRlczoge1xuICAgIGJ1dHRvbnM6IHtcbiAgICAgIHRleHR1cmU6ICdpbWFnZXMvYnV0dG9ucy5wbmcnLFxuICAgICAgd2lkdGg6IDgwLFxuICAgICAgaGVpZ2h0OiA4MFxuICAgIH1cbiAgfSxcblxuICBidXR0b25zOiB7XG5cbiAgICBmb3J3YXJkOiB7XG4gICAgICBwb3M6IHsgeDowLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjowLFxuICAgICAgZnJhbWVPbjoxLFxuICAgICAgY29tbWFuZDogJ21vdmVGb3J3YXJkJ1xuICAgIH0sXG5cbiAgICBiYWNrd2FyZDoge1xuICAgICAgcG9zOiB7IHg6ODAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjIsXG4gICAgICBmcmFtZU9uOjMsXG4gICAgICBjb21tYW5kOiAnbW92ZUJhY2t3YXJkJ1xuICAgIH0sXG5cbiAgICBsZWZ0OiB7XG4gICAgICBwb3M6IHsgeDoxNzAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjQsXG4gICAgICBmcmFtZU9uOjUsXG4gICAgICBjb21tYW5kOiAndHVybkxlZnQnXG4gICAgfSxcblxuICAgIHJpZ2h0OiB7XG4gICAgICBwb3M6IHsgeDoyNTAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjYsXG4gICAgICBmcmFtZU9uOjcsXG4gICAgICBjb21tYW5kOiAndHVyblJpZ2h0J1xuICAgIH0sXG5cbiAgICBwaWNrdXA6IHtcbiAgICAgIHBvczogeyB4OjM0MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6OCxcbiAgICAgIGZyYW1lT246OSxcbiAgICAgIGNvbW1hbmQ6ICdwaWNrdXAnXG4gICAgfSxcblxuICAgIHJlbGVhc2U6IHtcbiAgICAgIHBvczogeyB4OjQyMCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6MTAsXG4gICAgICBmcmFtZU9uOjExLFxuICAgICAgY29tbWFuZDogJ3JlbGVhc2UnXG4gICAgfSxcblxuICAgIHN0YXJ0OiB7XG4gICAgICBwb3M6IHsgeDo1NDAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjEyLFxuICAgICAgZnJhbWVPbjoxMyxcbiAgICAgIGNvbW1hbmQ6ICdzdGFydCdcbiAgICB9LFxuXG4gICAgdHVybkFyb3VuZDoge1xuICAgICAgcG9zOiB7IHg6NjYwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjo2LFxuICAgICAgZnJhbWVPbjo3LFxuICAgICAgY29tbWFuZDogJ3R1cm5Bcm91bmQnXG4gICAgfSxcblxuICAgIHJlc3RhcnQ6IHtcbiAgICAgIHBvczogeyB4Ojc4MCwgeTowIH0sXG4gICAgICB3aWR0aDo0MCxcbiAgICAgIGhlaWdodDo0MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6NixcbiAgICAgIGZyYW1lT246NyxcbiAgICAgIGNvbW1hbmQ6ICdyZXN0YXJ0J1xuICAgIH1cblxuICB9XG59XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcblxudmFyIGNhY2hlID0ge31cblxudmFyIFRleHR1cmUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNyYykge1xuICBpZiAoY2FjaGVbc3JjXSkgcmV0dXJuIGNhY2hlW3NyY11cblxuICB0aGlzLmlzTG9hZGVkID0gZmFsc2VcbiAgdGhpcy5sb2FkKHNyYylcbiAgY2FjaGVbc3JjXSA9IHRoaXNcbn1cblxudmFyIGFwaSA9IFRleHR1cmUucHJvdG90eXBlXG5wdWJzdWIuZXh0ZW5kKGFwaSlcblxuYXBpLmxvYWQgPSBmdW5jdGlvbihzcmMpIHtcbiAgdmFyIGltZyA9IHRoaXMuaW1nID0gbmV3IEltYWdlKClcbiAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlXG4gICAgdGhpcy53aWR0aCA9IGltZy53aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gaW1nLmhlaWdodFxuICAgIHRoaXMudHJpZ2dlcignbG9hZCcpXG4gIH0uYmluZCh0aGlzKVxuICBpbWcuc3JjID0gc3JjXG59XG5cbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIFRleHR1cmUgPSByZXF1aXJlKCcuL3RleHR1cmUnKVxuXG52YXIgU3ByaXRlID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHRcbiAgdGhpcy5mcmFtZXMgPSBbXVxuICB0aGlzLnRleHR1cmUgPSBuZXcgVGV4dHVyZShvcHRpb25zLnRleHR1cmUpXG4gIHRoaXMudGV4dHVyZS5vbignbG9hZCcsIHRoaXMuY2FsY3VsYXRlRnJhbWVzLmJpbmQodGhpcykpXG59XG5cbnZhciBhcGkgPSBTcHJpdGUucHJvdG90eXBlXG5wdWJzdWIuZXh0ZW5kKGFwaSlcblxuYXBpLmNhbGN1bGF0ZUZyYW1lcyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnTE9BREVEIFNQUklURScsIHRoaXMudGV4dHVyZS5pbWcuc3JjKVxuICB2YXIgeCA9ICh0aGlzLnRleHR1cmUud2lkdGggLyB0aGlzLndpZHRoKSB8IDBcbiAgdmFyIHkgPSAodGhpcy50ZXh0dXJlLmhlaWdodCAvIHRoaXMuaGVpZ2h0KSB8IDBcblxuICBmb3IgKHZhciBpeSA9IDA7IGl5IDwgeTsgaXkrKykge1xuICAgIGZvciAodmFyIGl4ID0gMDsgaXggPCB4OyBpeCsrKSB7XG4gICAgICB0aGlzLmZyYW1lcy5wdXNoKHtcbiAgICAgICAgeDogaXggKiB0aGlzLndpZHRoLFxuICAgICAgICB5OiBpeSAqIHRoaXMuaGVpZ2h0LFxuICAgICAgICB4MjogaXggKiB0aGlzLndpZHRoICsgdGhpcy53aWR0aCxcbiAgICAgICAgeTI6IGl5ICogdGhpcy5oZWlnaHQgKyB0aGlzLmhlaWdodCxcbiAgICAgICAgdzogdGhpcy53aWR0aCxcbiAgICAgICAgaDogdGhpcy5oZWlnaHRcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIHRoaXMudHJpZ2dlcignbG9hZCcpXG59XG5cbmFwaS5kcmF3ID0gZnVuY3Rpb24oY3R4LCBmcmFtZSwgcmVjdCkge1xuICB2YXIgZiA9IHRoaXMuZnJhbWVzW2ZyYW1lXVxuICBpZiAoIWYpIHJldHVyblxuICBjdHguZHJhd0ltYWdlKHRoaXMudGV4dHVyZS5pbWcsXG4gICAgZi54LCBmLnksIGYudywgZi5oLFxuICAgIHJlY3QueCwgcmVjdC55LCByZWN0LncsIHJlY3QuaClcbn1cblxuXG5cbiIsInZhciBleHRlbmQgPSByZXF1aXJlKCcuL2V4dGVuZCcpXG5cbnZhciBFdmVudHMgPSB7fVxuXG5FdmVudHMudHJpZ2dlciA9IGZ1bmN0aW9uKC8qIFN0cmluZyAqLyB0b3BpYywgLyogQXJyYXk/ICovIGFyZ3MpIHtcbiAgLy8gc3VtbWFyeTpcbiAgLy8gICAgUHVibGlzaCBzb21lIGRhdGEgb24gYSBuYW1lZCB0b3BpYy5cbiAgLy8gdG9waWM6IFN0cmluZ1xuICAvLyAgICBUaGUgY2hhbm5lbCB0byBwdWJsaXNoIG9uXG4gIC8vIGFyZ3M6IEFycmF5P1xuICAvLyAgICBUaGUgZGF0YSB0byBwdWJsaXNoLiBFYWNoIGFycmF5IGl0ZW0gaXMgY29udmVydGVkIGludG8gYW4gb3JkZXJlZFxuICAvLyAgICBhcmd1bWVudHMgb24gdGhlIHN1YnNjcmliZWQgZnVuY3Rpb25zLlxuICAvL1xuICAvLyBleGFtcGxlOlxuICAvLyAgICBQdWJsaXNoIHN0dWZmIG9uICcvc29tZS90b3BpYycuIEFueXRoaW5nIHN1YnNjcmliZWQgd2lsbCBiZSBjYWxsZWRcbiAgLy8gICAgd2l0aCBhIGZ1bmN0aW9uIHNpZ25hdHVyZSBsaWtlOiBmdW5jdGlvbihhLGIsYykgeyAuLi4gfVxuICAvL1xuICAvLyAgICB0cmlnZ2VyKFwiL3NvbWUvdG9waWNcIiwgW1wiYVwiLFwiYlwiLFwiY1wiXSlcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVyblxuXG4gIHZhciBzdWJzID0gdGhpcy5fZXZlbnRzW3RvcGljXSxcbiAgICBsZW4gPSBzdWJzID8gc3Vicy5sZW5ndGggOiAwXG5cbiAgLy9jYW4gY2hhbmdlIGxvb3Agb3IgcmV2ZXJzZSBhcnJheSBpZiB0aGUgb3JkZXIgbWF0dGVyc1xuICB3aGlsZSAobGVuLS0pIHtcbiAgICBzdWJzW2xlbl0uYXBwbHkoRXZlbnRzLCBhcmdzIHx8IFtdKVxuICB9XG59XG5cbkV2ZW50cy5vbiA9IGZ1bmN0aW9uKC8qIFN0cmluZyAqLyB0b3BpYywgLyogRnVuY3Rpb24gKi8gY2FsbGJhY2spIHtcbiAgLy8gc3VtbWFyeTpcbiAgLy8gICAgUmVnaXN0ZXIgYSBjYWxsYmFjayBvbiBhIG5hbWVkIHRvcGljLlxuICAvLyB0b3BpYzogU3RyaW5nXG4gIC8vICAgIFRoZSBjaGFubmVsIHRvIHN1YnNjcmliZSB0b1xuICAvLyBjYWxsYmFjazogRnVuY3Rpb25cbiAgLy8gICAgVGhlIGhhbmRsZXIgZXZlbnQuIEFueXRpbWUgc29tZXRoaW5nIGlzIHRyaWdnZXInZWQgb24gYVxuICAvLyAgICBzdWJzY3JpYmVkIGNoYW5uZWwsIHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZVxuICAvLyAgICBwdWJsaXNoZWQgYXJyYXkgYXMgb3JkZXJlZCBhcmd1bWVudHMuXG4gIC8vXG4gIC8vIHJldHVybnM6IEFycmF5XG4gIC8vICAgIEEgaGFuZGxlIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHVuc3Vic2NyaWJlIHRoaXMgcGFydGljdWxhciBzdWJzY3JpcHRpb24uXG4gIC8vXG4gIC8vIGV4YW1wbGU6XG4gIC8vICAgIG9uKFwiL3NvbWUvdG9waWNcIiwgZnVuY3Rpb24oYSwgYiwgYykgeyAvKiBoYW5kbGUgZGF0YSAqLyB9KVxuXG4gIHRoaXMuX2V2ZW50cyB8fCAodGhpcy5fZXZlbnRzID0ge30pXG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdG9waWNdKSB7XG4gICAgdGhpcy5fZXZlbnRzW3RvcGljXSA9IFtdXG4gIH1cbiAgdGhpcy5fZXZlbnRzW3RvcGljXS5wdXNoKGNhbGxiYWNrKVxuICByZXR1cm4gW3RvcGljLCBjYWxsYmFja10gLy8gQXJyYXlcbn1cblxuRXZlbnRzLm9mZiA9IGZ1bmN0aW9uKC8qIEFycmF5IG9yIFN0cmluZyAqLyBoYW5kbGUpIHtcbiAgLy8gc3VtbWFyeTpcbiAgLy8gICAgRGlzY29ubmVjdCBhIHN1YnNjcmliZWQgZnVuY3Rpb24gZm9yIGEgdG9waWMuXG4gIC8vIGhhbmRsZTogQXJyYXkgb3IgU3RyaW5nXG4gIC8vICAgIFRoZSByZXR1cm4gdmFsdWUgZnJvbSBhbiBgb25gIGNhbGwuXG4gIC8vIGV4YW1wbGU6XG4gIC8vICAgIHZhciBoYW5kbGUgPSBvbihcIi9zb21lL3RvcGljXCIsIGZ1bmN0aW9uKCkge30pXG4gIC8vICAgIG9mZihoYW5kbGUpXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm5cblxuICB2YXIgc3VicyA9IHRoaXMuX2V2ZW50c1t0eXBlb2YgaGFuZGxlID09PSAnc3RyaW5nJyA/IGhhbmRsZSA6IGhhbmRsZVswXV1cbiAgdmFyIGNhbGxiYWNrID0gdHlwZW9mIGhhbmRsZSA9PT0gJ3N0cmluZycgPyBoYW5kbGVbMV0gOiBmYWxzZVxuICB2YXIgbGVuID0gc3VicyA/IHN1YnMubGVuZ3RoIDogMFxuXG4gIHdoaWxlIChsZW4tLSkge1xuICAgIGlmIChzdWJzW2xlbl0gPT09IGNhbGxiYWNrIHx8ICFjYWxsYmFjaykge1xuICAgICAgc3Vicy5zcGxpY2UobGVuLCAxKVxuICAgIH1cbiAgfVxufVxuXG5FdmVudHMuZWNobyA9IGZ1bmN0aW9uKC8qIFN0cmluZyAqLyB0b3BpYywgLyogT2JqZWN0ICovIGVtaXR0ZXIpIHtcbiAgZW1pdHRlci5vbih0b3BpYywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50cmlnZ2VyKHRvcGljLCBhcmd1bWVudHMpXG4gIH0uYmluZCh0aGlzKSlcbn1cblxuXG52YXIgcHVic3ViID0gbW9kdWxlLmV4cG9ydHMgPSB7fVxuXG5wdWJzdWIuRXZlbnRzID0gRXZlbnRzXG5wdWJzdWIuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gIGV4dGVuZChvYmosIEV2ZW50cylcbn1cbnB1YnN1Yi5leHRlbmQocHVic3ViKVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG5cbnZhciBCdXR0b24gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJ0bikge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIC8vIGNvcHkgb3ZlciB0aGUgYnRuIHByb3BlcnRpZXNcbiAgZm9yICh2YXIgayBpbiBidG4pIHtcbiAgICB0aGlzW2tdID0gYnRuW2tdXG4gIH1cbiAgdGhpcy5zdGF0ZSA9IEJ1dHRvbi5TVEFURS5OT1JNQUxcbn1cblxuQnV0dG9uLnByb3RvdHlwZS50YXBwZWQgPSBmdW5jdGlvbigpIHtcbiAgcHVic3ViLnRyaWdnZXIoJ2NvbW1hbmRCdXR0b25QcmVzc2VkJywgW3RoaXMuY29tbWFuZF0pXG59XG5cbkJ1dHRvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RhdGUgPSBCdXR0b24uU1RBVEUuTk9STUFMXG4gIHZhciBzdGFydCA9IHRoaXMuZ2FtZS5pbnB1dC5zdGFydFxuICB2YXIgY3VycmVudCA9IHRoaXMuZ2FtZS5pbnB1dC5jdXJyZW50XG4gIHZhciBwcmV2aW91cyA9IHRoaXMuZ2FtZS5pbnB1dC5wcmV2aW91c1xuXG4gIGlmIChjdXJyZW50KSB7XG4gICAgaWYgKHRoaXMuY29udGFpbnMoY3VycmVudCkgJiYgdGhpcy5jb250YWlucyhzdGFydCkpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBCdXR0b24uU1RBVEUuRE9XTlxuICAgIH1cbiAgfVxuICBlbHNlIGlmIChwcmV2aW91cyAmJiB0aGlzLmNvbnRhaW5zKHByZXZpb3VzLmVuZCkgJiYgdGhpcy5jb250YWlucyhwcmV2aW91cy5zdGFydCkpIHtcbiAgICB0aGlzLnRhcHBlZCgpXG4gICAgdGhpcy5nYW1lLmlucHV0LnByZXZpb3VzID0gbnVsbFxuICB9XG59XG5cbkJ1dHRvbi5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICBjdHguc2F2ZSgpXG4gIGN0eC50cmFuc2xhdGUodGhpcy5wb3MueCwgdGhpcy5wb3MueSlcblxuICAvLyBjdHguYmVnaW5QYXRoKClcbiAgLy8gY3R4LmxpbmVTdHlsZSA9ICcjMDAwMDAwJ1xuICAvLyBjdHgubGluZVdpZHRoID0gMlxuICAvLyBjdHgucmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgLy8gY3R4LnN0cm9rZSgpXG5cbiAgdmFyIHJlY3QgPSB7IHg6MCwgeTowLCB3OnRoaXMud2lkdGgsIGg6dGhpcy5oZWlnaHQgfVxuICB0aGlzLnNwcml0ZS5kcmF3KGN0eCwgdGhpcy5mcmFtZU9mZiwgcmVjdClcblxuICBjdHgucmVzdG9yZSgpXG59XG5cbkJ1dHRvbi5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihwb2ludCkge1xuICByZXR1cm4gIShcbiAgICB0aGlzLnBvcy54ID4gcG9pbnQueCB8fFxuICAgIHRoaXMucG9zLnggKyB0aGlzLndpZHRoIDwgcG9pbnQueCB8fFxuICAgIHRoaXMucG9zLnkgPiBwb2ludC55IHx8XG4gICAgdGhpcy5wb3MueSArIHRoaXMuaGVpZ2h0IDwgcG9pbnQueVxuICApXG59XG5cbkJ1dHRvbi5TVEFURSA9IHtcbiAgTk9STUFMOiAnbm9ybWFsJyxcbiAgRE9XTjogJ2Rvd24nXG59XG4iLCIvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbnZhciBleHRlbmQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuIl19
;