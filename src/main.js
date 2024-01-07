import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {generateLines} from './lsystem';
import {
  systemC,
  systemD,
  systemE,
  systemF,
  systemH,
  systemI,
} from './data/test.json';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 100, window.innerHeight - 200);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  15,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const controls = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.Color(0xf0f8ff);

// cube
// const geometry = new THREE.BoxGeometry(10, 10, 2);
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const lineMaterial = new THREE.LineBasicMaterial({
  color: 'tomato',
  linewidth: 2,
  linecap: 'round',
});
const [instructions, lines] = generateLines(systemH);
const divInstructions = document.createElement('div');
const shuffleButton = document.createElement('button');
document.body.append(shuffleButton);
document.body.append(divInstructions);
divInstructions.className = 'instructions';
shuffleButton.id = 'shuffle';
shuffleButton.innerHTML += 'shuffle';

const lSystem = new THREE.Group();

function shuffleSystems() {
  const SYSTEMS = [systemC, systemD, systemE, systemF, systemH, systemI];
  const index = Math.floor(Math.random() * SYSTEMS.length);
  const [instructions, lines] = generateLines(SYSTEMS[index]);

  createLinesFromLSystem(SYSTEMS[index], instructions, lines);
}

shuffleButton.addEventListener('click', () => {
  divInstructions.innerHTML = '';
  shuffleSystems();
});

function createLinesFromLSystem(system, instructions, lines) {
  lSystem.clear();
  divInstructions.innerHTML = '';
  lines.forEach(l => {
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
}

createLinesFromLSystem(systemH, instructions, lines);
lSystem.translateY(-15);

scene.add(lSystem);

camera.lookAt(0, 0, -20);
camera.position.set(0, 10, 90);
controls.update();

function animate() {
  requestAnimationFrame(animate);

  lSystem.rotateY(0.01);
  controls.update();

  renderer.render(scene, camera);
}

animate();

renderer.render(scene, camera);
