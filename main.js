import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color(0x000000));

const loader = new GLTFLoader();

let campingCar;
loader.load(
    './background.glb',
    function (gltf) {
        campingCar = gltf.scene;
        scene.add(campingCar);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

let shiba;
loader.load(
    './shiba.glb',
    function (gltf) {
        shiba = gltf.scene;
        shiba.position.set(-170, 25, -170);
        shiba.scale.set(20, 20, 20);
        shiba.rotation.y = Math.PI;
        scene.add(shiba);
        camera.position.set(shiba.position.x, shiba.position.y + 10, shiba.position.z - 60);
        controls.target.set(shiba.position.x, shiba.position.y, shiba.position.z);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let isAnimating = false;
function onDocumentMouseDown(event) {
  event.preventDefault();

  if (isAnimating) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(shiba, true); 

  if (intersects.length > 0) {
      isAnimating = true;

      const jumpHeight = 50;
      const jumpDuration = 0.4;
      gsap.to(shiba.position, {
          y: jumpHeight,
          duration: jumpDuration,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
          onComplete: () => {
              isAnimating = false;
          }
      });
  }
}


document.addEventListener('mousedown', onDocumentMouseDown, false);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
