module.exports = {

  forward: {
    pos: { x:0, y:0 },
    width:32,
    height:32,
    sprite: '',
    command: 'moveForward'
  },

  backward: {
    pos: { x:32, y:0 },
    width:32,
    height:32,
    sprite: '',
    command: 'moveBackward'
  },

  left: {
    pos: { x:64, y:0 },
    width:32,
    height:32,
    sprite: '',
    command: 'turnLeft'
  },

  right: {
    pos: { x:96, y:0 },
    width:32,
    height:32,
    sprite: '',
    command: 'turnRight'
  },

  pickup: {
    pos: { x:128, y:0 },
    width:32,
    height:32,
    sprite: '',
    command: 'pickup'
  },

  release: {
    pos: { x:154, y:0 },
    width:32,
    height:32,
    sprite: '',
    command: 'release'
  }

}
