import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {generateLines} from '../src/lsystem.js';
import {
  systemC,
  systemD,
  systemE,
  systemF,
  systemH,
  systemI,
} from '../src/data/test.json';

const renderer = new THREE.WebGLRenderer();
const main = document.getElementById('main');
const buttonRow = document.getElementById('buttons');
const loading = document.getElementById('loading');

renderer.setSize(window.innerWidth - 100, window.innerHeight - 200);
main.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  15,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const controls = new OrbitControls(camera, renderer.domElement);

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x6b705c,
  linewidth: 2,
  linecap: 'round',
});

const lSystem = new THREE.Group();

function shuffleSystems() {
  const SYSTEMS = [systemC, systemD, systemE, systemF, systemH, systemI];
  const index = Math.floor(Math.random() * SYSTEMS.length);
  const [instructions, lines] = generateLines(SYSTEMS[index]);

  createLinesFromLSystem(SYSTEMS[index], instructions, lines);
}

function createLinesFromLSystem(system, instructions, lines) {
  lSystem.clear();
  divInstructions.innerHTML = '';

  lines.forEach(l => {
    // TODO: change this to an extrude geometry
    const geo = new THREE.BufferGeometry().setFromPoints(l);
    const newLine = new THREE.Line(geo, lineMaterial);

    lSystem.add(newLine);
  });

  divInstructions.innerHTML += `<h3>${system.name}</h3>`;
  divInstructions.innerHTML += `<p><strong>seed</strong>: ${JSON.stringify(
    system.axiom,
  )}</p>`;
  divInstructions.innerHTML += `<p><strong>rules</strong>: ${JSON.stringify(
    system.rules,
  )}</p>`;
  divInstructions.innerHTML += `<p><strong>iterations</strong>: ${JSON.stringify(
    system.iterations,
  )}</p>`;
  divInstructions.innerHTML += `<p>final output: ${instructions}</p>`;
  loading.remove();
}

function animate() {
  requestAnimationFrame(animate);

  lSystem.rotateY(0.01);
  controls.update();

  renderer.render(scene, camera);
}

const [instructions, lines] = generateLines(systemH);
const divInstructions = document.createElement('div');
const shuffleButton = document.createElement('button');
const resetButton = document.createElement('button');

main.append(divInstructions);
divInstructions.className = 'instructions';

buttonRow.append(shuffleButton);
shuffleButton.id = 'shuffle';
shuffleButton.innerHTML += 'shuffle';

shuffleButton.addEventListener('click', () => {
  divInstructions.innerHTML = '';
  shuffleSystems();
});

buttonRow.append(resetButton);
resetButton.id = 'reset';
resetButton.innerHTML += 'reset camera';

resetButton.addEventListener('click', () => {
  controls.reset();
});

scene.background = new THREE.Color(0xffffff);
createLinesFromLSystem(systemH, instructions, lines);
lSystem.translateY(-15);

scene.add(lSystem);

camera.lookAt(0, 0, -20);
camera.position.set(0, 10, 90);
controls.update();
controls.saveState();

animate();

renderer.render(scene, camera);
