(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Switch = require('./switch')

var Ball = module.exports = function Ball(pos) {
  this.game = require('./game').game
  this.pos = pos
}

Ball.prototype.dropped = function() {
  var level = this.game.levelManager.current
  var target = level.entities.atPos(this.pos, Switch.name)
  if (target) {
    return target.turnOn(this)
  }
  return true
}

Ball.prototype.pickedUp = function() {
  var level = this.game.levelManager.current
  var target = level.entities.atPos(this.pos, Switch.name)
  if (target) {
    return target.turnOff(this)
  }
  return true
}

Ball.prototype.update = function() {

}

Ball.prototype.draw = function(ctx) {
  var d2r = Math.d2r
  var scale = this.game.scale
  ctx.iso(function() {
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

},{"./game":8,"./switch":24}],2:[function(require,module,exports){
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

},{"./game":8,"./lib/pubsub":18}],3:[function(require,module,exports){
var buttonDefs = require('./config/buttons')
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

},{"./button":2,"./config/buttons":4,"./sprite":23}],4:[function(require,module,exports){
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

},{"../levels/first":14,"../levels/second":15}],6:[function(require,module,exports){
var vector2 = require('./vector2')
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

var EntityManager = module.exports = function(entMap) {
  this.entities = []
  this.byType = {}
  this.loadEntities(entMap)
}

var proto = EntityManager.prototype

// load the entities from the level
proto.loadEntities = function(map) {
  for (var y = 0; y < map.length; y+=1) {
    for (var x = 0; x < map[y].length; x+=1) {
      var Ent = enthash[map[y][x]]
      if (Ent) {
        // create the entity
        var ent = new Ent({x:x,y:y})
        // check to see if it's the robot
        if (ent instanceof Robot) this.robot = ent
        // add it to the entity collection
        this.add(Ent.name, ent)
      }
    }
  }
}

proto.add = function(type, ent) {
  this.entities.push(ent)
  this.byType[type] || (this.byType[type] = [])
  this.byType[type].push(ent)
}

proto.ofType = function(type) {
  return this.byType[type]
}

proto.atPos = function(pos, type) {
  var ents = this.byType[type]
  for (var i = 0; i < ents.length; i+=1) {
    var ent = ents[i]
    if (vector2.equal(ent.pos, pos)) {
      return ent
    }
  }
  return null
}

proto.invoke = function(fnName, args, type) {
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

proto._doInvoke0 = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName]()
  }
}

proto._doInvoke1 = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName](args[0])
  }
}

proto._doInvoke2 = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName](args[0], args[1])
  }
}

proto._doInvoke3 = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName](args[0], args[1], args[2])
  }
}

proto._doInvokeA = function(fnName, args, ents) {
  for (var i = 0; i < ents.length; i+=1) {
    ents[i][fnName].apply(ents[i], args)
  }
}

},{"./ball":1,"./exit":7,"./robot":21,"./switch":24,"./vector2":28}],7:[function(require,module,exports){
var pubsub = require('./lib/pubsub')
var Switch = require('./switch')
var Robot = require('./robot')

var Exit = module.exports = function Exit(pos) {
  this.game = require('./game').game
  this.pos = pos
}

Exit.prototype.update = function() {
  this.state = Exit.STATE.INACTIVE
  if (this.allSwitchesOn()) {
    this.state = Exit.STATE.ACTIVE

    var level = this.game.levelManager.current
    var r = level.entities.atPos(this.pos, Robot.name)
    if (r) {
      pubsub.trigger('exitLevel')
    }
  }
}

Exit.prototype.draw = function(ctx) {
  var scale = this.game.scale
  ctx.iso(function() {
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
  var level = this.game.levelManager.current
  var ents = level.entities.ofType(Switch.name)
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

},{"./game":8,"./lib/pubsub":18,"./robot":21,"./switch":24}],8:[function(require,module,exports){
var vector2 = require('./vector2')
var Input = require('./input')
var Timer = require('./timer')
var LevelManager = require('./levelManager')

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
  this.levelManager = new LevelManager()
}

var proto = Game.prototype

proto.loadLevel = function(idx) {
  var level = this.levelManager.load(idx)
}

// starts the game loop
proto.start = function() {
  this.loop()
}

// suspends the game loop
proto.stop = function() {
  cancelAnimationFrame(this.rAFID)
}
proto.pause = proto.stop

// the game loop
proto.loop = function() {
  this.rAFID = requestAnimationFrame(this.loop.bind(this), this.ctx.canvas)

  stats.begin();

  this.update()
  this.draw()

  stats.end();
}

// update all the things
proto.update = function() {
  Timer.step()
  this.levelManager.update()
}

// draw all the things
proto.draw = function() {
  this.ctx.clearRect(0, 0, this.width, this.height)

  // draw the level
  this.levelManager.draw(this.ctx)
}

// setup canvase elements to the correct size
proto.initCanvas = function(id, width, height) {
  var canvas = document.getElementById(id)
  canvas.width = width
  canvas.height = height
  return canvas.getContext('2d')
}




// degrees to radians
Math.d2r = function(a) {
  return a * (Math.PI/180)
}

// radians to degress
Math.r2d = function(a) {
  return a / (Math.PI/180)
}


var theta = Math.d2r(45)
var csTheta = Math.cos(theta)
var snTheta = Math.sin(theta)
var thetaInv = Math.d2r(315)
var csThetaInv = Math.cos(thetaInv)
var snThetaInv = Math.sin(thetaInv)

// translate screen to world
proto.s2w = function(pos) {
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
proto.w2s = function(pos) {
  // translate
  pos.x -= this.width/2
  pos.y -= this.topMargin
  // scale
  pos.y /= 0.51
  // rotate
  var y = pos.y
  var x = pos.x
  pos.x = x * csThetaInv - y * snThetaInv
  pos.y = x * snThetaInv + y * csThetaInv
  return pos
}


// transform the context into isometric
CanvasRenderingContext2D.prototype.iso = function(fn) {
  this.save()

  // move the game board down a bit
  this.translate(0, Game.game.topMargin)
  this.translate(Game.game.width/2, 0)
  this.scale(1, 0.5)
  this.rotate(45 * Math.PI / 180)
  // this.transform(0.707, 0.409, -0.707, 0.409, 0, 0)
  fn()
  this.restore()
}

},{"./input":10,"./levelManager":13,"./timer":27,"./vector2":28}],9:[function(require,module,exports){
var pubsub = require('./lib/pubsub')
var TileSet = require('./tileset')

var Grid = module.exports = function(grid, t) {
  this.game = require('./game').game

  this.grid = grid
  this.tiles = new TileSet(t.src, t.w, t.h, t.ox, t.oy)

  var p1 = this.game.s2w({x:0, y:0})
  var p2 = this.game.s2w({x:0, y:this.game.scale})
  this.isoTileWidth = Math.abs(p2.x - p1.x)*2

  this.echo('load', this.tiles)
}

pubsub.extend(Grid.prototype)

var proto = Grid.prototype

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

  // ctx.iso(function() {

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

},{"./game":8,"./lib/pubsub":18,"./tileset":26}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
var Intermission = module.exports = function() {

}

var proto = Intermission.prototype

proto.update = function() {

}

proto.draw = function() {

}

},{}],12:[function(require,module,exports){
var pubsub = require('./lib/pubsub')
var Grid = require('./grid')
var ButtonManager = require('./buttonManager')
var QueueManager = require('./queueManager')
var EntityManager = require('./entityManager')
var Intermission = require('./intermission')

// var _ = 0
var BALL = 'Ball'
var SWITCH = 'Switch'
var ROBOT = 'Robot'
var EXIT = 'Exit'
var UPDATE = 'update'
var DRAW = 'draw'

var Level = module.exports = function(conf) {
  this.game = require('./game').game
  this.ctx = this.game.ctx

  this.grid = new Grid(conf.grid, conf.tiles)
  this.entities = new EntityManager(conf.entityMap)
  if (this.entities.robot) {
    this.robot = this.entities.robot
  }

  this.buttonManager = new ButtonManager()
  this.queueManager = new QueueManager()

  pubsub.on('exitLevel', this.end.bind(this))
}

var proto = Level.prototype

proto.update = function() {
  if (this.intermission)
    this.intermission.update()

  this.buttonManager.update()
  this.queueManager.update()
  this.entities.invoke(UPDATE, [this.ctx], ROBOT)
  this.entities.invoke(UPDATE, [this.ctx], BALL)
  this.entities.invoke(UPDATE, [this.ctx], SWITCH)
  this.entities.invoke(UPDATE, [this.ctx], EXIT)
}

proto.draw = function(ctx) {

  // draw the grid
  this.grid.draw(ctx)

  // draw each entity
  this.entities.invoke(DRAW, [this.ctx], EXIT)
  this.entities.invoke(DRAW, [this.ctx], SWITCH)
  this.entities.invoke(DRAW, [this.ctx], ROBOT)
  this.entities.invoke(DRAW, [this.ctx], BALL)

  // draw any UI last
  this.buttonManager.draw(this.ctx)
  this.queueManager.draw(this.ctx)
  if (this.intermission) {
    this.intermission.draw(ctx)
  }

}

proto.dispose = function() {

}

proto.end = function() {
  this.intermission = new Intermission()
}

},{"./buttonManager":3,"./entityManager":6,"./game":8,"./grid":9,"./intermission":11,"./lib/pubsub":18,"./queueManager":20}],13:[function(require,module,exports){
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


},{"./config/levels":5,"./level":12}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"./extend":16}],19:[function(require,module,exports){
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

var proto = QueueButton.prototype

proto.tapped = function() {
  pubsub.trigger('queueButtonPressed', [this])
}

proto.draw = function(ctx, current) {
  // draw a border around the button being executed
  this.state = Button.STATE.NORMAL
  if (current) {
    // ctx.save()
    // ctx.translate(this.pos.x, this.pos.y)
    // ctx.strokeRect(-2, -2, this.width+4, this.height+4)
    // ctx.restore()
    this.state = Button.STATE.DOWN
  }

  Button.prototype.draw.call(this, ctx)
}

},{"./button":2,"./lib/inherits":17,"./lib/pubsub":18}],20:[function(require,module,exports){
var pubsub = require('./lib/pubsub')
var QueueButton = require('./queueButton')
var Sprite = require('./sprite')

var START = 'start'
var ROBOT_START = 'robotStart'

var QueueManager = module.exports = function() {
  this.game = require('./game').game
  this.buttons = []
  this.curIndex = -1
  pubsub.on('commandButtonPressed', this.enqueue.bind(this))
  pubsub.on('queueButtonPressed', this.remove.bind(this))
}

var proto = QueueManager.prototype

proto.enqueue = function(btn) {
  if (btn.command === START) return pubsub.trigger(ROBOT_START)
  var x = this.buttons.length * 42 + 10
  var y = this.game.height - 50
  var button = new QueueButton(btn, {x:x,y:y})
  this.buttons.push(button)
}

proto.remove = function(btn) {
  var index = this.buttons.indexOf(btn)
  this.buttons.splice(index, 1)
  this.recalculatePosX(index)
  return btn
}

proto.next = function() {
  this.curIndex += 1
  var btn = this.buttons[this.curIndex]
  return btn && btn.command || null
}

proto.reset = function() {
  this.curIndex = -1
}

proto.clear = function() {
  this.buttons = []
}

proto.count = function() {
  return this.buttons.length - (this.curIndex + 1)
}

proto.update = function() {
  for (var i = 0; i < this.buttons.length; i+=1) {
    this.buttons[i].update()
  }
}

proto.draw = function(ctx) {
  for (var i = 0; i < this.buttons.length; i+=1) {
    this.buttons[i].draw(ctx, this.curIndex == i)
  }
}

proto.recalculatePosX = function(idx) {
  for (var i = idx || 0; i < this.buttons.length; i+=1) {
    this.buttons[i].pos.x = i * 42 + 10
  }
}

},{"./game":8,"./lib/pubsub":18,"./queueButton":19,"./sprite":23}],21:[function(require,module,exports){
var vector2 = require('./vector2')
var pubsub = require('./lib/pubsub')
var Timer = require('./timer')

var Ball = require('./ball')

var Robot = module.exports = function Robot(pos) {
  this.game = require('./game').game
  this.startPosition = {
    pos: { x:pos.x, y:pos.y },
    dir: { x:1, y:0 }
  }
  this.pos = pos
  this.dir = { x:1, y:0 }
  this.freq = 0.4
  this.blocked = false
  this.stopped = true

  this.timer = new Timer(Number.MAX_VALUE)
  this.timer.pause()

  pubsub.on('robotStart', this.start.bind(this))
}

var proto = Robot.prototype

proto.move = function(newPos) {
  var grid = this.game.levelManager.current.grid.grid
  if (!grid[newPos.y] || !grid[newPos.y][newPos.x]) {
    this.block()
  } else {
    this.pos = newPos
  }
  return this
}

proto.moveForward = function() {
  var newPos = vector2.add(this.pos, this.dir)
  return this.move(newPos)
}

proto.moveBackward = function() {
  var newPos = vector2.subtract(this.pos, this.dir)
  return this.move(newPos)
}

proto.turnLeft = function() {
  var x = this.dir.x
  var y = this.dir.y
  this.dir.x = y
  this.dir.y = -x
  return this
}

proto.turnRight = function() {
  var x = this.dir.x
  var y = this.dir.y
  this.dir.x = -y
  this.dir.y = x
  return this
}

proto.turnAround = function() {
  this.dir.x *= -1
  this.dir.y *= -1
  return this
}

proto.pickup = function() {
  var level = this.game.levelManager.current
  var target = level.entities.atPos(vector2.add(this.pos, this.dir), Ball.name)
  if (target && target.pickedUp()) {
    this.ball = target
  } else {
    this.block()
  }
  return this
}

proto.release = function() {
  if (this.ball && this.ball.dropped()) {
    this.ball = null
  } else {
    this.block()
  }
  return this
}

proto.moveBall = function() {
  if (this.ball) {
    this.ball.pos = vector2.add(this.pos, this.dir)
  }
}

proto.block = function() {
  this.blocked = true
}

proto.unblock = function() {
  this.blocked = false
  var start = this.startPosition
  this.pos = { x:start.pos.x, y:start.pos.y }
  this.dir = { x:start.dir.x, y:start.dir.y }
}

proto.start = function() {
  this.unblock()
  this.timer.set(this.freq)
  this.timer.unpause()
}

proto.stop = function() {
  this.timer.pause()
}

proto.update = function() {
  if (!this.timer.paused() && this.timer.delta() > 0) {
    var queue = this.game.levelManager.current.queueManager
    var action = queue.next()

    if (!action || this.blocked) {
      queue.reset()
      return this.stop()
    }

    this[action]()
    this.moveBall()
    this.timer.set(this.freq)
  }
}

proto.draw = function(ctx) {
  var scale = this.game.scale

  ctx.iso(function() {

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

},{"./ball":1,"./game":8,"./lib/pubsub":18,"./timer":27,"./vector2":28}],22:[function(require,module,exports){
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

},{"./game":8}],23:[function(require,module,exports){
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




},{"./lib/pubsub":18,"./texture":25}],24:[function(require,module,exports){

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
  var d2r = Math.d2r
  var scale = this.game.scale
  ctx.iso(function() {
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

},{"./game":8}],25:[function(require,module,exports){
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


},{"./lib/pubsub":18}],26:[function(require,module,exports){
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

var proto = TileSet.prototype

proto.draw = function(ctx, t, x, y, w) {
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


},{"./lib/pubsub":18,"./texture":25}],27:[function(require,module,exports){
var Timer = module.exports = function(sec) {
  this.base = Timer.time
  this.last = Timer.time

  this.target = sec || 0
}

var proto = Timer.prototype

proto.target = 0
proto.base = 0
proto.last = 0
proto.pausedAt = 0

proto.set = function(sec) {
  this.target = sec || 0
  this.base = Timer.time
  this.pausedAt = 0
}

proto.reset = function() {
  this.base = Timer.time
  this.pausedAt = 0
}

proto.tick = function() {
  var delta = Timer.time - this.last
  this.last = Timer.time
  return this.pausedAt ? 0 : delta
}

proto.delta = function() {
  return (this.pausedAt || Timer.time) - this.base - this.target
}

proto.pause = function() {
  if (!this.pausedAt)
    this.pausedAt = Timer.time
}

proto.unpause = function() {
  if (this.pausedAt) {
    this.base += Timer.time - this.pausedAt
    this.pausedAt = 0
  }
}

proto.paused = function() {
  return !!this.pausedAt
}

Timer._last = 0
Timer.time = Number.MIN_VALUE
Timer.timeScale = 1
Timer.maxStep = 0.05

Timer.step = function() {
  var current = Date.now()
  var delta = (current - Timer._last) / 1000
  Timer.time += Math.min(delta, Timer.maxStep) * Timer.timeScale
  Timer._last = current
}

},{}],28:[function(require,module,exports){
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

},{}]},{},[22])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2JhbGwuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2J1dHRvbi5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvYnV0dG9uTWFuYWdlci5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvY29uZmlnL2J1dHRvbnMuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2NvbmZpZy9sZXZlbHMuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2VudGl0eU1hbmFnZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2V4aXQuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2dhbWUuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2dyaWQuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2lucHV0LmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9pbnRlcm1pc3Npb24uanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2xldmVsLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9sZXZlbE1hbmFnZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2xldmVscy9maXJzdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGV2ZWxzL3NlY29uZC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2V4dGVuZC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2luaGVyaXRzLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9saWIvcHVic3ViLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9xdWV1ZUJ1dHRvbi5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvcXVldWVNYW5hZ2VyLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9yb2JvdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvc2NyaXB0LmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9zcHJpdGUuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL3N3aXRjaC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGV4dHVyZS5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGlsZXNldC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGltZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL3ZlY3RvcjIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vc3dpdGNoJylcblxudmFyIEJhbGwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEJhbGwocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3Ncbn1cblxuQmFsbC5wcm90b3R5cGUuZHJvcHBlZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbGV2ZWwgPSB0aGlzLmdhbWUubGV2ZWxNYW5hZ2VyLmN1cnJlbnRcbiAgdmFyIHRhcmdldCA9IGxldmVsLmVudGl0aWVzLmF0UG9zKHRoaXMucG9zLCBTd2l0Y2gubmFtZSlcbiAgaWYgKHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQudHVybk9uKHRoaXMpXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuQmFsbC5wcm90b3R5cGUucGlja2VkVXAgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGxldmVsID0gdGhpcy5nYW1lLmxldmVsTWFuYWdlci5jdXJyZW50XG4gIHZhciB0YXJnZXQgPSBsZXZlbC5lbnRpdGllcy5hdFBvcyh0aGlzLnBvcywgU3dpdGNoLm5hbWUpXG4gIGlmICh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGFyZ2V0LnR1cm5PZmYodGhpcylcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5CYWxsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcblxufVxuXG5CYWxsLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBkMnIgPSBNYXRoLmQyclxuICB2YXIgc2NhbGUgPSB0aGlzLmdhbWUuc2NhbGVcbiAgY3R4LmlzbyhmdW5jdGlvbigpIHtcbiAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgdGhpcy5wb3MueCAqIHNjYWxlICsgc2NhbGUgLyAyLFxuICAgICAgdGhpcy5wb3MueSAqIHNjYWxlICsgc2NhbGUgLyAyXG4gICAgKVxuXG4gICAgdmFyIHJhZGl1cyA9IHNjYWxlKjAuM1xuXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjNzc3N0ZGJ1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5hcmMoMCwgMCwgcmFkaXVzLCBkMnIoMCksIGQycigzNjApKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcbiAgfS5iaW5kKHRoaXMpKVxufVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG5cbnZhciBCdXR0b24gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEJ1dHRvbihidG4pIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICAvLyBjb3B5IG92ZXIgdGhlIGJ0biBwcm9wZXJ0aWVzXG4gIGZvciAodmFyIGsgaW4gYnRuKSBpZiAoYnRuLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgdGhpc1trXSA9IGJ0bltrXVxuICB9XG4gIHRoaXMuc3RhdGUgPSBCdXR0b24uU1RBVEUuTk9STUFMXG59XG5cbkJ1dHRvbi5wcm90b3R5cGUudGFwcGVkID0gZnVuY3Rpb24oKSB7XG4gIHB1YnN1Yi50cmlnZ2VyKCdjb21tYW5kQnV0dG9uUHJlc3NlZCcsIFt0aGlzXSlcbn1cblxuQnV0dG9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zdGF0ZSA9IEJ1dHRvbi5TVEFURS5OT1JNQUxcbiAgdmFyIHN0YXJ0ID0gdGhpcy5nYW1lLmlucHV0LnN0YXJ0XG4gIHZhciBjdXJyZW50ID0gdGhpcy5nYW1lLmlucHV0LmN1cnJlbnRcbiAgdmFyIHByZXZpb3VzID0gdGhpcy5nYW1lLmlucHV0LnByZXZpb3VzXG5cbiAgaWYgKGN1cnJlbnQpIHtcbiAgICBpZiAodGhpcy5jb250YWlucyhjdXJyZW50KSAmJiB0aGlzLmNvbnRhaW5zKHN0YXJ0KSkge1xuICAgICAgdGhpcy5zdGF0ZSA9IEJ1dHRvbi5TVEFURS5ET1dOXG4gICAgfVxuICB9XG4gIGVsc2UgaWYgKHByZXZpb3VzICYmIHRoaXMuY29udGFpbnMocHJldmlvdXMuZW5kKSAmJiB0aGlzLmNvbnRhaW5zKHByZXZpb3VzLnN0YXJ0KSkge1xuICAgIHRoaXMudGFwcGVkKClcbiAgICB0aGlzLmdhbWUuaW5wdXQucHJldmlvdXMgPSBudWxsXG4gIH1cbn1cblxuQnV0dG9uLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGN0eC5zYXZlKClcbiAgY3R4LnRyYW5zbGF0ZSh0aGlzLnBvcy54LCB0aGlzLnBvcy55KVxuXG4gIHZhciByZWN0ID0geyB4OjAsIHk6MCwgdzp0aGlzLndpZHRoLCBoOnRoaXMuaGVpZ2h0IH1cbiAgdmFyIGZyYW1lID0gdGhpcy5zdGF0ZSA9PSBCdXR0b24uU1RBVEUuTk9STUFMID8gdGhpcy5mcmFtZU9mZiA6IHRoaXMuZnJhbWVPblxuICB0aGlzLnNwcml0ZS5kcmF3KGN0eCwgZnJhbWUsIHJlY3QpXG5cbiAgY3R4LnJlc3RvcmUoKVxufVxuXG5CdXR0b24ucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgcmV0dXJuICEoXG4gICAgdGhpcy5wb3MueCA+IHBvaW50LnggfHxcbiAgICB0aGlzLnBvcy54ICsgdGhpcy53aWR0aCA8IHBvaW50LnggfHxcbiAgICB0aGlzLnBvcy55ID4gcG9pbnQueSB8fFxuICAgIHRoaXMucG9zLnkgKyB0aGlzLmhlaWdodCA8IHBvaW50LnlcbiAgKVxufVxuXG5CdXR0b24uU1RBVEUgPSB7XG4gIE5PUk1BTDogJ25vcm1hbCcsXG4gIERPV046ICdkb3duJ1xufVxuIiwidmFyIGJ1dHRvbkRlZnMgPSByZXF1aXJlKCcuL2NvbmZpZy9idXR0b25zJylcbnZhciBCdXR0b24gPSByZXF1aXJlKCcuL2J1dHRvbicpXG52YXIgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKVxuXG52YXIgQnV0dG9uTWFuYWdlciA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3ByaXRlcyA9IHt9XG4gIGZvciAodmFyIGtleSBpbiBidXR0b25EZWZzLnNwcml0ZXMpIHtcbiAgICB2YXIgc3ByID0gYnV0dG9uRGVmcy5zcHJpdGVzW2tleV1cbiAgICB2YXIgc3ByaXRlID0gbmV3IFNwcml0ZShzcHIpXG4gICAgdGhpcy5zcHJpdGVzW2tleV0gPSBzcHJpdGVcbiAgfVxuXG4gIHRoaXMuYnV0dG9ucyA9IFtdXG4gIGZvciAodmFyIGtleSBpbiBidXR0b25EZWZzLmJ1dHRvbnMpIHtcbiAgICB2YXIgYnRuID0gYnV0dG9uRGVmcy5idXR0b25zW2tleV1cbiAgICBidG4uc3ByaXRlID0gdGhpcy5zcHJpdGVzW2J0bi5zcHJpdGVdXG4gICAgdmFyIGJ1dHRvbiA9IG5ldyBCdXR0b24oYnRuKVxuICAgIHRoaXMuYnV0dG9ucy5wdXNoKGJ1dHRvbilcbiAgfVxufVxuXG5CdXR0b25NYW5hZ2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKz0xKSB7XG4gICAgdGhpcy5idXR0b25zW2ldLnVwZGF0ZSgpXG4gIH1cbn1cblxuQnV0dG9uTWFuYWdlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrPTEpIHtcbiAgICB0aGlzLmJ1dHRvbnNbaV0uZHJhdyhjdHgpXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHNwcml0ZXM6IHtcbiAgICBidXR0b25zOiB7XG4gICAgICB0ZXh0dXJlOiAnaW1hZ2VzL2J1dHRvbnMucG5nJyxcbiAgICAgIHdpZHRoOiA4MCxcbiAgICAgIGhlaWdodDogODBcbiAgICB9XG4gIH0sXG5cbiAgYnV0dG9uczoge1xuXG4gICAgZm9yd2FyZDoge1xuICAgICAgcG9zOiB7IHg6MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6MCxcbiAgICAgIGZyYW1lT246MSxcbiAgICAgIGNvbW1hbmQ6ICdtb3ZlRm9yd2FyZCdcbiAgICB9LFxuXG4gICAgYmFja3dhcmQ6IHtcbiAgICAgIHBvczogeyB4OjgwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjoyLFxuICAgICAgZnJhbWVPbjozLFxuICAgICAgY29tbWFuZDogJ21vdmVCYWNrd2FyZCdcbiAgICB9LFxuXG4gICAgbGVmdDoge1xuICAgICAgcG9zOiB7IHg6MTcwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjo0LFxuICAgICAgZnJhbWVPbjo1LFxuICAgICAgY29tbWFuZDogJ3R1cm5MZWZ0J1xuICAgIH0sXG5cbiAgICByaWdodDoge1xuICAgICAgcG9zOiB7IHg6MjUwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjo2LFxuICAgICAgZnJhbWVPbjo3LFxuICAgICAgY29tbWFuZDogJ3R1cm5SaWdodCdcbiAgICB9LFxuXG4gICAgcGlja3VwOiB7XG4gICAgICBwb3M6IHsgeDozNDAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjgsXG4gICAgICBmcmFtZU9uOjksXG4gICAgICBjb21tYW5kOiAncGlja3VwJ1xuICAgIH0sXG5cbiAgICByZWxlYXNlOiB7XG4gICAgICBwb3M6IHsgeDo0MjAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjEwLFxuICAgICAgZnJhbWVPbjoxMSxcbiAgICAgIGNvbW1hbmQ6ICdyZWxlYXNlJ1xuICAgIH0sXG5cbiAgICBzdGFydDoge1xuICAgICAgcG9zOiB7IHg6NTQwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjoxMixcbiAgICAgIGZyYW1lT246MTMsXG4gICAgICBjb21tYW5kOiAnc3RhcnQnXG4gICAgfSxcblxuICAgIHR1cm5Bcm91bmQ6IHtcbiAgICAgIHBvczogeyB4OjY2MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6NixcbiAgICAgIGZyYW1lT246NyxcbiAgICAgIGNvbW1hbmQ6ICd0dXJuQXJvdW5kJ1xuICAgIH0sXG5cbiAgICByZXN0YXJ0OiB7XG4gICAgICBwb3M6IHsgeDo3ODAsIHk6MCB9LFxuICAgICAgd2lkdGg6NDAsXG4gICAgICBoZWlnaHQ6NDAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjYsXG4gICAgICBmcmFtZU9uOjcsXG4gICAgICBjb21tYW5kOiAncmVzdGFydCdcbiAgICB9XG5cbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gIHJlcXVpcmUoJy4uL2xldmVscy9maXJzdCcpLFxuICByZXF1aXJlKCcuLi9sZXZlbHMvc2Vjb25kJylcbl1cbiIsInZhciB2ZWN0b3IyID0gcmVxdWlyZSgnLi92ZWN0b3IyJylcbnZhciBCYWxsID0gcmVxdWlyZSgnLi9iYWxsJylcbnZhciBTd2l0Y2ggPSByZXF1aXJlKCcuL3N3aXRjaCcpXG52YXIgUm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcbnZhciBFeGl0ID0gcmVxdWlyZSgnLi9leGl0JylcblxudmFyIGVudGhhc2ggPSB7XG4gIEI6IEJhbGwsXG4gIFM6IFN3aXRjaCxcbiAgUjogUm9ib3QsXG4gIEU6IEV4aXRcbn1cblxudmFyIEVudGl0eU1hbmFnZXIgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVudE1hcCkge1xuICB0aGlzLmVudGl0aWVzID0gW11cbiAgdGhpcy5ieVR5cGUgPSB7fVxuICB0aGlzLmxvYWRFbnRpdGllcyhlbnRNYXApXG59XG5cbnZhciBwcm90byA9IEVudGl0eU1hbmFnZXIucHJvdG90eXBlXG5cbi8vIGxvYWQgdGhlIGVudGl0aWVzIGZyb20gdGhlIGxldmVsXG5wcm90by5sb2FkRW50aXRpZXMgPSBmdW5jdGlvbihtYXApIHtcbiAgZm9yICh2YXIgeSA9IDA7IHkgPCBtYXAubGVuZ3RoOyB5Kz0xKSB7XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBtYXBbeV0ubGVuZ3RoOyB4Kz0xKSB7XG4gICAgICB2YXIgRW50ID0gZW50aGFzaFttYXBbeV1beF1dXG4gICAgICBpZiAoRW50KSB7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgZW50aXR5XG4gICAgICAgIHZhciBlbnQgPSBuZXcgRW50KHt4OngseTp5fSlcbiAgICAgICAgLy8gY2hlY2sgdG8gc2VlIGlmIGl0J3MgdGhlIHJvYm90XG4gICAgICAgIGlmIChlbnQgaW5zdGFuY2VvZiBSb2JvdCkgdGhpcy5yb2JvdCA9IGVudFxuICAgICAgICAvLyBhZGQgaXQgdG8gdGhlIGVudGl0eSBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMuYWRkKEVudC5uYW1lLCBlbnQpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnByb3RvLmFkZCA9IGZ1bmN0aW9uKHR5cGUsIGVudCkge1xuICB0aGlzLmVudGl0aWVzLnB1c2goZW50KVxuICB0aGlzLmJ5VHlwZVt0eXBlXSB8fCAodGhpcy5ieVR5cGVbdHlwZV0gPSBbXSlcbiAgdGhpcy5ieVR5cGVbdHlwZV0ucHVzaChlbnQpXG59XG5cbnByb3RvLm9mVHlwZSA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgcmV0dXJuIHRoaXMuYnlUeXBlW3R5cGVdXG59XG5cbnByb3RvLmF0UG9zID0gZnVuY3Rpb24ocG9zLCB0eXBlKSB7XG4gIHZhciBlbnRzID0gdGhpcy5ieVR5cGVbdHlwZV1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIHZhciBlbnQgPSBlbnRzW2ldXG4gICAgaWYgKHZlY3RvcjIuZXF1YWwoZW50LnBvcywgcG9zKSkge1xuICAgICAgcmV0dXJuIGVudFxuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5wcm90by5pbnZva2UgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIHR5cGUpIHtcbiAgdmFyIGVudHMgPSB0aGlzLmVudGl0aWVzXG4gIGlmICh0eXBlKSBlbnRzID0gdGhpcy5ieVR5cGVbdHlwZV1cblxuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiB0aGlzLl9kb0ludm9rZTAoZm5OYW1lLCBlbnRzKTsgYnJlYWtcbiAgICBjYXNlIDE6IHRoaXMuX2RvSW52b2tlMShmbk5hbWUsIGFyZ3MsIGVudHMpOyBicmVha1xuICAgIGNhc2UgMjogdGhpcy5fZG9JbnZva2UxKGZuTmFtZSwgYXJncywgZW50cyk7IGJyZWFrXG4gICAgY2FzZSAzOiB0aGlzLl9kb0ludm9rZTEoZm5OYW1lLCBhcmdzLCBlbnRzKTsgYnJlYWtcbiAgICBkZWZhdWx0OiB0aGlzLl9kb0ludm9rZUEoZm5OYW1lLCBhcmdzLCBlbnRzKTtcbiAgfVxufVxuXG5wcm90by5fZG9JbnZva2UwID0gZnVuY3Rpb24oZm5OYW1lLCBhcmdzLCBlbnRzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZW50cy5sZW5ndGg7IGkrPTEpIHtcbiAgICBlbnRzW2ldW2ZuTmFtZV0oKVxuICB9XG59XG5cbnByb3RvLl9kb0ludm9rZTEgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXShhcmdzWzBdKVxuICB9XG59XG5cbnByb3RvLl9kb0ludm9rZTIgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXShhcmdzWzBdLCBhcmdzWzFdKVxuICB9XG59XG5cbnByb3RvLl9kb0ludm9rZTMgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXShhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICB9XG59XG5cbnByb3RvLl9kb0ludm9rZUEgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXS5hcHBseShlbnRzW2ldLCBhcmdzKVxuICB9XG59XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBTd2l0Y2ggPSByZXF1aXJlKCcuL3N3aXRjaCcpXG52YXIgUm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcblxudmFyIEV4aXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEV4aXQocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3Ncbn1cblxuRXhpdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RhdGUgPSBFeGl0LlNUQVRFLklOQUNUSVZFXG4gIGlmICh0aGlzLmFsbFN3aXRjaGVzT24oKSkge1xuICAgIHRoaXMuc3RhdGUgPSBFeGl0LlNUQVRFLkFDVElWRVxuXG4gICAgdmFyIGxldmVsID0gdGhpcy5nYW1lLmxldmVsTWFuYWdlci5jdXJyZW50XG4gICAgdmFyIHIgPSBsZXZlbC5lbnRpdGllcy5hdFBvcyh0aGlzLnBvcywgUm9ib3QubmFtZSlcbiAgICBpZiAocikge1xuICAgICAgcHVic3ViLnRyaWdnZXIoJ2V4aXRMZXZlbCcpXG4gICAgfVxuICB9XG59XG5cbkV4aXQucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgdmFyIHNjYWxlID0gdGhpcy5nYW1lLnNjYWxlXG4gIGN0eC5pc28oZnVuY3Rpb24oKSB7XG4gICAgY3R4LnRyYW5zbGF0ZShcbiAgICAgIHRoaXMucG9zLnggKiBzY2FsZSArIHNjYWxlIC8gMixcbiAgICAgIHRoaXMucG9zLnkgKiBzY2FsZSArIHNjYWxlIC8gMlxuICAgIClcblxuICAgIGlmICh0aGlzLnN0YXRlID09IEV4aXQuU1RBVEUuSU5BQ1RJVkUpXG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNDQ0NDQ0MnXG4gICAgZWxzZVxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LnJlY3QoXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIDAuNixcbiAgICAgIHNjYWxlICogMC42XG4gICAgKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5FeGl0LnByb3RvdHlwZS5hbGxTd2l0Y2hlc09uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBsZXZlbCA9IHRoaXMuZ2FtZS5sZXZlbE1hbmFnZXIuY3VycmVudFxuICB2YXIgZW50cyA9IGxldmVsLmVudGl0aWVzLm9mVHlwZShTd2l0Y2gubmFtZSlcbiAgaWYgKCFlbnRzIHx8ICFlbnRzLmxlbmd0aCkgcmV0dXJuIHRydWVcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgaWYgKGVudHNbaV0uc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PRkYpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbkV4aXQuU1RBVEUgPSB7XG4gIEFDVElWRSA6IDEsXG4gIElOQUNUSVZFIDogMFxufVxuIiwidmFyIHZlY3RvcjIgPSByZXF1aXJlKCcuL3ZlY3RvcjInKVxudmFyIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpXG52YXIgVGltZXIgPSByZXF1aXJlKCcuL3RpbWVyJylcbnZhciBMZXZlbE1hbmFnZXIgPSByZXF1aXJlKCcuL2xldmVsTWFuYWdlcicpXG5cbnZhciBHYW1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzKSB7XG4gIEdhbWUuZ2FtZSA9IHRoaXNcblxuICB0aGlzLnNjYWxlID0gb3B0cy5zY2FsZVxuICB2YXIgd2lkdGggPSB0aGlzLndpZHRoID0gb3B0cy53aWR0aFxuICB2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSBvcHRzLmhlaWdodFxuICB0aGlzLmdyaWRTaXplID0gb3B0cy5ncmlkU2l6ZVxuICB0aGlzLnRvcE1hcmdpbiA9IG9wdHMudG9wTWFyZ2luXG5cbiAgLy8gc2V0dXAgdGhlIGNhbnZhc1xuICB0aGlzLmN0eCA9IHRoaXMuaW5pdENhbnZhcyhvcHRzLmNhbnZhcywgd2lkdGgsIGhlaWdodClcblxuICB0aGlzLmlucHV0ID0gbmV3IElucHV0KG9wdHMuY2FudmFzKVxuICB0aGlzLmxldmVsTWFuYWdlciA9IG5ldyBMZXZlbE1hbmFnZXIoKVxufVxuXG52YXIgcHJvdG8gPSBHYW1lLnByb3RvdHlwZVxuXG5wcm90by5sb2FkTGV2ZWwgPSBmdW5jdGlvbihpZHgpIHtcbiAgdmFyIGxldmVsID0gdGhpcy5sZXZlbE1hbmFnZXIubG9hZChpZHgpXG59XG5cbi8vIHN0YXJ0cyB0aGUgZ2FtZSBsb29wXG5wcm90by5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmxvb3AoKVxufVxuXG4vLyBzdXNwZW5kcyB0aGUgZ2FtZSBsb29wXG5wcm90by5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuckFGSUQpXG59XG5wcm90by5wYXVzZSA9IHByb3RvLnN0b3BcblxuLy8gdGhlIGdhbWUgbG9vcFxucHJvdG8ubG9vcCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJBRklEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpLCB0aGlzLmN0eC5jYW52YXMpXG5cbiAgc3RhdHMuYmVnaW4oKTtcblxuICB0aGlzLnVwZGF0ZSgpXG4gIHRoaXMuZHJhdygpXG5cbiAgc3RhdHMuZW5kKCk7XG59XG5cbi8vIHVwZGF0ZSBhbGwgdGhlIHRoaW5nc1xucHJvdG8udXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIFRpbWVyLnN0ZXAoKVxuICB0aGlzLmxldmVsTWFuYWdlci51cGRhdGUoKVxufVxuXG4vLyBkcmF3IGFsbCB0aGUgdGhpbmdzXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcblxuICAvLyBkcmF3IHRoZSBsZXZlbFxuICB0aGlzLmxldmVsTWFuYWdlci5kcmF3KHRoaXMuY3R4KVxufVxuXG4vLyBzZXR1cCBjYW52YXNlIGVsZW1lbnRzIHRvIHRoZSBjb3JyZWN0IHNpemVcbnByb3RvLmluaXRDYW52YXMgPSBmdW5jdGlvbihpZCwgd2lkdGgsIGhlaWdodCkge1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gIGNhbnZhcy53aWR0aCA9IHdpZHRoXG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHRcbiAgcmV0dXJuIGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG59XG5cblxuXG5cbi8vIGRlZ3JlZXMgdG8gcmFkaWFuc1xuTWF0aC5kMnIgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhICogKE1hdGguUEkvMTgwKVxufVxuXG4vLyByYWRpYW5zIHRvIGRlZ3Jlc3Ncbk1hdGgucjJkID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYSAvIChNYXRoLlBJLzE4MClcbn1cblxuXG52YXIgdGhldGEgPSBNYXRoLmQycig0NSlcbnZhciBjc1RoZXRhID0gTWF0aC5jb3ModGhldGEpXG52YXIgc25UaGV0YSA9IE1hdGguc2luKHRoZXRhKVxudmFyIHRoZXRhSW52ID0gTWF0aC5kMnIoMzE1KVxudmFyIGNzVGhldGFJbnYgPSBNYXRoLmNvcyh0aGV0YUludilcbnZhciBzblRoZXRhSW52ID0gTWF0aC5zaW4odGhldGFJbnYpXG5cbi8vIHRyYW5zbGF0ZSBzY3JlZW4gdG8gd29ybGRcbnByb3RvLnMydyA9IGZ1bmN0aW9uKHBvcykge1xuICAvLyByb3RhdGVcbiAgdmFyIHggPSBwb3MueFxuICB2YXIgeSA9IHBvcy55XG4gIHBvcy54ID0geCAqIGNzVGhldGEgLSB5ICogc25UaGV0YVxuICBwb3MueSA9IHggKiBzblRoZXRhICsgeSAqIGNzVGhldGFcbiAgLy8gc2NhbGVcbiAgcG9zLnkgKj0gMC41XG4gIC8vIHRyYW5zbGF0ZVxuICBwb3MueCArPSB0aGlzLndpZHRoLzJcbiAgcG9zLnkgKz0gdGhpcy50b3BNYXJnaW5cbiAgcmV0dXJuIHBvc1xufVxuXG4vLyB0cmFuc2xhdGUgd29ybGQgdG8gc2NyZWVuXG5wcm90by53MnMgPSBmdW5jdGlvbihwb3MpIHtcbiAgLy8gdHJhbnNsYXRlXG4gIHBvcy54IC09IHRoaXMud2lkdGgvMlxuICBwb3MueSAtPSB0aGlzLnRvcE1hcmdpblxuICAvLyBzY2FsZVxuICBwb3MueSAvPSAwLjUxXG4gIC8vIHJvdGF0ZVxuICB2YXIgeSA9IHBvcy55XG4gIHZhciB4ID0gcG9zLnhcbiAgcG9zLnggPSB4ICogY3NUaGV0YUludiAtIHkgKiBzblRoZXRhSW52XG4gIHBvcy55ID0geCAqIHNuVGhldGFJbnYgKyB5ICogY3NUaGV0YUludlxuICByZXR1cm4gcG9zXG59XG5cblxuLy8gdHJhbnNmb3JtIHRoZSBjb250ZXh0IGludG8gaXNvbWV0cmljXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLmlzbyA9IGZ1bmN0aW9uKGZuKSB7XG4gIHRoaXMuc2F2ZSgpXG5cbiAgLy8gbW92ZSB0aGUgZ2FtZSBib2FyZCBkb3duIGEgYml0XG4gIHRoaXMudHJhbnNsYXRlKDAsIEdhbWUuZ2FtZS50b3BNYXJnaW4pXG4gIHRoaXMudHJhbnNsYXRlKEdhbWUuZ2FtZS53aWR0aC8yLCAwKVxuICB0aGlzLnNjYWxlKDEsIDAuNSlcbiAgdGhpcy5yb3RhdGUoNDUgKiBNYXRoLlBJIC8gMTgwKVxuICAvLyB0aGlzLnRyYW5zZm9ybSgwLjcwNywgMC40MDksIC0wLjcwNywgMC40MDksIDAsIDApXG4gIGZuKClcbiAgdGhpcy5yZXN0b3JlKClcbn1cbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIFRpbGVTZXQgPSByZXF1aXJlKCcuL3RpbGVzZXQnKVxuXG52YXIgR3JpZCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZ3JpZCwgdCkge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG5cbiAgdGhpcy5ncmlkID0gZ3JpZFxuICB0aGlzLnRpbGVzID0gbmV3IFRpbGVTZXQodC5zcmMsIHQudywgdC5oLCB0Lm94LCB0Lm95KVxuXG4gIHZhciBwMSA9IHRoaXMuZ2FtZS5zMncoe3g6MCwgeTowfSlcbiAgdmFyIHAyID0gdGhpcy5nYW1lLnMydyh7eDowLCB5OnRoaXMuZ2FtZS5zY2FsZX0pXG4gIHRoaXMuaXNvVGlsZVdpZHRoID0gTWF0aC5hYnMocDIueCAtIHAxLngpKjJcblxuICB0aGlzLmVjaG8oJ2xvYWQnLCB0aGlzLnRpbGVzKVxufVxuXG5wdWJzdWIuZXh0ZW5kKEdyaWQucHJvdG90eXBlKVxuXG52YXIgcHJvdG8gPSBHcmlkLnByb3RvdHlwZVxuXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICB2YXIgZ3JpZCA9IHRoaXMuZ3JpZFxuICB2YXIgdGlsZXMgPSB0aGlzLnRpbGVzXG5cbiAgZm9yICh2YXIgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSs9MSkge1xuICAgIGZvciAodmFyIHggPSAwOyB4IDwgZ3JpZFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgICAgIHZhciBwb3MgPSB0aGlzLmdhbWUuczJ3KHt4Ongqc2NhbGUsIHk6eSpzY2FsZX0pXG4gICAgICB0aWxlcy5kcmF3KGN0eCwgZ3JpZFt5XVt4XSwgcG9zLngsIHBvcy55LCB0aGlzLmlzb1RpbGVXaWR0aClcblxuICAgICAgLy8gY3R4LmZpbGxTdHlsZSA9ICcjZmYwMDAwJ1xuICAgICAgLy8gY3R4LnN0cm9rZVN0eWxlID0gJyNmZmZmZmYnXG4gICAgICAvLyBjdHgucmVjdChwb3MueC0xLjUsIHBvcy55LTEuNSwgMywgMylcbiAgICAgIC8vIGN0eC5maWxsKClcbiAgICAgIC8vIGN0eC5zdHJva2UoKVxuICAgIH1cbiAgfVxuXG4gIC8vIGN0eC5pc28oZnVuY3Rpb24oKSB7XG5cbiAgLy8gICAvLyBkcmF3IHRoZSBncmlkIHRpbGVzXG4gIC8vICAgZm9yICh2YXIgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSs9MSkge1xuICAvLyAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBncmlkW3ldLmxlbmd0aDsgeCs9MSkge1xuICAvLyAgICAgICAvLyBmaWxsIHRoZSB0aWxlXG4gIC8vICAgICAgIGlmIChncmlkW3ldW3hdKSB7XG4gIC8vICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLDAuMTUpJ1xuICAvLyAgICAgICAgIGN0eC5maWxsUmVjdCh4KnNjYWxlICsgc2NhbGUqMC4xLCB5KnNjYWxlICsgc2NhbGUqMC4xLCBzY2FsZSowLjgsIHNjYWxlKjAuOClcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgIH1cblxuICAvLyAgIC8vIGRyYXcgdGhlIGdyaWQgbGluZXNcbiAgLy8gICBjdHguc3Ryb2tlU3R5bGUgPSAnIzg4ODg4OCdcbiAgLy8gICBmb3IgKHZhciB5ID0gMDsgeSA8IGdyaWQubGVuZ3RoOyB5Kz0xKSB7XG4gIC8vICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGdyaWRbeV0ubGVuZ3RoOyB4Kz0xKSB7XG4gIC8vICAgICAgIGlmIChncmlkW3ldW3hdKSB7XG4gIC8vICAgICAgICAgY3R4LmJlZ2luUGF0aCgpXG4gIC8vICAgICAgICAgY3R4LnJlY3QoeCpzY2FsZSswLjUsIHkqc2NhbGUrMC41LCBzY2FsZSwgc2NhbGUpXG4gIC8vICAgICAgICAgY3R4LnN0cm9rZSgpXG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICB9XG5cbiAgLy8gfSlcbn1cbiIsInZhciBJbnB1dCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaWQpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLnRvdWNoU3RhcnQuYmluZCh0aGlzKSwgZmFsc2UpXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMudG91Y2hNb3ZlLmJpbmQodGhpcyksIGZhbHNlKVxuICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMudG91Y2hFbmQuYmluZCh0aGlzKSwgZmFsc2UpXG59XG5cblxuSW5wdXQucHJvdG90eXBlLnRvdWNoU3RhcnQgPSBmdW5jdGlvbihldikge1xuICB0aGlzLnN0YXJ0ID0gZXYudG91Y2hlc1swXVxuICB0aGlzLnRvdWNoTW92ZShldilcbn1cblxuSW5wdXQucHJvdG90eXBlLnRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2KSB7XG4gIHRoaXMucHJldmlvdXMgPSB0aGlzLmN1cnJlbnRcbiAgdGhpcy5jdXJyZW50ID0gZXYudG91Y2hlc1swXVxuICB0aGlzLmN1cnJlbnQueCA9IHRoaXMuY3VycmVudC5jbGllbnRYXG4gIHRoaXMuY3VycmVudC55ID0gdGhpcy5jdXJyZW50LmNsaWVudFlcbn1cblxuSW5wdXQucHJvdG90eXBlLnRvdWNoRW5kID0gZnVuY3Rpb24oZXYpIHtcbiAgdGhpcy5wcmV2aW91cyA9IHtcbiAgICBzdGFydDogdGhpcy5zdGFydCxcbiAgICBlbmQ6IHRoaXMuY3VycmVudFxuICB9XG4gIHRoaXMuY3VycmVudCA9IG51bGxcbiAgdGhpcy5zdGFydCA9IG51bGxcbn1cbiIsInZhciBJbnRlcm1pc3Npb24gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG59XG5cbnZhciBwcm90byA9IEludGVybWlzc2lvbi5wcm90b3R5cGVcblxucHJvdG8udXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cbn1cblxucHJvdG8uZHJhdyA9IGZ1bmN0aW9uKCkge1xuXG59XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBHcmlkID0gcmVxdWlyZSgnLi9ncmlkJylcbnZhciBCdXR0b25NYW5hZ2VyID0gcmVxdWlyZSgnLi9idXR0b25NYW5hZ2VyJylcbnZhciBRdWV1ZU1hbmFnZXIgPSByZXF1aXJlKCcuL3F1ZXVlTWFuYWdlcicpXG52YXIgRW50aXR5TWFuYWdlciA9IHJlcXVpcmUoJy4vZW50aXR5TWFuYWdlcicpXG52YXIgSW50ZXJtaXNzaW9uID0gcmVxdWlyZSgnLi9pbnRlcm1pc3Npb24nKVxuXG4vLyB2YXIgXyA9IDBcbnZhciBCQUxMID0gJ0JhbGwnXG52YXIgU1dJVENIID0gJ1N3aXRjaCdcbnZhciBST0JPVCA9ICdSb2JvdCdcbnZhciBFWElUID0gJ0V4aXQnXG52YXIgVVBEQVRFID0gJ3VwZGF0ZSdcbnZhciBEUkFXID0gJ2RyYXcnXG5cbnZhciBMZXZlbCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZikge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIHRoaXMuY3R4ID0gdGhpcy5nYW1lLmN0eFxuXG4gIHRoaXMuZ3JpZCA9IG5ldyBHcmlkKGNvbmYuZ3JpZCwgY29uZi50aWxlcylcbiAgdGhpcy5lbnRpdGllcyA9IG5ldyBFbnRpdHlNYW5hZ2VyKGNvbmYuZW50aXR5TWFwKVxuICBpZiAodGhpcy5lbnRpdGllcy5yb2JvdCkge1xuICAgIHRoaXMucm9ib3QgPSB0aGlzLmVudGl0aWVzLnJvYm90XG4gIH1cblxuICB0aGlzLmJ1dHRvbk1hbmFnZXIgPSBuZXcgQnV0dG9uTWFuYWdlcigpXG4gIHRoaXMucXVldWVNYW5hZ2VyID0gbmV3IFF1ZXVlTWFuYWdlcigpXG5cbiAgcHVic3ViLm9uKCdleGl0TGV2ZWwnLCB0aGlzLmVuZC5iaW5kKHRoaXMpKVxufVxuXG52YXIgcHJvdG8gPSBMZXZlbC5wcm90b3R5cGVcblxucHJvdG8udXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmludGVybWlzc2lvbilcbiAgICB0aGlzLmludGVybWlzc2lvbi51cGRhdGUoKVxuXG4gIHRoaXMuYnV0dG9uTWFuYWdlci51cGRhdGUoKVxuICB0aGlzLnF1ZXVlTWFuYWdlci51cGRhdGUoKVxuICB0aGlzLmVudGl0aWVzLmludm9rZShVUERBVEUsIFt0aGlzLmN0eF0sIFJPQk9UKVxuICB0aGlzLmVudGl0aWVzLmludm9rZShVUERBVEUsIFt0aGlzLmN0eF0sIEJBTEwpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKFVQREFURSwgW3RoaXMuY3R4XSwgU1dJVENIKVxuICB0aGlzLmVudGl0aWVzLmludm9rZShVUERBVEUsIFt0aGlzLmN0eF0sIEVYSVQpXG59XG5cbnByb3RvLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcblxuICAvLyBkcmF3IHRoZSBncmlkXG4gIHRoaXMuZ3JpZC5kcmF3KGN0eClcblxuICAvLyBkcmF3IGVhY2ggZW50aXR5XG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKERSQVcsIFt0aGlzLmN0eF0sIEVYSVQpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKERSQVcsIFt0aGlzLmN0eF0sIFNXSVRDSClcbiAgdGhpcy5lbnRpdGllcy5pbnZva2UoRFJBVywgW3RoaXMuY3R4XSwgUk9CT1QpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKERSQVcsIFt0aGlzLmN0eF0sIEJBTEwpXG5cbiAgLy8gZHJhdyBhbnkgVUkgbGFzdFxuICB0aGlzLmJ1dHRvbk1hbmFnZXIuZHJhdyh0aGlzLmN0eClcbiAgdGhpcy5xdWV1ZU1hbmFnZXIuZHJhdyh0aGlzLmN0eClcbiAgaWYgKHRoaXMuaW50ZXJtaXNzaW9uKSB7XG4gICAgdGhpcy5pbnRlcm1pc3Npb24uZHJhdyhjdHgpXG4gIH1cblxufVxuXG5wcm90by5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG5cbn1cblxucHJvdG8uZW5kID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuaW50ZXJtaXNzaW9uID0gbmV3IEludGVybWlzc2lvbigpXG59XG4iLCJ2YXIgbGV2ZWxEZWZzID0gcmVxdWlyZSgnLi9jb25maWcvbGV2ZWxzJylcbnZhciBMZXZlbCA9IHJlcXVpcmUoJy4vbGV2ZWwnKVxuXG52YXIgTGV2ZWxNYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5sZXZlbHMgPSBsZXZlbERlZnNcblxuICB0aGlzLmN1cnJlbnQgPSBudWxsXG4gIHRoaXMuY3VycmVudElkeCA9IC0xXG59XG5cbnZhciBwcm90byA9IExldmVsTWFuYWdlci5wcm90b3R5cGVcblxucHJvdG8udXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmN1cnJlbnQpXG4gICAgdGhpcy5jdXJyZW50LnVwZGF0ZSgpXG59XG5cbnByb3RvLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgaWYgKHRoaXMuY3VycmVudClcbiAgICB0aGlzLmN1cnJlbnQuZHJhdyhjdHgpXG59XG5cbnByb3RvLmxvYWQgPSBmdW5jdGlvbihpZHgpIHtcbiAgdmFyIGNvbmYgPSB0aGlzLmxldmVsc1tpZHhdXG4gIHZhciBuZXh0ID0gY29uZiA/IG5ldyBMZXZlbChjb25mKSA6IG51bGxcblxuICAvLyB1bmxvYWQgdGhlIGN1cnJlbnQgbGV2ZWxcbiAgaWYgKHRoaXMuY3VycmVudCkge1xuICAgIHRoaXMuY3VycmVudC5kaXNwb3NlKClcbiAgICB0aGlzLmN1cnJlbnQgPSBudWxsXG4gICAgdGhpcy5jdXJyZW50SWR4ID0gLTFcbiAgfVxuXG4gIC8vIHNldCB0aGUgbmV4dCBsZXZlbCBhcyBjdXJyZW50XG4gIGlmIChuZXh0KSB7XG4gICAgdGhpcy5jdXJyZW50ID0gbmV4dFxuICAgIHRoaXMuY3VycmVudElkeCA9IGlkeFxuICB9XG5cbiAgcmV0dXJuIG5leHRcbn1cblxucHJvdG8ubmV4dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5sb2FkKHRoaXMuY3VycmVudElkeCArIDEpXG59XG5cbiIsInZhciBfID0gMFxudmFyIEIgPSAnQidcbnZhciBTID0gJ1MnXG52YXIgUiA9ICdSJ1xudmFyIEUgPSAnRSdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG5hbWU6ICdGaXJzdCBMZXZlbCcsXG5cbiAgdGlsZXM6IHtcbiAgICBzcmM6ICdpbWFnZXMvaXNvdGlsZXMucG5nJyxcbiAgICB3OiA2NCxcbiAgICBoOiA2NCxcbiAgICBveDogNCxcbiAgICBveTogMTZcbiAgfSxcblxuICBncmlkOiBbXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgWzYsNiw2LDYsNl1cbiAgXSxcblxuICBlbnRpdHlNYXA6IFtcbiAgICBbXyxfLEIsXyxfXSxcbiAgICBbUixfLF8sXyxTXSxcbiAgICBbXyxfLEUsXyxfXVxuICBdXG59XG4iLCJ2YXIgXyA9IDBcbnZhciBCID0gJ0InXG52YXIgUyA9ICdTJ1xudmFyIFIgPSAnUidcbnZhciBFID0gJ0UnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBuYW1lOiAnU2Vjb25kIExldmVsJyxcblxuICB0aWxlczoge1xuICAgIHNyYzogJ2ltYWdlcy9pc290aWxlcy5wbmcnLFxuICAgIHc6IDY0LFxuICAgIGg6IDY0LFxuICAgIG94OiA0LFxuICAgIG95OiAxNlxuICB9LFxuXG4gIGdyaWQ6IFtcbiAgICBbNiw2LDYsNiw2XSxcbiAgICBbNiw2LDYsNiw2XSxcbiAgICBbNiw2LDYsNiw2XSxcbiAgICBbXyxfLF8sNiw2XSxcbiAgICBbNiw2LF8sNiw2XVxuICBdLFxuXG4gIGVudGl0eU1hcDogW1xuICAgIFtfLF8sXyxfLF9dLFxuICAgIFtfLFIsXyxCLF9dLFxuICAgIFtfLF8sXyxfLEVdLFxuICAgIFtfLF8sUyxfLF9dLFxuICAgIFtfLF8sXyxfLF9dXG4gIF1cbn1cbiIsIi8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxudmFyIGV4dGVuZCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG9iajtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvcjtcbiAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbn07XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZSgnLi9leHRlbmQnKVxuXG52YXIgRXZlbnRzID0ge31cblxuRXZlbnRzLnRyaWdnZXIgPSBmdW5jdGlvbigvKiBTdHJpbmcgKi8gdG9waWMsIC8qIEFycmF5PyAqLyBhcmdzKSB7XG4gIC8vIHN1bW1hcnk6XG4gIC8vICAgIFB1Ymxpc2ggc29tZSBkYXRhIG9uIGEgbmFtZWQgdG9waWMuXG4gIC8vIHRvcGljOiBTdHJpbmdcbiAgLy8gICAgVGhlIGNoYW5uZWwgdG8gcHVibGlzaCBvblxuICAvLyBhcmdzOiBBcnJheT9cbiAgLy8gICAgVGhlIGRhdGEgdG8gcHVibGlzaC4gRWFjaCBhcnJheSBpdGVtIGlzIGNvbnZlcnRlZCBpbnRvIGFuIG9yZGVyZWRcbiAgLy8gICAgYXJndW1lbnRzIG9uIHRoZSBzdWJzY3JpYmVkIGZ1bmN0aW9ucy5cbiAgLy9cbiAgLy8gZXhhbXBsZTpcbiAgLy8gICAgUHVibGlzaCBzdHVmZiBvbiAnL3NvbWUvdG9waWMnLiBBbnl0aGluZyBzdWJzY3JpYmVkIHdpbGwgYmUgY2FsbGVkXG4gIC8vICAgIHdpdGggYSBmdW5jdGlvbiBzaWduYXR1cmUgbGlrZTogZnVuY3Rpb24oYSxiLGMpIHsgLi4uIH1cbiAgLy9cbiAgLy8gICAgdHJpZ2dlcihcIi9zb21lL3RvcGljXCIsIFtcImFcIixcImJcIixcImNcIl0pXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm5cblxuICB2YXIgc3VicyA9IHRoaXMuX2V2ZW50c1t0b3BpY10sXG4gICAgbGVuID0gc3VicyA/IHN1YnMubGVuZ3RoIDogMFxuXG4gIC8vY2FuIGNoYW5nZSBsb29wIG9yIHJldmVyc2UgYXJyYXkgaWYgdGhlIG9yZGVyIG1hdHRlcnNcbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgc3Vic1tsZW5dLmFwcGx5KEV2ZW50cywgYXJncyB8fCBbXSlcbiAgfVxufVxuXG5FdmVudHMub24gPSBmdW5jdGlvbigvKiBTdHJpbmcgKi8gdG9waWMsIC8qIEZ1bmN0aW9uICovIGNhbGxiYWNrKSB7XG4gIC8vIHN1bW1hcnk6XG4gIC8vICAgIFJlZ2lzdGVyIGEgY2FsbGJhY2sgb24gYSBuYW1lZCB0b3BpYy5cbiAgLy8gdG9waWM6IFN0cmluZ1xuICAvLyAgICBUaGUgY2hhbm5lbCB0byBzdWJzY3JpYmUgdG9cbiAgLy8gY2FsbGJhY2s6IEZ1bmN0aW9uXG4gIC8vICAgIFRoZSBoYW5kbGVyIGV2ZW50LiBBbnl0aW1lIHNvbWV0aGluZyBpcyB0cmlnZ2VyJ2VkIG9uIGFcbiAgLy8gICAgc3Vic2NyaWJlZCBjaGFubmVsLCB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGVcbiAgLy8gICAgcHVibGlzaGVkIGFycmF5IGFzIG9yZGVyZWQgYXJndW1lbnRzLlxuICAvL1xuICAvLyByZXR1cm5zOiBBcnJheVxuICAvLyAgICBBIGhhbmRsZSB3aGljaCBjYW4gYmUgdXNlZCB0byB1bnN1YnNjcmliZSB0aGlzIHBhcnRpY3VsYXIgc3Vic2NyaXB0aW9uLlxuICAvL1xuICAvLyBleGFtcGxlOlxuICAvLyAgICBvbihcIi9zb21lL3RvcGljXCIsIGZ1bmN0aW9uKGEsIGIsIGMpIHsgLyogaGFuZGxlIGRhdGEgKi8gfSlcblxuICB0aGlzLl9ldmVudHMgfHwgKHRoaXMuX2V2ZW50cyA9IHt9KVxuXG4gIGlmICghdGhpcy5fZXZlbnRzW3RvcGljXSkge1xuICAgIHRoaXMuX2V2ZW50c1t0b3BpY10gPSBbXVxuICB9XG4gIHRoaXMuX2V2ZW50c1t0b3BpY10ucHVzaChjYWxsYmFjaylcbiAgcmV0dXJuIFt0b3BpYywgY2FsbGJhY2tdIC8vIEFycmF5XG59XG5cbkV2ZW50cy5vZmYgPSBmdW5jdGlvbigvKiBBcnJheSBvciBTdHJpbmcgKi8gaGFuZGxlKSB7XG4gIC8vIHN1bW1hcnk6XG4gIC8vICAgIERpc2Nvbm5lY3QgYSBzdWJzY3JpYmVkIGZ1bmN0aW9uIGZvciBhIHRvcGljLlxuICAvLyBoYW5kbGU6IEFycmF5IG9yIFN0cmluZ1xuICAvLyAgICBUaGUgcmV0dXJuIHZhbHVlIGZyb20gYW4gYG9uYCBjYWxsLlxuICAvLyBleGFtcGxlOlxuICAvLyAgICB2YXIgaGFuZGxlID0gb24oXCIvc29tZS90b3BpY1wiLCBmdW5jdGlvbigpIHt9KVxuICAvLyAgICBvZmYoaGFuZGxlKVxuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuXG5cbiAgdmFyIHN1YnMgPSB0aGlzLl9ldmVudHNbdHlwZW9mIGhhbmRsZSA9PT0gJ3N0cmluZycgPyBoYW5kbGUgOiBoYW5kbGVbMF1dXG4gIHZhciBjYWxsYmFjayA9IHR5cGVvZiBoYW5kbGUgPT09ICdzdHJpbmcnID8gaGFuZGxlWzFdIDogZmFsc2VcbiAgdmFyIGxlbiA9IHN1YnMgPyBzdWJzLmxlbmd0aCA6IDBcblxuICB3aGlsZSAobGVuLS0pIHtcbiAgICBpZiAoc3Vic1tsZW5dID09PSBjYWxsYmFjayB8fCAhY2FsbGJhY2spIHtcbiAgICAgIHN1YnMuc3BsaWNlKGxlbiwgMSlcbiAgICB9XG4gIH1cbn1cblxuRXZlbnRzLmVjaG8gPSBmdW5jdGlvbigvKiBTdHJpbmcgKi8gdG9waWMsIC8qIE9iamVjdCAqLyBlbWl0dGVyKSB7XG4gIGVtaXR0ZXIub24odG9waWMsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudHJpZ2dlcih0b3BpYywgYXJndW1lbnRzKVxuICB9LmJpbmQodGhpcykpXG59XG5cblxudmFyIHB1YnN1YiA9IG1vZHVsZS5leHBvcnRzID0ge31cblxucHVic3ViLkV2ZW50cyA9IEV2ZW50c1xucHVic3ViLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICBleHRlbmQob2JqLCBFdmVudHMpXG59XG5wdWJzdWIuZXh0ZW5kKHB1YnN1YilcbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnLi9saWIvaW5oZXJpdHMnKVxudmFyIEJ1dHRvbiA9IHJlcXVpcmUoJy4vYnV0dG9uJylcblxudmFyIFF1ZXVlQnV0dG9uID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBRdWV1ZUJ1dHRvbihidXR0b24sIHBvcykge1xuICB2YXIgYnRuID0ge1xuICAgIHBvczogcG9zLFxuICAgIHdpZHRoOiA0MCxcbiAgICBoZWlnaHQ6IDQwLFxuICAgIHNwcml0ZTogYnV0dG9uLnNwcml0ZSxcbiAgICBmcmFtZU9mZjogYnV0dG9uLmZyYW1lT2ZmLFxuICAgIGZyYW1lT246IGJ1dHRvbi5mcmFtZU9uLFxuICAgIGNvbW1hbmQ6IGJ1dHRvbi5jb21tYW5kXG4gIH1cbiAgQnV0dG9uLmNhbGwodGhpcywgYnRuKVxufVxuXG5pbmhlcml0cyhRdWV1ZUJ1dHRvbiwgQnV0dG9uKVxuXG52YXIgcHJvdG8gPSBRdWV1ZUJ1dHRvbi5wcm90b3R5cGVcblxucHJvdG8udGFwcGVkID0gZnVuY3Rpb24oKSB7XG4gIHB1YnN1Yi50cmlnZ2VyKCdxdWV1ZUJ1dHRvblByZXNzZWQnLCBbdGhpc10pXG59XG5cbnByb3RvLmRyYXcgPSBmdW5jdGlvbihjdHgsIGN1cnJlbnQpIHtcbiAgLy8gZHJhdyBhIGJvcmRlciBhcm91bmQgdGhlIGJ1dHRvbiBiZWluZyBleGVjdXRlZFxuICB0aGlzLnN0YXRlID0gQnV0dG9uLlNUQVRFLk5PUk1BTFxuICBpZiAoY3VycmVudCkge1xuICAgIC8vIGN0eC5zYXZlKClcbiAgICAvLyBjdHgudHJhbnNsYXRlKHRoaXMucG9zLngsIHRoaXMucG9zLnkpXG4gICAgLy8gY3R4LnN0cm9rZVJlY3QoLTIsIC0yLCB0aGlzLndpZHRoKzQsIHRoaXMuaGVpZ2h0KzQpXG4gICAgLy8gY3R4LnJlc3RvcmUoKVxuICAgIHRoaXMuc3RhdGUgPSBCdXR0b24uU1RBVEUuRE9XTlxuICB9XG5cbiAgQnV0dG9uLnByb3RvdHlwZS5kcmF3LmNhbGwodGhpcywgY3R4KVxufVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG52YXIgUXVldWVCdXR0b24gPSByZXF1aXJlKCcuL3F1ZXVlQnV0dG9uJylcbnZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpXG5cbnZhciBTVEFSVCA9ICdzdGFydCdcbnZhciBST0JPVF9TVEFSVCA9ICdyb2JvdFN0YXJ0J1xuXG52YXIgUXVldWVNYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLmJ1dHRvbnMgPSBbXVxuICB0aGlzLmN1ckluZGV4ID0gLTFcbiAgcHVic3ViLm9uKCdjb21tYW5kQnV0dG9uUHJlc3NlZCcsIHRoaXMuZW5xdWV1ZS5iaW5kKHRoaXMpKVxuICBwdWJzdWIub24oJ3F1ZXVlQnV0dG9uUHJlc3NlZCcsIHRoaXMucmVtb3ZlLmJpbmQodGhpcykpXG59XG5cbnZhciBwcm90byA9IFF1ZXVlTWFuYWdlci5wcm90b3R5cGVcblxucHJvdG8uZW5xdWV1ZSA9IGZ1bmN0aW9uKGJ0bikge1xuICBpZiAoYnRuLmNvbW1hbmQgPT09IFNUQVJUKSByZXR1cm4gcHVic3ViLnRyaWdnZXIoUk9CT1RfU1RBUlQpXG4gIHZhciB4ID0gdGhpcy5idXR0b25zLmxlbmd0aCAqIDQyICsgMTBcbiAgdmFyIHkgPSB0aGlzLmdhbWUuaGVpZ2h0IC0gNTBcbiAgdmFyIGJ1dHRvbiA9IG5ldyBRdWV1ZUJ1dHRvbihidG4sIHt4OngseTp5fSlcbiAgdGhpcy5idXR0b25zLnB1c2goYnV0dG9uKVxufVxuXG5wcm90by5yZW1vdmUgPSBmdW5jdGlvbihidG4pIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5idXR0b25zLmluZGV4T2YoYnRuKVxuICB0aGlzLmJ1dHRvbnMuc3BsaWNlKGluZGV4LCAxKVxuICB0aGlzLnJlY2FsY3VsYXRlUG9zWChpbmRleClcbiAgcmV0dXJuIGJ0blxufVxuXG5wcm90by5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY3VySW5kZXggKz0gMVxuICB2YXIgYnRuID0gdGhpcy5idXR0b25zW3RoaXMuY3VySW5kZXhdXG4gIHJldHVybiBidG4gJiYgYnRuLmNvbW1hbmQgfHwgbnVsbFxufVxuXG5wcm90by5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmN1ckluZGV4ID0gLTFcbn1cblxucHJvdG8uY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5idXR0b25zID0gW11cbn1cblxucHJvdG8uY291bnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuYnV0dG9ucy5sZW5ndGggLSAodGhpcy5jdXJJbmRleCArIDEpXG59XG5cbnByb3RvLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrPTEpIHtcbiAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlKClcbiAgfVxufVxuXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS5kcmF3KGN0eCwgdGhpcy5jdXJJbmRleCA9PSBpKVxuICB9XG59XG5cbnByb3RvLnJlY2FsY3VsYXRlUG9zWCA9IGZ1bmN0aW9uKGlkeCkge1xuICBmb3IgKHZhciBpID0gaWR4IHx8IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKz0xKSB7XG4gICAgdGhpcy5idXR0b25zW2ldLnBvcy54ID0gaSAqIDQyICsgMTBcbiAgfVxufVxuIiwidmFyIHZlY3RvcjIgPSByZXF1aXJlKCcuL3ZlY3RvcjInKVxudmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG52YXIgVGltZXIgPSByZXF1aXJlKCcuL3RpbWVyJylcblxudmFyIEJhbGwgPSByZXF1aXJlKCcuL2JhbGwnKVxuXG52YXIgUm9ib3QgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFJvYm90KHBvcykge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIHRoaXMuc3RhcnRQb3NpdGlvbiA9IHtcbiAgICBwb3M6IHsgeDpwb3MueCwgeTpwb3MueSB9LFxuICAgIGRpcjogeyB4OjEsIHk6MCB9XG4gIH1cbiAgdGhpcy5wb3MgPSBwb3NcbiAgdGhpcy5kaXIgPSB7IHg6MSwgeTowIH1cbiAgdGhpcy5mcmVxID0gMC40XG4gIHRoaXMuYmxvY2tlZCA9IGZhbHNlXG4gIHRoaXMuc3RvcHBlZCA9IHRydWVcblxuICB0aGlzLnRpbWVyID0gbmV3IFRpbWVyKE51bWJlci5NQVhfVkFMVUUpXG4gIHRoaXMudGltZXIucGF1c2UoKVxuXG4gIHB1YnN1Yi5vbigncm9ib3RTdGFydCcsIHRoaXMuc3RhcnQuYmluZCh0aGlzKSlcbn1cblxudmFyIHByb3RvID0gUm9ib3QucHJvdG90eXBlXG5cbnByb3RvLm1vdmUgPSBmdW5jdGlvbihuZXdQb3MpIHtcbiAgdmFyIGdyaWQgPSB0aGlzLmdhbWUubGV2ZWxNYW5hZ2VyLmN1cnJlbnQuZ3JpZC5ncmlkXG4gIGlmICghZ3JpZFtuZXdQb3MueV0gfHwgIWdyaWRbbmV3UG9zLnldW25ld1Bvcy54XSkge1xuICAgIHRoaXMuYmxvY2soKVxuICB9IGVsc2Uge1xuICAgIHRoaXMucG9zID0gbmV3UG9zXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxucHJvdG8ubW92ZUZvcndhcmQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5ld1BvcyA9IHZlY3RvcjIuYWRkKHRoaXMucG9zLCB0aGlzLmRpcilcbiAgcmV0dXJuIHRoaXMubW92ZShuZXdQb3MpXG59XG5cbnByb3RvLm1vdmVCYWNrd2FyZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmV3UG9zID0gdmVjdG9yMi5zdWJ0cmFjdCh0aGlzLnBvcywgdGhpcy5kaXIpXG4gIHJldHVybiB0aGlzLm1vdmUobmV3UG9zKVxufVxuXG5wcm90by50dXJuTGVmdCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IHRoaXMuZGlyLnhcbiAgdmFyIHkgPSB0aGlzLmRpci55XG4gIHRoaXMuZGlyLnggPSB5XG4gIHRoaXMuZGlyLnkgPSAteFxuICByZXR1cm4gdGhpc1xufVxuXG5wcm90by50dXJuUmlnaHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHggPSB0aGlzLmRpci54XG4gIHZhciB5ID0gdGhpcy5kaXIueVxuICB0aGlzLmRpci54ID0gLXlcbiAgdGhpcy5kaXIueSA9IHhcbiAgcmV0dXJuIHRoaXNcbn1cblxucHJvdG8udHVybkFyb3VuZCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmRpci54ICo9IC0xXG4gIHRoaXMuZGlyLnkgKj0gLTFcbiAgcmV0dXJuIHRoaXNcbn1cblxucHJvdG8ucGlja3VwID0gZnVuY3Rpb24oKSB7XG4gIHZhciBsZXZlbCA9IHRoaXMuZ2FtZS5sZXZlbE1hbmFnZXIuY3VycmVudFxuICB2YXIgdGFyZ2V0ID0gbGV2ZWwuZW50aXRpZXMuYXRQb3ModmVjdG9yMi5hZGQodGhpcy5wb3MsIHRoaXMuZGlyKSwgQmFsbC5uYW1lKVxuICBpZiAodGFyZ2V0ICYmIHRhcmdldC5waWNrZWRVcCgpKSB7XG4gICAgdGhpcy5iYWxsID0gdGFyZ2V0XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ibG9jaygpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxucHJvdG8ucmVsZWFzZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5iYWxsICYmIHRoaXMuYmFsbC5kcm9wcGVkKCkpIHtcbiAgICB0aGlzLmJhbGwgPSBudWxsXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ibG9jaygpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxucHJvdG8ubW92ZUJhbGwgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYmFsbCkge1xuICAgIHRoaXMuYmFsbC5wb3MgPSB2ZWN0b3IyLmFkZCh0aGlzLnBvcywgdGhpcy5kaXIpXG4gIH1cbn1cblxucHJvdG8uYmxvY2sgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5ibG9ja2VkID0gdHJ1ZVxufVxuXG5wcm90by51bmJsb2NrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuYmxvY2tlZCA9IGZhbHNlXG4gIHZhciBzdGFydCA9IHRoaXMuc3RhcnRQb3NpdGlvblxuICB0aGlzLnBvcyA9IHsgeDpzdGFydC5wb3MueCwgeTpzdGFydC5wb3MueSB9XG4gIHRoaXMuZGlyID0geyB4OnN0YXJ0LmRpci54LCB5OnN0YXJ0LmRpci55IH1cbn1cblxucHJvdG8uc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy51bmJsb2NrKClcbiAgdGhpcy50aW1lci5zZXQodGhpcy5mcmVxKVxuICB0aGlzLnRpbWVyLnVucGF1c2UoKVxufVxuXG5wcm90by5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudGltZXIucGF1c2UoKVxufVxuXG5wcm90by51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLnRpbWVyLnBhdXNlZCgpICYmIHRoaXMudGltZXIuZGVsdGEoKSA+IDApIHtcbiAgICB2YXIgcXVldWUgPSB0aGlzLmdhbWUubGV2ZWxNYW5hZ2VyLmN1cnJlbnQucXVldWVNYW5hZ2VyXG4gICAgdmFyIGFjdGlvbiA9IHF1ZXVlLm5leHQoKVxuXG4gICAgaWYgKCFhY3Rpb24gfHwgdGhpcy5ibG9ja2VkKSB7XG4gICAgICBxdWV1ZS5yZXNldCgpXG4gICAgICByZXR1cm4gdGhpcy5zdG9wKClcbiAgICB9XG5cbiAgICB0aGlzW2FjdGlvbl0oKVxuICAgIHRoaXMubW92ZUJhbGwoKVxuICAgIHRoaXMudGltZXIuc2V0KHRoaXMuZnJlcSlcbiAgfVxufVxuXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuXG4gIGN0eC5pc28oZnVuY3Rpb24oKSB7XG5cbiAgICBjdHguc2F2ZSgpXG4gICAgY3R4LnRyYW5zbGF0ZShcbiAgICAgIHRoaXMucG9zLnggKiBzY2FsZSArIHNjYWxlIC8gMixcbiAgICAgIHRoaXMucG9zLnkgKiBzY2FsZSArIHNjYWxlIC8gMlxuICAgIClcbiAgICBjdHgucm90YXRlKE1hdGguYXRhbjIodGhpcy5kaXIueSwgdGhpcy5kaXIueCkpXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuYmxvY2tlZCA/ICcjZmYwMDAwJyA6ICcjNDQ4ODQ0J1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LnJlY3QoXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIDAuNixcbiAgICAgIHNjYWxlICogMC42XG4gICAgKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcblxuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5tb3ZlVG8oMCwgMClcbiAgICBjdHgubGluZVRvKHNjYWxlICogKHRoaXMuYmFsbD8xOjAuMyksIDApXG4gICAgY3R4LnN0cm9rZSgpXG4gICAgY3R4LnJlc3RvcmUoKVxuXG4gIH0uYmluZCh0aGlzKSlcbiAgcmV0dXJuIHRoaXNcbn1cbiIsIndpbmRvdy5zdGF0cyA9IG5ldyBTdGF0cygpO1xuc3RhdHMuc2V0TW9kZSgxKTsgLy8gMDogZnBzLCAxOiBtc1xuc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG5zdGF0cy5kb21FbGVtZW50LnN0eWxlLnJpZ2h0ID0gJzBweCc7XG5zdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggc3RhdHMuZG9tRWxlbWVudCApO1xuXG52YXIgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpXG5cbnZhciBnYW1lID0gd2luZG93LmdhbWUgPSBuZXcgR2FtZSh7XG4gIHNjYWxlOiA2NCxcbiAgd2lkdGg6IDEwMjQsXG4gIGhlaWdodDogNzY4LFxuICBncmlkU2l6ZTogMTAsXG4gIHRvcE1hcmdpbjogMTUwLFxuICBjYW52YXM6ICdnYW1lJ1xufSlcblxuZ2FtZS5sb2FkTGV2ZWwoMClcblxuZ2FtZS5zdGFydCgpXG5cbi8vIGdhbWUubGV2ZWwudGlsZXMub25sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyAgIGdhbWUuZHJhdygpXG4vLyB9XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBUZXh0dXJlID0gcmVxdWlyZSgnLi90ZXh0dXJlJylcblxudmFyIFNwcml0ZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aFxuICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0XG4gIHRoaXMuZnJhbWVzID0gW11cbiAgdGhpcy50ZXh0dXJlID0gbmV3IFRleHR1cmUob3B0aW9ucy50ZXh0dXJlKVxuICB0aGlzLnRleHR1cmUub24oJ2xvYWQnLCB0aGlzLmNhbGN1bGF0ZUZyYW1lcy5iaW5kKHRoaXMpKVxufVxuXG52YXIgYXBpID0gU3ByaXRlLnByb3RvdHlwZVxucHVic3ViLmV4dGVuZChhcGkpXG5cbmFwaS5jYWxjdWxhdGVGcmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJ0xPQURFRCBTUFJJVEUnLCB0aGlzLnRleHR1cmUuaW1nLnNyYylcbiAgdmFyIHggPSAodGhpcy50ZXh0dXJlLndpZHRoIC8gdGhpcy53aWR0aCkgfCAwXG4gIHZhciB5ID0gKHRoaXMudGV4dHVyZS5oZWlnaHQgLyB0aGlzLmhlaWdodCkgfCAwXG5cbiAgZm9yICh2YXIgaXkgPSAwOyBpeSA8IHk7IGl5KyspIHtcbiAgICBmb3IgKHZhciBpeCA9IDA7IGl4IDwgeDsgaXgrKykge1xuICAgICAgdGhpcy5mcmFtZXMucHVzaCh7XG4gICAgICAgIHg6IGl4ICogdGhpcy53aWR0aCxcbiAgICAgICAgeTogaXkgKiB0aGlzLmhlaWdodCxcbiAgICAgICAgeDI6IGl4ICogdGhpcy53aWR0aCArIHRoaXMud2lkdGgsXG4gICAgICAgIHkyOiBpeSAqIHRoaXMuaGVpZ2h0ICsgdGhpcy5oZWlnaHQsXG4gICAgICAgIHc6IHRoaXMud2lkdGgsXG4gICAgICAgIGg6IHRoaXMuaGVpZ2h0XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICB0aGlzLnRyaWdnZXIoJ2xvYWQnKVxufVxuXG5hcGkuZHJhdyA9IGZ1bmN0aW9uKGN0eCwgZnJhbWUsIHJlY3QpIHtcbiAgdmFyIGYgPSB0aGlzLmZyYW1lc1tmcmFtZV1cbiAgaWYgKCFmKSByZXR1cm5cbiAgY3R4LmRyYXdJbWFnZSh0aGlzLnRleHR1cmUuaW1nLFxuICAgIGYueCwgZi55LCBmLncsIGYuaCxcbiAgICByZWN0LngsIHJlY3QueSwgcmVjdC53LCByZWN0LmgpXG59XG5cblxuXG4iLCJcbnZhciBTd2l0Y2ggPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFN3aXRjaChwb3MpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLnBvcyA9IHBvc1xuICB0aGlzLnN0YXRlID0gU3dpdGNoLlNUQVRFLk9GRlxufVxuXG5Td2l0Y2gucHJvdG90eXBlLnR1cm5PbiA9IGZ1bmN0aW9uKGVudCkge1xuICBpZiAodGhpcy5zdGF0ZSA9PT0gU3dpdGNoLlNUQVRFLk9GRikge1xuICAgIHRoaXMuc3RhdGUgPSBTd2l0Y2guU1RBVEUuT05cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5Td2l0Y2gucHJvdG90eXBlLnR1cm5PZmYgPSBmdW5jdGlvbihlbnQpIHtcbiAgaWYgKHRoaXMuc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PTikge1xuICAgIHRoaXMuc3RhdGUgPSBTd2l0Y2guU1RBVEUuT0ZGXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuU3dpdGNoLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbn1cblxuU3dpdGNoLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBkMnIgPSBNYXRoLmQyclxuICB2YXIgc2NhbGUgPSB0aGlzLmdhbWUuc2NhbGVcbiAgY3R4LmlzbyhmdW5jdGlvbigpIHtcbiAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgdGhpcy5wb3MueCAqIHNjYWxlICsgc2NhbGUgLyAyLFxuICAgICAgdGhpcy5wb3MueSAqIHNjYWxlICsgc2NhbGUgLyAyXG4gICAgKVxuXG4gICAgdmFyIHJhZGl1cyA9IHNjYWxlKjAuM1xuXG4gICAgLy8gZmlsbCB0aGUgc3F1YXJlXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PTiA/ICcjMDBGRjAwJyA6ICcjRkYwMDAwJ1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5yZWN0KC1zY2FsZS8yLCAtc2NhbGUvMiwgc2NhbGUsIHNjYWxlKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcblxuICAgIC8vIGRyYXcgdGhlIHJlY2lldmVyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5hcmMoMCwgMCwgcmFkaXVzLCBkMnIoMCksIGQycigzNjApKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5Td2l0Y2guU1RBVEUgPSB7XG4gIE9OIDogMSxcbiAgT0ZGIDogMFxufVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG5cbnZhciBjYWNoZSA9IHt9XG5cbnZhciBUZXh0dXJlID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzcmMpIHtcbiAgaWYgKGNhY2hlW3NyY10pIHJldHVybiBjYWNoZVtzcmNdXG5cbiAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlXG4gIHRoaXMubG9hZChzcmMpXG4gIGNhY2hlW3NyY10gPSB0aGlzXG59XG5cbnZhciBhcGkgPSBUZXh0dXJlLnByb3RvdHlwZVxucHVic3ViLmV4dGVuZChhcGkpXG5cbmFwaS5sb2FkID0gZnVuY3Rpb24oc3JjKSB7XG4gIHZhciBpbWcgPSB0aGlzLmltZyA9IG5ldyBJbWFnZSgpXG4gIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZVxuICAgIHRoaXMud2lkdGggPSBpbWcud2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGltZy5oZWlnaHRcbiAgICB0aGlzLnRyaWdnZXIoJ2xvYWQnKVxuICB9LmJpbmQodGhpcylcbiAgaW1nLnNyYyA9IHNyY1xufVxuXG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBUZXh0dXJlID0gcmVxdWlyZSgnLi90ZXh0dXJlJylcblxudmFyIFRpbGVTZXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNyYywgdywgaCwgb3gsIG95KSB7XG4gIHRoaXMud2lkdGggPSB3XG4gIHRoaXMuaGVpZ2h0ID0gaFxuICB0aGlzLm9mZnNldFggPSBveFxuICB0aGlzLm9mZnNldFkgPSBveVxuICB0aGlzLnNyYyA9IHNyY1xuXG4gIHRoaXMudGV4dHVyZSA9IG5ldyBUZXh0dXJlKHNyYylcbiAgdGhpcy5lY2hvKCdsb2FkJywgdGhpcy50ZXh0dXJlKVxufVxuXG5wdWJzdWIuZXh0ZW5kKFRpbGVTZXQucHJvdG90eXBlKVxuXG52YXIgcHJvdG8gPSBUaWxlU2V0LnByb3RvdHlwZVxuXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oY3R4LCB0LCB4LCB5LCB3KSB7XG4gIHZhciBzeCA9IHQgKiB0aGlzLndpZHRoXG4gIHZhciBzeSA9IDBcbiAgdmFyIHN3ID0gdGhpcy53aWR0aFxuICB2YXIgc2ggPSB0aGlzLmhlaWdodFxuXG4gIC8vIHRoZSBzY2FsZXIgaXMgdGhlIHdpZHRoIG9mIHRoZSBkZXN0aW5hdGlvbiB0aWxlIGRpdmlkZWRcbiAgLy8gYnkgdGhlIFwidHJ1ZVwiIHdpZHRoIG9mIHRoZSB0aWxlIGluIHRoZSBpbWFnZVxuICB2YXIgc2NhbGVyID0gdyAvICh0aGlzLndpZHRoIC0gdGhpcy5vZmZzZXRYKjIpXG5cbiAgdmFyIGR3ID0gdGhpcy53aWR0aCAqIHNjYWxlclxuICB2YXIgZGggPSB0aGlzLmhlaWdodCAqIHNjYWxlclxuICB2YXIgZHggPSB4IC0gZHcqMC41XG4gIHZhciBkeSA9IHkgLSB0aGlzLm9mZnNldFkgKiBzY2FsZXJcblxuICBjdHguZHJhd0ltYWdlKHRoaXMudGV4dHVyZS5pbWcsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaClcbn1cblxuIiwidmFyIFRpbWVyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWMpIHtcbiAgdGhpcy5iYXNlID0gVGltZXIudGltZVxuICB0aGlzLmxhc3QgPSBUaW1lci50aW1lXG5cbiAgdGhpcy50YXJnZXQgPSBzZWMgfHwgMFxufVxuXG52YXIgcHJvdG8gPSBUaW1lci5wcm90b3R5cGVcblxucHJvdG8udGFyZ2V0ID0gMFxucHJvdG8uYmFzZSA9IDBcbnByb3RvLmxhc3QgPSAwXG5wcm90by5wYXVzZWRBdCA9IDBcblxucHJvdG8uc2V0ID0gZnVuY3Rpb24oc2VjKSB7XG4gIHRoaXMudGFyZ2V0ID0gc2VjIHx8IDBcbiAgdGhpcy5iYXNlID0gVGltZXIudGltZVxuICB0aGlzLnBhdXNlZEF0ID0gMFxufVxuXG5wcm90by5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmJhc2UgPSBUaW1lci50aW1lXG4gIHRoaXMucGF1c2VkQXQgPSAwXG59XG5cbnByb3RvLnRpY2sgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlbHRhID0gVGltZXIudGltZSAtIHRoaXMubGFzdFxuICB0aGlzLmxhc3QgPSBUaW1lci50aW1lXG4gIHJldHVybiB0aGlzLnBhdXNlZEF0ID8gMCA6IGRlbHRhXG59XG5cbnByb3RvLmRlbHRhID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAodGhpcy5wYXVzZWRBdCB8fCBUaW1lci50aW1lKSAtIHRoaXMuYmFzZSAtIHRoaXMudGFyZ2V0XG59XG5cbnByb3RvLnBhdXNlID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5wYXVzZWRBdClcbiAgICB0aGlzLnBhdXNlZEF0ID0gVGltZXIudGltZVxufVxuXG5wcm90by51bnBhdXNlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnBhdXNlZEF0KSB7XG4gICAgdGhpcy5iYXNlICs9IFRpbWVyLnRpbWUgLSB0aGlzLnBhdXNlZEF0XG4gICAgdGhpcy5wYXVzZWRBdCA9IDBcbiAgfVxufVxuXG5wcm90by5wYXVzZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICEhdGhpcy5wYXVzZWRBdFxufVxuXG5UaW1lci5fbGFzdCA9IDBcblRpbWVyLnRpbWUgPSBOdW1iZXIuTUlOX1ZBTFVFXG5UaW1lci50aW1lU2NhbGUgPSAxXG5UaW1lci5tYXhTdGVwID0gMC4wNVxuXG5UaW1lci5zdGVwID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjdXJyZW50ID0gRGF0ZS5ub3coKVxuICB2YXIgZGVsdGEgPSAoY3VycmVudCAtIFRpbWVyLl9sYXN0KSAvIDEwMDBcbiAgVGltZXIudGltZSArPSBNYXRoLm1pbihkZWx0YSwgVGltZXIubWF4U3RlcCkgKiBUaW1lci50aW1lU2NhbGVcbiAgVGltZXIuX2xhc3QgPSBjdXJyZW50XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBlcXVhbDogZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueVxuICB9LFxuXG4gIGFkZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG4gICAgdmFyIHYgPSB7IHg6MCwgeTowIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHYueCArPSBhcmdzW2ldLnhcbiAgICAgIHYueSArPSBhcmdzW2ldLnlcbiAgICB9XG4gICAgcmV0dXJuIHZcbiAgfSxcblxuICBzdWJ0cmFjdDogZnVuY3Rpb24odikge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgIHYgPSB7IHg6di54LCB5OnYueSB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2LnggLT0gYXJnc1tpXS54XG4gICAgICB2LnkgLT0gYXJnc1tpXS55XG4gICAgfVxuICAgIHJldHVybiB2XG4gIH1cblxufVxuIl19
