// Инициализация сцены, камеры и рендерера
let scene, camera, renderer, controls, directionalLight;

init();
animate();

function init() {
    // 1. Создание сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // 2. Настройка камеры
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(2, 2, 2);

    // 3. Инициализация рендерера
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // 4. Загрузка текстур
    const textureLoader = new THREE.TextureLoader();
    
    const textures = {
        map: textureLoader.load('/src/textures/Plaster006_1K-JPG_Color.jpg'),
        normalMap: textureLoader.load('/src/textures/Plaster006_1K-JPG_NormalDX.jpg'),
        roughnessMap: textureLoader.load('/src/textures/Plaster006_1K-JPG_Roughness.jpg')
    };

    // 5. Создание материала
    const material = new THREE.MeshStandardMaterial({
        map: textures.map,
        normalMap: textures.normalMap,
        roughnessMap: textures.roughnessMap,
        roughness: 0.8,
        metalness: 0.0
    });

    // 6. Загрузка модели
    const loader = new THREE.GLTFLoader();
    loader.load(
        '/src/models/cube.glb',
        (gltf) => {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(gltf.scene);
        },
        undefined,
        (error) => {
            console.error('Error loading model:', error);
        }
    );

    // 7. Настройка освещения
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // 8. Настройка OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    // 9. Обработчик изменения размера окна
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// 10. Инициализация GUI для управления светом
const gui = new dat.GUI();
const lightFolder = gui.addFolder('Directional Light');
lightFolder.add(directionalLight.position, 'x', -10, 10).name('Position X');
lightFolder.add(directionalLight.position, 'y', -10, 10).name('Position Y');
lightFolder.add(directionalLight.position, 'z', -10, 10).name('Position Z');
lightFolder.add(directionalLight, 'intensity', 0, 5).name('Intensity');
lightFolder.open();

// 11. Добавим плоскость для отбрасывания теней
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);
