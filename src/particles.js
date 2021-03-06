export const particleS = () => {
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const particles = []
//const numParticles = 10
const emitRate = 20
const emitBurstNum = 10
const continous = 1
let counter = 0

function getRandomColor() {
  let r = 0
  let g = 0
  let b = 0
  while (r < 100 && g < 100 && b < 100) {
    r = Math.floor(Math.random() * 256)
    g = Math.floor(Math.random() * 256)
    b = Math.floor(Math.random() * 256)
  }

  return `(rgb('${r},${g},${b}')`
}
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}

window.addEventListener('click', clickBurst)

window.addEventListener('touchstart', clickBurst)

function clickBurst(e) {
  //console.log(e);
  const x = e.clientX || e.touches[0].clientX
  const y = e.clientY || e.touches[0].clientY
  //spawnNew({x, y}, numParticles);
  burst(10, {x, y, damping: 0.9, shape: 'dot'})
}

function burst(numParticles, obj) {
  //console.log(obj)
  //particles = [];
  for (let i = 0; i < numParticles; i++) particles.push(particle(obj))
  //particles = [...Array(numParticles)].map(part => particle(obj))
  //console.log(particles)
}

function startEmitter() {
  //let setup = Object.assign(obj, {gravity: 0.02, bounce: false});
  //burst(10, setup);
  loop()
}

const particle = (context, obj) => {
  const defaults = {
    x: canvas.width / 2, // canvas.width * Math.random();
    y: canvas.height / 2, //canvas.height * Math.random();
    vx: 4 * Math.random() - 2,
    vy: 4 * Math.random() - 2,
    color: getRandomColor(),
    age: 0,
    maxAge: getRandomInt(10, 100),
    bounce: false,
    gravity: 0,
    emitRate: 200,
    damping: 0.95,
    radius: 2,
    grow: 1.02,
  }

  // create variables adding passed object parameters to defaults
  /* let {
    x,
    y,
    vx,
    vy,
    gravity,
    bounce,
    damping,
    age,
    maxAge,
    color,
    radius,
    grow,
  } = Object.assign(defaults, obj) */

  const data = Object.assign(defaults, obj)

  const checkBounce = (posX, posY) => {
    posX < 0 || posX > canvas.width ? (data.vx = -data.vx) : data.vx
    posY < 0 || posY > canvas.height ? (data.vy = -data.vy) : data.vy
  }

  function draw(c = context, shape = 'dot') {
    if (shape === 'dot') {
      c.fillStyle = data.color
      c.fillRect(data.x, data.y, 4, 4)
    }
    if (shape === 'ball') {
      c.beginPath()
      c.arc(data.x, data.y, data.radius, 0, 2 * Math.PI, false)
      c.fill()
      c.fillStyle = 'rgba(0,255,0,0.3)'
      c.lineWidth = 0
      //ctx.strokeStyle = color;
      //ctx.stroke();
    }
  }

  function update() {
    data.vy += data.gravity
    data.vx *= data.damping
    data.vy *= data.damping
    data.x += data.vx
    data.y += data.vy
    data.radius *= data.grow
    // if true bounce on edges
    data.bounce ? checkBounce(data.x, data.y) : null
  }

  const die = () => data.age++ > data.maxAge

  return {
    //reset counter
    counter: 0,
    // draw the particle
    draw,
    //update the particle
    update,
    // if old enough set die to true
    die,
  }
}

function loop() {
  if (continous) {
    if (counter++ > emitRate) {
      burst(getRandomInt(emitBurstNum, 100), {
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random(),
        bounce: true,
        gravity: 0.03,
        damping: 0.99,
      })
      counter = 0
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles.filter(part => !part.dead).forEach(part => {
    part.update()
    part.draw(ctx, 'ball')
    if (part.die()) {
      part.dead = true
    }
  })

  requestAnimationFrame(loop)
}

//initialize particles
startEmitter()

}
