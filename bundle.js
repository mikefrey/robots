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

},{"./game":8,"./switch":22}],2:[function(require,module,exports){
var pubsub = require('./lib/pubsub')

var Button = module.exports = function Button(btn) {
  this.game = require('./game').game
  // copy over the btn properties
  for (var k in btn) if (btn.hasOwnProperty(k)) {
    this[k] = btn[k]
  }
  this.state = Button.STATE.NORMAL
}

Button.prototype.tapped = function() {
  pubsub.trigger('commandButtonPressed', [this])
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

},{"./game":8,"./lib/pubsub":16}],3:[function(require,module,exports){
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

},{"./button":2,"./buttons":4,"./sprite":21}],4:[function(require,module,exports){
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
module.exports = [
  require('../levels/first'),
  require('../levels/second')
]

},{"../levels/first":12,"../levels/second":13}],6:[function(require,module,exports){
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



},{"./vector2":25}],7:[function(require,module,exports){
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
},{"./game":8,"./switch":22}],8:[function(require,module,exports){
var vector2 = require('./vector2')
var Input = require('./input')
var ButtonManager = require('./buttonManager')
var QueueManager = require('./queueManager')
var LevelManager = require('./levelManager')

var EntityManager = require('./entityManager')
var Ball = require('./ball')
var Switch = require('./switch')
var Robot = require('./robot')
var Exit = require('./exit')

var enthash = {
  B: Ball,
  S: Switch,
  R: Robot,
  E: Exit
}

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

  // setup the canvas
  this.ctx = this.initCanvas(opts.canvas, width, height)

  this.input = new Input(opts.canvas)
  this.buttonManager = new ButtonManager()
  this.queueManager = new QueueManager()
  this.levelManager = new LevelManager()
}

Game.prototype.loadLevel = function(idx) {
  var level = this.levelManager.load(idx)
  this.loadEntities(level)
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
  this.levelManager.update()
  this.buttonManager.update()
  this.queueManager.update()
  this.entities.invoke('update', [this.ctx], 'Robot')
  this.entities.invoke('update', [this.ctx], 'Ball')
  this.entities.invoke('update', [this.ctx], 'Switch')
  this.entities.invoke('update', [this.ctx], 'Exit')
}

// draw all the things
Game.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.width, this.height)

  // draw the level
  this.levelManager.draw(this.ctx)

  // draw each entity
  this.entities.invoke('draw', [this.ctx], 'Exit')
  this.entities.invoke('draw', [this.ctx], 'Switch')
  this.entities.invoke('draw', [this.ctx], 'Robot')
  this.entities.invoke('draw', [this.ctx], 'Ball')

  // draw any UI last
  this.buttonManager.draw(this.ctx)
  this.queueManager.draw(this.ctx)
}

// get the entity at the given position
Game.prototype.entityAt = function(pos, type) {
  return this.entities.atPos(pos, type)
}

Game.prototype.entitiesOfType = function(type) {
  return this.entities.ofType(type)
}

// load the entities from the level
Game.prototype.loadEntities = function(level) {
  var ents = this.entities = new EntityManager()
  var map = level.entityMap
  for (var y = 0; y < map.length; y+=1) {
    for (var x = 0; x < map[y].length; x+=1) {
      var Ent = enthash[map[y][x]]
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

},{"./ball":1,"./buttonManager":3,"./entityManager":6,"./exit":7,"./input":9,"./levelManager":11,"./queueManager":18,"./robot":19,"./switch":22,"./vector2":25}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){

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

var Level = module.exports = function(conf) {
  this.game = require('./game').game

  var t = conf.tiles
  this.tiles = new TileSet(t.src, t.w, t.h, t.ox, t.oy)

  this.grid = conf.grid
  this.entityMap = conf.entityMap

  var p1 = this.game.s2w({x:0, y:0})
  var p2 = this.game.s2w({x:0, y:this.game.scale})
  this.isoTileWidth = Math.abs(p2.x - p1.x)*2
}

var proto = Level.prototype

proto.update = function() {

}

proto.draw = function(ctx) {
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


  // this.game.isoCtx(ctx, function() {

  //   // draw the grid tiles
  //   for (var y = 0; y < grid.length; y+=1) {
  //     for (var x = 0; x < grid[y].length; x+=1) {
  //       // fill the tile
  //       if (grid[y][x]) {
  //         ctx.fillStyle = 'rgba(0,0,0,0.15)'
  //         ctx.fillRect(x*scale + scale*0.1, y*scale + scale*0.1, scale*0.8, scale*0.8)
  //       }
  //     }
  //   }

  //   // draw the grid lines
  //   ctx.strokeStyle = '#888888'
  //   for (var y = 0; y < grid.length; y+=1) {
  //     for (var x = 0; x < grid[y].length; x+=1) {
  //       if (grid[y][x]) {
  //         ctx.beginPath()
  //         ctx.rect(x*scale+0.5, y*scale+0.5, scale, scale)
  //         ctx.stroke()
  //       }
  //     }
  //   }

  // })

}

},{"./ball":1,"./exit":7,"./game":8,"./robot":19,"./switch":22,"./tileset":24}],11:[function(require,module,exports){
var levelDefs = require('./config/levels')
var Level = require('./level')

var LevelManager = module.exports = function() {
  this.levels = levelDefs

  this.current = null
  this.currentIdx = -1
}

var proto = LevelManager.prototype

proto.update = function() {
  if (this.current)
    this.current.update()
}

proto.draw = function(ctx) {
  if (this.current)
    this.current.draw(ctx)
}

proto.load = function(idx) {
  var conf = this.levels[idx]
  var next = conf ? new Level(conf) : null

  // unload the current level
  if (this.current) {
    this.current.dispose()
    this.current = null
    this.currentIdx = -1
  }

  // set the next level as current
  if (next) {
    this.current = next
    this.currentIdx = idx
  }

  return next
}

proto.next = function() {
  return this.load(this.currentIdx + 1)
}


},{"./config/levels":5,"./level":10}],12:[function(require,module,exports){
var _ = 0
var B = 'B'
var S = 'S'
var R = 'R'
var E = 'E'

module.exports = {
  name: 'First Level',

  tiles: {
    src: 'images/isotiles.png',
    w: 64,
    h: 64,
    ox: 4,
    oy: 16
  },

  grid: [
    [6,6,6,6,6],
    [6,6,6,6,6],
    [6,6,6,6,6]
  ],

  entityMap: [
    [_,_,B,_,_],
    [R,_,_,_,S],
    [_,_,E,_,_]
  ]
}

},{}],13:[function(require,module,exports){
var _ = 0
var B = 'B'
var S = 'S'
var R = 'R'
var E = 'E'

module.exports = {
  name: 'Second Level',

  tiles: {
    src: 'images/isotiles.png',
    w: 64,
    h: 64,
    ox: 4,
    oy: 16
  },

  grid: [
    [6,6,6,6,6],
    [6,6,6,6,6],
    [6,6,6,6,6],
    [_,_,_,6,6],
    [6,6,_,6,6]
  ],

  entityMap: [
    [_,_,_,_,_],
    [_,R,_,B,_],
    [_,_,_,_,E],
    [_,_,S,_,_],
    [_,_,_,_,_]
  ]
}

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
module.exports = function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

},{}],16:[function(require,module,exports){
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

},{"./extend":14}],17:[function(require,module,exports){
var pubsub = require('./lib/pubsub')
var inherits = require('./lib/inherits')
var Button = require('./button')

var QueueButton = module.exports = function QueueButton(button, pos) {
  var btn = {
    pos: pos,
    width: 40,
    height: 40,
    sprite: button.sprite,
    frameOff: button.frameOff,
    frameOn: button.frameOn,
    command: button.command
  }
  Button.call(this, btn)
}

inherits(QueueButton, Button)

QueueButton.prototype.tapped = function() {
  pubsub.trigger('queueButtonPressed', [this])
}

},{"./button":2,"./lib/inherits":15,"./lib/pubsub":16}],18:[function(require,module,exports){
var pubsub = require('./lib/pubsub')
var QueueButton = require('./queueButton')
var Sprite = require('./sprite')

var QueueManager = module.exports = function() {
  this.game = require('./game').game
  this.buttons = []
  pubsub.on('commandButtonPressed', this.enqueue.bind(this))
  pubsub.on('queueButtonPressed', this.remove.bind(this))
}

QueueManager.prototype.enqueue = function(btn) {
  if (btn.command === 'start') return pubsub.trigger('robotStart')
  var x = this.buttons.length * 42 + 10
  var y = this.game.height - 50
  var button = new QueueButton(btn, {x:x,y:y})
  this.buttons.push(button)
}

QueueManager.prototype.remove = function(btn) {
  var index = this.buttons.indexOf(btn)
  this.buttons.splice(index, 1)
  this.recalculatePosX(index)
  return btn
}

QueueManager.prototype.pop = function() {
  var btn = this.buttons.shift()
  this.recalculatePosX()
  return btn.command
}

QueueManager.prototype.reset = function() {
  this.buttons = []
}

QueueManager.prototype.count = function() {
  return this.buttons.length
}

QueueManager.prototype.update = function() {
  for (var i = 0; i < this.buttons.length; i+=1) {
    this.buttons[i].update()
  }
}

QueueManager.prototype.draw = function(ctx) {
  for (var i = 0; i < this.buttons.length; i+=1) {
    this.buttons[i].draw(ctx)
  }
}

QueueManager.prototype.recalculatePosX = function(idx) {
  for (var i = idx || 0; i < this.buttons.length; i+=1) {
    this.buttons[i].pos.x = i * 42 + 10
  }
}

},{"./game":8,"./lib/pubsub":16,"./queueButton":17,"./sprite":21}],19:[function(require,module,exports){
var vector2 = require('./vector2')
var pubsub = require('./lib/pubsub')

var Ball = require('./ball')

var Robot = module.exports = function Robot(pos) {
  this.game = require('./game').game
  this.pos = pos
  this.dir = { x:1, y:0 }
  this.queue = this.game.queueManager
  this.freq = 400
  this.blocked = false

  // pubsub.on('commandButtonPressed', this.enqueue.bind(this))
  pubsub.on('robotStart', this.start.bind(this))
}

Robot.prototype.moveForward = function() {
  var grid = this.game.levelManager.current.grid
  var newPos = vector2.add(this.pos, this.dir)
  if (!grid[newPos.y] || !grid[newPos.y][newPos.x]) {
    this.block()
  } else {
    this.pos = newPos
  }
  return this
}

Robot.prototype.moveBackward = function() {
  var grid = this.game.levelManager.current.grid
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

// Robot.prototype.enqueue = function(btn) {
//   var fname = btn.command
//   if (fname === 'start') return this.start()
//   if (typeof this[fname] == 'function')
//     this.queue.push(fname)
// }

Robot.prototype.start = function() {
  this.step()
}

Robot.prototype.stop = function() {
  if (this.timeout) {
    clearTimeout(this.timeout)
  }
}

Robot.prototype.step = function() {
  if (this.queue.count() == 0) {
    return
  }
  if (this.blocked) {
    this.queue.reset()
    return
  }

  var action = this.queue.pop()
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

},{"./ball":1,"./game":8,"./lib/pubsub":16,"./vector2":25}],20:[function(require,module,exports){
window.stats = new Stats();
stats.setMode(1); // 0: fps, 1: ms
stats.domElement.style.position = 'fixed';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

var Game = require('./game')

var game = window.game = new Game({
  scale: 64,
  width: 1024,
  height: 768,
  gridSize: 10,
  topMargin: 150,
  canvas: 'game'
})

game.loadLevel(0)

game.start()

// game.level.tiles.onload = function() {
//   game.draw()
// }

},{"./game":8}],21:[function(require,module,exports){
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




},{"./lib/pubsub":16,"./texture":23}],22:[function(require,module,exports){

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

},{"./game":8}],23:[function(require,module,exports){
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


},{"./lib/pubsub":16}],24:[function(require,module,exports){
var pubsub = require('./lib/pubsub')
var Texture = require('./texture')

var TileSet = module.exports = function(src, w, h, ox, oy) {
  this.width = w
  this.height = h
  this.offsetX = ox
  this.offsetY = oy
  this.src = src

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



},{"./lib/pubsub":16,"./texture":23}],25:[function(require,module,exports){
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

},{}]},{},[20])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2JhbGwuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2J1dHRvbi5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvYnV0dG9uTWFuYWdlci5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvYnV0dG9ucy5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvY29uZmlnL2xldmVscy5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvZW50aXR5TWFuYWdlci5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvZXhpdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvZ2FtZS5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvaW5wdXQuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2xldmVsLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9sZXZlbE1hbmFnZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2xldmVscy9maXJzdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGV2ZWxzL3NlY29uZC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2V4dGVuZC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2luaGVyaXRzLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9saWIvcHVic3ViLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9xdWV1ZUJ1dHRvbi5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvcXVldWVNYW5hZ2VyLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9yb2JvdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvc2NyaXB0LmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9zcHJpdGUuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL3N3aXRjaC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGV4dHVyZS5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGlsZXNldC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdmVjdG9yMi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU3dpdGNoID0gcmVxdWlyZSgnLi9zd2l0Y2gnKVxuXG52YXIgQmFsbCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQmFsbChwb3MpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLnBvcyA9IHBvc1xufVxuXG5CYWxsLnByb3RvdHlwZS5kcm9wcGVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciB0YXJnZXQgPSB0aGlzLmdhbWUuZW50aXR5QXQodGhpcy5wb3MsIFN3aXRjaC5uYW1lKVxuICBpZiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRhcmdldC50dXJuT24odGhpcylcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5CYWxsLnByb3RvdHlwZS5waWNrZWRVcCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGFyZ2V0ID0gdGhpcy5nYW1lLmVudGl0eUF0KHRoaXMucG9zLCBTd2l0Y2gubmFtZSlcbiAgaWYgKHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQudHVybk9mZih0aGlzKVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbkJhbGwucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG59XG5cbkJhbGwucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgdmFyIGQyciA9IHRoaXMuZ2FtZS5kMnJcbiAgdmFyIHNjYWxlID0gdGhpcy5nYW1lLnNjYWxlXG4gIHRoaXMuZ2FtZS5pc29DdHgoY3R4LCBmdW5jdGlvbigpIHtcbiAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgdGhpcy5wb3MueCAqIHNjYWxlICsgc2NhbGUgLyAyLFxuICAgICAgdGhpcy5wb3MueSAqIHNjYWxlICsgc2NhbGUgLyAyXG4gICAgKVxuXG4gICAgdmFyIHJhZGl1cyA9IHNjYWxlKjAuM1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjNzc3N0ZGJ1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5hcmMoMCwgMCwgcmFkaXVzLCBkMnIoMCksIGQycigzNjApKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcbiAgfS5iaW5kKHRoaXMpKVxufVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG5cbnZhciBCdXR0b24gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEJ1dHRvbihidG4pIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICAvLyBjb3B5IG92ZXIgdGhlIGJ0biBwcm9wZXJ0aWVzXG4gIGZvciAodmFyIGsgaW4gYnRuKSBpZiAoYnRuLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgdGhpc1trXSA9IGJ0bltrXVxuICB9XG4gIHRoaXMuc3RhdGUgPSBCdXR0b24uU1RBVEUuTk9STUFMXG59XG5cbkJ1dHRvbi5wcm90b3R5cGUudGFwcGVkID0gZnVuY3Rpb24oKSB7XG4gIHB1YnN1Yi50cmlnZ2VyKCdjb21tYW5kQnV0dG9uUHJlc3NlZCcsIFt0aGlzXSlcbn1cblxuQnV0dG9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zdGF0ZSA9IEJ1dHRvbi5TVEFURS5OT1JNQUxcbiAgdmFyIHN0YXJ0ID0gdGhpcy5nYW1lLmlucHV0LnN0YXJ0XG4gIHZhciBjdXJyZW50ID0gdGhpcy5nYW1lLmlucHV0LmN1cnJlbnRcbiAgdmFyIHByZXZpb3VzID0gdGhpcy5nYW1lLmlucHV0LnByZXZpb3VzXG5cbiAgaWYgKGN1cnJlbnQpIHtcbiAgICBpZiAodGhpcy5jb250YWlucyhjdXJyZW50KSAmJiB0aGlzLmNvbnRhaW5zKHN0YXJ0KSkge1xuICAgICAgdGhpcy5zdGF0ZSA9IEJ1dHRvbi5TVEFURS5ET1dOXG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKHByZXZpb3VzICYmIHRoaXMuY29udGFpbnMocHJldmlvdXMuZW5kKSAmJiB0aGlzLmNvbnRhaW5zKHByZXZpb3VzLnN0YXJ0KSkge1xuICAgIHRoaXMudGFwcGVkKClcbiAgICB0aGlzLmdhbWUuaW5wdXQucHJldmlvdXMgPSBudWxsXG4gIH1cbn1cblxuQnV0dG9uLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGN0eC5zYXZlKClcbiAgY3R4LnRyYW5zbGF0ZSh0aGlzLnBvcy54LCB0aGlzLnBvcy55KVxuXG4gIHZhciByZWN0ID0geyB4OjAsIHk6MCwgdzp0aGlzLndpZHRoLCBoOnRoaXMuaGVpZ2h0IH1cbiAgdmFyIGZyYW1lID0gdGhpcy5zdGF0ZSA9PSBCdXR0b24uU1RBVEUuTk9STUFMID8gdGhpcy5mcmFtZU9mZiA6IHRoaXMuZnJhbWVPblxuICB0aGlzLnNwcml0ZS5kcmF3KGN0eCwgZnJhbWUsIHJlY3QpXG5cbiAgY3R4LnJlc3RvcmUoKVxufVxuXG5CdXR0b24ucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgcmV0dXJuICEoXG4gICAgdGhpcy5wb3MueCA+IHBvaW50LnggfHxcbiAgICB0aGlzLnBvcy54ICsgdGhpcy53aWR0aCA8IHBvaW50LnggfHxcbiAgICB0aGlzLnBvcy55ID4gcG9pbnQueSB8fFxuICAgIHRoaXMucG9zLnkgKyB0aGlzLmhlaWdodCA8IHBvaW50LnlcbiAgKVxufVxuXG5CdXR0b24uU1RBVEUgPSB7XG4gIE5PUk1BTDogJ25vcm1hbCcsXG4gIERPV046ICdkb3duJ1xufVxuIiwidmFyIGJ1dHRvbkRlZnMgPSByZXF1aXJlKCcuL2J1dHRvbnMnKVxudmFyIEJ1dHRvbiA9IHJlcXVpcmUoJy4vYnV0dG9uJylcbnZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpXG5cbnZhciBCdXR0b25NYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zcHJpdGVzID0ge31cbiAgZm9yICh2YXIga2V5IGluIGJ1dHRvbkRlZnMuc3ByaXRlcykge1xuICAgIHZhciBzcHIgPSBidXR0b25EZWZzLnNwcml0ZXNba2V5XVxuICAgIHZhciBzcHJpdGUgPSBuZXcgU3ByaXRlKHNwcilcbiAgICB0aGlzLnNwcml0ZXNba2V5XSA9IHNwcml0ZVxuICB9XG5cbiAgdGhpcy5idXR0b25zID0gW11cbiAgZm9yICh2YXIga2V5IGluIGJ1dHRvbkRlZnMuYnV0dG9ucykge1xuICAgIHZhciBidG4gPSBidXR0b25EZWZzLmJ1dHRvbnNba2V5XVxuICAgIGJ0bi5zcHJpdGUgPSB0aGlzLnNwcml0ZXNbYnRuLnNwcml0ZV1cbiAgICB2YXIgYnV0dG9uID0gbmV3IEJ1dHRvbihidG4pXG4gICAgdGhpcy5idXR0b25zLnB1c2goYnV0dG9uKVxuICB9XG59XG5cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrPTEpIHtcbiAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlKClcbiAgfVxufVxuXG5CdXR0b25NYW5hZ2VyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS5kcmF3KGN0eClcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgc3ByaXRlczoge1xuICAgIGJ1dHRvbnM6IHtcbiAgICAgIHRleHR1cmU6ICdpbWFnZXMvYnV0dG9ucy5wbmcnLFxuICAgICAgd2lkdGg6IDgwLFxuICAgICAgaGVpZ2h0OiA4MFxuICAgIH1cbiAgfSxcblxuICBidXR0b25zOiB7XG5cbiAgICBmb3J3YXJkOiB7XG4gICAgICBwb3M6IHsgeDowLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjowLFxuICAgICAgZnJhbWVPbjoxLFxuICAgICAgY29tbWFuZDogJ21vdmVGb3J3YXJkJ1xuICAgIH0sXG5cbiAgICBiYWNrd2FyZDoge1xuICAgICAgcG9zOiB7IHg6ODAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjIsXG4gICAgICBmcmFtZU9uOjMsXG4gICAgICBjb21tYW5kOiAnbW92ZUJhY2t3YXJkJ1xuICAgIH0sXG5cbiAgICBsZWZ0OiB7XG4gICAgICBwb3M6IHsgeDoxNzAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjQsXG4gICAgICBmcmFtZU9uOjUsXG4gICAgICBjb21tYW5kOiAndHVybkxlZnQnXG4gICAgfSxcblxuICAgIHJpZ2h0OiB7XG4gICAgICBwb3M6IHsgeDoyNTAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjYsXG4gICAgICBmcmFtZU9uOjcsXG4gICAgICBjb21tYW5kOiAndHVyblJpZ2h0J1xuICAgIH0sXG5cbiAgICBwaWNrdXA6IHtcbiAgICAgIHBvczogeyB4OjM0MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6OCxcbiAgICAgIGZyYW1lT246OSxcbiAgICAgIGNvbW1hbmQ6ICdwaWNrdXAnXG4gICAgfSxcblxuICAgIHJlbGVhc2U6IHtcbiAgICAgIHBvczogeyB4OjQyMCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6MTAsXG4gICAgICBmcmFtZU9uOjExLFxuICAgICAgY29tbWFuZDogJ3JlbGVhc2UnXG4gICAgfSxcblxuICAgIHN0YXJ0OiB7XG4gICAgICBwb3M6IHsgeDo1NDAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjEyLFxuICAgICAgZnJhbWVPbjoxMyxcbiAgICAgIGNvbW1hbmQ6ICdzdGFydCdcbiAgICB9LFxuXG4gICAgdHVybkFyb3VuZDoge1xuICAgICAgcG9zOiB7IHg6NjYwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjo2LFxuICAgICAgZnJhbWVPbjo3LFxuICAgICAgY29tbWFuZDogJ3R1cm5Bcm91bmQnXG4gICAgfSxcblxuICAgIHJlc3RhcnQ6IHtcbiAgICAgIHBvczogeyB4Ojc4MCwgeTowIH0sXG4gICAgICB3aWR0aDo0MCxcbiAgICAgIGhlaWdodDo0MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6NixcbiAgICAgIGZyYW1lT246NyxcbiAgICAgIGNvbW1hbmQ6ICdyZXN0YXJ0J1xuICAgIH1cblxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgcmVxdWlyZSgnLi4vbGV2ZWxzL2ZpcnN0JyksXG4gIHJlcXVpcmUoJy4uL2xldmVscy9zZWNvbmQnKVxuXVxuIiwidmFyIHZlY3RvcjIgPSByZXF1aXJlKCcuL3ZlY3RvcjInKVxuXG52YXIgRW50aXR5TWFuYWdlciA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW50aXRpZXMgPSBbXVxuICB0aGlzLmJ5VHlwZSA9IHt9XG59XG5cbkVudGl0eU1hbmFnZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHR5cGUsIGVudCkge1xuICB0aGlzLmVudGl0aWVzLnB1c2goZW50KVxuICB0aGlzLmJ5VHlwZVt0eXBlXSB8fCAodGhpcy5ieVR5cGVbdHlwZV0gPSBbXSlcbiAgdGhpcy5ieVR5cGVbdHlwZV0ucHVzaChlbnQpXG59XG5cbkVudGl0eU1hbmFnZXIucHJvdG90eXBlLm9mVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgcmV0dXJuIHRoaXMuYnlUeXBlW3R5cGVdXG59XG5cbkVudGl0eU1hbmFnZXIucHJvdG90eXBlLmF0UG9zID0gZnVuY3Rpb24ocG9zLCB0eXBlKSB7XG4gIHZhciBlbnRzID0gdGhpcy5ieVR5cGVbdHlwZV1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIHZhciBlbnQgPSBlbnRzW2ldXG4gICAgaWYgKHZlY3RvcjIuZXF1YWwoZW50LnBvcywgcG9zKSkge1xuICAgICAgcmV0dXJuIGVudFxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5FbnRpdHlNYW5hZ2VyLnByb3RvdHlwZS5pbnZva2UgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIHR5cGUpIHtcbiAgdmFyIGVudHMgPSB0aGlzLmVudGl0aWVzXG4gIGlmICh0eXBlKSBlbnRzID0gdGhpcy5ieVR5cGVbdHlwZV1cblxuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiB0aGlzLl9kb0ludm9rZTAoZm5OYW1lLCBlbnRzKTsgYnJlYWtcbiAgICBjYXNlIDE6IHRoaXMuX2RvSW52b2tlMShmbk5hbWUsIGFyZ3MsIGVudHMpOyBicmVha1xuICAgIGNhc2UgMjogdGhpcy5fZG9JbnZva2UxKGZuTmFtZSwgYXJncywgZW50cyk7IGJyZWFrXG4gICAgY2FzZSAzOiB0aGlzLl9kb0ludm9rZTEoZm5OYW1lLCBhcmdzLCBlbnRzKTsgYnJlYWtcbiAgICBkZWZhdWx0OiB0aGlzLl9kb0ludm9rZUEoZm5OYW1lLCBhcmdzLCBlbnRzKTtcbiAgfVxufVxuXG5FbnRpdHlNYW5hZ2VyLnByb3RvdHlwZS5fZG9JbnZva2UwID0gZnVuY3Rpb24oZm5OYW1lLCBhcmdzLCBlbnRzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cy5sZW5ndGg7IGkrPTEpIHtcbiAgICBlbnRzW2ldW2ZuTmFtZV0oKVxuICB9XG59XG5cbkVudGl0eU1hbmFnZXIucHJvdG90eXBlLl9kb0ludm9rZTEgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXShhcmdzWzBdKVxuICB9XG59XG5cbkVudGl0eU1hbmFnZXIucHJvdG90eXBlLl9kb0ludm9rZTIgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXShhcmdzWzBdLCBhcmdzWzFdKVxuICB9XG59XG5cbkVudGl0eU1hbmFnZXIucHJvdG90eXBlLl9kb0ludm9rZTMgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXShhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICB9XG59XG5cbkVudGl0eU1hbmFnZXIucHJvdG90eXBlLl9kb0ludm9rZUEgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXS5hcHBseShlbnRzW2ldLCBhcmdzKVxuICB9XG59XG5cblxuIiwidmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vc3dpdGNoJylcblxudmFyIEV4aXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEV4aXQocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3Ncbn1cblxuRXhpdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cbiAgdGhpcy5zdGF0ZSA9IEV4aXQuU1RBVEUuSU5BQ1RJVkVcbiAgaWYgKHRoaXMuYWxsU3dpdGNoZXNPbigpKSB7XG4gICAgdGhpcy5zdGF0ZSA9IEV4aXQuU1RBVEUuQUNUSVZFXG4gIH1cblxufVxuXG5FeGl0LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICB0aGlzLmdhbWUuaXNvQ3R4KGN0eCwgZnVuY3Rpb24oKSB7XG4gICAgY3R4LnRyYW5zbGF0ZShcbiAgICAgIHRoaXMucG9zLnggKiBzY2FsZSArIHNjYWxlIC8gMixcbiAgICAgIHRoaXMucG9zLnkgKiBzY2FsZSArIHNjYWxlIC8gMlxuICAgIClcblxuICAgIGlmICh0aGlzLnN0YXRlID09IEV4aXQuU1RBVEUuSU5BQ1RJVkUpXG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNDQ0NDQ0MnXG4gICAgZWxzZVxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LnJlY3QoXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIDAuNixcbiAgICAgIHNjYWxlICogMC42XG4gICAgKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5FeGl0LnByb3RvdHlwZS5hbGxTd2l0Y2hlc09uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlbnRzID0gZ2FtZS5lbnRpdGllc09mVHlwZShTd2l0Y2gubmFtZSlcbiAgaWYgKCFlbnRzIHx8ICFlbnRzLmxlbmd0aCkgcmV0dXJuIHRydWVcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgaWYgKGVudHNbaV0uc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PRkYpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbkV4aXQuU1RBVEUgPSB7XG4gIEFDVElWRSA6IDEsXG4gIElOQUNUSVZFIDogMFxufSIsInZhciB2ZWN0b3IyID0gcmVxdWlyZSgnLi92ZWN0b3IyJylcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKVxudmFyIEJ1dHRvbk1hbmFnZXIgPSByZXF1aXJlKCcuL2J1dHRvbk1hbmFnZXInKVxudmFyIFF1ZXVlTWFuYWdlciA9IHJlcXVpcmUoJy4vcXVldWVNYW5hZ2VyJylcbnZhciBMZXZlbE1hbmFnZXIgPSByZXF1aXJlKCcuL2xldmVsTWFuYWdlcicpXG5cbnZhciBFbnRpdHlNYW5hZ2VyID0gcmVxdWlyZSgnLi9lbnRpdHlNYW5hZ2VyJylcbnZhciBCYWxsID0gcmVxdWlyZSgnLi9iYWxsJylcbnZhciBTd2l0Y2ggPSByZXF1aXJlKCcuL3N3aXRjaCcpXG52YXIgUm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcbnZhciBFeGl0ID0gcmVxdWlyZSgnLi9leGl0JylcblxudmFyIGVudGhhc2ggPSB7XG4gIEI6IEJhbGwsXG4gIFM6IFN3aXRjaCxcbiAgUjogUm9ib3QsXG4gIEU6IEV4aXRcbn1cblxuLy8gZGVncmVlcyB0byByYWRpYW5zXG5mdW5jdGlvbiBkMnIoYSkge1xuICByZXR1cm4gYSAqIChNYXRoLlBJLzE4MClcbn1cblxuLy8gcmFkaWFucyB0byBkZWdyZXNzXG5mdW5jdGlvbiByMmQoYSkge1xuICByZXR1cm4gYSAvIChNYXRoLlBJLzE4MClcbn1cblxuXG52YXIgR2FtZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0cykge1xuICBHYW1lLmdhbWUgPSB0aGlzXG5cbiAgdGhpcy5zY2FsZSA9IG9wdHMuc2NhbGVcbiAgdmFyIHdpZHRoID0gdGhpcy53aWR0aCA9IG9wdHMud2lkdGhcbiAgdmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0ID0gb3B0cy5oZWlnaHRcbiAgdGhpcy5ncmlkU2l6ZSA9IG9wdHMuZ3JpZFNpemVcbiAgdGhpcy50b3BNYXJnaW4gPSBvcHRzLnRvcE1hcmdpblxuXG4gIC8vIHNldHVwIHRoZSBjYW52YXNcbiAgdGhpcy5jdHggPSB0aGlzLmluaXRDYW52YXMob3B0cy5jYW52YXMsIHdpZHRoLCBoZWlnaHQpXG5cbiAgdGhpcy5pbnB1dCA9IG5ldyBJbnB1dChvcHRzLmNhbnZhcylcbiAgdGhpcy5idXR0b25NYW5hZ2VyID0gbmV3IEJ1dHRvbk1hbmFnZXIoKVxuICB0aGlzLnF1ZXVlTWFuYWdlciA9IG5ldyBRdWV1ZU1hbmFnZXIoKVxuICB0aGlzLmxldmVsTWFuYWdlciA9IG5ldyBMZXZlbE1hbmFnZXIoKVxufVxuXG5HYW1lLnByb3RvdHlwZS5sb2FkTGV2ZWwgPSBmdW5jdGlvbihpZHgpIHtcbiAgdmFyIGxldmVsID0gdGhpcy5sZXZlbE1hbmFnZXIubG9hZChpZHgpXG4gIHRoaXMubG9hZEVudGl0aWVzKGxldmVsKVxufVxuXG4vLyBzdGFydHMgdGhlIGdhbWUgbG9vcFxuR2FtZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5sb29wKClcbn1cblxuLy8gc3VzcGVuZHMgdGhlIGdhbWUgbG9vcFxuR2FtZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJBRklEKVxufVxuR2FtZS5wcm90b3R5cGUucGF1c2UgPSBHYW1lLnByb3RvdHlwZS5zdG9wXG5cbi8vIHRoZSBnYW1lIGxvb3BcbkdhbWUucHJvdG90eXBlLmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yQUZJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSwgdGhpcy5jdHguY2FudmFzKVxuXG4gIHN0YXRzLmJlZ2luKCk7XG5cbiAgdGhpcy51cGRhdGUoKVxuICB0aGlzLmRyYXcoKVxuXG4gIHN0YXRzLmVuZCgpO1xufVxuXG4vLyB1cGRhdGUgYWxsIHRoZSB0aGluZ3NcbkdhbWUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmxldmVsTWFuYWdlci51cGRhdGUoKVxuICB0aGlzLmJ1dHRvbk1hbmFnZXIudXBkYXRlKClcbiAgdGhpcy5xdWV1ZU1hbmFnZXIudXBkYXRlKClcbiAgdGhpcy5lbnRpdGllcy5pbnZva2UoJ3VwZGF0ZScsIFt0aGlzLmN0eF0sICdSb2JvdCcpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKCd1cGRhdGUnLCBbdGhpcy5jdHhdLCAnQmFsbCcpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKCd1cGRhdGUnLCBbdGhpcy5jdHhdLCAnU3dpdGNoJylcbiAgdGhpcy5lbnRpdGllcy5pbnZva2UoJ3VwZGF0ZScsIFt0aGlzLmN0eF0sICdFeGl0Jylcbn1cblxuLy8gZHJhdyBhbGwgdGhlIHRoaW5nc1xuR2FtZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpXG5cbiAgLy8gZHJhdyB0aGUgbGV2ZWxcbiAgdGhpcy5sZXZlbE1hbmFnZXIuZHJhdyh0aGlzLmN0eClcblxuICAvLyBkcmF3IGVhY2ggZW50aXR5XG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKCdkcmF3JywgW3RoaXMuY3R4XSwgJ0V4aXQnKVxuICB0aGlzLmVudGl0aWVzLmludm9rZSgnZHJhdycsIFt0aGlzLmN0eF0sICdTd2l0Y2gnKVxuICB0aGlzLmVudGl0aWVzLmludm9rZSgnZHJhdycsIFt0aGlzLmN0eF0sICdSb2JvdCcpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKCdkcmF3JywgW3RoaXMuY3R4XSwgJ0JhbGwnKVxuXG4gIC8vIGRyYXcgYW55IFVJIGxhc3RcbiAgdGhpcy5idXR0b25NYW5hZ2VyLmRyYXcodGhpcy5jdHgpXG4gIHRoaXMucXVldWVNYW5hZ2VyLmRyYXcodGhpcy5jdHgpXG59XG5cbi8vIGdldCB0aGUgZW50aXR5IGF0IHRoZSBnaXZlbiBwb3NpdGlvblxuR2FtZS5wcm90b3R5cGUuZW50aXR5QXQgPSBmdW5jdGlvbihwb3MsIHR5cGUpIHtcbiAgcmV0dXJuIHRoaXMuZW50aXRpZXMuYXRQb3MocG9zLCB0eXBlKVxufVxuXG5HYW1lLnByb3RvdHlwZS5lbnRpdGllc09mVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgcmV0dXJuIHRoaXMuZW50aXRpZXMub2ZUeXBlKHR5cGUpXG59XG5cbi8vIGxvYWQgdGhlIGVudGl0aWVzIGZyb20gdGhlIGxldmVsXG5HYW1lLnByb3RvdHlwZS5sb2FkRW50aXRpZXMgPSBmdW5jdGlvbihsZXZlbCkge1xuICB2YXIgZW50cyA9IHRoaXMuZW50aXRpZXMgPSBuZXcgRW50aXR5TWFuYWdlcigpXG4gIHZhciBtYXAgPSBsZXZlbC5lbnRpdHlNYXBcbiAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYXAubGVuZ3RoOyB5Kz0xKSB7XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBtYXBbeV0ubGVuZ3RoOyB4Kz0xKSB7XG4gICAgICB2YXIgRW50ID0gZW50aGFzaFttYXBbeV1beF1dXG4gICAgICBpZiAoRW50KSB7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgZW50aXR5XG4gICAgICAgIHZhciBlbnQgPSBuZXcgRW50KHt4OngseTp5fSlcbiAgICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIGl0J3MgdGhlIHJvYm90XG4gICAgICAgIGlmIChlbnQgaW5zdGFuY2VvZiBSb2JvdCkgdGhpcy5yb2JvdCA9IGVudFxuICAgICAgICAvLyBhZGQgaXQgdG8gdGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAgICAgIGVudHMuYWRkKEVudC5uYW1lLCBlbnQpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnZhciB0aGV0YSA9IGQycig0NSlcbnZhciBjc1RoZXRhID0gTWF0aC5jb3ModGhldGEpXG52YXIgc25UaGV0YSA9IE1hdGguc2luKHRoZXRhKVxudmFyIHRoZXRhSW52ID0gZDJyKDMxNSlcbnZhciBjc1RoZXRhSW52ID0gTWF0aC5jb3ModGhldGFJbnYpXG52YXIgc25UaGV0YUludiA9IE1hdGguc2luKHRoZXRhSW52KVxuXG4vLyB0cmFuc2xhdGUgc2NyZWVuIHRvIHdvcmxkXG5HYW1lLnByb3RvdHlwZS5zMncgPSBmdW5jdGlvbihwb3MpIHtcbiAgLy8gcm90YXRlXG4gIHZhciB4ID0gcG9zLnhcbiAgdmFyIHkgPSBwb3MueVxuICBwb3MueCA9IHggKiBjc1RoZXRhIC0geSAqIHNuVGhldGFcbiAgcG9zLnkgPSB4ICogc25UaGV0YSArIHkgKiBjc1RoZXRhXG4gIC8vIHNjYWxlXG4gIHBvcy55ICo9IDAuNVxuICAvLyB0cmFuc2xhdGVcbiAgcG9zLnggKz0gdGhpcy53aWR0aC8yXG4gIHBvcy55ICs9IHRoaXMudG9wTWFyZ2luXG4gIHJldHVybiBwb3Ncbn1cblxuLy8gdHJhbnNsYXRlIHdvcmxkIHRvIHNjcmVlblxuR2FtZS5wcm90b3R5cGUudzJzID0gZnVuY3Rpb24ocG9zKSB7XG4gIC8vIHRyYW5zbGF0ZVxuICBwb3MueCAtPSB0aGlzLndpZHRoLzJcbiAgcG9zLnkgLT0gdGhpcy50b3BNYXJnaW5cbiAgLy8gc2NhbGVcbiAgcG9zLnkgLz0gMC41XG4gIC8vIHJvdGF0ZVxuICB2YXIgeSA9IHBvcy55XG4gIHZhciB4ID0gcG9zLnhcbiAgcG9zLnggPSB4ICogY3NUaGV0YUludiAtIHkgKiBzblRoZXRhSW52XG4gIHBvcy55ID0geCAqIHNuVGhldGFJbnYgKyB5ICogY3NUaGV0YUludlxuICByZXR1cm4gcG9zXG59XG5cbi8vIHNldHVwIGNhbnZhc2UgZWxlbWVudHMgdG8gdGhlIGNvcnJlY3Qgc2l6ZVxuR2FtZS5wcm90b3R5cGUuaW5pdENhbnZhcyA9IGZ1bmN0aW9uKGlkLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgY2FudmFzLndpZHRoID0gd2lkdGhcbiAgY2FudmFzLmhlaWdodCA9IGhlaWdodFxuICByZXR1cm4gY2FudmFzLmdldENvbnRleHQoJzJkJylcbn1cblxuLy8gdHJhbnNmb3JtIHRoZSBjb250ZXh0IGludG8gaXNvbWV0cmljXG5HYW1lLnByb3RvdHlwZS5pc29DdHggPSBmdW5jdGlvbihjdHgsIGZuKSB7XG4gIGN0eC5zYXZlKClcblxuICAvLyBtb3ZlIHRoZSBnYW1lIGJvYXJkIGRvd24gYSBiaXRcbiAgY3R4LnRyYW5zbGF0ZSgwLCB0aGlzLnRvcE1hcmdpbilcbiAgY3R4LnRyYW5zbGF0ZSh0aGlzLndpZHRoLzIsIDApXG4gIGN0eC5zY2FsZSgxLCAwLjUpXG4gIGN0eC5yb3RhdGUoNDUgKiBNYXRoLlBJIC8gMTgwKVxuICAvLyBjdHgudHJhbnNmb3JtKDAuNzA3LCAwLjQwOSwgLTAuNzA3LCAwLjQwOSwgMCwgMClcbiAgZm4oKVxuICBjdHgucmVzdG9yZSgpXG59XG5cbkdhbWUucHJvdG90eXBlLmQyciA9IGQyclxuXG5HYW1lLnByb3RvdHlwZS5yMmQgPSByMmRcbiIsInZhciBJbnB1dCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaWQpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLnRvdWNoU3RhcnQuYmluZCh0aGlzKSwgZmFsc2UpXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMudG91Y2hNb3ZlLmJpbmQodGhpcyksIGZhbHNlKVxuICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMudG91Y2hFbmQuYmluZCh0aGlzKSwgZmFsc2UpXG59XG5cblxuSW5wdXQucHJvdG90eXBlLnRvdWNoU3RhcnQgPSBmdW5jdGlvbihldikge1xuICB0aGlzLnN0YXJ0ID0gZXYudG91Y2hlc1swXVxuICB0aGlzLnRvdWNoTW92ZShldilcbn1cblxuSW5wdXQucHJvdG90eXBlLnRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2KSB7XG4gIHRoaXMucHJldmlvdXMgPSB0aGlzLmN1cnJlbnRcbiAgdGhpcy5jdXJyZW50ID0gZXYudG91Y2hlc1swXVxuICB0aGlzLmN1cnJlbnQueCA9IHRoaXMuY3VycmVudC5jbGllbnRYXG4gIHRoaXMuY3VycmVudC55ID0gdGhpcy5jdXJyZW50LmNsaWVudFlcbn1cblxuSW5wdXQucHJvdG90eXBlLnRvdWNoRW5kID0gZnVuY3Rpb24oZXYpIHtcbiAgdGhpcy5wcmV2aW91cyA9IHtcbiAgICBzdGFydDogdGhpcy5zdGFydCxcbiAgICBlbmQ6IHRoaXMuY3VycmVudFxuICB9XG4gIHRoaXMuY3VycmVudCA9IG51bGxcbiAgdGhpcy5zdGFydCA9IG51bGxcbn1cbiIsIlxudmFyIEJhbGwgPSByZXF1aXJlKCcuL2JhbGwnKVxudmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vc3dpdGNoJylcbnZhciBSb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxudmFyIEV4aXQgPSByZXF1aXJlKCcuL2V4aXQnKVxudmFyIFRpbGVTZXQgPSByZXF1aXJlKCcuL3RpbGVzZXQnKVxuXG52YXIgXyA9IDBcbnZhciBCID0gQmFsbFxudmFyIFMgPSBTd2l0Y2hcbnZhciBSID0gUm9ib3RcbnZhciBFID0gRXhpdFxuXG52YXIgTGV2ZWwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmYpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuXG4gIHZhciB0ID0gY29uZi50aWxlc1xuICB0aGlzLnRpbGVzID0gbmV3IFRpbGVTZXQodC5zcmMsIHQudywgdC5oLCB0Lm94LCB0Lm95KVxuXG4gIHRoaXMuZ3JpZCA9IGNvbmYuZ3JpZFxuICB0aGlzLmVudGl0eU1hcCA9IGNvbmYuZW50aXR5TWFwXG5cbiAgdmFyIHAxID0gdGhpcy5nYW1lLnMydyh7eDowLCB5OjB9KVxuICB2YXIgcDIgPSB0aGlzLmdhbWUuczJ3KHt4OjAsIHk6dGhpcy5nYW1lLnNjYWxlfSlcbiAgdGhpcy5pc29UaWxlV2lkdGggPSBNYXRoLmFicyhwMi54IC0gcDEueCkqMlxufVxuXG52YXIgcHJvdG8gPSBMZXZlbC5wcm90b3R5cGVcblxucHJvdG8udXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cbn1cblxucHJvdG8uZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICB2YXIgc2NhbGUgPSB0aGlzLmdhbWUuc2NhbGVcbiAgdmFyIGdyaWQgPSB0aGlzLmdyaWRcbiAgdmFyIHRpbGVzID0gdGhpcy50aWxlc1xuXG4gIGZvciAodmFyIHkgPSAwOyB5IDwgZ3JpZC5sZW5ndGg7IHkrPTEpIHtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGdyaWRbeV0ubGVuZ3RoOyB4Kz0xKSB7XG4gICAgICB2YXIgcG9zID0gdGhpcy5nYW1lLnMydyh7eDp4KnNjYWxlLCB5Onkqc2NhbGV9KVxuICAgICAgdGlsZXMuZHJhdyhjdHgsIGdyaWRbeV1beF0sIHBvcy54LCBwb3MueSwgdGhpcy5pc29UaWxlV2lkdGgpXG5cbiAgICAgIC8vIGN0eC5maWxsU3R5bGUgPSAnI2ZmMDAwMCdcbiAgICAgIC8vIGN0eC5zdHJva2VTdHlsZSA9ICcjZmZmZmZmJ1xuICAgICAgLy8gY3R4LnJlY3QocG9zLngtMS41LCBwb3MueS0xLjUsIDMsIDMpXG4gICAgICAvLyBjdHguZmlsbCgpXG4gICAgICAvLyBjdHguc3Ryb2tlKClcbiAgICB9XG4gIH1cblxuXG4gIC8vIHRoaXMuZ2FtZS5pc29DdHgoY3R4LCBmdW5jdGlvbigpIHtcblxuICAvLyAgIC8vIGRyYXcgdGhlIGdyaWQgdGlsZXNcbiAgLy8gICBmb3IgKHZhciB5ID0gMDsgeSA8IGdyaWQubGVuZ3RoOyB5Kz0xKSB7XG4gIC8vICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGdyaWRbeV0ubGVuZ3RoOyB4Kz0xKSB7XG4gIC8vICAgICAgIC8vIGZpbGwgdGhlIHRpbGVcbiAgLy8gICAgICAgaWYgKGdyaWRbeV1beF0pIHtcbiAgLy8gICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMCwwLDAsMC4xNSknXG4gIC8vICAgICAgICAgY3R4LmZpbGxSZWN0KHgqc2NhbGUgKyBzY2FsZSowLjEsIHkqc2NhbGUgKyBzY2FsZSowLjEsIHNjYWxlKjAuOCwgc2NhbGUqMC44KVxuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuXG4gIC8vICAgLy8gZHJhdyB0aGUgZ3JpZCBsaW5lc1xuICAvLyAgIGN0eC5zdHJva2VTdHlsZSA9ICcjODg4ODg4J1xuICAvLyAgIGZvciAodmFyIHkgPSAwOyB5IDwgZ3JpZC5sZW5ndGg7IHkrPTEpIHtcbiAgLy8gICAgIGZvciAodmFyIHggPSAwOyB4IDwgZ3JpZFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgLy8gICAgICAgaWYgKGdyaWRbeV1beF0pIHtcbiAgLy8gICAgICAgICBjdHguYmVnaW5QYXRoKClcbiAgLy8gICAgICAgICBjdHgucmVjdCh4KnNjYWxlKzAuNSwgeSpzY2FsZSswLjUsIHNjYWxlLCBzY2FsZSlcbiAgLy8gICAgICAgICBjdHguc3Ryb2tlKClcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgIH1cblxuICAvLyB9KVxuXG59XG4iLCJ2YXIgbGV2ZWxEZWZzID0gcmVxdWlyZSgnLi9jb25maWcvbGV2ZWxzJylcbnZhciBMZXZlbCA9IHJlcXVpcmUoJy4vbGV2ZWwnKVxuXG52YXIgTGV2ZWxNYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5sZXZlbHMgPSBsZXZlbERlZnNcblxuICB0aGlzLmN1cnJlbnQgPSBudWxsXG4gIHRoaXMuY3VycmVudElkeCA9IC0xXG59XG5cbnZhciBwcm90byA9IExldmVsTWFuYWdlci5wcm90b3R5cGVcblxucHJvdG8udXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmN1cnJlbnQpXG4gICAgdGhpcy5jdXJyZW50LnVwZGF0ZSgpXG59XG5cbnByb3RvLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgaWYgKHRoaXMuY3VycmVudClcbiAgICB0aGlzLmN1cnJlbnQuZHJhdyhjdHgpXG59XG5cbnByb3RvLmxvYWQgPSBmdW5jdGlvbihpZHgpIHtcbiAgdmFyIGNvbmYgPSB0aGlzLmxldmVsc1tpZHhdXG4gIHZhciBuZXh0ID0gY29uZiA/IG5ldyBMZXZlbChjb25mKSA6IG51bGxcblxuICAvLyB1bmxvYWQgdGhlIGN1cnJlbnQgbGV2ZWxcbiAgaWYgKHRoaXMuY3VycmVudCkge1xuICAgIHRoaXMuY3VycmVudC5kaXNwb3NlKClcbiAgICB0aGlzLmN1cnJlbnQgPSBudWxsXG4gICAgdGhpcy5jdXJyZW50SWR4ID0gLTFcbiAgfVxuXG4gIC8vIHNldCB0aGUgbmV4dCBsZXZlbCBhcyBjdXJyZW50XG4gIGlmIChuZXh0KSB7XG4gICAgdGhpcy5jdXJyZW50ID0gbmV4dFxuICAgIHRoaXMuY3VycmVudElkeCA9IGlkeFxuICB9XG5cbiAgcmV0dXJuIG5leHRcbn1cblxucHJvdG8ubmV4dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5sb2FkKHRoaXMuY3VycmVudElkeCArIDEpXG59XG5cbiIsInZhciBfID0gMFxudmFyIEIgPSAnQidcbnZhciBTID0gJ1MnXG52YXIgUiA9ICdSJ1xudmFyIEUgPSAnRSdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG5hbWU6ICdGaXJzdCBMZXZlbCcsXG5cbiAgdGlsZXM6IHtcbiAgICBzcmM6ICdpbWFnZXMvaXNvdGlsZXMucG5nJyxcbiAgICB3OiA2NCxcbiAgICBoOiA2NCxcbiAgICBveDogNCxcbiAgICBveTogMTZcbiAgfSxcblxuICBncmlkOiBbXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgWzYsNiw2LDYsNl1cbiAgXSxcblxuICBlbnRpdHlNYXA6IFtcbiAgICBbXyxfLEIsXyxfXSxcbiAgICBbUixfLF8sXyxTXSxcbiAgICBbXyxfLEUsXyxfXVxuICBdXG59XG4iLCJ2YXIgXyA9IDBcbnZhciBCID0gJ0InXG52YXIgUyA9ICdTJ1xudmFyIFIgPSAnUidcbnZhciBFID0gJ0UnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBuYW1lOiAnU2Vjb25kIExldmVsJyxcblxuICB0aWxlczoge1xuICAgIHNyYzogJ2ltYWdlcy9pc290aWxlcy5wbmcnLFxuICAgIHc6IDY0LFxuICAgIGg6IDY0LFxuICAgIG94OiA0LFxuICAgIG95OiAxNlxuICB9LFxuXG4gIGdyaWQ6IFtcbiAgICBbNiw2LDYsNiw2XSxcbiAgICBbNiw2LDYsNiw2XSxcbiAgICBbNiw2LDYsNiw2XSxcbiAgICBbXyxfLF8sNiw2XSxcbiAgICBbNiw2LF8sNiw2XVxuICBdLFxuXG4gIGVudGl0eU1hcDogW1xuICAgIFtfLF8sXyxfLF9dLFxuICAgIFtfLFIsXyxCLF9dLFxuICAgIFtfLF8sXyxfLEVdLFxuICAgIFtfLF8sUyxfLF9dLFxuICAgIFtfLF8sXyxfLF9dXG4gIF1cbn1cbiIsIi8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxudmFyIGV4dGVuZCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iajtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvcjtcbiAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbn07XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKVxuXG52YXIgRXZlbnRzID0ge31cblxuRXZlbnRzLnRyaWdnZXIgPSBmdW5jdGlvbigvKiBTdHJpbmcgKi8gdG9waWMsIC8qIEFycmF5PyAqLyBhcmdzKSB7XG4gIC8vIHN1bW1hcnk6XG4gIC8vICAgIFB1Ymxpc2ggc29tZSBkYXRhIG9uIGEgbmFtZWQgdG9waWMuXG4gIC8vIHRvcGljOiBTdHJpbmdcbiAgLy8gICAgVGhlIGNoYW5uZWwgdG8gcHVibGlzaCBvblxuICAvLyBhcmdzOiBBcnJheT9cbiAgLy8gICAgVGhlIGRhdGEgdG8gcHVibGlzaC4gRWFjaCBhcnJheSBpdGVtIGlzIGNvbnZlcnRlZCBpbnRvIGFuIG9yZGVyZWRcbiAgLy8gICAgYXJndW1lbnRzIG9uIHRoZSBzdWJzY3JpYmVkIGZ1bmN0aW9ucy5cbiAgLy9cbiAgLy8gZXhhbXBsZTpcbiAgLy8gICAgUHVibGlzaCBzdHVmZiBvbiAnL3NvbWUvdG9waWMnLiBBbnl0aGluZyBzdWJzY3JpYmVkIHdpbGwgYmUgY2FsbGVkXG4gIC8vICAgIHdpdGggYSBmdW5jdGlvbiBzaWduYXR1cmUgbGlrZTogZnVuY3Rpb24oYSxiLGMpIHsgLi4uIH1cbiAgLy9cbiAgLy8gICAgdHJpZ2dlcihcIi9zb21lL3RvcGljXCIsIFtcImFcIixcImJcIixcImNcIl0pXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm5cblxuICB2YXIgc3VicyA9IHRoaXMuX2V2ZW50c1t0b3BpY10sXG4gICAgbGVuID0gc3VicyA/IHN1YnMubGVuZ3RoIDogMFxuXG4gIC8vY2FuIGNoYW5nZSBsb29wIG9yIHJldmVyc2UgYXJyYXkgaWYgdGhlIG9yZGVyIG1hdHRlcnNcbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgc3Vic1tsZW5dLmFwcGx5KEV2ZW50cywgYXJncyB8fCBbXSlcbiAgfVxufVxuXG5FdmVudHMub24gPSBmdW5jdGlvbigvKiBTdHJpbmcgKi8gdG9waWMsIC8qIEZ1bmN0aW9uICovIGNhbGxiYWNrKSB7XG4gIC8vIHN1bW1hcnk6XG4gIC8vICAgIFJlZ2lzdGVyIGEgY2FsbGJhY2sgb24gYSBuYW1lZCB0b3BpYy5cbiAgLy8gdG9waWM6IFN0cmluZ1xuICAvLyAgICBUaGUgY2hhbm5lbCB0byBzdWJzY3JpYmUgdG9cbiAgLy8gY2FsbGJhY2s6IEZ1bmN0aW9uXG4gIC8vICAgIFRoZSBoYW5kbGVyIGV2ZW50LiBBbnl0aW1lIHNvbWV0aGluZyBpcyB0cmlnZ2VyJ2VkIG9uIGFcbiAgLy8gICAgc3Vic2NyaWJlZCBjaGFubmVsLCB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGVcbiAgLy8gICAgcHVibGlzaGVkIGFycmF5IGFzIG9yZGVyZWQgYXJndW1lbnRzLlxuICAvL1xuICAvLyByZXR1cm5zOiBBcnJheVxuICAvLyAgICBBIGhhbmRsZSB3aGljaCBjYW4gYmUgdXNlZCB0byB1bnN1YnNjcmliZSB0aGlzIHBhcnRpY3VsYXIgc3Vic2NyaXB0aW9uLlxuICAvL1xuICAvLyBleGFtcGxlOlxuICAvLyAgICBvbihcIi9zb21lL3RvcGljXCIsIGZ1bmN0aW9uKGEsIGIsIGMpIHsgLyogaGFuZGxlIGRhdGEgKi8gfSlcblxuICB0aGlzLl9ldmVudHMgfHwgKHRoaXMuX2V2ZW50cyA9IHt9KVxuXG4gIGlmICghdGhpcy5fZXZlbnRzW3RvcGljXSkge1xuICAgIHRoaXMuX2V2ZW50c1t0b3BpY10gPSBbXVxuICB9XG4gIHRoaXMuX2V2ZW50c1t0b3BpY10ucHVzaChjYWxsYmFjaylcbiAgcmV0dXJuIFt0b3BpYywgY2FsbGJhY2tdIC8vIEFycmF5XG59XG5cbkV2ZW50cy5vZmYgPSBmdW5jdGlvbigvKiBBcnJheSBvciBTdHJpbmcgKi8gaGFuZGxlKSB7XG4gIC8vIHN1bW1hcnk6XG4gIC8vICAgIERpc2Nvbm5lY3QgYSBzdWJzY3JpYmVkIGZ1bmN0aW9uIGZvciBhIHRvcGljLlxuICAvLyBoYW5kbGU6IEFycmF5IG9yIFN0cmluZ1xuICAvLyAgICBUaGUgcmV0dXJuIHZhbHVlIGZyb20gYW4gYG9uYCBjYWxsLlxuICAvLyBleGFtcGxlOlxuICAvLyAgICB2YXIgaGFuZGxlID0gb24oXCIvc29tZS90b3BpY1wiLCBmdW5jdGlvbigpIHt9KVxuICAvLyAgICBvZmYoaGFuZGxlKVxuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuXG5cbiAgdmFyIHN1YnMgPSB0aGlzLl9ldmVudHNbdHlwZW9mIGhhbmRsZSA9PT0gJ3N0cmluZycgPyBoYW5kbGUgOiBoYW5kbGVbMF1dXG4gIHZhciBjYWxsYmFjayA9IHR5cGVvZiBoYW5kbGUgPT09ICdzdHJpbmcnID8gaGFuZGxlWzFdIDogZmFsc2VcbiAgdmFyIGxlbiA9IHN1YnMgPyBzdWJzLmxlbmd0aCA6IDBcblxuICB3aGlsZSAobGVuLS0pIHtcbiAgICBpZiAoc3Vic1tsZW5dID09PSBjYWxsYmFjayB8fCAhY2FsbGJhY2spIHtcbiAgICAgIHN1YnMuc3BsaWNlKGxlbiwgMSlcbiAgICB9XG4gIH1cbn1cblxuRXZlbnRzLmVjaG8gPSBmdW5jdGlvbigvKiBTdHJpbmcgKi8gdG9waWMsIC8qIE9iamVjdCAqLyBlbWl0dGVyKSB7XG4gIGVtaXR0ZXIub24odG9waWMsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudHJpZ2dlcih0b3BpYywgYXJndW1lbnRzKVxuICB9LmJpbmQodGhpcykpXG59XG5cblxudmFyIHB1YnN1YiA9IG1vZHVsZS5leHBvcnRzID0ge31cblxucHVic3ViLkV2ZW50cyA9IEV2ZW50c1xucHVic3ViLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICBleHRlbmQob2JqLCBFdmVudHMpXG59XG5wdWJzdWIuZXh0ZW5kKHB1YnN1YilcbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnLi9saWIvaW5oZXJpdHMnKVxudmFyIEJ1dHRvbiA9IHJlcXVpcmUoJy4vYnV0dG9uJylcblxudmFyIFF1ZXVlQnV0dG9uID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBRdWV1ZUJ1dHRvbihidXR0b24sIHBvcykge1xuICB2YXIgYnRuID0ge1xuICAgIHBvczogcG9zLFxuICAgIHdpZHRoOiA0MCxcbiAgICBoZWlnaHQ6IDQwLFxuICAgIHNwcml0ZTogYnV0dG9uLnNwcml0ZSxcbiAgICBmcmFtZU9mZjogYnV0dG9uLmZyYW1lT2ZmLFxuICAgIGZyYW1lT246IGJ1dHRvbi5mcmFtZU9uLFxuICAgIGNvbW1hbmQ6IGJ1dHRvbi5jb21tYW5kXG4gIH1cbiAgQnV0dG9uLmNhbGwodGhpcywgYnRuKVxufVxuXG5pbmhlcml0cyhRdWV1ZUJ1dHRvbiwgQnV0dG9uKVxuXG5RdWV1ZUJ1dHRvbi5wcm90b3R5cGUudGFwcGVkID0gZnVuY3Rpb24oKSB7XG4gIHB1YnN1Yi50cmlnZ2VyKCdxdWV1ZUJ1dHRvblByZXNzZWQnLCBbdGhpc10pXG59XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBRdWV1ZUJ1dHRvbiA9IHJlcXVpcmUoJy4vcXVldWVCdXR0b24nKVxudmFyIFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJylcblxudmFyIFF1ZXVlTWFuYWdlciA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5idXR0b25zID0gW11cbiAgcHVic3ViLm9uKCdjb21tYW5kQnV0dG9uUHJlc3NlZCcsIHRoaXMuZW5xdWV1ZS5iaW5kKHRoaXMpKVxuICBwdWJzdWIub24oJ3F1ZXVlQnV0dG9uUHJlc3NlZCcsIHRoaXMucmVtb3ZlLmJpbmQodGhpcykpXG59XG5cblF1ZXVlTWFuYWdlci5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uKGJ0bikge1xuICBpZiAoYnRuLmNvbW1hbmQgPT09ICdzdGFydCcpIHJldHVybiBwdWJzdWIudHJpZ2dlcigncm9ib3RTdGFydCcpXG4gIHZhciB4ID0gdGhpcy5idXR0b25zLmxlbmd0aCAqIDQyICsgMTBcbiAgdmFyIHkgPSB0aGlzLmdhbWUuaGVpZ2h0IC0gNTBcbiAgdmFyIGJ1dHRvbiA9IG5ldyBRdWV1ZUJ1dHRvbihidG4sIHt4OngseTp5fSlcbiAgdGhpcy5idXR0b25zLnB1c2goYnV0dG9uKVxufVxuXG5RdWV1ZU1hbmFnZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGJ0bikge1xuICB2YXIgaW5kZXggPSB0aGlzLmJ1dHRvbnMuaW5kZXhPZihidG4pXG4gIHRoaXMuYnV0dG9ucy5zcGxpY2UoaW5kZXgsIDEpXG4gIHRoaXMucmVjYWxjdWxhdGVQb3NYKGluZGV4KVxuICByZXR1cm4gYnRuXG59XG5cblF1ZXVlTWFuYWdlci5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XG4gIHZhciBidG4gPSB0aGlzLmJ1dHRvbnMuc2hpZnQoKVxuICB0aGlzLnJlY2FsY3VsYXRlUG9zWCgpXG4gIHJldHVybiBidG4uY29tbWFuZFxufVxuXG5RdWV1ZU1hbmFnZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuYnV0dG9ucyA9IFtdXG59XG5cblF1ZXVlTWFuYWdlci5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuYnV0dG9ucy5sZW5ndGhcbn1cblxuUXVldWVNYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKz0xKSB7XG4gICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZSgpXG4gIH1cbn1cblxuUXVldWVNYW5hZ2VyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS5kcmF3KGN0eClcbiAgfVxufVxuXG5RdWV1ZU1hbmFnZXIucHJvdG90eXBlLnJlY2FsY3VsYXRlUG9zWCA9IGZ1bmN0aW9uKGlkeCkge1xuICBmb3IgKHZhciBpID0gaWR4IHx8IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKz0xKSB7XG4gICAgdGhpcy5idXR0b25zW2ldLnBvcy54ID0gaSAqIDQyICsgMTBcbiAgfVxufVxuIiwidmFyIHZlY3RvcjIgPSByZXF1aXJlKCcuL3ZlY3RvcjInKVxudmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG5cbnZhciBCYWxsID0gcmVxdWlyZSgnLi9iYWxsJylcblxudmFyIFJvYm90ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBSb2JvdChwb3MpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLnBvcyA9IHBvc1xuICB0aGlzLmRpciA9IHsgeDoxLCB5OjAgfVxuICB0aGlzLnF1ZXVlID0gdGhpcy5nYW1lLnF1ZXVlTWFuYWdlclxuICB0aGlzLmZyZXEgPSA0MDBcbiAgdGhpcy5ibG9ja2VkID0gZmFsc2VcblxuICAvLyBwdWJzdWIub24oJ2NvbW1hbmRCdXR0b25QcmVzc2VkJywgdGhpcy5lbnF1ZXVlLmJpbmQodGhpcykpXG4gIHB1YnN1Yi5vbigncm9ib3RTdGFydCcsIHRoaXMuc3RhcnQuYmluZCh0aGlzKSlcbn1cblxuUm9ib3QucHJvdG90eXBlLm1vdmVGb3J3YXJkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBncmlkID0gdGhpcy5nYW1lLmxldmVsTWFuYWdlci5jdXJyZW50LmdyaWRcbiAgdmFyIG5ld1BvcyA9IHZlY3RvcjIuYWRkKHRoaXMucG9zLCB0aGlzLmRpcilcbiAgaWYgKCFncmlkW25ld1Bvcy55XSB8fCAhZ3JpZFtuZXdQb3MueV1bbmV3UG9zLnhdKSB7XG4gICAgdGhpcy5ibG9jaygpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wb3MgPSBuZXdQb3NcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUubW92ZUJhY2t3YXJkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBncmlkID0gdGhpcy5nYW1lLmxldmVsTWFuYWdlci5jdXJyZW50LmdyaWRcbiAgdmFyIG5ld1BvcyA9IHZlY3RvcjIuc3VidHJhY3QodGhpcy5wb3MsIHRoaXMuZGlyKVxuICBpZiAoIWdyaWRbbmV3UG9zLnldIHx8ICFncmlkW25ld1Bvcy55XVtuZXdQb3MueF0pIHtcbiAgICB0aGlzLmJsb2NrKClcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnBvcyA9IG5ld1Bvc1xuICB9XG4gIHJldHVybiB0aGlzXG59XG5cblJvYm90LnByb3RvdHlwZS50dXJuTGVmdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IHRoaXMuZGlyLnhcbiAgdmFyIHkgPSB0aGlzLmRpci55XG4gIHRoaXMuZGlyLnggPSB5XG4gIHRoaXMuZGlyLnkgPSAteFxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUudHVyblJpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciB4ID0gdGhpcy5kaXIueFxuICB2YXIgeSA9IHRoaXMuZGlyLnlcbiAgdGhpcy5kaXIueCA9IC15XG4gIHRoaXMuZGlyLnkgPSB4XG4gIHJldHVybiB0aGlzXG59XG5cblJvYm90LnByb3RvdHlwZS50dXJuQXJvdW5kID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZGlyLnggKj0gLTFcbiAgdGhpcy5kaXIueSAqPSAtMVxuICByZXR1cm4gdGhpc1xufVxuXG5Sb2JvdC5wcm90b3R5cGUucGlja3VwID0gZnVuY3Rpb24oKSB7XG4gIHZhciB0YXJnZXQgPSB0aGlzLmdhbWUuZW50aXR5QXQodmVjdG9yMi5hZGQodGhpcy5wb3MsIHRoaXMuZGlyKSwgQmFsbC5uYW1lKVxuICBpZiAodGFyZ2V0ICYmIHRhcmdldC5waWNrZWRVcCgpKSB7XG4gICAgdGhpcy5iYWxsID0gdGFyZ2V0XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ibG9jaygpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuUm9ib3QucHJvdG90eXBlLnJlbGVhc2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYmFsbCAmJiB0aGlzLmJhbGwuZHJvcHBlZCgpKSB7XG4gICAgdGhpcy5iYWxsID0gbnVsbFxuICB9IGVsc2Uge1xuICAgIHRoaXMuYmxvY2soKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cblJvYm90LnByb3RvdHlwZS5tb3ZlQmFsbCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5iYWxsKSB7XG4gICAgdGhpcy5iYWxsLnBvcyA9IHZlY3RvcjIuYWRkKHRoaXMucG9zLCB0aGlzLmRpcilcbiAgfVxufVxuXG5Sb2JvdC5wcm90b3R5cGUuYmxvY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5ibG9ja2VkID0gdHJ1ZVxufVxuXG4vLyBSb2JvdC5wcm90b3R5cGUuZW5xdWV1ZSA9IGZ1bmN0aW9uKGJ0bikge1xuLy8gICB2YXIgZm5hbWUgPSBidG4uY29tbWFuZFxuLy8gICBpZiAoZm5hbWUgPT09ICdzdGFydCcpIHJldHVybiB0aGlzLnN0YXJ0KClcbi8vICAgaWYgKHR5cGVvZiB0aGlzW2ZuYW1lXSA9PSAnZnVuY3Rpb24nKVxuLy8gICAgIHRoaXMucXVldWUucHVzaChmbmFtZSlcbi8vIH1cblxuUm9ib3QucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RlcCgpXG59XG5cblJvYm90LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KVxuICB9XG59XG5cblJvYm90LnByb3RvdHlwZS5zdGVwID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnF1ZXVlLmNvdW50KCkgPT0gMCkge1xuICAgIHJldHVyblxuICB9XG4gIGlmICh0aGlzLmJsb2NrZWQpIHtcbiAgICB0aGlzLnF1ZXVlLnJlc2V0KClcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBhY3Rpb24gPSB0aGlzLnF1ZXVlLnBvcCgpXG4gIHRoaXNbYWN0aW9uXSgpXG4gIHRoaXMubW92ZUJhbGwoKVxuICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuc3RlcC5iaW5kKHRoaXMpLCB0aGlzLmZyZXEpXG59XG5cblJvYm90LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbn1cblxuUm9ib3QucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgdmFyIHNjYWxlID0gdGhpcy5nYW1lLnNjYWxlXG5cbiAgdGhpcy5nYW1lLmlzb0N0eChjdHgsIGZ1bmN0aW9uKCkge1xuXG4gICAgY3R4LnNhdmUoKVxuICAgIGN0eC50cmFuc2xhdGUoXG4gICAgICB0aGlzLnBvcy54ICogc2NhbGUgKyBzY2FsZSAvIDIsXG4gICAgICB0aGlzLnBvcy55ICogc2NhbGUgKyBzY2FsZSAvIDJcbiAgICApXG4gICAgY3R4LnJvdGF0ZShNYXRoLmF0YW4yKHRoaXMuZGlyLnksIHRoaXMuZGlyLngpKVxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmJsb2NrZWQgPyAnI2ZmMDAwMCcgOiAnIzQ0ODg0NCdcblxuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5yZWN0KFxuICAgICAgc2NhbGUgKiAtMC4zLFxuICAgICAgc2NhbGUgKiAtMC4zLFxuICAgICAgc2NhbGUgKiAwLjYsXG4gICAgICBzY2FsZSAqIDAuNlxuICAgIClcbiAgICBjdHguZmlsbCgpXG4gICAgY3R4LnN0cm9rZSgpXG5cbiAgICBjdHguYmVnaW5QYXRoKClcbiAgICBjdHgubW92ZVRvKDAsIDApXG4gICAgY3R4LmxpbmVUbyhzY2FsZSAqICh0aGlzLmJhbGw/MTowLjMpLCAwKVxuICAgIGN0eC5zdHJva2UoKVxuICAgIGN0eC5yZXN0b3JlKClcblxuICB9LmJpbmQodGhpcykpXG4gIHJldHVybiB0aGlzXG59XG4iLCJ3aW5kb3cuc3RhdHMgPSBuZXcgU3RhdHMoKTtcbnN0YXRzLnNldE1vZGUoMSk7IC8vIDA6IGZwcywgMTogbXNcbnN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5yaWdodCA9ICcwcHgnO1xuc3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHN0YXRzLmRvbUVsZW1lbnQgKTtcblxudmFyIEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKVxuXG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lID0gbmV3IEdhbWUoe1xuICBzY2FsZTogNjQsXG4gIHdpZHRoOiAxMDI0LFxuICBoZWlnaHQ6IDc2OCxcbiAgZ3JpZFNpemU6IDEwLFxuICB0b3BNYXJnaW46IDE1MCxcbiAgY2FudmFzOiAnZ2FtZSdcbn0pXG5cbmdhbWUubG9hZExldmVsKDApXG5cbmdhbWUuc3RhcnQoKVxuXG4vLyBnYW1lLmxldmVsLnRpbGVzLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gICBnYW1lLmRyYXcoKVxuLy8gfVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG52YXIgVGV4dHVyZSA9IHJlcXVpcmUoJy4vdGV4dHVyZScpXG5cbnZhciBTcHJpdGUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdGhpcy53aWR0aCA9IG9wdGlvbnMud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodFxuICB0aGlzLmZyYW1lcyA9IFtdXG4gIHRoaXMudGV4dHVyZSA9IG5ldyBUZXh0dXJlKG9wdGlvbnMudGV4dHVyZSlcbiAgdGhpcy50ZXh0dXJlLm9uKCdsb2FkJywgdGhpcy5jYWxjdWxhdGVGcmFtZXMuYmluZCh0aGlzKSlcbn1cblxudmFyIGFwaSA9IFNwcml0ZS5wcm90b3R5cGVcbnB1YnN1Yi5leHRlbmQoYXBpKVxuXG5hcGkuY2FsY3VsYXRlRnJhbWVzID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCdMT0FERUQgU1BSSVRFJywgdGhpcy50ZXh0dXJlLmltZy5zcmMpXG4gIHZhciB4ID0gKHRoaXMudGV4dHVyZS53aWR0aCAvIHRoaXMud2lkdGgpIHwgMFxuICB2YXIgeSA9ICh0aGlzLnRleHR1cmUuaGVpZ2h0IC8gdGhpcy5oZWlnaHQpIHwgMFxuXG4gIGZvciAodmFyIGl5ID0gMDsgaXkgPCB5OyBpeSsrKSB7XG4gICAgZm9yICh2YXIgaXggPSAwOyBpeCA8IHg7IGl4KyspIHtcbiAgICAgIHRoaXMuZnJhbWVzLnB1c2goe1xuICAgICAgICB4OiBpeCAqIHRoaXMud2lkdGgsXG4gICAgICAgIHk6IGl5ICogdGhpcy5oZWlnaHQsXG4gICAgICAgIHgyOiBpeCAqIHRoaXMud2lkdGggKyB0aGlzLndpZHRoLFxuICAgICAgICB5MjogaXkgKiB0aGlzLmhlaWdodCArIHRoaXMuaGVpZ2h0LFxuICAgICAgICB3OiB0aGlzLndpZHRoLFxuICAgICAgICBoOiB0aGlzLmhlaWdodFxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgdGhpcy50cmlnZ2VyKCdsb2FkJylcbn1cblxuYXBpLmRyYXcgPSBmdW5jdGlvbihjdHgsIGZyYW1lLCByZWN0KSB7XG4gIHZhciBmID0gdGhpcy5mcmFtZXNbZnJhbWVdXG4gIGlmICghZikgcmV0dXJuXG4gIGN0eC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLmltZyxcbiAgICBmLngsIGYueSwgZi53LCBmLmgsXG4gICAgcmVjdC54LCByZWN0LnksIHJlY3QudywgcmVjdC5oKVxufVxuXG5cblxuIiwiXG52YXIgU3dpdGNoID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBTd2l0Y2gocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3NcbiAgdGhpcy5zdGF0ZSA9IFN3aXRjaC5TVEFURS5PRkZcbn1cblxuU3dpdGNoLnByb3RvdHlwZS50dXJuT24gPSBmdW5jdGlvbihlbnQpIHtcbiAgaWYgKHRoaXMuc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PRkYpIHtcbiAgICB0aGlzLnN0YXRlID0gU3dpdGNoLlNUQVRFLk9OXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuU3dpdGNoLnByb3RvdHlwZS50dXJuT2ZmID0gZnVuY3Rpb24oZW50KSB7XG4gIGlmICh0aGlzLnN0YXRlID09PSBTd2l0Y2guU1RBVEUuT04pIHtcbiAgICB0aGlzLnN0YXRlID0gU3dpdGNoLlNUQVRFLk9GRlxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cblN3aXRjaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG59XG5cblN3aXRjaC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICB2YXIgZDJyID0gdGhpcy5nYW1lLmQyclxuICB2YXIgc2NhbGUgPSB0aGlzLmdhbWUuc2NhbGVcbiAgdGhpcy5nYW1lLmlzb0N0eChjdHgsIGZ1bmN0aW9uKCkge1xuICAgIGN0eC50cmFuc2xhdGUoXG4gICAgICB0aGlzLnBvcy54ICogc2NhbGUgKyBzY2FsZSAvIDIsXG4gICAgICB0aGlzLnBvcy55ICogc2NhbGUgKyBzY2FsZSAvIDJcbiAgICApXG5cbiAgICB2YXIgcmFkaXVzID0gc2NhbGUqMC4zXG5cbiAgICAvLyBmaWxsIHRoZSBzcXVhcmVcbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5zdGF0ZSA9PT0gU3dpdGNoLlNUQVRFLk9OID8gJyMwMEZGMDAnIDogJyNGRjAwMDAnXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LnJlY3QoLXNjYWxlLzIsIC1zY2FsZS8yLCBzY2FsZSwgc2NhbGUpXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuXG4gICAgLy8gZHJhdyB0aGUgcmVjaWV2ZXJcbiAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LmFyYygwLCAwLCByYWRpdXMsIGQycigwKSwgZDJyKDM2MCkpXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuICB9LmJpbmQodGhpcykpXG59XG5cblN3aXRjaC5TVEFURSA9IHtcbiAgT04gOiAxLFxuICBPRkYgOiAwXG59XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcblxudmFyIGNhY2hlID0ge31cblxudmFyIFRleHR1cmUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNyYykge1xuICBpZiAoY2FjaGVbc3JjXSkgcmV0dXJuIGNhY2hlW3NyY11cblxuICB0aGlzLmlzTG9hZGVkID0gZmFsc2VcbiAgdGhpcy5sb2FkKHNyYylcbiAgY2FjaGVbc3JjXSA9IHRoaXNcbn1cblxudmFyIGFwaSA9IFRleHR1cmUucHJvdG90eXBlXG5wdWJzdWIuZXh0ZW5kKGFwaSlcblxuYXBpLmxvYWQgPSBmdW5jdGlvbihzcmMpIHtcbiAgdmFyIGltZyA9IHRoaXMuaW1nID0gbmV3IEltYWdlKClcbiAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlXG4gICAgdGhpcy53aWR0aCA9IGltZy53aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gaW1nLmhlaWdodFxuICAgIHRoaXMudHJpZ2dlcignbG9hZCcpXG4gIH0uYmluZCh0aGlzKVxuICBpbWcuc3JjID0gc3JjXG59XG5cbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIFRleHR1cmUgPSByZXF1aXJlKCcuL3RleHR1cmUnKVxuXG52YXIgVGlsZVNldCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3JjLCB3LCBoLCBveCwgb3kpIHtcbiAgdGhpcy53aWR0aCA9IHdcbiAgdGhpcy5oZWlnaHQgPSBoXG4gIHRoaXMub2Zmc2V0WCA9IG94XG4gIHRoaXMub2Zmc2V0WSA9IG95XG4gIHRoaXMuc3JjID0gc3JjXG5cbiAgdGhpcy50ZXh0dXJlID0gbmV3IFRleHR1cmUoc3JjKVxuICB0aGlzLmVjaG8oJ2xvYWQnLCB0aGlzLnRleHR1cmUpXG59XG5cbnB1YnN1Yi5leHRlbmQoVGlsZVNldC5wcm90b3R5cGUpXG5cblRpbGVTZXQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgsIHQsIHgsIHksIHcpIHtcbiAgdmFyIHN4ID0gdCAqIHRoaXMud2lkdGhcbiAgdmFyIHN5ID0gMFxuICB2YXIgc3cgPSB0aGlzLndpZHRoXG4gIHZhciBzaCA9IHRoaXMuaGVpZ2h0XG5cbiAgLy8gdGhlIHNjYWxlciBpcyB0aGUgd2lkdGggb2YgdGhlIGRlc3RpbmF0aW9uIHRpbGUgZGl2aWRlZFxuICAvLyBieSB0aGUgXCJ0cnVlXCIgd2lkdGggb2YgdGhlIHRpbGUgaW4gdGhlIGltYWdlXG4gIHZhciBzY2FsZXIgPSB3IC8gKHRoaXMud2lkdGggLSB0aGlzLm9mZnNldFgqMilcblxuICB2YXIgZHcgPSB0aGlzLndpZHRoICogc2NhbGVyXG4gIHZhciBkaCA9IHRoaXMuaGVpZ2h0ICogc2NhbGVyXG4gIHZhciBkeCA9IHggLSBkdyowLjVcbiAgdmFyIGR5ID0geSAtIHRoaXMub2Zmc2V0WSAqIHNjYWxlclxuXG4gIGN0eC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLmltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoKVxufVxuXG5cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGVxdWFsOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEueCA9PT0gYi54ICYmIGEueSA9PT0gYi55XG4gIH0sXG5cbiAgYWRkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMClcbiAgICB2YXIgdiA9IHsgeDowLCB5OjAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgdi54ICs9IGFyZ3NbaV0ueFxuICAgICAgdi55ICs9IGFyZ3NbaV0ueVxuICAgIH1cbiAgICByZXR1cm4gdlxuICB9LFxuXG4gIHN1YnRyYWN0OiBmdW5jdGlvbih2KSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgdiA9IHsgeDp2LngsIHk6di55IH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHYueCAtPSBhcmdzW2ldLnhcbiAgICAgIHYueSAtPSBhcmdzW2ldLnlcbiAgICB9XG4gICAgcmV0dXJuIHZcbiAgfVxuXG59XG4iXX0=
;