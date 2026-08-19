import React, { useCallback, useEffect, useRef, useState } from 'react';
import './HumanoidRobotChart.css';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 480;

const PELVIS = { x: 360, y: 318 };
const SHOULDER_Y = 232;
const SHOULDER_OFFSET = 44;
const HIP_OFFSET = 26;
const TORSO_TOP = 208;
const HEAD_CENTER = { x: 360, y: 178 };
const HEAD_R = 28;

const UPPER_ARM = 58;
const FOREARM = 52;
const THIGH = 72;
const SHIN = 68;

const MOVEMENTS = {
  idle: {
    label: 'Idle',
    note: 'Small sinusoidal offsets keep the center of mass balanced while motors hold posture.',
    pose: (t) => ({
      torsoLean: Math.sin(t * 1.1) * 0.05,
      headTilt: Math.sin(t * 0.85 + 0.4) * 0.06,
      lShoulder: 0.14 + Math.sin(t * 1.2) * 0.04,
      rShoulder: 0.14 - Math.sin(t * 1.2) * 0.04,
      lElbow: 0.1,
      rElbow: 0.1,
      lHip: 0.06,
      rHip: 0.06,
      lKnee: 0.08,
      rKnee: 0.08,
    }),
  },
  walk: {
    label: 'Walk',
    note: 'Hips and knees follow a phase-shifted gait. Arms swing opposite the legs to counter-rotate the torso.',
    pose: (t) => {
      const s = Math.sin(t * 4.2);
      return {
        torsoLean: s * 0.07,
        headTilt: -s * 0.04,
        lHip: 0.08 + s * 0.42,
        rHip: 0.08 - s * 0.42,
        lKnee: 0.1 + Math.max(0, s) * 0.95,
        rKnee: 0.1 + Math.max(0, -s) * 0.95,
        lShoulder: 0.12 - s * 0.38,
        rShoulder: 0.12 + s * 0.38,
        lElbow: 0.18 + Math.abs(s) * 0.2,
        rElbow: 0.18 + Math.abs(s) * 0.2,
      };
    },
  },
  wave: {
    label: 'Wave',
    note: 'Shoulder lifts the upper arm; the elbow oscillates for a repeated hand wave.',
    pose: (t) => ({
      torsoLean: 0.03,
      headTilt: 0.1,
      lShoulder: 0.16,
      lElbow: 0.12,
      rShoulder: -2.35 + Math.sin(t * 5.5) * 0.18,
      rElbow: 1.05 + Math.sin(t * 5.5) * 0.42,
      lHip: 0.06,
      rHip: 0.06,
      lKnee: 0.08,
      rKnee: 0.08,
    }),
  },
  squat: {
    label: 'Squat',
    note: 'Both hips and knees flex together, lowering the pelvis while the torso leans to stay balanced.',
    pose: (t) => {
      const c = (Math.sin(t * 1.6) + 1) / 2;
      return {
        torsoLean: 0.18 * c,
        headTilt: -0.06 * c,
        lShoulder: 0.22 + 0.35 * c,
        rShoulder: 0.22 + 0.35 * c,
        lElbow: 0.28 + 0.45 * c,
        rElbow: 0.28 + 0.45 * c,
        lHip: 0.3 * c,
        rHip: 0.3 * c,
        lKnee: 0.12 + 1.15 * c,
        rKnee: 0.12 + 1.15 * c,
      };
    },
  },
  bow: {
    label: 'Bow',
    note: 'Coordinated flex at the hips and forward torso lean — a whole-body pose, not a single joint.',
    pose: (t) => {
      const c = (Math.sin(t * 1.4) + 1) / 2;
      return {
        torsoLean: 0.55 * c,
        headTilt: 0.12 * c,
        lShoulder: 0.18 + 0.12 * c,
        rShoulder: 0.18 + 0.12 * c,
        lElbow: 0.15,
        rElbow: 0.15,
        lHip: 0.42 * c,
        rHip: 0.42 * c,
        lKnee: 0.1 + 0.35 * c,
        rKnee: 0.1 + 0.35 * c,
      };
    },
  },
};

const DEFAULT_POSE = MOVEMENTS.idle.pose(0);

const JOINT_LABELS = {
  torsoLean: 'Torso',
  headTilt: 'Head',
  lShoulder: 'L shoulder',
  rShoulder: 'R shoulder',
  lElbow: 'L elbow',
  rElbow: 'R elbow',
  lHip: 'L hip',
  rHip: 'R hip',
  lKnee: 'L knee',
  rKnee: 'R knee',
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const formatNum = (value, digits = 2) => {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(digits)).toString();
};

const lerp = (a, b, t) => a + (b - a) * t;

const lerpPose = (current, target, alpha) => {
  const next = {};
  Object.keys(DEFAULT_POSE).forEach((key) => {
    next[key] = lerp(current[key], target[key], alpha);
  });
  return next;
};

const rotatePoint = (point, origin, angle) => {
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: origin.x + dx * cos - dy * sin,
    y: origin.y + dx * sin + dy * cos,
  };
};

const limbEnd = (origin, angle1, len1, angle2, len2, mirror = 1) => {
  const elbow = {
    x: origin.x + mirror * len1 * Math.sin(angle1),
    y: origin.y + len1 * Math.cos(angle1),
  };
  const end = {
    x: elbow.x + mirror * len2 * Math.sin(angle1 + mirror * angle2),
    y: elbow.y + len2 * Math.cos(angle1 + mirror * angle2),
  };
  return { elbow, end };
};

const solveArmIK = (shoulder, target, mirror = 1) => {
  const dx = (target.x - shoulder.x) * mirror;
  const dy = target.y - shoulder.y;
  const distSq = dx * dx + dy * dy;
  const dist = Math.sqrt(distSq);
  const maxReach = UPPER_ARM + FOREARM - 4;
  const minReach = Math.abs(UPPER_ARM - FOREARM) + 4;
  const clampedDist = clamp(dist, minReach, maxReach);
  let cdx = dx;
  let cdy = dy;
  if (dist > 0 && dist !== clampedDist) {
    cdx = (dx / dist) * clampedDist;
    cdy = (dy / dist) * clampedDist;
  }

  const cosQ2 = (cdx * cdx + cdy * cdy - UPPER_ARM * UPPER_ARM - FOREARM * FOREARM)
    / (2 * UPPER_ARM * FOREARM);
  const q2 = Math.acos(clamp(cosQ2, -1, 1));
  const q1 = Math.atan2(cdx, cdy)
    - Math.atan2(FOREARM * Math.sin(q2), UPPER_ARM + FOREARM * Math.cos(q2));
  return { shoulder: q1, elbow: q2 };
};

const buildSkeleton = (pose) => {
  const pelvis = { ...PELVIS };
  const torsoAngle = pose.torsoLean;
  const neck = rotatePoint({ x: PELVIS.x, y: TORSO_TOP }, pelvis, torsoAngle);
  const head = rotatePoint(
    { x: HEAD_CENTER.x, y: HEAD_CENTER.y },
    pelvis,
    torsoAngle + pose.headTilt * 0.35
  );

  const lShoulderOrigin = rotatePoint(
    { x: PELVIS.x - SHOULDER_OFFSET, y: SHOULDER_Y },
    pelvis,
    torsoAngle
  );
  const rShoulderOrigin = rotatePoint(
    { x: PELVIS.x + SHOULDER_OFFSET, y: SHOULDER_Y },
    pelvis,
    torsoAngle
  );

  const lHipOrigin = { x: pelvis.x - HIP_OFFSET, y: pelvis.y };
  const rHipOrigin = { x: pelvis.x + HIP_OFFSET, y: pelvis.y };

  const lArm = limbEnd(lShoulderOrigin, pose.lShoulder, UPPER_ARM, pose.lElbow, FOREARM, -1);
  const rArm = limbEnd(rShoulderOrigin, pose.rShoulder, UPPER_ARM, pose.rElbow, FOREARM, 1);
  const lLeg = limbEnd(lHipOrigin, pose.lHip, THIGH, pose.lKnee, SHIN, -1);
  const rLeg = limbEnd(rHipOrigin, pose.rHip, THIGH, pose.rKnee, SHIN, 1);

  return {
    pelvis,
    neck,
    head,
    lShoulderOrigin,
    rShoulderOrigin,
    lHipOrigin,
    rHipOrigin,
    lArm,
    rArm,
    lLeg,
    rLeg,
  };
};

const reachTargetPose = (target, fallback) => {
  const skeleton = buildSkeleton(fallback);
  const lIK = solveArmIK(skeleton.lShoulderOrigin, target, -1);
  const rIK = solveArmIK(skeleton.rShoulderOrigin, target, 1);
  return {
    ...fallback,
    lShoulder: lIK.shoulder,
    lElbow: lIK.elbow,
    rShoulder: rIK.shoulder,
    rElbow: rIK.elbow,
  };
};

export const HumanoidRobotChart = () => {
  const svgRef = useRef(null);
  const poseRef = useRef({ ...DEFAULT_POSE });
  const timeRef = useRef(0);
  const dragRef = useRef(null);
  const rafRef = useRef(null);
  const playingRef = useRef(true);

  const [mode, setMode] = useState('idle');
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [target, setTarget] = useState({ x: 360, y: 150 });
  const [manualPose, setManualPose] = useState({ ...DEFAULT_POSE });
  const [frame, setFrame] = useState({
    pose: { ...DEFAULT_POSE },
    skeleton: buildSkeleton(DEFAULT_POSE),
  });

  playingRef.current = playing;

  const getTargetPose = useCallback((t) => {
    if (mode === 'manual') return manualPose;
    if (mode === 'reach') {
      return reachTargetPose(target, {
        ...DEFAULT_POSE,
        torsoLean: 0.04,
        headTilt: 0.05,
      });
    }
    return MOVEMENTS[mode].pose(t);
  }, [manualPose, mode, target]);

  useEffect(() => {
    let last = performance.now();
    let lastPaint = 0;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (playingRef.current) timeRef.current += dt * speed;

      const targetPose = getTargetPose(timeRef.current);
      poseRef.current = lerpPose(poseRef.current, targetPose, mode === 'manual' ? 0.28 : 0.14);

      if (now - lastPaint > 50) {
        lastPaint = now;
        setFrame({
          pose: { ...poseRef.current },
          skeleton: buildSkeleton(poseRef.current),
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getTargetPose, mode, speed]);

  useEffect(() => {
    setFrame({
      pose: { ...poseRef.current },
      skeleton: buildSkeleton(poseRef.current),
    });
  }, [mode]);

  const getSvgPoint = useCallback((event) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * SVG_WIDTH,
      y: ((clientY - rect.top) / rect.height) * SVG_HEIGHT,
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
      setTarget({
        x: clamp(point.x, 250, 470),
        y: clamp(point.y, 90, 280),
      });
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

  const { skeleton, pose } = frame;
  const activeNote = mode === 'reach'
    ? 'Both arms solve inverse kinematics toward the draggable target. Legs hold a stable standing pose.'
    : mode === 'manual'
      ? 'Direct joint control — each slider sets a target angle that the pose eases toward.'
      : MOVEMENTS[mode].note;

  const renderLimb = (start, joint, end, className) => (
    <g className={className}>
      <line x1={start.x} y1={start.y} x2={joint.x} y2={joint.y} className="humanoid-limb humanoid-limb--upper" />
      <line x1={joint.x} y1={joint.y} x2={end.x} y2={end.y} className="humanoid-limb humanoid-limb--lower" />
      <circle cx={joint.x} cy={joint.y} r={7} className="humanoid-joint" />
    </g>
  );

  const jointReadouts = Object.entries(JOINT_LABELS).slice(0, 6);

  return (
    <div className="humanoid-chart">
      <div className="humanoid-chart__header">
        <div>
          <h3>Humanoid Robot Lab</h3>
          <p>Switch gaits and gestures, or drive individual joints to see how coordinated motion is built.</p>
        </div>
        <div className="humanoid-chart__tabs" role="tablist" aria-label="Robot movement">
          {Object.entries(MOVEMENTS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              className={mode === key ? 'active' : ''}
              onClick={() => setMode(key)}
            >
              {value.label}
            </button>
          ))}
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'reach'}
            className={mode === 'reach' ? 'active' : ''}
            onClick={() => setMode('reach')}
          >
            Reach
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'manual'}
            className={mode === 'manual' ? 'active' : ''}
            onClick={() => setMode('manual')}
          >
            Manual
          </button>
        </div>
      </div>

      <div className="humanoid-chart__body">
        <div className="humanoid-chart__canvas-wrap">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="humanoid-chart__svg"
            aria-label="Interactive humanoid robot"
          >
            <defs>
              <linearGradient id="humanoidTorso" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#AA367C" />
                <stop offset="100%" stopColor="#4A2FBD" />
              </linearGradient>
              <linearGradient id="humanoidLimb" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <filter id="humanoidGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <line x1={80} y1={400} x2={640} y2={400} className="humanoid-ground" />
            <text x={80} y={424} className="humanoid-ground-label">ground</text>

            {renderLimb(skeleton.lHipOrigin, skeleton.lLeg.elbow, skeleton.lLeg.end, 'humanoid-chain humanoid-chain--leg')}
            {renderLimb(skeleton.rHipOrigin, skeleton.rLeg.elbow, skeleton.rLeg.end, 'humanoid-chain humanoid-chain--leg')}

            <line
              x1={skeleton.pelvis.x}
              y1={skeleton.pelvis.y}
              x2={skeleton.neck.x}
              y2={skeleton.neck.y}
              className="humanoid-torso-spine"
            />
            <rect
              x={skeleton.pelvis.x - 36}
              y={Math.min(skeleton.pelvis.y, skeleton.neck.y) + 8}
              width={72}
              height={Math.abs(skeleton.neck.y - skeleton.pelvis.y) - 8}
              rx={14}
              className="humanoid-torso"
              transform={`rotate(${pose.torsoLean * (180 / Math.PI)} ${skeleton.pelvis.x} ${skeleton.pelvis.y})`}
            />
            <line x1={skeleton.pelvis.x - 30} y1={skeleton.pelvis.y - 8} x2={skeleton.pelvis.x + 30} y2={skeleton.pelvis.y - 8} className="humanoid-panel-line" transform={`rotate(${pose.torsoLean * (180 / Math.PI)} ${skeleton.pelvis.x} ${skeleton.pelvis.y})`} />
            <line x1={skeleton.pelvis.x - 24} y1={skeleton.pelvis.y + 18} x2={skeleton.pelvis.x + 24} y2={skeleton.pelvis.y + 18} className="humanoid-panel-line" transform={`rotate(${pose.torsoLean * (180 / Math.PI)} ${skeleton.pelvis.x} ${skeleton.pelvis.y})`} />

            {renderLimb(skeleton.lShoulderOrigin, skeleton.lArm.elbow, skeleton.lArm.end, 'humanoid-chain humanoid-chain--arm')}
            {renderLimb(skeleton.rShoulderOrigin, skeleton.rArm.elbow, skeleton.rArm.end, 'humanoid-chain humanoid-chain--arm')}

            <circle cx={skeleton.pelvis.x} cy={skeleton.pelvis.y} r={10} className="humanoid-joint humanoid-joint--pelvis" />
            <circle cx={skeleton.lShoulderOrigin.x} cy={skeleton.lShoulderOrigin.y} r={8} className="humanoid-joint" />
            <circle cx={skeleton.rShoulderOrigin.x} cy={skeleton.rShoulderOrigin.y} r={8} className="humanoid-joint" />
            <circle cx={skeleton.lHipOrigin.x} cy={skeleton.lHipOrigin.y} r={8} className="humanoid-joint" />
            <circle cx={skeleton.rHipOrigin.x} cy={skeleton.rHipOrigin.y} r={8} className="humanoid-joint" />

            <g className="humanoid-head" transform={`rotate(${(pose.torsoLean + pose.headTilt * 0.35) * (180 / Math.PI)} ${skeleton.neck.x} ${skeleton.neck.y})`}>
              <circle cx={skeleton.head.x} cy={skeleton.head.y} r={HEAD_R} className="humanoid-head__shell" />
              <rect x={skeleton.head.x - 16} y={skeleton.head.y - 4} width={32} height={10} rx={5} className="humanoid-head__visor" />
              <circle cx={skeleton.head.x - 8} cy={skeleton.head.y - 1} r={3} className="humanoid-head__eye" filter="url(#humanoidGlow)" />
              <circle cx={skeleton.head.x + 8} cy={skeleton.head.y - 1} r={3} className="humanoid-head__eye" filter="url(#humanoidGlow)" />
            </g>

            <circle cx={skeleton.lArm.end.x} cy={skeleton.lArm.end.y} r={6} className="humanoid-hand" />
            <circle cx={skeleton.rArm.end.x} cy={skeleton.rArm.end.y} r={6} className="humanoid-hand" />
            <rect
              x={skeleton.lLeg.end.x - 16}
              y={skeleton.lLeg.end.y - 4}
              width={32}
              height={8}
              rx={3}
              className="humanoid-foot"
            />
            <rect
              x={skeleton.rLeg.end.x - 16}
              y={skeleton.rLeg.end.y - 4}
              width={32}
              height={8}
              rx={3}
              className="humanoid-foot"
            />

            {mode === 'reach' && (
              <g className="humanoid-target" onMouseDown={handleTargetDown} onTouchStart={handleTargetDown}>
                <circle cx={target.x} cy={target.y} r={24} className="humanoid-target__hit" />
                <circle cx={target.x} cy={target.y} r={14} className="humanoid-target__ring" />
                <line x1={target.x - 8} y1={target.y} x2={target.x + 8} y2={target.y} className="humanoid-target__cross" />
                <line x1={target.x} y1={target.y - 8} x2={target.x} y2={target.y + 8} className="humanoid-target__cross" />
                <text x={target.x + 18} y={target.y - 16} className="humanoid-label">target</text>
              </g>
            )}
          </svg>
        </div>

        <div className="humanoid-chart__panel">
          <div className="calc-card calc-card--highlight">
            <span className="calc-card__label">Active movement</span>
            <code>{mode === 'reach' ? 'Reach (dual-arm IK)' : mode === 'manual' ? 'Manual joint control' : MOVEMENTS[mode].label}</code>
          </div>

          <div className="humanoid-joint-grid">
            {jointReadouts.map(([key, label]) => (
              <div key={key} className="humanoid-joint-chip">
                <span>{label}</span>
                <code>{formatNum(pose[key])} rad</code>
              </div>
            ))}
          </div>

          {mode === 'manual' && (
            <div className="humanoid-sliders">
              {Object.entries(JOINT_LABELS).map(([key, label]) => (
                <label key={key} className="calc-slider">
                  <span>{label} · {formatNum(manualPose[key])}</span>
                  <input
                    type="range"
                    min={key.includes('Shoulder') ? -3 : 0}
                    max={key.includes('Shoulder') ? 1.5 : key.includes('Knee') ? 1.6 : 0.8}
                    step="0.01"
                    value={manualPose[key]}
                    onChange={(event) => setManualPose((prev) => ({
                      ...prev,
                      [key]: Number(event.target.value),
                    }))}
                  />
                </label>
              ))}
            </div>
          )}

          <label className="calc-slider">
            <span>Animation speed · {formatNum(speed)}×</span>
            <input
              type="range"
              min="0.2"
              max="2"
              step="0.1"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
          </label>

          <div className="humanoid-actions">
            <button type="button" onClick={() => setPlaying((value) => !value)}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={() => {
                timeRef.current = 0;
                poseRef.current = { ...DEFAULT_POSE };
              }}
            >
              Reset pose
            </button>
          </div>

          <p className="calc-note">{activeNote}</p>
        </div>
      </div>
    </div>
  );
};
