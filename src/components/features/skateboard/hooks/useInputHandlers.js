import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling keyboard and touch input
 */
export function useInputHandlers(gameRef, onJump) {
    const keysRef = useRef({
        left: false,
        right: false,
        space: false
    });

    useEffect(() => {
        const game = gameRef.current;

        function onKeyDown(event) {
            switch (event.code) {
                case 'ArrowLeft':
                    keysRef.current.left = true;
                    game.keys.left = true;
                    break;
                case 'ArrowRight':
                    keysRef.current.right = true;
                    game.keys.right = true;
                    break;
                case 'Space':
                    if (!game.isJumping && game.gameActive) {
                        keysRef.current.space = true;
                        game.keys.space = true;
                        onJump();
                    }
                    event.preventDefault();
                    break;
            }
        }

        function onKeyUp(event) {
            switch (event.code) {
                case 'ArrowLeft':
                    keysRef.current.left = false;
                    game.keys.left = false;
                    break;
                case 'ArrowRight':
                    keysRef.current.right = false;
                    game.keys.right = false;
                    break;
                case 'Space':
                    keysRef.current.space = false;
                    game.keys.space = false;
                    break;
            }
        }

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [gameRef, onJump]);

    return keysRef;
}

/**
 * Hook for handling touch/mouse controls on mobile buttons
 */
export function useMobileControls(gameRef, onJump) {
    useEffect(() => {
        const game = gameRef.current;

        function handleTouchStart(direction) {
            if (!game.gameActive) return;

            if (direction === 'left') {
                game.keys.left = true;
            } else if (direction === 'right') {
                game.keys.right = true;
            } else if (direction === 'jump') {
                if (!game.isJumping) {
                    game.keys.space = true;
                    onJump();
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

        // Handler functions
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

        // Setup mobile control button handlers
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

        setupMobileControls();

        return () => {
            if (setupTimeout) {
                clearTimeout(setupTimeout);
            }

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
        };
    }, [gameRef, onJump]);
}
