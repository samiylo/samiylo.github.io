import * as THREE from 'three';
import { CAMERA, COLORS, ROAD, PARTICLES } from '../constants/gameConstants';

/**
 * Creates and configures the Three.js scene, camera, and renderer
 */
export function createScene(container) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(COLORS.DARK_BG, 20, 100);

    const camera = new THREE.PerspectiveCamera(
        CAMERA.FOV,
        window.innerWidth / window.innerHeight,
        CAMERA.NEAR,
        CAMERA.FAR
    );
    camera.position.set(CAMERA.POSITION.x, CAMERA.POSITION.y, CAMERA.POSITION.z);
    camera.lookAt(CAMERA.LOOK_AT.x, CAMERA.LOOK_AT.y, CAMERA.LOOK_AT.z);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    setupLighting(scene);

    return { scene, camera, renderer };
}

/**
 * Sets up lighting for the scene
 */
function setupLighting(scene) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(COLORS.NEON_PURPLE, 0.4);
    scene.add(ambientLight);

    // Directional light
    const dirLight = new THREE.DirectionalLight(COLORS.NEON_CYAN, 1.2);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Accent lights
    const pinkLight = new THREE.PointLight(COLORS.NEON_PINK, 2, 50);
    pinkLight.position.set(-10, 5, -20);
    scene.add(pinkLight);

    const yellowLight = new THREE.PointLight(COLORS.NEON_YELLOW, 2, 50);
    yellowLight.position.set(10, 5, -20);
    scene.add(yellowLight);
}

/**
 * Creates the player character with skateboard
 * @param {Object} options - Optional rotation parameters
 * @param {number} options.rotationX - Rotation around X-axis in radians (default: 0)
 * @param {number} options.rotationY - Rotation around Y-axis in radians (default: 0)
 * @param {number} options.rotationZ - Rotation around Z-axis in radians (default: 0)
 * @returns {Object} Object containing player group and skateboard mesh
 */
export function createPlayer(options = {}) {
    const {
        rotationX = 0,
        rotationY = 1.5,
        rotationZ = Math.PI / 2
    } = options;

    const group = new THREE.Group();

    // Body
    const bodyGeom = new THREE.BoxGeometry(0.6, 1.2, 0.4);
    const bodyMat = new THREE.MeshPhongMaterial({
        color: COLORS.NEON_PINK,
        emissive: COLORS.NEON_PINK,
        emissiveIntensity: 0.3,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.6;
    body.castShadow = true;
    group.add(body);

    // Head
    const headGeom = new THREE.SphereGeometry(0.35, 8, 8);
    const headMat = new THREE.MeshPhongMaterial({
        color: COLORS.NEON_YELLOW,
        emissive: COLORS.NEON_YELLOW,
        emissiveIntensity: 0.4,
        shininess: 100
    });
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.y = 1.5;
    head.castShadow = true;
    group.add(head);

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.08, 6, 6);
    const eyeMat = new THREE.MeshBasicMaterial({ color: COLORS.NEON_CYAN });

    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.12, 1.55, 0.25);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(0.12, 1.55, 0.25);
    group.add(rightEye);

    // Arms
    const armGeom = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    const armMat = new THREE.MeshPhongMaterial({
        color: COLORS.NEON_PINK,
        emissive: COLORS.NEON_PINK,
        emissiveIntensity: 0.2
    });

    const leftArm = new THREE.Mesh(armGeom, armMat);
    leftArm.position.set(-0.5, 0.8, 0);
    leftArm.castShadow = true;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeom, armMat);
    rightArm.position.set(0.5, 0.8, 0);
    rightArm.castShadow = true;
    group.add(rightArm);

    // Skateboard
    const boardGeom = new THREE.BoxGeometry(0.9, 0.12, 0.35);
    const boardMat = new THREE.MeshPhongMaterial({
        color: COLORS.NEON_CYAN,
        emissive: COLORS.NEON_CYAN,
        emissiveIntensity: 0.5,
        shininess: 100
    });
    const skateboard = new THREE.Mesh(boardGeom, boardMat);
    skateboard.position.y = 0;
    skateboard.castShadow = true;
    group.add(skateboard);

    // Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.18, 8);
    const wheelMat = new THREE.MeshPhongMaterial({
        color: COLORS.NEON_PURPLE,
        emissive: COLORS.NEON_PURPLE,
        emissiveIntensity: 0.6
    });

    for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeom, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        const x = i < 2 ? -0.35 : 0.35;
        const z = i % 2 === 0 ? -0.15 : 0.15;
        wheel.position.set(x, -0.06, z);
        wheel.castShadow = true;
        skateboard.add(wheel);
    }

    // Apply rotation to the entire player group
    group.rotation.x = rotationX;
    group.rotation.y = rotationY;
    group.rotation.z = rotationZ;

    group.position.set(0, 1, 0);
    return { player: group, skateboard };
}

/**
 * Creates a road segment with barriers, grass, and optional obstacles/trees
 */
export function createRoadSegment(zPos, scene, obstacles, roadSegments, trees) {
    const roadWidth = ROAD.WIDTH;
    const segmentLength = ROAD.SEGMENT_LENGTH;

    // Road surface
    const roadGeom = new THREE.PlaneGeometry(roadWidth, segmentLength);
    const roadMat = new THREE.MeshPhongMaterial({
        color: 0x1A1D2E,
        emissive: COLORS.DARK_BG,
        emissiveIntensity: 0.2
    });
    const road = new THREE.Mesh(roadGeom, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, zPos);
    road.receiveShadow = true;
    scene.add(road);
    roadSegments.push({ mesh: road, z: zPos });

    // Center lines
    for (let i = 0; i < 3; i++) {
        const lineGeom = new THREE.PlaneGeometry(0.15, segmentLength / 3 - 0.2);
        const lineMat = new THREE.MeshBasicMaterial({ color: COLORS.NEON_CYAN });
        const line = new THREE.Mesh(lineGeom, lineMat);
        line.rotation.x = -Math.PI / 2;
        line.position.set(0, 0.02, zPos + (i - 1) * (segmentLength / 3));
        scene.add(line);
        roadSegments.push({ mesh: line, z: zPos });
    }

    // Side barriers
    const barrierGeom = new THREE.BoxGeometry(0.2, 0.5, segmentLength);
    const barrierMat = new THREE.MeshPhongMaterial({
        color: COLORS.NEON_PINK,
        emissive: COLORS.NEON_PINK,
        emissiveIntensity: 0.5
    });

    const leftBarrier = new THREE.Mesh(barrierGeom, barrierMat);
    leftBarrier.position.set(-roadWidth / 2 - 0.1, 0.25, zPos);
    leftBarrier.castShadow = true;
    scene.add(leftBarrier);
    roadSegments.push({ mesh: leftBarrier, z: zPos });

    const rightBarrier = new THREE.Mesh(barrierGeom, barrierMat);
    rightBarrier.position.set(roadWidth / 2 + 0.1, 0.25, zPos);
    rightBarrier.castShadow = true;
    scene.add(rightBarrier);
    roadSegments.push({ mesh: rightBarrier, z: zPos });

    // Grass
    const grassGeom = new THREE.PlaneGeometry(20, segmentLength);
    const grassMat = new THREE.MeshPhongMaterial({
        color: COLORS.GRASS,
        emissive: 0x0A1F14,
        emissiveIntensity: 0.1
    });

    const leftGrass = new THREE.Mesh(grassGeom, grassMat);
    leftGrass.rotation.x = -Math.PI / 2;
    leftGrass.position.set(-14, -0.1, zPos);
    leftGrass.receiveShadow = true;
    scene.add(leftGrass);
    roadSegments.push({ mesh: leftGrass, z: zPos });

    const rightGrass = new THREE.Mesh(grassGeom, grassMat);
    rightGrass.rotation.x = -Math.PI / 2;
    rightGrass.position.set(14, -0.1, zPos);
    rightGrass.receiveShadow = true;
    scene.add(rightGrass);
    roadSegments.push({ mesh: rightGrass, z: zPos });

    // Random obstacles
    if (Math.random() > ROAD.OBSTACLE_SPAWN_CHANCE && zPos < -15) {
        createObstacle(zPos, scene, obstacles);
    }

    // Random trees
    if (Math.random() > ROAD.TREE_SPAWN_CHANCE) {
        createTree(-roadWidth / 2 - 2 - Math.random() * 4, zPos, scene, trees);
    }
    if (Math.random() > ROAD.TREE_SPAWN_CHANCE) {
        createTree(roadWidth / 2 + 2 + Math.random() * 4, zPos, scene, trees);
    }
}

/**
 * Creates an obstacle (cone, crystal, or barrier)
 */
export function createObstacle(zPos, scene, obstacles) {
    const types = ['cone', 'crystal', 'barrier'];
    const type = types[Math.floor(Math.random() * types.length)];
    const xPos = (Math.random() - 0.5) * 5;

    let obstacle;

    if (type === 'cone') {
        const geom = new THREE.ConeGeometry(0.35, 0.9, 6);
        const mat = new THREE.MeshPhongMaterial({
            color: COLORS.NEON_YELLOW,
            emissive: COLORS.NEON_YELLOW,
            emissiveIntensity: 0.5
        });
        obstacle = new THREE.Mesh(geom, mat);
        obstacle.position.set(xPos, 0.45, zPos);
    } else if (type === 'crystal') {
        const geom = new THREE.OctahedronGeometry(0.5, 0);
        const mat = new THREE.MeshPhongMaterial({
            color: COLORS.NEON_PURPLE,
            emissive: COLORS.NEON_PURPLE,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.8
        });
        obstacle = new THREE.Mesh(geom, mat);
        obstacle.position.set(xPos, 0.5, zPos);
        obstacle.rotation.y = Math.random() * Math.PI;
    } else {
        const geom = new THREE.BoxGeometry(1.5, 0.8, 0.3);
        const mat = new THREE.MeshPhongMaterial({
            color: COLORS.NEON_PINK,
            emissive: COLORS.NEON_PINK,
            emissiveIntensity: 0.5
        });
        obstacle = new THREE.Mesh(geom, mat);
        obstacle.position.set(xPos, 0.4, zPos);
    }

    obstacle.castShadow = true;
    obstacle.receiveShadow = true;
    scene.add(obstacle);
    obstacles.push({ mesh: obstacle, z: zPos, x: xPos, type: type });
}

/**
 * Creates a tree
 */
export function createTree(xPos, zPos, scene, trees) {
    const group = new THREE.Group();

    const trunkGeom = new THREE.CylinderGeometry(0.25, 0.35, 2.5, 6);
    const trunkMat = new THREE.MeshPhongMaterial({ color: 0x4A2C2A });
    const trunk = new THREE.Mesh(trunkGeom, trunkMat);
    trunk.position.y = 1.25;
    trunk.castShadow = true;
    group.add(trunk);

    const foliageGeom = new THREE.ConeGeometry(1.2, 2.5, 6);
    const foliageMat = new THREE.MeshPhongMaterial({
        color: COLORS.GRASS,
        emissive: 0x0D2617,
        emissiveIntensity: 0.2
    });
    const foliage = new THREE.Mesh(foliageGeom, foliageMat);
    foliage.position.y = 3;
    foliage.castShadow = true;
    group.add(foliage);

    group.position.set(xPos, 0, zPos);
    scene.add(group);
    trees.push({ mesh: group, z: zPos });
}

/**
 * Creates a particle for the particle system
 */
export function createParticle(scene, particles) {
    const geom = new THREE.SphereGeometry(0.05, 4, 4);
    const mat = new THREE.MeshBasicMaterial({
        color: PARTICLES.COLORS[Math.random() > 0.5 ? 0 : 1]
    });
    const particle = new THREE.Mesh(geom, mat);
    particle.position.set(
        (Math.random() - 0.5) * 15,
        Math.random() * 10,
        -Math.random() * 100
    );
    scene.add(particle);
    particles.push({
        mesh: particle,
        velocity: Math.random() * (PARTICLES.VELOCITY.MAX - PARTICLES.VELOCITY.MIN) + PARTICLES.VELOCITY.MIN,
        oscillation: Math.random() * Math.PI * 2
    });
}
