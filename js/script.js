

var canvas = document.getElementById('game')
var ctx = canvas.getContext('2d')
var width = canvas.width
var height = canvas.height
var SCALE = 64
var GRIDSIZE = 10

var grid = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0],
  [1,1,1,0,0,0,0,0,0,0],
  [1,1,1,0,0,0,0,0,0,1]
]


function setupBackground() {

  var bgcanvas = document.getElementById('bg')
  var bgctx = bgcanvas.getContext('2d')

  isoCtx(bgctx, function() {

    // draw the unpassable areas of the grid
    bgctx.fillStyle = '#000000'
    for (var y = 0; y < grid.length; y+=1) {
      for (var x = 0; x < grid[y].length; x+=1) {
        if (grid[y][x]) {
          bgctx.fillRect(x*SCALE, y*SCALE, SCALE, SCALE)
        }
      }
    }

    // draw x grid lines
    for (var i = 0; i < GRIDSIZE+1; i+=1) {
      bgctx.beginPath()
      bgctx.moveTo(i*SCALE+0.5, 0)
      bgctx.lineTo(i*SCALE+0.5, SCALE*GRIDSIZE)
      bgctx.stroke()
    }

    // draw y grid lines
    for (var i = 0; i < GRIDSIZE+1; i+=1) {
      bgctx.beginPath()
      bgctx.moveTo(0, i*SCALE+0.5)
      bgctx.lineTo(SCALE*GRIDSIZE, i*SCALE+0.5)
      bgctx.stroke()
    }

  })

}

// transform the context into isometric
function isoCtx(ctx, fn) {
  ctx.save()
  ctx.translate(width/2, 0)
  ctx.scale(1, 0.5)
  ctx.rotate(45 * Math.PI / 180)
  // ctx.transform(0.707, 0.409, -0.707, 0.409, 0, 0)
  fn()
  ctx.restore()
}

var d2r = function(a) {
  return a * (Math.PI/180)
}
var r2d = function(a) {
  return a / (Math.PI/180)
}


setupBackground()

robot.draw()
ball.draw()

