import imgSrc from './img/pattern.png';

const main = document.getElementById('main');
const content = document.getElementById('content');
const loading = document.getElementById('loading');
const about = document.getElementById('about');
const btnSnapshot = document.getElementById('btnDownload');
const inputFile = document.getElementById('imgFile')
const labelInputFile = document.getElementById('labelImgFile')
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});

const canvasGray = document.createElement('canvas');
const ctxGray = canvasGray.getContext('2d', {willReadFrequently: true});
const img = new Image();

const canvasText = document.createElement('canvas');
const ctxText = canvasText.getContext('2d', {willReadFrequently: true});

const asciiDiv = document.createElement('div');
main.appendChild(asciiDiv);

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

let imgHeight = 500;
let loadedImages = false;

img.addEventListener('load', () => {
  canvas.width = 500;
  imgHeight = Math.floor(img.height / (img.width / 500));
  canvas.height = imgHeight;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 500, imgHeight);
  ctx.drawImage(img, 0, 0, 500, imgHeight);
  content.appendChild(canvas);
  if (loading) {
    loading.remove();
    about.classList.remove('hidden');
  }
  createGrayscale();
  createASCII();
  URL.revokeObjectURL(img.src)
  labelInputFile.classList.remove('disabled');
  imgFile.disabled = false;
  btnSnapshot.disabled = false;
  loadedImages = true;
});

function createGrayscale() {
  canvasGray.width = 500;
  canvasGray.height = imgHeight;

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

function getGrayscalePixel(data, print = false) {
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
    console.log(r, g, b);
  }
  const tot = Math.floor(data.length / 4);
  return 0.2126 * (r / tot) + 0.7152 * (g / tot) + 0.0722 * (b / tot);
}

function createASCII() {
  canvasText.width = 500;
  canvasText.height = imgHeight;
  ctxText.fillStyle = 'white';
  ctxText.fillRect(0, 0, 500, imgHeight);
  const SIZE = 12;
  const rnd = Math.floor(Math.random() * 255);
  ctxText.font = `${SIZE}px monospace`;
  for (let i = 0; i < canvasText.width; i += SIZE) {
    for (let j = 0; j < canvasText.height; j += SIZE) {
      ctxText.fillStyle = `rgb(${Math.floor(
        i - 32.5 * (500 / SIZE / 255))}, ${Math.floor(j * (500 / SIZE / 255))}, ${rnd})`;
      const {data} = ctxGray.getImageData(i, j, SIZE, SIZE);
      const gray = getGrayscalePixel(data);
      const chr = getASCII(gray);
      ctxText.fillText(chr, i - 3, j + 8);
    }
  }
  content.appendChild(canvasText);
}

const ASCII_INCREMENT = 255 / (ASCIIS.length + 1);
function getASCII(val) {
  const index = Math.floor(val / ASCII_INCREMENT);
  return ASCIIS[index] || '';
}

asciiDiv.className = 'ascii';
asciiDiv.innerHTML += ASCIIS.join('');

// TODO extract into shared component
function createSnapshot() {
  const snapshot = canvasText.toDataURL('image/jpeg', 1.0);
  const a = document.createElement('a');
  a.href = snapshot;
  a.download = 'ascii.jpeg';
  a.click();
}

function handleFileChange(e) {
  loadedImages = false;
  labelInputFile.classList.add('disabled')
  imgFile.disabled = true;
  btnSnapshot.disabled = true;
  img.src = URL.createObjectURL(e.target.files[0])
  setTimeout(checkTimeout, 5000)
}

function checkTimeout() {
  if (!loadedImages) {
    alert('something went wrong - try a different image')
    labelInputFile.classList.remove('disabled');
    imgFile.disabled = false;
    btnSnapshot.disabled = false;
  }
}

inputFile.placeholder = 'try with your own image';
inputFile.addEventListener('change', handleFileChange)

btnSnapshot.addEventListener('click', createSnapshot);
