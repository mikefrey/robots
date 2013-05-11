function TileSet(src, w, h, ox, oy) {
  this.width = w
  this.height = h
  this.offsetX = ox
  this.offsetY = oy
  this.isLoaded = false
  this.load(src)
}

TileSet.prototype.load = function(src) {
  var img = this.img = new Image()
  img.onload = function(){ this.isLoaded = true }.bind(this)
  img.src = src
}

TileSet.prototype.draw = function(ctx, t, x, y, w, h) {
  ctx.drawImage(
    this.img,
    t * this.width,
    t * this.height,
    this.width,
    this.height,
    x - this.offsetX,
    y - this.offsetY,
    w,
    h
  )
}


