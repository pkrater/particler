// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({4:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tester = tester;
exports.domChecker = domChecker;

var name = 'Joe';

function tester() {
  console.log("hello " + name);
  return name;
}

function domChecker(node) {
  return node;
}

/* export default {
    tester
}; */
},{}],5:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.burst = burst;
exports.initEmitter = initEmitter;
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

var state = {
  emitRate: 10,
  particles: [],
  emitBurstNum: 10,
  continous: 1,
  doBurst: false,
  counter: 0
};
// Generate a random rgba color for the particle
function getRandomColor() {
  var r = 0;
  var g = 0;
  var b = 0;
  while (r < 100 && g < 100 && b < 100) {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
  }
  return "rgba(" + r + "," + g + "," + b + ",0.6)";
}
// utilityfunction to get random numbers within a range
function getRandomInt(min, max) {
  var nMin = Math.ceil(min);
  var nMax = Math.floor(max);
  return Math.floor(Math.random() * (nMax - nMin)) + nMin;
  // The maximum is exclusive and the minimum is inclusive
}
// get random starting positions
function getRandomStart(_ref) {
  var canvas = _ref.canvas;

  return {
    x: canvas.width * Math.random(),
    y: canvas.height * Math.random()
  };
}

var particle = function particle(obj) {
  var defaultState = {
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
    shape: 'dot'
  };

  var innerState = Object.assign(defaultState, obj);
  // const innerState = { ...defaultState, ...obj };
  var checkBounce = function checkBounce(posX, posY) {
    posX < 0 || posX > state.canvas.width ? innerState.vx = -innerState.vx : innerState.vx;
    posY < 0 || posY > state.canvas.height ? innerState.vy = -innerState.vy : innerState.vy;
  };

  function draw() {
    var ctx = innerState.ctx,
        shape = innerState.shape; // console.log(innerState.shape);

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

  var die = function die() {
    return innerState.age++ > innerState.maxAge;
  };

  return {
    // reset counter
    counter: 0,
    // draw the particle
    draw: draw,
    // update the particle
    update: update,
    // if old enough set die to true
    die: die
  };
};

function loop() {
  //console.log(state);
  var canvas = state.canvas,
      ctx = state.ctx,
      emitRate = state.emitRate;
  //console.log(canvas, `the context: ${ctx}`);

  if (state.continous) {
    // console.log(`the counter: ${  counter}`);
    state.counter += 1;
    if (state.counter > emitRate) {
      if (state.doBurst) {
        burst(getRandomInt(state.emitBurstNum, 100), Object.assign(state, getRandomStart(state), {
          bounce: false,
          gravity: 0.03,
          damping: 0.99,
          shape: 'dot'
        }));
      }
      state.counter -= state.counter;
      state.particles.push(particle(state));
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  state.particles.filter(function (part) {
    return !part.dead;
  }).forEach(function (part) {
    part.update();
    part.draw();
    if (part.die()) {
      part.dead = true;
    }
  });

  requestAnimationFrame(loop);
}

function burst(numParticles, obj) {
  for (var i = 0; i < numParticles; i++) {
    particles.push(particle(obj));
  } // particles = [...Array(numParticles)].map(part => particle(obj))
}

function initEmitter(canvas) {
  var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!canvas.nodeName) {
    console.error('canvas not set, no canvas, no particles :(');
    return JSON.stringify({ ok: false, state: 'no canvas, no particles :(' });
  }
  // debugger
  // console.log(`canvas called ${canvas}`);
  Object.assign(state, settings, {
    canvas: canvas,
    ctx: canvas.getContext('2d')
    // console.log(`context called ${state.ctx}`);
  });
  state.canvas.width = window.innerWidth;
  state.canvas.height = window.innerHeight;
  // console.log(state);
  loop();
  return state;
}
},{}],2:[function(require,module,exports) {
"use strict";

var _mod = require("./mod");

var _particly = require("./particly");

(0, _mod.tester)();

var canvas = document.getElementById('canvas');
console.log(canvas);

(0, _particly.initEmitter)(canvas, {
  bounce: true,
  maxAge: 100,
  damping: 0.99,
  emitRate: 10,
  shape: 'ball'
});

// console.log(initEmitter(canvas));
},{"./mod":4,"./particly":5}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://' + window.location.hostname + ':49219/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,2])