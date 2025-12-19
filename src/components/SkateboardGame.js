import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './SkateboardGame.css';

const SkateboardGame = () => {
    const containerRef = useRef(null);
    const gameRef = useRef({
        scene: null,
        camera: null,
        renderer: null,
        player: null,
        skateboard: null,
        obstacles: [],
        roadSegments: [],
        trees: [],
        particles: [],
        score: 0,
        speed: 0,
        baseSpeed: 0.3,
        maxSpeed: 1.5,
        playerX: 0,
        playerY: 0,
        playerVelocityY: 0,
        gravity: 0.02,
        isJumping: false,
        trickCount: 0,
        gameActive: true,
        trickRotation: 0,
        combo: 0,
        keys: {
            left: false,
            right: false,
            space: false
        },
        animationId: null
    });

    useEffect(() => {
        const game = gameRef.current;
        const container = containerRef.current;
        
        // Detect mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                         (window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
        
        // Show/hide mobile controls
        const mobileControls = document.getElementById('mobileControls');
        if (mobileControls) {
            mobileControls.style.display = isMobile ? 'flex' : 'none';
        }
        
        // Hide cursor on mobile
        const cursor = document.getElementById('skateboard-cursor');
        if (cursor) {
            cursor.style.display = isMobile ? 'none' : 'block';
        }
        
        // Custom cursor (desktop only)
        const handleMouseMove = (e) => {
            if (cursor && !isMobile) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        };
        document.addEventListener('mousemove', handleMouseMove);

        // Speed lines canvas
        const speedCanvas = document.getElementById('speedLines');
        const speedCtx = speedCanvas?.getContext('2d');
        if (speedCanvas && speedCtx) {
            speedCanvas.width = window.innerWidth;
            speedCanvas.height = window.innerHeight;

            let speedLines = [];
            function createSpeedLine() {
                return {
                    x: Math.random() * speedCanvas.width,
                    y: -10,
                    speed: 5 + Math.random() * 10,
                    length: 20 + Math.random() * 40,
                    opacity: Math.random() * 0.5 + 0.3
                };
            }

            for (let i = 0; i < 50; i++) {
                speedLines.push(createSpeedLine());
            }

            function animateSpeedLines() {
                speedCtx.clearRect(0, 0, speedCanvas.width, speedCanvas.height);

                speedLines.forEach(line => {
                    line.y += line.speed;

                    if (line.y > speedCanvas.height) {
                        Object.assign(line, createSpeedLine());
                    }

                    speedCtx.strokeStyle = `rgba(0, 245, 255, ${line.opacity})`;
                    speedCtx.lineWidth = 2;
                    speedCtx.beginPath();
                    speedCtx.moveTo(line.x, line.y);
                    speedCtx.lineTo(line.x, line.y + line.length);
                    speedCtx.stroke();
                });

                requestAnimationFrame(animateSpeedLines);
            }
            animateSpeedLines();
        }

        // Three.js Game initialization
        function init() {
            game.scene = new THREE.Scene();
            game.scene.fog = new THREE.Fog(0x0A0E27, 20, 100);

            game.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            game.camera.position.set(0, 6, 10);
            game.camera.lookAt(0, 2, -10);

            game.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            game.renderer.setSize(window.innerWidth, window.innerHeight);
            game.renderer.shadowMap.enabled = true;
            game.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            game.renderer.setClearColor(0x000000, 0);
            container.appendChild(game.renderer.domElement);

            // Enhanced lighting
            const ambientLight = new THREE.AmbientLight(0x8338EC, 0.4);
            game.scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0x00F5FF, 1.2);
            dirLight.position.set(10, 15, 10);
            dirLight.castShadow = true;
            dirLight.shadow.camera.left = -30;
            dirLight.shadow.camera.right = 30;
            dirLight.shadow.camera.top = 30;
            dirLight.shadow.camera.bottom = -30;
            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;
            game.scene.add(dirLight);

            // Accent lights
            const pinkLight = new THREE.PointLight(0xFF006E, 2, 50);
            pinkLight.position.set(-10, 5, -20);
            game.scene.add(pinkLight);

            const yellowLight = new THREE.PointLight(0xFFBE0B, 2, 50);
            yellowLight.position.set(10, 5, -20);
            game.scene.add(yellowLight);

            createPlayer();

            for (let i = 0; i < 25; i++) {
                createRoadSegment(-i * 5);
            }

            // Create particles
            for (let i = 0; i < 100; i++) {
                createParticle();
            }
        }

        function createPlayer() {
            const group = new THREE.Group();

            // Body with gradient-like effect using multiple materials
            const bodyGeom = new THREE.BoxGeometry(0.6, 1.2, 0.4);
            const bodyMat = new THREE.MeshPhongMaterial({
                color: 0xFF006E,
                emissive: 0xFF006E,
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
                color: 0xFFBE0B,
                emissive: 0xFFBE0B,
                emissiveIntensity: 0.4,
                shininess: 100
            });
            const head = new THREE.Mesh(headGeom, headMat);
            head.position.y = 1.5;
            head.castShadow = true;
            group.add(head);

            // Glowing eyes
            const eyeGeom = new THREE.SphereGeometry(0.08, 6, 6);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00F5FF });

            const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
            leftEye.position.set(-0.12, 1.55, 0.25);
            group.add(leftEye);

            const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
            rightEye.position.set(0.12, 1.55, 0.25);
            group.add(rightEye);

            // Arms
            const armGeom = new THREE.BoxGeometry(0.2, 0.8, 0.2);
            const armMat = new THREE.MeshPhongMaterial({
                color: 0xFF006E,
                emissive: 0xFF006E,
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

            // Skateboard with glow
            const boardGeom = new THREE.BoxGeometry(0.9, 0.12, 0.35);
            const boardMat = new THREE.MeshPhongMaterial({
                color: 0x00F5FF,
                emissive: 0x00F5FF,
                emissiveIntensity: 0.5,
                shininess: 100
            });
            game.skateboard = new THREE.Mesh(boardGeom, boardMat);
            game.skateboard.position.y = 0;
            game.skateboard.castShadow = true;
            group.add(game.skateboard);

            // Wheels with neon glow
            const wheelGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.18, 8);
            const wheelMat = new THREE.MeshPhongMaterial({
                color: 0x8338EC,
                emissive: 0x8338EC,
                emissiveIntensity: 0.6
            });

            for (let i = 0; i < 4; i++) {
                const wheel = new THREE.Mesh(wheelGeom, wheelMat);
                wheel.rotation.z = Math.PI / 2;
                const x = i < 2 ? -0.35 : 0.35;
                const z = i % 2 === 0 ? -0.15 : 0.15;
                wheel.position.set(x, -0.06, z);
                wheel.castShadow = true;
                game.skateboard.add(wheel);
            }

            group.position.set(0, 1, 0);
            game.player = group;
            game.scene.add(game.player);
        }

        function createRoadSegment(zPos) {
            const roadWidth = 8;
            const segmentLength = 5;

            // Road with neon lines
            const roadGeom = new THREE.PlaneGeometry(roadWidth, segmentLength);
            const roadMat = new THREE.MeshPhongMaterial({
                color: 0x1A1D2E,
                emissive: 0x0A0E27,
                emissiveIntensity: 0.2
            });
            const road = new THREE.Mesh(roadGeom, roadMat);
            road.rotation.x = -Math.PI / 2;
            road.position.set(0, 0, zPos);
            road.receiveShadow = true;
            game.scene.add(road);
            game.roadSegments.push({ mesh: road, z: zPos });

            // Glowing center lines
            for (let i = 0; i < 3; i++) {
                const lineGeom = new THREE.PlaneGeometry(0.15, segmentLength / 3 - 0.2);
                const lineMat = new THREE.MeshBasicMaterial({ color: 0x00F5FF });
                const line = new THREE.Mesh(lineGeom, lineMat);
                line.rotation.x = -Math.PI / 2;
                line.position.set(0, 0.02, zPos + (i - 1) * (segmentLength / 3));
                game.scene.add(line);
                game.roadSegments.push({ mesh: line, z: zPos });
            }

            // Side barriers with glow
            const barrierGeom = new THREE.BoxGeometry(0.2, 0.5, segmentLength);
            const barrierMat = new THREE.MeshPhongMaterial({
                color: 0xFF006E,
                emissive: 0xFF006E,
                emissiveIntensity: 0.5
            });

            const leftBarrier = new THREE.Mesh(barrierGeom, barrierMat);
            leftBarrier.position.set(-roadWidth / 2 - 0.1, 0.25, zPos);
            leftBarrier.castShadow = true;
            game.scene.add(leftBarrier);
            game.roadSegments.push({ mesh: leftBarrier, z: zPos });

            const rightBarrier = new THREE.Mesh(barrierGeom, barrierMat);
            rightBarrier.position.set(roadWidth / 2 + 0.1, 0.25, zPos);
            rightBarrier.castShadow = true;
            game.scene.add(rightBarrier);
            game.roadSegments.push({ mesh: rightBarrier, z: zPos });

            // Grass
            const grassGeom = new THREE.PlaneGeometry(20, segmentLength);
            const grassMat = new THREE.MeshPhongMaterial({
                color: 0x1A4D2E,
                emissive: 0x0A1F14,
                emissiveIntensity: 0.1
            });

            const leftGrass = new THREE.Mesh(grassGeom, grassMat);
            leftGrass.rotation.x = -Math.PI / 2;
            leftGrass.position.set(-14, -0.1, zPos);
            leftGrass.receiveShadow = true;
            game.scene.add(leftGrass);
            game.roadSegments.push({ mesh: leftGrass, z: zPos });

            const rightGrass = new THREE.Mesh(grassGeom, grassMat);
            rightGrass.rotation.x = -Math.PI / 2;
            rightGrass.position.set(14, -0.1, zPos);
            rightGrass.receiveShadow = true;
            game.scene.add(rightGrass);
            game.roadSegments.push({ mesh: rightGrass, z: zPos });

            if (Math.random() > 0.55 && zPos < -15) {
                createObstacle(zPos);
            }

            if (Math.random() > 0.65) {
                createTree(-roadWidth / 2 - 2 - Math.random() * 4, zPos);
            }
            if (Math.random() > 0.65) {
                createTree(roadWidth / 2 + 2 + Math.random() * 4, zPos);
            }
        }

        function createObstacle(zPos) {
            const types = ['cone', 'crystal', 'barrier'];
            const type = types[Math.floor(Math.random() * types.length)];

            let obstacle;
            const xPos = (Math.random() - 0.5) * 5;

            if (type === 'cone') {
                const geom = new THREE.ConeGeometry(0.35, 0.9, 6);
                const mat = new THREE.MeshPhongMaterial({
                    color: 0xFFBE0B,
                    emissive: 0xFFBE0B,
                    emissiveIntensity: 0.5
                });
                obstacle = new THREE.Mesh(geom, mat);
                obstacle.position.set(xPos, 0.45, zPos);
            } else if (type === 'crystal') {
                const geom = new THREE.OctahedronGeometry(0.5, 0);
                const mat = new THREE.MeshPhongMaterial({
                    color: 0x8338EC,
                    emissive: 0x8338EC,
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
                    color: 0xFF006E,
                    emissive: 0xFF006E,
                    emissiveIntensity: 0.5
                });
                obstacle = new THREE.Mesh(geom, mat);
                obstacle.position.set(xPos, 0.4, zPos);
            }

            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            game.scene.add(obstacle);
            game.obstacles.push({ mesh: obstacle, z: zPos, x: xPos, type: type });
        }

        function createTree(xPos, zPos) {
            const group = new THREE.Group();

            const trunkGeom = new THREE.CylinderGeometry(0.25, 0.35, 2.5, 6);
            const trunkMat = new THREE.MeshPhongMaterial({ color: 0x4A2C2A });
            const trunk = new THREE.Mesh(trunkGeom, trunkMat);
            trunk.position.y = 1.25;
            trunk.castShadow = true;
            group.add(trunk);

            const foliageGeom = new THREE.ConeGeometry(1.2, 2.5, 6);
            const foliageMat = new THREE.MeshPhongMaterial({
                color: 0x1A4D2E,
                emissive: 0x0D2617,
                emissiveIntensity: 0.2
            });
            const foliage = new THREE.Mesh(foliageGeom, foliageMat);
            foliage.position.y = 3;
            foliage.castShadow = true;
            group.add(foliage);

            group.position.set(xPos, 0, zPos);
            game.scene.add(group);
            game.trees.push({ mesh: group, z: zPos });
        }

        function createParticle() {
            const geom = new THREE.SphereGeometry(0.05, 4, 4);
            const mat = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x00F5FF : 0xFF006E
            });
            const particle = new THREE.Mesh(geom, mat);
            particle.position.set(
                (Math.random() - 0.5) * 15,
                Math.random() * 10,
                -Math.random() * 100
            );
            game.scene.add(particle);
            game.particles.push({
                mesh: particle,
                velocity: Math.random() * 0.5 + 0.2,
                oscillation: Math.random() * Math.PI * 2
            });
        }

        function showCombo(text) {
            const display = document.getElementById('comboDisplay');
            if (display) {
                display.textContent = text;
                display.style.animation = 'none';
                setTimeout(() => {
                    display.style.animation = 'comboFade 1s ease-out';
                }, 10);
            }
        }

        function onKeyDown(event) {
            switch (event.code) {
                case 'ArrowLeft':
                    game.keys.left = true;
                    break;
                case 'ArrowRight':
                    game.keys.right = true;
                    break;
                case 'Space':
                    if (!game.isJumping && game.gameActive) {
                        game.keys.space = true;
                        game.isJumping = true;
                        game.playerVelocityY = 0.35;
                        game.trickRotation = 0;
                    }
                    event.preventDefault();
                    break;
            }
        }

        function onKeyUp(event) {
            switch (event.code) {
                case 'ArrowLeft':
                    game.keys.left = false;
                    break;
                case 'ArrowRight':
                    game.keys.right = false;
                    break;
                case 'Space':
                    game.keys.space = false;
                    break;
            }
        }

        // Touch control handlers
        function handleTouchStart(direction) {
            if (!game.gameActive) return;
            
            if (direction === 'left') {
                game.keys.left = true;
            } else if (direction === 'right') {
                game.keys.right = true;
            } else if (direction === 'jump') {
                if (!game.isJumping) {
                    game.keys.space = true;
                    game.isJumping = true;
                    game.playerVelocityY = 0.35;
                    game.trickRotation = 0;
                }
            }
        }

        function handleTouchEnd(direction) {
            if (direction === 'left') {
                game.keys.left = false;
            } else if (direction === 'right') {
                game.keys.right = false;
            } else if (direction === 'jump') {
                game.keys.space = false;
            }
        }

        // Handler functions for mobile controls (defined here for cleanup access)
        const leftTouchStart = (e) => {
            e.preventDefault();
            handleTouchStart('left');
        };
        const leftTouchEnd = (e) => {
            e.preventDefault();
            handleTouchEnd('left');
        };
        const leftMouseDown = (e) => {
            e.preventDefault();
            handleTouchStart('left');
        };
        const leftMouseUp = (e) => {
            e.preventDefault();
            handleTouchEnd('left');
        };

        const rightTouchStart = (e) => {
            e.preventDefault();
            handleTouchStart('right');
        };
        const rightTouchEnd = (e) => {
            e.preventDefault();
            handleTouchEnd('right');
        };
        const rightMouseDown = (e) => {
            e.preventDefault();
            handleTouchStart('right');
        };
        const rightMouseUp = (e) => {
            e.preventDefault();
            handleTouchEnd('right');
        };

        const jumpTouchStart = (e) => {
            e.preventDefault();
            handleTouchStart('jump');
        };
        const jumpTouchEnd = (e) => {
            e.preventDefault();
            handleTouchEnd('jump');
        };
        const jumpMouseDown = (e) => {
            e.preventDefault();
            handleTouchStart('jump');
        };
        const jumpMouseUp = (e) => {
            e.preventDefault();
            handleTouchEnd('jump');
        };

        const preventScroll = (e) => {
            e.preventDefault();
        };

        // Setup mobile control button handlers (use setTimeout to ensure DOM is ready)
        let leftBtn, rightBtn, jumpBtn;
        let setupTimeout;
        
        const setupMobileControls = () => {
            leftBtn = document.getElementById('mobileLeft');
            rightBtn = document.getElementById('mobileRight');
            jumpBtn = document.getElementById('mobileJump');
            
            if (!leftBtn || !rightBtn || !jumpBtn) {
                setupTimeout = setTimeout(setupMobileControls, 50);
                return;
            }
            
            if (leftBtn) {
                leftBtn.addEventListener('touchstart', leftTouchStart);
                leftBtn.addEventListener('touchend', leftTouchEnd);
                leftBtn.addEventListener('touchcancel', leftTouchEnd);
                leftBtn.addEventListener('mousedown', leftMouseDown);
                leftBtn.addEventListener('mouseup', leftMouseUp);
                leftBtn.addEventListener('mouseleave', leftTouchEnd);
            }

            if (rightBtn) {
                rightBtn.addEventListener('touchstart', rightTouchStart);
                rightBtn.addEventListener('touchend', rightTouchEnd);
                rightBtn.addEventListener('touchcancel', rightTouchEnd);
                rightBtn.addEventListener('mousedown', rightMouseDown);
                rightBtn.addEventListener('mouseup', rightMouseUp);
                rightBtn.addEventListener('mouseleave', rightTouchEnd);
            }

            if (jumpBtn) {
                jumpBtn.addEventListener('touchstart', jumpTouchStart);
                jumpBtn.addEventListener('touchend', jumpTouchEnd);
                jumpBtn.addEventListener('touchcancel', jumpTouchEnd);
                jumpBtn.addEventListener('mousedown', jumpMouseDown);
                jumpBtn.addEventListener('mouseup', jumpMouseUp);
            }
        };
        
        // Prevent scrolling on touch
        container.addEventListener('touchmove', preventScroll, { passive: false });
        
        // Setup mobile controls after a short delay to ensure DOM is ready
        setupMobileControls();

        function checkCollision() {
            const playerBox = new THREE.Box3().setFromObject(game.player);

            for (let obstacle of game.obstacles) {
                if (obstacle.mesh && obstacle.mesh.parent) {
                    const obstacleBox = new THREE.Box3().setFromObject(obstacle.mesh);

                    if (playerBox.intersectsBox(obstacleBox) && !game.isJumping) {
                        gameOver();
                        return true;
                    }
                }
            }
            return false;
        }

        function gameOver() {
            game.gameActive = false;
            const gameOverEl = document.getElementById('gameOver');
            const finalScoreEl = document.getElementById('finalScore');
            const instructionsEl = document.getElementById('instructions');
            if (gameOverEl) gameOverEl.style.display = 'block';
            if (finalScoreEl) finalScoreEl.textContent = `SCORE: ${Math.floor(game.score)}`;
            if (instructionsEl) instructionsEl.style.display = 'block';
        }

        function updateUI() {
            const scoreValue = document.getElementById('scoreValue');
            const speedValue = document.getElementById('speedValue');
            const tricksValue = document.getElementById('tricksValue');
            if (scoreValue) scoreValue.textContent = Math.floor(game.score);
            if (speedValue) speedValue.textContent = Math.floor(game.speed * 100);
            if (tricksValue) tricksValue.textContent = game.trickCount;
        }

        function onWindowResize() {
            game.camera.aspect = window.innerWidth / window.innerHeight;
            game.camera.updateProjectionMatrix();
            game.renderer.setSize(window.innerWidth, window.innerHeight);
            if (speedCanvas) {
                speedCanvas.width = window.innerWidth;
                speedCanvas.height = window.innerHeight;
            }
            
            // Update mobile controls visibility on resize
            const isMobileNow = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                               (window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
            const mobileControlsEl = document.getElementById('mobileControls');
            const cursorEl = document.getElementById('skateboard-cursor');
            if (mobileControlsEl) {
                mobileControlsEl.style.display = isMobileNow ? 'flex' : 'none';
            }
            if (cursorEl) {
                cursorEl.style.display = isMobileNow ? 'none' : 'block';
            }
        }

        function animate() {
            game.animationId = requestAnimationFrame(animate);

            if (game.gameActive) {
                game.speed = Math.min(game.baseSpeed + game.score * 0.00012, game.maxSpeed);

                if (game.keys.left) {
                    game.playerX = Math.max(game.playerX - 0.12, -3.5);
                    game.player.rotation.z = Math.min(game.player.rotation.z + 0.06, 0.4);
                }
                if (game.keys.right) {
                    game.playerX = Math.min(game.playerX + 0.12, 3.5);
                    game.player.rotation.z = Math.max(game.player.rotation.z - 0.06, -0.4);
                }

                if (!game.keys.left && !game.keys.right) {
                    game.player.rotation.z *= 0.88;
                }

                if (game.isJumping) {
                    game.playerVelocityY -= game.gravity;
                    game.playerY += game.playerVelocityY;

                    game.trickRotation += 0.15;
                    game.skateboard.rotation.x = game.trickRotation;

                    if (game.playerY <= 0) {
                        game.playerY = 0;
                        game.isJumping = false;
                        game.skateboard.rotation.x = 0;
                        game.trickCount++;
                        game.combo++;

                        const trickBonus = 50 * game.combo;
                        game.score += trickBonus;

                        const tricks = ['KICKFLIP!', 'HEELFLIP!', '360 FLIP!', 'OLLIE!', 'SHUVIT!'];
                        showCombo(tricks[Math.floor(Math.random() * tricks.length)] + ' +' + trickBonus);

                        setTimeout(() => { game.combo = 0; }, 2000);
                    }
                }

                game.player.position.x = game.playerX;
                game.player.position.y = 1 + game.playerY;

                // Animate obstacles
                game.obstacles.forEach(obstacle => {
                    obstacle.mesh.position.z += game.speed;
                    obstacle.z += game.speed;

                    if (obstacle.type === 'crystal') {
                        obstacle.mesh.rotation.y += 0.03;
                        obstacle.mesh.position.y = 0.5 + Math.sin(Date.now() * 0.003 + obstacle.x) * 0.2;
                    }

                    if (obstacle.z > 10) {
                        game.scene.remove(obstacle.mesh);
                        const index = game.obstacles.indexOf(obstacle);
                        game.obstacles.splice(index, 1);
                    }
                });

                game.roadSegments.forEach(segment => {
                    segment.mesh.position.z += game.speed;
                    segment.z += game.speed;

                    if (segment.z > 10) {
                        game.scene.remove(segment.mesh);
                        const index = game.roadSegments.indexOf(segment);
                        game.roadSegments.splice(index, 1);
                    }
                });

                game.trees.forEach(tree => {
                    tree.mesh.position.z += game.speed;
                    tree.z += game.speed;

                    if (tree.z > 10) {
                        game.scene.remove(tree.mesh);
                        const index = game.trees.indexOf(tree);
                        game.trees.splice(index, 1);
                    }
                });

                // Animate particles
                game.particles.forEach(particle => {
                    particle.mesh.position.z += game.speed + particle.velocity;
                    particle.mesh.position.x += Math.sin(particle.oscillation) * 0.02;
                    particle.oscillation += 0.05;

                    if (particle.mesh.position.z > 10) {
                        particle.mesh.position.z = -100;
                        particle.mesh.position.x = (Math.random() - 0.5) * 15;
                        particle.mesh.position.y = Math.random() * 10;
                    }
                });

                if (game.roadSegments.length < 100) {
                    const lastZ = game.roadSegments.length > 0 ?
                        Math.min(...game.roadSegments.map(s => s.z)) : 0;
                    createRoadSegment(lastZ - 5);
                }

                game.score += game.speed * 0.6;
                checkCollision();
                updateUI();
            }

            game.renderer.render(game.scene, game.camera);
        }

        function restartGame() {
            game.obstacles.forEach(obs => game.scene.remove(obs.mesh));
            game.roadSegments.forEach(seg => game.scene.remove(seg.mesh));
            game.trees.forEach(tree => game.scene.remove(tree.mesh));

            game.obstacles = [];
            game.roadSegments = [];
            game.trees = [];
            game.score = 0;
            game.speed = 0;
            game.playerX = 0;
            game.playerY = 0;
            game.playerVelocityY = 0;
            game.isJumping = false;
            game.trickCount = 0;
            game.gameActive = true;
            game.combo = 0;
            game.trickRotation = 0;

            game.player.position.set(0, 1, 0);
            game.player.rotation.z = 0;
            game.skateboard.rotation.x = 0;

            for (let i = 0; i < 25; i++) {
                createRoadSegment(-i * 5);
            }

            const gameOverEl = document.getElementById('gameOver');
            const instructionsEl = document.getElementById('instructions');
            if (gameOverEl) gameOverEl.style.display = 'none';
            if (instructionsEl) instructionsEl.style.display = 'none';
            updateUI();
        }

        // Initialize game
        init();
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('resize', onWindowResize);
        window.restartGame = restartGame;
        animate();

        // Cleanup
        return () => {
            // Clear setup timeout if it exists
            if (setupTimeout) {
                clearTimeout(setupTimeout);
            }
            
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('resize', onWindowResize);
            container.removeEventListener('touchmove', preventScroll);
            
            // Clean up mobile control handlers (re-query in case elements weren't found initially)
            const cleanupLeftBtn = document.getElementById('mobileLeft');
            const cleanupRightBtn = document.getElementById('mobileRight');
            const cleanupJumpBtn = document.getElementById('mobileJump');
            
            if (cleanupLeftBtn) {
                cleanupLeftBtn.removeEventListener('touchstart', leftTouchStart);
                cleanupLeftBtn.removeEventListener('touchend', leftTouchEnd);
                cleanupLeftBtn.removeEventListener('touchcancel', leftTouchEnd);
                cleanupLeftBtn.removeEventListener('mousedown', leftMouseDown);
                cleanupLeftBtn.removeEventListener('mouseup', leftMouseUp);
                cleanupLeftBtn.removeEventListener('mouseleave', leftTouchEnd);
            }
            if (cleanupRightBtn) {
                cleanupRightBtn.removeEventListener('touchstart', rightTouchStart);
                cleanupRightBtn.removeEventListener('touchend', rightTouchEnd);
                cleanupRightBtn.removeEventListener('touchcancel', rightTouchEnd);
                cleanupRightBtn.removeEventListener('mousedown', rightMouseDown);
                cleanupRightBtn.removeEventListener('mouseup', rightMouseUp);
                cleanupRightBtn.removeEventListener('mouseleave', rightTouchEnd);
            }
            if (cleanupJumpBtn) {
                cleanupJumpBtn.removeEventListener('touchstart', jumpTouchStart);
                cleanupJumpBtn.removeEventListener('touchend', jumpTouchEnd);
                cleanupJumpBtn.removeEventListener('touchcancel', jumpTouchEnd);
                cleanupJumpBtn.removeEventListener('mousedown', jumpMouseDown);
                cleanupJumpBtn.removeEventListener('mouseup', jumpMouseUp);
            }
            
            delete window.restartGame;
            
            if (game.animationId) {
                cancelAnimationFrame(game.animationId);
            }
            
            if (game.renderer) {
                container.removeChild(game.renderer.domElement);
                game.renderer.dispose();
            }
            
            // Clean up Three.js objects
            if (game.scene) {
                game.scene.traverse((object) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(mat => mat.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }
        };
    }, []);

    return (
        <div className="skateboard-game-container">
            <div id="skateboard-cursor" className="skateboard-cursor"></div>
            <canvas id="speedLines"></canvas>
            <div ref={containerRef} className="game-canvas-container"></div>
            
            <div id="ui" className="skateboard-ui">
                <div className="stat">
                    Score<br />
                    <span className="stat-value" id="scoreValue">0</span>
                </div>
                <div className="stat">
                    Speed<br />
                    <span className="stat-value" id="speedValue">0</span>
                </div>
                <div className="stat">
                    Tricks<br />
                    <span className="stat-value" id="tricksValue">0</span>
                </div>
            </div>

            <div id="comboDisplay" className="combo-display"></div>

            <div id="gameOver" className="game-over">
                <h1>WIPEOUT!</h1>
                <div id="finalScore"></div>
                <button onClick={() => window.restartGame?.()}>RETRY</button>
            </div>

            <div id="instructions" className="instructions">
                <span className="key">←</span>
                <span className="key">→</span>
                STEER
                <span className="key">SPACE</span>
                JUMP & TRICK
            </div>

            <div id="mobileControls" className="mobile-controls">
                <button id="mobileLeft" className="mobile-btn mobile-btn-left">
                    ←
                </button>
                <button id="mobileJump" className="mobile-btn mobile-btn-jump">
                    ⬆
                </button>
                <button id="mobileRight" className="mobile-btn mobile-btn-right">
                    →
                </button>
            </div>
        </div>
    );
};

export default SkateboardGame;

