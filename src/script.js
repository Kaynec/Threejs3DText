import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as dat from "lil-gui";
import gsap from "gsap";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();

const loader = new FontLoader();

const matCapTexture = textureLoader.load("/textures/matcaps/4.png");

const meshes = [];

/**
 * Material
 */

// const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });

const material = new THREE.MeshNormalMaterial();

let textMeshRefrence;

loader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  const geometry = new TextGeometry("Alias Ozbak", {
    font: font,
    size: 0.6,
    height: 0.3,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  geometry.center();

  const mesh = new THREE.Mesh(geometry, material);

  textMeshRefrence = mesh;

  scene.add(mesh);
});

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

const shapes = [cubeGeometry, donutGeometry];

for (let i = 0; i < 5000; i++) {
  const donutOrCube = new THREE.Mesh(
    shapes[Math.floor(Math.random() * shapes.length)],
    material
  );
  donutOrCube.position.x = (Math.random() - 0.5) * 75;
  donutOrCube.position.y = (Math.random() - 0.5) * 75;
  donutOrCube.position.z = (Math.random() - 0.5) * 75;
  donutOrCube.rotation.x = Math.random() * Math.PI;
  donutOrCube.rotation.y = Math.random() * Math.PI;
  const scale = Math.random();
  donutOrCube.scale.set(scale, scale, scale);

  scene.add(donutOrCube);

  meshes.push(donutOrCube);
}

/**
 * Adjust To Scroll
 */

const mouse = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX / sizes.width - 0.5;
  mouse.y = -(e.clientY / sizes.height - 0.5);

  camera.position.x = mouse.x * 8;

  camera.position.y = mouse.y * 8;
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //   meshes

  for (let mesh of meshes) {
    mesh.rotation.x += Math.sin(Math.random() * 0.01);

    mesh.rotation.y += Math.sin(Math.random() * 0.01);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
