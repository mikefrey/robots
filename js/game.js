function Game(opts) {
  this.scale = opts.scale
  var width = this.width = opts.width
  var height = this.height = opts.height
  this.gridSize = opts.gridSize
  this.topMargin = opts.topMargin

  // setup the canvases
  this.ctx = initCanvas(opts.canvas, width, height)
  this.bgctx = initCanvas(opts.bgcanvas, width, height)

  // move the game board down a bit
  this.ctx.translate(0, this.topMargin)
  this.bgctx.translate(0, this.topMargin)

  this.level = new Level()
  this.loadEntities()
}

// starts the game loop
Game.prototype.start = function() {
  this.loop()
}

// suspends the game loop
Game.prototype.stop = function() {
  cancelAnimationFrame(this.rAFID)
}
Game.prototype.pause = Game.prototype.stop

// the game loop
Game.prototype.loop = function() {
  this.rAFID = requestAnimationFrame(this.loop.bind(this), this.ctx.canvas)

  stats.begin();

  this.update()
  this.draw()

  stats.end();
}

// update all the things
Game.prototype.update = function() {
  for (var i = 0; i < this.entities.length; i+=1) {
    this.entities[i].update()
  }
}

// draw all the things
Game.prototype.draw = function() {
  // draw the level
  this.level.draw(this.bgctx)
  // draw each entity
  for (var i = 0; i < this.entities.length; i+=1) {
    this.entities[i].draw(this.ctx)
  }
}

// get the entity at the given position
Game.prototype.entityAt = function(pos, type) {
  var entities = this.entities
  for (var i = 0; i < entities.length; i+=1) {
    var ent = entities[i]
    if (vector2.equal(ent.pos, pos) && ent instanceof type) {
      return ent
    }
  }
  return null
}

// load the entities from the level
Game.prototype.loadEntities = function() {
  var ents = this.entities = []
  var map = this.level.entityMap
  for (var y = 0; y < map.length; y+=1) {
    for (var x = 0; x < map[y].length; x+=1) {
      var Ent = map[y][x]
      if (Ent) {
        // create the entity
        var ent = new Ent({x:x,y:y})
        // check to see if it's the robot
        if (ent instanceof Robot) this.robot = ent
        // add it to the entity collection
        ents.push(ent)
      }
    }
  }
}

// setup canvase elements to the correct size
function initCanvas(id, width, height) {
  var canvas = document.getElementById(id)
  canvas.width = width
  canvas.height = height
  return canvas.getContext('2d')
}


// transform the context into isometric
function isoCtx(ctx, fn) {
  ctx.save()
  ctx.translate(game.width/2, 0)
  ctx.scale(1, 0.5)
  ctx.rotate(45 * Math.PI / 180)
  // ctx.transform(0.707, 0.409, -0.707, 0.409, 0, 0)
  fn()
  ctx.restore()
}

// degrees to radians
var d2r = function(a) {
  return a * (Math.PI/180)
}
// radians to degress
var r2d = function(a) {
  return a / (Math.PI/180)
}
