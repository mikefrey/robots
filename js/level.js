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
