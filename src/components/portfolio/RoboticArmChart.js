import React, { useCallback, useEffect, useRef, useState } from 'react';
import './RoboticArmChart.css';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 460;
const PLOT_HEIGHT = 120;
const PADDING = { top: 20, right: 18, bottom: 32, left: 48 };
const TIME_WINDOW = 8;
const DT = 1 / 60;

const BASE = { x: 200, y: 340 };
const L1 = 130;
const L2 = 110;
const WORKSPACE_MAX = L1 + L2 - 8;
const WORKSPACE_MIN = Math.abs(L1 - L2) + 12;

const INERTIA = 0.55;
const DAMPING = 2.4;
const TAU_MAX = 14;
const I_CLAMP = 8;

const PRESETS = {
  p: { kp: 5.5, ki: 0, kd: 0, label: 'P only' },
  pd: { kp: 8, ki: 0, kd: 3.2, label: 'PD' },
  pi: { kp: 6, ki: 2.4, kd: 0, label: 'PI' },
  pid: { kp: 7.5, ki: 2.8, kd: 2.6, label: 'PID' },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatNum = (value, digits = 2) => {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
};

const wrapAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

const forwardKinematics = (q1, q2) => ({
  x: L1 * Math.cos(q1) + L2 * Math.cos(q1 + q2),
  y: L1 * Math.sin(q1) + L2 * Math.sin(q1 + q2),
});

const inverseKinematics = (x, y) => {
  const distSq = x * x + y * y;
  const dist = Math.sqrt(distSq);
  if (dist > WORKSPACE_MAX || dist < WORKSPACE_MIN) return null;

  const cosQ2 = (distSq - L1 * L1 - L2 * L2) / (2 * L1 * L2);
  const q2 = -Math.acos(clamp(cosQ2, -1, 1));
  const q1 = Math.atan2(y, x) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));
  return { q1, q2 };
};

const worldToSvg = (x, y) => ({
  sx: BASE.x + x,
  sy: BASE.y - y,
});

const svgToWorld = (sx, sy) => ({
  x: sx - BASE.x,
  y: BASE.y - sy,
});

const clampTarget = (x, y) => {
  const dist = Math.sqrt(x * x + y * y);
  if (dist < WORKSPACE_MIN) {
    const scale = WORKSPACE_MIN / dist;
    return { x: x * scale, y: y * scale };
  }
  if (dist > WORKSPACE_MAX) {
    const scale = WORKSPACE_MAX / dist;
    return { x: x * scale, y: y * scale };
  }
  return { x, y };
};

const initialJoint = (q = 0) => ({
  q,
  dq: 0,
  integral: 0,
  prevError: 0,
});

const initialSim = () => ({
  joints: [initialJoint(0.55), initialJoint(-0.35)],
  t: 0,
});

const toPath = (points, toSvgFn) => {
  if (!points.length) return '';
  return points
    .map((point, index) => {
      const { sx, sy } = toSvgFn(point.t, point.v);
      return `${index === 0 ? 'M' : 'L'} ${sx} ${sy}`;
    })
    .join(' ');
};

export const RoboticArmChart = () => {
  const svgRef = useRef(null);
  const simRef = useRef(initialSim());
  const snapshotRef = useRef({
    pTerms: [0, 0],
    iTerms: [0, 0],
    dTerms: [0, 0],
    torques: [0, 0],
  });
  const historyRef = useRef([]);
  const inputsRef = useRef({});
  const playingRef = useRef(true);
  const dragRef = useRef(null);
  const rafRef = useRef(null);

  const [kp, setKp] = useState(PRESETS.pid.kp);
  const [ki, setKi] = useState(PRESETS.pid.ki);
  const [kd, setKd] = useState(PRESETS.pid.kd);
  const [target, setTarget] = useState({ x: 180, y: 140 });
  const [pOn, setPOn] = useState(true);
  const [iOn, setIOn] = useState(true);
  const [dOn, setDOn] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState({
    q1: 0.55,
    q2: -0.35,
    desired: { q1: 0.55, q2: -0.35 },
    ee: forwardKinematics(0.55, -0.35),
    distanceError: 0,
    pTerms: [0, 0],
    iTerms: [0, 0],
    dTerms: [0, 0],
    torques: [0, 0],
    history: [],
    reachable: true,
  });

  inputsRef.current = { kp, ki, kd, target, pOn, iOn, dOn };
  playingRef.current = playing;

  const plotWidth = SVG_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = PLOT_HEIGHT - PADDING.top - PADDING.bottom;

  const stepJoint = useCallback((joint, desiredQ, inputs, dt) => {
    const error = wrapAngle(desiredQ - joint.q);
    const nextIntegral = inputs.iOn
      ? clamp(joint.integral + error * dt, -I_CLAMP, I_CLAMP)
      : 0;
    const dError = (error - joint.prevError) / dt;
    const pTerm = inputs.pOn ? inputs.kp * error : 0;
    const iTerm = inputs.iOn ? inputs.ki * nextIntegral : 0;
    const dTerm = inputs.dOn ? inputs.kd * dError : 0;
    const torque = clamp(pTerm + iTerm + dTerm, -TAU_MAX, TAU_MAX);
    const ddq = (torque - DAMPING * joint.dq) / INERTIA;
    const nextDq = joint.dq + ddq * dt;
    const nextQ = joint.q + nextDq * dt;

    return {
      joint: {
        q: nextQ,
        dq: nextDq,
        integral: nextIntegral,
        prevError: error,
      },
      pTerm,
      iTerm,
      dTerm,
      torque,
      error,
    };
  }, []);

  const stepSim = useCallback((state, inputs, dt) => {
    const desired = inverseKinematics(inputs.target.x, inputs.target.y);
    const fallback = {
      q1: state.joints[0].q,
      q2: state.joints[1].q,
    };

    const desiredQ1 = desired?.q1 ?? fallback.q1;
    const desiredQ2 = desired?.q2 ?? fallback.q2;

    const j1 = stepJoint(state.joints[0], desiredQ1, inputs, dt);
    const j2 = stepJoint(state.joints[1], desiredQ2, inputs, dt);

    const q1 = j1.joint.q;
    const q2 = j2.joint.q;
    const ee = forwardKinematics(q1, q2);
    const dx = inputs.target.x - ee.x;
    const dy = inputs.target.y - ee.y;
    const distanceError = Math.sqrt(dx * dx + dy * dy);

    return {
      joints: [j1.joint, j2.joint],
      t: state.t + dt,
      q1,
      q2,
      desired: { q1: desiredQ1, q2: desiredQ2 },
      ee,
      distanceError,
      pTerms: [j1.pTerm, j2.pTerm],
      iTerms: [j1.iTerm, j2.iTerm],
      dTerms: [j1.dTerm, j2.dTerm],
      torques: [j1.torque, j2.torque],
      reachable: Boolean(desired),
    };
  }, [stepJoint]);

  useEffect(() => {
    let lastPaint = 0;

    const tick = () => {
      if (playingRef.current) {
        const snapshot = stepSim(simRef.current, inputsRef.current, DT);
        simRef.current = {
          joints: snapshot.joints,
          t: snapshot.t,
        };
        snapshotRef.current = {
          pTerms: snapshot.pTerms,
          iTerms: snapshot.iTerms,
          dTerms: snapshot.dTerms,
          torques: snapshot.torques,
        };
        historyRef.current.push({
          t: snapshot.t,
          err: snapshot.distanceError,
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
        const inputs = inputsRef.current;
        const q1 = current.joints[0].q;
        const q2 = current.joints[1].q;
        const desired = inverseKinematics(inputs.target.x, inputs.target.y);
        const ee = forwardKinematics(q1, q2);

        setFrame({
          q1,
          q2,
          desired: desired ?? { q1, q2 },
          ee,
          distanceError: Math.hypot(inputs.target.x - ee.x, inputs.target.y - ee.y),
          pTerms: snapshotRef.current.pTerms,
          iTerms: snapshotRef.current.iTerms,
          dTerms: snapshotRef.current.dTerms,
          torques: snapshotRef.current.torques,
          history: historyRef.current,
          reachable: Boolean(desired),
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stepSim]);

  const resetSim = () => {
    simRef.current = initialSim();
    snapshotRef.current = {
      pTerms: [0, 0],
      iTerms: [0, 0],
      dTerms: [0, 0],
      torques: [0, 0],
    };
    historyRef.current = [];
    const ee = forwardKinematics(0.55, -0.35);
    setFrame({
      q1: 0.55,
      q2: -0.35,
      desired: inverseKinematics(target.x, target.y) ?? { q1: 0.55, q2: -0.35 },
      ee,
      distanceError: Math.hypot(target.x - ee.x, target.y - ee.y),
      pTerms: [0, 0],
      iTerms: [0, 0],
      dTerms: [0, 0],
      torques: [0, 0],
      history: [],
      reachable: Boolean(inverseKinematics(target.x, target.y)),
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
    resetSim();
  };

  const getSvgPoint = useCallback((event) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const scaleX = SVG_WIDTH / rect.width;
    const scaleY = SVG_HEIGHT / rect.height;
    return {
      sx: (clientX - rect.left) * scaleX,
      sy: (clientY - rect.top) * scaleY,
    };
  }, []);

  const handleTargetDown = (event) => {
    event.preventDefault();
    dragRef.current = 'target';
  };

  useEffect(() => {
    const handleMove = (event) => {
      if (dragRef.current !== 'target') return;
      const point = getSvgPoint(event);
      if (!point) return;
      const world = svgToWorld(point.sx, point.sy);
      setTarget(clampTarget(world.x, world.y));
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
  }, [getSvgPoint]);

  const q1 = frame.q1;
  const q2 = frame.q2;
  const shoulder = worldToSvg(0, 0);
  const elbow = worldToSvg(L1 * Math.cos(q1), L1 * Math.sin(q1));
  const ee = worldToSvg(frame.ee.x, frame.ee.y);
  const targetPt = worldToSvg(target.x, target.y);

  const desiredEE = forwardKinematics(frame.desired.q1, frame.desired.q2);
  const ghostElbow = worldToSvg(L1 * Math.cos(frame.desired.q1), L1 * Math.sin(frame.desired.q1));
  const ghostEE = worldToSvg(desiredEE.x, desiredEE.y);

  const nowT = simRef.current.t;
  const tMin = Math.max(0, nowT - TIME_WINDOW);
  const tMax = Math.max(TIME_WINDOW, nowT);

  const toPlotSvg = useCallback((t, value) => ({
    sx: PADDING.left + ((t - tMin) / (tMax - tMin)) * plotWidth,
    sy: PADDING.top + plotHeight - (value / 80) * plotHeight,
  }), [plotHeight, plotWidth, tMax, tMin]);

  const errPath = toPath(frame.history, (t, v) => toPlotSvg(t, v));
  const plotBottom = PADDING.top + plotHeight;
  const absMaxTorque = Math.max(...frame.torques.map(Math.abs), 1);

  return (
    <div className="arm-chart">
      <div className="arm-chart__header">
        <div>
          <h3>Robotic Arm PID Lab</h3>
          <p>Drag the target. Each joint runs its own PID loop to track the inverse-kinematics solution.</p>
        </div>
        <div className="arm-chart__tabs" role="tablist" aria-label="PID presets">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button key={key} type="button" onClick={() => applyPreset(key)}>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="arm-chart__body">
        <div className="arm-chart__visual">
          <div className="arm-chart__canvas-wrap">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT - PLOT_HEIGHT}`}
              className="arm-chart__svg"
              aria-label="Interactive robotic arm reaching a target"
            >
              <defs>
                <linearGradient id="armLinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#AA367C" />
                  <stop offset="100%" stopColor="#4A2FBD" />
                </linearGradient>
                <radialGradient id="workspaceGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="rgba(96, 165, 250, 0.04)" />
                  <stop offset="100%" stopColor="rgba(96, 165, 250, 0.18)" />
                </radialGradient>
              </defs>

              <circle cx={BASE.x} cy={BASE.y} r={WORKSPACE_MAX} fill="url(#workspaceGlow)" className="arm-workspace" />
              <circle cx={BASE.x} cy={BASE.y} r={WORKSPACE_MAX} className="arm-workspace-ring arm-workspace-ring--outer" />
              <circle cx={BASE.x} cy={BASE.y} r={WORKSPACE_MIN} className="arm-workspace-ring arm-workspace-ring--inner" />

              <line
                x1={shoulder.sx}
                y1={shoulder.sy}
                x2={ghostElbow.sx}
                y2={ghostElbow.sy}
                className="arm-link arm-link--ghost"
              />
              <line
                x1={ghostElbow.sx}
                y1={ghostElbow.sy}
                x2={ghostEE.sx}
                y2={ghostEE.sy}
                className="arm-link arm-link--ghost"
              />

              <line
                x1={shoulder.sx}
                y1={shoulder.sy}
                x2={elbow.sx}
                y2={elbow.sy}
                className="arm-link arm-link--primary"
                stroke="url(#armLinkGradient)"
              />
              <line
                x1={elbow.sx}
                y1={elbow.sy}
                x2={ee.sx}
                y2={ee.sy}
                className="arm-link arm-link--secondary"
              />

              <line
                x1={ee.sx}
                y1={ee.sy}
                x2={targetPt.sx}
                y2={targetPt.sy}
                className="arm-error-line"
              />

              <circle cx={shoulder.sx} cy={shoulder.sy} r={14} className="arm-joint arm-joint--base" />
              <circle cx={elbow.sx} cy={elbow.sy} r={11} className="arm-joint arm-joint--elbow" />
              <circle cx={ee.sx} cy={ee.sy} r={12} className="arm-joint arm-joint--ee" />

              <g className="arm-target" onMouseDown={handleTargetDown} onTouchStart={handleTargetDown}>
                <circle cx={targetPt.sx} cy={targetPt.sy} r={22} className="arm-target__hit" />
                <circle cx={targetPt.sx} cy={targetPt.sy} r={16} className="arm-target__ring" />
                <line x1={targetPt.sx - 10} y1={targetPt.sy} x2={targetPt.sx + 10} y2={targetPt.sy} className="arm-target__cross" />
                <line x1={targetPt.sx} y1={targetPt.sy - 10} x2={targetPt.sx} y2={targetPt.sy + 10} className="arm-target__cross" />
                <text x={targetPt.sx + 20} y={targetPt.sy - 18} className="arm-label">target</text>
              </g>

              <text x={ee.sx + 14} y={ee.sy + 6} className="arm-label arm-label--ee">end effector</text>
              <text x={shoulder.sx - 58} y={shoulder.sy + 28} className="arm-label">θ₁</text>
              <text x={elbow.sx + 12} y={elbow.sy - 10} className="arm-label">θ₂</text>

              {!frame.reachable && (
                <text x={BASE.x + 120} y={BASE.y - WORKSPACE_MAX - 16} className="arm-warning">
                  Target outside reachable workspace
                </text>
              )}
            </svg>
          </div>

          <div className="arm-chart__canvas-wrap">
            <svg
              viewBox={`0 0 ${SVG_WIDTH} ${PLOT_HEIGHT}`}
              className="arm-chart__svg"
              aria-label="End-effector distance error over time"
            >
              {[0, 2, 4, 6, 8].map((offset) => {
                const tick = tMin + offset;
                const { sx } = toPlotSvg(tick, 0);
                return (
                  <g key={`tx-${tick}`}>
                    <line x1={sx} y1={PADDING.top} x2={sx} y2={plotBottom} className="grid-line" />
                    <text x={sx} y={plotBottom + 18} className="axis-label">{formatNum(tick, 0)}s</text>
                  </g>
                );
              })}
              <line x1={PADDING.left} y1={plotBottom} x2={PADDING.left + plotWidth} y2={plotBottom} className="axis-line" />
              <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={plotBottom} className="axis-line" />
              <text x={14} y={PADDING.top + 6} className="axis-title">err</text>
              <text x={PADDING.left + plotWidth - 8} y={plotBottom + 26} className="axis-title">t</text>
              <path d={errPath} className="arm-err-line" />
            </svg>
          </div>
        </div>

        <div className="arm-chart__panel">
          <div className="calc-card calc-card--highlight">
            <span className="calc-card__label">Control loop</span>
            <code>τ = Kp·e + Ki·∫e dt + Kd·de/dt</code>
            <code>
              distance error = {formatNum(frame.distanceError)} px
            </code>
          </div>

          <div className="arm-joint-cards">
            {[
              { key: 'θ₁', index: 0, desired: frame.desired.q1, actual: q1 },
              { key: 'θ₂', index: 1, desired: frame.desired.q2, actual: q2 },
            ].map((joint) => (
              <div key={joint.key} className="calc-card">
                <span className="calc-card__label">{joint.key} joint PID</span>
                <code>
                  e = {formatNum(wrapAngle(joint.desired - joint.actual))} rad
                </code>
                <code>
                  τ = {formatNum(frame.pTerms[joint.index])} + {formatNum(frame.iTerms[joint.index])} + {formatNum(frame.dTerms[joint.index])} = {formatNum(frame.torques[joint.index])}
                </code>
              </div>
            ))}
          </div>

          <div className="arm-bars">
            {['θ₁', 'θ₂'].map((label, index) => (
              <div key={label} className="arm-bar">
                <span>{label}</span>
                <div className="arm-bar__track">
                  <div
                    className="arm-bar__fill"
                    style={{ width: `${(Math.abs(frame.torques[index]) / absMaxTorque) * 100}%` }}
                  />
                </div>
                <code>{formatNum(frame.torques[index])}</code>
              </div>
            ))}
          </div>

          <label className="calc-slider">
            <span>Kp · {formatNum(kp)}</span>
            <input type="range" min="0" max="14" step="0.1" value={kp} onChange={(e) => setKp(Number(e.target.value))} />
          </label>
          <label className="calc-slider">
            <span>Ki · {formatNum(ki)}</span>
            <input type="range" min="0" max="8" step="0.1" value={ki} onChange={(e) => setKi(Number(e.target.value))} />
          </label>
          <label className="calc-slider">
            <span>Kd · {formatNum(kd)}</span>
            <input type="range" min="0" max="8" step="0.1" value={kd} onChange={(e) => setKd(Number(e.target.value))} />
          </label>

          <div className="arm-toggles">
            <label><input type="checkbox" checked={pOn} onChange={(e) => setPOn(e.target.checked)} /> P</label>
            <label><input type="checkbox" checked={iOn} onChange={(e) => setIOn(e.target.checked)} /> I</label>
            <label><input type="checkbox" checked={dOn} onChange={(e) => setDOn(e.target.checked)} /> D</label>
          </div>

          <div className="arm-actions">
            <button type="button" onClick={() => setPlaying((value) => !value)}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" onClick={resetSim}>Reset</button>
          </div>

          <p className="calc-note">
            Inverse kinematics gives desired joint angles for the target. Each motor runs PID on its angle error.
            The dashed ghost arm shows the IK solution; the solid arm is what PID is driving toward it.
          </p>
        </div>
      </div>
    </div>
  );
};
