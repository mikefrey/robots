(function(){
  var _ = 0

  window.Level = function Level() {

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
    [_,R,_,_,_,_,_,_,_,_],
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

    isoCtx(ctx, function() {
      ctx.translate(0, game.topMargin)

      // draw the grid tiles
      for (var y = 0; y < grid.length; y+=1) {
        for (var x = 0; x < grid[y].length; x+=1) {
          // fill the tile
          ctx.fillStyle = grid[y][x] ? '#ececec' : '#ffffff'
          ctx.fillRect(x*scale, y*scale, scale, scale)
        }
      }

      // draw the grid lines
      ctx.strokeStyle = '#888888'
      for (var y = 0; y < grid.length; y+=1) {
        for (var x = 0; x < grid[y].length; x+=1) {
          if (grid[y][x]) {
            ctx.beginPath()
            ctx.rect(x*scale+0.5, y*scale+0.5, scale, scale)
            ctx.stroke()
          }
        }
      }

    })
  }

})()
