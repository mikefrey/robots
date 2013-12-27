var pubsub = require('./lib/pubsub')
var inherits = require('./lib/inherits')
var Button = require('./button')

var QueueButton = module.exports = function QueueButton(button, pos) {
  var btn = {
    pos: pos,
    width: 40,
    height: 40,
    sprite: button.sprite,
    frameOff: button.frameOff,
    frameOn: button.frameOn,
    command: button.command
  }
  Button.call(this, btn)
}

inherits(QueueButton, Button)

var proto = QueueButton.prototype

proto.tapped = function() {
  pubsub.trigger('queueButtonPressed', [this])
}

proto.draw = function(ctx, current) {
  // draw a border around the button being executed
  this.state = Button.STATE.NORMAL
  if (current) {
    // ctx.save()
    // ctx.translate(this.pos.x, this.pos.y)
    // ctx.strokeRect(-2, -2, this.width+4, this.height+4)
    // ctx.restore()
    this.state = Button.STATE.DOWN
  }

  Button.prototype.draw.call(this, ctx)
}
