import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// --- SCENE SETUP -----------------------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// --- POST-PROCESSING (GLOW EFFECT) -----------------------------------------------
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 2.5;
bloomPass.radius = 0.5;
composer.addPass(bloomPass);

// --- ETHEREAL FISH RIBBON SETUP --------------------------------------------------
const CURVE_POINTS = 100; // How many points/segments make up the tail
const path = new THREE.CatmullRomCurve3(
    // Create an initial, straight line of points for the curve
    Array.from({ length: CURVE_POINTS }, (_, i) => new THREE.Vector3(0, 0, i * 0.5))
);

const tubeGeometry = new THREE.TubeGeometry(path, CURVE_POINTS, 0.2, 8, false);

// --- APPLYING VERTEX COLORS FOR THE GRADIENT EFFECT ---
const colors = [];
const color = new THREE.Color();
const headColor = new THREE.Color(0xffa500); // Bright Orange/Yellow
const tailColor = new THREE.Color(0xff0000); // Deep Red

for (let i = 0; i < tubeGeometry.attributes.position.count; i++) {
    // Calculate how far along the tube this vertex is (0.0 to 1.0)
    const t = (i / tubeGeometry.attributes.position.count);
    // Interpolate the color between the head and tail colors
    color.lerpColors(headColor, tailColor, t);
    colors.push(color.r, color.g, color.b);
}
// Add the calculated colors as an attribute to the geometry
tubeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// Create the material and tell it to use the vertex colors
const tubeMaterial = new THREE.MeshBasicMaterial({ 
    vertexColors: true 
});
const fishRibbon = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(fishRibbon);

// This invisible point will lead the ribbon's path
const fishHead = new THREE.Vector3();

// --- THE LANTERNS (PARTICLES) ----------------------------------------------------
const lanternCount = 400;
const lanternGeometry = new THREE.BoxGeometry(0.08, 0.12, 0.08);
const lanternMaterial = new THREE.MeshBasicMaterial({ color: 0xff4422 });
const instancedLanterns = new THREE.InstancedMesh(lanternGeometry, lanternMaterial, lanternCount);
scene.add(instancedLanterns);

const dummy = new THREE.Object3D();
for (let i = 0; i < lanternCount; i++) {
    dummy.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 50
    );
    dummy.updateMatrix();
    instancedLanterns.setMatrixAt(i, dummy.matrix);
}

// --- CONTROLS & HELPERS ----------------------------------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
const clock = new THREE.Clock();

// --- ANIMATION LOOP --------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = clock.getDelta();

    // 1. Animate the Fish Head's position for organic movement
    fishHead.x = Math.cos(elapsedTime * 0.5) * 10;
    fishHead.y = Math.sin(elapsedTime * 0.7) * 5;
    fishHead.z = Math.sin(elapsedTime * 0.4) * 10;
    
    // 2. Update the Ribbon's Path
    const points = path.points;
    points.shift(); // Remove the oldest point from the tail
    points.push(fishHead.clone()); // Add the new head position to the front
    const newPath = new THREE.CatmullRomCurve3(points);

    // 3. THE PERFORMANCE FIX: Update the existing geometry's vertices
    const newPositions = new THREE.TubeGeometry(newPath, CURVE_POINTS, 0.2, 8, false).attributes.position.array;
    fishRibbon.geometry.attributes.position.array.set(newPositions);
    fishRibbon.geometry.attributes.position.needsUpdate = true; // IMPORTANT!
    
    // 4. Animate the Lanterns to float upwards
    for (let i = 0; i < lanternCount; i++) {
        instancedLanterns.getMatrixAt(i, dummy.matrix);
        const position = new THREE.Vector3().setFromMatrixPosition(dummy.matrix);
        position.y += deltaTime * (0.5 + Math.random() * 0.5);
        if (position.y > 15) {
            position.y = -15; // Reset if it goes off screen
        }
        dummy.matrix.setPosition(position);
        instancedLanterns.setMatrixAt(i, dummy.matrix);
    }
    instancedLanterns.instanceMatrix.needsUpdate = true; // IMPORTANT!

    // 5. Update controls and render the scene with the glow effect
    controls.update();
    composer.render();
}

// --- HANDLE WINDOW RESIZING ----------------------------------------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --- START THE ANIMATION --------------------------------------------------------
animate();