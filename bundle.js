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

var EntityManager = module.exports = function() {
  this.entities = []
  this.byType = {}
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

},{"./game":8,"./lib/pubsub":18,"./robot":21,"./switch":24}],8:[function(require,module,exports){
var vector2 = require('./vector2')
var Input = require('./input')
var Timer = require('./timer')
var ButtonManager = require('./buttonManager')
var QueueManager = require('./queueManager')
var LevelManager = require('./levelManager')

var EntityManager = require('./entityManager')
var Ball = require('./ball')
var Switch = require('./switch')
var Robot = require('./robot')
var Exit = require('./exit')

// var enthash = {
//   B: Ball,
//   S: Switch,
//   R: Robot,
//   E: Exit
// }

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
proto.entityAt = function(pos, type) {
  return this.entities.atPos(pos, type)
}

proto.entitiesOfType = function(type) {
  return this.entities.ofType(type)
}

// // load the entities from the level
// proto.loadEntities = function(level) {
//   var ents = this.entities = new EntityManager()
//   var map = level.entityMap
//   for (var y = 0; y < map.length; y+=1) {
//     for (var x = 0; x < map[y].length; x+=1) {
//       var Ent = enthash[map[y][x]]
//       if (Ent) {
//         // create the entity
//         var ent = new Ent({x:x,y:y})
//         // check to see if it's the robot
//         if (ent instanceof Robot) this.robot = ent
//         // add it to the entity collection
//         ents.add(Ent.name, ent)
//       }
//     }
//   }
// }

var theta = d2r(45)
var csTheta = Math.cos(theta)
var snTheta = Math.sin(theta)
var thetaInv = d2r(315)
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
  pos.y /= 0.5
  // rotate
  var y = pos.y
  var x = pos.x
  pos.x = x * csThetaInv - y * snThetaInv
  pos.y = x * snThetaInv + y * csThetaInv
  return pos
}

// setup canvase elements to the correct size
proto.initCanvas = function(id, width, height) {
  var canvas = document.getElementById(id)
  canvas.width = width
  canvas.height = height
  return canvas.getContext('2d')
}

// transform the context into isometric
proto.isoCtx = function(ctx, fn) {
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

proto.d2r = d2r

proto.r2d = r2d

},{"./ball":1,"./buttonManager":3,"./entityManager":6,"./exit":7,"./input":10,"./levelManager":13,"./queueManager":20,"./robot":21,"./switch":24,"./timer":27,"./vector2":28}],9:[function(require,module,exports){
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

  this.grid = new Grid(conf.grid)
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

  // draw the tiles
  this.tiles.draw(ctx)

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

},{"./buttonManager":3,"./game":8,"./grid":9,"./intermission":11,"./lib/pubsub":18,"./queueManager":20}],13:[function(require,module,exports){
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
  this.queue = this.game.queueManager
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
  var grid = this.game.levelManager.current.grid
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
  var target = this.game.entityAt(vector2.add(this.pos, this.dir), Ball.name)
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
  if (this.queue.count() == 0)
    return this.stop()

  if (this.blocked) {
    this.queue.reset()
    return this.stop()
  }

  if (this.timer.delta() > 0) {
    var action = this.queue.pop()
    this[action]()
    this.moveBall()
    this.timer.set(this.freq)
  }
}

proto.draw = function(ctx) {
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2JhbGwuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2J1dHRvbi5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvYnV0dG9uTWFuYWdlci5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvY29uZmlnL2J1dHRvbnMuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2NvbmZpZy9sZXZlbHMuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2VudGl0eU1hbmFnZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2V4aXQuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2dhbWUuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2dyaWQuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2lucHV0LmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9pbnRlcm1pc3Npb24uanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2xldmVsLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9sZXZlbE1hbmFnZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL2xldmVscy9maXJzdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGV2ZWxzL3NlY29uZC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2V4dGVuZC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvbGliL2luaGVyaXRzLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9saWIvcHVic3ViLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9xdWV1ZUJ1dHRvbi5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvcXVldWVNYW5hZ2VyLmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9yb2JvdC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvc2NyaXB0LmpzIiwiL1VzZXJzL21pa2VmcmV5L1Byb2plY3RzL3JvYm90cy9qcy9zcHJpdGUuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL3N3aXRjaC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGV4dHVyZS5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGlsZXNldC5qcyIsIi9Vc2Vycy9taWtlZnJleS9Qcm9qZWN0cy9yb2JvdHMvanMvdGltZXIuanMiLCIvVXNlcnMvbWlrZWZyZXkvUHJvamVjdHMvcm9ib3RzL2pzL3ZlY3RvcjIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFN3aXRjaCA9IHJlcXVpcmUoJy4vc3dpdGNoJylcblxudmFyIEJhbGwgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEJhbGwocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3Ncbn1cblxuQmFsbC5wcm90b3R5cGUuZHJvcHBlZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGFyZ2V0ID0gdGhpcy5nYW1lLmVudGl0eUF0KHRoaXMucG9zLCBTd2l0Y2gubmFtZSlcbiAgaWYgKHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQudHVybk9uKHRoaXMpXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuQmFsbC5wcm90b3R5cGUucGlja2VkVXAgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRhcmdldCA9IHRoaXMuZ2FtZS5lbnRpdHlBdCh0aGlzLnBvcywgU3dpdGNoLm5hbWUpXG4gIGlmICh0YXJnZXQpIHtcbiAgICByZXR1cm4gdGFyZ2V0LnR1cm5PZmYodGhpcylcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5CYWxsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcblxufVxuXG5CYWxsLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBkMnIgPSB0aGlzLmdhbWUuZDJyXG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICB0aGlzLmdhbWUuaXNvQ3R4KGN0eCwgZnVuY3Rpb24oKSB7XG4gICAgY3R4LnRyYW5zbGF0ZShcbiAgICAgIHRoaXMucG9zLnggKiBzY2FsZSArIHNjYWxlIC8gMixcbiAgICAgIHRoaXMucG9zLnkgKiBzY2FsZSArIHNjYWxlIC8gMlxuICAgIClcblxuICAgIHZhciByYWRpdXMgPSBzY2FsZSowLjNcblxuICAgIGN0eC5maWxsU3R5bGUgPSAnIzc3NzdGRidcbiAgICBjdHguYmVnaW5QYXRoKClcbiAgICBjdHguYXJjKDAsIDAsIHJhZGl1cywgZDJyKDApLCBkMnIoMzYwKSlcbiAgICBjdHguZmlsbCgpXG4gICAgY3R4LnN0cm9rZSgpXG4gIH0uYmluZCh0aGlzKSlcbn1cbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxuXG52YXIgQnV0dG9uID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBCdXR0b24oYnRuKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgLy8gY29weSBvdmVyIHRoZSBidG4gcHJvcGVydGllc1xuICBmb3IgKHZhciBrIGluIGJ0bikgaWYgKGJ0bi5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgIHRoaXNba10gPSBidG5ba11cbiAgfVxuICB0aGlzLnN0YXRlID0gQnV0dG9uLlNUQVRFLk5PUk1BTFxufVxuXG5CdXR0b24ucHJvdG90eXBlLnRhcHBlZCA9IGZ1bmN0aW9uKCkge1xuICBwdWJzdWIudHJpZ2dlcignY29tbWFuZEJ1dHRvblByZXNzZWQnLCBbdGhpc10pXG59XG5cbkJ1dHRvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RhdGUgPSBCdXR0b24uU1RBVEUuTk9STUFMXG4gIHZhciBzdGFydCA9IHRoaXMuZ2FtZS5pbnB1dC5zdGFydFxuICB2YXIgY3VycmVudCA9IHRoaXMuZ2FtZS5pbnB1dC5jdXJyZW50XG4gIHZhciBwcmV2aW91cyA9IHRoaXMuZ2FtZS5pbnB1dC5wcmV2aW91c1xuXG4gIGlmIChjdXJyZW50KSB7XG4gICAgaWYgKHRoaXMuY29udGFpbnMoY3VycmVudCkgJiYgdGhpcy5jb250YWlucyhzdGFydCkpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBCdXR0b24uU1RBVEUuRE9XTlxuICAgIH1cbiAgfVxuICBlbHNlIGlmIChwcmV2aW91cyAmJiB0aGlzLmNvbnRhaW5zKHByZXZpb3VzLmVuZCkgJiYgdGhpcy5jb250YWlucyhwcmV2aW91cy5zdGFydCkpIHtcbiAgICB0aGlzLnRhcHBlZCgpXG4gICAgdGhpcy5nYW1lLmlucHV0LnByZXZpb3VzID0gbnVsbFxuICB9XG59XG5cbkJ1dHRvbi5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICBjdHguc2F2ZSgpXG4gIGN0eC50cmFuc2xhdGUodGhpcy5wb3MueCwgdGhpcy5wb3MueSlcblxuICB2YXIgcmVjdCA9IHsgeDowLCB5OjAsIHc6dGhpcy53aWR0aCwgaDp0aGlzLmhlaWdodCB9XG4gIHZhciBmcmFtZSA9IHRoaXMuc3RhdGUgPT0gQnV0dG9uLlNUQVRFLk5PUk1BTCA/IHRoaXMuZnJhbWVPZmYgOiB0aGlzLmZyYW1lT25cbiAgdGhpcy5zcHJpdGUuZHJhdyhjdHgsIGZyYW1lLCByZWN0KVxuXG4gIGN0eC5yZXN0b3JlKClcbn1cblxuQnV0dG9uLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gIHJldHVybiAhKFxuICAgIHRoaXMucG9zLnggPiBwb2ludC54IHx8XG4gICAgdGhpcy5wb3MueCArIHRoaXMud2lkdGggPCBwb2ludC54IHx8XG4gICAgdGhpcy5wb3MueSA+IHBvaW50LnkgfHxcbiAgICB0aGlzLnBvcy55ICsgdGhpcy5oZWlnaHQgPCBwb2ludC55XG4gIClcbn1cblxuQnV0dG9uLlNUQVRFID0ge1xuICBOT1JNQUw6ICdub3JtYWwnLFxuICBET1dOOiAnZG93bidcbn1cbiIsInZhciBidXR0b25EZWZzID0gcmVxdWlyZSgnLi9jb25maWcvYnV0dG9ucycpXG52YXIgQnV0dG9uID0gcmVxdWlyZSgnLi9idXR0b24nKVxudmFyIFNwcml0ZSA9IHJlcXVpcmUoJy4vc3ByaXRlJylcblxudmFyIEJ1dHRvbk1hbmFnZXIgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwcml0ZXMgPSB7fVxuICBmb3IgKHZhciBrZXkgaW4gYnV0dG9uRGVmcy5zcHJpdGVzKSB7XG4gICAgdmFyIHNwciA9IGJ1dHRvbkRlZnMuc3ByaXRlc1trZXldXG4gICAgdmFyIHNwcml0ZSA9IG5ldyBTcHJpdGUoc3ByKVxuICAgIHRoaXMuc3ByaXRlc1trZXldID0gc3ByaXRlXG4gIH1cblxuICB0aGlzLmJ1dHRvbnMgPSBbXVxuICBmb3IgKHZhciBrZXkgaW4gYnV0dG9uRGVmcy5idXR0b25zKSB7XG4gICAgdmFyIGJ0biA9IGJ1dHRvbkRlZnMuYnV0dG9uc1trZXldXG4gICAgYnRuLnNwcml0ZSA9IHRoaXMuc3ByaXRlc1tidG4uc3ByaXRlXVxuICAgIHZhciBidXR0b24gPSBuZXcgQnV0dG9uKGJ0bilcbiAgICB0aGlzLmJ1dHRvbnMucHVzaChidXR0b24pXG4gIH1cbn1cblxuQnV0dG9uTWFuYWdlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGUoKVxuICB9XG59XG5cbkJ1dHRvbk1hbmFnZXIucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1dHRvbnMubGVuZ3RoOyBpKz0xKSB7XG4gICAgdGhpcy5idXR0b25zW2ldLmRyYXcoY3R4KVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBzcHJpdGVzOiB7XG4gICAgYnV0dG9uczoge1xuICAgICAgdGV4dHVyZTogJ2ltYWdlcy9idXR0b25zLnBuZycsXG4gICAgICB3aWR0aDogODAsXG4gICAgICBoZWlnaHQ6IDgwXG4gICAgfVxuICB9LFxuXG4gIGJ1dHRvbnM6IHtcblxuICAgIGZvcndhcmQ6IHtcbiAgICAgIHBvczogeyB4OjAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjAsXG4gICAgICBmcmFtZU9uOjEsXG4gICAgICBjb21tYW5kOiAnbW92ZUZvcndhcmQnXG4gICAgfSxcblxuICAgIGJhY2t3YXJkOiB7XG4gICAgICBwb3M6IHsgeDo4MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6MixcbiAgICAgIGZyYW1lT246MyxcbiAgICAgIGNvbW1hbmQ6ICdtb3ZlQmFja3dhcmQnXG4gICAgfSxcblxuICAgIGxlZnQ6IHtcbiAgICAgIHBvczogeyB4OjE3MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6NCxcbiAgICAgIGZyYW1lT246NSxcbiAgICAgIGNvbW1hbmQ6ICd0dXJuTGVmdCdcbiAgICB9LFxuXG4gICAgcmlnaHQ6IHtcbiAgICAgIHBvczogeyB4OjI1MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6NixcbiAgICAgIGZyYW1lT246NyxcbiAgICAgIGNvbW1hbmQ6ICd0dXJuUmlnaHQnXG4gICAgfSxcblxuICAgIHBpY2t1cDoge1xuICAgICAgcG9zOiB7IHg6MzQwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjo4LFxuICAgICAgZnJhbWVPbjo5LFxuICAgICAgY29tbWFuZDogJ3BpY2t1cCdcbiAgICB9LFxuXG4gICAgcmVsZWFzZToge1xuICAgICAgcG9zOiB7IHg6NDIwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjgwLFxuICAgICAgaGVpZ2h0OjgwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjoxMCxcbiAgICAgIGZyYW1lT246MTEsXG4gICAgICBjb21tYW5kOiAncmVsZWFzZSdcbiAgICB9LFxuXG4gICAgc3RhcnQ6IHtcbiAgICAgIHBvczogeyB4OjU0MCwgeTowIH0sXG4gICAgICB3aWR0aDo4MCxcbiAgICAgIGhlaWdodDo4MCxcbiAgICAgIHNwcml0ZTogJ2J1dHRvbnMnLFxuICAgICAgZnJhbWVPZmY6MTIsXG4gICAgICBmcmFtZU9uOjEzLFxuICAgICAgY29tbWFuZDogJ3N0YXJ0J1xuICAgIH0sXG5cbiAgICB0dXJuQXJvdW5kOiB7XG4gICAgICBwb3M6IHsgeDo2NjAsIHk6MCB9LFxuICAgICAgd2lkdGg6ODAsXG4gICAgICBoZWlnaHQ6ODAsXG4gICAgICBzcHJpdGU6ICdidXR0b25zJyxcbiAgICAgIGZyYW1lT2ZmOjYsXG4gICAgICBmcmFtZU9uOjcsXG4gICAgICBjb21tYW5kOiAndHVybkFyb3VuZCdcbiAgICB9LFxuXG4gICAgcmVzdGFydDoge1xuICAgICAgcG9zOiB7IHg6NzgwLCB5OjAgfSxcbiAgICAgIHdpZHRoOjQwLFxuICAgICAgaGVpZ2h0OjQwLFxuICAgICAgc3ByaXRlOiAnYnV0dG9ucycsXG4gICAgICBmcmFtZU9mZjo2LFxuICAgICAgZnJhbWVPbjo3LFxuICAgICAgY29tbWFuZDogJ3Jlc3RhcnQnXG4gICAgfVxuXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gW1xuICByZXF1aXJlKCcuLi9sZXZlbHMvZmlyc3QnKSxcbiAgcmVxdWlyZSgnLi4vbGV2ZWxzL3NlY29uZCcpXG5dXG4iLCJ2YXIgdmVjdG9yMiA9IHJlcXVpcmUoJy4vdmVjdG9yMicpXG52YXIgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbCcpXG52YXIgU3dpdGNoID0gcmVxdWlyZSgnLi9zd2l0Y2gnKVxudmFyIFJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG52YXIgRXhpdCA9IHJlcXVpcmUoJy4vZXhpdCcpXG5cbnZhciBlbnRoYXNoID0ge1xuICBCOiBCYWxsLFxuICBTOiBTd2l0Y2gsXG4gIFI6IFJvYm90LFxuICBFOiBFeGl0XG59XG5cbnZhciBFbnRpdHlNYW5hZ2VyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbnRpdGllcyA9IFtdXG4gIHRoaXMuYnlUeXBlID0ge31cbn1cblxudmFyIHByb3RvID0gRW50aXR5TWFuYWdlci5wcm90b3R5cGVcblxuLy8gbG9hZCB0aGUgZW50aXRpZXMgZnJvbSB0aGUgbGV2ZWxcbnByb3RvLmxvYWRFbnRpdGllcyA9IGZ1bmN0aW9uKG1hcCkge1xuICBmb3IgKHZhciB5ID0gMDsgeSA8IG1hcC5sZW5ndGg7IHkrPTEpIHtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG1hcFt5XS5sZW5ndGg7IHgrPTEpIHtcbiAgICAgIHZhciBFbnQgPSBlbnRoYXNoW21hcFt5XVt4XV1cbiAgICAgIGlmIChFbnQpIHtcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBlbnRpdHlcbiAgICAgICAgdmFyIGVudCA9IG5ldyBFbnQoe3g6eCx5Onl9KVxuICAgICAgICAvLyBjaGVjayB0byBzZWUgaWYgaXQncyB0aGUgcm9ib3RcbiAgICAgICAgaWYgKGVudCBpbnN0YW5jZW9mIFJvYm90KSB0aGlzLnJvYm90ID0gZW50XG4gICAgICAgIC8vIGFkZCBpdCB0byB0aGUgZW50aXR5IGNvbGxlY3Rpb25cbiAgICAgICAgdGhpcy5hZGQoRW50Lm5hbWUsIGVudClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxucHJvdG8uYWRkID0gZnVuY3Rpb24odHlwZSwgZW50KSB7XG4gIHRoaXMuZW50aXRpZXMucHVzaChlbnQpXG4gIHRoaXMuYnlUeXBlW3R5cGVdIHx8ICh0aGlzLmJ5VHlwZVt0eXBlXSA9IFtdKVxuICB0aGlzLmJ5VHlwZVt0eXBlXS5wdXNoKGVudClcbn1cblxucHJvdG8ub2ZUeXBlID0gZnVuY3Rpb24odHlwZSkge1xuICByZXR1cm4gdGhpcy5ieVR5cGVbdHlwZV1cbn1cblxucHJvdG8uYXRQb3MgPSBmdW5jdGlvbihwb3MsIHR5cGUpIHtcbiAgdmFyIGVudHMgPSB0aGlzLmJ5VHlwZVt0eXBlXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgdmFyIGVudCA9IGVudHNbaV1cbiAgICBpZiAodmVjdG9yMi5lcXVhbChlbnQucG9zLCBwb3MpKSB7XG4gICAgICByZXR1cm4gZW50XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbnByb3RvLmludm9rZSA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgdHlwZSkge1xuICB2YXIgZW50cyA9IHRoaXMuZW50aXRpZXNcbiAgaWYgKHR5cGUpIGVudHMgPSB0aGlzLmJ5VHlwZVt0eXBlXVxuXG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHRoaXMuX2RvSW52b2tlMChmbk5hbWUsIGVudHMpOyBicmVha1xuICAgIGNhc2UgMTogdGhpcy5fZG9JbnZva2UxKGZuTmFtZSwgYXJncywgZW50cyk7IGJyZWFrXG4gICAgY2FzZSAyOiB0aGlzLl9kb0ludm9rZTEoZm5OYW1lLCBhcmdzLCBlbnRzKTsgYnJlYWtcbiAgICBjYXNlIDM6IHRoaXMuX2RvSW52b2tlMShmbk5hbWUsIGFyZ3MsIGVudHMpOyBicmVha1xuICAgIGRlZmF1bHQ6IHRoaXMuX2RvSW52b2tlQShmbk5hbWUsIGFyZ3MsIGVudHMpO1xuICB9XG59XG5cbnByb3RvLl9kb0ludm9rZTAgPSBmdW5jdGlvbihmbk5hbWUsIGFyZ3MsIGVudHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRzLmxlbmd0aDsgaSs9MSkge1xuICAgIGVudHNbaV1bZm5OYW1lXSgpXG4gIH1cbn1cblxucHJvdG8uX2RvSW52b2tlMSA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdKGFyZ3NbMF0pXG4gIH1cbn1cblxucHJvdG8uX2RvSW52b2tlMiA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gIH1cbn1cblxucHJvdG8uX2RvSW52b2tlMyA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gIH1cbn1cblxucHJvdG8uX2RvSW52b2tlQSA9IGZ1bmN0aW9uKGZuTmFtZSwgYXJncywgZW50cykge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgZW50c1tpXVtmbk5hbWVdLmFwcGx5KGVudHNbaV0sIGFyZ3MpXG4gIH1cbn1cblxuXG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBTd2l0Y2ggPSByZXF1aXJlKCcuL3N3aXRjaCcpXG52YXIgUm9ib3QgPSByZXF1aXJlKCcuL3JvYm90JylcblxudmFyIEV4aXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEV4aXQocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3Ncbn1cblxuRXhpdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RhdGUgPSBFeGl0LlNUQVRFLklOQUNUSVZFXG4gIGlmICh0aGlzLmFsbFN3aXRjaGVzT24oKSkge1xuICAgIHRoaXMuc3RhdGUgPSBFeGl0LlNUQVRFLkFDVElWRVxuXG4gICAgdmFyIHIgPSB0aGlzLmdhbWUuZW50aXR5QXQodGhpcy5wb3MsIFJvYm90Lm5hbWUpXG4gICAgaWYgKHIpIHtcbiAgICAgIHB1YnN1Yi50cmlnZ2VyKCdleGl0TGV2ZWwnKVxuICAgIH1cbiAgfVxufVxuXG5FeGl0LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIHZhciBzY2FsZSA9IHRoaXMuZ2FtZS5zY2FsZVxuICB0aGlzLmdhbWUuaXNvQ3R4KGN0eCwgZnVuY3Rpb24oKSB7XG4gICAgY3R4LnRyYW5zbGF0ZShcbiAgICAgIHRoaXMucG9zLnggKiBzY2FsZSArIHNjYWxlIC8gMixcbiAgICAgIHRoaXMucG9zLnkgKiBzY2FsZSArIHNjYWxlIC8gMlxuICAgIClcblxuICAgIGlmICh0aGlzLnN0YXRlID09IEV4aXQuU1RBVEUuSU5BQ1RJVkUpXG4gICAgICBjdHguZmlsbFN0eWxlID0gJyNDQ0NDQ0MnXG4gICAgZWxzZVxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LnJlY3QoXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIC0wLjMsXG4gICAgICBzY2FsZSAqIDAuNixcbiAgICAgIHNjYWxlICogMC42XG4gICAgKVxuICAgIGN0eC5maWxsKClcbiAgICBjdHguc3Ryb2tlKClcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5FeGl0LnByb3RvdHlwZS5hbGxTd2l0Y2hlc09uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlbnRzID0gZ2FtZS5lbnRpdGllc09mVHlwZShTd2l0Y2gubmFtZSlcbiAgaWYgKCFlbnRzIHx8ICFlbnRzLmxlbmd0aCkgcmV0dXJuIHRydWVcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHMubGVuZ3RoOyBpKz0xKSB7XG4gICAgaWYgKGVudHNbaV0uc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PRkYpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbkV4aXQuU1RBVEUgPSB7XG4gIEFDVElWRSA6IDEsXG4gIElOQUNUSVZFIDogMFxufVxuIiwidmFyIHZlY3RvcjIgPSByZXF1aXJlKCcuL3ZlY3RvcjInKVxudmFyIElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpXG52YXIgVGltZXIgPSByZXF1aXJlKCcuL3RpbWVyJylcbnZhciBCdXR0b25NYW5hZ2VyID0gcmVxdWlyZSgnLi9idXR0b25NYW5hZ2VyJylcbnZhciBRdWV1ZU1hbmFnZXIgPSByZXF1aXJlKCcuL3F1ZXVlTWFuYWdlcicpXG52YXIgTGV2ZWxNYW5hZ2VyID0gcmVxdWlyZSgnLi9sZXZlbE1hbmFnZXInKVxuXG52YXIgRW50aXR5TWFuYWdlciA9IHJlcXVpcmUoJy4vZW50aXR5TWFuYWdlcicpXG52YXIgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbCcpXG52YXIgU3dpdGNoID0gcmVxdWlyZSgnLi9zd2l0Y2gnKVxudmFyIFJvYm90ID0gcmVxdWlyZSgnLi9yb2JvdCcpXG52YXIgRXhpdCA9IHJlcXVpcmUoJy4vZXhpdCcpXG5cbi8vIHZhciBlbnRoYXNoID0ge1xuLy8gICBCOiBCYWxsLFxuLy8gICBTOiBTd2l0Y2gsXG4vLyAgIFI6IFJvYm90LFxuLy8gICBFOiBFeGl0XG4vLyB9XG5cbi8vIGRlZ3JlZXMgdG8gcmFkaWFuc1xuZnVuY3Rpb24gZDJyKGEpIHtcbiAgcmV0dXJuIGEgKiAoTWF0aC5QSS8xODApXG59XG5cbi8vIHJhZGlhbnMgdG8gZGVncmVzc1xuZnVuY3Rpb24gcjJkKGEpIHtcbiAgcmV0dXJuIGEgLyAoTWF0aC5QSS8xODApXG59XG5cblxudmFyIEdhbWUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgR2FtZS5nYW1lID0gdGhpc1xuXG4gIHRoaXMuc2NhbGUgPSBvcHRzLnNjYWxlXG4gIHZhciB3aWR0aCA9IHRoaXMud2lkdGggPSBvcHRzLndpZHRoXG4gIHZhciBoZWlnaHQgPSB0aGlzLmhlaWdodCA9IG9wdHMuaGVpZ2h0XG4gIHRoaXMuZ3JpZFNpemUgPSBvcHRzLmdyaWRTaXplXG4gIHRoaXMudG9wTWFyZ2luID0gb3B0cy50b3BNYXJnaW5cblxuICAvLyBzZXR1cCB0aGUgY2FudmFzXG4gIHRoaXMuY3R4ID0gdGhpcy5pbml0Q2FudmFzKG9wdHMuY2FudmFzLCB3aWR0aCwgaGVpZ2h0KVxuXG4gIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXQob3B0cy5jYW52YXMpXG4gIC8vIHRoaXMuYnV0dG9uTWFuYWdlciA9IG5ldyBCdXR0b25NYW5hZ2VyKClcbiAgLy8gdGhpcy5xdWV1ZU1hbmFnZXIgPSBuZXcgUXVldWVNYW5hZ2VyKClcbiAgdGhpcy5sZXZlbE1hbmFnZXIgPSBuZXcgTGV2ZWxNYW5hZ2VyKClcbn1cblxudmFyIHByb3RvID0gR2FtZS5wcm90b3R5cGVcblxucHJvdG8ubG9hZExldmVsID0gZnVuY3Rpb24oaWR4KSB7XG4gIHZhciBsZXZlbCA9IHRoaXMubGV2ZWxNYW5hZ2VyLmxvYWQoaWR4KVxuICAvLyB0aGlzLmxvYWRFbnRpdGllcyhsZXZlbClcbn1cblxuLy8gc3RhcnRzIHRoZSBnYW1lIGxvb3BcbnByb3RvLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubG9vcCgpXG59XG5cbi8vIHN1c3BlbmRzIHRoZSBnYW1lIGxvb3BcbnByb3RvLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yQUZJRClcbn1cbnByb3RvLnBhdXNlID0gcHJvdG8uc3RvcFxuXG4vLyB0aGUgZ2FtZSBsb29wXG5wcm90by5sb29wID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuckFGSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcyksIHRoaXMuY3R4LmNhbnZhcylcblxuICBzdGF0cy5iZWdpbigpO1xuXG4gIHRoaXMudXBkYXRlKClcbiAgdGhpcy5kcmF3KClcblxuICBzdGF0cy5lbmQoKTtcbn1cblxuLy8gdXBkYXRlIGFsbCB0aGUgdGhpbmdzXG5wcm90by51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgVGltZXIuc3RlcCgpXG5cbiAgdGhpcy5sZXZlbE1hbmFnZXIudXBkYXRlKClcbiAgLy8gdGhpcy5idXR0b25NYW5hZ2VyLnVwZGF0ZSgpXG4gIC8vIHRoaXMucXVldWVNYW5hZ2VyLnVwZGF0ZSgpXG4gIC8vIHRoaXMuZW50aXRpZXMuaW52b2tlKCd1cGRhdGUnLCBbdGhpcy5jdHhdLCAnUm9ib3QnKVxuICAvLyB0aGlzLmVudGl0aWVzLmludm9rZSgndXBkYXRlJywgW3RoaXMuY3R4XSwgJ0JhbGwnKVxuICAvLyB0aGlzLmVudGl0aWVzLmludm9rZSgndXBkYXRlJywgW3RoaXMuY3R4XSwgJ1N3aXRjaCcpXG4gIC8vIHRoaXMuZW50aXRpZXMuaW52b2tlKCd1cGRhdGUnLCBbdGhpcy5jdHhdLCAnRXhpdCcpXG59XG5cbi8vIGRyYXcgYWxsIHRoZSB0aGluZ3NcbnByb3RvLmRyYXcgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KVxuXG4gIC8vIGRyYXcgdGhlIGxldmVsXG4gIHRoaXMubGV2ZWxNYW5hZ2VyLmRyYXcodGhpcy5jdHgpXG5cbiAgLy8gLy8gZHJhdyBlYWNoIGVudGl0eVxuICAvLyB0aGlzLmVudGl0aWVzLmludm9rZSgnZHJhdycsIFt0aGlzLmN0eF0sICdFeGl0JylcbiAgLy8gdGhpcy5lbnRpdGllcy5pbnZva2UoJ2RyYXcnLCBbdGhpcy5jdHhdLCAnU3dpdGNoJylcbiAgLy8gdGhpcy5lbnRpdGllcy5pbnZva2UoJ2RyYXcnLCBbdGhpcy5jdHhdLCAnUm9ib3QnKVxuICAvLyB0aGlzLmVudGl0aWVzLmludm9rZSgnZHJhdycsIFt0aGlzLmN0eF0sICdCYWxsJylcblxuICAvLyAvLyBkcmF3IGFueSBVSSBsYXN0XG4gIC8vIHRoaXMuYnV0dG9uTWFuYWdlci5kcmF3KHRoaXMuY3R4KVxuICAvLyB0aGlzLnF1ZXVlTWFuYWdlci5kcmF3KHRoaXMuY3R4KVxufVxuXG4vLyBnZXQgdGhlIGVudGl0eSBhdCB0aGUgZ2l2ZW4gcG9zaXRpb25cbnByb3RvLmVudGl0eUF0ID0gZnVuY3Rpb24ocG9zLCB0eXBlKSB7XG4gIHJldHVybiB0aGlzLmVudGl0aWVzLmF0UG9zKHBvcywgdHlwZSlcbn1cblxucHJvdG8uZW50aXRpZXNPZlR5cGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHJldHVybiB0aGlzLmVudGl0aWVzLm9mVHlwZSh0eXBlKVxufVxuXG4vLyAvLyBsb2FkIHRoZSBlbnRpdGllcyBmcm9tIHRoZSBsZXZlbFxuLy8gcHJvdG8ubG9hZEVudGl0aWVzID0gZnVuY3Rpb24obGV2ZWwpIHtcbi8vICAgdmFyIGVudHMgPSB0aGlzLmVudGl0aWVzID0gbmV3IEVudGl0eU1hbmFnZXIoKVxuLy8gICB2YXIgbWFwID0gbGV2ZWwuZW50aXR5TWFwXG4vLyAgIGZvciAodmFyIHkgPSAwOyB5IDwgbWFwLmxlbmd0aDsgeSs9MSkge1xuLy8gICAgIGZvciAodmFyIHggPSAwOyB4IDwgbWFwW3ldLmxlbmd0aDsgeCs9MSkge1xuLy8gICAgICAgdmFyIEVudCA9IGVudGhhc2hbbWFwW3ldW3hdXVxuLy8gICAgICAgaWYgKEVudCkge1xuLy8gICAgICAgICAvLyBjcmVhdGUgdGhlIGVudGl0eVxuLy8gICAgICAgICB2YXIgZW50ID0gbmV3IEVudCh7eDp4LHk6eX0pXG4vLyAgICAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBpdCdzIHRoZSByb2JvdFxuLy8gICAgICAgICBpZiAoZW50IGluc3RhbmNlb2YgUm9ib3QpIHRoaXMucm9ib3QgPSBlbnRcbi8vICAgICAgICAgLy8gYWRkIGl0IHRvIHRoZSBlbnRpdHkgY29sbGVjdGlvblxuLy8gICAgICAgICBlbnRzLmFkZChFbnQubmFtZSwgZW50KVxuLy8gICAgICAgfVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfVxuXG52YXIgdGhldGEgPSBkMnIoNDUpXG52YXIgY3NUaGV0YSA9IE1hdGguY29zKHRoZXRhKVxudmFyIHNuVGhldGEgPSBNYXRoLnNpbih0aGV0YSlcbnZhciB0aGV0YUludiA9IGQycigzMTUpXG52YXIgY3NUaGV0YUludiA9IE1hdGguY29zKHRoZXRhSW52KVxudmFyIHNuVGhldGFJbnYgPSBNYXRoLnNpbih0aGV0YUludilcblxuLy8gdHJhbnNsYXRlIHNjcmVlbiB0byB3b3JsZFxucHJvdG8uczJ3ID0gZnVuY3Rpb24ocG9zKSB7XG4gIC8vIHJvdGF0ZVxuICB2YXIgeCA9IHBvcy54XG4gIHZhciB5ID0gcG9zLnlcbiAgcG9zLnggPSB4ICogY3NUaGV0YSAtIHkgKiBzblRoZXRhXG4gIHBvcy55ID0geCAqIHNuVGhldGEgKyB5ICogY3NUaGV0YVxuICAvLyBzY2FsZVxuICBwb3MueSAqPSAwLjVcbiAgLy8gdHJhbnNsYXRlXG4gIHBvcy54ICs9IHRoaXMud2lkdGgvMlxuICBwb3MueSArPSB0aGlzLnRvcE1hcmdpblxuICByZXR1cm4gcG9zXG59XG5cbi8vIHRyYW5zbGF0ZSB3b3JsZCB0byBzY3JlZW5cbnByb3RvLncycyA9IGZ1bmN0aW9uKHBvcykge1xuICAvLyB0cmFuc2xhdGVcbiAgcG9zLnggLT0gdGhpcy53aWR0aC8yXG4gIHBvcy55IC09IHRoaXMudG9wTWFyZ2luXG4gIC8vIHNjYWxlXG4gIHBvcy55IC89IDAuNVxuICAvLyByb3RhdGVcbiAgdmFyIHkgPSBwb3MueVxuICB2YXIgeCA9IHBvcy54XG4gIHBvcy54ID0geCAqIGNzVGhldGFJbnYgLSB5ICogc25UaGV0YUludlxuICBwb3MueSA9IHggKiBzblRoZXRhSW52ICsgeSAqIGNzVGhldGFJbnZcbiAgcmV0dXJuIHBvc1xufVxuXG4vLyBzZXR1cCBjYW52YXNlIGVsZW1lbnRzIHRvIHRoZSBjb3JyZWN0IHNpemVcbnByb3RvLmluaXRDYW52YXMgPSBmdW5jdGlvbihpZCwgd2lkdGgsIGhlaWdodCkge1xuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gIGNhbnZhcy53aWR0aCA9IHdpZHRoXG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHRcbiAgcmV0dXJuIGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG59XG5cbi8vIHRyYW5zZm9ybSB0aGUgY29udGV4dCBpbnRvIGlzb21ldHJpY1xucHJvdG8uaXNvQ3R4ID0gZnVuY3Rpb24oY3R4LCBmbikge1xuICBjdHguc2F2ZSgpXG5cbiAgLy8gbW92ZSB0aGUgZ2FtZSBib2FyZCBkb3duIGEgYml0XG4gIGN0eC50cmFuc2xhdGUoMCwgdGhpcy50b3BNYXJnaW4pXG4gIGN0eC50cmFuc2xhdGUodGhpcy53aWR0aC8yLCAwKVxuICBjdHguc2NhbGUoMSwgMC41KVxuICBjdHgucm90YXRlKDQ1ICogTWF0aC5QSSAvIDE4MClcbiAgLy8gY3R4LnRyYW5zZm9ybSgwLjcwNywgMC40MDksIC0wLjcwNywgMC40MDksIDAsIDApXG4gIGZuKClcbiAgY3R4LnJlc3RvcmUoKVxufVxuXG5wcm90by5kMnIgPSBkMnJcblxucHJvdG8ucjJkID0gcjJkXG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBUaWxlU2V0ID0gcmVxdWlyZSgnLi90aWxlc2V0JylcblxudmFyIEdyaWQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGdyaWQsIHQpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuXG4gIHRoaXMuZ3JpZCA9IGdyaWRcbiAgdGhpcy50aWxlcyA9IG5ldyBUaWxlU2V0KHQuc3JjLCB0LncsIHQuaCwgdC5veCwgdC5veSlcblxuICB2YXIgcDEgPSB0aGlzLmdhbWUuczJ3KHt4OjAsIHk6MH0pXG4gIHZhciBwMiA9IHRoaXMuZ2FtZS5zMncoe3g6MCwgeTp0aGlzLmdhbWUuc2NhbGV9KVxuICB0aGlzLmlzb1RpbGVXaWR0aCA9IE1hdGguYWJzKHAyLnggLSBwMS54KSoyXG5cbiAgdGhpcy5lY2hvKCdsb2FkJywgdGhpcy50aWxlcylcbn1cblxucHVic3ViLmV4dGVuZChHcmlkLnByb3RvdHlwZSlcblxudmFyIHByb3RvID0gR3JpZC5wcm90b3R5cGVcblxucHJvdG8uZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICB2YXIgc2NhbGUgPSB0aGlzLmdhbWUuc2NhbGVcbiAgdmFyIGdyaWQgPSB0aGlzLmdyaWRcbiAgdmFyIHRpbGVzID0gdGhpcy50aWxlc1xuXG4gIGZvciAodmFyIHkgPSAwOyB5IDwgZ3JpZC5sZW5ndGg7IHkrPTEpIHtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGdyaWRbeV0ubGVuZ3RoOyB4Kz0xKSB7XG4gICAgICB2YXIgcG9zID0gdGhpcy5nYW1lLnMydyh7eDp4KnNjYWxlLCB5Onkqc2NhbGV9KVxuICAgICAgdGlsZXMuZHJhdyhjdHgsIGdyaWRbeV1beF0sIHBvcy54LCBwb3MueSwgdGhpcy5pc29UaWxlV2lkdGgpXG5cbiAgICAgIC8vIGN0eC5maWxsU3R5bGUgPSAnI2ZmMDAwMCdcbiAgICAgIC8vIGN0eC5zdHJva2VTdHlsZSA9ICcjZmZmZmZmJ1xuICAgICAgLy8gY3R4LnJlY3QocG9zLngtMS41LCBwb3MueS0xLjUsIDMsIDMpXG4gICAgICAvLyBjdHguZmlsbCgpXG4gICAgICAvLyBjdHguc3Ryb2tlKClcbiAgICB9XG4gIH1cblxuICAvLyB0aGlzLmdhbWUuaXNvQ3R4KGN0eCwgZnVuY3Rpb24oKSB7XG5cbiAgLy8gICAvLyBkcmF3IHRoZSBncmlkIHRpbGVzXG4gIC8vICAgZm9yICh2YXIgeSA9IDA7IHkgPCBncmlkLmxlbmd0aDsgeSs9MSkge1xuICAvLyAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBncmlkW3ldLmxlbmd0aDsgeCs9MSkge1xuICAvLyAgICAgICAvLyBmaWxsIHRoZSB0aWxlXG4gIC8vICAgICAgIGlmIChncmlkW3ldW3hdKSB7XG4gIC8vICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDAsMCwwLDAuMTUpJ1xuICAvLyAgICAgICAgIGN0eC5maWxsUmVjdCh4KnNjYWxlICsgc2NhbGUqMC4xLCB5KnNjYWxlICsgc2NhbGUqMC4xLCBzY2FsZSowLjgsIHNjYWxlKjAuOClcbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuICAvLyAgIH1cblxuICAvLyAgIC8vIGRyYXcgdGhlIGdyaWQgbGluZXNcbiAgLy8gICBjdHguc3Ryb2tlU3R5bGUgPSAnIzg4ODg4OCdcbiAgLy8gICBmb3IgKHZhciB5ID0gMDsgeSA8IGdyaWQubGVuZ3RoOyB5Kz0xKSB7XG4gIC8vICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGdyaWRbeV0ubGVuZ3RoOyB4Kz0xKSB7XG4gIC8vICAgICAgIGlmIChncmlkW3ldW3hdKSB7XG4gIC8vICAgICAgICAgY3R4LmJlZ2luUGF0aCgpXG4gIC8vICAgICAgICAgY3R4LnJlY3QoeCpzY2FsZSswLjUsIHkqc2NhbGUrMC41LCBzY2FsZSwgc2NhbGUpXG4gIC8vICAgICAgICAgY3R4LnN0cm9rZSgpXG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICB9XG5cbiAgLy8gfSlcbn1cbiIsInZhciBJbnB1dCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaWQpIHtcbiAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLnRvdWNoU3RhcnQuYmluZCh0aGlzKSwgZmFsc2UpXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMudG91Y2hNb3ZlLmJpbmQodGhpcyksIGZhbHNlKVxuICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMudG91Y2hFbmQuYmluZCh0aGlzKSwgZmFsc2UpXG59XG5cblxuSW5wdXQucHJvdG90eXBlLnRvdWNoU3RhcnQgPSBmdW5jdGlvbihldikge1xuICB0aGlzLnN0YXJ0ID0gZXYudG91Y2hlc1swXVxuICB0aGlzLnRvdWNoTW92ZShldilcbn1cblxuSW5wdXQucHJvdG90eXBlLnRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2KSB7XG4gIHRoaXMucHJldmlvdXMgPSB0aGlzLmN1cnJlbnRcbiAgdGhpcy5jdXJyZW50ID0gZXYudG91Y2hlc1swXVxuICB0aGlzLmN1cnJlbnQueCA9IHRoaXMuY3VycmVudC5jbGllbnRYXG4gIHRoaXMuY3VycmVudC55ID0gdGhpcy5jdXJyZW50LmNsaWVudFlcbn1cblxuSW5wdXQucHJvdG90eXBlLnRvdWNoRW5kID0gZnVuY3Rpb24oZXYpIHtcbiAgdGhpcy5wcmV2aW91cyA9IHtcbiAgICBzdGFydDogdGhpcy5zdGFydCxcbiAgICBlbmQ6IHRoaXMuY3VycmVudFxuICB9XG4gIHRoaXMuY3VycmVudCA9IG51bGxcbiAgdGhpcy5zdGFydCA9IG51bGxcbn1cbiIsInZhciBJbnRlcm1pc3Npb24gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG59XG5cbnZhciBwcm90byA9IEludGVybWlzc2lvbi5wcm90b3R5cGVcblxucHJvdG8udXBkYXRlID0gZnVuY3Rpb24oKSB7XG5cbn1cblxucHJvdG8uZHJhdyA9IGZ1bmN0aW9uKCkge1xuXG59XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBHcmlkID0gcmVxdWlyZSgnLi9ncmlkJylcbnZhciBCdXR0b25NYW5hZ2VyID0gcmVxdWlyZSgnLi9idXR0b25NYW5hZ2VyJylcbnZhciBRdWV1ZU1hbmFnZXIgPSByZXF1aXJlKCcuL3F1ZXVlTWFuYWdlcicpXG52YXIgSW50ZXJtaXNzaW9uID0gcmVxdWlyZSgnLi9pbnRlcm1pc3Npb24nKVxuXG4vLyB2YXIgXyA9IDBcbnZhciBCQUxMID0gJ0JhbGwnXG52YXIgU1dJVENIID0gJ1N3aXRjaCdcbnZhciBST0JPVCA9ICdSb2JvdCdcbnZhciBFWElUID0gJ0V4aXQnXG52YXIgVVBEQVRFID0gJ3VwZGF0ZSdcbnZhciBEUkFXID0gJ2RyYXcnXG5cbnZhciBMZXZlbCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29uZikge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG5cbiAgdGhpcy5ncmlkID0gbmV3IEdyaWQoY29uZi5ncmlkKVxuICB0aGlzLmVudGl0aWVzID0gbmV3IEVudGl0eU1hbmFnZXIoY29uZi5lbnRpdHlNYXApXG4gIGlmICh0aGlzLmVudGl0aWVzLnJvYm90KSB7XG4gICAgdGhpcy5yb2JvdCA9IHRoaXMuZW50aXRpZXMucm9ib3RcbiAgfVxuXG4gIHRoaXMuYnV0dG9uTWFuYWdlciA9IG5ldyBCdXR0b25NYW5hZ2VyKClcbiAgdGhpcy5xdWV1ZU1hbmFnZXIgPSBuZXcgUXVldWVNYW5hZ2VyKClcblxuICBwdWJzdWIub24oJ2V4aXRMZXZlbCcsIHRoaXMuZW5kLmJpbmQodGhpcykpXG59XG5cbnZhciBwcm90byA9IExldmVsLnByb3RvdHlwZVxuXG5wcm90by51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuaW50ZXJtaXNzaW9uKVxuICAgIHRoaXMuaW50ZXJtaXNzaW9uLnVwZGF0ZSgpXG5cbiAgdGhpcy5idXR0b25NYW5hZ2VyLnVwZGF0ZSgpXG4gIHRoaXMucXVldWVNYW5hZ2VyLnVwZGF0ZSgpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKFVQREFURSwgW3RoaXMuY3R4XSwgUk9CT1QpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKFVQREFURSwgW3RoaXMuY3R4XSwgQkFMTClcbiAgdGhpcy5lbnRpdGllcy5pbnZva2UoVVBEQVRFLCBbdGhpcy5jdHhdLCBTV0lUQ0gpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKFVQREFURSwgW3RoaXMuY3R4XSwgRVhJVClcbn1cblxucHJvdG8uZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuXG4gIC8vIGRyYXcgdGhlIHRpbGVzXG4gIHRoaXMudGlsZXMuZHJhdyhjdHgpXG5cbiAgLy8gZHJhdyBlYWNoIGVudGl0eVxuICB0aGlzLmVudGl0aWVzLmludm9rZShEUkFXLCBbdGhpcy5jdHhdLCBFWElUKVxuICB0aGlzLmVudGl0aWVzLmludm9rZShEUkFXLCBbdGhpcy5jdHhdLCBTV0lUQ0gpXG4gIHRoaXMuZW50aXRpZXMuaW52b2tlKERSQVcsIFt0aGlzLmN0eF0sIFJPQk9UKVxuICB0aGlzLmVudGl0aWVzLmludm9rZShEUkFXLCBbdGhpcy5jdHhdLCBCQUxMKVxuXG4gIC8vIGRyYXcgYW55IFVJIGxhc3RcbiAgdGhpcy5idXR0b25NYW5hZ2VyLmRyYXcodGhpcy5jdHgpXG4gIHRoaXMucXVldWVNYW5hZ2VyLmRyYXcodGhpcy5jdHgpXG4gIGlmICh0aGlzLmludGVybWlzc2lvbikge1xuICAgIHRoaXMuaW50ZXJtaXNzaW9uLmRyYXcoY3R4KVxuICB9XG5cbn1cblxucHJvdG8uZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuXG59XG5cbnByb3RvLmVuZCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmludGVybWlzc2lvbiA9IG5ldyBJbnRlcm1pc3Npb24oKVxufVxuIiwidmFyIGxldmVsRGVmcyA9IHJlcXVpcmUoJy4vY29uZmlnL2xldmVscycpXG52YXIgTGV2ZWwgPSByZXF1aXJlKCcuL2xldmVsJylcblxudmFyIExldmVsTWFuYWdlciA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMubGV2ZWxzID0gbGV2ZWxEZWZzXG5cbiAgdGhpcy5jdXJyZW50ID0gbnVsbFxuICB0aGlzLmN1cnJlbnRJZHggPSAtMVxufVxuXG52YXIgcHJvdG8gPSBMZXZlbE1hbmFnZXIucHJvdG90eXBlXG5cbnByb3RvLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5jdXJyZW50KVxuICAgIHRoaXMuY3VycmVudC51cGRhdGUoKVxufVxuXG5wcm90by5kcmF3ID0gZnVuY3Rpb24oY3R4KSB7XG4gIGlmICh0aGlzLmN1cnJlbnQpXG4gICAgdGhpcy5jdXJyZW50LmRyYXcoY3R4KVxufVxuXG5wcm90by5sb2FkID0gZnVuY3Rpb24oaWR4KSB7XG4gIHZhciBjb25mID0gdGhpcy5sZXZlbHNbaWR4XVxuICB2YXIgbmV4dCA9IGNvbmYgPyBuZXcgTGV2ZWwoY29uZikgOiBudWxsXG5cbiAgLy8gdW5sb2FkIHRoZSBjdXJyZW50IGxldmVsXG4gIGlmICh0aGlzLmN1cnJlbnQpIHtcbiAgICB0aGlzLmN1cnJlbnQuZGlzcG9zZSgpXG4gICAgdGhpcy5jdXJyZW50ID0gbnVsbFxuICAgIHRoaXMuY3VycmVudElkeCA9IC0xXG4gIH1cblxuICAvLyBzZXQgdGhlIG5leHQgbGV2ZWwgYXMgY3VycmVudFxuICBpZiAobmV4dCkge1xuICAgIHRoaXMuY3VycmVudCA9IG5leHRcbiAgICB0aGlzLmN1cnJlbnRJZHggPSBpZHhcbiAgfVxuXG4gIHJldHVybiBuZXh0XG59XG5cbnByb3RvLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubG9hZCh0aGlzLmN1cnJlbnRJZHggKyAxKVxufVxuXG4iLCJ2YXIgXyA9IDBcbnZhciBCID0gJ0InXG52YXIgUyA9ICdTJ1xudmFyIFIgPSAnUidcbnZhciBFID0gJ0UnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBuYW1lOiAnRmlyc3QgTGV2ZWwnLFxuXG4gIHRpbGVzOiB7XG4gICAgc3JjOiAnaW1hZ2VzL2lzb3RpbGVzLnBuZycsXG4gICAgdzogNjQsXG4gICAgaDogNjQsXG4gICAgb3g6IDQsXG4gICAgb3k6IDE2XG4gIH0sXG5cbiAgZ3JpZDogW1xuICAgIFs2LDYsNiw2LDZdLFxuICAgIFs2LDYsNiw2LDZdLFxuICAgIFs2LDYsNiw2LDZdXG4gIF0sXG5cbiAgZW50aXR5TWFwOiBbXG4gICAgW18sXyxCLF8sX10sXG4gICAgW1IsXyxfLF8sU10sXG4gICAgW18sXyxFLF8sX11cbiAgXVxufVxuIiwidmFyIF8gPSAwXG52YXIgQiA9ICdCJ1xudmFyIFMgPSAnUydcbnZhciBSID0gJ1InXG52YXIgRSA9ICdFJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbmFtZTogJ1NlY29uZCBMZXZlbCcsXG5cbiAgdGlsZXM6IHtcbiAgICBzcmM6ICdpbWFnZXMvaXNvdGlsZXMucG5nJyxcbiAgICB3OiA2NCxcbiAgICBoOiA2NCxcbiAgICBveDogNCxcbiAgICBveTogMTZcbiAgfSxcblxuICBncmlkOiBbXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgWzYsNiw2LDYsNl0sXG4gICAgW18sXyxfLDYsNl0sXG4gICAgWzYsNixfLDYsNl1cbiAgXSxcblxuICBlbnRpdHlNYXA6IFtcbiAgICBbXyxfLF8sXyxfXSxcbiAgICBbXyxSLF8sQixfXSxcbiAgICBbXyxfLF8sXyxFXSxcbiAgICBbXyxfLFMsXyxfXSxcbiAgICBbXyxfLF8sXyxfXVxuICBdXG59XG4iLCIvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbnZhciBleHRlbmQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaikge1xuICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3I7XG4gIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG59O1xuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoJy4vZXh0ZW5kJylcblxudmFyIEV2ZW50cyA9IHt9XG5cbkV2ZW50cy50cmlnZ2VyID0gZnVuY3Rpb24oLyogU3RyaW5nICovIHRvcGljLCAvKiBBcnJheT8gKi8gYXJncykge1xuICAvLyBzdW1tYXJ5OlxuICAvLyAgICBQdWJsaXNoIHNvbWUgZGF0YSBvbiBhIG5hbWVkIHRvcGljLlxuICAvLyB0b3BpYzogU3RyaW5nXG4gIC8vICAgIFRoZSBjaGFubmVsIHRvIHB1Ymxpc2ggb25cbiAgLy8gYXJnczogQXJyYXk/XG4gIC8vICAgIFRoZSBkYXRhIHRvIHB1Ymxpc2guIEVhY2ggYXJyYXkgaXRlbSBpcyBjb252ZXJ0ZWQgaW50byBhbiBvcmRlcmVkXG4gIC8vICAgIGFyZ3VtZW50cyBvbiB0aGUgc3Vic2NyaWJlZCBmdW5jdGlvbnMuXG4gIC8vXG4gIC8vIGV4YW1wbGU6XG4gIC8vICAgIFB1Ymxpc2ggc3R1ZmYgb24gJy9zb21lL3RvcGljJy4gQW55dGhpbmcgc3Vic2NyaWJlZCB3aWxsIGJlIGNhbGxlZFxuICAvLyAgICB3aXRoIGEgZnVuY3Rpb24gc2lnbmF0dXJlIGxpa2U6IGZ1bmN0aW9uKGEsYixjKSB7IC4uLiB9XG4gIC8vXG4gIC8vICAgIHRyaWdnZXIoXCIvc29tZS90b3BpY1wiLCBbXCJhXCIsXCJiXCIsXCJjXCJdKVxuICBpZiAoIXRoaXMuX2V2ZW50cykgcmV0dXJuXG5cbiAgdmFyIHN1YnMgPSB0aGlzLl9ldmVudHNbdG9waWNdLFxuICAgIGxlbiA9IHN1YnMgPyBzdWJzLmxlbmd0aCA6IDBcblxuICAvL2NhbiBjaGFuZ2UgbG9vcCBvciByZXZlcnNlIGFycmF5IGlmIHRoZSBvcmRlciBtYXR0ZXJzXG4gIHdoaWxlIChsZW4tLSkge1xuICAgIHN1YnNbbGVuXS5hcHBseShFdmVudHMsIGFyZ3MgfHwgW10pXG4gIH1cbn1cblxuRXZlbnRzLm9uID0gZnVuY3Rpb24oLyogU3RyaW5nICovIHRvcGljLCAvKiBGdW5jdGlvbiAqLyBjYWxsYmFjaykge1xuICAvLyBzdW1tYXJ5OlxuICAvLyAgICBSZWdpc3RlciBhIGNhbGxiYWNrIG9uIGEgbmFtZWQgdG9waWMuXG4gIC8vIHRvcGljOiBTdHJpbmdcbiAgLy8gICAgVGhlIGNoYW5uZWwgdG8gc3Vic2NyaWJlIHRvXG4gIC8vIGNhbGxiYWNrOiBGdW5jdGlvblxuICAvLyAgICBUaGUgaGFuZGxlciBldmVudC4gQW55dGltZSBzb21ldGhpbmcgaXMgdHJpZ2dlcidlZCBvbiBhXG4gIC8vICAgIHN1YnNjcmliZWQgY2hhbm5lbCwgdGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlXG4gIC8vICAgIHB1Ymxpc2hlZCBhcnJheSBhcyBvcmRlcmVkIGFyZ3VtZW50cy5cbiAgLy9cbiAgLy8gcmV0dXJuczogQXJyYXlcbiAgLy8gICAgQSBoYW5kbGUgd2hpY2ggY2FuIGJlIHVzZWQgdG8gdW5zdWJzY3JpYmUgdGhpcyBwYXJ0aWN1bGFyIHN1YnNjcmlwdGlvbi5cbiAgLy9cbiAgLy8gZXhhbXBsZTpcbiAgLy8gICAgb24oXCIvc29tZS90b3BpY1wiLCBmdW5jdGlvbihhLCBiLCBjKSB7IC8qIGhhbmRsZSBkYXRhICovIH0pXG5cbiAgdGhpcy5fZXZlbnRzIHx8ICh0aGlzLl9ldmVudHMgPSB7fSlcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0b3BpY10pIHtcbiAgICB0aGlzLl9ldmVudHNbdG9waWNdID0gW11cbiAgfVxuICB0aGlzLl9ldmVudHNbdG9waWNdLnB1c2goY2FsbGJhY2spXG4gIHJldHVybiBbdG9waWMsIGNhbGxiYWNrXSAvLyBBcnJheVxufVxuXG5FdmVudHMub2ZmID0gZnVuY3Rpb24oLyogQXJyYXkgb3IgU3RyaW5nICovIGhhbmRsZSkge1xuICAvLyBzdW1tYXJ5OlxuICAvLyAgICBEaXNjb25uZWN0IGEgc3Vic2NyaWJlZCBmdW5jdGlvbiBmb3IgYSB0b3BpYy5cbiAgLy8gaGFuZGxlOiBBcnJheSBvciBTdHJpbmdcbiAgLy8gICAgVGhlIHJldHVybiB2YWx1ZSBmcm9tIGFuIGBvbmAgY2FsbC5cbiAgLy8gZXhhbXBsZTpcbiAgLy8gICAgdmFyIGhhbmRsZSA9IG9uKFwiL3NvbWUvdG9waWNcIiwgZnVuY3Rpb24oKSB7fSlcbiAgLy8gICAgb2ZmKGhhbmRsZSlcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVyblxuXG4gIHZhciBzdWJzID0gdGhpcy5fZXZlbnRzW3R5cGVvZiBoYW5kbGUgPT09ICdzdHJpbmcnID8gaGFuZGxlIDogaGFuZGxlWzBdXVxuICB2YXIgY2FsbGJhY2sgPSB0eXBlb2YgaGFuZGxlID09PSAnc3RyaW5nJyA/IGhhbmRsZVsxXSA6IGZhbHNlXG4gIHZhciBsZW4gPSBzdWJzID8gc3Vicy5sZW5ndGggOiAwXG5cbiAgd2hpbGUgKGxlbi0tKSB7XG4gICAgaWYgKHN1YnNbbGVuXSA9PT0gY2FsbGJhY2sgfHwgIWNhbGxiYWNrKSB7XG4gICAgICBzdWJzLnNwbGljZShsZW4sIDEpXG4gICAgfVxuICB9XG59XG5cbkV2ZW50cy5lY2hvID0gZnVuY3Rpb24oLyogU3RyaW5nICovIHRvcGljLCAvKiBPYmplY3QgKi8gZW1pdHRlcikge1xuICBlbWl0dGVyLm9uKHRvcGljLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRyaWdnZXIodG9waWMsIGFyZ3VtZW50cylcbiAgfS5iaW5kKHRoaXMpKVxufVxuXG5cbnZhciBwdWJzdWIgPSBtb2R1bGUuZXhwb3J0cyA9IHt9XG5cbnB1YnN1Yi5FdmVudHMgPSBFdmVudHNcbnB1YnN1Yi5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgZXh0ZW5kKG9iaiwgRXZlbnRzKVxufVxucHVic3ViLmV4dGVuZChwdWJzdWIpXG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJy4vbGliL2luaGVyaXRzJylcbnZhciBCdXR0b24gPSByZXF1aXJlKCcuL2J1dHRvbicpXG5cbnZhciBRdWV1ZUJ1dHRvbiA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUXVldWVCdXR0b24oYnV0dG9uLCBwb3MpIHtcbiAgdmFyIGJ0biA9IHtcbiAgICBwb3M6IHBvcyxcbiAgICB3aWR0aDogNDAsXG4gICAgaGVpZ2h0OiA0MCxcbiAgICBzcHJpdGU6IGJ1dHRvbi5zcHJpdGUsXG4gICAgZnJhbWVPZmY6IGJ1dHRvbi5mcmFtZU9mZixcbiAgICBmcmFtZU9uOiBidXR0b24uZnJhbWVPbixcbiAgICBjb21tYW5kOiBidXR0b24uY29tbWFuZFxuICB9XG4gIEJ1dHRvbi5jYWxsKHRoaXMsIGJ0bilcbn1cblxuaW5oZXJpdHMoUXVldWVCdXR0b24sIEJ1dHRvbilcblxuUXVldWVCdXR0b24ucHJvdG90eXBlLnRhcHBlZCA9IGZ1bmN0aW9uKCkge1xuICBwdWJzdWIudHJpZ2dlcigncXVldWVCdXR0b25QcmVzc2VkJywgW3RoaXNdKVxufVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG52YXIgUXVldWVCdXR0b24gPSByZXF1aXJlKCcuL3F1ZXVlQnV0dG9uJylcbnZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpXG5cbnZhciBRdWV1ZU1hbmFnZXIgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKS5nYW1lXG4gIHRoaXMuYnV0dG9ucyA9IFtdXG4gIHB1YnN1Yi5vbignY29tbWFuZEJ1dHRvblByZXNzZWQnLCB0aGlzLmVucXVldWUuYmluZCh0aGlzKSlcbiAgcHVic3ViLm9uKCdxdWV1ZUJ1dHRvblByZXNzZWQnLCB0aGlzLnJlbW92ZS5iaW5kKHRoaXMpKVxufVxuXG5RdWV1ZU1hbmFnZXIucHJvdG90eXBlLmVucXVldWUgPSBmdW5jdGlvbihidG4pIHtcbiAgaWYgKGJ0bi5jb21tYW5kID09PSAnc3RhcnQnKSByZXR1cm4gcHVic3ViLnRyaWdnZXIoJ3JvYm90U3RhcnQnKVxuICB2YXIgeCA9IHRoaXMuYnV0dG9ucy5sZW5ndGggKiA0MiArIDEwXG4gIHZhciB5ID0gdGhpcy5nYW1lLmhlaWdodCAtIDUwXG4gIHZhciBidXR0b24gPSBuZXcgUXVldWVCdXR0b24oYnRuLCB7eDp4LHk6eX0pXG4gIHRoaXMuYnV0dG9ucy5wdXNoKGJ1dHRvbilcbn1cblxuUXVldWVNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihidG4pIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5idXR0b25zLmluZGV4T2YoYnRuKVxuICB0aGlzLmJ1dHRvbnMuc3BsaWNlKGluZGV4LCAxKVxuICB0aGlzLnJlY2FsY3VsYXRlUG9zWChpbmRleClcbiAgcmV0dXJuIGJ0blxufVxuXG5RdWV1ZU1hbmFnZXIucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYnRuID0gdGhpcy5idXR0b25zLnNoaWZ0KClcbiAgdGhpcy5yZWNhbGN1bGF0ZVBvc1goKVxuICByZXR1cm4gYnRuLmNvbW1hbmRcbn1cblxuUXVldWVNYW5hZ2VyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmJ1dHRvbnMgPSBbXVxufVxuXG5RdWV1ZU1hbmFnZXIucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmJ1dHRvbnMubGVuZ3RoXG59XG5cblF1ZXVlTWFuYWdlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS51cGRhdGUoKVxuICB9XG59XG5cblF1ZXVlTWFuYWdlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYnV0dG9ucy5sZW5ndGg7IGkrPTEpIHtcbiAgICB0aGlzLmJ1dHRvbnNbaV0uZHJhdyhjdHgpXG4gIH1cbn1cblxuUXVldWVNYW5hZ2VyLnByb3RvdHlwZS5yZWNhbGN1bGF0ZVBvc1ggPSBmdW5jdGlvbihpZHgpIHtcbiAgZm9yICh2YXIgaSA9IGlkeCB8fCAwOyBpIDwgdGhpcy5idXR0b25zLmxlbmd0aDsgaSs9MSkge1xuICAgIHRoaXMuYnV0dG9uc1tpXS5wb3MueCA9IGkgKiA0MiArIDEwXG4gIH1cbn1cbiIsInZhciB2ZWN0b3IyID0gcmVxdWlyZSgnLi92ZWN0b3IyJylcbnZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIFRpbWVyID0gcmVxdWlyZSgnLi90aW1lcicpXG5cbnZhciBCYWxsID0gcmVxdWlyZSgnLi9iYWxsJylcblxudmFyIFJvYm90ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBSb2JvdChwb3MpIHtcbiAgdGhpcy5nYW1lID0gcmVxdWlyZSgnLi9nYW1lJykuZ2FtZVxuICB0aGlzLnBvcyA9IHBvc1xuICB0aGlzLmRpciA9IHsgeDoxLCB5OjAgfVxuICB0aGlzLnF1ZXVlID0gdGhpcy5nYW1lLnF1ZXVlTWFuYWdlclxuICB0aGlzLmZyZXEgPSAwLjRcbiAgdGhpcy5ibG9ja2VkID0gZmFsc2VcbiAgdGhpcy5zdG9wcGVkID0gdHJ1ZVxuXG4gIHRoaXMudGltZXIgPSBuZXcgVGltZXIoTnVtYmVyLk1BWF9WQUxVRSlcbiAgdGhpcy50aW1lci5wYXVzZSgpXG5cbiAgLy8gcHVic3ViLm9uKCdjb21tYW5kQnV0dG9uUHJlc3NlZCcsIHRoaXMuZW5xdWV1ZS5iaW5kKHRoaXMpKVxuICBwdWJzdWIub24oJ3JvYm90U3RhcnQnLCB0aGlzLnN0YXJ0LmJpbmQodGhpcykpXG59XG5cbnZhciBwcm90byA9IFJvYm90LnByb3RvdHlwZVxuXG5wcm90by5tb3ZlID0gZnVuY3Rpb24obmV3UG9zKSB7XG4gIHZhciBncmlkID0gdGhpcy5nYW1lLmxldmVsTWFuYWdlci5jdXJyZW50LmdyaWRcbiAgaWYgKCFncmlkW25ld1Bvcy55XSB8fCAhZ3JpZFtuZXdQb3MueV1bbmV3UG9zLnhdKSB7XG4gICAgdGhpcy5ibG9jaygpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wb3MgPSBuZXdQb3NcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5wcm90by5tb3ZlRm9yd2FyZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmV3UG9zID0gdmVjdG9yMi5hZGQodGhpcy5wb3MsIHRoaXMuZGlyKVxuICByZXR1cm4gdGhpcy5tb3ZlKG5ld1Bvcylcbn1cblxucHJvdG8ubW92ZUJhY2t3YXJkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuZXdQb3MgPSB2ZWN0b3IyLnN1YnRyYWN0KHRoaXMucG9zLCB0aGlzLmRpcilcbiAgcmV0dXJuIHRoaXMubW92ZShuZXdQb3MpXG59XG5cbnByb3RvLnR1cm5MZWZ0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciB4ID0gdGhpcy5kaXIueFxuICB2YXIgeSA9IHRoaXMuZGlyLnlcbiAgdGhpcy5kaXIueCA9IHlcbiAgdGhpcy5kaXIueSA9IC14XG4gIHJldHVybiB0aGlzXG59XG5cbnByb3RvLnR1cm5SaWdodCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgeCA9IHRoaXMuZGlyLnhcbiAgdmFyIHkgPSB0aGlzLmRpci55XG4gIHRoaXMuZGlyLnggPSAteVxuICB0aGlzLmRpci55ID0geFxuICByZXR1cm4gdGhpc1xufVxuXG5wcm90by50dXJuQXJvdW5kID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZGlyLnggKj0gLTFcbiAgdGhpcy5kaXIueSAqPSAtMVxuICByZXR1cm4gdGhpc1xufVxuXG5wcm90by5waWNrdXAgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRhcmdldCA9IHRoaXMuZ2FtZS5lbnRpdHlBdCh2ZWN0b3IyLmFkZCh0aGlzLnBvcywgdGhpcy5kaXIpLCBCYWxsLm5hbWUpXG4gIGlmICh0YXJnZXQgJiYgdGFyZ2V0LnBpY2tlZFVwKCkpIHtcbiAgICB0aGlzLmJhbGwgPSB0YXJnZXRcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmJsb2NrKClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5wcm90by5yZWxlYXNlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmJhbGwgJiYgdGhpcy5iYWxsLmRyb3BwZWQoKSkge1xuICAgIHRoaXMuYmFsbCA9IG51bGxcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmJsb2NrKClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5wcm90by5tb3ZlQmFsbCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5iYWxsKSB7XG4gICAgdGhpcy5iYWxsLnBvcyA9IHZlY3RvcjIuYWRkKHRoaXMucG9zLCB0aGlzLmRpcilcbiAgfVxufVxuXG5wcm90by5ibG9jayA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmJsb2NrZWQgPSB0cnVlXG59XG5cbnByb3RvLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMudGltZXIuc2V0KDApXG4gIHRoaXMudGltZXIudW5wYXVzZSgpXG59XG5cbnByb3RvLnN0b3AgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50aW1lci5wYXVzZSgpXG59XG5cbnByb3RvLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5xdWV1ZS5jb3VudCgpID09IDApXG4gICAgcmV0dXJuIHRoaXMuc3RvcCgpXG5cbiAgaWYgKHRoaXMuYmxvY2tlZCkge1xuICAgIHRoaXMucXVldWUucmVzZXQoKVxuICAgIHJldHVybiB0aGlzLnN0b3AoKVxuICB9XG5cbiAgaWYgKHRoaXMudGltZXIuZGVsdGEoKSA+IDApIHtcbiAgICB2YXIgYWN0aW9uID0gdGhpcy5xdWV1ZS5wb3AoKVxuICAgIHRoaXNbYWN0aW9uXSgpXG4gICAgdGhpcy5tb3ZlQmFsbCgpXG4gICAgdGhpcy50aW1lci5zZXQodGhpcy5mcmVxKVxuICB9XG59XG5cbnByb3RvLmRyYXcgPSBmdW5jdGlvbihjdHgpIHtcbiAgdmFyIHNjYWxlID0gdGhpcy5nYW1lLnNjYWxlXG5cbiAgdGhpcy5nYW1lLmlzb0N0eChjdHgsIGZ1bmN0aW9uKCkge1xuXG4gICAgY3R4LnNhdmUoKVxuICAgIGN0eC50cmFuc2xhdGUoXG4gICAgICB0aGlzLnBvcy54ICogc2NhbGUgKyBzY2FsZSAvIDIsXG4gICAgICB0aGlzLnBvcy55ICogc2NhbGUgKyBzY2FsZSAvIDJcbiAgICApXG4gICAgY3R4LnJvdGF0ZShNYXRoLmF0YW4yKHRoaXMuZGlyLnksIHRoaXMuZGlyLngpKVxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmJsb2NrZWQgPyAnI2ZmMDAwMCcgOiAnIzQ0ODg0NCdcblxuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5yZWN0KFxuICAgICAgc2NhbGUgKiAtMC4zLFxuICAgICAgc2NhbGUgKiAtMC4zLFxuICAgICAgc2NhbGUgKiAwLjYsXG4gICAgICBzY2FsZSAqIDAuNlxuICAgIClcbiAgICBjdHguZmlsbCgpXG4gICAgY3R4LnN0cm9rZSgpXG5cbiAgICBjdHguYmVnaW5QYXRoKClcbiAgICBjdHgubW92ZVRvKDAsIDApXG4gICAgY3R4LmxpbmVUbyhzY2FsZSAqICh0aGlzLmJhbGw/MTowLjMpLCAwKVxuICAgIGN0eC5zdHJva2UoKVxuICAgIGN0eC5yZXN0b3JlKClcblxuICB9LmJpbmQodGhpcykpXG4gIHJldHVybiB0aGlzXG59XG4iLCJ3aW5kb3cuc3RhdHMgPSBuZXcgU3RhdHMoKTtcbnN0YXRzLnNldE1vZGUoMSk7IC8vIDA6IGZwcywgMTogbXNcbnN0YXRzLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuc3RhdHMuZG9tRWxlbWVudC5zdHlsZS5yaWdodCA9ICcwcHgnO1xuc3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHN0YXRzLmRvbUVsZW1lbnQgKTtcblxudmFyIEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKVxuXG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lID0gbmV3IEdhbWUoe1xuICBzY2FsZTogNjQsXG4gIHdpZHRoOiAxMDI0LFxuICBoZWlnaHQ6IDc2OCxcbiAgZ3JpZFNpemU6IDEwLFxuICB0b3BNYXJnaW46IDE1MCxcbiAgY2FudmFzOiAnZ2FtZSdcbn0pXG5cbmdhbWUubG9hZExldmVsKDApXG5cbmdhbWUuc3RhcnQoKVxuXG4vLyBnYW1lLmxldmVsLnRpbGVzLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gICBnYW1lLmRyYXcoKVxuLy8gfVxuIiwidmFyIHB1YnN1YiA9IHJlcXVpcmUoJy4vbGliL3B1YnN1YicpXG52YXIgVGV4dHVyZSA9IHJlcXVpcmUoJy4vdGV4dHVyZScpXG5cbnZhciBTcHJpdGUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdGhpcy53aWR0aCA9IG9wdGlvbnMud2lkdGhcbiAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodFxuICB0aGlzLmZyYW1lcyA9IFtdXG4gIHRoaXMudGV4dHVyZSA9IG5ldyBUZXh0dXJlKG9wdGlvbnMudGV4dHVyZSlcbiAgdGhpcy50ZXh0dXJlLm9uKCdsb2FkJywgdGhpcy5jYWxjdWxhdGVGcmFtZXMuYmluZCh0aGlzKSlcbn1cblxudmFyIGFwaSA9IFNwcml0ZS5wcm90b3R5cGVcbnB1YnN1Yi5leHRlbmQoYXBpKVxuXG5hcGkuY2FsY3VsYXRlRnJhbWVzID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCdMT0FERUQgU1BSSVRFJywgdGhpcy50ZXh0dXJlLmltZy5zcmMpXG4gIHZhciB4ID0gKHRoaXMudGV4dHVyZS53aWR0aCAvIHRoaXMud2lkdGgpIHwgMFxuICB2YXIgeSA9ICh0aGlzLnRleHR1cmUuaGVpZ2h0IC8gdGhpcy5oZWlnaHQpIHwgMFxuXG4gIGZvciAodmFyIGl5ID0gMDsgaXkgPCB5OyBpeSsrKSB7XG4gICAgZm9yICh2YXIgaXggPSAwOyBpeCA8IHg7IGl4KyspIHtcbiAgICAgIHRoaXMuZnJhbWVzLnB1c2goe1xuICAgICAgICB4OiBpeCAqIHRoaXMud2lkdGgsXG4gICAgICAgIHk6IGl5ICogdGhpcy5oZWlnaHQsXG4gICAgICAgIHgyOiBpeCAqIHRoaXMud2lkdGggKyB0aGlzLndpZHRoLFxuICAgICAgICB5MjogaXkgKiB0aGlzLmhlaWdodCArIHRoaXMuaGVpZ2h0LFxuICAgICAgICB3OiB0aGlzLndpZHRoLFxuICAgICAgICBoOiB0aGlzLmhlaWdodFxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgdGhpcy50cmlnZ2VyKCdsb2FkJylcbn1cblxuYXBpLmRyYXcgPSBmdW5jdGlvbihjdHgsIGZyYW1lLCByZWN0KSB7XG4gIHZhciBmID0gdGhpcy5mcmFtZXNbZnJhbWVdXG4gIGlmICghZikgcmV0dXJuXG4gIGN0eC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLmltZyxcbiAgICBmLngsIGYueSwgZi53LCBmLmgsXG4gICAgcmVjdC54LCByZWN0LnksIHJlY3QudywgcmVjdC5oKVxufVxuXG5cblxuIiwiXG52YXIgU3dpdGNoID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBTd2l0Y2gocG9zKSB7XG4gIHRoaXMuZ2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpLmdhbWVcbiAgdGhpcy5wb3MgPSBwb3NcbiAgdGhpcy5zdGF0ZSA9IFN3aXRjaC5TVEFURS5PRkZcbn1cblxuU3dpdGNoLnByb3RvdHlwZS50dXJuT24gPSBmdW5jdGlvbihlbnQpIHtcbiAgaWYgKHRoaXMuc3RhdGUgPT09IFN3aXRjaC5TVEFURS5PRkYpIHtcbiAgICB0aGlzLnN0YXRlID0gU3dpdGNoLlNUQVRFLk9OXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuU3dpdGNoLnByb3RvdHlwZS50dXJuT2ZmID0gZnVuY3Rpb24oZW50KSB7XG4gIGlmICh0aGlzLnN0YXRlID09PSBTd2l0Y2guU1RBVEUuT04pIHtcbiAgICB0aGlzLnN0YXRlID0gU3dpdGNoLlNUQVRFLk9GRlxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cblN3aXRjaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XG59XG5cblN3aXRjaC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGN0eCkge1xuICB2YXIgZDJyID0gdGhpcy5nYW1lLmQyclxuICB2YXIgc2NhbGUgPSB0aGlzLmdhbWUuc2NhbGVcbiAgdGhpcy5nYW1lLmlzb0N0eChjdHgsIGZ1bmN0aW9uKCkge1xuICAgIGN0eC50cmFuc2xhdGUoXG4gICAgICB0aGlzLnBvcy54ICogc2NhbGUgKyBzY2FsZSAvIDIsXG4gICAgICB0aGlzLnBvcy55ICogc2NhbGUgKyBzY2FsZSAvIDJcbiAgICApXG5cbiAgICB2YXIgcmFkaXVzID0gc2NhbGUqMC4zXG5cbiAgICAvLyBmaWxsIHRoZSBzcXVhcmVcbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5zdGF0ZSA9PT0gU3dpdGNoLlNUQVRFLk9OID8gJyMwMEZGMDAnIDogJyNGRjAwMDAnXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LnJlY3QoLXNjYWxlLzIsIC1zY2FsZS8yLCBzY2FsZSwgc2NhbGUpXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuXG4gICAgLy8gZHJhdyB0aGUgcmVjaWV2ZXJcbiAgICBjdHguZmlsbFN0eWxlID0gJyNGRkZGRkYnXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LmFyYygwLCAwLCByYWRpdXMsIGQycigwKSwgZDJyKDM2MCkpXG4gICAgY3R4LmZpbGwoKVxuICAgIGN0eC5zdHJva2UoKVxuICB9LmJpbmQodGhpcykpXG59XG5cblN3aXRjaC5TVEFURSA9IHtcbiAgT04gOiAxLFxuICBPRkYgOiAwXG59XG4iLCJ2YXIgcHVic3ViID0gcmVxdWlyZSgnLi9saWIvcHVic3ViJylcblxudmFyIGNhY2hlID0ge31cblxudmFyIFRleHR1cmUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNyYykge1xuICBpZiAoY2FjaGVbc3JjXSkgcmV0dXJuIGNhY2hlW3NyY11cblxuICB0aGlzLmlzTG9hZGVkID0gZmFsc2VcbiAgdGhpcy5sb2FkKHNyYylcbiAgY2FjaGVbc3JjXSA9IHRoaXNcbn1cblxudmFyIGFwaSA9IFRleHR1cmUucHJvdG90eXBlXG5wdWJzdWIuZXh0ZW5kKGFwaSlcblxuYXBpLmxvYWQgPSBmdW5jdGlvbihzcmMpIHtcbiAgdmFyIGltZyA9IHRoaXMuaW1nID0gbmV3IEltYWdlKClcbiAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlXG4gICAgdGhpcy53aWR0aCA9IGltZy53aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gaW1nLmhlaWdodFxuICAgIHRoaXMudHJpZ2dlcignbG9hZCcpXG4gIH0uYmluZCh0aGlzKVxuICBpbWcuc3JjID0gc3JjXG59XG5cbiIsInZhciBwdWJzdWIgPSByZXF1aXJlKCcuL2xpYi9wdWJzdWInKVxudmFyIFRleHR1cmUgPSByZXF1aXJlKCcuL3RleHR1cmUnKVxuXG52YXIgVGlsZVNldCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3JjLCB3LCBoLCBveCwgb3kpIHtcbiAgdGhpcy53aWR0aCA9IHdcbiAgdGhpcy5oZWlnaHQgPSBoXG4gIHRoaXMub2Zmc2V0WCA9IG94XG4gIHRoaXMub2Zmc2V0WSA9IG95XG4gIHRoaXMuc3JjID0gc3JjXG5cbiAgdGhpcy50ZXh0dXJlID0gbmV3IFRleHR1cmUoc3JjKVxuICB0aGlzLmVjaG8oJ2xvYWQnLCB0aGlzLnRleHR1cmUpXG59XG5cbnB1YnN1Yi5leHRlbmQoVGlsZVNldC5wcm90b3R5cGUpXG5cbnZhciBwcm90byA9IFRpbGVTZXQucHJvdG90eXBlXG5cbnByb3RvLmRyYXcgPSBmdW5jdGlvbihjdHgsIHQsIHgsIHksIHcpIHtcbiAgdmFyIHN4ID0gdCAqIHRoaXMud2lkdGhcbiAgdmFyIHN5ID0gMFxuICB2YXIgc3cgPSB0aGlzLndpZHRoXG4gIHZhciBzaCA9IHRoaXMuaGVpZ2h0XG5cbiAgLy8gdGhlIHNjYWxlciBpcyB0aGUgd2lkdGggb2YgdGhlIGRlc3RpbmF0aW9uIHRpbGUgZGl2aWRlZFxuICAvLyBieSB0aGUgXCJ0cnVlXCIgd2lkdGggb2YgdGhlIHRpbGUgaW4gdGhlIGltYWdlXG4gIHZhciBzY2FsZXIgPSB3IC8gKHRoaXMud2lkdGggLSB0aGlzLm9mZnNldFgqMilcblxuICB2YXIgZHcgPSB0aGlzLndpZHRoICogc2NhbGVyXG4gIHZhciBkaCA9IHRoaXMuaGVpZ2h0ICogc2NhbGVyXG4gIHZhciBkeCA9IHggLSBkdyowLjVcbiAgdmFyIGR5ID0geSAtIHRoaXMub2Zmc2V0WSAqIHNjYWxlclxuXG4gIGN0eC5kcmF3SW1hZ2UodGhpcy50ZXh0dXJlLmltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoKVxufVxuXG4iLCJ2YXIgVGltZXIgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNlYykge1xuICB0aGlzLmJhc2UgPSBUaW1lci50aW1lXG4gIHRoaXMubGFzdCA9IFRpbWVyLnRpbWVcblxuICB0aGlzLnRhcmdldCA9IHNlYyB8fCAwXG59XG5cbnZhciBwcm90byA9IFRpbWVyLnByb3RvdHlwZVxuXG5wcm90by50YXJnZXQgPSAwXG5wcm90by5iYXNlID0gMFxucHJvdG8ubGFzdCA9IDBcbnByb3RvLnBhdXNlZEF0ID0gMFxuXG5wcm90by5zZXQgPSBmdW5jdGlvbihzZWMpIHtcbiAgdGhpcy50YXJnZXQgPSBzZWMgfHwgMFxuICB0aGlzLmJhc2UgPSBUaW1lci50aW1lXG4gIHRoaXMucGF1c2VkQXQgPSAwXG59XG5cbnByb3RvLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuYmFzZSA9IFRpbWVyLnRpbWVcbiAgdGhpcy5wYXVzZWRBdCA9IDBcbn1cblxucHJvdG8udGljayA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVsdGEgPSBUaW1lci50aW1lIC0gdGhpcy5sYXN0XG4gIHRoaXMubGFzdCA9IFRpbWVyLnRpbWVcbiAgcmV0dXJuIHRoaXMucGF1c2VkQXQgPyAwIDogZGVsdGFcbn1cblxucHJvdG8uZGVsdGEgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICh0aGlzLnBhdXNlZEF0IHx8IFRpbWVyLnRpbWUpIC0gdGhpcy5iYXNlIC0gdGhpcy50YXJnZXRcbn1cblxucHJvdG8ucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLnBhdXNlZEF0KVxuICAgIHRoaXMucGF1c2VkQXQgPSBUaW1lci50aW1lXG59XG5cbnByb3RvLnVucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMucGF1c2VkQXQpIHtcbiAgICB0aGlzLmJhc2UgKz0gVGltZXIudGltZSAtIHRoaXMucGF1c2VkQXRcbiAgICB0aGlzLnBhdXNlZEF0ID0gMFxuICB9XG59XG5cblRpbWVyLl9sYXN0ID0gMFxuVGltZXIudGltZSA9IE51bWJlci5NSU5fVkFMVUVcblRpbWVyLnRpbWVTY2FsZSA9IDFcblRpbWVyLm1heFN0ZXAgPSAwLjA1XG5cblRpbWVyLnN0ZXAgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnQgPSBEYXRlLm5vdygpXG4gIHZhciBkZWx0YSA9IChjdXJyZW50IC0gVGltZXIuX2xhc3QpIC8gMTAwMFxuICBUaW1lci50aW1lICs9IE1hdGgubWluKGRlbHRhLCBUaW1lci5tYXhTdGVwKSAqIFRpbWVyLnRpbWVTY2FsZVxuICBUaW1lci5fbGFzdCA9IGN1cnJlbnRcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGVxdWFsOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEueCA9PT0gYi54ICYmIGEueSA9PT0gYi55XG4gIH0sXG5cbiAgYWRkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMClcbiAgICB2YXIgdiA9IHsgeDowLCB5OjAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgdi54ICs9IGFyZ3NbaV0ueFxuICAgICAgdi55ICs9IGFyZ3NbaV0ueVxuICAgIH1cbiAgICByZXR1cm4gdlxuICB9LFxuXG4gIHN1YnRyYWN0OiBmdW5jdGlvbih2KSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgdiA9IHsgeDp2LngsIHk6di55IH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHYueCAtPSBhcmdzW2ldLnhcbiAgICAgIHYueSAtPSBhcmdzW2ldLnlcbiAgICB9XG4gICAgcmV0dXJuIHZcbiAgfVxuXG59XG4iXX0=
;