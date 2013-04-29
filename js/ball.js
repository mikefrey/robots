var ball = {

  // pos: { x:10, y:10 },
  pos: { x:5, y:1 },

  draw: function() {
    isoCtx(ctx, function() {
      ctx.translate(
        this.pos.x * SCALE + SCALE / 2,
        this.pos.y * SCALE + SCALE / 2
      )

      var radius = SCALE*0.3

      // ctx.fillStyle = '#CCCCCC'
      // ctx.beginPath()
      // ctx.arc(0, 0, radius, d2r(0), d2r(360))
      // ctx.fill()

      // ctx.rotate(-45 * Math.PI / 180)
      // ctx.scale(1, 2)

      ctx.fillStyle = '#7777FF'
      ctx.beginPath()
      ctx.arc(0, 0, radius, d2r(0), d2r(360))
      ctx.fill()
      ctx.stroke()
    }.bind(this))
  }

}

