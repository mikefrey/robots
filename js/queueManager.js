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
