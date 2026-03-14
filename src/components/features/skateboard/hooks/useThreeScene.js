import { useEffect, useRef, useState } from 'react';
import { createScene, createPlayer, createRoadSegment, createParticle } from '../utils/sceneFactory';
import { ROAD, PARTICLES } from '../constants/gameConstants';

/**
 * Custom hook for initializing and managing the Three.js scene
 */
export function useThreeScene(containerRef) {
    const [sceneState, setSceneState] = useState(null);
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
        animationId: null,
        comboTimeoutId: null
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Initialize Three.js scene
        const { scene, camera, renderer } = createScene(container);
        const { player, skateboard } = createPlayer();

        gameRef.current.scene = scene;
        gameRef.current.camera = camera;
        gameRef.current.renderer = renderer;
        gameRef.current.player = player;
        gameRef.current.skateboard = skateboard;

        scene.add(player);

        // Create initial road segments
        const obstacles = gameRef.current.obstacles;
        const roadSegments = gameRef.current.roadSegments;
        const trees = gameRef.current.trees;

        for (let i = 0; i < ROAD.INITIAL_SEGMENTS; i++) {
            createRoadSegment(-i * ROAD.SEGMENT_LENGTH, scene, obstacles, roadSegments, trees);
        }

        // Create particles
        const particles = gameRef.current.particles;
        for (let i = 0; i < PARTICLES.COUNT; i++) {
            createParticle(scene, particles);
        }

        setSceneState({
            scene,
            camera,
            renderer,
            player,
            skateboard,
            obstacles,
            roadSegments,
            trees,
            particles
        });

        // Handle window resize
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('resize', onWindowResize);

            // Cleanup Three.js resources
            if (renderer) {
                container.removeChild(renderer.domElement);
                renderer.dispose();
            }

            if (scene) {
                scene.traverse((object) => {
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
    }, [containerRef]);

    return { gameRef, sceneState };
}
