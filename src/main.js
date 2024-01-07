import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { generateLines } from './lsystem';
import { systemC } from './data/test.json'

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 100, window.innerHeight - 200);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  300,
);
const controls = new OrbitControls(camera, renderer.domElement)
console.log(controls)

// cube
// const geometry = new THREE.BoxGeometry(10, 10, 2);
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const lineMaterial = new THREE.LineBasicMaterial({color: 'tomato', linewidth: 2, linecap: 'round'});

camera.position.set(0, 0, 3);
controls.update();

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();
const lines = generateLines(systemC)

lines.forEach(l => {
  const geo = new THREE.BufferGeometry().setFromPoints(l)
  const newLine = new THREE.Line(geo, lineMaterial)

  scene.add(newLine)
})

renderer.render(scene, camera)
