var Input = module.exports = function(id) {
  var el = document.getElementById(id)
  el.addEventListener('touchstart', this.touchStart.bind(this), false)
  el.addEventListener('touchmove', this.touchMove.bind(this), false)
  el.addEventListener('touchend', this.touchEnd.bind(this), false)
}


Input.prototype.touchStart = function(ev) {
  this.start = ev.touches[0]
  this.touchMove(ev)
}

Input.prototype.touchMove = function(ev) {
  this.previous = this.current
  this.current = ev.touches[0]
  this.current.x = this.current.clientX
  this.current.y = this.current.clientY
}

Input.prototype.touchEnd = function(ev) {
  this.previous = {
    start: this.start,
    end: this.current
  }
  this.current = null
  this.start = null
}
