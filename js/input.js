var Input = module.exports = function(id) {
  var el = document.getElementById(id)
  el.addEventListener('touchstart', this.touchStart, false)
  el.addEventListener('touchmove', this.touchMove, false)
  el.addEventListener('touchend', this.touchEnd, false)
}


Input.prototype.touchStart = function(ev) {
  this.start = ev.touches[0]
  this.touchMove(ev)
  // this.previous = this.current
  // this.current = ev.touches[0]
  // this.current.x = this.current.screenX
  // this.current.y = this.current.screenY
}

Input.prototype.touchMove = function(ev) {
  this.previous = this.current
  this.current = ev.touches[0]
  this.current.x = this.current.screenX
  this.current.y = this.current.screenY
}

Input.prototype.touchEnd = function(ev) {
  this.previous = this.current
  this.current = null
  this.start = null
}
