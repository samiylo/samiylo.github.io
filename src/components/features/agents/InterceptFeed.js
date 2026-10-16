import { useEffect, useState } from 'react';

const INTERCEPTS = [
  { id: 'ix-01', level: 'AMBER', text: 'SIGINT drift · sector 7 · SPA1 correlator (+0.4σ)' },
  { id: 'ix-02', level: 'INFO', text: 'Uplink heartbeat stable · LAT 38ms · PKT 1.1k/s' },
  { id: 'ix-03', level: 'RED', text: 'Unauthorized probe denied · drop node Δ-09' },
  { id: 'ix-04', level: 'INFO', text: 'Handler-4 courier window opens T-02:14:00' },
  { id: 'ix-05', level: 'AMBER', text: 'Vector board sync lag · 2 nodes stale' },
  { id: 'ix-06', level: 'INFO', text: 'AES-OPS rekey complete · channel integrity OK' },
  { id: 'ix-07', level: 'RED', text: 'Eyes-only robotic feed request queued · TS' },
  { id: 'ix-08', level: 'INFO', text: 'Dead-drop ciphertext msg-02 awaiting decrypt' },
];

const formatStamp = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}Z`;
};

export const InterceptFeed = () => {
  const [items, setItems] = useState(() =>
    INTERCEPTS.slice(0, 5).map((item, index) => ({
      ...item,
      key: `seed-${index}`,
      stamp: formatStamp(new Date(Date.now() - (5 - index) * 14000)),
    }))
  );

  useEffect(() => {
    let cursor = 5;
    const intervalId = setInterval(() => {
      const next = INTERCEPTS[cursor % INTERCEPTS.length];
      cursor += 1;
      setItems((prev) =>
        [
          {
            ...next,
            key: `${next.id}-${cursor}-${Date.now()}`,
            stamp: formatStamp(new Date()),
          },
          ...prev,
        ].slice(0, 8)
      );
    }, 4200);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <aside className="intercept-feed" aria-label="Intercept feed">
      <div className="intercept-feed-header">
        <h3 className="intercept-feed-title">Intercept Feed</h3>
        <span className="intercept-feed-live">
          <span className="intercept-feed-live-dot" aria-hidden="true" />
          LIVE
        </span>
      </div>
      <ul className="intercept-feed-list">
        {items.map((item) => (
          <li key={item.key} className={`intercept-item intercept-item--${item.level.toLowerCase()}`}>
            <span className="intercept-stamp">{item.stamp}</span>
            <span className="intercept-level">{item.level}</span>
            <span className="intercept-text">{item.text}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};
