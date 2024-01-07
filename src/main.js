import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { generateLines } from './lsystem';
import { systemF } from './data/test.json'

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 100, window.innerHeight - 200);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  15,
  window.innerWidth / window.innerHeight,
  .1,
  1000,
);
const controls = new OrbitControls(camera, renderer.domElement)

scene.background = new THREE.Color(0xf0f8ff)

// cube
// const geometry = new THREE.BoxGeometry(10, 10, 2);
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const lineMaterial = new THREE.LineBasicMaterial({color: 'tomato', linewidth: 2, linecap: 'round'});
const [instructions, lines] = generateLines(systemF)
const divInstructions = document.createElement('div');
const text = document.createElement('p');
const instructionHeading = document.createElement('h3')
document.body.append(divInstructions)
divInstructions.appendChild(instructionHeading)
divInstructions.appendChild(text)
divInstructions.className = 'instructions'
instructionHeading.innerHTML += 'Instructions'
text.innerHTML += instructions;

const lSystem = new THREE.Group();

lines.forEach(l => {
  const geo = new THREE.BufferGeometry().setFromPoints(l)
  const newLine = new THREE.Line(geo, lineMaterial)

  lSystem.add(newLine)
})

lSystem.translateY(-15)
scene.add(lSystem)

camera.lookAt(0, 0, -20)
camera.position.set(0, 10, 90);
controls.update();

function animate() {
  requestAnimationFrame(animate);

  lSystem.rotateY(.01)
  controls.update();

  renderer.render(scene, camera);
}

animate();

renderer.render(scene, camera)
