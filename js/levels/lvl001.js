var pubsub = require('./lib/pubsub')
var inherits = require('./lib/inherits')
var Base = require('./levelBase')

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

var Level = module.exports = function Level(tiles) {
  Base.call(this, btn)

  this.tiles = tiles || new TileSet('../images/isotiles.png', 64, 64, 4, 16)

  var p1 = this.game.s2w({x:0, y:0})
  var p2 = this.game.s2w({x:0, y:this.game.scale})
  this.isoTileWidth = Math.abs(p2.x - p1.x)*2
}

inherits(Level, Base)

Level.prototype.tapped = function() {
  // pubsub.trigger('thing', [this])
}

Level.prototype.grid = [
  [6,6,6,6,6],
  [6,6,6,6,6],
  [6,6,6,6,6],
  [_,_,_,6,6],
  [6,6,_,6,6]
]

Level.prototype.entityMap = [
  [_,_,_,_,_],
  [_,R,_,B,_],
  [_,_,_,_,E],
  [_,_,S,_,_],
  [_,_,_,_,_]
]
