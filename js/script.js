window.stats = new Stats();
stats.setMode(1); // 0: fps, 1: ms
stats.domElement.style.position = 'fixed';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

var Game = require('./game')
var Level = require('./level')

var game = window.game = new Game({
  scale: 64,
  width: 1024,
  height: 768,
  gridSize: 10,
  topMargin: 150,
  canvas: 'game'
})

game.loadLevel(Level)

game.start()

// game.level.tiles.onload = function() {
//   game.draw()
// }
