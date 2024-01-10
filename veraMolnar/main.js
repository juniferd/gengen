import {toRadians} from '../src/utilities';

const canvas = document.getElementById('molnar');
const ctx = canvas.getContext('2d');
const buttons = document.getElementById('buttons');
canvas.width = 500;
canvas.height = 500;

function drawLines(translateX) {
  ctx.lineWidth = Math.floor(Math.random() * 10);
  const randColor = Math.floor(Math.random() * 255);

  const lines = Array(100)
    .fill('')
    .map((_, i) => i);

  lines.forEach((x, i) => {
    const newX = x * i;
    const rgb = `rgb(${Math.floor(255 - i * 10)}, ${
      Math.floor((i / 20) * 25) + 25
    }, ${randColor})`;

    ctx.lineWidth = i % 3;
    ctx.strokeStyle = rgb;
    ctx.shadowColor = rgb;
    ctx.shadowBlur = 5;
    ctx.lineJoin = 'round';
    ctx.rotate(Math.random() * 5 * toRadians(0.2 * i));
    ctx.strokeRect(newX - 3, newX, newX + 120 * Math.random(), newX + 20);
    ctx.translate(translateX, 0);
  });
}

function createSnapshot() {
  const snapshot = canvas.toDataURL('image/jpeg', 1.0);
  const a = document.createElement('a');
  a.href = snapshot;
  a.download = 'molnar-ish.jpeg';
  a.click();
}

function draw() {
  // clear
  try {
    ctx.reset();
  } catch (err) {
    console.log('cannot reset');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }
  // set canvas background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 10; i++) {
    drawLines(i * 5);
  }
}

const btnRedraw = document.createElement('button');
btnRedraw.addEventListener('click', draw);
btnRedraw.innerHTML = 'redraw';
buttons.appendChild(btnRedraw);

const btnSnapshot = document.createElement('button');
btnSnapshot.addEventListener('click', createSnapshot);
btnSnapshot.innerHTML = 'download image';
buttons.appendChild(btnSnapshot);

draw();
