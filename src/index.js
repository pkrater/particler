import { tester } from './mod';
import { initEmitter } from './particly';

tester();

const canvas = document.getElementById('canvas');
console.log(canvas);

initEmitter(canvas, {
  doBurst: true,
  bounce: true,
  maxAge: 100,
  damping: 0.99,
  emitRate: 10,
  shape: 'dot',
  continous: true,
})();

initEmitter(canvas, {
  bounce: true,
  maxAge: 100,
  damping: 0.99,
  emitRate: 10,
  shape: 'ball',
  continous: true,
})();
 /* initEmitter(canvas, {
  doBurst: true,
  continous: false,
  bounce: true,
  maxAge: 100,
  damping: 0.99,
  emitRate: 10,
  shape: 'dot',
});  */

// console.log(initEmitter(canvas));

