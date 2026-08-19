import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './CalculusChart.css';

const X_MIN = 0;
const X_MAX = 10;
const Y_MAX = 8;
const PADDING = { top: 24, right: 24, bottom: 48, left: 56 };
const SVG_WIDTH = 720;
const SVG_HEIGHT = 420;

const f = (x) => 0.25 * x * x;
const df = (x) => 0.5 * x;
const F = (x) => (x ** 3) / 12;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatNum = (value, digits = 3) => {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
};

const buildCurvePoints = () => {
  const points = [];
  for (let x = X_MIN; x <= X_MAX; x += 0.1) {
    points.push({ x, y: f(x) });
  }
  return points;
};

const CURVE_POINTS = buildCurvePoints();

export const CalculusChart = () => {
  const svgRef = useRef(null);
  const [mode, setMode] = useState('derivative');
  const [x1, setX1] = useState(2.5);
  const [x2, setX2] = useState(6);
  const [a, setA] = useState(2);
  const [b, setB] = useState(7);
  const [rectCount, setRectCount] = useState(12);
  const [dragTarget, setDragTarget] = useState(null);

  const plotWidth = SVG_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;

  const toSvg = useCallback(
    (x, y) => ({
      sx: PADDING.left + ((x - X_MIN) / (X_MAX - X_MIN)) * plotWidth,
      sy: PADDING.top + plotHeight - (y / Y_MAX) * plotHeight,
    }),
    [plotHeight, plotWidth]
  );

  const fromSvgX = useCallback(
    (sx) => {
      const ratio = (sx - PADDING.left) / plotWidth;
      return clamp(X_MIN + ratio * (X_MAX - X_MIN), X_MIN, X_MAX);
    },
    [plotWidth]
  );

  const getSvgPoint = useCallback((event) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const scaleX = SVG_WIDTH / rect.width;
    return (clientX - rect.left) * scaleX;
  }, []);

  const handlePointerDown = (target) => (event) => {
    event.preventDefault();
    setDragTarget(target);
  };

  useEffect(() => {
    if (!dragTarget) return undefined;

    const handleMove = (event) => {
      const svgX = getSvgPoint(event);
      if (svgX == null) return;
      const nextX = fromSvgX(svgX);

      if (dragTarget === 'x1') {
        setX1(clamp(nextX, X_MIN + 0.3, X_MAX - 0.3));
      } else if (dragTarget === 'x2') {
        setX2(clamp(nextX, X_MIN + 0.3, X_MAX - 0.3));
      } else if (dragTarget === 'a') {
        setA(clamp(nextX, X_MIN, b - 0.4));
      } else if (dragTarget === 'b') {
        setB(clamp(nextX, a + 0.4, X_MAX));
      }
    };

    const handleUp = () => setDragTarget(null);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [a, b, dragTarget, fromSvgX, getSvgPoint]);

  const curvePath = useMemo(() => {
    return CURVE_POINTS.map(({ x, y }, index) => {
      const { sx, sy } = toSvg(x, y);
      return `${index === 0 ? 'M' : 'L'} ${sx} ${sy}`;
    }).join(' ');
  }, [toSvg]);

  const y1 = f(x1);
  const y2 = f(x2);
  const p1 = toSvg(x1, y1);
  const p2 = toSvg(x2, y2);
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const secantSlope = deltaX !== 0 ? deltaY / deltaX : NaN;
  const tangentSlope = df(x1);
  const tangentLength = 2.8;
  const tangentStart = toSvg(x1 - tangentLength, y1 - tangentSlope * tangentLength);
  const tangentEnd = toSvg(x1 + tangentLength, y1 + tangentSlope * tangentLength);

  const exactIntegral = F(b) - F(a);
  const delta = (b - a) / rectCount;
  const riemannSum = Array.from({ length: rectCount }, (_, index) => {
    const xi = a + index * delta + delta / 2;
    return f(xi) * delta;
  }).reduce((sum, value) => sum + value, 0);

  const areaPath = useMemo(() => {
    const start = toSvg(a, 0);
    const topPoints = CURVE_POINTS.filter(({ x }) => x >= a && x <= b)
      .map(({ x, y }) => {
        const point = toSvg(x, y);
        return `${point.sx},${point.sy}`;
      })
      .join(' L ');
    const end = toSvg(b, 0);
    return `M ${start.sx} ${start.sy} L ${topPoints} L ${end.sx} ${end.sy} Z`;
  }, [a, b, toSvg]);

  const riemannRects = useMemo(() => {
    return Array.from({ length: rectCount }, (_, index) => {
      const left = a + index * delta;
      const right = left + delta;
      const height = f(left + delta / 2);
      const bottomLeft = toSvg(left, 0);
      const topRight = toSvg(right, height);
      return {
        x: bottomLeft.sx,
        y: topRight.sy,
        width: topRight.sx - bottomLeft.sx,
        height: bottomLeft.sy - topRight.sy,
      };
    });
  }, [a, delta, rectCount, toSvg]);

  const axisBottom = PADDING.top + plotHeight;
  const axisRight = PADDING.left + plotWidth;

  return (
    <div className="calculus-chart">
      <div className="calculus-chart__header">
        <div>
          <h3>Derivitives and Integrals Lab</h3>
          <p>Drag the points to see derivatives and integrals update in real time.</p>
        </div>
        <div className="calculus-chart__tabs" role="tablist" aria-label="Calculus mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'derivative'}
            className={mode === 'derivative' ? 'active' : ''}
            onClick={() => setMode('derivative')}
          >
            Derivative
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'integral'}
            className={mode === 'integral' ? 'active' : ''}
            onClick={() => setMode('integral')}
          >
            Integral
          </button>
        </div>
      </div>

      <div className="calculus-chart__body">
        <div className="calculus-chart__canvas-wrap">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="calculus-chart__svg"
            aria-label="Interactive calculus chart"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#AA367C" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#4A2FBD" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {[0, 2, 4, 6, 8].map((tick) => {
              const { sx, sy } = toSvg(tick, 0);
              return (
                <g key={`x-${tick}`}>
                  <line x1={sx} y1={PADDING.top} x2={sx} y2={axisBottom} className="grid-line" />
                  <text x={sx} y={axisBottom + 22} className="axis-label">{tick}</text>
                </g>
              );
            })}

            {[0, 2, 4, 6, 8].map((tick) => {
              const { sy } = toSvg(0, tick);
              return (
                <g key={`y-${tick}`}>
                  <line x1={PADDING.left} y1={sy} x2={axisRight} y2={sy} className="grid-line" />
                  <text x={PADDING.left - 12} y={sy + 4} className="axis-label">{tick}</text>
                </g>
              );
            })}

            <line x1={PADDING.left} y1={axisBottom} x2={axisRight} y2={axisBottom} className="axis-line" />
            <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={axisBottom} className="axis-line" />
            <text x={axisRight - 8} y={axisBottom + 34} className="axis-title">x</text>
            <text x={18} y={PADDING.top + 8} className="axis-title">y</text>

            <path d={curvePath} className="curve-line" />
            <text x={toSvg(8.2, f(8.2)).sx} y={toSvg(8.2, f(8.2)).sy - 12} className="curve-label">
              f(x) = ¼x²
            </text>

            {mode === 'derivative' && (
              <>
                <line
                  x1={p1.sx}
                  y1={p1.sy}
                  x2={p2.sx}
                  y2={p2.sy}
                  className="secant-line"
                />
                <line
                  x1={tangentStart.sx}
                  y1={tangentStart.sy}
                  x2={tangentEnd.sx}
                  y2={tangentEnd.sy}
                  className="tangent-line"
                />
                <line x1={p1.sx} y1={p1.sy} x2={p2.sx} y2={p2.sy} className="delta-bridge" strokeDasharray="6 4" />
                <line x1={p2.sx} y1={p2.sy} x2={p2.sx} y2={p1.sy} className="delta-bridge" strokeDasharray="6 4" />

                <circle
                  cx={p1.sx}
                  cy={p1.sy}
                  r={10}
                  className="handle handle--primary"
                  onMouseDown={handlePointerDown('x1')}
                  onTouchStart={handlePointerDown('x1')}
                />
                <circle
                  cx={p2.sx}
                  cy={p2.sy}
                  r={10}
                  className="handle handle--secondary"
                  onMouseDown={handlePointerDown('x2')}
                  onTouchStart={handlePointerDown('x2')}
                />
                <text x={p1.sx + 14} y={p1.sy - 14} className="point-label">P₁</text>
                <text x={p2.sx + 14} y={p2.sy - 14} className="point-label">P₂</text>
              </>
            )}

            {mode === 'integral' && (
              <>
                <path d={areaPath} fill="url(#areaGradient)" className="area-fill" />
                {riemannRects.map((rect, index) => (
                  <rect
                    key={`rect-${index}`}
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    className="riemann-rect"
                  />
                ))}

                {[['a', a], ['b', b]].map(([key, value]) => {
                  const point = toSvg(value, 0);
                  return (
                    <g key={key}>
                      <line
                        x1={point.sx}
                        y1={PADDING.top}
                        x2={point.sx}
                        y2={axisBottom}
                        className="bound-line"
                      />
                      <circle
                        cx={point.sx}
                        cy={axisBottom}
                        r={10}
                        className={`handle handle--${key}`}
                        onMouseDown={handlePointerDown(key)}
                        onTouchStart={handlePointerDown(key)}
                      />
                      <text x={point.sx - 6} y={axisBottom + 36} className="point-label">{key}</text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>

        <div className="calculus-chart__panel">
          {mode === 'derivative' ? (
            <>
              <div className="calc-card">
                <span className="calc-card__label">Function value</span>
                <code>f({formatNum(x1, 2)}) = {formatNum(y1)}</code>
              </div>
              <div className="calc-card">
                <span className="calc-card__label">Secant slope</span>
                <code>
                  m = Δy/Δx = ({formatNum(y2)} − {formatNum(y1)}) / ({formatNum(x2, 2)} − {formatNum(x1, 2)}) = {formatNum(secantSlope)}
                </code>
              </div>
              <div className="calc-card calc-card--highlight">
                <span className="calc-card__label">Instantaneous derivative</span>
                <code>f&apos;({formatNum(x1, 2)}) = ½ · {formatNum(x1, 2)} = {formatNum(tangentSlope)}</code>
              </div>
              <p className="calc-note">
                Move P₁ and P₂. As Δx shrinks, the secant slope approaches the tangent slope f&apos;(x) = ½x.
              </p>
            </>
          ) : (
            <>
              <div className="calc-card">
                <span className="calc-card__label">Interval</span>
                <code>∫ from {formatNum(a, 2)} to {formatNum(b, 2)}</code>
              </div>
              <div className="calc-card">
                <span className="calc-card__label">Riemann sum ({rectCount} rectangles)</span>
                <code>Σ f(xᵢ) · Δx ≈ {formatNum(riemannSum)}</code>
              </div>
              <div className="calc-card calc-card--highlight">
                <span className="calc-card__label">Exact integral</span>
                <code>F(b) − F(a) = {formatNum(F(b))} − {formatNum(F(a))} = {formatNum(exactIntegral)}</code>
              </div>
              <label className="calc-slider">
                <span>Rectangles: {rectCount}</span>
                <input
                  type="range"
                  min="4"
                  max="40"
                  value={rectCount}
                  onChange={(event) => setRectCount(Number(event.target.value))}
                />
              </label>
              <p className="calc-note">
                Drag <strong>a</strong> and <strong>b</strong> along the x-axis. More rectangles make the Riemann sum closer to the exact area.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
