var _ = 0
var B = 'B'
var S = 'S'
var R = 'R'
var E = 'E'

module.exports = {
  name: 'First Level',

  tiles: {
    src: 'images/isotiles.png',
    w: 64,
    h: 64,
    ox: 4,
    oy: 16
  },

  grid: [
    [6,6,6,6,6],
    [6,6,6,6,6],
    [6,6,6,6,6]
  ],

  entityMap: [
    [_,_,B,_,_],
    [R,_,_,_,S],
    [_,_,E,_,_]
  ]
}
