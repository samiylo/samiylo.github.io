import React, { useCallback, useEffect, useRef, useState } from 'react';
import './PIDChart.css';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 280;
const TERMS_HEIGHT = 160;
const PADDING = { top: 20, right: 18, bottom: 36, left: 48 };
const TIME_WINDOW = 10;
const Y_MIN = -1;
const Y_MAX = 11;
const U_MIN = -12;
const U_MAX = 12;
const DT = 1 / 60;
const MASS = 1;
const DAMPING = 1.15;
const UMAX = 18;
const I_CLAMP = 24;

const PRESETS = {
  p: { kp: 2.2, ki: 0, kd: 0, label: 'P only' },
  pd: { kp: 4.2, ki: 0, kd: 2.4, label: 'PD' },
  pi: { kp: 2.6, ki: 1.8, kd: 0, label: 'PI' },
  pid: { kp: 4.5, ki: 2.2, kd: 1.8, label: 'PID' },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatNum = (value, digits = 2) => {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
};

const toPath = (points, toSvgFn) => {
  if (!points.length) return '';
  return points
    .map((point, index) => {
      const { sx, sy } = toSvgFn(point.t, point.v);
      return `${index === 0 ? 'M' : 'L'} ${sx} ${sy}`;
    })
    .join(' ');
};

const initialSim = (setpoint) => ({
  y: 0,
  v: 0,
  integral: 0,
  prevY: 0,
  prevError: setpoint,
  t: 0,
  error: setpoint,
  pTerm: 0,
  iTerm: 0,
  dTerm: 0,
  u: 0,
});

export const PIDChart = () => {
  const responseRef = useRef(null);
  const simRef = useRef(initialSim(6));
  const historyRef = useRef([]);
  const inputsRef = useRef({});
  const playingRef = useRef(true);
  const dragRef = useRef(null);
  const rafRef = useRef(null);

  const [kp, setKp] = useState(PRESETS.pid.kp);
  const [ki, setKi] = useState(PRESETS.pid.ki);
  const [kd, setKd] = useState(PRESETS.pid.kd);
  const [setpoint, setSetpoint] = useState(6);
  const [disturbance, setDisturbance] = useState(0);
  const [pOn, setPOn] = useState(true);
  const [iOn, setIOn] = useState(true);
  const [dOn, setDOn] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState({
    history: [],
    y: 0,
    error: 6,
    pTerm: 0,
    iTerm: 0,
    dTerm: 0,
    u: 0,
    integral: 0,
  });

  inputsRef.current = { kp, ki, kd, setpoint, disturbance, pOn, iOn, dOn };
  playingRef.current = playing;

  const plotWidth = SVG_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;
  const termsPlotHeight = TERMS_HEIGHT - PADDING.top - PADDING.bottom;

  const toSvg = useCallback((t, y, yMin = Y_MIN, yMax = Y_MAX, height = plotHeight) => {
    const now = simRef.current.t;
    const tMin = Math.max(0, now - TIME_WINDOW);
    const tMax = Math.max(TIME_WINDOW, now);
    return {
      sx: PADDING.left + ((t - tMin) / (tMax - tMin)) * plotWidth,
      sy: PADDING.top + height - ((y - yMin) / (yMax - yMin)) * height,
    };
  }, [plotHeight, plotWidth]);

  const stepSim = useCallback((state, inputs, dt) => {
    const error = inputs.setpoint - state.y;
    const nextIntegral = inputs.iOn
      ? clamp(state.integral + error * dt, -I_CLAMP, I_CLAMP)
      : 0;
    const dError = (error - state.prevError) / dt;
    const pTerm = inputs.pOn ? inputs.kp * error : 0;
    const iTerm = inputs.iOn ? inputs.ki * nextIntegral : 0;
    const dTerm = inputs.dOn ? inputs.kd * dError : 0;
    const u = clamp(pTerm + iTerm + dTerm, -UMAX, UMAX);
    const accel = (u + inputs.disturbance - DAMPING * state.v) / MASS;
    const nextV = state.v + accel * dt;
    const nextY = clamp(state.y + nextV * dt, Y_MIN, Y_MAX);

    return {
      y: nextY,
      v: nextV,
      integral: nextIntegral,
      prevY: state.y,
      prevError: error,
      t: state.t + dt,
      error,
      pTerm,
      iTerm,
      dTerm,
      u,
    };
  }, []);

  useEffect(() => {
    let lastPaint = 0;

    const tick = () => {
      if (playingRef.current) {
        simRef.current = stepSim(simRef.current, inputsRef.current, DT);
        const snapshot = simRef.current;
        historyRef.current.push({
          t: snapshot.t,
          y: snapshot.y,
          sp: inputsRef.current.setpoint,
          p: snapshot.pTerm,
          i: snapshot.iTerm,
          d: snapshot.dTerm,
          u: snapshot.u,
        });
        const cutoff = snapshot.t - TIME_WINDOW;
        if (historyRef.current.length > 8) {
          historyRef.current = historyRef.current.filter((point) => point.t >= cutoff);
        }
      }

      const now = performance.now();
      if (now - lastPaint > 50) {
        lastPaint = now;
        const current = simRef.current;
        setFrame({
          history: historyRef.current,
          y: current.y,
          error: current.error,
          pTerm: current.pTerm,
          iTerm: current.iTerm,
          dTerm: current.dTerm,
          u: current.u,
          integral: current.integral,
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stepSim]);

  const resetSim = (nextSetpoint = setpoint) => {
    simRef.current = initialSim(nextSetpoint);
    historyRef.current = [];
    setFrame({
      history: [],
      y: 0,
      error: nextSetpoint,
      pTerm: 0,
      iTerm: 0,
      dTerm: 0,
      u: 0,
      integral: 0,
    });
  };

  const applyPreset = (key) => {
    const preset = PRESETS[key];
    setKp(preset.kp);
    setKi(preset.ki);
    setKd(preset.kd);
    setPOn(preset.kp > 0);
    setIOn(preset.ki > 0);
    setDOn(preset.kd > 0);
    resetSim(setpoint);
  };

  const getSvgY = (event) => {
    const svg = responseRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const scaleY = SVG_HEIGHT / rect.height;
    return (clientY - rect.top) * scaleY;
  };

  const fromSvgY = (sy) => {
    const ratio = (sy - PADDING.top) / plotHeight;
    return clamp(Y_MAX - ratio * (Y_MAX - Y_MIN), 0, 10);
  };

  const handleSetpointDown = (event) => {
    event.preventDefault();
    dragRef.current = 'setpoint';
  };

  useEffect(() => {
    const handleMove = (event) => {
      if (dragRef.current !== 'setpoint') return;
      const svgY = getSvgY(event);
      if (svgY == null) return;
      setSetpoint(Number(fromSvgY(svgY).toFixed(2)));
    };
    const handleUp = () => {
      dragRef.current = null;
    };
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
  }, [plotHeight]);

  const nowT = simRef.current.t;
  const tMin = Math.max(0, nowT - TIME_WINDOW);
  const tMax = Math.max(TIME_WINDOW, nowT);
  const history = frame.history;

  const yPath = toPath(history.map((p) => ({ t: p.t, v: p.y })), (t, v) => toSvg(t, v));
  const spPath = toPath(history.map((p) => ({ t: p.t, v: p.sp })), (t, v) => toSvg(t, v));
  const pPath = toPath(history.map((pt) => ({ t: pt.t, v: pt.p })), (t, v) => toSvg(t, v, U_MIN, U_MAX, termsPlotHeight));
  const iPath = toPath(history.map((pt) => ({ t: pt.t, v: pt.i })), (t, v) => toSvg(t, v, U_MIN, U_MAX, termsPlotHeight));
  const dPath = toPath(history.map((pt) => ({ t: pt.t, v: pt.d })), (t, v) => toSvg(t, v, U_MIN, U_MAX, termsPlotHeight));
  const uPath = toPath(history.map((pt) => ({ t: pt.t, v: pt.u })), (t, v) => toSvg(t, v, U_MIN, U_MAX, termsPlotHeight));

  const spLine = toSvg(nowT, setpoint);
  const axisBottom = PADDING.top + plotHeight;
  const termsBottom = PADDING.top + termsPlotHeight;
  const zeroU = toSvg(nowT, 0, U_MIN, U_MAX, termsPlotHeight).sy;
  const absMaxTerm = Math.max(Math.abs(frame.pTerm), Math.abs(frame.iTerm), Math.abs(frame.dTerm), 1);

  const timeTicks = [0, 2, 4, 6, 8, 10].map((offset) => tMin + offset);
  const yTicks = [0, 2, 4, 6, 8, 10];
  const uTicks = [-8, 0, 8];

  return (
    <div className="pid-chart">
      <div className="pid-chart__header">
        <div>
          <h3>Proportional Integral Derivative Lab</h3>
          <p>Tune P, I, and D on a moving plant. Drag the setpoint and watch the control law update live.</p>
        </div>
        <div className="pid-chart__tabs" role="tablist" aria-label="PID presets">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pid-chart__track" aria-hidden="true">
        <div className="pid-chart__rail" />
        <div className="pid-chart__target" style={{ left: `${((setpoint / 10) * 100)}%` }}>
          <span>SP</span>
        </div>
        <div className="pid-chart__cart" style={{ left: `${((clamp(frame.y, 0, 10) / 10) * 100)}%` }}>
          <span>PV</span>
        </div>
      </div>

      <div className="pid-chart__body">
        <div className="pid-chart__plots">
          <div className="pid-chart__canvas-wrap">
            <svg
              ref={responseRef}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="pid-chart__svg"
              aria-label="Setpoint versus process value"
            >
              {timeTicks.map((tick) => {
                const { sx } = toSvg(tick, 0);
                return (
                  <g key={`tx-${tick}`}>
                    <line x1={sx} y1={PADDING.top} x2={sx} y2={axisBottom} className="grid-line" />
                    <text x={sx} y={axisBottom + 20} className="axis-label">{formatNum(tick, 0)}s</text>
                  </g>
                );
              })}
              {yTicks.map((tick) => {
                const { sy } = toSvg(tMin, tick);
                return (
                  <g key={`ty-${tick}`}>
                    <line x1={PADDING.left} y1={sy} x2={PADDING.left + plotWidth} y2={sy} className="grid-line" />
                    <text x={PADDING.left - 10} y={sy + 4} className="axis-label">{tick}</text>
                  </g>
                );
              })}
              <line x1={PADDING.left} y1={axisBottom} x2={PADDING.left + plotWidth} y2={axisBottom} className="axis-line" />
              <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={axisBottom} className="axis-line" />
              <text x={PADDING.left + plotWidth - 8} y={axisBottom + 32} className="axis-title">t</text>
              <text x={14} y={PADDING.top + 6} className="axis-title">y</text>

              <path d={spPath} className="pid-line pid-line--setpoint" />
              <path d={yPath} className="pid-line pid-line--process" />

              <line
                x1={PADDING.left}
                y1={spLine.sy}
                x2={PADDING.left + plotWidth}
                y2={spLine.sy}
                className="pid-setpoint-guide"
                onMouseDown={handleSetpointDown}
                onTouchStart={handleSetpointDown}
              />
              <circle
                cx={PADDING.left + plotWidth}
                cy={spLine.sy}
                r={9}
                className="handle handle--setpoint"
                onMouseDown={handleSetpointDown}
                onTouchStart={handleSetpointDown}
              />
              <text x={PADDING.left + plotWidth - 70} y={spLine.sy - 12} className="curve-label">
                setpoint {formatNum(setpoint)}
              </text>
            </svg>
          </div>

          <div className="pid-chart__canvas-wrap">
            <svg
              viewBox={`0 0 ${SVG_WIDTH} ${TERMS_HEIGHT}`}
              className="pid-chart__svg"
              aria-label="PID term contributions"
            >
              {timeTicks.map((tick) => {
                const { sx } = toSvg(tick, 0, U_MIN, U_MAX, termsPlotHeight);
                return <line key={`ux-${tick}`} x1={sx} y1={PADDING.top} x2={sx} y2={termsBottom} className="grid-line" />;
              })}
              {uTicks.map((tick) => {
                const { sy } = toSvg(tMin, tick, U_MIN, U_MAX, termsPlotHeight);
                return (
                  <g key={`uy-${tick}`}>
                    <line x1={PADDING.left} y1={sy} x2={PADDING.left + plotWidth} y2={sy} className="grid-line" />
                    <text x={PADDING.left - 10} y={sy + 4} className="axis-label">{tick}</text>
                  </g>
                );
              })}
              <line x1={PADDING.left} y1={zeroU} x2={PADDING.left + plotWidth} y2={zeroU} className="axis-line" />
              <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={termsBottom} className="axis-line" />
              <text x={14} y={PADDING.top + 6} className="axis-title">u</text>
              <path d={uPath} className="pid-line pid-line--u" />
              <path d={pPath} className="pid-line pid-line--p" />
              <path d={iPath} className="pid-line pid-line--i" />
              <path d={dPath} className="pid-line pid-line--d" />
            </svg>
            <div className="pid-legend">
              <span className="pid-legend__item pid-legend__item--process">process y</span>
              <span className="pid-legend__item pid-legend__item--setpoint">setpoint</span>
              <span className="pid-legend__item pid-legend__item--p">P</span>
              <span className="pid-legend__item pid-legend__item--i">I</span>
              <span className="pid-legend__item pid-legend__item--d">D</span>
              <span className="pid-legend__item pid-legend__item--u">output u</span>
            </div>
          </div>
        </div>

        <div className="pid-chart__panel">
          <div className="calc-card calc-card--highlight">
            <span className="calc-card__label">Control law</span>
            <code>
              u = Kp·e + Ki·∫e dt + Kd·de/dt
            </code>
            <code>
              e = {formatNum(setpoint)} − {formatNum(frame.y)} = {formatNum(frame.error)}
            </code>
            <code>
              u = {formatNum(frame.pTerm)} + {formatNum(frame.iTerm)} + {formatNum(frame.dTerm)} = {formatNum(frame.u)}
            </code>
          </div>

          <div className="pid-bars">
            {[
              { key: 'P', value: frame.pTerm, className: 'p', enabled: pOn },
              { key: 'I', value: frame.iTerm, className: 'i', enabled: iOn },
              { key: 'D', value: frame.dTerm, className: 'd', enabled: dOn },
            ].map((term) => (
              <div key={term.key} className={`pid-bar ${term.enabled ? '' : 'is-off'}`}>
                <span>{term.key}</span>
                <div className="pid-bar__track">
                  <div
                    className={`pid-bar__fill pid-bar__fill--${term.className}`}
                    style={{ width: `${(Math.abs(term.value) / absMaxTerm) * 100}%` }}
                  />
                </div>
                <code>{formatNum(term.value)}</code>
              </div>
            ))}
          </div>

          <label className="calc-slider">
            <span>Kp (proportional) · {formatNum(kp)}</span>
            <input type="range" min="0" max="10" step="0.1" value={kp} onChange={(e) => setKp(Number(e.target.value))} />
          </label>
          <label className="calc-slider">
            <span>Ki (integral) · {formatNum(ki)}</span>
            <input type="range" min="0" max="6" step="0.1" value={ki} onChange={(e) => setKi(Number(e.target.value))} />
          </label>
          <label className="calc-slider">
            <span>Kd (derivative) · {formatNum(kd)}</span>
            <input type="range" min="0" max="6" step="0.1" value={kd} onChange={(e) => setKd(Number(e.target.value))} />
          </label>
          <label className="calc-slider">
            <span>Setpoint · {formatNum(setpoint)}</span>
            <input type="range" min="0" max="10" step="0.1" value={setpoint} onChange={(e) => setSetpoint(Number(e.target.value))} />
          </label>
          <label className="calc-slider">
            <span>Disturbance · {formatNum(disturbance)}</span>
            <input type="range" min="-8" max="8" step="0.1" value={disturbance} onChange={(e) => setDisturbance(Number(e.target.value))} />
          </label>

          <div className="pid-toggles">
            <label><input type="checkbox" checked={pOn} onChange={(e) => setPOn(e.target.checked)} /> P</label>
            <label><input type="checkbox" checked={iOn} onChange={(e) => setIOn(e.target.checked)} /> I</label>
            <label><input type="checkbox" checked={dOn} onChange={(e) => setDOn(e.target.checked)} /> D</label>
          </div>

          <div className="pid-actions">
            <button type="button" onClick={() => setPlaying((value) => !value)}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" onClick={() => resetSim()}>Reset</button>
          </div>

          <p className="calc-note">
            <strong>P</strong> reacts to current error, <strong>I</strong> wipes leftover offset (try a disturbance),
            and <strong>D</strong> damps overshoot from how fast the error is changing.
          </p>
        </div>
      </div>
    </div>
  );
};
