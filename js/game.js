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
