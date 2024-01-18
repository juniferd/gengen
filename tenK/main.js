const content = document.getElementById('content');
const canvas0 = document.getElementById('canvas-0');
const ctx0 = canvas0.getContext('2d');
const COLORS = [
  'rgba(255,0,255,0.2)',
  'rgba(155,0,0,0.2)',
  'rgba(50,255,50,0.2)',
  'rgba(0,55,150,0.2)',
  'rgba(0,0,250,0.2)',
]

function init() {
  drawContext0();
}

function drawContext0() {
  const a = 0.8;
  const k = 0.1;
  ctx0.fillStyle = 'rgb(130,150,150)';
  ctx0.fillRect(0, 0, canvas0.width, canvas0.height);

  ctx0.translate(-10, -10);
  let j = 0;
  for (
    let i = Math.PI * 10;
    i < 30 * Math.PI;
    i += (30 * Math.PI - Math.PI * 10) / 10000
  ) {

    ctx0.fillStyle = COLORS[j % COLORS.length]
    const x = a * 0.5 * Math.cos(i) * Math.E ** (k * i) * Math.cos(i);
    const y = a * 0.5 * Math.cos(i) * Math.E ** (k * i) * Math.sin(i);
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

init();
