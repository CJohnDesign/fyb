import * as THREE from "three";
import { OrbitControls } from "./OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
// import { app } from "./firebase";
import "./App.css";

let camera, controls, scene, renderer;

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
  // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(400, 200, 0);

  // controls

  controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = true;

  // controls.minDistance = 100;
  // controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI;

  // world

  //   const geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
  //   const material = new THREE.MeshPhongMaterial({
  //     color: 0xffffff,
  //     flatShading: true,
  //   });

  //   for (let i = 0; i < 500; i++) {
  //     const mesh = new THREE.Mesh(geometry, material);
  //     mesh.position.x = Math.random() * 1600 - 800;
  //     mesh.position.y = 0;
  //     mesh.position.z = Math.random() * 1600 - 800;
  //     mesh.updateMatrix();
  //     mesh.matrixAutoUpdate = false;
  //     scene.add(mesh);
  //   }

  // lights

  const width = 10;
  const height = 10;
  const intensity = 1;
  const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
  rectLight.position.set(-2, 18, 20);
  rectLight.lookAt(-2, 18, 0);
  scene.add(rectLight);

  const rectLightHelper = new RectAreaLightHelper(rectLight);
  rectLight.add(rectLightHelper);



  // instantiate a loader
  const loader = new GLTFLoader();

  // load a resource
  loader.load(
    // resource URL
    "../3d/cresent_001.glb",
    // called when resource is loaded
    (object) => {
      const model = object.scene;
      scene.add(model);
      model.scale.multiplyScalar(12);
    },
    // called when loading is in progresses
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log(error);
    }
  );

  const streetLight1 = new THREE.PointLight(0x000fff, 0.48); //000fff
  streetLight1.position.set(0, 250, 175);
  streetLight1.castShadow = false; // true
  scene.add(streetLight1);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}

function render() {
  renderer.render(scene, camera);
}

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
    </div>
  );
}

export default App;
