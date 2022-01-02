import * as THREE from "three";
import { OrbitControls } from "./OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
// import { app } from "./firebase";
import "./App.css";
import { AmbientLight } from "three";

let camera, controls, scene, renderer, model, mouse;

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {
  scene = new THREE.Scene();
  // Background

  scene.background = new THREE.TextureLoader().load("./bg.png");

  console.log("scene bg");
  console.log(scene.background);

  // scene.background = new THREE.Color(0xcccccc);
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
  const sphereSize = 2;

  const pointLight = new THREE.PointLight(0xFFFFFF, intensity/3);
  const streetLight1 = new THREE.PointLight(0xFF9100, intensity * 2.25);
  const streetLight2 = new THREE.PointLight(0xFF7AAB, intensity * 2);
  const streetLight3 = new THREE.PointLight(0xFFFFFF, intensity * 1.15);
  const streetLight4 = new THREE.PointLight(0xFF9100, intensity);
  const streetLight5 = new THREE.PointLight(0xFF7AAB, intensity);

  const posLight = new THREE.Vector3(-11, 24, 24);
  const posLight1 = new THREE.Vector3(-11, 42, 24);
  const posLight2 = new THREE.Vector3(14, 0, 24);
  const posLight3 = new THREE.Vector3(21, 36, 24);

  const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize, 0xffffff);
  const streetLight1Helper = new THREE.PointLightHelper(streetLight1, sphereSize, 0xffffff);
  const streetLight2Helper = new THREE.PointLightHelper(streetLight2, sphereSize, 0xffffff);
  const streetLight3Helper = new THREE.PointLightHelper(streetLight3, sphereSize, 0xffffff);
  
  const allLights = [pointLight, streetLight1, streetLight2, streetLight3]
  const posLights = [posLight, posLight1, posLight2, posLight3, posLight2, posLight1]
  const helpLights = [pointLightHelper, streetLight1Helper, streetLight2Helper, streetLight3Helper]

  for (let i = 0; i < allLights.length; i++) {
    scene.add(allLights[i])
    allLights[i].position.copy(posLights[i]);
    scene.add(helpLights[i])
  }

  
  // scene.add(streetLight1);


  
  // pointLight.position.set(-5, 33, 24);
  // scene.add(pointLight);

  // ambientLight = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(pointLight, ambientLight);

  
  



  // Touch interaction

  const onDocumentTouch = (event) => {
    // event.preventDefault();
    event = event.changedTouches[0];

    var rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    pointLight.position.copy(
      new THREE.Vector3(mouse.x * 48, mouse.y * 36 + 22, 22)
    );
    console.log(pointLight.position);
  };

  document.addEventListener("touchmove", onDocumentTouch, false);
  document.addEventListener("touchstart", onDocumentTouch, false);
  document.addEventListener("touchend", onDocumentTouch, false);

  document.addEventListener("mousemove", onMouseMove, false);

  // Follows the mouse event
  function onMouseMove(event) {
    // Update the mouse variable
    // event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    pointLight.position.copy(
      new THREE.Vector3(mouse.x * 48, mouse.y * 36 + 12, 24)
    );
    console.log(pointLight.position);
  }

  // instantiate a loader
  const loader = new GLTFLoader();

  // load a resource
  loader.load(
    // resource URL
    "./CrescentBuilding.glb",
    // called when resource is loaded
    (object) => {
      console.log(object.scene);
      model = object.scene;
      scene.add(model);
      model.scale.multiplyScalar(7.25);
      model.position.set(0, 10, 12);
      model.traverse(function (o) {
        if (o.isMesh) {
          console.log(o)

          // Roughness
          if (o.name.substring(0, 3) !== "dow") {
          o.material.roughness = 10
          } else {
            o.material.roughness = 0.1
          }

          // Shadows
          if (o.name.substring(0, 3) === "bui") {
            o.receiveShadow = true;
          } else if (o.name.substring(0, 3) === "awn") {
            o.castShadow = true;
          }
          
          
        }
      });
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
