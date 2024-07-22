let scene, camera, renderer, world;
let boxes = [], boxMeshes = [];

const params = {
    boxesNumber: 50,
    boxSize: 0.2,
    containerSize: 10,
    gravity: 9.82,
    throwForce: 15
};

function init() {
    // Three.js setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Cannon.js setup
    world = new CANNON.World();
    world.gravity.set(0, -params.gravity, 0);

    createContainer();
    createBoxes();

    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Event listener for throwing boxes
    window.addEventListener('dblclick', throwBoxes);

    // GUI
    const gui = new dat.GUI();
    gui.add(params, 'gravity', 0, 20).onChange(value => world.gravity.set(0, -value, 0));
    gui.add(params, 'throwForce', 1, 30);
}

function createContainer() {
    const wallGeometry = new THREE.BoxGeometry(params.containerSize, 0.1, params.containerSize);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0.5 });

    // Bottom
    const bottomMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    scene.add(bottomMesh);
    const bottomBody = new CANNON.Body({ mass: 0 });
    bottomBody.addShape(new CANNON.Plane());
    bottomBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(bottomBody);

    // Top
    const topMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    topMesh.position.y = params.containerSize;
    scene.add(topMesh);
    const topBody = new CANNON.Body({ mass: 0 });
    topBody.addShape(new CANNON.Plane());
    topBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    topBody.position.set(0, params.containerSize, 0);
    world.addBody(topBody);

    // Sides
    for (let i = 0; i < 4; i++) {
        const sideMesh = new THREE.Mesh(wallGeometry, wallMaterial);
        sideMesh.rotation.x = Math.PI / 2;
        sideMesh.position.y = params.containerSize / 2;
        if (i < 2) {
            sideMesh.position.z = (i === 0 ? 1 : -1) * params.containerSize / 2;
        } else {
            sideMesh.rotation.y = Math.PI / 2;
            sideMesh.position.x = (i === 2 ? 1 : -1) * params.containerSize / 2;
        }
        scene.add(sideMesh);

        const sideBody = new CANNON.Body({ mass: 0 });
        sideBody.addShape(new CANNON.Plane());
        if (i < 2) {
            sideBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), (i === 0 ? 1 : -1) * Math.PI / 2);
            sideBody.position.set(0, params.containerSize / 2, (i === 0 ? 1 : -1) * params.containerSize / 2);
        } else {
            sideBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), (i === 2 ? 1 : -1) * Math.PI / 2);
            sideBody.position.set((i === 2 ? 1 : -1) * params.containerSize / 2, params.containerSize / 2, 0);
        }
        world.addBody(sideBody);
    }
}

function createBoxes() {
    const boxShape = new CANNON.Box(new CANNON.Vec3(params.boxSize / 2, params.boxSize / 2, params.boxSize / 2));
    const boxGeometry = new THREE.BoxGeometry(params.boxSize, params.boxSize, params.boxSize);
    const boxMaterial = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff });

    for (let i = 0; i < params.boxesNumber; i++) {
        const boxBody = new CANNON.Body({ mass: 1, shape: boxShape });
        const x = (Math.random() - 0.5) * params.containerSize;
        const y = Math.random() * params.containerSize + params.containerSize / 2;
        const z = (Math.random() - 0.5) * params.containerSize;
        boxBody.position.set(x, y, z);
        world.addBody(boxBody);
        boxes.push(boxBody);

        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        scene.add(boxMesh);
        boxMeshes.push(boxMesh);
    }
}

function throwBoxes() {
    boxes.forEach(box => {
        const force = params.throwForce;
        box.applyImpulse(
            new CANNON.Vec3((Math.random() - 0.5) * force, 
                            (Math.random() - 0.5) * force, 
                            (Math.random() - 0.5) * force),
            box.position
        );
    });
}

function animate() {
    requestAnimationFrame(animate);

    world.step(1 / 60);

    for (let i = 0; i < boxes.length; i++) {
        boxMeshes[i].position.copy(boxes[i].position);
        boxMeshes[i].quaternion.copy(boxes[i].quaternion);
    }

    renderer.render(scene, camera);
}

init();
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});