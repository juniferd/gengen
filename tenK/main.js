const canvas0 = document.getElementById('canvas-0');
const ctx0 = canvas0.getContext('2d');
const canvas1 = document.getElementById('canvas-1');
const ctx1 = canvas1.getContext('2d');
const canvas2 = document.getElementById('canvas-2');
const ctx2 = canvas2.getContext('2d');
const COLORS = [
  'rgba(255,0,255,0.2)',
  'rgba(155,0,0,0.2)',
  'rgba(50,255,50,0.2)',
  'rgba(0,55,150,0.2)',
  'rgba(0,0,250,0.2)',
]

function init() {
  drawContext0();
  drawContext1();
  drawContext2();
}

function drawContext2() {
  const a = .1;
  const k = .1;
  ctx2.fillStyle = '#DCCCFF';
  ctx2.fillRect(0, 0, canvas1.width, canvas1.height);

  ctx2.translate(300, 320);
  let j = 0;
  for (
    let i = 4 * Math.PI;
    i < 60 * Math.PI;
    i += (60 * Math.PI - (Math.PI * 4)) / 10000
  ) {

    ctx2.fillStyle = COLORS[j % COLORS.length]
    const [x, y] = spiral(a, k, () => 0.1, () => 0.1, i*2)
    ctx2.beginPath();
    ctx2.ellipse(
      x,
      y,
      15 * Math.abs(Math.cos(i)) + 1,
      8 * Math.abs(Math.sin(i)) + 1,
      1,
      0,
      2 * Math.PI,
    );
    ctx2.fill();
    j += 1;
  }
  ctx2.translate(-100, -100);

}

function drawContext1() {
  const a = 0.1;
  const k = 0.1;
  ctx1.fillStyle = '#A0B9C6';
  ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

  ctx1.translate(-10, -10);
  let j = 0;
  for (
    let i = Math.PI * 10;
    i < 30 * Math.PI;
    i += (30 * Math.PI - Math.PI * 10) / 10000
  ) {

    ctx1.fillStyle = COLORS[j % COLORS.length]
    const [x, y] = spiral(a, k, () => 1, () => Math.sin(i), i)
    ctx1.beginPath();
    ctx1.ellipse(
      x,
      y,
      15 * Math.abs(Math.cos(i)) + 1,
      5 * Math.abs(Math.sin(i)) + 1,
      1,
      0,
      2 * Math.PI,
    );
    ctx1.fill();
    j += 1;
  }

}

function drawContext0() {
  const a = 0.8;
  const k = 0.1;
  ctx0.fillStyle = '#C4CBCA';
  ctx0.fillRect(0, 0, canvas0.width, canvas0.height);

  ctx0.translate(-10, -10);
  let j = 0;
  for (
    let i = Math.PI * 10;
    i < 30 * Math.PI;
    i += (30 * Math.PI - Math.PI * 10) / 10000
  ) {

    ctx0.fillStyle = COLORS[j % COLORS.length]
    const [x, y] = spiral(a, k, () => Math.cos(i), () => Math.cos(i), i)
    ctx0.beginPath();
    ctx0.ellipse(
      x,
      y,
      5 * Math.abs(Math.sin(i)) + 1,
      5 * Math.abs(Math.sin(i)) + 1,
      1,
      0,
      2 * Math.PI,
    );
    ctx0.fill();
    j += 1;
  }
}

function spiral(a = 0.8, k = 0.1, fx = () => 1, gx = () => 1, i = 1) {
    const x = a * 0.5 * fx() * Math.E ** (k * i) * Math.cos(i);
    const y = a * 0.5 * gx() * Math.E ** (k * i) * Math.sin(i);
  return [x, y]

}

init();
