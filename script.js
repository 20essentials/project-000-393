const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let w,
  h,
  balls = [];

const mouse = {
  x: undefined,
  y: undefined
};

const color = [
  '0F172A',
  '1E40AF',
  '0E7490',
  'D97706',
  '16A34A',
  'E11D48',
  '9333EA',
  'FACC15',
  '14B8A6',
  'F43F5E'
];

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function easeOut(x) {
  return 1 - Math.pow(1 - x, 4);
}

function randomColor() {
  return `#${color[~~(Math.random() * color.length)]}`;
}

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function updateXandY(x, y) {
  mouse.x = x;
  mouse.y = y;

  for (let i = 0; i < 3; i++) {
    balls.push(new Ball());
  }
}

function mouseMove(e) {
  updateXandY(e.x, e.y);
}

function mouseOut() {
  mouse.x = undefined;
  mouse.y = undefined;
}

function initAll() {
  resizeCanvas();
  initDraw();
}

function initDraw() {
  drawBalls();

  let temp = [];
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].time <= balls[i].timeToLive) {
      temp.push(balls[i]);
    }
  }
  balls = temp;

  requestAnimationFrame(initDraw);
}

function drawBalls() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].draw();
  }
}

class Ball {
  constructor() {
    this.start = {
      x: mouse.x + getRandomInt(-30, 30),
      y: mouse.y + getRandomInt(-30, 30),
      size: getRandomInt(28, 38)
    };

    this.end = {
      x: this.start.x + getRandomInt(-300, 300),
      y: this.start.y + getRandomInt(-300, 300)
    };

    this.x = this.start.x;
    this.y = this.start.y;
    this.size = this.start.size;

    this.time = 0;
    this.timeToLive = 100;
  }

  draw() {
    context.fillStyle = randomColor();
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  }

  update() {
    if (this.time <= this.timeToLive) {
      let progress = 1 - (this.timeToLive - this.time) / this.timeToLive;
      this.size = this.start.size * (1 - easeOut(progress));
      this.x = this.x + (this.end.x - this.x) * 0.01;
      this.y = this.y + (this.end.y - this.y) * 0.01;
    }
    this.time++;
  }
}

function touchStart() {
  window.addEventListener('touchmove', touchMove);
  window.addEventListener('touchend', touchEnd);

  function touchMove(e) {
    const { clientX, clientY } = e.touches[0];

    updateXandY(clientX, clientY);

    window.addEventListener('touchend', touchEnd);
  }

  function touchEnd() {
    window.removeEventListener('touchmove', touchMove);
    window.removeEventListener('touchend', touchEnd);
  }
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', mouseMove);
window.addEventListener('mouseout', mouseOut);
window.addEventListener('DOMContentLoaded', initAll);
window.addEventListener('touchstart', touchStart);
