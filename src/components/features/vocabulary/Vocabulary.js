import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, ENTRIES } from './vocabularyData';
import '../algorithms/Algorythms.css';
import './Vocabulary.css';

function MetaChips({ meta }) {
  if (!meta) return null;
  return (
    <div className="algorythms-complexity">
      {Object.entries(meta).map(([key, value]) => (
        <div className="algorythms-chip" key={key}>
          <span>{key}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

const Vocabulary = () => {
  const [activeId, setActiveId] = useState(ENTRIES[0].id);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyTarget, setCopyTarget] = useState('example');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ENTRIES;
    return ENTRIES.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.symbol.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.meta?.latex || '').toLowerCase().includes(q) ||
        (e.meta?.reads || '').toLowerCase().includes(q),
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

  const handleCopy = async (text, target) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyTarget(target);
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
        <span className="algorythms-title">Vocabulary — Calculus &amp; Physics</span>
        <input
          className="algorythms-search"
          type="search"
          placeholder="Search symbols…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search vocabulary"
        />
      </header>

      <div className="algorythms-body">
        <nav className="algorythms-sidebar" aria-label="Symbol list">
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
                    <span className="vocab-nav-symbol">{entry.symbol.split('·')[0].trim()}</span>
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
              <div className="vocab-symbol-hero" aria-hidden>
                {active.symbol}
              </div>
              <h1 className="algorythms-entry-title">{active.title}</h1>
              <p className="algorythms-entry-desc">{active.description}</p>
              <MetaChips meta={active.meta} />

              <div className="vocab-copy-row">
                <button
                  type="button"
                  className="algorythms-copy"
                  onClick={() => handleCopy(active.symbol, 'symbol')}
                >
                  {copied && copyTarget === 'symbol' ? 'Copied' : 'Copy symbol'}
                </button>
                {active.meta?.latex ? (
                  <button
                    type="button"
                    className="algorythms-copy"
                    onClick={() => handleCopy(active.meta.latex, 'latex')}
                  >
                    {copied && copyTarget === 'latex' ? 'Copied' : 'Copy LaTeX'}
                  </button>
                ) : null}
              </div>

              <div className="algorythms-code-wrap">
                <div className="algorythms-code-label">
                  <span>Usage &amp; notes</span>
                  <button
                    type="button"
                    className="algorythms-copy"
                    onClick={() => handleCopy(active.example, 'example')}
                  >
                    {copied && copyTarget === 'example' ? 'Copied' : 'Copy'}
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

export default Vocabulary;
