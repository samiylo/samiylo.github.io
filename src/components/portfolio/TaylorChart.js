import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './TaylorChart.css';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 420;
const PADDING = { top: 24, right: 24, bottom: 48, left: 56 };

const FUNCTIONS = {
  sine: {
    label: 'sin(x)',
    formula: 'sin(x)',
    xMin: -2 * Math.PI,
    xMax: 2 * Math.PI,
    yMin: -2.4,
    yMax: 2.4,
    xTicks: [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI],
    yTicks: [-2, -1, 0, 1, 2],
    f: Math.sin,
    deriv: (a, k) => Math.sin(a + (k * Math.PI) / 2),
  },
  exp: {
    label: 'eˣ',
    formula: 'eˣ',
    xMin: -2.4,
    xMax: 2.4,
    yMin: -1,
    yMax: 12,
    xTicks: [-2, -1, 0, 1, 2],
    yTicks: [0, 3, 6, 9, 12],
    f: Math.exp,
    deriv: (a) => Math.exp(a),
  },
  cosine: {
    label: 'cos(x)',
    formula: 'cos(x)',
    xMin: -2 * Math.PI,
    xMax: 2 * Math.PI,
    yMin: -2.4,
    yMax: 2.4,
    xTicks: [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI],
    yTicks: [-2, -1, 0, 1, 2],
    f: Math.cos,
    deriv: (a, k) => Math.cos(a + (k * Math.PI) / 2),
  },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatNum = (value, digits = 3) => {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
};

const formatTick = (value) => {
  const n = value / Math.PI;
  if (Math.abs(n) < 0.01) return '0';
  if (Math.abs(n - 1) < 0.01) return 'π';
  if (Math.abs(n + 1) < 0.01) return '−π';
  if (Math.abs(n - 2) < 0.01) return '2π';
  if (Math.abs(n + 2) < 0.01) return '−2π';
  return formatNum(value, 0);
};

const sampleXs = (min, max, step) => {
  const xs = [];
  for (let x = min; x <= max + 1e-9; x += step) xs.push(x);
  if (xs[xs.length - 1] < max) xs.push(max);
  return xs;
};

const taylorAt = (x, a, degree, deriv) => {
  let sum = 0;
  let pow = 1;
  let fact = 1;
  for (let k = 0; k <= degree; k += 1) {
    if (k > 0) {
      pow *= x - a;
      fact *= k;
    }
    sum += (deriv(a, k) * pow) / fact;
  }
  return sum;
};

const buildPath = (xs, yFn, toSvg) => {
  let d = '';
  let started = false;
  xs.forEach((x) => {
    const y = yFn(x);
    if (!Number.isFinite(y) || Math.abs(y) > 1e4) {
      started = false;
      return;
    }
    const { sx, sy } = toSvg(x, y);
    d += `${started ? 'L' : 'M'} ${sx} ${sy} `;
    started = true;
  });
  return d.trim();
};

export const TaylorChart = () => {
  const svgRef = useRef(null);
  const [fnKey, setFnKey] = useState('sine');
  const [center, setCenter] = useState(0);
  const [probe, setProbe] = useState(1.2);
  const [degree, setDegree] = useState(4);
  const [dragTarget, setDragTarget] = useState(null);

  const fn = FUNCTIONS[fnKey];
  const plotWidth = SVG_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;

  const toSvg = useCallback(
    (x, y) => ({
      sx: PADDING.left + ((x - fn.xMin) / (fn.xMax - fn.xMin)) * plotWidth,
      sy: PADDING.top + plotHeight - ((y - fn.yMin) / (fn.yMax - fn.yMin)) * plotHeight,
    }),
    [fn.xMax, fn.xMin, fn.yMax, fn.yMin, plotHeight, plotWidth]
  );

  const fromSvgX = useCallback(
    (sx) => {
      const ratio = (sx - PADDING.left) / plotWidth;
      return clamp(fn.xMin + ratio * (fn.xMax - fn.xMin), fn.xMin, fn.xMax);
    },
    [fn.xMax, fn.xMin, plotWidth]
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
      if (dragTarget === 'center') setCenter(nextX);
      if (dragTarget === 'probe') setProbe(nextX);
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
  }, [dragTarget, fromSvgX, getSvgPoint]);

  const xs = useMemo(
    () => sampleXs(fn.xMin, fn.xMax, (fn.xMax - fn.xMin) / 220),
    [fn.xMax, fn.xMin]
  );

  const curvePath = useMemo(() => buildPath(xs, fn.f, toSvg), [fn.f, toSvg, xs]);
  const taylorPath = useMemo(
    () => buildPath(xs, (x) => taylorAt(x, center, degree, fn.deriv), toSvg),
    [center, degree, fn.deriv, toSvg, xs]
  );
  const linearPath = useMemo(
    () => buildPath(xs, (x) => taylorAt(x, center, 1, fn.deriv), toSvg),
    [center, fn.deriv, toSvg, xs]
  );

  const yCenter = fn.f(center);
  const yProbe = fn.f(probe);
  const yTaylor = taylorAt(probe, center, degree, fn.deriv);
  const error = yProbe - yTaylor;
  const pCenter = toSvg(center, yCenter);
  const pProbeFn = toSvg(probe, yProbe);
  const pProbeT = toSvg(probe, yTaylor);
  const axisBottom = PADDING.top + plotHeight;
  const axisRight = PADDING.left + plotWidth;
  const remainderColor = Math.abs(error) < 0.08 ? '#34d399' : '#fbbf24';

  const switchFunction = (key) => {
    setFnKey(key);
    setCenter(0);
    setProbe(key === 'exp' ? 1.1 : 1.2);
  };

  return (
    <div className="taylor-chart">
      <div className="taylor-chart__header">
        <div>
          <h3>Taylor Polynomials Lab</h3>
          <p>Drag the expansion point and raise the degree to watch the polynomial wrap around the function.</p>
        </div>
        <div className="taylor-chart__tabs" role="tablist" aria-label="Function">
          {Object.entries(FUNCTIONS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={fnKey === key}
              className={fnKey === key ? 'active' : ''}
              onClick={() => switchFunction(key)}
            >
              {value.label}
            </button>
          ))}
        </div>
      </div>

      <div className="taylor-chart__body">
        <div className="taylor-chart__canvas-wrap">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="taylor-chart__svg"
            aria-label="Interactive Taylor polynomial chart"
          >
            <defs>
              <clipPath id="taylorPlotClip">
                <rect
                  x={PADDING.left}
                  y={PADDING.top}
                  width={plotWidth}
                  height={plotHeight}
                />
              </clipPath>
            </defs>

            {fn.xTicks.map((tick) => {
              const { sx } = toSvg(tick, 0);
              return (
                <g key={`x-${tick}`}>
                  <line x1={sx} y1={PADDING.top} x2={sx} y2={axisBottom} className="grid-line" />
                  <text x={sx} y={axisBottom + 22} className="axis-label">{formatTick(tick)}</text>
                </g>
              );
            })}

            {fn.yTicks.map((tick) => {
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

            <g clipPath="url(#taylorPlotClip)">
              <line
                x1={pCenter.sx}
                y1={PADDING.top}
                x2={pCenter.sx}
                y2={axisBottom}
                className="bound-line"
              />
              {degree > 1 && <path d={linearPath} className="taylor-line taylor-line--linear" />}
              <path d={curvePath} className="curve-line" />
              <path d={taylorPath} className="taylor-line taylor-line--poly" />
              <line
                x1={pProbeFn.sx}
                y1={pProbeFn.sy}
                x2={pProbeT.sx}
                y2={pProbeT.sy}
                className="taylor-error"
                style={{ stroke: remainderColor }}
              />
            </g>

            <text x={toSvg(fn.xMax - (fn.xMax - fn.xMin) * 0.16, fn.f(fn.xMax * 0.72)).sx} y={PADDING.top + 18} className="curve-label">
              f(x) = {fn.formula}
            </text>

            <circle
              cx={pCenter.sx}
              cy={pCenter.sy}
              r={10}
              className="handle handle--primary"
              onMouseDown={handlePointerDown('center')}
              onTouchStart={handlePointerDown('center')}
            />
            <text x={pCenter.sx + 14} y={pCenter.sy - 14} className="point-label">a</text>

            <circle
              cx={pProbeFn.sx}
              cy={pProbeFn.sy}
              r={10}
              className="handle handle--secondary"
              onMouseDown={handlePointerDown('probe')}
              onTouchStart={handlePointerDown('probe')}
            />
            <text x={pProbeFn.sx + 14} y={pProbeFn.sy - 14} className="point-label">x</text>
          </svg>
        </div>

        <div className="taylor-chart__panel">
          <div className="calc-card calc-card--highlight">
            <span className="calc-card__label">Taylor polynomial</span>
            <code>
              T<sub>n</sub>(x) = Σ f⁽ᵏ⁾(a) / k! · (x − a)ᵏ
            </code>
            <code>
              n = {degree} around a = {formatNum(center, 2)}
            </code>
          </div>
          <div className="calc-card">
            <span className="calc-card__label">Function vs approximation</span>
            <code>f({formatNum(probe, 2)}) = {formatNum(yProbe)}</code>
            <code>T<sub>{degree}</sub>({formatNum(probe, 2)}) = {formatNum(yTaylor)}</code>
          </div>
          <div className="calc-card">
            <span className="calc-card__label">Remainder</span>
            <code>
              R<sub>n</sub>(x) = f(x) − T<sub>n</sub>(x) = {formatNum(error)}
            </code>
          </div>
          <label className="calc-slider">
            <span>Degree n: {degree}</span>
            <input
              type="range"
              min="0"
              max="12"
              value={degree}
              onChange={(event) => setDegree(Number(event.target.value))}
            />
          </label>
          <p className="calc-note">
            Drag <strong>a</strong> to choose the expansion point and <strong>x</strong> to measure error.
            Degree 1 is the tangent line; higher n hugs {fn.formula} in a neighborhood of a.
          </p>
        </div>
      </div>
    </div>
  );
};
