var pubsub = require('./lib/pubsub')
var inherits = require('./lib/inherits')
var Base = require('./levelBase')

var Level = module.exports = function Level() {

  Base.call(this, btn)
}

inherits(Level, Base)

Level.prototype.tapped = function() {
  // pubsub.trigger('queueButtonPressed', [this])
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
