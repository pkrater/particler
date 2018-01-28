// some defaults

//const particles = [];
// const numParticles = 10
//const emitRate = 10;
//const emitBurstNum = 10;
//const continous = 1;
//const doBurst = false;
//let counter = 0;
// let ctx;
// let canvas;

const state = {
  emitRate: 10,
  particles: [],
  emitBurstNum: 10,
  continous: 1,
  doBurst: false,
  counter: 0,
};
// Generate a random rgba color for the particle
function getRandomColor() {
  let r = 0;
  let g = 0;
  let b = 0;
  while (r < 100 && g < 100 && b < 100) {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
  }
  return `rgba(${r},${g},${b},0.6)`;
}
// utilityfunction to get random numbers within a range
function getRandomInt(min, max) {
  const nMin = Math.ceil(min);
  const nMax = Math.floor(max);
  return Math.floor(Math.random() * (nMax - nMin)) + nMin;
  // The maximum is exclusive and the minimum is inclusive
}
// get random starting positions
function getRandomStart({ canvas }) {
  return {
    x: canvas.width * Math.random(),
    y: canvas.height * Math.random(),
  };
}

const particle = (obj) => {
  const defaultState = {
    x: state.canvas.width / 2, // canvas.width * Math.random();
    y: state.canvas.height / 2, // canvas.height * Math.random();
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
    shape: 'dot',
  };

  const innerState = Object.assign(defaultState, obj);
  // const innerState = { ...defaultState, ...obj };
  const checkBounce = (posX, posY) => {
    posX < 0 || posX > state.canvas.width ? (innerState.vx = -innerState.vx) : innerState.vx;
    posY < 0 || posY > state.canvas.height ? (innerState.vy = -innerState.vy) : innerState.vy;
  };

  function draw() {
    const { ctx, shape } = innerState; // console.log(innerState.shape);
    if (shape === 'dot') {
      ctx.fillStyle = innerState.color;
      ctx.fillRect(innerState.x, innerState.y, 4, 4);
    }
    if (shape === 'ball') {
      ctx.beginPath();
      ctx.arc(innerState.x, innerState.y, innerState.radius, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.fillStyle = innerState.color; // 'rgba(0,255,0,0.3)';
      ctx.lineWidth = 0;
      // ctx.strokeStyle = color;
      // ctx.stroke();
    }
  }

  function update() {
    
    innerState.vy += innerState.gravity;
    innerState.vx *= innerState.damping;
    innerState.vy *= innerState.damping;
    innerState.x += innerState.vx;
    innerState.y += innerState.vy;
    innerState.radius *= innerState.grow;
    // if true bounce on edges
    innerState.bounce ? checkBounce(innerState.x, innerState.y) : null;
  }

  const die = () => innerState.age++ > innerState.maxAge;

  return {
    // reset counter
    counter: 0,
    // draw the particle
    draw,
    // update the particle
    update,
    // if old enough set die to true
    die,
  };
};

function loop() {
  //console.log(state);
  const { canvas, ctx, emitRate } = state;
  //console.log(canvas, `the context: ${ctx}`);
  if (state.continous) {
    // console.log(`the counter: ${  counter}`);
    state.counter += 1;
    if (state.counter > emitRate) {
      if (state.doBurst) {
        burst(
          getRandomInt(state.emitBurstNum, 100),
          Object.assign(state, getRandomStart(state), {
            bounce: false,
            gravity: 0.03,
            damping: 0.99,
            shape: 'dot',
          }),
        );
      }
      state.counter -= state.counter;
      state.particles.push(particle(state));
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  state.particles.filter(part => !part.dead).forEach((part) => {
    part.update();
    part.draw();
    if (part.die()) {
      part.dead = true;
    }
  });

  requestAnimationFrame(loop);
}

export function burst(numParticles, obj) {
  for (let i = 0; i < numParticles; i++) particles.push(particle(obj));
  // particles = [...Array(numParticles)].map(part => particle(obj))
}

export function initEmitter(canvas, settings = {}) {
  if (!canvas.nodeName) {
    console.error('canvas not set, no canvas, no particles :(');
    return JSON.stringify({ ok: false, state: 'no canvas, no particles :(' });
  }
  // debugger
  // console.log(`canvas called ${canvas}`);
  Object.assign(state, settings, {
    canvas,
    ctx: canvas.getContext('2d'),
    // console.log(`context called ${state.ctx}`);
  });
  state.canvas.width = window.innerWidth;
  state.canvas.height = window.innerHeight;
  // console.log(state);
  loop();
  return state;
}
