import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_MISSIONS } from './MissionLog';

const BOOT_LINES = [
  { type: 'system', text: 'DEAD-DROP // CHANNEL OPEN' },
  { type: 'muted', text: 'Type help for available directives.' },
];

const CLEARANCE_COPY = [
  'CLEARANCE MATRIX',
  '  C  — CONFIDENTIAL · vector surfaces, shared boards',
  '  S  — SECRET · analysis terminals, artifact vaults',
  '  TS — TOP SECRET · eyes-only research feeds',
  '',
  'Your active clearance: TS (session verified)',
  'Channel encryption: AES-OPS · ACTIVE',
];

const HELP_COPY = [
  'AVAILABLE DIRECTIVES',
  '  help                 — list directives',
  '  whoami               — agent / session identity',
  '  clearance            — clearance matrix',
  '  missions             — active mission directives',
  '  modules | ls         — list mission modules',
  '  open <id|name>       — route into a module',
  '  clear                — wipe terminal buffer',
  '',
  'Aliases: goto, cd  →  open',
];

const findModule = (modules, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return modules.find((mod) => {
    const idTail = mod.id.replace(/^mod-/, '').toLowerCase();
    const pathTail = mod.path.replace(/^\//, '').toLowerCase();
    return (
      mod.id.toLowerCase() === q ||
      idTail === q ||
      pathTail === q ||
      mod.codename.toLowerCase() === q ||
      mod.codename.toLowerCase().includes(q) ||
      mod.clearance.toLowerCase() === q
    );
  });
};

export const DeadDropTerminal = ({ sessionId = '—', modules = [] }) => {
  const navigate = useNavigate();
  const [lines, setLines] = useState(BOOT_LINES);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const lineIdRef = useRef(0);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const pushLines = (entries) => {
    const stamped = entries.map((entry) => ({
      ...entry,
      id: `line-${lineIdRef.current++}`,
    }));
    setLines((prev) => [...prev, ...stamped]);
  };

  const runCommand = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    pushLines([{ type: 'input', text: `> ${trimmed}` }]);
    setHistory((prev) => [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, 40));
    setHistoryIndex(-1);

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(' ');
    const command = cmd.toLowerCase();

    switch (command) {
      case 'help':
      case '?':
        pushLines(HELP_COPY.map((text) => ({ type: 'output', text })));
        break;

      case 'whoami':
        pushLines([
          { type: 'output', text: 'AGENT IDENTITY' },
          { type: 'output', text: `  callsign     : AGENT` },
          { type: 'output', text: `  session      : ${sessionId || 'UNASSIGNED'}` },
          { type: 'output', text: `  clearance    : TS` },
          { type: 'output', text: `  link         : SECURE` },
          { type: 'muted', text: 'Identity confirmed. Eyes only.' },
        ]);
        break;

      case 'clearance':
        pushLines(CLEARANCE_COPY.map((text) => ({
          type: text ? 'output' : 'muted',
          text: text || ' ',
        })));
        break;

      case 'missions':
      case 'mission':
        pushLines([
          { type: 'output', text: 'ACTIVE DIRECTIVES' },
          ...DEFAULT_MISSIONS.flatMap((mission) => [
            { type: 'accent', text: `  ${mission.id}  ${mission.title}` },
            { type: 'muted', text: `         ${mission.statement}` },
          ]),
          { type: 'muted', text: 'Expand dossiers in MISSION LOG below.' },
        ]);
        break;

      case 'modules':
      case 'ls':
      case 'list':
        pushLines([
          { type: 'output', text: 'MISSION MODULES' },
          ...modules.map((mod) => ({
            type: 'output',
            text: `  [${mod.clearance}] ${mod.id.replace('mod-', '')}  ${mod.codename}  (${mod.status})`,
          })),
          { type: 'muted', text: 'Use: open <id|name>  e.g. open spa1' },
        ]);
        break;

      case 'open':
      case 'goto':
      case 'cd': {
        if (!arg) {
          pushLines([{ type: 'error', text: 'Usage: open <id|name>' }]);
          break;
        }
        const target = findModule(modules, arg);
        if (!target) {
          pushLines([{ type: 'error', text: `Unknown module: ${arg}` }]);
          break;
        }
        pushLines([
          { type: 'accent', text: `Routing → ${target.codename}` },
          { type: 'muted', text: `Clearance ${target.clearance} · ${target.status}` },
        ]);
        setTimeout(() => navigate(target.path), 280);
        break;
      }

      case 'pwd':
        pushLines([
          { type: 'output', text: 'CURRENT DIRECTORY' },
          { type: 'output', text: `  /${window.location.pathname.split('/').slice(1).join('/')}` },
        ]);
        break;

      case 'clear':
      case 'cls':
        lineIdRef.current = 0;
        setLines(BOOT_LINES.map((entry, i) => ({ ...entry, id: `boot-${i}` })));
        break;

      default:
        pushLines([
          { type: 'error', text: `Unknown directive: ${command}` },
          { type: 'muted', text: 'Type help for available directives.' },
        ]);

        
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = input;
    setInput('');
    runCommand(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setInput(history[next] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput('');
        return;
      }
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(history[next] || '');
    }
  };

  return (
    <div className="dead-drop">
      <div className="dead-drop-header">
        <span className="dead-drop-title">DEAD-DROP TERMINAL</span>
        <span className="dead-drop-badge">DROP // LOCAL</span>
      </div>

      <div
        className="dead-drop-shell"
        onClick={() => inputRef.current?.focus()}
        role="application"
        aria-label="Dead-drop terminal"
      >
        <div className="dead-drop-output" ref={outputRef} aria-live="polite">
          {lines.map((line, index) => (
            <div
              key={line.id || `line-${index}`}
              className={`dead-drop-line dead-drop-line--${line.type || 'output'}`}
            >
              {line.text}
            </div>
          ))}
        </div>

        <form className="dead-drop-form" onSubmit={handleSubmit}>
          <span className="dead-drop-prompt" aria-hidden="true">$</span>
          <input
            ref={inputRef}
            type="text"
            className="dead-drop-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal command"
            placeholder="enter directive…"
          />
        </form>
      </div>
    </div>
  );
};
