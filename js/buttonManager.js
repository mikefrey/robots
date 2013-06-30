var buttonDefs = require('./buttons')
var Button = require('./button')
// var Sprite = require('./sprite')

var ButtonManager = module.exports = function() {
  this.buttons = []
  for (var key in buttonDefs) {
    var btn = buttonDefs[key]
    // var sprite = new Sprite(btn.sprite, btn.width, btn.height)
    var button = new Button(btn.pos, btn.width, btn.height)
    this.buttons.push[button]
  }
}

ButtonManager.prototype.update = function() {

}

ButtonManager.prototype.draw = function() {

}
