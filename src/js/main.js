let scene, camera, renderer, controls, light;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.z = 3;

    // Materials
    const plasterTexture = new THREE.TextureLoader().load('src/textures/plaster_01.jpg');
    const material = new THREE.MeshPhongMaterial({
        map: plasterTexture,
        bumpScale: 0.05,
        shininess: 10
    });

    // Model loading
    const loader = new THREE.GLTFLoader();
    loader.load('src/models/cube.glb', function(gltf) {
        gltf.scene.traverse(child => {
            if (child.isMesh) child.material = material;
        });
        scene.add(gltf.scene);
    });

    // GUI Controls
    const gui = new dat.GUI();
    gui.add(light.position, 'x', -10, 10).name('Light X');
    gui.add(light.position, 'y', -10, 10).name('Light Y');
    gui.add(light.position, 'z', -10, 10).name('Light Z');
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

// Responsive handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
