var buttonDefs = require('./buttons')
var Button = require('./button')
// var Sprite = require('./sprite')

var ButtonManager = module.exports = function() {
  this.buttons = []
  for (var key in buttonDefs) {
    var btn = buttonDefs[key]
    // btn.sprite = new Sprite(btn.sprite, btn.width, btn.height)
    var button = new Button(btn.pos, btn.width, btn.height)
    var button = new Button(btn)
    this.buttons.push(button)
  }
}

ButtonManager.prototype.update = function() {
  for (var i = 0; i < this.buttons.length; i+=1) {
    this.buttons[i].update()
  }
}

ButtonManager.prototype.draw = function(ctx) {
  for (var i = 0; i < this.buttons.length; i+=1) {
    this.buttons[i].draw(ctx)
  }
}
