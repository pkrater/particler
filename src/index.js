import { tester } from './mod';
import { initEmitter } from './particly';

tester();

const canvas = document.getElementById('canvas');
console.log(canvas);

initEmitter(canvas, {
  bounce: true,
  maxAge: 100,
  damping: 0.99,
  emitRate: 10,
  shape: 'ball',
});

// console.log(initEmitter(canvas));

