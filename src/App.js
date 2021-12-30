import * as THREE from "three";
import { OrbitControls } from "./OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { app } from "./firebase";
import "./App.css";

let camera, controls, scene, renderer, model, mouse;

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
  // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

  mouse = {
    x: 0,
    y: 0,
  };

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;

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

  controls.screenSpacePanning = false;

  // controls.minDistance = 100;
  // controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;

  // lights

  const intensity = 2;
  const pointLight = new THREE.PointLight(0xffffff, intensity);
  pointLight.castShadow = true
  pointLight.position.set(-2, 18, 50);
  // pointLight.lookAt(-2, 18, 0);
  scene.add(pointLight);

  const sphereSize = 1;
  const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  scene.add( pointLightHelper );


  // // Touch interaction


  // const onDocumentTouch = (event) => {
  //   // event.preventDefault();
  //   event = event.changedTouches[0];

  //   var rect = renderer.domElement.getBoundingClientRect();

  //   mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  //   mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  //   pointLight.position.copy(
  //     new THREE.Vector3(mouse.x * 1.45, mouse.y * 1.05 + 22, 36)
  //   );
  // };


  // document.addEventListener("touchmove", onDocumentTouch, false);
  // document.addEventListener("touchstart", onDocumentTouch, false);
  // document.addEventListener("touchend", onDocumentTouch, false);

  // document.addEventListener("mousemove", onMouseMove, false);

  // // Follows the mouse event
  // function onMouseMove(event) {
  //   // Update the mouse variable
  //   // event.preventDefault();
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //   pointLight.position.copy(
  //     new THREE.Vector3(mouse.x * 10.45, mouse.y * 10 + 52, 36)
  //   );

  // }

  // instantiate a loader
  const loader = new GLTFLoader();

  // load a resource
  loader.load(
    // resource URL
    "../3d/BuildingBake1.glb",
    // called when resource is loaded
    (object) => {
      console.log(object.scene)
      model = object.scene;
      scene.add(model);
      model.scale.multiplyScalar(12);
      model.position.set(-5,1,-1)
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
