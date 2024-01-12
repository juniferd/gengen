import imgSrc from './img/pattern.png';

const main = document.getElementById('main');
const content = document.getElementById('content');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});

const canvasGray = document.createElement('canvas');
const ctxGray = canvasGray.getContext('2d');
const img = new Image();

const canvasText = document.createElement('canvas')
const ctxText = canvasText.getContext('2d', {willReadFrequently: true})

const asciiDiv = document.createElement('div');
main.appendChild(asciiDiv)

const ASCIIS = [
  '.',
  ':',
  '-',
  '\\',
  '*',
  'n',
  'z',
  'O',
  'Z',
  'N',
  '@',
  '#',
  '¶',
  '▓',
  '█',
];
ASCIIS.reverse();

img.crossOrigin = 'anonymous';
img.src = imgSrc;


img.addEventListener('load', () => {
  canvas.width = 500;
  canvas.height = 500;
  const ht = Math.floor(img.height / (img.width / 500));
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 500, ht);
  ctx.drawImage(img, 0, 0, 500, ht);
  content.appendChild(canvas);
  createGrayscale();
  createASCII();
});

function createGrayscale() {
  canvasGray.width = 500;
  canvasGray.height = 500;

  for (let x = 0; x < canvasGray.width; x++) {
    for (let y = 0; y < canvasGray.height; y++) {
      const {data} = ctx.getImageData(x, y, 1, 1);
      const color = getGrayscalePixel(data);
      ctxGray.fillStyle = `rgb(${color} ${color} ${color})`;
      ctxGray.fillRect(x, y, 1, 1);
    }
  }
  content.appendChild(canvasGray);
}

function getGrayscalePixel(data, print=false) {
  let r = 0,
    g = 0,
    b = 0;
  data.forEach((pt, i) => {
    if (i % 4 === 0) {
      r += pt;
    } else if (i % 4 === 1) {
      g += pt;
    } else if (i % 4 === 2) {
      b += pt;
    }
  });
  if (print) {
    console.log(r, g, b)
  }
  const tot = Math.floor(data.length / 4);
  return 0.2126 * (r/tot) + 0.7152 * (g/tot) + 0.0722 * (b/tot);
}

function createASCII() {
  canvasText.width = 500;
  canvasText.height = 500;
  const SIZE = 12;
  ctxText.font = `${SIZE}px monospace`;
  for (let i = 0; i < canvasText.width; i+= SIZE) {
    for (let j = 0; j < canvasText.height; j += SIZE) {
      const {data} = ctxGray.getImageData(i, j, SIZE, SIZE);
      const gray = getGrayscalePixel(data, true)
      const chr = getASCII(gray)
      ctxText.fillText(chr, i, j);
      console.log(gray)
    }
  }
  content.appendChild(canvasText)
}

const ASCII_INCREMENT = 255 / (ASCIIS.length + 1);
function getASCII(val) {
  const index = Math.floor(val / ASCII_INCREMENT)
  return ASCIIS[index] || ''
}


asciiDiv.className = 'ascii'
asciiDiv.innerHTML += ASCIIS.join('')
