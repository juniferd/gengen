import img0 from './img/allegory.jpg';
import img1 from './img/feeding_the_bird.jpg';
import img2 from './img/madonna_and_child.jpg';
import img3 from './img/oedipus_cursing_his_son_polynices.jpg';
import img4 from './img/portrait_of_a_man.jpg';
import img5 from './img/still_life_with_milk_jug_and_fruit.jpg';
import img6 from './img/the_healing_of_the_paralytic.jpg';
import img7 from './img/young_woman_with_a_butterfly.jpg';

const content = document.getElementById('content');
const canvas = document.createElement('canvas');
const canvasPixel = document.createElement('canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});
const ctxPixel = canvasPixel.getContext('2d');
const img = new Image();
const loading = document.getElementById('loading');
const about = document.getElementById('about');
let step = 10;
const imgs = [img0, img1, img2, img3, img4, img5, img6, img7];

img.crossOrigin = 'anonymous';
img.src = imgs[1];

img.addEventListener('load', () => {
  step = 10;
  canvas.width = 500;
  canvas.height = 500;
  const ht = Math.floor(img.height / (img.width / 500));
  ctx.drawImage(img, 0, 0, 500, ht);
  content.appendChild(canvas);
  createPixels();
  loading.remove();
  about.classList.remove('hidden');
});

function createPixels(step = 10) {
  canvasPixel.width = 500;
  canvasPixel.height = 500;
  ctxPixel.clearRect(0, 0, 500, 500);
  const ht = Math.floor(img.height / (img.width / 500));

  for (let i = 0; i < canvas.width; i += step) {
    for (let j = 0; j < ht; j += step) {
      const {data} = ctx.getImageData(i, j, step, step);
      const [r, g, b] = getAverageRGB(data);
      ctxPixel.fillStyle = `rgb(${r} ${g} ${b})`;
      ctxPixel.fillRect(i, j, step, step);
    }
  }
  content.appendChild(canvasPixel);
}

function getAverageRGB(data) {
  let r = 0,
    g = 0,
    b = 0;
  data.forEach((pixel, index) => {
    if (index % 4 === 0) {
      r += pixel;
    } else if (index % 4 === 1) {
      g += pixel;
    } else if (index % 5 === 2) {
      b += pixel;
    }
  });
  const totNum = Math.floor(data.length / 4);
  return [r / totNum, g / totNum, b / totNum];
}

const buttonRow = document.getElementById('buttons');
const shuffle = document.createElement('button');
shuffle.innerHTML = 'shuffle';

buttonRow.append(shuffle);

shuffle.addEventListener('click', () => {
  const i = Math.floor(Math.random() * imgs.length);
  img.src = imgs[i];
});

const increase = document.createElement('button');
increase.innerHTML = '+';

buttonRow.append(increase);

increase.addEventListener('click', () => {
  step += 10;
  createPixels(step);
});

const decrease = document.createElement('button');
decrease.innerHTML = '-';

buttonRow.append(decrease);

decrease.addEventListener('click', () => {
  if (step >= 20) {
    step -= 10;
  }
  createPixels(step);
});

// TODO extract into shared component
function createSnapshot() {
  const snapshot = canvasPixel.toDataURL('image/jpeg', 1.0);
  const a = document.createElement('a');
  a.href = snapshot;
  a.download = 'pixel.jpeg';
  a.click();
}
const btnSnapshot = document.createElement('button');
btnSnapshot.addEventListener('click', createSnapshot);
btnSnapshot.innerHTML = 'download image';
buttons.appendChild(btnSnapshot);
