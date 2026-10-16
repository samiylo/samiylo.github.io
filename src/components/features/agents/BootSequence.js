import { useEffect, useRef, useState } from 'react';

const BOOT_STEPS = [
  { id: 'auth', label: 'AUTH', detail: 'Verifying agent credentials…' },
  { id: 'key', label: 'KEY EXCHANGE', detail: 'Negotiating AES-OPS session keys…' },
  { id: 'channel', label: 'CHANNEL UP', detail: 'Secure link established.' },
];

export const BootSequence = ({ sessionId = '', onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timers = [];

    BOOT_STEPS.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setActiveIndex(index);
          if (index > 0) {
            setCompleted((prev) => [...prev, BOOT_STEPS[index - 1].id]);
          }
        }, index * 750)
      );
    });

    timers.push(
      setTimeout(() => {
        setCompleted(BOOT_STEPS.map((step) => step.id));
      }, BOOT_STEPS.length * 750)
    );

    timers.push(
      setTimeout(() => {
        onCompleteRef.current?.();
      }, BOOT_STEPS.length * 750 + 450)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="agent-boot" role="status" aria-live="polite" aria-label="System boot sequence">
      <div className="agent-boot-panel">
        <p className="agent-boot-eyebrow">OPS // SECURE BOOT</p>
        <h2 className="agent-boot-title">Establishing Channel</h2>
        {sessionId ? (
          <p className="agent-boot-session">SESSION {sessionId}</p>
        ) : null}

        <ol className="agent-boot-steps">
          {BOOT_STEPS.map((step, index) => {
            const isDone = completed.includes(step.id);
            const isActive = index === activeIndex && !isDone;
            return (
              <li
                key={step.id}
                className={[
                  'agent-boot-step',
                  isDone ? 'is-done' : '',
                  isActive ? 'is-active' : '',
                ].filter(Boolean).join(' ')}
              >
                <span className="agent-boot-step-index" aria-hidden="true">
                  {isDone ? 'OK' : String(index + 1).padStart(2, '0')}
                </span>
                <div className="agent-boot-step-body">
                  <span className="agent-boot-step-label">{step.label}</span>
                  <span className="agent-boot-step-detail">{step.detail}</span>
                </div>
                {index < BOOT_STEPS.length - 1 ? (
                  <span className="agent-boot-arrow" aria-hidden="true">→</span>
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="agent-boot-progress" aria-hidden="true">
          <span
            className="agent-boot-progress-bar"
            style={{ width: `${((Math.min(activeIndex, BOOT_STEPS.length - 1) + (completed.length === BOOT_STEPS.length ? 1 : 0)) / BOOT_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
