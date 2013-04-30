(function() {

  var robot = game.robot

  var btnLeft = document.getElementById('left')
  btnLeft.addEventListener('click', robot.enqueue.bind(robot, 'turnLeft'), false)

  var btnRight = document.getElementById('right')
  btnRight.addEventListener('click', robot.enqueue.bind(robot, 'turnRight'), false)

  var btnForward = document.getElementById('forward')
  btnForward.addEventListener('click', robot.enqueue.bind(robot, 'moveForward'), false)

  var btnBackward = document.getElementById('backward')
  btnBackward.addEventListener('click', robot.enqueue.bind(robot, 'moveBackward'), false)

  var btnPickup = document.getElementById('pickup')
  btnPickup.addEventListener('click', robot.enqueue.bind(robot, 'pickup'), false)

  var btnRelease = document.getElementById('release')
  btnRelease.addEventListener('click', robot.enqueue.bind(robot, 'release'), false)

  var btnStart = document.getElementById('start')
  btnStart.addEventListener('click', robot.start.bind(robot), false)


})()
