
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
  [_,_,_,_,_,_,_,_,_,_],
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
