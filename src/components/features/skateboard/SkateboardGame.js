import { useRef, useState, useCallback, useEffect } from 'react';
import './SkateboardGame.css';

// Hooks
import { useThreeScene } from './hooks/useThreeScene';
import { useGameLoop } from './hooks/useGameLoop';
import { useInputHandlers, useMobileControls } from './hooks/useInputHandlers';
import { useMobileDetection } from './hooks/useMobileDetection';
import { useCustomCursor } from './hooks/useCustomCursor';

// Components
import { GameUI } from './components/GameUI';
import { ComboDisplay } from './components/ComboDisplay';
import { GameOver } from './components/GameOver';
import { MobileControls } from './components/MobileControls';
import { Instructions } from './components/Instructions';

// Utils
import { initSpeedLines } from './utils/speedLines';
import { createRoadSegment } from './utils/sceneFactory';
import { ROAD } from './constants/gameConstants';

const SkateboardGame = () => {
    const containerRef = useRef(null);
    const speedLinesRef = useRef(null);
    const isRestartingRef = useRef(false);

    // Game state (using React state for UI updates)
    const [score, setScore] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [tricks, setTricks] = useState(0);
    const [comboText, setComboText] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [showInstructions, setShowInstructions] = useState(true);

    // Mobile detection
    const isMobile = useMobileDetection();
    useCustomCursor(isMobile);

    // Initialize Three.js scene
    const { gameRef, sceneState } = useThreeScene(containerRef);

    // Jump handler
    const handleJump = useCallback(() => {
        const game = gameRef.current;
        if (!game.isJumping && game.gameActive) {
            game.isJumping = true;
            game.playerVelocityY = 0.35;
            game.trickRotation = 0;
        }
    }, [gameRef]);

    // Input handlers
    useInputHandlers(gameRef, handleJump);
    useMobileControls(gameRef, handleJump);

    // Score update handler
    const handleScoreUpdate = useCallback((stats) => {
        setScore(stats.score);
        setSpeed(stats.speed);
        setTricks(stats.tricks);
    }, []);

    // Combo display handler
    const handleCombo = useCallback((text) => {
        setComboText(text);
    }, []);

    // Game over handler
    const handleGameOver = useCallback((score) => {
        setGameOver(true);
        setFinalScore(score);
        setShowInstructions(true);
        gameRef.current.gameActive = false;
    }, [gameRef]);

    // Game loop
    useGameLoop(
        gameRef,
        sceneState?.scene,
        sceneState?.camera,
        sceneState?.renderer,
        sceneState?.player,
        sceneState?.skateboard,
        handleGameOver,
        handleScoreUpdate,
        handleCombo
    );

    // Initialize speed lines
    useEffect(() => {
        const speedCanvas = document.getElementById('speedLines');
        if (speedCanvas) {
            speedLinesRef.current = initSpeedLines(speedCanvas);
        }

        return () => {
            if (speedLinesRef.current) {
                speedLinesRef.current.stop();
            }
        };
    }, []);

    // Handle window resize for speed lines
    useEffect(() => {
        function handleResize() {
            if (speedLinesRef.current) {
                speedLinesRef.current.resize(window.innerWidth, window.innerHeight);
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent scroll on touch
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const preventScroll = (e) => {
            e.preventDefault();
        };

        container.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            container.removeEventListener('touchmove', preventScroll);
        };
    }, []);

    // Restart game function
    const handleRestart = useCallback(() => {
        // Prevent multiple rapid restarts
        if (isRestartingRef.current) {
            return;
        }

        const game = gameRef.current;
        const scene = game.scene;

        if (!scene) return;

        isRestartingRef.current = true;

        // Stop the game first to prevent race conditions
        game.gameActive = false;

        // Remove all game objects safely
        game.obstacles.forEach(obs => {
            if (obs.mesh && obs.mesh.parent) {
                scene.remove(obs.mesh);
            }
        });
        game.roadSegments.forEach(seg => {
            if (seg.mesh && seg.mesh.parent) {
                scene.remove(seg.mesh);
            }
        });
        game.trees.forEach(tree => {
            if (tree.mesh && tree.mesh.parent) {
                scene.remove(tree.mesh);
            }
        });

        // Clear arrays
        game.obstacles.length = 0;
        game.roadSegments.length = 0;
        game.trees.length = 0;

        // Clear any pending combo timeout
        if (game.comboTimeoutId) {
            clearTimeout(game.comboTimeoutId);
            game.comboTimeoutId = null;
        }

        // Reset game state
        game.score = 0;
        game.speed = 0;
        game.playerX = 0;
        game.playerY = 0;
        game.playerVelocityY = 0;
        game.isJumping = false;
        game.trickCount = 0;
        game.combo = 0;
        game.trickRotation = 0;

        // Reset keys state to prevent immediate movement
        game.keys.left = false;
        game.keys.right = false;
        game.keys.space = false;

        // Reset player position and rotation
        if (game.player) {
            game.player.position.set(0, 1, 0);
            game.player.rotation.z = 0;
        }
        if (game.skateboard) {
            game.skateboard.rotation.x = 0;
        }

        // Recreate road segments
        for (let i = 0; i < ROAD.INITIAL_SEGMENTS; i++) {
            createRoadSegment(
                -i * ROAD.SEGMENT_LENGTH,
                scene,
                game.obstacles,
                game.roadSegments,
                game.trees
            );
        }

        // Re-enable game after a brief delay to ensure cleanup is complete
        setTimeout(() => {
            game.gameActive = true;
            isRestartingRef.current = false;
        }, 50);

        // Reset UI state
        setScore(0);
        setSpeed(0);
        setTricks(0);
        setComboText('');
        setGameOver(false);
        setFinalScore(0);
        setShowInstructions(false);
    }, [gameRef]);

    return (
        <div className="skateboard-game-container">
            <div id="skateboard-cursor" className="skateboard-cursor"></div>
            <canvas id="speedLines"></canvas>
            <div ref={containerRef} className="game-canvas-container"></div>

            <GameUI score={score} speed={speed} tricks={tricks} />
            <ComboDisplay comboText={comboText} />

            {gameOver && (
                <GameOver finalScore={finalScore} onRestart={handleRestart} />
            )}

            <Instructions show={showInstructions && !isMobile && !gameOver} />
            <MobileControls />
        </div>
    );
};

export default SkateboardGame;
