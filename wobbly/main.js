const content = document.getElementById('content');
const canvas0 = document.getElementById('wobble-00');
const ctx0 = canvas0.getContext('2d');
const canvas1 = document.getElementById('wobble-01');
const ctx1 = canvas1.getContext('2d');
const canvas2 = document.getElementById('wobble-02');
const ctx2 = canvas2.getContext('2d');

function init() {
  drawContext0();
  drawContext1();
  drawContext2();
}

function drawContext2() {
  ctx2.fillStyle = 'white';
  ctx2.fillRect(0, 0, canvas1.width, canvas1.height);
  for (let i = 0; i < Math.PI * 8; i += Math.PI / 6) {
    const r = 155 - (i / Math.PI) * 26;
    const g = (i / Math.PI) * 13;
    const b = 155 - (i / Math.PI / 6.5);
    const color = `rgb(${r} ${g} ${b})`;
    wobble(
      ctx2,
      [
        x => 23.6 * Math.sin((Math.PI / 7) * x + i),
        () => (1 / 48) * i,
        x =>
          3.6 *
          Math.sin(
            (Math.PI / 8) * x + 12 + Math.sin((1 / 48) * x * i ** (1 / 4)),
          ),
      ],
      500,
      0,
      i * 26,
      color,
    );
  }
}

function drawContext1() {
  ctx1.fillStyle = 'white';
  ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
  for (let i = 0; i < Math.PI * 8; i += Math.PI / 6) {
    const gray = 155 - (i / Math.PI) * 26;
    const color = `rgb(${gray} ${gray} ${gray})`;
    wobble(
      ctx1,
      [
        x => 13.6 * Math.cos((Math.PI / 8) * x + i),
        () => (1 / 148) * i,
        x =>
          13.6 *
          Math.sin(
            (Math.PI / 8) * x + 12 + Math.sin((1 / 48) * x * i ** (1 / 4)),
          ),
      ],
      500,
      0,
      i * 20,
      color,
    );
  }
  // wobble(ctx1, [(x) => 13.6 * Math.cos(Math.PI / 8 * x) + 12, (x) => 1/(48)  , (x) => 13.6 * Math.sin(Math.PI / 8 * x + 12 + Math.sin(1/48 * x**(1/3)))], 500, 0, 150, 'blue')
  // wobble(ctx1, [(x) => 13.6 * Math.cos(Math.PI / 8 * x) + 12, (x) => 1/(48)  , (x) => 55], 500, 0, 50, 'red')
  // wobble(ctx1, [(x) => 13.6 * Math.cos(Math.PI / 8 * x) + 12, (x) => 1/(23)  , (x) => 55], 500, 0, 20, 'green')
}

function drawContext0() {
  ctx0.fillStyle = 'white';
  ctx0.fillRect(0, 0, canvas0.width, canvas0.height);

  for (let i = 0; i < 20; i++) {
    ctx0.rotate(Math.PI / i);
    sineWave(
      ctx0,
      2 * Math.PI * (i / 3),
      1.25 * (i + 1),
      35 * (20 - i),
      20 + i * 5,
      60 + i * 5,
      `rgb(${Math.floor(
        Math.abs(Math.sin((Math.PI * (i + 2)) / (i + 1))) * 255,
      )}, 80, ${Math.floor(
        Math.abs(Math.cos((Math.PI * (i + 3)) / (i + 1)) * 255),
      )})`,
    );
    ctx0.resetTransform(1, 0, 0, 1, 0, 0);
  }
}

function sineWave(
  ctx,
  wavelength = 2 * Math.PI,
  amplitude = 1,
  count = 1,
  originX = 50,
  originY = 50,
  color = 'red',
) {
  // bezier curve - this approximates a sine wave
  // B(t) = (1 - t)^3 * p1 + 3*(1 - t)^2 * t * h1 + 3 * (1 - t)* t^2 * h2 + t^3 * p2
  // p1 = (0, 0) first point
  // p2 = (2 * Math.PI, 0) second point
  // h1 = (u, v) bezier curve point
  // h2 = (2 * Math.PI - u, -v)
  // wavelength = 2 * Math.PI
  // amp = amplitude * wavelength / (2 * Math.PI)
  const v = (2 * Math.sqrt(3) * amplitude * wavelength) / (2 * Math.PI);
  const u = ((8 / 3 - Math.sqrt(3)) * wavelength) / 2;

  const start = {x: 0, y: 0};
  const end = {x: wavelength, y: 0};
  const cp1 = {x: u, y: v};
  const cp2 = {x: u, y: -v};

  ctx.strokeStyle = color;
  for (let i = 0; i < count; i++) {
    const translateX = originX + i * wavelength;
    const translateY = originY + amplitude * 2;
    ctx.translate(translateX, translateY);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.stroke();
    ctx.translate(-translateX, -translateY);
  }
}

function wobble(
  ctx,
  [a, b, c],
  width = 500,
  translateX = 10,
  translateY = 25,
  color = 'black',
) {
  // ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  ctx.translate(translateX, translateY);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  for (let x = 0; x < width; x++) {
    const y = a(x) * Math.sin(b(x) * x) + c(x);
    ctx.lineTo(x, y);
    ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(x, y);
    // ctx.ellipse(x, y, 1, 1, 1, 0, Math.PI * 2);
    // ctx.fill();
  }
  ctx.translate(-1 * translateX, -1 * translateY);
}

init();
