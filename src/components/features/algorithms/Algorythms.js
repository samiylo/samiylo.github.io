import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, ENTRIES } from './algorythmsData';
import './Algorythms.css';

function ComplexityChips({ complexity }) {
  if (!complexity) return null;
  return (
    <div className="algorythms-complexity">
      {Object.entries(complexity).map(([key, value]) => (
        <div className="algorythms-chip" key={key}>
          <span>{key}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

const Algorythms = () => {
  const [activeId, setActiveId] = useState(ENTRIES[0].id);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ENTRIES;
    return ENTRIES.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      entries: filtered.filter((e) => e.category === cat.id),
    })).filter((cat) => cat.entries.length > 0);
  }, [filtered]);

  const active = useMemo(
    () => ENTRIES.find((e) => e.id === activeId) || filtered[0] || ENTRIES[0],
    [activeId, filtered],
  );

  useEffect(() => {
    if (filtered.length && !filtered.some((e) => e.id === activeId)) {
      setActiveId(filtered[0].id);
    }
  }, [filtered, activeId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.example);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="algorythms">
      <header className="algorythms-header">
        <Link to="/" className="algorythms-back">
          Back to Home
        </Link>
        <span className="algorythms-title">Algorythms &amp; Data Structures</span>
        <input
          className="algorythms-search"
          type="search"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search algorithms"
        />
      </header>

      <div className="algorythms-body">
        <nav className="algorythms-sidebar" aria-label="Algorithm list">
          {grouped.length === 0 ? (
            <p className="algorythms-empty" style={{ padding: '16px' }}>
              No matches.
            </p>
          ) : (
            grouped.map((cat) => (
              <div key={cat.id}>
                <div className="algorythms-cat">{cat.label}</div>
                {cat.entries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={`algorythms-nav-item${
                      entry.id === active.id ? ' active' : ''
                    }`}
                    onClick={() => setActiveId(entry.id)}
                  >
                    {entry.title}
                  </button>
                ))}
              </div>
            ))
          )}
        </nav>

        <main className="algorythms-main">
          {!active ? (
            <p className="algorythms-empty">Select an entry.</p>
          ) : (
            <>
              <h1 className="algorythms-entry-title">{active.title}</h1>
              <p className="algorythms-entry-desc">{active.description}</p>
              <ComplexityChips complexity={active.complexity} />
              <div className="algorythms-code-wrap">
                <div className="algorythms-code-label">
                  <span>JavaScript example</span>
                  <button
                    type="button"
                    className="algorythms-copy"
                    onClick={handleCopy}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="algorythms-code">
                  <code>{active.example}</code>
                </pre>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Algorythms;
