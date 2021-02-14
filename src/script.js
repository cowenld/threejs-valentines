import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const getURLNameParam = () => {
  const url = new URL(window.location.href);
  const name = url.searchParams.get("name");
  return name;
};

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const extrudeSettings = {
  amount: 8,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 2,
  bevelSize: 20,
  bevelThickness: 20,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/8.png");

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();
const donutArr = [];

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    // Material
    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

    // Text
    const name = getURLNameParam();
    const textGeometry = new THREE.TextBufferGeometry(
      `Happy Valentines
        ${name}`,
      {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      }
    );
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    let heartShape = new THREE.Shape();
    heartShape.moveTo(25, 25);
    heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
    heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
    heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
    heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
    heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
    heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

    let geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    for (let i = 0; i < 100; i++) {
      const donut = new THREE.Mesh(geometry, material);
      donut.position.x = (Math.random() - 0.5) * 15;
      donut.position.y = (Math.random() - 0.5) * 15;
      donut.position.z = (Math.random() - 0.5) * 15;
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      //   const scale = Math.random();
      //   donut.scale.set(scale, scale, scale);
      donut.scale.set(0.005, 0.005, 0.005);
      donutArr.push(donut);
      scene.add(donut);
    }
  });
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);
  donutArr.forEach((donut) => {
    donut.rotation.x += 0.01;
    donut.rotation.y += 0.01;
  });

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
