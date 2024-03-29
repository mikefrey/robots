var pubsub = require('./lib/pubsub')
var Texture = require('./texture')

var TileSet = module.exports = function(src, w, h, ox, oy) {
  this.width = w
  this.height = h
  this.offsetX = ox
  this.offsetY = oy
  this.src = src

  this.texture = new Texture(src)
  this.echo('load', this.texture)
}

pubsub.extend(TileSet.prototype)

var proto = TileSet.prototype

proto.draw = function(ctx, t, x, y, w) {
  var sx = t * this.width
  var sy = 0
  var sw = this.width
  var sh = this.height

  // the scaler is the width of the destination tile divided
  // by the "true" width of the tile in the image
  var scaler = w / (this.width - this.offsetX*2)

  var dw = this.width * scaler
  var dh = this.height * scaler
  var dx = x - dw*0.5
  var dy = y - this.offsetY * scaler

  ctx.drawImage(this.texture.img, sx, sy, sw, sh, dx, dy, dw, dh)
}

