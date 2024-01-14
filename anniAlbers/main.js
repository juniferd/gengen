import {decimalToBinary} from '../src/utilities';

const content = document.getElementById('content');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const canvasGeo = document.createElement('canvas');
const ctxGeo = canvasGeo.getContext('2d');
const loading = document.getElementById('loading');
const about = document.getElementById('about');

const COLORS = [
  'rgba(255,10,10,.7)',
  'rgba(10,255,10,.7)',
  'rgba(10,10,255,.7)',
  'rgba(255,10,255,.7)',
  'rgba(10,255,255,.7)',
  'rgba(255,255,10,.7)',
];
const W = 500;
const H = 500;

function fillNumbers() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const unix = date.getTime();
  let res = '';
  const iters = [year, month, day, hour, minutes, seconds, milliseconds, unix];
  iters.forEach(num => {
    res += decimalToBinary(num, 20);
  });

  return res.split('');
}

function drawTime() {
  const binNums = fillNumbers();
  let i = 0;
  let j = 0;

  const step = 10;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (i === binNums.length) {
        i = 0;
      }
      if (j === COLORS.length) {
        j = 0;
      }
      const num = binNums[i];
      const color = COLORS[j];
      if (num === '1') {
        ctx.fillStyle = color;
      } else {
        ctx.fillStyle = 'rgba(255,255,255,.5)';
        j += 1;
      }
      ctx.fillRect(x, y, step, step);
      i += 1;
    }
  }
}

function drawLatLong(binLat, dirLat, binLong, dirLong, step) {
  let curr = 'LAT';
  let i = 0;
  let startAngle = 0;
  let endAngle = Math.PI;

  for (let x = 10; x < canvasGeo.width; x += step) {
    for (let y = 0; y < canvasGeo.height; y += step) {
      if (
        (curr === 'LAT' && i === binLat.length) ||
        (curr === 'LONG' && i === binLong.length)
      ) {
        i = 0;
        curr = curr === 'LAT' ? 'LONG' : 'LAT';
      }
      const num = curr === 'LAT' ? binLat[i] : binLong[i];
      const color =
        curr === 'LAT' ? 'rgba(155,100,100,.9)' : 'rgba(100,100,155,.9)';
      if ((curr === 'LAT' && dirLat === -1) || (curr === 'LONG' && dirLong === -1)) {
        startAngle = Math.PI;
        endAngle = 2 * Math.PI;
      } else {
        startAngle = 0;
        endAngle = Math.PI
      }
      if (num === '1') {
        ctxGeo.fillStyle = color;
        ctxGeo.beginPath();
        ctxGeo.ellipse(
          x,
          y,
          step / 2,
          step / 2,
          Math.PI,
          startAngle,
          endAngle,
        );
        ctxGeo.fill();
      }
      i += 1;
    }
  }
}

function init() {
  canvas.width = W;
  canvas.height = H;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, W, H);
  setInterval(drawTime, 1000);
  content.appendChild(canvas);
  loading.remove();
  about.classList.remove('hidden')

  function geoSuccess(position) {
    const binLat = decimalToBinary(
      Math.abs(Math.floor(position.coords.latitude)),
    ).split('');
    const binLong = decimalToBinary(
      Math.abs(Math.floor(position.coords.longitude)),
    ).split('');
    canvasGeo.width = W;
    canvasGeo.height = H;
    ctxGeo.fillStyle = 'white';
    ctxGeo.fillRect(0, 0, W, H);
    drawLatLong(binLat, Math.abs(position.coords.latitude) / position.coords.latitude, binLong, Math.abs(position.coords.longitude) / position.coords.longitude, 20);
    content.appendChild(canvasGeo);
  }

  function geoError() {}

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }
}

window.addEventListener('load', init);
