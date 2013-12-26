(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

    var r = this.game.entityAt(this.pos, Robot.name)
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

var EntityManager = require('./entityManager')
var Ball = require('./ball')
var Switch = require('./switch')
var Robot = require('./robot')
var Exit = require('./exit')

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
  // this.buttonManager = new ButtonManager()
  // this.queueManager = new QueueManager()
  this.levelManager = new LevelManager()
}

var proto = Game.prototype

proto.loadLevel = function(idx) {
  var level = this.levelManager.load(idx)
  // this.loadEntities(level)
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
  // this.buttonManager.update()
  // this.queueManager.update()
  // this.entities.invoke('update', [this.ctx], 'Robot')
  // this.entities.invoke('update', [this.ctx], 'Ball')
  // this.entities.invoke('update', [this.ctx], 'Switch')
  // this.entities.invoke('update', [this.ctx], 'Exit')
}

// draw all the things
proto.draw = function() {
  this.ctx.clearRect(0, 0, this.width, this.height)

  // draw the level
  this.levelManager.draw(this.ctx)

  // // draw each entity
  // this.entities.invoke('draw', [this.ctx], 'Exit')
  // this.entities.invoke('draw', [this.ctx], 'Switch')
  // this.entities.invoke('draw', [this.ctx], 'Robot')
  // this.entities.invoke('draw', [this.ctx], 'Ball')

  // // draw any UI last
  // this.buttonManager.draw(this.ctx)
  // this.queueManager.draw(this.ctx)
}

// get the entity at the given position
// proto.entityAt = function(pos, type) {
//   return this.entities.atPos(pos, type)
// }

// proto.entitiesOfType = function(type) {
//   return this.entities.ofType(type)
// }

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

},{"./ball":1,"./entityManager":6,"./exit":7,"./input":10,"./levelManager":13,"./robot":21,"./switch":24,"./timer":27,"./vector2":28}],9:[function(require,module,exports){
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

QueueButton.prototype.tapped = function() {
  pubsub.trigger('queueButtonPressed', [this])
}

},{"./button":2,"./lib/inherits":17,"./lib/pubsub":18}],20:[function(require,module,exports){
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

},{"./game":8,"./lib/pubsub":18,"./queueButton":19,"./sprite":23}],21:[function(require,module,exports){
var vector2 = require('./vector2')
var pubsub = require('./lib/pubsub')
var Timer = require('./timer')

var Ball = require('./ball')

var Robot = module.exports = function Robot(pos) {
  this.game = require('./game').game
  this.pos = pos
  this.dir = { x:1, y:0 }
  this.freq = 0.4
  this.blocked = false
  this.stopped = true

  this.timer = new Timer(Number.MAX_VALUE)
  this.timer.pause()

  // pubsub.on('commandButtonPressed', this.enqueue.bind(this))
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
  var target = level.entityAt(vector2.add(this.pos, this.dir), Ball.name)
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

proto.start = function() {
  this.timer.set(0)
  this.timer.unpause()
}

proto.stop = function() {
  this.timer.pause()
}

proto.update = function() {
  var queue = this.game.levelManager.current.queueManager
  if (queue.count() == 0)
    return this.stop()

  if (this.blocked) {
    queue.reset()
    return this.stop()
  }

  if (this.timer.delta() > 0) {
    var action = queue.pop()
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2JhbGwuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2J1dHRvbi5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvYnV0dG9uTWFuYWdlci5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvY29uZmlnL2J1dHRvbnMuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2NvbmZpZy9sZXZlbHMuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2VudGl0eU1hbmFnZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2V4aXQuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2dhbWUuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2dyaWQuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2lucHV0LmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9pbnRlcm1pc3Npb24uanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2xldmVsLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9sZXZlbE1hbmFnZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2xldmVscy9maXJzdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGV2ZWxzL3NlY29uZC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2V4dGVuZC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2luaGVyaXRzLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9saWIvcHVic3ViLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9xdWV1ZUJ1dHRvbi5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvcXVldWVNYW5hZ2VyLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9yb2JvdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvc2NyaXB0LmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9zcHJpdGUuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL3N3aXRjaC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGV4dHVyZS5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGlsZXNldC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGltZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL3ZlY3RvcjIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU3dpdGNoID0gcmVxdWlyZSgnLi9zd2l0Y2gnKVxuXG52YXIgQmFsbCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQmFsbChwb3MpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLnBvcyA9IHBvc1xufVxuXG5CYWxsLnByb3RvdHlwZS5kcm9wcGVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciB0YXJnZXQgPSB0aGlzLmdhbWUuZW50aXR5QXQodGhpcy5wb3MsIFN3aXRjaC5uYW1lKVxuICBpZiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRhcmdldC50dXJuT24odGhpcylcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5CYWxsLnByb3RvdHlwZS5waWNrZWRVcCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGFyZ2V0ID0gdGhpcy5nYW1lLmVudGl0eUF0KHRoaXMucG9zLCBTd2l0Y2gubmFtZSlcbiAgaWYgKHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQudHVybk9mZih0aGlzKVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbkJhbGwucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG59XG5cbkJhbGwucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgdmFyIGQyciA9IE1hdGguZDJyXG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICBjdHguaXNvKGZ1bmN0aW9uKCkge1xuICAgIGN0eC50cmFuc2xhdGUoXG4gICAgICB0aGlzLnBvcy54ICogc2NhbGUgKyBzY2FsZSAvIDIsXG4gICAgICB0aGlzLnBvcy55ICogc2NhbGUgKyBzY2FsZSAvIDJcbiAgICApXG5cbiAgICB2YXIgcmFkaXVzID0gc2NhbGUqMC4zXG5cbiAgICBjdHguZmlsbFN0eWxlID0gJyM3Nzc3RkYnXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LmFyYygwLCAwLCByYWRpdXMsIGQycigwKSwgZDJyKDM2MCkpXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuICB9LmJpbmQodGhpcykpXG59XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcblxudmFyIEJ1dHRvbiA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQnV0dG9uKGJ0bikge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIC8vIGNvcHkgb3ZlciB0aGUgYnRuIHByb3BlcnRpZXNcbiAgZm9yICh2YXIgayBpbiBidG4pIGlmIChidG4uaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICB0aGlzW2tdID0gYnRuW2tdXG4gIH1cbiAgdGhpcy5zdGF0ZSA9IEJ1dHRvbi5TVEFURS5OT1JNQUxcbn1cblxuQnV0dG9uLnByb3RvdHlwZS50YXBwZWQgPSBmdW5jdGlvbigpIHtcbiAgcHVic3ViLnRyaWdnZXIoJ2NvbW1hbmRCdXR0b25QcmVzc2VkJywgW3RoaXNdKVxufVxuXG5CdXR0b24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnN0YXRlID0gQnV0dG9uLlNUQVRFLk5PUk1BTFxuICB2YXIgc3RhcnQgPSB0aGlzLmdhbWUuaW5wdXQuc3RhcnRcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLmdhbWUuaW5wdXQuY3VycmVudFxuICB2YXIgcHJldmlvdXMgPSB0aGlzLmdhbWUuaW5wdXQucHJldmlvdXNcblxuICBpZiAoY3VycmVudCkge1xuICAgIGlmICh0aGlzLmNvbnRhaW5zKGN1cnJlbnQpICYmIHRoaXMuY29udGFpbnMoc3RhcnQpKSB7XG4gICAgICB0aGlzLnN0YXRlID0gQnV0dG9uLlNUQVRFLkRPV05cbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAocHJldmlvdXMgJiYgdGhpcy5jb250YWlucyhwcmV2aW91cy5lbmQpICYmIHRoaXMuY29udGFpbnMocHJldmlvdXMuc3RhcnQpKSB7XG4gICAgdGhpcy50YXBwZWQoKVxuICAgIHRoaXMuZ2FtZS5pbnB1dC5wcmV2aW91cyA9IG51bGxcbiAgfVxufVxuXG5CdXR0b24ucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgY3R4LnNhdmUoKVxuICBjdHgudHJhbnNsYXRlKHRoaXMucG9zLngsIHRoaXMucG9zLnkpXG5cbiAgdmFyIHJlY3QgPSB7IHg6MCwgeTowLCB3OnRoaXMud2lkdGgsIGg6dGhpcy5oZWlnaHQgfVxuICB2YXIgZnJhbWUgPSB0aGlzLnN0YXRlID09IEJ1dHRvbi5TVEFURS5OT1JNQUwgPyB0aGlzLmZyYW1lT2ZmIDogdGhpcy5mcmFtZU9uXG4gIHRoaXMuc3ByaXRlLmRyYXcoY3R4LCBmcmFtZSwgcmVjdClcblxuICBjdHgucmVzdG9yZSgpXG59XG5cbkJ1dHRvbi5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihwb2ludCkge1xuICByZXR1cm4gIShcbiAgICB0aGlzLnBvcy54ID4gcG9pbnQueCB8fFxuICAgIHRoaXMucG9zLnggKyB0aGlzLndpZHRoIDwgcG9pbnQueCB8fFxuICAgIHRoaXMucG9zLnkgPiBwb2ludC55IHx8XG4gICAgdGhpcy5wb3MueSArIHRoaXMuaGVpZ2h0IDwgcG9pbnQueVxuICApXG59XG5cbkJ1dHRvbi5TVEFURSA9IHtcbiAgTk9STUFMOiAnbm9ybWFsJyxcbiAgRE9XTjogJ2Rvd24nXG59XG4iLCJ2YXIgYnV0dG9uRGVmcyA9IHJlcXVpcmUoJy4vY29uZmlnL2J1dHRvbnMnKVxudmFyIEJ1dHRvbiA9IHJlcXVpcmUoJy4vYnV0dG9uJylcbnZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpXG5cbnZhciBCdXR0b25NYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zcHJpdGVzID0ge31cbiAgZm9yICh2YXIga2V5IGluIGJ1dHRvbkRlZnMuc3ByaXRlcykge1xuICAgIHZhciBzcHIgPSBidXR0b25EZWZzLnNwcml0ZXNba2V5XVxuICAgIHZhciBzcHJpdGUgPSBuZXcgU3ByaXRlKHNwcilcbiAgICB0aGlzLnNwcml0ZXNba2V5XSA9IHNwcml0ZVxuICB9XG5cbiAgdGhpcy5idXR0b25zID0gW11cbiAgZm9yICh2YXIga2V5IGluIGJ1dHRvbkRlZnMuYnV0dG9ucykge1xuICAgIHZhciBidG4gPSBidXR0b25EZWZzLmJ1dHRvbnNba2V5XVxuICAgIGJ0bi5zcHJpdGUgPSB0aGlzLnNwcml0ZXNbYnRuLnNwcml0ZV1cbiAgICB2YXIgYnV0dG9uID0gbmV3IEJ1dHRvbihidG4pXG4gICAgdGhpcy5idXR0b25zLnB1c2goYnV0dG9uKVxuICB9XG59XG5cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrPTEpIHtcbiAgICB0aGlzLmJ1dHRvbnNbaV0udXBkYXRlKClcbiAgfVxufVxuXG5CdXR0b25NYW5hZ2VyLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS5kcmF3KGN0eClcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgc3ByaXRlczoge1xuICAgIGJ1dHRvbnM6IHtcbiAgICAgIHRleHR1cmU6ICdpbWFnZXMvYnV0dG9ucy5wbmcnLFxuICAgICAgd2lkdGg6IDgwLFxuICAgICAgaGVpZ2h0OiA4MFxuICAgIH1cbiAgfSxcblxuICBidXR0b25zOiB7XG5cbiAgICBmb3J3YXJkOiB7XG4gICAgICBwb3M6IHsgeDowLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjowLFxuICAgICAgZnJhbWVPbjoxLFxuICAgICAgY29tbWFuZDogJ21vdmVGb3J3YXJkJ1xuICAgIH0sXG5cbiAgICBiYWNrd2FyZDoge1xuICAgICAgcG9zOiB7IHg6ODAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjIsXG4gICAgICBmcmFtZU9uOjMsXG4gICAgICBjb21tYW5kOiAnbW92ZUJhY2t3YXJkJ1xuICAgIH0sXG5cbiAgICBsZWZ0OiB7XG4gICAgICBwb3M6IHsgeDoxNzAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjQsXG4gICAgICBmcmFtZU9uOjUsXG4gICAgICBjb21tYW5kOiAndHVybkxlZnQnXG4gICAgfSxcblxuICAgIHJpZ2h0OiB7XG4gICAgICBwb3M6IHsgeDoyNTAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjYsXG4gICAgICBmcmFtZU9uOjcsXG4gICAgICBjb21tYW5kOiAndHVyblJpZ2h0J1xuICAgIH0sXG5cbiAgICBwaWNrdXA6IHtcbiAgICAgIHBvczogeyB4OjM0MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6OCxcbiAgICAgIGZyYW1lT246OSxcbiAgICAgIGNvbW1hbmQ6ICdwaWNrdXAnXG4gICAgfSxcblxuICAgIHJlbGVhc2U6IHtcbiAgICAgIHBvczogeyB4OjQyMCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6MTAsXG4gICAgICBmcmFtZU9uOjExLFxuICAgICAgY29tbWFuZDogJ3JlbGVhc2UnXG4gICAgfSxcblxuICAgIHN0YXJ0OiB7XG4gICAgICBwb3M6IHsgeDo1NDAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjEyLFxuICAgICAgZnJhbWVPbjoxMyxcbiAgICAgIGNvbW1hbmQ6ICdzdGFydCdcbiAgICB9LFxuXG4gICAgdHVybkFyb3VuZDoge1xuICAgICAgcG9zOiB7IHg6NjYwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjo2LFxuICAgICAgZnJhbWVPbjo3LFxuICAgICAgY29tbWFuZDogJ3R1cm5Bcm91bmQnXG4gICAgfSxcblxuICAgIHJlc3RhcnQ6IHtcbiAgICAgIHBvczogeyB4Ojc4MCwgeTowIH0sXG4gICAgICB3aWR0aDo0MCxcbiAgICAgIGhlaWdodDo0MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6NixcbiAgICAgIGZyYW1lT246NyxcbiAgICAgIGNvbW1hbmQ6ICdyZXN0YXJ0J1xuICAgIH1cblxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgcmVxdWlyZSgnLi4vbGV2ZWxzL2ZpcnN0JyksXG4gIHJlcXVpcmUoJy4uL2xldmVscy9zZWNvbmQnKVxuXVxuIiwidmFyIHZlY3RvcjIgPSByZXF1aXJlKCcuL3ZlY3RvcjInKVxudmFyIEJhbGwgPSByZXF1aXJlKCcuL2JhbGwnKVxudmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vc3dpdGNoJylcbnZhciBSb2JvdCA9IHJlcXVpcmUoJy4vcm9ib3QnKVxudmFyIEV4aXQgPSByZXF1aXJlKCcuL2V4aXQnKVxuXG52YXIgZW50aGFzaCA9IHtcbiAgQjogQmFsbCxcbiAgUzogU3dpdGNoLFxuICBSOiBSb2JvdCxcbiAgRTogRXhpdFxufVxuXG52YXIgRW50aXR5TWFuYWdlciA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZW50TWFwKSB7XG4gIHRoaXMuZW50aXRpZXMgPSBbXVxuICB0aGlzLmJ5VHlwZSA9IHt9XG4gIHRoaXMubG9hZEVudGl0aWVzKGVudE1hcClcbn1cblxudmFyIHByb3RvID0gRW50aXR5TWFuYWdlci5wcm90b3R5cGVcblxuLy8gbG9hZCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgbGV2ZWxcbnByb3RvLmxvYWRFbnRpdGllcyA9IGZ1bmN0aW9uKG1hcCkge1xuICBmb3IgKHZhciB5ID0gMDsgeSA8IG1hcC5sZW5ndGg7IHkrPTEpIHtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG1hcFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgICAgIHZhciBFbnQgPSBlbnRoYXNoW21hcFt5XVt4XV1cbiAgICAgIGlmIChFbnQpIHtcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBlbnRpdHlcbiAgICAgICAgdmFyIGVudCA9IG5ldyBFbnQoe3g6eCx5Onl9KVxuICAgICAgICAvLyBjaGVjayB0byBzZWUgaWYgaXQncyB0aGUgcm9ib3RcbiAgICAgICAgaWYgKGVudCBpbnN0YW5jZW9mIFJvYm90KSB0aGlzLnJvYm90ID0gZW50XG4gICAgICAgIC8vIGFkZCBpdCB0byB0aGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICAgICAgdGhpcy5hZGQoRW50Lm5hbWUsIGVudClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxucHJvdG8uYWRkID0gZnVuY3Rpb24odHlwZSwgZW50KSB7XG4gIHRoaXMuZW50aXRpZXMucHVzaChlbnQpXG4gIHRoaXMuYnlUeXBlW3R5cGVdIHx8ICh0aGlzLmJ5VHlwZVt0eXBlXSA9IFtdKVxuICB0aGlzLmJ5VHlwZVt0eXBlXS5wdXNoKGVudClcbn1cblxucHJvdG8ub2ZUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICByZXR1cm4gdGhpcy5ieVR5cGVbdHlwZV1cbn1cblxucHJvdG8uYXRQb3MgPSBmdW5jdGlvbihwb3MsIHR5cGUpIHtcbiAgdmFyIGVudHMgPSB0aGlzLmJ5VHlwZVt0eXBlXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgdmFyIGVudCA9IGVudHNbaV1cbiAgICBpZiAodmVjdG9yMi5lcXVhbChlbnQucG9zLCBwb3MpKSB7XG4gICAgICByZXR1cm4gZW50XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbnByb3RvLmludm9rZSA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgdHlwZSkge1xuICB2YXIgZW50cyA9IHRoaXMuZW50aXRpZXNcbiAgaWYgKHR5cGUpIGVudHMgPSB0aGlzLmJ5VHlwZVt0eXBlXVxuXG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHRoaXMuX2RvSW52b2tlMChmbk5hbWUsIGVudHMpOyBicmVha1xuICAgIGNhc2UgMTogdGhpcy5fZG9JbnZva2UxKGZuTmFtZSwgYXJncywgZW50cyk7IGJyZWFrXG4gICAgY2FzZSAyOiB0aGlzLl9kb0ludm9rZTEoZm5OYW1lLCBhcmdzLCBlbnRzKTsgYnJlYWtcbiAgICBjYXNlIDM6IHRoaXMuX2RvSW52b2tlMShmbk5hbWUsIGFyZ3MsIGVudHMpOyBicmVha1xuICAgIGRlZmF1bHQ6IHRoaXMuX2RvSW52b2tlQShmbk5hbWUsIGFyZ3MsIGVudHMpO1xuICB9XG59XG5cbnByb3RvLl9kb0ludm9rZTAgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXSgpXG4gIH1cbn1cblxucHJvdG8uX2RvSW52b2tlMSA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdKGFyZ3NbMF0pXG4gIH1cbn1cblxucHJvdG8uX2RvSW52b2tlMiA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gIH1cbn1cblxucHJvdG8uX2RvSW52b2tlMyA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gIH1cbn1cblxucHJvdG8uX2RvSW52b2tlQSA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdLmFwcGx5KGVudHNbaV0sIGFyZ3MpXG4gIH1cbn1cblxuXG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBTd2l0Y2ggPSByZXF1aXJlKCcuL3N3aXRjaCcpXG52YXIgUm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcblxudmFyIEV4aXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEV4aXQocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3Ncbn1cblxuRXhpdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RhdGUgPSBFeGl0LlNUQVRFLklOQUNUSVZFXG4gIGlmICh0aGlzLmFsbFN3aXRjaGVzT24oKSkge1xuICAgIHRoaXMuc3RhdGUgPSBFeGl0LlNUQVRFLkFDVElWRVxuXG4gICAgdmFyIHIgPSB0aGlzLmdhbWUuZW50aXR5QXQodGhpcy5wb3MsIFJvYm90Lm5hbWUpXG4gICAgaWYgKHIpIHtcbiAgICAgIHB1YnN1Yi50cmlnZ2VyKCdleGl0TGV2ZWwnKVxuICAgIH1cbiAgfVxufVxuXG5FeGl0LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICBjdHguaXNvKGZ1bmN0aW9uKCkge1xuICAgIGN0eC50cmFuc2xhdGUoXG4gICAgICB0aGlzLnBvcy54ICogc2NhbGUgKyBzY2FsZSAvIDIsXG4gICAgICB0aGlzLnBvcy55ICogc2NhbGUgKyBzY2FsZSAvIDJcbiAgICApXG5cbiAgICBpZiAodGhpcy5zdGF0ZSA9PSBFeGl0LlNUQVRFLklOQUNUSVZFKVxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjQ0NDQ0NDJ1xuICAgIGVsc2VcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAnI0ZGRkZGRidcblxuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5yZWN0KFxuICAgICAgc2NhbGUgKiAtMC4zLFxuICAgICAgc2NhbGUgKiAtMC4zLFxuICAgICAgc2NhbGUgKiAwLjYsXG4gICAgICBzY2FsZSAqIDAuNlxuICAgIClcbiAgICBjdHguZmlsbCgpXG4gICAgY3R4LnN0cm9rZSgpXG4gIH0uYmluZCh0aGlzKSlcbn1cblxuRXhpdC5wcm90b3R5cGUuYWxsU3dpdGNoZXNPbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbGV2ZWwgPSB0aGlzLmdhbWUubGV2ZWxNYW5hZ2VyLmN1cnJlbnRcbiAgdmFyIGVudHMgPSBsZXZlbC5lbnRpdGllcy5vZlR5cGUoU3dpdGNoLm5hbWUpXG4gIGlmICghZW50cyB8fCAhZW50cy5sZW5ndGgpIHJldHVybiB0cnVlXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGlmIChlbnRzW2ldLnN0YXRlID09PSBTd2l0Y2guU1RBVEUuT0ZGKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG5FeGl0LlNUQVRFID0ge1xuICBBQ1RJVkUgOiAxLFxuICBJTkFDVElWRSA6IDBcbn1cbiIsInZhciB2ZWN0b3IyID0gcmVxdWlyZSgnLi92ZWN0b3IyJylcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKVxudmFyIFRpbWVyID0gcmVxdWlyZSgnLi90aW1lcicpXG52YXIgTGV2ZWxNYW5hZ2VyID0gcmVxdWlyZSgnLi9sZXZlbE1hbmFnZXInKVxuXG52YXIgRW50aXR5TWFuYWdlciA9IHJlcXVpcmUoJy4vZW50aXR5TWFuYWdlcicpXG52YXIgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbCcpXG52YXIgU3dpdGNoID0gcmVxdWlyZSgnLi9zd2l0Y2gnKVxudmFyIFJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG52YXIgRXhpdCA9IHJlcXVpcmUoJy4vZXhpdCcpXG5cbnZhciBHYW1lID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzKSB7XG4gIEdhbWUuZ2FtZSA9IHRoaXNcblxuICB0aGlzLnNjYWxlID0gb3B0cy5zY2FsZVxuICB2YXIgd2lkdGggPSB0aGlzLndpZHRoID0gb3B0cy53aWR0aFxuICB2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHQgPSBvcHRzLmhlaWdodFxuICB0aGlzLmdyaWRTaXplID0gb3B0cy5ncmlkU2l6ZVxuICB0aGlzLnRvcE1hcmdpbiA9IG9wdHMudG9wTWFyZ2luXG5cbiAgLy8gc2V0dXAgdGhlIGNhbnZhc1xuICB0aGlzLmN0eCA9IHRoaXMuaW5pdENhbnZhcyhvcHRzLmNhbnZhcywgd2lkdGgsIGhlaWdodClcblxuICB0aGlzLmlucHV0ID0gbmV3IElucHV0KG9wdHMuY2FudmFzKVxuICAvLyB0aGlzLmJ1dHRvbk1hbmFnZXIgPSBuZXcgQnV0dG9uTWFuYWdlcigpXG4gIC8vIHRoaXMucXVldWVNYW5hZ2VyID0gbmV3IFF1ZXVlTWFuYWdlcigpXG4gIHRoaXMubGV2ZWxNYW5hZ2VyID0gbmV3IExldmVsTWFuYWdlcigpXG59XG5cbnZhciBwcm90byA9IEdhbWUucHJvdG90eXBlXG5cbnByb3RvLmxvYWRMZXZlbCA9IGZ1bmN0aW9uKGlkeCkge1xuICB2YXIgbGV2ZWwgPSB0aGlzLmxldmVsTWFuYWdlci5sb2FkKGlkeClcbiAgLy8gdGhpcy5sb2FkRW50aXRpZXMobGV2ZWwpXG59XG5cbi8vIHN0YXJ0cyB0aGUgZ2FtZSBsb29wXG5wcm90by5zdGFydCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmxvb3AoKVxufVxuXG4vLyBzdXNwZW5kcyB0aGUgZ2FtZSBsb29wXG5wcm90by5zdG9wID0gZnVuY3Rpb24oKSB7XG4gIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuckFGSUQpXG59XG5wcm90by5wYXVzZSA9IHByb3RvLnN0b3BcblxuLy8gdGhlIGdhbWUgbG9vcFxucHJvdG8ubG9vcCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJBRklEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMubG9vcC5iaW5kKHRoaXMpLCB0aGlzLmN0eC5jYW52YXMpXG5cbiAgc3RhdHMuYmVnaW4oKTtcblxuICB0aGlzLnVwZGF0ZSgpXG4gIHRoaXMuZHJhdygpXG5cbiAgc3RhdHMuZW5kKCk7XG59XG5cbi8vIHVwZGF0ZSBhbGwgdGhlIHRoaW5nc1xucHJvdG8udXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIFRpbWVyLnN0ZXAoKVxuXG4gIHRoaXMubGV2ZWxNYW5hZ2VyLnVwZGF0ZSgpXG4gIC8vIHRoaXMuYnV0dG9uTWFuYWdlci51cGRhdGUoKVxuICAvLyB0aGlzLnF1ZXVlTWFuYWdlci51cGRhdGUoKVxuICAvLyB0aGlzLmVudGl0aWVzLmludm9rZSgndXBkYXRlJywgW3RoaXMuY3R4XSwgJ1JvYm90JylcbiAgLy8gdGhpcy5lbnRpdGllcy5pbnZva2UoJ3VwZGF0ZScsIFt0aGlzLmN0eF0sICdCYWxsJylcbiAgLy8gdGhpcy5lbnRpdGllcy5pbnZva2UoJ3VwZGF0ZScsIFt0aGlzLmN0eF0sICdTd2l0Y2gnKVxuICAvLyB0aGlzLmVudGl0aWVzLmludm9rZSgndXBkYXRlJywgW3RoaXMuY3R4XSwgJ0V4aXQnKVxufVxuXG4vLyBkcmF3IGFsbCB0aGUgdGhpbmdzXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodClcblxuICAvLyBkcmF3IHRoZSBsZXZlbFxuICB0aGlzLmxldmVsTWFuYWdlci5kcmF3KHRoaXMuY3R4KVxuXG4gIC8vIC8vIGRyYXcgZWFjaCBlbnRpdHlcbiAgLy8gdGhpcy5lbnRpdGllcy5pbnZva2UoJ2RyYXcnLCBbdGhpcy5jdHhdLCAnRXhpdCcpXG4gIC8vIHRoaXMuZW50aXRpZXMuaW52b2tlKCdkcmF3JywgW3RoaXMuY3R4XSwgJ1N3aXRjaCcpXG4gIC8vIHRoaXMuZW50aXRpZXMuaW52b2tlKCdkcmF3JywgW3RoaXMuY3R4XSwgJ1JvYm90JylcbiAgLy8gdGhpcy5lbnRpdGllcy5pbnZva2UoJ2RyYXcnLCBbdGhpcy5jdHhdLCAnQmFsbCcpXG5cbiAgLy8gLy8gZHJhdyBhbnkgVUkgbGFzdFxuICAvLyB0aGlzLmJ1dHRvbk1hbmFnZXIuZHJhdyh0aGlzLmN0eClcbiAgLy8gdGhpcy5xdWV1ZU1hbmFnZXIuZHJhdyh0aGlzLmN0eClcbn1cblxuLy8gZ2V0IHRoZSBlbnRpdHkgYXQgdGhlIGdpdmVuIHBvc2l0aW9uXG4vLyBwcm90by5lbnRpdHlBdCA9IGZ1bmN0aW9uKHBvcywgdHlwZSkge1xuLy8gICByZXR1cm4gdGhpcy5lbnRpdGllcy5hdFBvcyhwb3MsIHR5cGUpXG4vLyB9XG5cbi8vIHByb3RvLmVudGl0aWVzT2ZUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuLy8gICByZXR1cm4gdGhpcy5lbnRpdGllcy5vZlR5cGUodHlwZSlcbi8vIH1cblxuLy8gc2V0dXAgY2FudmFzZSBlbGVtZW50cyB0byB0aGUgY29ycmVjdCBzaXplXG5wcm90by5pbml0Q2FudmFzID0gZnVuY3Rpb24oaWQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICBjYW52YXMud2lkdGggPSB3aWR0aFxuICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIHJldHVybiBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxufVxuXG5cblxuXG4vLyBkZWdyZWVzIHRvIHJhZGlhbnNcbk1hdGguZDJyID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYSAqIChNYXRoLlBJLzE4MClcbn1cblxuLy8gcmFkaWFucyB0byBkZWdyZXNzXG5NYXRoLnIyZCA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEgLyAoTWF0aC5QSS8xODApXG59XG5cblxudmFyIHRoZXRhID0gTWF0aC5kMnIoNDUpXG52YXIgY3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKVxudmFyIHNuVGhldGEgPSBNYXRoLnNpbih0aGV0YSlcbnZhciB0aGV0YUludiA9IE1hdGguZDJyKDMxNSlcbnZhciBjc1RoZXRhSW52ID0gTWF0aC5jb3ModGhldGFJbnYpXG52YXIgc25UaGV0YUludiA9IE1hdGguc2luKHRoZXRhSW52KVxuXG4vLyB0cmFuc2xhdGUgc2NyZWVuIHRvIHdvcmxkXG5wcm90by5zMncgPSBmdW5jdGlvbihwb3MpIHtcbiAgLy8gcm90YXRlXG4gIHZhciB4ID0gcG9zLnhcbiAgdmFyIHkgPSBwb3MueVxuICBwb3MueCA9IHggKiBjc1RoZXRhIC0geSAqIHNuVGhldGFcbiAgcG9zLnkgPSB4ICogc25UaGV0YSArIHkgKiBjc1RoZXRhXG4gIC8vIHNjYWxlXG4gIHBvcy55ICo9IDAuNVxuICAvLyB0cmFuc2xhdGVcbiAgcG9zLnggKz0gdGhpcy53aWR0aC8yXG4gIHBvcy55ICs9IHRoaXMudG9wTWFyZ2luXG4gIHJldHVybiBwb3Ncbn1cblxuLy8gdHJhbnNsYXRlIHdvcmxkIHRvIHNjcmVlblxucHJvdG8udzJzID0gZnVuY3Rpb24ocG9zKSB7XG4gIC8vIHRyYW5zbGF0ZVxuICBwb3MueCAtPSB0aGlzLndpZHRoLzJcbiAgcG9zLnkgLT0gdGhpcy50b3BNYXJnaW5cbiAgLy8gc2NhbGVcbiAgcG9zLnkgLz0gMC41MVxuICAvLyByb3RhdGVcbiAgdmFyIHkgPSBwb3MueVxuICB2YXIgeCA9IHBvcy54XG4gIHBvcy54ID0geCAqIGNzVGhldGFJbnYgLSB5ICogc25UaGV0YUludlxuICBwb3MueSA9IHggKiBzblRoZXRhSW52ICsgeSAqIGNzVGhldGFJbnZcbiAgcmV0dXJuIHBvc1xufVxuXG5cbi8vIHRyYW5zZm9ybSB0aGUgY29udGV4dCBpbnRvIGlzb21ldHJpY1xuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5pc28gPSBmdW5jdGlvbihmbikge1xuICB0aGlzLnNhdmUoKVxuXG4gIC8vIG1vdmUgdGhlIGdhbWUgYm9hcmQgZG93biBhIGJpdFxuICB0aGlzLnRyYW5zbGF0ZSgwLCBHYW1lLmdhbWUudG9wTWFyZ2luKVxuICB0aGlzLnRyYW5zbGF0ZShHYW1lLmdhbWUud2lkdGgvMiwgMClcbiAgdGhpcy5zY2FsZSgxLCAwLjUpXG4gIHRoaXMucm90YXRlKDQ1ICogTWF0aC5QSSAvIDE4MClcbiAgLy8gdGhpcy50cmFuc2Zvcm0oMC43MDcsIDAuNDA5LCAtMC43MDcsIDAuNDA5LCAwLCAwKVxuICBmbigpXG4gIHRoaXMucmVzdG9yZSgpXG59XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBUaWxlU2V0ID0gcmVxdWlyZSgnLi90aWxlc2V0JylcblxudmFyIEdyaWQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGdyaWQsIHQpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuXG4gIHRoaXMuZ3JpZCA9IGdyaWRcbiAgdGhpcy50aWxlcyA9IG5ldyBUaWxlU2V0KHQuc3JjLCB0LncsIHQuaCwgdC5veCwgdC5veSlcblxuICB2YXIgcDEgPSB0aGlzLmdhbWUuczJ3KHt4OjAsIHk6MH0pXG4gIHZhciBwMiA9IHRoaXMuZ2FtZS5zMncoe3g6MCwgeTp0aGlzLmdhbWUuc2NhbGV9KVxuICB0aGlzLmlzb1RpbGVXaWR0aCA9IE1hdGguYWJzKHAyLnggLSBwMS54KSoyXG5cbiAgdGhpcy5lY2hvKCdsb2FkJywgdGhpcy50aWxlcylcbn1cblxucHVic3ViLmV4dGVuZChHcmlkLnByb3RvdHlwZSlcblxudmFyIHByb3RvID0gR3JpZC5wcm90b3R5cGVcblxucHJvdG8uZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICB2YXIgc2NhbGUgPSB0aGlzLmdhbWUuc2NhbGVcbiAgdmFyIGdyaWQgPSB0aGlzLmdyaWRcbiAgdmFyIHRpbGVzID0gdGhpcy50aWxlc1xuXG4gIGZvciAodmFyIHkgPSAwOyB5IDwgZ3JpZC5sZW5ndGg7IHkrPTEpIHtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGdyaWRbeV0ubGVuZ3RoOyB4Kz0xKSB7XG4gICAgICB2YXIgcG9zID0gdGhpcy5nYW1lLnMydyh7eDp4KnNjYWxlLCB5Onkqc2NhbGV9KVxuICAgICAgdGlsZXMuZHJhdyhjdHgsIGdyaWRbeV1beF0sIHBvcy54LCBwb3MueSwgdGhpcy5pc29UaWxlV2lkdGgpXG5cbiAgICAgIC8vIGN0eC5maWxsU3R5bGUgPSAnI2ZmMDAwMCdcbiAgICAgIC8vIGN0eC5zdHJva2VTdHlsZSA9ICcjZmZmZmZmJ1xuICAgICAgLy8gY3R4LnJlY3QocG9zLngtMS41LCBwb3MueS0xLjUsIDMsIDMpXG4gICAgICAvLyBjdHguZmlsbCgpXG4gICAgICAvLyBjdHguc3Ryb2tlKClcbiAgICB9XG4gIH1cblxuICAvLyBjdHguaXNvKGZ1bmN0aW9uKCkge1xuXG4gIC8vICAgLy8gZHJhdyB0aGUgZ3JpZCB0aWxlc1xuICAvLyAgIGZvciAodmFyIHkgPSAwOyB5IDwgZ3JpZC5sZW5ndGg7IHkrPTEpIHtcbiAgLy8gICAgIGZvciAodmFyIHggPSAwOyB4IDwgZ3JpZFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgLy8gICAgICAgLy8gZmlsbCB0aGUgdGlsZVxuICAvLyAgICAgICBpZiAoZ3JpZFt5XVt4XSkge1xuICAvLyAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwwLjE1KSdcbiAgLy8gICAgICAgICBjdHguZmlsbFJlY3QoeCpzY2FsZSArIHNjYWxlKjAuMSwgeSpzY2FsZSArIHNjYWxlKjAuMSwgc2NhbGUqMC44LCBzY2FsZSowLjgpXG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICB9XG5cbiAgLy8gICAvLyBkcmF3IHRoZSBncmlkIGxpbmVzXG4gIC8vICAgY3R4LnN0cm9rZVN0eWxlID0gJyM4ODg4ODgnXG4gIC8vICAgZm9yICh2YXIgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSs9MSkge1xuICAvLyAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBncmlkW3ldLmxlbmd0aDsgeCs9MSkge1xuICAvLyAgICAgICBpZiAoZ3JpZFt5XVt4XSkge1xuICAvLyAgICAgICAgIGN0eC5iZWdpblBhdGgoKVxuICAvLyAgICAgICAgIGN0eC5yZWN0KHgqc2NhbGUrMC41LCB5KnNjYWxlKzAuNSwgc2NhbGUsIHNjYWxlKVxuICAvLyAgICAgICAgIGN0eC5zdHJva2UoKVxuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuXG4gIC8vIH0pXG59XG4iLCJ2YXIgSW5wdXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlkKSB7XG4gIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy50b3VjaFN0YXJ0LmJpbmQodGhpcyksIGZhbHNlKVxuICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnRvdWNoTW92ZS5iaW5kKHRoaXMpLCBmYWxzZSlcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLnRvdWNoRW5kLmJpbmQodGhpcyksIGZhbHNlKVxufVxuXG5cbklucHV0LnByb3RvdHlwZS50b3VjaFN0YXJ0ID0gZnVuY3Rpb24oZXYpIHtcbiAgdGhpcy5zdGFydCA9IGV2LnRvdWNoZXNbMF1cbiAgdGhpcy50b3VjaE1vdmUoZXYpXG59XG5cbklucHV0LnByb3RvdHlwZS50b3VjaE1vdmUgPSBmdW5jdGlvbihldikge1xuICB0aGlzLnByZXZpb3VzID0gdGhpcy5jdXJyZW50XG4gIHRoaXMuY3VycmVudCA9IGV2LnRvdWNoZXNbMF1cbiAgdGhpcy5jdXJyZW50LnggPSB0aGlzLmN1cnJlbnQuY2xpZW50WFxuICB0aGlzLmN1cnJlbnQueSA9IHRoaXMuY3VycmVudC5jbGllbnRZXG59XG5cbklucHV0LnByb3RvdHlwZS50b3VjaEVuZCA9IGZ1bmN0aW9uKGV2KSB7XG4gIHRoaXMucHJldmlvdXMgPSB7XG4gICAgc3RhcnQ6IHRoaXMuc3RhcnQsXG4gICAgZW5kOiB0aGlzLmN1cnJlbnRcbiAgfVxuICB0aGlzLmN1cnJlbnQgPSBudWxsXG4gIHRoaXMuc3RhcnQgPSBudWxsXG59XG4iLCJ2YXIgSW50ZXJtaXNzaW9uID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblxufVxuXG52YXIgcHJvdG8gPSBJbnRlcm1pc3Npb24ucHJvdG90eXBlXG5cbnByb3RvLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXG59XG5cbnByb3RvLmRyYXcgPSBmdW5jdGlvbigpIHtcblxufVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG52YXIgR3JpZCA9IHJlcXVpcmUoJy4vZ3JpZCcpXG52YXIgQnV0dG9uTWFuYWdlciA9IHJlcXVpcmUoJy4vYnV0dG9uTWFuYWdlcicpXG52YXIgUXVldWVNYW5hZ2VyID0gcmVxdWlyZSgnLi9xdWV1ZU1hbmFnZXInKVxudmFyIEVudGl0eU1hbmFnZXIgPSByZXF1aXJlKCcuL2VudGl0eU1hbmFnZXInKVxudmFyIEludGVybWlzc2lvbiA9IHJlcXVpcmUoJy4vaW50ZXJtaXNzaW9uJylcblxuLy8gdmFyIF8gPSAwXG52YXIgQkFMTCA9ICdCYWxsJ1xudmFyIFNXSVRDSCA9ICdTd2l0Y2gnXG52YXIgUk9CT1QgPSAnUm9ib3QnXG52YXIgRVhJVCA9ICdFeGl0J1xudmFyIFVQREFURSA9ICd1cGRhdGUnXG52YXIgRFJBVyA9ICdkcmF3J1xuXG52YXIgTGV2ZWwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbmYpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLmN0eCA9IHRoaXMuZ2FtZS5jdHhcblxuICB0aGlzLmdyaWQgPSBuZXcgR3JpZChjb25mLmdyaWQsIGNvbmYudGlsZXMpXG4gIHRoaXMuZW50aXRpZXMgPSBuZXcgRW50aXR5TWFuYWdlcihjb25mLmVudGl0eU1hcClcbiAgaWYgKHRoaXMuZW50aXRpZXMucm9ib3QpIHtcbiAgICB0aGlzLnJvYm90ID0gdGhpcy5lbnRpdGllcy5yb2JvdFxuICB9XG5cbiAgdGhpcy5idXR0b25NYW5hZ2VyID0gbmV3IEJ1dHRvbk1hbmFnZXIoKVxuICB0aGlzLnF1ZXVlTWFuYWdlciA9IG5ldyBRdWV1ZU1hbmFnZXIoKVxuXG4gIHB1YnN1Yi5vbignZXhpdExldmVsJywgdGhpcy5lbmQuYmluZCh0aGlzKSlcbn1cblxudmFyIHByb3RvID0gTGV2ZWwucHJvdG90eXBlXG5cbnByb3RvLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5pbnRlcm1pc3Npb24pXG4gICAgdGhpcy5pbnRlcm1pc3Npb24udXBkYXRlKClcblxuICB0aGlzLmJ1dHRvbk1hbmFnZXIudXBkYXRlKClcbiAgdGhpcy5xdWV1ZU1hbmFnZXIudXBkYXRlKClcbiAgdGhpcy5lbnRpdGllcy5pbnZva2UoVVBEQVRFLCBbdGhpcy5jdHhdLCBST0JPVClcbiAgdGhpcy5lbnRpdGllcy5pbnZva2UoVVBEQVRFLCBbdGhpcy5jdHhdLCBCQUxMKVxuICB0aGlzLmVudGl0aWVzLmludm9rZShVUERBVEUsIFt0aGlzLmN0eF0sIFNXSVRDSClcbiAgdGhpcy5lbnRpdGllcy5pbnZva2UoVVBEQVRFLCBbdGhpcy5jdHhdLCBFWElUKVxufVxuXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG5cbiAgLy8gZHJhdyB0aGUgZ3JpZFxuICB0aGlzLmdyaWQuZHJhdyhjdHgpXG5cbiAgLy8gZHJhdyBlYWNoIGVudGl0eVxuICB0aGlzLmVudGl0aWVzLmludm9rZShEUkFXLCBbdGhpcy5jdHhdLCBFWElUKVxuICB0aGlzLmVudGl0aWVzLmludm9rZShEUkFXLCBbdGhpcy5jdHhdLCBTV0lUQ0gpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKERSQVcsIFt0aGlzLmN0eF0sIFJPQk9UKVxuICB0aGlzLmVudGl0aWVzLmludm9rZShEUkFXLCBbdGhpcy5jdHhdLCBCQUxMKVxuXG4gIC8vIGRyYXcgYW55IFVJIGxhc3RcbiAgdGhpcy5idXR0b25NYW5hZ2VyLmRyYXcodGhpcy5jdHgpXG4gIHRoaXMucXVldWVNYW5hZ2VyLmRyYXcodGhpcy5jdHgpXG4gIGlmICh0aGlzLmludGVybWlzc2lvbikge1xuICAgIHRoaXMuaW50ZXJtaXNzaW9uLmRyYXcoY3R4KVxuICB9XG5cbn1cblxucHJvdG8uZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXG59XG5cbnByb3RvLmVuZCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmludGVybWlzc2lvbiA9IG5ldyBJbnRlcm1pc3Npb24oKVxufVxuIiwidmFyIGxldmVsRGVmcyA9IHJlcXVpcmUoJy4vY29uZmlnL2xldmVscycpXG52YXIgTGV2ZWwgPSByZXF1aXJlKCcuL2xldmVsJylcblxudmFyIExldmVsTWFuYWdlciA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubGV2ZWxzID0gbGV2ZWxEZWZzXG5cbiAgdGhpcy5jdXJyZW50ID0gbnVsbFxuICB0aGlzLmN1cnJlbnRJZHggPSAtMVxufVxuXG52YXIgcHJvdG8gPSBMZXZlbE1hbmFnZXIucHJvdG90eXBlXG5cbnByb3RvLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5jdXJyZW50KVxuICAgIHRoaXMuY3VycmVudC51cGRhdGUoKVxufVxuXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGlmICh0aGlzLmN1cnJlbnQpXG4gICAgdGhpcy5jdXJyZW50LmRyYXcoY3R4KVxufVxuXG5wcm90by5sb2FkID0gZnVuY3Rpb24oaWR4KSB7XG4gIHZhciBjb25mID0gdGhpcy5sZXZlbHNbaWR4XVxuICB2YXIgbmV4dCA9IGNvbmYgPyBuZXcgTGV2ZWwoY29uZikgOiBudWxsXG5cbiAgLy8gdW5sb2FkIHRoZSBjdXJyZW50IGxldmVsXG4gIGlmICh0aGlzLmN1cnJlbnQpIHtcbiAgICB0aGlzLmN1cnJlbnQuZGlzcG9zZSgpXG4gICAgdGhpcy5jdXJyZW50ID0gbnVsbFxuICAgIHRoaXMuY3VycmVudElkeCA9IC0xXG4gIH1cblxuICAvLyBzZXQgdGhlIG5leHQgbGV2ZWwgYXMgY3VycmVudFxuICBpZiAobmV4dCkge1xuICAgIHRoaXMuY3VycmVudCA9IG5leHRcbiAgICB0aGlzLmN1cnJlbnRJZHggPSBpZHhcbiAgfVxuXG4gIHJldHVybiBuZXh0XG59XG5cbnByb3RvLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubG9hZCh0aGlzLmN1cnJlbnRJZHggKyAxKVxufVxuXG4iLCJ2YXIgXyA9IDBcbnZhciBCID0gJ0InXG52YXIgUyA9ICdTJ1xudmFyIFIgPSAnUidcbnZhciBFID0gJ0UnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBuYW1lOiAnRmlyc3QgTGV2ZWwnLFxuXG4gIHRpbGVzOiB7XG4gICAgc3JjOiAnaW1hZ2VzL2lzb3RpbGVzLnBuZycsXG4gICAgdzogNjQsXG4gICAgaDogNjQsXG4gICAgb3g6IDQsXG4gICAgb3k6IDE2XG4gIH0sXG5cbiAgZ3JpZDogW1xuICAgIFs2LDYsNiw2LDZdLFxuICAgIFs2LDYsNiw2LDZdLFxuICAgIFs2LDYsNiw2LDZdXG4gIF0sXG5cbiAgZW50aXR5TWFwOiBbXG4gICAgW18sXyxCLF8sX10sXG4gICAgW1IsXyxfLF8sU10sXG4gICAgW18sXyxFLF8sX11cbiAgXVxufVxuIiwidmFyIF8gPSAwXG52YXIgQiA9ICdCJ1xudmFyIFMgPSAnUydcbnZhciBSID0gJ1InXG52YXIgRSA9ICdFJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbmFtZTogJ1NlY29uZCBMZXZlbCcsXG5cbiAgdGlsZXM6IHtcbiAgICBzcmM6ICdpbWFnZXMvaXNvdGlsZXMucG5nJyxcbiAgICB3OiA2NCxcbiAgICBoOiA2NCxcbiAgICBveDogNCxcbiAgICBveTogMTZcbiAgfSxcblxuICBncmlkOiBbXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgW18sXyxfLDYsNl0sXG4gICAgWzYsNixfLDYsNl1cbiAgXSxcblxuICBlbnRpdHlNYXA6IFtcbiAgICBbXyxfLF8sXyxfXSxcbiAgICBbXyxSLF8sQixfXSxcbiAgICBbXyxfLF8sXyxFXSxcbiAgICBbXyxfLFMsXyxfXSxcbiAgICBbXyxfLF8sXyxfXVxuICBdXG59XG4iLCIvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbnZhciBleHRlbmQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3I7XG4gIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG59O1xuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJylcblxudmFyIEV2ZW50cyA9IHt9XG5cbkV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24oLyogU3RyaW5nICovIHRvcGljLCAvKiBBcnJheT8gKi8gYXJncykge1xuICAvLyBzdW1tYXJ5OlxuICAvLyAgICBQdWJsaXNoIHNvbWUgZGF0YSBvbiBhIG5hbWVkIHRvcGljLlxuICAvLyB0b3BpYzogU3RyaW5nXG4gIC8vICAgIFRoZSBjaGFubmVsIHRvIHB1Ymxpc2ggb25cbiAgLy8gYXJnczogQXJyYXk/XG4gIC8vICAgIFRoZSBkYXRhIHRvIHB1Ymxpc2guIEVhY2ggYXJyYXkgaXRlbSBpcyBjb252ZXJ0ZWQgaW50byBhbiBvcmRlcmVkXG4gIC8vICAgIGFyZ3VtZW50cyBvbiB0aGUgc3Vic2NyaWJlZCBmdW5jdGlvbnMuXG4gIC8vXG4gIC8vIGV4YW1wbGU6XG4gIC8vICAgIFB1Ymxpc2ggc3R1ZmYgb24gJy9zb21lL3RvcGljJy4gQW55dGhpbmcgc3Vic2NyaWJlZCB3aWxsIGJlIGNhbGxlZFxuICAvLyAgICB3aXRoIGEgZnVuY3Rpb24gc2lnbmF0dXJlIGxpa2U6IGZ1bmN0aW9uKGEsYixjKSB7IC4uLiB9XG4gIC8vXG4gIC8vICAgIHRyaWdnZXIoXCIvc29tZS90b3BpY1wiLCBbXCJhXCIsXCJiXCIsXCJjXCJdKVxuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuXG5cbiAgdmFyIHN1YnMgPSB0aGlzLl9ldmVudHNbdG9waWNdLFxuICAgIGxlbiA9IHN1YnMgPyBzdWJzLmxlbmd0aCA6IDBcblxuICAvL2NhbiBjaGFuZ2UgbG9vcCBvciByZXZlcnNlIGFycmF5IGlmIHRoZSBvcmRlciBtYXR0ZXJzXG4gIHdoaWxlIChsZW4tLSkge1xuICAgIHN1YnNbbGVuXS5hcHBseShFdmVudHMsIGFyZ3MgfHwgW10pXG4gIH1cbn1cblxuRXZlbnRzLm9uID0gZnVuY3Rpb24oLyogU3RyaW5nICovIHRvcGljLCAvKiBGdW5jdGlvbiAqLyBjYWxsYmFjaykge1xuICAvLyBzdW1tYXJ5OlxuICAvLyAgICBSZWdpc3RlciBhIGNhbGxiYWNrIG9uIGEgbmFtZWQgdG9waWMuXG4gIC8vIHRvcGljOiBTdHJpbmdcbiAgLy8gICAgVGhlIGNoYW5uZWwgdG8gc3Vic2NyaWJlIHRvXG4gIC8vIGNhbGxiYWNrOiBGdW5jdGlvblxuICAvLyAgICBUaGUgaGFuZGxlciBldmVudC4gQW55dGltZSBzb21ldGhpbmcgaXMgdHJpZ2dlcidlZCBvbiBhXG4gIC8vICAgIHN1YnNjcmliZWQgY2hhbm5lbCwgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlXG4gIC8vICAgIHB1Ymxpc2hlZCBhcnJheSBhcyBvcmRlcmVkIGFyZ3VtZW50cy5cbiAgLy9cbiAgLy8gcmV0dXJuczogQXJyYXlcbiAgLy8gICAgQSBoYW5kbGUgd2hpY2ggY2FuIGJlIHVzZWQgdG8gdW5zdWJzY3JpYmUgdGhpcyBwYXJ0aWN1bGFyIHN1YnNjcmlwdGlvbi5cbiAgLy9cbiAgLy8gZXhhbXBsZTpcbiAgLy8gICAgb24oXCIvc29tZS90b3BpY1wiLCBmdW5jdGlvbihhLCBiLCBjKSB7IC8qIGhhbmRsZSBkYXRhICovIH0pXG5cbiAgdGhpcy5fZXZlbnRzIHx8ICh0aGlzLl9ldmVudHMgPSB7fSlcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0b3BpY10pIHtcbiAgICB0aGlzLl9ldmVudHNbdG9waWNdID0gW11cbiAgfVxuICB0aGlzLl9ldmVudHNbdG9waWNdLnB1c2goY2FsbGJhY2spXG4gIHJldHVybiBbdG9waWMsIGNhbGxiYWNrXSAvLyBBcnJheVxufVxuXG5FdmVudHMub2ZmID0gZnVuY3Rpb24oLyogQXJyYXkgb3IgU3RyaW5nICovIGhhbmRsZSkge1xuICAvLyBzdW1tYXJ5OlxuICAvLyAgICBEaXNjb25uZWN0IGEgc3Vic2NyaWJlZCBmdW5jdGlvbiBmb3IgYSB0b3BpYy5cbiAgLy8gaGFuZGxlOiBBcnJheSBvciBTdHJpbmdcbiAgLy8gICAgVGhlIHJldHVybiB2YWx1ZSBmcm9tIGFuIGBvbmAgY2FsbC5cbiAgLy8gZXhhbXBsZTpcbiAgLy8gICAgdmFyIGhhbmRsZSA9IG9uKFwiL3NvbWUvdG9waWNcIiwgZnVuY3Rpb24oKSB7fSlcbiAgLy8gICAgb2ZmKGhhbmRsZSlcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVyblxuXG4gIHZhciBzdWJzID0gdGhpcy5fZXZlbnRzW3R5cGVvZiBoYW5kbGUgPT09ICdzdHJpbmcnID8gaGFuZGxlIDogaGFuZGxlWzBdXVxuICB2YXIgY2FsbGJhY2sgPSB0eXBlb2YgaGFuZGxlID09PSAnc3RyaW5nJyA/IGhhbmRsZVsxXSA6IGZhbHNlXG4gIHZhciBsZW4gPSBzdWJzID8gc3Vicy5sZW5ndGggOiAwXG5cbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgaWYgKHN1YnNbbGVuXSA9PT0gY2FsbGJhY2sgfHwgIWNhbGxiYWNrKSB7XG4gICAgICBzdWJzLnNwbGljZShsZW4sIDEpXG4gICAgfVxuICB9XG59XG5cbkV2ZW50cy5lY2hvID0gZnVuY3Rpb24oLyogU3RyaW5nICovIHRvcGljLCAvKiBPYmplY3QgKi8gZW1pdHRlcikge1xuICBlbWl0dGVyLm9uKHRvcGljLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRyaWdnZXIodG9waWMsIGFyZ3VtZW50cylcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5cbnZhciBwdWJzdWIgPSBtb2R1bGUuZXhwb3J0cyA9IHt9XG5cbnB1YnN1Yi5FdmVudHMgPSBFdmVudHNcbnB1YnN1Yi5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgZXh0ZW5kKG9iaiwgRXZlbnRzKVxufVxucHVic3ViLmV4dGVuZChwdWJzdWIpXG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJy4vbGliL2luaGVyaXRzJylcbnZhciBCdXR0b24gPSByZXF1aXJlKCcuL2J1dHRvbicpXG5cbnZhciBRdWV1ZUJ1dHRvbiA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUXVldWVCdXR0b24oYnV0dG9uLCBwb3MpIHtcbiAgdmFyIGJ0biA9IHtcbiAgICBwb3M6IHBvcyxcbiAgICB3aWR0aDogNDAsXG4gICAgaGVpZ2h0OiA0MCxcbiAgICBzcHJpdGU6IGJ1dHRvbi5zcHJpdGUsXG4gICAgZnJhbWVPZmY6IGJ1dHRvbi5mcmFtZU9mZixcbiAgICBmcmFtZU9uOiBidXR0b24uZnJhbWVPbixcbiAgICBjb21tYW5kOiBidXR0b24uY29tbWFuZFxuICB9XG4gIEJ1dHRvbi5jYWxsKHRoaXMsIGJ0bilcbn1cblxuaW5oZXJpdHMoUXVldWVCdXR0b24sIEJ1dHRvbilcblxuUXVldWVCdXR0b24ucHJvdG90eXBlLnRhcHBlZCA9IGZ1bmN0aW9uKCkge1xuICBwdWJzdWIudHJpZ2dlcigncXVldWVCdXR0b25QcmVzc2VkJywgW3RoaXNdKVxufVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG52YXIgUXVldWVCdXR0b24gPSByZXF1aXJlKCcuL3F1ZXVlQnV0dG9uJylcbnZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpXG5cbnZhciBRdWV1ZU1hbmFnZXIgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIHRoaXMuYnV0dG9ucyA9IFtdXG4gIHB1YnN1Yi5vbignY29tbWFuZEJ1dHRvblByZXNzZWQnLCB0aGlzLmVucXVldWUuYmluZCh0aGlzKSlcbiAgcHVic3ViLm9uKCdxdWV1ZUJ1dHRvblByZXNzZWQnLCB0aGlzLnJlbW92ZS5iaW5kKHRoaXMpKVxufVxuXG5RdWV1ZU1hbmFnZXIucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbihidG4pIHtcbiAgaWYgKGJ0bi5jb21tYW5kID09PSAnc3RhcnQnKSByZXR1cm4gcHVic3ViLnRyaWdnZXIoJ3JvYm90U3RhcnQnKVxuICB2YXIgeCA9IHRoaXMuYnV0dG9ucy5sZW5ndGggKiA0MiArIDEwXG4gIHZhciB5ID0gdGhpcy5nYW1lLmhlaWdodCAtIDUwXG4gIHZhciBidXR0b24gPSBuZXcgUXVldWVCdXR0b24oYnRuLCB7eDp4LHk6eX0pXG4gIHRoaXMuYnV0dG9ucy5wdXNoKGJ1dHRvbilcbn1cblxuUXVldWVNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihidG4pIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5idXR0b25zLmluZGV4T2YoYnRuKVxuICB0aGlzLmJ1dHRvbnMuc3BsaWNlKGluZGV4LCAxKVxuICB0aGlzLnJlY2FsY3VsYXRlUG9zWChpbmRleClcbiAgcmV0dXJuIGJ0blxufVxuXG5RdWV1ZU1hbmFnZXIucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYnRuID0gdGhpcy5idXR0b25zLnNoaWZ0KClcbiAgdGhpcy5yZWNhbGN1bGF0ZVBvc1goKVxuICByZXR1cm4gYnRuLmNvbW1hbmRcbn1cblxuUXVldWVNYW5hZ2VyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmJ1dHRvbnMgPSBbXVxufVxuXG5RdWV1ZU1hbmFnZXIucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmJ1dHRvbnMubGVuZ3RoXG59XG5cblF1ZXVlTWFuYWdlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGUoKVxuICB9XG59XG5cblF1ZXVlTWFuYWdlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrPTEpIHtcbiAgICB0aGlzLmJ1dHRvbnNbaV0uZHJhdyhjdHgpXG4gIH1cbn1cblxuUXVldWVNYW5hZ2VyLnByb3RvdHlwZS5yZWNhbGN1bGF0ZVBvc1ggPSBmdW5jdGlvbihpZHgpIHtcbiAgZm9yICh2YXIgaSA9IGlkeCB8fCAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS5wb3MueCA9IGkgKiA0MiArIDEwXG4gIH1cbn1cbiIsInZhciB2ZWN0b3IyID0gcmVxdWlyZSgnLi92ZWN0b3IyJylcbnZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIFRpbWVyID0gcmVxdWlyZSgnLi90aW1lcicpXG5cbnZhciBCYWxsID0gcmVxdWlyZSgnLi9iYWxsJylcblxudmFyIFJvYm90ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBSb2JvdChwb3MpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLnBvcyA9IHBvc1xuICB0aGlzLmRpciA9IHsgeDoxLCB5OjAgfVxuICB0aGlzLmZyZXEgPSAwLjRcbiAgdGhpcy5ibG9ja2VkID0gZmFsc2VcbiAgdGhpcy5zdG9wcGVkID0gdHJ1ZVxuXG4gIHRoaXMudGltZXIgPSBuZXcgVGltZXIoTnVtYmVyLk1BWF9WQUxVRSlcbiAgdGhpcy50aW1lci5wYXVzZSgpXG5cbiAgLy8gcHVic3ViLm9uKCdjb21tYW5kQnV0dG9uUHJlc3NlZCcsIHRoaXMuZW5xdWV1ZS5iaW5kKHRoaXMpKVxuICBwdWJzdWIub24oJ3JvYm90U3RhcnQnLCB0aGlzLnN0YXJ0LmJpbmQodGhpcykpXG59XG5cbnZhciBwcm90byA9IFJvYm90LnByb3RvdHlwZVxuXG5wcm90by5tb3ZlID0gZnVuY3Rpb24obmV3UG9zKSB7XG4gIHZhciBncmlkID0gdGhpcy5nYW1lLmxldmVsTWFuYWdlci5jdXJyZW50LmdyaWQuZ3JpZFxuICBpZiAoIWdyaWRbbmV3UG9zLnldIHx8ICFncmlkW25ld1Bvcy55XVtuZXdQb3MueF0pIHtcbiAgICB0aGlzLmJsb2NrKClcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnBvcyA9IG5ld1Bvc1xuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbnByb3RvLm1vdmVGb3J3YXJkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuZXdQb3MgPSB2ZWN0b3IyLmFkZCh0aGlzLnBvcywgdGhpcy5kaXIpXG4gIHJldHVybiB0aGlzLm1vdmUobmV3UG9zKVxufVxuXG5wcm90by5tb3ZlQmFja3dhcmQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5ld1BvcyA9IHZlY3RvcjIuc3VidHJhY3QodGhpcy5wb3MsIHRoaXMuZGlyKVxuICByZXR1cm4gdGhpcy5tb3ZlKG5ld1Bvcylcbn1cblxucHJvdG8udHVybkxlZnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHggPSB0aGlzLmRpci54XG4gIHZhciB5ID0gdGhpcy5kaXIueVxuICB0aGlzLmRpci54ID0geVxuICB0aGlzLmRpci55ID0gLXhcbiAgcmV0dXJuIHRoaXNcbn1cblxucHJvdG8udHVyblJpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciB4ID0gdGhpcy5kaXIueFxuICB2YXIgeSA9IHRoaXMuZGlyLnlcbiAgdGhpcy5kaXIueCA9IC15XG4gIHRoaXMuZGlyLnkgPSB4XG4gIHJldHVybiB0aGlzXG59XG5cbnByb3RvLnR1cm5Bcm91bmQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5kaXIueCAqPSAtMVxuICB0aGlzLmRpci55ICo9IC0xXG4gIHJldHVybiB0aGlzXG59XG5cbnByb3RvLnBpY2t1cCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbGV2ZWwgPSB0aGlzLmdhbWUubGV2ZWxNYW5hZ2VyLmN1cnJlbnRcbiAgdmFyIHRhcmdldCA9IGxldmVsLmVudGl0eUF0KHZlY3RvcjIuYWRkKHRoaXMucG9zLCB0aGlzLmRpciksIEJhbGwubmFtZSlcbiAgaWYgKHRhcmdldCAmJiB0YXJnZXQucGlja2VkVXAoKSkge1xuICAgIHRoaXMuYmFsbCA9IHRhcmdldFxuICB9IGVsc2Uge1xuICAgIHRoaXMuYmxvY2soKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbnByb3RvLnJlbGVhc2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYmFsbCAmJiB0aGlzLmJhbGwuZHJvcHBlZCgpKSB7XG4gICAgdGhpcy5iYWxsID0gbnVsbFxuICB9IGVsc2Uge1xuICAgIHRoaXMuYmxvY2soKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbnByb3RvLm1vdmVCYWxsID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmJhbGwpIHtcbiAgICB0aGlzLmJhbGwucG9zID0gdmVjdG9yMi5hZGQodGhpcy5wb3MsIHRoaXMuZGlyKVxuICB9XG59XG5cbnByb3RvLmJsb2NrID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuYmxvY2tlZCA9IHRydWVcbn1cblxucHJvdG8uc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50aW1lci5zZXQoMClcbiAgdGhpcy50aW1lci51bnBhdXNlKClcbn1cblxucHJvdG8uc3RvcCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnRpbWVyLnBhdXNlKClcbn1cblxucHJvdG8udXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBxdWV1ZSA9IHRoaXMuZ2FtZS5sZXZlbE1hbmFnZXIuY3VycmVudC5xdWV1ZU1hbmFnZXJcbiAgaWYgKHF1ZXVlLmNvdW50KCkgPT0gMClcbiAgICByZXR1cm4gdGhpcy5zdG9wKClcblxuICBpZiAodGhpcy5ibG9ja2VkKSB7XG4gICAgcXVldWUucmVzZXQoKVxuICAgIHJldHVybiB0aGlzLnN0b3AoKVxuICB9XG5cbiAgaWYgKHRoaXMudGltZXIuZGVsdGEoKSA+IDApIHtcbiAgICB2YXIgYWN0aW9uID0gcXVldWUucG9wKClcbiAgICB0aGlzW2FjdGlvbl0oKVxuICAgIHRoaXMubW92ZUJhbGwoKVxuICAgIHRoaXMudGltZXIuc2V0KHRoaXMuZnJlcSlcbiAgfVxufVxuXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuXG4gIGN0eC5pc28oZnVuY3Rpb24oKSB7XG5cbiAgICBjdHguc2F2ZSgpXG4gICAgY3R4LnRyYW5zbGF0ZShcbiAgICAgIHRoaXMucG9zLnggKiBzY2FsZSArIHNjYWxlIC8gMixcbiAgICAgIHRoaXMucG9zLnkgKiBzY2FsZSArIHNjYWxlIC8gMlxuICAgIClcbiAgICBjdHgucm90YXRlKE1hdGguYXRhbjIodGhpcy5kaXIueSwgdGhpcy5kaXIueCkpXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuYmxvY2tlZCA/ICcjZmYwMDAwJyA6ICcjNDQ4ODQ0J1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LnJlY3QoXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIDAuNixcbiAgICAgIHNjYWxlICogMC42XG4gICAgKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcblxuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5tb3ZlVG8oMCwgMClcbiAgICBjdHgubGluZVRvKHNjYWxlICogKHRoaXMuYmFsbD8xOjAuMyksIDApXG4gICAgY3R4LnN0cm9rZSgpXG4gICAgY3R4LnJlc3RvcmUoKVxuXG4gIH0uYmluZCh0aGlzKSlcbiAgcmV0dXJuIHRoaXNcbn1cbiIsIndpbmRvdy5zdGF0cyA9IG5ldyBTdGF0cygpO1xuc3RhdHMuc2V0TW9kZSgxKTsgLy8gMDogZnBzLCAxOiBtc1xuc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG5zdGF0cy5kb21FbGVtZW50LnN0eWxlLnJpZ2h0ID0gJzBweCc7XG5zdGF0cy5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggc3RhdHMuZG9tRWxlbWVudCApO1xuXG52YXIgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpXG5cbnZhciBnYW1lID0gd2luZG93LmdhbWUgPSBuZXcgR2FtZSh7XG4gIHNjYWxlOiA2NCxcbiAgd2lkdGg6IDEwMjQsXG4gIGhlaWdodDogNzY4LFxuICBncmlkU2l6ZTogMTAsXG4gIHRvcE1hcmdpbjogMTUwLFxuICBjYW52YXM6ICdnYW1lJ1xufSlcblxuZ2FtZS5sb2FkTGV2ZWwoMClcblxuZ2FtZS5zdGFydCgpXG5cbi8vIGdhbWUubGV2ZWwudGlsZXMub25sb2FkID0gZnVuY3Rpb24oKSB7XG4vLyAgIGdhbWUuZHJhdygpXG4vLyB9XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBUZXh0dXJlID0gcmVxdWlyZSgnLi90ZXh0dXJlJylcblxudmFyIFNwcml0ZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aFxuICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0XG4gIHRoaXMuZnJhbWVzID0gW11cbiAgdGhpcy50ZXh0dXJlID0gbmV3IFRleHR1cmUob3B0aW9ucy50ZXh0dXJlKVxuICB0aGlzLnRleHR1cmUub24oJ2xvYWQnLCB0aGlzLmNhbGN1bGF0ZUZyYW1lcy5iaW5kKHRoaXMpKVxufVxuXG52YXIgYXBpID0gU3ByaXRlLnByb3RvdHlwZVxucHVic3ViLmV4dGVuZChhcGkpXG5cbmFwaS5jYWxjdWxhdGVGcmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJ0xPQURFRCBTUFJJVEUnLCB0aGlzLnRleHR1cmUuaW1nLnNyYylcbiAgdmFyIHggPSAodGhpcy50ZXh0dXJlLndpZHRoIC8gdGhpcy53aWR0aCkgfCAwXG4gIHZhciB5ID0gKHRoaXMudGV4dHVyZS5oZWlnaHQgLyB0aGlzLmhlaWdodCkgfCAwXG5cbiAgZm9yICh2YXIgaXkgPSAwOyBpeSA8IHk7IGl5KyspIHtcbiAgICBmb3IgKHZhciBpeCA9IDA7IGl4IDwgeDsgaXgrKykge1xuICAgICAgdGhpcy5mcmFtZXMucHVzaCh7XG4gICAgICAgIHg6IGl4ICogdGhpcy53aWR0aCxcbiAgICAgICAgeTogaXkgKiB0aGlzLmhlaWdodCxcbiAgICAgICAgeDI6IGl4ICogdGhpcy53aWR0aCArIHRoaXMud2lkdGgsXG4gICAgICAgIHkyOiBpeSAqIHRoaXMuaGVpZ2h0ICsgdGhpcy5oZWlnaHQsXG4gICAgICAgIHc6IHRoaXMud2lkdGgsXG4gICAgICAgIGg6IHRoaXMuaGVpZ2h0XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICB0aGlzLnRyaWdnZXIoJ2xvYWQnKVxufVxuXG5hcGkuZHJhdyA9IGZ1bmN0aW9uKGN0eCwgZnJhbWUsIHJlY3QpIHtcbiAgdmFyIGYgPSB0aGlzLmZyYW1lc1tmcmFtZV1cbiAgaWYgKCFmKSByZXR1cm5cbiAgY3R4LmRyYXdJbWFnZSh0aGlzLnRleHR1cmUuaW1nLFxuICAgIGYueCwgZi55LCBmLncsIGYuaCxcbiAgICByZWN0LngsIHJlY3QueSwgcmVjdC53LCByZWN0LmgpXG59XG5cblxuXG4iLCJcbnZhciBTd2l0Y2ggPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIFN3aXRjaChwb3MpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLnBvcyA9IHBvc1xuICB0aGlzLnN0YXRlID0gU3dpdGNoLlNUQVRFLk9GRlxufVxuXG5Td2l0Y2gucHJvdG90eXBlLnR1cm5PbiA9IGZ1bmN0aW9uKGVudCkge1xuICBpZiAodGhpcy5zdGF0ZSA9PT0gU3dpdGNoLlNUQVRFLk9GRikge1xuICAgIHRoaXMuc3RhdGUgPSBTd2l0Y2guU1RBVEUuT05cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5Td2l0Y2gucHJvdG90eXBlLnR1cm5PZmYgPSBmdW5jdGlvbihlbnQpIHtcbiAgaWYgKHRoaXMuc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PTikge1xuICAgIHRoaXMuc3RhdGUgPSBTd2l0Y2guU1RBVEUuT0ZGXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuU3dpdGNoLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcbn1cblxuU3dpdGNoLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBkMnIgPSBNYXRoLmQyclxuICB2YXIgc2NhbGUgPSB0aGlzLmdhbWUuc2NhbGVcbiAgY3R4LmlzbyhmdW5jdGlvbigpIHtcbiAgICBjdHgudHJhbnNsYXRlKFxuICAgICAgdGhpcy5wb3MueCAqIHNjYWxlICsgc2NhbGUgLyAyLFxuICAgICAgdGhpcy5wb3MueSAqIHNjYWxlICsgc2NhbGUgLyAyXG4gICAgKVxuXG4gICAgdmFyIHJhZGl1cyA9IHNjYWxlKjAuM1xuXG4gICAgLy8gZmlsbCB0aGUgc3F1YXJlXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PTiA/ICcjMDBGRjAwJyA6ICcjRkYwMDAwJ1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5yZWN0KC1zY2FsZS8yLCAtc2NhbGUvMiwgc2NhbGUsIHNjYWxlKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcblxuICAgIC8vIGRyYXcgdGhlIHJlY2lldmVyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5hcmMoMCwgMCwgcmFkaXVzLCBkMnIoMCksIGQycigzNjApKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5Td2l0Y2guU1RBVEUgPSB7XG4gIE9OIDogMSxcbiAgT0ZGIDogMFxufVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG5cbnZhciBjYWNoZSA9IHt9XG5cbnZhciBUZXh0dXJlID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzcmMpIHtcbiAgaWYgKGNhY2hlW3NyY10pIHJldHVybiBjYWNoZVtzcmNdXG5cbiAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlXG4gIHRoaXMubG9hZChzcmMpXG4gIGNhY2hlW3NyY10gPSB0aGlzXG59XG5cbnZhciBhcGkgPSBUZXh0dXJlLnByb3RvdHlwZVxucHVic3ViLmV4dGVuZChhcGkpXG5cbmFwaS5sb2FkID0gZnVuY3Rpb24oc3JjKSB7XG4gIHZhciBpbWcgPSB0aGlzLmltZyA9IG5ldyBJbWFnZSgpXG4gIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZVxuICAgIHRoaXMud2lkdGggPSBpbWcud2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGltZy5oZWlnaHRcbiAgICB0aGlzLnRyaWdnZXIoJ2xvYWQnKVxuICB9LmJpbmQodGhpcylcbiAgaW1nLnNyYyA9IHNyY1xufVxuXG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBUZXh0dXJlID0gcmVxdWlyZSgnLi90ZXh0dXJlJylcblxudmFyIFRpbGVTZXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNyYywgdywgaCwgb3gsIG95KSB7XG4gIHRoaXMud2lkdGggPSB3XG4gIHRoaXMuaGVpZ2h0ID0gaFxuICB0aGlzLm9mZnNldFggPSBveFxuICB0aGlzLm9mZnNldFkgPSBveVxuICB0aGlzLnNyYyA9IHNyY1xuXG4gIHRoaXMudGV4dHVyZSA9IG5ldyBUZXh0dXJlKHNyYylcbiAgdGhpcy5lY2hvKCdsb2FkJywgdGhpcy50ZXh0dXJlKVxufVxuXG5wdWJzdWIuZXh0ZW5kKFRpbGVTZXQucHJvdG90eXBlKVxuXG52YXIgcHJvdG8gPSBUaWxlU2V0LnByb3RvdHlwZVxuXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oY3R4LCB0LCB4LCB5LCB3KSB7XG4gIHZhciBzeCA9IHQgKiB0aGlzLndpZHRoXG4gIHZhciBzeSA9IDBcbiAgdmFyIHN3ID0gdGhpcy53aWR0aFxuICB2YXIgc2ggPSB0aGlzLmhlaWdodFxuXG4gIC8vIHRoZSBzY2FsZXIgaXMgdGhlIHdpZHRoIG9mIHRoZSBkZXN0aW5hdGlvbiB0aWxlIGRpdmlkZWRcbiAgLy8gYnkgdGhlIFwidHJ1ZVwiIHdpZHRoIG9mIHRoZSB0aWxlIGluIHRoZSBpbWFnZVxuICB2YXIgc2NhbGVyID0gdyAvICh0aGlzLndpZHRoIC0gdGhpcy5vZmZzZXRYKjIpXG5cbiAgdmFyIGR3ID0gdGhpcy53aWR0aCAqIHNjYWxlclxuICB2YXIgZGggPSB0aGlzLmhlaWdodCAqIHNjYWxlclxuICB2YXIgZHggPSB4IC0gZHcqMC41XG4gIHZhciBkeSA9IHkgLSB0aGlzLm9mZnNldFkgKiBzY2FsZXJcblxuICBjdHguZHJhd0ltYWdlKHRoaXMudGV4dHVyZS5pbWcsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaClcbn1cblxuIiwidmFyIFRpbWVyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWMpIHtcbiAgdGhpcy5iYXNlID0gVGltZXIudGltZVxuICB0aGlzLmxhc3QgPSBUaW1lci50aW1lXG5cbiAgdGhpcy50YXJnZXQgPSBzZWMgfHwgMFxufVxuXG52YXIgcHJvdG8gPSBUaW1lci5wcm90b3R5cGVcblxucHJvdG8udGFyZ2V0ID0gMFxucHJvdG8uYmFzZSA9IDBcbnByb3RvLmxhc3QgPSAwXG5wcm90by5wYXVzZWRBdCA9IDBcblxucHJvdG8uc2V0ID0gZnVuY3Rpb24oc2VjKSB7XG4gIHRoaXMudGFyZ2V0ID0gc2VjIHx8IDBcbiAgdGhpcy5iYXNlID0gVGltZXIudGltZVxuICB0aGlzLnBhdXNlZEF0ID0gMFxufVxuXG5wcm90by5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmJhc2UgPSBUaW1lci50aW1lXG4gIHRoaXMucGF1c2VkQXQgPSAwXG59XG5cbnByb3RvLnRpY2sgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlbHRhID0gVGltZXIudGltZSAtIHRoaXMubGFzdFxuICB0aGlzLmxhc3QgPSBUaW1lci50aW1lXG4gIHJldHVybiB0aGlzLnBhdXNlZEF0ID8gMCA6IGRlbHRhXG59XG5cbnByb3RvLmRlbHRhID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAodGhpcy5wYXVzZWRBdCB8fCBUaW1lci50aW1lKSAtIHRoaXMuYmFzZSAtIHRoaXMudGFyZ2V0XG59XG5cbnByb3RvLnBhdXNlID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5wYXVzZWRBdClcbiAgICB0aGlzLnBhdXNlZEF0ID0gVGltZXIudGltZVxufVxuXG5wcm90by51bnBhdXNlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnBhdXNlZEF0KSB7XG4gICAgdGhpcy5iYXNlICs9IFRpbWVyLnRpbWUgLSB0aGlzLnBhdXNlZEF0XG4gICAgdGhpcy5wYXVzZWRBdCA9IDBcbiAgfVxufVxuXG5UaW1lci5fbGFzdCA9IDBcblRpbWVyLnRpbWUgPSBOdW1iZXIuTUlOX1ZBTFVFXG5UaW1lci50aW1lU2NhbGUgPSAxXG5UaW1lci5tYXhTdGVwID0gMC4wNVxuXG5UaW1lci5zdGVwID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjdXJyZW50ID0gRGF0ZS5ub3coKVxuICB2YXIgZGVsdGEgPSAoY3VycmVudCAtIFRpbWVyLl9sYXN0KSAvIDEwMDBcbiAgVGltZXIudGltZSArPSBNYXRoLm1pbihkZWx0YSwgVGltZXIubWF4U3RlcCkgKiBUaW1lci50aW1lU2NhbGVcbiAgVGltZXIuX2xhc3QgPSBjdXJyZW50XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBlcXVhbDogZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueVxuICB9LFxuXG4gIGFkZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApXG4gICAgdmFyIHYgPSB7IHg6MCwgeTowIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHYueCArPSBhcmdzW2ldLnhcbiAgICAgIHYueSArPSBhcmdzW2ldLnlcbiAgICB9XG4gICAgcmV0dXJuIHZcbiAgfSxcblxuICBzdWJ0cmFjdDogZnVuY3Rpb24odikge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgIHYgPSB7IHg6di54LCB5OnYueSB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2LnggLT0gYXJnc1tpXS54XG4gICAgICB2LnkgLT0gYXJnc1tpXS55XG4gICAgfVxuICAgIHJldHVybiB2XG4gIH1cblxufVxuIl19
