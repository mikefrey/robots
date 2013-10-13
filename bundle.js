;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Switch = require('./switch')

var Ball = module.exports = function Ball(pos) {
  this.game = require('./game').game
  this.pos = pos
}

Ball.prototype.dropped = function() {
  var target = this.game.entityAt(this.pos, Switch.name)
  if (target) {
    return target.turnOn(this)
  }
  return true
}

Ball.prototype.pickedUp = function() {
  var target = this.game.entityAt(this.pos, Switch.name)
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

},{"./game":7,"./switch":15}],2:[function(require,module,exports){
var pubsub = require('./lib/pubsub')

var Button = module.exports = function Button(btn) {
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

  var rect = { x:0, y:0, w:this.width, h:this.height }
  var frame = this.state == Button.STATE.NORMAL ? this.frameOff : this.frameOn
  this.sprite.draw(ctx, frame, rect)

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

},{"./game":7,"./lib/pubsub":11}],3:[function(require,module,exports){
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

},{"./button":2,"./buttons":4,"./sprite":14}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var vector2 = require('./vector2')

var EntityManager = module.exports = function() {
  this.entities = []
  this.byType = {}
}

EntityManager.prototype.add = function(type, ent) {
  this.entities.push(ent)
  this.byType[type] || (this.byType[type] = [])
  this.byType[type].push(ent)
}

EntityManager.prototype.ofType = function(type) {
  return this.byType[type]
}

EntityManager.prototype.atPos = function(pos, type) {
  var ents = this.byType[type]
  for (var i = 0; i < ents.length; i+=1) {
    var ent = ents[i]
    if (vector2.equal(ent.pos, pos)) {
      return ent
    }
  }
  return null
}

EntityManager.prototype.invoke = function(fnName, args, type) {
  var ents = this.entities
  if (type) ents = this.byType[type]

  switch (args.length) {
    case 0: this._doInvoke0(fnName, ents); break
    case 1: this._doInvoke1(fnName, args, ents); break
    case 2: this._doInvoke1(fnName, args, ents); break
    case 3: this._doInvoke1(fnName, args, ents); break
    default: this._doInvokeA(fnName, args, ents);
  }
}

EntityManager.prototype._doInvoke0 = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName]()
  }
}

EntityManager.prototype._doInvoke1 = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName](args[0])
  }
}

EntityManager.prototype._doInvoke2 = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName](args[0], args[1])
  }
}

EntityManager.prototype._doInvoke3 = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName](args[0], args[1], args[2])
  }
}

EntityManager.prototype._doInvokeA = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName].apply(ents[i], args)
  }
}



},{"./vector2":18}],6:[function(require,module,exports){
var Switch = require('./switch')

var Exit = module.exports = function Exit(pos) {
  this.game = require('./game').game
  this.pos = pos
}

Exit.prototype.update = function() {

  this.state = Exit.STATE.INACTIVE
  if (this.allSwitchesOn()) {
    this.state = Exit.STATE.ACTIVE
  }

}

Exit.prototype.draw = function(ctx) {
  var scale = this.game.scale
  this.game.isoCtx(ctx, function() {
    ctx.translate(
      this.pos.x * scale + scale / 2,
      this.pos.y * scale + scale / 2
    )

    if (this.state == Exit.STATE.INACTIVE)
      ctx.fillStyle = '#CCCCCC'
    else
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

Exit.prototype.allSwitchesOn = function() {
  var ents = game.entitiesOfType(Switch.name)
  if (!ents || !ents.length) return true

  for (var i = 0; i < ents.length; i+=1) {
    if (ents[i].state === Switch.STATE.OFF)
      return false
  }

  return true
}

Exit.STATE = {
  ACTIVE : 1,
  INACTIVE : 0
}
},{"./game":7,"./switch":15}],7:[function(require,module,exports){
var vector2 = require('./vector2')
// var Level = require('./level')
var Input = require('./input')
var ButtonManager = require('./buttonManager')

var EntityManager = require('./entityManager')
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
  this.entities.invoke('update', [this.ctx], 'Robot')
  this.entities.invoke('update', [this.ctx], 'Ball')
  this.entities.invoke('update', [this.ctx], 'Switch')
  this.entities.invoke('update', [this.ctx], 'Exit')
}

// draw all the things
Game.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.width, this.height)
  // this.bgctx.clearRect(0, 0, this.width, this.height)
  // draw the level
  this.level.draw(this.ctx)

  // draw each entity
  this.entities.invoke('draw', [this.ctx], 'Exit')
  this.entities.invoke('draw', [this.ctx], 'Switch')
  this.entities.invoke('draw', [this.ctx], 'Robot')
  this.entities.invoke('draw', [this.ctx], 'Ball')

  // draw any UI last
  this.buttonManager.draw(this.ctx)
}

// get the entity at the given position
Game.prototype.entityAt = function(pos, type) {
  return this.entities.atPos(pos, type)
}

Game.prototype.entitiesOfType = function(type) {
  return this.entities.ofType(type)
}

// load the entities from the level
Game.prototype.loadEntities = function() {
  var ents = this.entities = new EntityManager()
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
        ents.add(Ent.name, ent)
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

},{"./ball":1,"./buttonManager":3,"./entityManager":5,"./exit":6,"./input":8,"./robot":12,"./switch":15,"./vector2":18}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){

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

},{"./ball":1,"./exit":6,"./game":7,"./robot":12,"./switch":15,"./tileset":17}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./extend":10}],12:[function(require,module,exports){
var vector2 = require('./vector2')
var pubsub = require('./lib/pubsub')

var Ball = require('./ball')

var Robot = module.exports = function Robot(pos) {
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
  var target = this.game.entityAt(vector2.add(this.pos, this.dir), Ball.name)
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

},{"./ball":1,"./game":7,"./lib/pubsub":11,"./vector2":18}],13:[function(require,module,exports){
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

},{"./game":7,"./level":9}],14:[function(require,module,exports){
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




},{"./lib/pubsub":11,"./texture":16}],15:[function(require,module,exports){

var Switch = module.exports = function Switch(pos) {
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

},{"./game":7}],16:[function(require,module,exports){
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


},{"./lib/pubsub":11}],17:[function(require,module,exports){
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



},{"./lib/pubsub":11,"./texture":16}],18:[function(require,module,exports){
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

},{}]},{},[13])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9taWtlL1Byb2plY3RzL3JvYm90cy9qcy9iYWxsLmpzIiwiL2hvbWUvbWlrZS9Qcm9qZWN0cy9yb2JvdHMvanMvYnV0dG9uLmpzIiwiL2hvbWUvbWlrZS9Qcm9qZWN0cy9yb2JvdHMvanMvYnV0dG9uTWFuYWdlci5qcyIsIi9ob21lL21pa2UvUHJvamVjdHMvcm9ib3RzL2pzL2J1dHRvbnMuanMiLCIvaG9tZS9taWtlL1Byb2plY3RzL3JvYm90cy9qcy9lbnRpdHlNYW5hZ2VyLmpzIiwiL2hvbWUvbWlrZS9Qcm9qZWN0cy9yb2JvdHMvanMvZXhpdC5qcyIsIi9ob21lL21pa2UvUHJvamVjdHMvcm9ib3RzL2pzL2dhbWUuanMiLCIvaG9tZS9taWtlL1Byb2plY3RzL3JvYm90cy9qcy9pbnB1dC5qcyIsIi9ob21lL21pa2UvUHJvamVjdHMvcm9ib3RzL2pzL2xldmVsLmpzIiwiL2hvbWUvbWlrZS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2V4dGVuZC5qcyIsIi9ob21lL21pa2UvUHJvamVjdHMvcm9ib3RzL2pzL2xpYi9wdWJzdWIuanMiLCIvaG9tZS9taWtlL1Byb2plY3RzL3JvYm90cy9qcy9yb2JvdC5qcyIsIi9ob21lL21pa2UvUHJvamVjdHMvcm9ib3RzL2pzL3NjcmlwdC5qcyIsIi9ob21lL21pa2UvUHJvamVjdHMvcm9ib3RzL2pzL3Nwcml0ZS5qcyIsIi9ob21lL21pa2UvUHJvamVjdHMvcm9ib3RzL2pzL3N3aXRjaC5qcyIsIi9ob21lL21pa2UvUHJvamVjdHMvcm9ib3RzL2pzL3RleHR1cmUuanMiLCIvaG9tZS9taWtlL1Byb2plY3RzL3JvYm90cy9qcy90aWxlc2V0LmpzIiwiL2hvbWUvbWlrZS9Qcm9qZWN0cy9yb2JvdHMvanMvdmVjdG9yMi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vc3dpdGNoJylcblxudmFyIEJhbGwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEJhbGwocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3Ncbn1cblxuQmFsbC5wcm90b3R5cGUuZHJvcHBlZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGFyZ2V0ID0gdGhpcy5nYW1lLmVudGl0eUF0KHRoaXMucG9zLCBTd2l0Y2gubmFtZSlcbiAgaWYgKHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQudHVybk9uKHRoaXMpXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuQmFsbC5wcm90b3R5cGUucGlja2VkVXAgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRhcmdldCA9IHRoaXMuZ2FtZS5lbnRpdHlBdCh0aGlzLnBvcywgU3dpdGNoLm5hbWUpXG4gIGlmICh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGFyZ2V0LnR1cm5PZmYodGhpcylcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5CYWxsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcblxufVxuXG5CYWxsLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBkMnIgPSB0aGlzLmdhbWUuZDJyXG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICB0aGlzLmdhbWUuaXNvQ3R4KGN0eCwgZnVuY3Rpb24oKSB7XG4gICAgY3R4LnRyYW5zbGF0ZShcbiAgICAgIHRoaXMucG9zLnggKiBzY2FsZSArIHNjYWxlIC8gMixcbiAgICAgIHRoaXMucG9zLnkgKiBzY2FsZSArIHNjYWxlIC8gMlxuICAgIClcblxuICAgIHZhciByYWRpdXMgPSBzY2FsZSowLjNcblxuICAgIGN0eC5maWxsU3R5bGUgPSAnIzc3NzdGRidcbiAgICBjdHguYmVnaW5QYXRoKClcbiAgICBjdHguYXJjKDAsIDAsIHJhZGl1cywgZDJyKDApLCBkMnIoMzYwKSlcbiAgICBjdHguZmlsbCgpXG4gICAgY3R4LnN0cm9rZSgpXG4gIH0uYmluZCh0aGlzKSlcbn1cbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxuXG52YXIgQnV0dG9uID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBCdXR0b24oYnRuKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgLy8gY29weSBvdmVyIHRoZSBidG4gcHJvcGVydGllc1xuICBmb3IgKHZhciBrIGluIGJ0bikge1xuICAgIHRoaXNba10gPSBidG5ba11cbiAgfVxuICB0aGlzLnN0YXRlID0gQnV0dG9uLlNUQVRFLk5PUk1BTFxufVxuXG5CdXR0b24ucHJvdG90eXBlLnRhcHBlZCA9IGZ1bmN0aW9uKCkge1xuICBwdWJzdWIudHJpZ2dlcignY29tbWFuZEJ1dHRvblByZXNzZWQnLCBbdGhpcy5jb21tYW5kXSlcbn1cblxuQnV0dG9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zdGF0ZSA9IEJ1dHRvbi5TVEFURS5OT1JNQUxcbiAgdmFyIHN0YXJ0ID0gdGhpcy5nYW1lLmlucHV0LnN0YXJ0XG4gIHZhciBjdXJyZW50ID0gdGhpcy5nYW1lLmlucHV0LmN1cnJlbnRcbiAgdmFyIHByZXZpb3VzID0gdGhpcy5nYW1lLmlucHV0LnByZXZpb3VzXG5cbiAgaWYgKGN1cnJlbnQpIHtcbiAgICBpZiAodGhpcy5jb250YWlucyhjdXJyZW50KSAmJiB0aGlzLmNvbnRhaW5zKHN0YXJ0KSkge1xuICAgICAgdGhpcy5zdGF0ZSA9IEJ1dHRvbi5TVEFURS5ET1dOXG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKHByZXZpb3VzICYmIHRoaXMuY29udGFpbnMocHJldmlvdXMuZW5kKSAmJiB0aGlzLmNvbnRhaW5zKHByZXZpb3VzLnN0YXJ0KSkge1xuICAgIHRoaXMudGFwcGVkKClcbiAgICB0aGlzLmdhbWUuaW5wdXQucHJldmlvdXMgPSBudWxsXG4gIH1cbn1cblxuQnV0dG9uLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGN0eC5zYXZlKClcbiAgY3R4LnRyYW5zbGF0ZSh0aGlzLnBvcy54LCB0aGlzLnBvcy55KVxuXG4gIHZhciByZWN0ID0geyB4OjAsIHk6MCwgdzp0aGlzLndpZHRoLCBoOnRoaXMuaGVpZ2h0IH1cbiAgdmFyIGZyYW1lID0gdGhpcy5zdGF0ZSA9PSBCdXR0b24uU1RBVEUuTk9STUFMID8gdGhpcy5mcmFtZU9mZiA6IHRoaXMuZnJhbWVPblxuICB0aGlzLnNwcml0ZS5kcmF3KGN0eCwgZnJhbWUsIHJlY3QpXG5cbiAgY3R4LnJlc3RvcmUoKVxufVxuXG5CdXR0b24ucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgcmV0dXJuICEoXG4gICAgdGhpcy5wb3MueCA+IHBvaW50LnggfHxcbiAgICB0aGlzLnBvcy54ICsgdGhpcy53aWR0aCA8IHBvaW50LnggfHxcbiAgICB0aGlzLnBvcy55ID4gcG9pbnQueSB8fFxuICAgIHRoaXMucG9zLnkgKyB0aGlzLmhlaWdodCA8IHBvaW50LnlcbiAgKVxufVxuXG5CdXR0b24uU1RBVEUgPSB7XG4gIE5PUk1BTDogJ25vcm1hbCcsXG4gIERPV046ICdkb3duJ1xufVxuIiwidmFyIGJ1dHRvbkRlZnMgPSByZXF1aXJlKCcuL2J1dHRvbnMnKVxudmFyIEJ1dHRvbiA9IHJlcXVpcmUoJy4vYnV0dG9uJylcbnZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpXG5cbnZhciBCdXR0b25NYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zcHJpdGVzID0ge31cbiAgZm9yICh2YXIga2V5IGluIGJ1dHRvbkRlZnMuc3ByaXRlcykge1xuICAgIHZhciBzcHIgPSBidXR0b25EZWZzLnNwcml0ZXNba2V5XVxuICAgIHZhciBzcHJpdGUgPSBuZXcgU3ByaXRlKHNwcilcbiAgICB0aGlzLnNwcml0ZXNba2V5XSA9IHNwcml0ZVxuICB9XG5cbiAgdGhpcy5idXR0b25zID0gW11cbiAgZm9yICh2YXIga2V5IGluIGJ1dHRvbkRlZnMuYnV0dG9ucykge1xuICAgIHZhciBidG4gPSBidXR0b25EZWZzLmJ1dHRvbnNba2V5XVxuICAgIGJ0bi5zcHJpdGUgPSB0aGlzLnNwcml0ZXNbYnRuLnNwcml0ZV1cbiAgICB2YXIgYnV0dG9uID0gbmV3IEJ1dHRvbihidG4pXG4gICAgdGhpcy5idXR0b25zLnB1c2goYnV0dG9uKVxuICB9XG59XG5cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrPTEpIHtcbiAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlKClcbiAgfVxufVxuXG5CdXR0b25NYW5hZ2VyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS5kcmF3KGN0eClcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgc3ByaXRlczoge1xuICAgIGJ1dHRvbnM6IHtcbiAgICAgIHRleHR1cmU6ICdpbWFnZXMvYnV0dG9ucy5wbmcnLFxuICAgICAgd2lkdGg6IDgwLFxuICAgICAgaGVpZ2h0OiA4MFxuICAgIH1cbiAgfSxcblxuICBidXR0b25zOiB7XG5cbiAgICBmb3J3YXJkOiB7XG4gICAgICBwb3M6IHsgeDowLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjowLFxuICAgICAgZnJhbWVPbjoxLFxuICAgICAgY29tbWFuZDogJ21vdmVGb3J3YXJkJ1xuICAgIH0sXG5cbiAgICBiYWNrd2FyZDoge1xuICAgICAgcG9zOiB7IHg6ODAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjIsXG4gICAgICBmcmFtZU9uOjMsXG4gICAgICBjb21tYW5kOiAnbW92ZUJhY2t3YXJkJ1xuICAgIH0sXG5cbiAgICBsZWZ0OiB7XG4gICAgICBwb3M6IHsgeDoxNzAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjQsXG4gICAgICBmcmFtZU9uOjUsXG4gICAgICBjb21tYW5kOiAndHVybkxlZnQnXG4gICAgfSxcblxuICAgIHJpZ2h0OiB7XG4gICAgICBwb3M6IHsgeDoyNTAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjYsXG4gICAgICBmcmFtZU9uOjcsXG4gICAgICBjb21tYW5kOiAndHVyblJpZ2h0J1xuICAgIH0sXG5cbiAgICBwaWNrdXA6IHtcbiAgICAgIHBvczogeyB4OjM0MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6OCxcbiAgICAgIGZyYW1lT246OSxcbiAgICAgIGNvbW1hbmQ6ICdwaWNrdXAnXG4gICAgfSxcblxuICAgIHJlbGVhc2U6IHtcbiAgICAgIHBvczogeyB4OjQyMCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6MTAsXG4gICAgICBmcmFtZU9uOjExLFxuICAgICAgY29tbWFuZDogJ3JlbGVhc2UnXG4gICAgfSxcblxuICAgIHN0YXJ0OiB7XG4gICAgICBwb3M6IHsgeDo1NDAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjEyLFxuICAgICAgZnJhbWVPbjoxMyxcbiAgICAgIGNvbW1hbmQ6ICdzdGFydCdcbiAgICB9LFxuXG4gICAgdHVybkFyb3VuZDoge1xuICAgICAgcG9zOiB7IHg6NjYwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjo2LFxuICAgICAgZnJhbWVPbjo3LFxuICAgICAgY29tbWFuZDogJ3R1cm5Bcm91bmQnXG4gICAgfSxcblxuICAgIHJlc3RhcnQ6IHtcbiAgICAgIHBvczogeyB4Ojc4MCwgeTowIH0sXG4gICAgICB3aWR0aDo0MCxcbiAgICAgIGhlaWdodDo0MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6NixcbiAgICAgIGZyYW1lT246NyxcbiAgICAgIGNvbW1hbmQ6ICdyZXN0YXJ0J1xuICAgIH1cblxuICB9XG59XG4iLCJ2YXIgdmVjdG9yMiA9IHJlcXVpcmUoJy4vdmVjdG9yMicpXG5cbnZhciBFbnRpdHlNYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbnRpdGllcyA9IFtdXG4gIHRoaXMuYnlUeXBlID0ge31cbn1cblxuRW50aXR5TWFuYWdlci5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24odHlwZSwgZW50KSB7XG4gIHRoaXMuZW50aXRpZXMucHVzaChlbnQpXG4gIHRoaXMuYnlUeXBlW3R5cGVdIHx8ICh0aGlzLmJ5VHlwZVt0eXBlXSA9IFtdKVxuICB0aGlzLmJ5VHlwZVt0eXBlXS5wdXNoKGVudClcbn1cblxuRW50aXR5TWFuYWdlci5wcm90b3R5cGUub2ZUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICByZXR1cm4gdGhpcy5ieVR5cGVbdHlwZV1cbn1cblxuRW50aXR5TWFuYWdlci5wcm90b3R5cGUuYXRQb3MgPSBmdW5jdGlvbihwb3MsIHR5cGUpIHtcbiAgdmFyIGVudHMgPSB0aGlzLmJ5VHlwZVt0eXBlXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgdmFyIGVudCA9IGVudHNbaV1cbiAgICBpZiAodmVjdG9yMi5lcXVhbChlbnQucG9zLCBwb3MpKSB7XG4gICAgICByZXR1cm4gZW50XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbkVudGl0eU1hbmFnZXIucHJvdG90eXBlLmludm9rZSA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgdHlwZSkge1xuICB2YXIgZW50cyA9IHRoaXMuZW50aXRpZXNcbiAgaWYgKHR5cGUpIGVudHMgPSB0aGlzLmJ5VHlwZVt0eXBlXVxuXG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHRoaXMuX2RvSW52b2tlMChmbk5hbWUsIGVudHMpOyBicmVha1xuICAgIGNhc2UgMTogdGhpcy5fZG9JbnZva2UxKGZuTmFtZSwgYXJncywgZW50cyk7IGJyZWFrXG4gICAgY2FzZSAyOiB0aGlzLl9kb0ludm9rZTEoZm5OYW1lLCBhcmdzLCBlbnRzKTsgYnJlYWtcbiAgICBjYXNlIDM6IHRoaXMuX2RvSW52b2tlMShmbk5hbWUsIGFyZ3MsIGVudHMpOyBicmVha1xuICAgIGRlZmF1bHQ6IHRoaXMuX2RvSW52b2tlQShmbk5hbWUsIGFyZ3MsIGVudHMpO1xuICB9XG59XG5cbkVudGl0eU1hbmFnZXIucHJvdG90eXBlLl9kb0ludm9rZTAgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXSgpXG4gIH1cbn1cblxuRW50aXR5TWFuYWdlci5wcm90b3R5cGUuX2RvSW52b2tlMSA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdKGFyZ3NbMF0pXG4gIH1cbn1cblxuRW50aXR5TWFuYWdlci5wcm90b3R5cGUuX2RvSW52b2tlMiA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gIH1cbn1cblxuRW50aXR5TWFuYWdlci5wcm90b3R5cGUuX2RvSW52b2tlMyA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gIH1cbn1cblxuRW50aXR5TWFuYWdlci5wcm90b3R5cGUuX2RvSW52b2tlQSA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdLmFwcGx5KGVudHNbaV0sIGFyZ3MpXG4gIH1cbn1cblxuXG4iLCJ2YXIgU3dpdGNoID0gcmVxdWlyZSgnLi9zd2l0Y2gnKVxuXG52YXIgRXhpdCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gRXhpdChwb3MpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLnBvcyA9IHBvc1xufVxuXG5FeGl0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcblxuICB0aGlzLnN0YXRlID0gRXhpdC5TVEFURS5JTkFDVElWRVxuICBpZiAodGhpcy5hbGxTd2l0Y2hlc09uKCkpIHtcbiAgICB0aGlzLnN0YXRlID0gRXhpdC5TVEFURS5BQ1RJVkVcbiAgfVxuXG59XG5cbkV4aXQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgdmFyIHNjYWxlID0gdGhpcy5nYW1lLnNjYWxlXG4gIHRoaXMuZ2FtZS5pc29DdHgoY3R4LCBmdW5jdGlvbigpIHtcbiAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgdGhpcy5wb3MueCAqIHNjYWxlICsgc2NhbGUgLyAyLFxuICAgICAgdGhpcy5wb3MueSAqIHNjYWxlICsgc2NhbGUgLyAyXG4gICAgKVxuXG4gICAgaWYgKHRoaXMuc3RhdGUgPT0gRXhpdC5TVEFURS5JTkFDVElWRSlcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI0NDQ0NDQydcbiAgICBlbHNlXG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnXG5cbiAgICBjdHguYmVnaW5QYXRoKClcbiAgICBjdHgucmVjdChcbiAgICAgIHNjYWxlICogLTAuMyxcbiAgICAgIHNjYWxlICogLTAuMyxcbiAgICAgIHNjYWxlICogMC42LFxuICAgICAgc2NhbGUgKiAwLjZcbiAgICApXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuICB9LmJpbmQodGhpcykpXG59XG5cbkV4aXQucHJvdG90eXBlLmFsbFN3aXRjaGVzT24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGVudHMgPSBnYW1lLmVudGl0aWVzT2ZUeXBlKFN3aXRjaC5uYW1lKVxuICBpZiAoIWVudHMgfHwgIWVudHMubGVuZ3RoKSByZXR1cm4gdHJ1ZVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cy5sZW5ndGg7IGkrPTEpIHtcbiAgICBpZiAoZW50c1tpXS5zdGF0ZSA9PT0gU3dpdGNoLlNUQVRFLk9GRilcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuRXhpdC5TVEFURSA9IHtcbiAgQUNUSVZFIDogMSxcbiAgSU5BQ1RJVkUgOiAwXG59IiwidmFyIHZlY3RvcjIgPSByZXF1aXJlKCcuL3ZlY3RvcjInKVxuLy8gdmFyIExldmVsID0gcmVxdWlyZSgnLi9sZXZlbCcpXG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0JylcbnZhciBCdXR0b25NYW5hZ2VyID0gcmVxdWlyZSgnLi9idXR0b25NYW5hZ2VyJylcblxudmFyIEVudGl0eU1hbmFnZXIgPSByZXF1aXJlKCcuL2VudGl0eU1hbmFnZXInKVxudmFyIEJhbGwgPSByZXF1aXJlKCcuL2JhbGwnKVxudmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vc3dpdGNoJylcbnZhciBSb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxudmFyIEV4aXQgPSByZXF1aXJlKCcuL2V4aXQnKVxuXG4vLyBkZWdyZWVzIHRvIHJhZGlhbnNcbmZ1bmN0aW9uIGQycihhKSB7XG4gIHJldHVybiBhICogKE1hdGguUEkvMTgwKVxufVxuXG4vLyByYWRpYW5zIHRvIGRlZ3Jlc3NcbmZ1bmN0aW9uIHIyZChhKSB7XG4gIHJldHVybiBhIC8gKE1hdGguUEkvMTgwKVxufVxuXG5cbnZhciBHYW1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzKSB7XG4gIEdhbWUuZ2FtZSA9IHRoaXNcblxuICB0aGlzLnNjYWxlID0gb3B0cy5zY2FsZVxuICB2YXIgd2lkdGggPSB0aGlzLndpZHRoID0gb3B0cy53aWR0aFxuICB2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSBvcHRzLmhlaWdodFxuICB0aGlzLmdyaWRTaXplID0gb3B0cy5ncmlkU2l6ZVxuICB0aGlzLnRvcE1hcmdpbiA9IG9wdHMudG9wTWFyZ2luXG5cbiAgLy8gc2V0dXAgdGhlIGNhbnZhc2VzXG4gIHRoaXMuY3R4ID0gdGhpcy5pbml0Q2FudmFzKG9wdHMuY2FudmFzLCB3aWR0aCwgaGVpZ2h0KVxuICAvLyB0aGlzLmJnY3R4ID0gdGhpcy5pbml0Q2FudmFzKG9wdHMuYmdjYW52YXMsIHdpZHRoLCBoZWlnaHQpXG5cbiAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dChvcHRzLmNhbnZhcylcbiAgdGhpcy5idXR0b25NYW5hZ2VyID0gbmV3IEJ1dHRvbk1hbmFnZXIoKVxufVxuXG5HYW1lLnByb3RvdHlwZS5sb2FkTGV2ZWwgPSBmdW5jdGlvbihMZXZlbCkge1xuICB2YXIgbGV2ZWwgPSB0aGlzLmxldmVsID0gbmV3IExldmVsKHRoaXMpXG4gIHRoaXMubG9hZEVudGl0aWVzKClcbn1cblxuLy8gc3RhcnRzIHRoZSBnYW1lIGxvb3BcbkdhbWUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubG9vcCgpXG59XG5cbi8vIHN1c3BlbmRzIHRoZSBnYW1lIGxvb3BcbkdhbWUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yQUZJRClcbn1cbkdhbWUucHJvdG90eXBlLnBhdXNlID0gR2FtZS5wcm90b3R5cGUuc3RvcFxuXG4vLyB0aGUgZ2FtZSBsb29wXG5HYW1lLnByb3RvdHlwZS5sb29wID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuckFGSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcyksIHRoaXMuY3R4LmNhbnZhcylcblxuICBzdGF0cy5iZWdpbigpO1xuXG4gIHRoaXMudXBkYXRlKClcbiAgdGhpcy5kcmF3KClcblxuICBzdGF0cy5lbmQoKTtcbn1cblxuLy8gdXBkYXRlIGFsbCB0aGUgdGhpbmdzXG5HYW1lLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5idXR0b25NYW5hZ2VyLnVwZGF0ZSgpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKCd1cGRhdGUnLCBbdGhpcy5jdHhdLCAnUm9ib3QnKVxuICB0aGlzLmVudGl0aWVzLmludm9rZSgndXBkYXRlJywgW3RoaXMuY3R4XSwgJ0JhbGwnKVxuICB0aGlzLmVudGl0aWVzLmludm9rZSgndXBkYXRlJywgW3RoaXMuY3R4XSwgJ1N3aXRjaCcpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKCd1cGRhdGUnLCBbdGhpcy5jdHhdLCAnRXhpdCcpXG59XG5cbi8vIGRyYXcgYWxsIHRoZSB0aGluZ3NcbkdhbWUucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuICAvLyB0aGlzLmJnY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcbiAgLy8gZHJhdyB0aGUgbGV2ZWxcbiAgdGhpcy5sZXZlbC5kcmF3KHRoaXMuY3R4KVxuXG4gIC8vIGRyYXcgZWFjaCBlbnRpdHlcbiAgdGhpcy5lbnRpdGllcy5pbnZva2UoJ2RyYXcnLCBbdGhpcy5jdHhdLCAnRXhpdCcpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKCdkcmF3JywgW3RoaXMuY3R4XSwgJ1N3aXRjaCcpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKCdkcmF3JywgW3RoaXMuY3R4XSwgJ1JvYm90JylcbiAgdGhpcy5lbnRpdGllcy5pbnZva2UoJ2RyYXcnLCBbdGhpcy5jdHhdLCAnQmFsbCcpXG5cbiAgLy8gZHJhdyBhbnkgVUkgbGFzdFxuICB0aGlzLmJ1dHRvbk1hbmFnZXIuZHJhdyh0aGlzLmN0eClcbn1cblxuLy8gZ2V0IHRoZSBlbnRpdHkgYXQgdGhlIGdpdmVuIHBvc2l0aW9uXG5HYW1lLnByb3RvdHlwZS5lbnRpdHlBdCA9IGZ1bmN0aW9uKHBvcywgdHlwZSkge1xuICByZXR1cm4gdGhpcy5lbnRpdGllcy5hdFBvcyhwb3MsIHR5cGUpXG59XG5cbkdhbWUucHJvdG90eXBlLmVudGl0aWVzT2ZUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICByZXR1cm4gdGhpcy5lbnRpdGllcy5vZlR5cGUodHlwZSlcbn1cblxuLy8gbG9hZCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgbGV2ZWxcbkdhbWUucHJvdG90eXBlLmxvYWRFbnRpdGllcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZW50cyA9IHRoaXMuZW50aXRpZXMgPSBuZXcgRW50aXR5TWFuYWdlcigpXG4gIHZhciBtYXAgPSB0aGlzLmxldmVsLmVudGl0eU1hcFxuICBmb3IgKHZhciB5ID0gMDsgeSA8IG1hcC5sZW5ndGg7IHkrPTEpIHtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG1hcFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgICAgIHZhciBFbnQgPSBtYXBbeV1beF1cbiAgICAgIGlmIChFbnQpIHtcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBlbnRpdHlcbiAgICAgICAgdmFyIGVudCA9IG5ldyBFbnQoe3g6eCx5Onl9KVxuICAgICAgICAvLyBjaGVjayB0byBzZWUgaWYgaXQncyB0aGUgcm9ib3RcbiAgICAgICAgaWYgKGVudCBpbnN0YW5jZW9mIFJvYm90KSB0aGlzLnJvYm90ID0gZW50XG4gICAgICAgIC8vIGFkZCBpdCB0byB0aGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICAgICAgZW50cy5hZGQoRW50Lm5hbWUsIGVudClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxudmFyIHRoZXRhID0gZDJyKDQ1KVxudmFyIGNzVGhldGEgPSBNYXRoLmNvcyh0aGV0YSlcbnZhciBzblRoZXRhID0gTWF0aC5zaW4odGhldGEpXG52YXIgdGhldGFJbnYgPSBkMnIoMzE1KVxudmFyIGNzVGhldGFJbnYgPSBNYXRoLmNvcyh0aGV0YUludilcbnZhciBzblRoZXRhSW52ID0gTWF0aC5zaW4odGhldGFJbnYpXG5cbi8vIHRyYW5zbGF0ZSBzY3JlZW4gdG8gd29ybGRcbkdhbWUucHJvdG90eXBlLnMydyA9IGZ1bmN0aW9uKHBvcykge1xuICAvLyByb3RhdGVcbiAgdmFyIHggPSBwb3MueFxuICB2YXIgeSA9IHBvcy55XG4gIHBvcy54ID0geCAqIGNzVGhldGEgLSB5ICogc25UaGV0YVxuICBwb3MueSA9IHggKiBzblRoZXRhICsgeSAqIGNzVGhldGFcbiAgLy8gc2NhbGVcbiAgcG9zLnkgKj0gMC41XG4gIC8vIHRyYW5zbGF0ZVxuICBwb3MueCArPSB0aGlzLndpZHRoLzJcbiAgcG9zLnkgKz0gdGhpcy50b3BNYXJnaW5cbiAgcmV0dXJuIHBvc1xufVxuXG4vLyB0cmFuc2xhdGUgd29ybGQgdG8gc2NyZWVuXG5HYW1lLnByb3RvdHlwZS53MnMgPSBmdW5jdGlvbihwb3MpIHtcbiAgLy8gdHJhbnNsYXRlXG4gIHBvcy54IC09IHRoaXMud2lkdGgvMlxuICBwb3MueSAtPSB0aGlzLnRvcE1hcmdpblxuICAvLyBzY2FsZVxuICBwb3MueSAvPSAwLjVcbiAgLy8gcm90YXRlXG4gIHZhciB5ID0gcG9zLnlcbiAgdmFyIHggPSBwb3MueFxuICBwb3MueCA9IHggKiBjc1RoZXRhSW52IC0geSAqIHNuVGhldGFJbnZcbiAgcG9zLnkgPSB4ICogc25UaGV0YUludiArIHkgKiBjc1RoZXRhSW52XG4gIHJldHVybiBwb3Ncbn1cblxuLy8gc2V0dXAgY2FudmFzZSBlbGVtZW50cyB0byB0aGUgY29ycmVjdCBzaXplXG5HYW1lLnByb3RvdHlwZS5pbml0Q2FudmFzID0gZnVuY3Rpb24oaWQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICBjYW52YXMud2lkdGggPSB3aWR0aFxuICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIHJldHVybiBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxufVxuXG4vLyB0cmFuc2Zvcm0gdGhlIGNvbnRleHQgaW50byBpc29tZXRyaWNcbkdhbWUucHJvdG90eXBlLmlzb0N0eCA9IGZ1bmN0aW9uKGN0eCwgZm4pIHtcbiAgY3R4LnNhdmUoKVxuXG4gIC8vIG1vdmUgdGhlIGdhbWUgYm9hcmQgZG93biBhIGJpdFxuICBjdHgudHJhbnNsYXRlKDAsIHRoaXMudG9wTWFyZ2luKVxuICBjdHgudHJhbnNsYXRlKHRoaXMud2lkdGgvMiwgMClcbiAgY3R4LnNjYWxlKDEsIDAuNSlcbiAgY3R4LnJvdGF0ZSg0NSAqIE1hdGguUEkgLyAxODApXG4gIC8vIGN0eC50cmFuc2Zvcm0oMC43MDcsIDAuNDA5LCAtMC43MDcsIDAuNDA5LCAwLCAwKVxuICBmbigpXG4gIGN0eC5yZXN0b3JlKClcbn1cblxuR2FtZS5wcm90b3R5cGUuZDJyID0gZDJyXG5cbkdhbWUucHJvdG90eXBlLnIyZCA9IHIyZFxuIiwidmFyIElucHV0ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpZCkge1xuICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMudG91Y2hTdGFydC5iaW5kKHRoaXMpLCBmYWxzZSlcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy50b3VjaE1vdmUuYmluZCh0aGlzKSwgZmFsc2UpXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy50b3VjaEVuZC5iaW5kKHRoaXMpLCBmYWxzZSlcbn1cblxuXG5JbnB1dC5wcm90b3R5cGUudG91Y2hTdGFydCA9IGZ1bmN0aW9uKGV2KSB7XG4gIHRoaXMuc3RhcnQgPSBldi50b3VjaGVzWzBdXG4gIHRoaXMudG91Y2hNb3ZlKGV2KVxufVxuXG5JbnB1dC5wcm90b3R5cGUudG91Y2hNb3ZlID0gZnVuY3Rpb24oZXYpIHtcbiAgdGhpcy5wcmV2aW91cyA9IHRoaXMuY3VycmVudFxuICB0aGlzLmN1cnJlbnQgPSBldi50b3VjaGVzWzBdXG4gIHRoaXMuY3VycmVudC54ID0gdGhpcy5jdXJyZW50LmNsaWVudFhcbiAgdGhpcy5jdXJyZW50LnkgPSB0aGlzLmN1cnJlbnQuY2xpZW50WVxufVxuXG5JbnB1dC5wcm90b3R5cGUudG91Y2hFbmQgPSBmdW5jdGlvbihldikge1xuICB0aGlzLnByZXZpb3VzID0ge1xuICAgIHN0YXJ0OiB0aGlzLnN0YXJ0LFxuICAgIGVuZDogdGhpcy5jdXJyZW50XG4gIH1cbiAgdGhpcy5jdXJyZW50ID0gbnVsbFxuICB0aGlzLnN0YXJ0ID0gbnVsbFxufVxuIiwiXG52YXIgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbCcpXG52YXIgU3dpdGNoID0gcmVxdWlyZSgnLi9zd2l0Y2gnKVxudmFyIFJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG52YXIgRXhpdCA9IHJlcXVpcmUoJy4vZXhpdCcpXG52YXIgVGlsZVNldCA9IHJlcXVpcmUoJy4vdGlsZXNldCcpXG5cbnZhciBfID0gMFxudmFyIEIgPSBCYWxsXG52YXIgUyA9IFN3aXRjaFxudmFyIFIgPSBSb2JvdFxudmFyIEUgPSBFeGl0XG5cbnZhciBMZXZlbCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZ2FtZSkge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIHRoaXMudGlsZXMgPSBuZXcgVGlsZVNldCgnaW1hZ2VzL2lzb3RpbGVzLnBuZycsIDY0LCA2NCwgNCwgMTYpXG5cbiAgdmFyIHAxID0gdGhpcy5nYW1lLnMydyh7eDowLCB5OjB9KVxuICB2YXIgcDIgPSB0aGlzLmdhbWUuczJ3KHt4OjAsIHk6dGhpcy5nYW1lLnNjYWxlfSlcbiAgdGhpcy5pc29UaWxlV2lkdGggPSBNYXRoLmFicyhwMi54IC0gcDEueCkqMlxufVxuXG5MZXZlbC5wcm90b3R5cGUuZ3JpZCA9IFtcbiAgWzYsNiw2LDYsNiw2LDYsNiw2LDZdLFxuICBbNiw2LDYsNiw2LDYsNiw2LDYsNl0sXG4gIFs2LDYsNiw2LDYsNiw2LDYsNiw2XSxcbiAgW18sXyxfLDYsNiw2LDYsNiw2LDZdLFxuICBbNiw2LF8sNiw2LDYsNiw2LDYsNl0sXG4gIFs2LDYsXyw2LDYsNiw2LDYsNiw2XSxcbiAgWzYsNixfLDYsNiw2LDYsNiw2LDZdLFxuICBbNCw0LF8sNCw0LDQsNCw0LDQsNF0sXG4gIFtfLF8sXyxfLF8sXyxfLF8sXyxfXSxcbiAgW18sXyxfLF8sXyxfLF8sXyxfLF9dXG5dXG5cbkxldmVsLnByb3RvdHlwZS5lbnRpdHlNYXAgPSBbXG4gIFtfLF8sXyxfLF8sXyxfLF8sXyxfXSxcbiAgW18sUixfLEIsXyxfLF8sUyxfLF9dLFxuICBbXyxfLF8sXyxfLF8sXyxTLF8sX10sXG4gIFtfLF8sXyxfLEIsXyxfLF8sXyxfXSxcbiAgW18sXyxfLF8sXyxfLF8sXyxfLF9dLFxuICBbXyxfLF8sXyxfLF8sXyxfLF8sX10sXG4gIFtfLF8sXyxfLEIsXyxfLF8sXyxfXSxcbiAgW18sXyxfLF8sXyxfLF8sRSxfLF9dLFxuICBbXyxfLF8sXyxfLF8sXyxfLF8sX10sXG4gIFtfLF8sXyxfLF8sXyxfLF8sXyxfXVxuXVxuXG5cbkxldmVsLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZFxuICB2YXIgdGlsZXMgPSB0aGlzLnRpbGVzXG5cbiAgZm9yICh2YXIgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSs9MSkge1xuICAgIGZvciAodmFyIHggPSAwOyB4IDwgZ3JpZFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgICAgIHZhciBwb3MgPSB0aGlzLmdhbWUuczJ3KHt4Ongqc2NhbGUsIHk6eSpzY2FsZX0pXG4gICAgICB0aWxlcy5kcmF3KGN0eCwgZ3JpZFt5XVt4XSwgcG9zLngsIHBvcy55LCB0aGlzLmlzb1RpbGVXaWR0aClcblxuICAgICAgLy8gY3R4LmZpbGxTdHlsZSA9ICcjZmYwMDAwJ1xuICAgICAgLy8gY3R4LnN0cm9rZVN0eWxlID0gJyNmZmZmZmYnXG4gICAgICAvLyBjdHgucmVjdChwb3MueC0xLjUsIHBvcy55LTEuNSwgMywgMylcbiAgICAgIC8vIGN0eC5maWxsKClcbiAgICAgIC8vIGN0eC5zdHJva2UoKVxuICAgIH1cbiAgfVxuXG5cbiAgdGhpcy5nYW1lLmlzb0N0eChjdHgsIGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gLy8gZHJhdyB0aGUgZ3JpZCB0aWxlc1xuICAgIC8vIGZvciAodmFyIHkgPSAwOyB5IDwgZ3JpZC5sZW5ndGg7IHkrPTEpIHtcbiAgICAvLyAgIGZvciAodmFyIHggPSAwOyB4IDwgZ3JpZFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgICAvLyAgICAgLy8gZmlsbCB0aGUgdGlsZVxuICAgIC8vICAgICBpZiAoZ3JpZFt5XVt4XSkge1xuICAgIC8vICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwwLjE1KSdcbiAgICAvLyAgICAgICBjdHguZmlsbFJlY3QoeCpzY2FsZSArIHNjYWxlKjAuMSwgeSpzY2FsZSArIHNjYWxlKjAuMSwgc2NhbGUqMC44LCBzY2FsZSowLjgpXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyAvLyBkcmF3IHRoZSBncmlkIGxpbmVzXG4gICAgLy8gY3R4LnN0cm9rZVN0eWxlID0gJyM4ODg4ODgnXG4gICAgLy8gZm9yICh2YXIgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSs9MSkge1xuICAgIC8vICAgZm9yICh2YXIgeCA9IDA7IHggPCBncmlkW3ldLmxlbmd0aDsgeCs9MSkge1xuICAgIC8vICAgICBpZiAoZ3JpZFt5XVt4XSkge1xuICAgIC8vICAgICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIC8vICAgICAgIGN0eC5yZWN0KHgqc2NhbGUrMC41LCB5KnNjYWxlKzAuNSwgc2NhbGUsIHNjYWxlKVxuICAgIC8vICAgICAgIGN0eC5zdHJva2UoKVxuICAgIC8vICAgICB9XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gIH0pXG5cblxuXG59XG4iLCIvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbnZhciBleHRlbmQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJylcblxudmFyIEV2ZW50cyA9IHt9XG5cbkV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24oLyogU3RyaW5nICovIHRvcGljLCAvKiBBcnJheT8gKi8gYXJncykge1xuICAvLyBzdW1tYXJ5OlxuICAvLyAgICBQdWJsaXNoIHNvbWUgZGF0YSBvbiBhIG5hbWVkIHRvcGljLlxuICAvLyB0b3BpYzogU3RyaW5nXG4gIC8vICAgIFRoZSBjaGFubmVsIHRvIHB1Ymxpc2ggb25cbiAgLy8gYXJnczogQXJyYXk/XG4gIC8vICAgIFRoZSBkYXRhIHRvIHB1Ymxpc2guIEVhY2ggYXJyYXkgaXRlbSBpcyBjb252ZXJ0ZWQgaW50byBhbiBvcmRlcmVkXG4gIC8vICAgIGFyZ3VtZW50cyBvbiB0aGUgc3Vic2NyaWJlZCBmdW5jdGlvbnMuXG4gIC8vXG4gIC8vIGV4YW1wbGU6XG4gIC8vICAgIFB1Ymxpc2ggc3R1ZmYgb24gJy9zb21lL3RvcGljJy4gQW55dGhpbmcgc3Vic2NyaWJlZCB3aWxsIGJlIGNhbGxlZFxuICAvLyAgICB3aXRoIGEgZnVuY3Rpb24gc2lnbmF0dXJlIGxpa2U6IGZ1bmN0aW9uKGEsYixjKSB7IC4uLiB9XG4gIC8vXG4gIC8vICAgIHRyaWdnZXIoXCIvc29tZS90b3BpY1wiLCBbXCJhXCIsXCJiXCIsXCJjXCJdKVxuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuXG5cbiAgdmFyIHN1YnMgPSB0aGlzLl9ldmVudHNbdG9waWNdLFxuICAgIGxlbiA9IHN1YnMgPyBzdWJzLmxlbmd0aCA6IDBcblxuICAvL2NhbiBjaGFuZ2UgbG9vcCBvciByZXZlcnNlIGFycmF5IGlmIHRoZSBvcmRlciBtYXR0ZXJzXG4gIHdoaWxlIChsZW4tLSkge1xuICAgIHN1YnNbbGVuXS5hcHBseShFdmVudHMsIGFyZ3MgfHwgW10pXG4gIH1cbn1cblxuRXZlbnRzLm9uID0gZnVuY3Rpb24oLyogU3RyaW5nICovIHRvcGljLCAvKiBGdW5jdGlvbiAqLyBjYWxsYmFjaykge1xuICAvLyBzdW1tYXJ5OlxuICAvLyAgICBSZWdpc3RlciBhIGNhbGxiYWNrIG9uIGEgbmFtZWQgdG9waWMuXG4gIC8vIHRvcGljOiBTdHJpbmdcbiAgLy8gICAgVGhlIGNoYW5uZWwgdG8gc3Vic2NyaWJlIHRvXG4gIC8vIGNhbGxiYWNrOiBGdW5jdGlvblxuICAvLyAgICBUaGUgaGFuZGxlciBldmVudC4gQW55dGltZSBzb21ldGhpbmcgaXMgdHJpZ2dlcidlZCBvbiBhXG4gIC8vICAgIHN1YnNjcmliZWQgY2hhbm5lbCwgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlXG4gIC8vICAgIHB1Ymxpc2hlZCBhcnJheSBhcyBvcmRlcmVkIGFyZ3VtZW50cy5cbiAgLy9cbiAgLy8gcmV0dXJuczogQXJyYXlcbiAgLy8gICAgQSBoYW5kbGUgd2hpY2ggY2FuIGJlIHVzZWQgdG8gdW5zdWJzY3JpYmUgdGhpcyBwYXJ0aWN1bGFyIHN1YnNjcmlwdGlvbi5cbiAgLy9cbiAgLy8gZXhhbXBsZTpcbiAgLy8gICAgb24oXCIvc29tZS90b3BpY1wiLCBmdW5jdGlvbihhLCBiLCBjKSB7IC8qIGhhbmRsZSBkYXRhICovIH0pXG5cbiAgdGhpcy5fZXZlbnRzIHx8ICh0aGlzLl9ldmVudHMgPSB7fSlcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0b3BpY10pIHtcbiAgICB0aGlzLl9ldmVudHNbdG9waWNdID0gW11cbiAgfVxuICB0aGlzLl9ldmVudHNbdG9waWNdLnB1c2goY2FsbGJhY2spXG4gIHJldHVybiBbdG9waWMsIGNhbGxiYWNrXSAvLyBBcnJheVxufVxuXG5FdmVudHMub2ZmID0gZnVuY3Rpb24oLyogQXJyYXkgb3IgU3RyaW5nICovIGhhbmRsZSkge1xuICAvLyBzdW1tYXJ5OlxuICAvLyAgICBEaXNjb25uZWN0IGEgc3Vic2NyaWJlZCBmdW5jdGlvbiBmb3IgYSB0b3BpYy5cbiAgLy8gaGFuZGxlOiBBcnJheSBvciBTdHJpbmdcbiAgLy8gICAgVGhlIHJldHVybiB2YWx1ZSBmcm9tIGFuIGBvbmAgY2FsbC5cbiAgLy8gZXhhbXBsZTpcbiAgLy8gICAgdmFyIGhhbmRsZSA9IG9uKFwiL3NvbWUvdG9waWNcIiwgZnVuY3Rpb24oKSB7fSlcbiAgLy8gICAgb2ZmKGhhbmRsZSlcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVyblxuXG4gIHZhciBzdWJzID0gdGhpcy5fZXZlbnRzW3R5cGVvZiBoYW5kbGUgPT09ICdzdHJpbmcnID8gaGFuZGxlIDogaGFuZGxlWzBdXVxuICB2YXIgY2FsbGJhY2sgPSB0eXBlb2YgaGFuZGxlID09PSAnc3RyaW5nJyA/IGhhbmRsZVsxXSA6IGZhbHNlXG4gIHZhciBsZW4gPSBzdWJzID8gc3Vicy5sZW5ndGggOiAwXG5cbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgaWYgKHN1YnNbbGVuXSA9PT0gY2FsbGJhY2sgfHwgIWNhbGxiYWNrKSB7XG4gICAgICBzdWJzLnNwbGljZShsZW4sIDEpXG4gICAgfVxuICB9XG59XG5cbkV2ZW50cy5lY2hvID0gZnVuY3Rpb24oLyogU3RyaW5nICovIHRvcGljLCAvKiBPYmplY3QgKi8gZW1pdHRlcikge1xuICBlbWl0dGVyLm9uKHRvcGljLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRyaWdnZXIodG9waWMsIGFyZ3VtZW50cylcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5cbnZhciBwdWJzdWIgPSBtb2R1bGUuZXhwb3J0cyA9IHt9XG5cbnB1YnN1Yi5FdmVudHMgPSBFdmVudHNcbnB1YnN1Yi5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgZXh0ZW5kKG9iaiwgRXZlbnRzKVxufVxucHVic3ViLmV4dGVuZChwdWJzdWIpXG4iLCJ2YXIgdmVjdG9yMiA9IHJlcXVpcmUoJy4vdmVjdG9yMicpXG52YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcblxudmFyIEJhbGwgPSByZXF1aXJlKCcuL2JhbGwnKVxuXG52YXIgUm9ib3QgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFJvYm90KHBvcykge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIHRoaXMucG9zID0gcG9zXG4gIHRoaXMuZGlyID0geyB4OjEsIHk6MCB9XG4gIHRoaXMucXVldWUgPSBbXVxuICB0aGlzLmZyZXEgPSA0MDBcbiAgdGhpcy5ibG9ja2VkID0gZmFsc2VcblxuICBwdWJzdWIub24oJ2NvbW1hbmRCdXR0b25QcmVzc2VkJywgdGhpcy5lbnF1ZXVlLmJpbmQodGhpcykpXG59XG5cblJvYm90LnByb3RvdHlwZS5tb3ZlRm9yd2FyZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZ3JpZCA9IHRoaXMuZ2FtZS5sZXZlbC5ncmlkXG4gIHZhciBuZXdQb3MgPSB2ZWN0b3IyLmFkZCh0aGlzLnBvcywgdGhpcy5kaXIpXG4gIGlmICghZ3JpZFtuZXdQb3MueV0gfHwgIWdyaWRbbmV3UG9zLnldW25ld1Bvcy54XSkge1xuICAgIHRoaXMuYmxvY2soKVxuICB9IGVsc2Uge1xuICAgIHRoaXMucG9zID0gbmV3UG9zXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuUm9ib3QucHJvdG90eXBlLm1vdmVCYWNrd2FyZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZ3JpZCA9IHRoaXMuZ2FtZS5sZXZlbC5ncmlkXG4gIHZhciBuZXdQb3MgPSB2ZWN0b3IyLnN1YnRyYWN0KHRoaXMucG9zLCB0aGlzLmRpcilcbiAgaWYgKCFncmlkW25ld1Bvcy55XSB8fCAhZ3JpZFtuZXdQb3MueV1bbmV3UG9zLnhdKSB7XG4gICAgdGhpcy5ibG9jaygpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wb3MgPSBuZXdQb3NcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUudHVybkxlZnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHggPSB0aGlzLmRpci54XG4gIHZhciB5ID0gdGhpcy5kaXIueVxuICB0aGlzLmRpci54ID0geVxuICB0aGlzLmRpci55ID0gLXhcbiAgcmV0dXJuIHRoaXNcbn1cblxuUm9ib3QucHJvdG90eXBlLnR1cm5SaWdodCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IHRoaXMuZGlyLnhcbiAgdmFyIHkgPSB0aGlzLmRpci55XG4gIHRoaXMuZGlyLnggPSAteVxuICB0aGlzLmRpci55ID0geFxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUudHVybkFyb3VuZCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmRpci54ICo9IC0xXG4gIHRoaXMuZGlyLnkgKj0gLTFcbiAgcmV0dXJuIHRoaXNcbn1cblxuUm9ib3QucHJvdG90eXBlLnBpY2t1cCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGFyZ2V0ID0gdGhpcy5nYW1lLmVudGl0eUF0KHZlY3RvcjIuYWRkKHRoaXMucG9zLCB0aGlzLmRpciksIEJhbGwubmFtZSlcbiAgaWYgKHRhcmdldCAmJiB0YXJnZXQucGlja2VkVXAoKSkge1xuICAgIHRoaXMuYmFsbCA9IHRhcmdldFxuICB9IGVsc2Uge1xuICAgIHRoaXMuYmxvY2soKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cblJvYm90LnByb3RvdHlwZS5yZWxlYXNlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmJhbGwgJiYgdGhpcy5iYWxsLmRyb3BwZWQoKSkge1xuICAgIHRoaXMuYmFsbCA9IG51bGxcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmJsb2NrKClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUubW92ZUJhbGwgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYmFsbCkge1xuICAgIHRoaXMuYmFsbC5wb3MgPSB2ZWN0b3IyLmFkZCh0aGlzLnBvcywgdGhpcy5kaXIpXG4gIH1cbn1cblxuUm9ib3QucHJvdG90eXBlLmJsb2NrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuYmxvY2tlZCA9IHRydWVcbn1cblxuUm9ib3QucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbihmbmFtZSkge1xuICBpZiAoZm5hbWUgPT09ICdzdGFydCcpIHJldHVybiB0aGlzLnN0YXJ0KClcbiAgaWYgKHR5cGVvZiB0aGlzW2ZuYW1lXSA9PSAnZnVuY3Rpb24nKVxuICAgIHRoaXMucXVldWUucHVzaChmbmFtZSlcbn1cblxuUm9ib3QucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RlcCgpXG59XG5cblJvYm90LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICB9XG59XG5cblJvYm90LnByb3RvdHlwZS5zdGVwID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA9PSAwKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKHRoaXMuYmxvY2tlZCkge1xuICAgIHRoaXMucXVldWUgPSBbXVxuICAgIHJldHVyblxuICB9XG5cbiAgdmFyIGFjdGlvbiA9IHRoaXMucXVldWUuc2hpZnQoKVxuICB0aGlzW2FjdGlvbl0oKVxuICB0aGlzLm1vdmVCYWxsKClcbiAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLnN0ZXAuYmluZCh0aGlzKSwgdGhpcy5mcmVxKVxufVxuXG5Sb2JvdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG59XG5cblJvYm90LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuXG4gIHRoaXMuZ2FtZS5pc29DdHgoY3R4LCBmdW5jdGlvbigpIHtcblxuICAgIGN0eC5zYXZlKClcbiAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgdGhpcy5wb3MueCAqIHNjYWxlICsgc2NhbGUgLyAyLFxuICAgICAgdGhpcy5wb3MueSAqIHNjYWxlICsgc2NhbGUgLyAyXG4gICAgKVxuICAgIGN0eC5yb3RhdGUoTWF0aC5hdGFuMih0aGlzLmRpci55LCB0aGlzLmRpci54KSlcbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5ibG9ja2VkID8gJyNmZjAwMDAnIDogJyM0NDg4NDQnXG5cbiAgICBjdHguYmVnaW5QYXRoKClcbiAgICBjdHgucmVjdChcbiAgICAgIHNjYWxlICogLTAuMyxcbiAgICAgIHNjYWxlICogLTAuMyxcbiAgICAgIHNjYWxlICogMC42LFxuICAgICAgc2NhbGUgKiAwLjZcbiAgICApXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4Lm1vdmVUbygwLCAwKVxuICAgIGN0eC5saW5lVG8oc2NhbGUgKiAodGhpcy5iYWxsPzE6MC4zKSwgMClcbiAgICBjdHguc3Ryb2tlKClcbiAgICBjdHgucmVzdG9yZSgpXG5cbiAgfS5iaW5kKHRoaXMpKVxuICByZXR1cm4gdGhpc1xufVxuIiwid2luZG93LnN0YXRzID0gbmV3IFN0YXRzKCk7XG5zdGF0cy5zZXRNb2RlKDEpOyAvLyAwOiBmcHMsIDE6IG1zXG5zdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbnN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucmlnaHQgPSAnMHB4JztcbnN0YXRzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBzdGF0cy5kb21FbGVtZW50ICk7XG5cbnZhciBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJylcbnZhciBMZXZlbCA9IHJlcXVpcmUoJy4vbGV2ZWwnKVxuXG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lID0gbmV3IEdhbWUoe1xuICBzY2FsZTogNjQsXG4gIHdpZHRoOiAxMDI0LFxuICBoZWlnaHQ6IDc2OCxcbiAgZ3JpZFNpemU6IDEwLFxuICB0b3BNYXJnaW46IDE1MCxcbiAgY2FudmFzOiAnZ2FtZSdcbn0pXG5cbmdhbWUubG9hZExldmVsKExldmVsKVxuXG5nYW1lLnN0YXJ0KClcblxuLy8gZ2FtZS5sZXZlbC50aWxlcy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbi8vICAgZ2FtZS5kcmF3KClcbi8vIH1cbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIFRleHR1cmUgPSByZXF1aXJlKCcuL3RleHR1cmUnKVxuXG52YXIgU3ByaXRlID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHRcbiAgdGhpcy5mcmFtZXMgPSBbXVxuICB0aGlzLnRleHR1cmUgPSBuZXcgVGV4dHVyZShvcHRpb25zLnRleHR1cmUpXG4gIHRoaXMudGV4dHVyZS5vbignbG9hZCcsIHRoaXMuY2FsY3VsYXRlRnJhbWVzLmJpbmQodGhpcykpXG59XG5cbnZhciBhcGkgPSBTcHJpdGUucHJvdG90eXBlXG5wdWJzdWIuZXh0ZW5kKGFwaSlcblxuYXBpLmNhbGN1bGF0ZUZyYW1lcyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnTE9BREVEIFNQUklURScsIHRoaXMudGV4dHVyZS5pbWcuc3JjKVxuICB2YXIgeCA9ICh0aGlzLnRleHR1cmUud2lkdGggLyB0aGlzLndpZHRoKSB8IDBcbiAgdmFyIHkgPSAodGhpcy50ZXh0dXJlLmhlaWdodCAvIHRoaXMuaGVpZ2h0KSB8IDBcblxuICBmb3IgKHZhciBpeSA9IDA7IGl5IDwgeTsgaXkrKykge1xuICAgIGZvciAodmFyIGl4ID0gMDsgaXggPCB4OyBpeCsrKSB7XG4gICAgICB0aGlzLmZyYW1lcy5wdXNoKHtcbiAgICAgICAgeDogaXggKiB0aGlzLndpZHRoLFxuICAgICAgICB5OiBpeSAqIHRoaXMuaGVpZ2h0LFxuICAgICAgICB4MjogaXggKiB0aGlzLndpZHRoICsgdGhpcy53aWR0aCxcbiAgICAgICAgeTI6IGl5ICogdGhpcy5oZWlnaHQgKyB0aGlzLmhlaWdodCxcbiAgICAgICAgdzogdGhpcy53aWR0aCxcbiAgICAgICAgaDogdGhpcy5oZWlnaHRcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIHRoaXMudHJpZ2dlcignbG9hZCcpXG59XG5cbmFwaS5kcmF3ID0gZnVuY3Rpb24oY3R4LCBmcmFtZSwgcmVjdCkge1xuICB2YXIgZiA9IHRoaXMuZnJhbWVzW2ZyYW1lXVxuICBpZiAoIWYpIHJldHVyblxuICBjdHguZHJhd0ltYWdlKHRoaXMudGV4dHVyZS5pbWcsXG4gICAgZi54LCBmLnksIGYudywgZi5oLFxuICAgIHJlY3QueCwgcmVjdC55LCByZWN0LncsIHJlY3QuaClcbn1cblxuXG5cbiIsIlxudmFyIFN3aXRjaCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gU3dpdGNoKHBvcykge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIHRoaXMucG9zID0gcG9zXG4gIHRoaXMuc3RhdGUgPSBTd2l0Y2guU1RBVEUuT0ZGXG59XG5cblN3aXRjaC5wcm90b3R5cGUudHVybk9uID0gZnVuY3Rpb24oZW50KSB7XG4gIGlmICh0aGlzLnN0YXRlID09PSBTd2l0Y2guU1RBVEUuT0ZGKSB7XG4gICAgdGhpcy5zdGF0ZSA9IFN3aXRjaC5TVEFURS5PTlxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cblN3aXRjaC5wcm90b3R5cGUudHVybk9mZiA9IGZ1bmN0aW9uKGVudCkge1xuICBpZiAodGhpcy5zdGF0ZSA9PT0gU3dpdGNoLlNUQVRFLk9OKSB7XG4gICAgdGhpcy5zdGF0ZSA9IFN3aXRjaC5TVEFURS5PRkZcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5Td2l0Y2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xufVxuXG5Td2l0Y2gucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgdmFyIGQyciA9IHRoaXMuZ2FtZS5kMnJcbiAgdmFyIHNjYWxlID0gdGhpcy5nYW1lLnNjYWxlXG4gIHRoaXMuZ2FtZS5pc29DdHgoY3R4LCBmdW5jdGlvbigpIHtcbiAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgdGhpcy5wb3MueCAqIHNjYWxlICsgc2NhbGUgLyAyLFxuICAgICAgdGhpcy5wb3MueSAqIHNjYWxlICsgc2NhbGUgLyAyXG4gICAgKVxuXG4gICAgdmFyIHJhZGl1cyA9IHNjYWxlKjAuM1xuXG4gICAgLy8gZmlsbCB0aGUgc3F1YXJlXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PTiA/ICcjMDBGRjAwJyA6ICcjRkYwMDAwJ1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5yZWN0KC1zY2FsZS8yLCAtc2NhbGUvMiwgc2NhbGUsIHNjYWxlKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcblxuICAgIC8vIGRyYXcgdGhlIHJlY2lldmVyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5hcmMoMCwgMCwgcmFkaXVzLCBkMnIoMCksIGQycigzNjApKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5Td2l0Y2guU1RBVEUgPSB7XG4gIE9OIDogMSxcbiAgT0ZGIDogMFxufVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG5cbnZhciBjYWNoZSA9IHt9XG5cbnZhciBUZXh0dXJlID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzcmMpIHtcbiAgaWYgKGNhY2hlW3NyY10pIHJldHVybiBjYWNoZVtzcmNdXG5cbiAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlXG4gIHRoaXMubG9hZChzcmMpXG4gIGNhY2hlW3NyY10gPSB0aGlzXG59XG5cbnZhciBhcGkgPSBUZXh0dXJlLnByb3RvdHlwZVxucHVic3ViLmV4dGVuZChhcGkpXG5cbmFwaS5sb2FkID0gZnVuY3Rpb24oc3JjKSB7XG4gIHZhciBpbWcgPSB0aGlzLmltZyA9IG5ldyBJbWFnZSgpXG4gIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZVxuICAgIHRoaXMud2lkdGggPSBpbWcud2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGltZy5oZWlnaHRcbiAgICB0aGlzLnRyaWdnZXIoJ2xvYWQnKVxuICB9LmJpbmQodGhpcylcbiAgaW1nLnNyYyA9IHNyY1xufVxuXG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBUZXh0dXJlID0gcmVxdWlyZSgnLi90ZXh0dXJlJylcblxudmFyIFRpbGVTZXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNyYywgdywgaCwgb3gsIG95KSB7XG4gIHRoaXMud2lkdGggPSB3XG4gIHRoaXMuaGVpZ2h0ID0gaFxuICB0aGlzLm9mZnNldFggPSBveFxuICB0aGlzLm9mZnNldFkgPSBveVxuXG4gIHRoaXMudGV4dHVyZSA9IG5ldyBUZXh0dXJlKHNyYylcbiAgdGhpcy5lY2hvKCdsb2FkJywgdGhpcy50ZXh0dXJlKVxufVxuXG5wdWJzdWIuZXh0ZW5kKFRpbGVTZXQucHJvdG90eXBlKVxuXG5UaWxlU2V0LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4LCB0LCB4LCB5LCB3KSB7XG4gIHZhciBzeCA9IHQgKiB0aGlzLndpZHRoXG4gIHZhciBzeSA9IDBcbiAgdmFyIHN3ID0gdGhpcy53aWR0aFxuICB2YXIgc2ggPSB0aGlzLmhlaWdodFxuXG4gIC8vIHRoZSBzY2FsZXIgaXMgdGhlIHdpZHRoIG9mIHRoZSBkZXN0aW5hdGlvbiB0aWxlIGRpdmlkZWRcbiAgLy8gYnkgdGhlIFwidHJ1ZVwiIHdpZHRoIG9mIHRoZSB0aWxlIGluIHRoZSBpbWFnZVxuICB2YXIgc2NhbGVyID0gdyAvICh0aGlzLndpZHRoIC0gdGhpcy5vZmZzZXRYKjIpXG5cbiAgdmFyIGR3ID0gdGhpcy53aWR0aCAqIHNjYWxlclxuICB2YXIgZGggPSB0aGlzLmhlaWdodCAqIHNjYWxlclxuICB2YXIgZHggPSB4IC0gZHcqMC41XG4gIHZhciBkeSA9IHkgLSB0aGlzLm9mZnNldFkgKiBzY2FsZXJcblxuICBjdHguZHJhd0ltYWdlKHRoaXMudGV4dHVyZS5pbWcsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaClcbn1cblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBlcXVhbDogZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueVxuICB9LFxuXG4gIGFkZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG4gICAgdmFyIHYgPSB7IHg6MCwgeTowIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHYueCArPSBhcmdzW2ldLnhcbiAgICAgIHYueSArPSBhcmdzW2ldLnlcbiAgICB9XG4gICAgcmV0dXJuIHZcbiAgfSxcblxuICBzdWJ0cmFjdDogZnVuY3Rpb24odikge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgIHYgPSB7IHg6di54LCB5OnYueSB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2LnggLT0gYXJnc1tpXS54XG4gICAgICB2LnkgLT0gYXJnc1tpXS55XG4gICAgfVxuICAgIHJldHVybiB2XG4gIH1cblxufVxuIl19
;