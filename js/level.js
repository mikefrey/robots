(function(){
  var _ = 0

  window.Level = function Level() {
    this.tiles = new TileSet('images/isotiles.png', 64, 64, 4, 16)
  }

  Level.prototype.grid = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,_,1,1,1,1,1,1,1],
    [1,1,_,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,_],
    [1,1,1,1,1,1,1,1,1,1],
    [_,_,_,1,1,1,1,1,1,1],
    [_,_,_,1,1,1,1,1,1,_]
  ]

  var B = Ball
  var S = Switch
  var R = Robot
  var E = Exit
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
    var scale = game.scale
    var grid = this.grid
    var tiles = this.tiles

    isoCtx(ctx, function() {

      // draw the grid tiles
      for (var y = 0; y < grid.length; y+=1) {
        for (var x = 0; x < grid[y].length; x+=1) {
          // fill the tile
          // ctx.fillStyle = grid[y][x] ? '#ececec' : '#ffffff'
          // ctx.fillRect(x*scale, y*scale, scale, scale)
          if (grid[y][x]) {
            // tiles.draw(ctx, 0, x*scale-0.5, y*scale-0.5, scale, scale)
            ctx.fillStyle = 'rgba(0,0,0,0.1)'
            ctx.fillRect(x*scale + scale*0.1, y*scale + scale*0.1, scale*0.8, scale*0.8)
          }
        }
      }

      // draw the grid lines
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



    var p1 = s2w({x:0, y:0})
    var p2 = s2w({x:0, y:scale})
    var screenScaleX = p2.x - p1.x
    var screenScaleY = p2.y - p1.y

    for (var y = 0; y < grid.length; y+=1) {
      for (var x = 0; x < grid[y].length; x+=1) {

        // var pos = s2w({x:x*scale+scale/2, y:y*scale+scale/2})
        // ctx.fillRect(pos.x-1.5, pos.y-1.5, 3, 3)

        var pos = s2w({x:x*scale, y:y*scale})
        ctx.fillRect(pos.x, pos.y, 1, 1)
        tiles.draw(ctx, 7, pos.x, pos.y, screenScaleX, screenScaleX)

      }
    }

  }

})()
