import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  10 / -2,
  10 / 2,
  10 / 2,
  10 / -2,
  1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 500);
const main = document.getElementById('main');
main.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({
  color: 'rgb(255,0,255)',
  emissive: 0x440000,
  flatShading: true,
  shininess: 0,
});
const material1 = new THREE.MeshPhongMaterial({
  color: 'rgb(255,0,255)',
  emissive: 0x440000,
  flatShading: true,
  shininess: 0,
});
const material2 = new THREE.MeshPhongMaterial({
  color: 'rgb(255,0,255)',
  emissive: 0x440000,
  flatShading: true,
  shininess: 0,
});
const planeGeometry = new THREE.PlaneGeometry(1, 1);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 'rgb(137,0,121)',
  side: THREE.DoubleSide,
});
const planeMaterial1 = new THREE.MeshBasicMaterial({
  color: 'rgb(255,4,255)',
  side: THREE.FrontSide,
});
const group = new THREE.Group();

const x0 = (3 * Math.PI) / 4 + Math.PI / 360;
const y0 = -Math.PI / 5;
const z0 = (-3 * Math.PI) / 4 + (Math.PI / 360) * 62;

function createTriangle() {
  // face 1
  for (let i = 0; i < 5; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.translateX(i);
    group.add(cube);
  }
  // face 2
  for (let i = 0; i < 4; i++) {
    const cube = new THREE.Mesh(geometry, material1);
    cube.translateX(4);
    cube.translateY(i + 1);
    group.add(cube);
  }
  // face 3
  for (let i = 0; i < 2; i++) {
    const cube = new THREE.Mesh(geometry, material2);
    cube.translateZ(-1 * i - 1);
    group.add(cube);
  }
  // extra plane for face 3
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.translateZ(-3);
  plane.translateX(-0.5);
  plane.rotateY(Math.PI / 2);
  group.add(plane);

  // more planes for face 3
  for (let i = 0; i < 2; i++) {
    const plane = new THREE.Mesh(planeGeometry, planeMaterial1);
    plane.translateZ(-1 * i - 1);
    plane.translateY(-0.5001);
    plane.rotateX(Math.PI / 2);
    group.add(plane);
  }
  group.rotation.x = x0;
  group.rotation.y = y0;
  group.rotation.z = z0;

  group.translateX(-2);
  group.translateY(-1.5);
  scene.add(group);
}
createTriangle();

const maxY = 2,
  minY = -3;
let dir = 'UP';
let pauseCount = 100;
let mode = 'PAUSE';

function animate() {
  requestAnimationFrame(animate);
  // update()

  if (mode === 'ROTATE' && group.rotation.x < x0 + 2 * Math.PI) {
    group.rotation.x += Math.PI / 180;
  } else if (mode === 'PAUSE' && pauseCount > 0) {
    // pause
    pauseCount -= 1;
  } else if (mode === 'PAUSE' && pauseCount === 0) {
    mode = 'ROTATE';
    group.rotation.x += Math.PI / 180;
  } else if (mode === 'ROTATE' && group.rotation.x >= x0 + 2 * Math.PI) {
    group.rotation.x = x0;
    mode = 'PAUSE';
    pauseCount = 100;
  }
  if (group.position.y < maxY && dir === 'UP') {
    group.position.y += 0.01;
  } else if (group.position.y >= maxY && dir === 'UP') {
    dir = 'DN';
  } else if (group.position.y > minY && dir === 'DN') {
    group.position.y -= 0.01;
  } else {
    dir = 'UP';
  }

  renderer.render(scene, camera);
}

animate();
scene.add(new THREE.AmbientLight(0xcccccc));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(10, 10, 10);
light.lookAt(scene.position);
scene.add(light);
// const controls = new OrbitControls(camera, renderer.domElement);

// camera rotations
//
// rotation
// XYZ
// _x : 2.3499067484950062
// _y : -0.6118698732822077
// _z : 2.614761451759803
//
// _x : 2.3465712789142676
// _y : -0.6214232687563412
// _z : 2.6059608746694813
//
// position
// x : -3.6307584700106514
// y : -4.947265043599914
// z : -6.149648442571331
//
// x : -3.514139306215667
// y : -5.52127944159527
// z : -6.031336112367839
// camera.position.x = -3.514139306215667;
// camera.position.y = -5.52127944159527;
// camera.position.z = -6.031336112367839;
// camera.rotateX(2.3465712789142676);
// camera.rotateY(-0.6214232687563412);
// camera.rotateZ(2.6059608746694813);

camera.position.z = 10;
controls.addEventListener('change', e => {
  console.log(e, controls.object);
});
