import { SPEED_LINES } from '../constants/gameConstants';

/**
 * Initializes and animates speed lines on a canvas
 */
export function initSpeedLines(canvas) {
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const speedLines = [];
    
    function createSpeedLine() {
        return {
            x: Math.random() * canvas.width,
            y: -10,
            speed: SPEED_LINES.SPEED.MIN + Math.random() * (SPEED_LINES.SPEED.MAX - SPEED_LINES.SPEED.MIN),
            length: SPEED_LINES.LENGTH.MIN + Math.random() * (SPEED_LINES.LENGTH.MAX - SPEED_LINES.LENGTH.MIN),
            opacity: Math.random() * (SPEED_LINES.OPACITY.MAX - SPEED_LINES.OPACITY.MIN) + SPEED_LINES.OPACITY.MIN
        };
    }

    // Initialize speed lines
    for (let i = 0; i < SPEED_LINES.COUNT; i++) {
        speedLines.push(createSpeedLine());
    }

    let animationId = null;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        speedLines.forEach(line => {
            line.y += line.speed;

            if (line.y > canvas.height) {
                Object.assign(line, createSpeedLine());
            }

            ctx.strokeStyle = `${SPEED_LINES.COLOR}${line.opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x, line.y + line.length);
            ctx.stroke();
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();

    return {
        stop: () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        },
        resize: (width, height) => {
            canvas.width = width;
            canvas.height = height;
        }
    };
}
