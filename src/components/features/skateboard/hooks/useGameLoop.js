import { useEffect, useRef } from 'react';
import { PHYSICS, SPEED, SCORING, ROAD, PARTICLES, TRICK_NAMES } from '../constants/gameConstants';
import { checkCollision } from '../utils/collisionDetection';
import { createRoadSegment, createParticle } from '../utils/sceneFactory';

/**
 * Custom hook for the main game loop.
 * Reads scene objects directly from gameRef to avoid stale closure issues
 * and prevent multiple animation loops from spawning on re-render.
 */
export function useGameLoop(gameRef, onGameOver, onScoreUpdate, onCombo) {
    const onGameOverRef = useRef(onGameOver);
    const onScoreUpdateRef = useRef(onScoreUpdate);
    const onComboRef = useRef(onCombo);

    // Keep callback refs current without re-running the effect
    useEffect(() => { onGameOverRef.current = onGameOver; }, [onGameOver]);
    useEffect(() => { onScoreUpdateRef.current = onScoreUpdate; }, [onScoreUpdate]);
    useEffect(() => { onComboRef.current = onCombo; }, [onCombo]);

    useEffect(() => {
        const game = gameRef.current;
        const { scene, camera, renderer, player, skateboard } = game;

        if (!scene || !camera || !renderer || !player) return;

        const obstacles = game.obstacles;
        const roadSegments = game.roadSegments;
        const trees = game.trees;
        const particles = game.particles;
        let animationId = null;

        function animate() {
            animationId = requestAnimationFrame(animate);

            if (game.gameActive) {
                // Update speed
                game.speed = Math.min(
                    SPEED.BASE + game.score * SPEED.INCREASE_RATE,
                    SPEED.MAX
                );

                // Handle player movement
                if (game.keys.left) {
                    game.playerX = Math.max(
                        game.playerX - PHYSICS.MOVEMENT_SPEED,
                        PHYSICS.PLAYER_BOUNDS.MIN_X
                    );
                    player.rotation.z = Math.min(
                        player.rotation.z + 0.06,
                        PHYSICS.PLAYER_ROTATION.MAX
                    );
                }
                if (game.keys.right) {
                    game.playerX = Math.min(
                        game.playerX + PHYSICS.MOVEMENT_SPEED,
                        PHYSICS.PLAYER_BOUNDS.MAX_X
                    );
                    player.rotation.z = Math.max(
                        player.rotation.z - 0.06,
                        -PHYSICS.PLAYER_ROTATION.MAX
                    );
                }

                if (!game.keys.left && !game.keys.right) {
                    player.rotation.z *= PHYSICS.PLAYER_ROTATION.DAMPING;
                }

                // Handle jumping
                if (game.isJumping) {
                    game.playerVelocityY -= PHYSICS.GRAVITY;
                    game.playerY += game.playerVelocityY;

                    game.trickRotation += 0.15;
                    skateboard.rotation.x = game.trickRotation;

                    if (game.playerY <= 0) {
                        game.playerY = 0;
                        game.isJumping = false;
                        skateboard.rotation.x = 0;
                        game.trickCount++;
                        game.combo++;

                        const trickBonus = SCORING.TRICK_BONUS_MULTIPLIER * game.combo;
                        game.score += trickBonus;

                        const trickName = TRICK_NAMES[Math.floor(Math.random() * TRICK_NAMES.length)];
                        onComboRef.current(`${trickName} +${trickBonus}`);

                        if (game.comboTimeoutId) {
                            clearTimeout(game.comboTimeoutId);
                        }
                        game.comboTimeoutId = setTimeout(() => {
                            if (game.gameActive) {
                                game.combo = 0;
                            }
                            game.comboTimeoutId = null;
                        }, SCORING.COMBO_TIMEOUT);
                    }
                }

                // Update player position
                player.position.x = game.playerX;
                player.position.y = 1 + game.playerY;

                // Animate obstacles
                obstacles.forEach(obstacle => {
                    if (!game.gameActive || !obstacle.mesh || !obstacle.mesh.parent) return;

                    obstacle.mesh.position.z += game.speed;
                    obstacle.z += game.speed;

                    if (obstacle.type === 'crystal') {
                        obstacle.mesh.rotation.y += 0.03;
                        obstacle.mesh.position.y = 0.5 + Math.sin(Date.now() * 0.003 + obstacle.x) * 0.2;
                    }

                    if (obstacle.z > 10) {
                        scene.remove(obstacle.mesh);
                        const index = obstacles.indexOf(obstacle);
                        if (index !== -1) obstacles.splice(index, 1);
                    }
                });

                // Animate road segments
                roadSegments.forEach(segment => {
                    if (!game.gameActive || !segment.mesh || !segment.mesh.parent) return;

                    segment.mesh.position.z += game.speed;
                    segment.z += game.speed;

                    if (segment.z > 10) {
                        scene.remove(segment.mesh);
                        const index = roadSegments.indexOf(segment);
                        if (index !== -1) roadSegments.splice(index, 1);
                    }
                });

                // Animate trees
                trees.forEach(tree => {
                    if (!game.gameActive || !tree.mesh || !tree.mesh.parent) return;

                    tree.mesh.position.z += game.speed;
                    tree.z += game.speed;

                    if (tree.z > 10) {
                        scene.remove(tree.mesh);
                        const index = trees.indexOf(tree);
                        if (index !== -1) trees.splice(index, 1);
                    }
                });

                // Animate particles
                particles.forEach(particle => {
                    particle.mesh.position.z += game.speed + particle.velocity;
                    particle.mesh.position.x += Math.sin(particle.oscillation) * 0.02;
                    particle.oscillation += PARTICLES.OSCILLATION_SPEED;

                    if (particle.mesh.position.z > 10) {
                        particle.mesh.position.z = -100;
                        particle.mesh.position.x = (Math.random() - 0.5) * 15;
                        particle.mesh.position.y = Math.random() * 10;
                    }
                });

                // Generate new road segments
                if (roadSegments.length < ROAD.MAX_SEGMENTS) {
                    let lastZ = 0;
                    for (let i = 0; i < roadSegments.length; i++) {
                        if (roadSegments[i].z < lastZ) lastZ = roadSegments[i].z;
                    }
                    createRoadSegment(lastZ - ROAD.SEGMENT_LENGTH, scene, obstacles, roadSegments, trees);
                }

                // Update score
                game.score += game.speed * SCORING.BASE_MULTIPLIER;
                onScoreUpdateRef.current({
                    score: Math.floor(game.score),
                    speed: Math.floor(game.speed * 100),
                    tricks: game.trickCount
                });

                // Check collision
                if (checkCollision(player, obstacles) && !game.isJumping) {
                    onGameOverRef.current(Math.floor(game.score));
                }
            }

            renderer.render(scene, camera);
        }

        animate();
        game.animationId = animationId;

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (game.comboTimeoutId) {
                clearTimeout(game.comboTimeoutId);
                game.comboTimeoutId = null;
            }
        };
    }, [gameRef]); // gameRef is stable — scene objects read directly from it
}
