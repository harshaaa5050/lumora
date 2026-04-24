import { useState, useEffect, useRef, useCallback } from 'react';
import AICoach from '../components/AICoach/AICoach.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getTodos, getCompletedTodos, addTodo, editTodo, deleteTodo, toggleTodo } from '../api/userApi.js';
import './Dashboard.css';

/* ── Date helpers ────────────────────────────────────────────────── */
const todayTs = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
const dayTs   = (v)  => { const d = new Date(v); d.setHours(0, 0, 0, 0); return d.getTime(); };
const isTodayOrPast = (todo) => !!todo.dueDate && dayTs(todo.dueDate) <= todayTs();

const MOCK_COMMUNITIES = [
  { _id: '1', communityName: 'Lumora Design',    communityTag: 'design',   members: 142, online: 8,  lastMsg: '2m ago',  color: '#8b5cf6' },
  { _id: '2', communityName: 'Deep Work Club',   communityTag: 'deepwork', members: 89,  online: 12, lastMsg: '15m ago', color: '#ec4899' },
  { _id: '3', communityName: 'Builders Hub',     communityTag: 'builders', members: 230, online: 5,  lastMsg: '1h ago',  color: '#06b6d4' },
  { _id: '4', communityName: 'Study Together',   communityTag: 'study',    members: 67,  online: 3,  lastMsg: '3h ago',  color: '#22c55e' },
];

const MOCK_STREAK_WEEK = [true, true, true, false, true, true, true]; // Sun–Sat

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
  { icon: '◎', label: 'Focus',     path: '/focus'     },
  { icon: '⬡', label: 'Community', path: '/community' },
  { icon: '◈', label: 'Goals',     path: '/goals'     },
  { icon: '✦', label: 'Analytics', path: '/analytics' },
];

const POMO_MODES = [
  { key: 'work',       label: 'Focus',      mins: 25, color: '#8b5cf6' },
  { key: 'short',      label: 'Short Break', mins: 5,  color: '#22c55e' },
  { key: 'long',       label: 'Long Break',  mins: 15, color: '#06b6d4' },
];

/* ── Helpers ─────────────────────────────────────────────────────── */
const pad = (n) => String(n).padStart(2, '0');
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
const DAYS = ['S','M','T','W','T','F','S'];

/* ── Pomodoro Timer ──────────────────────────────────────────────── */
function PomodoroTimer() {
  const [modeIdx, setModeIdx]     = useState(0);
  const [seconds, setSeconds]     = useState(POMO_MODES[0].mins * 60);
  const [running, setRunning]     = useState(false);
  const [sessions, setSessions]   = useState(0);
  const intervalRef               = useRef(null);
  const mode                      = POMO_MODES[modeIdx];
  const total                     = mode.mins * 60;
  const progress                  = seconds / total;
  const R                         = 88;
  const CIRC                      = 2 * Math.PI * R;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode.key === 'work') setSessions(n => n + 1);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode.key]);

  const switchMode = (idx) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setModeIdx(idx);
    setSeconds(POMO_MODES[idx].mins * 60);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setSeconds(mode.mins * 60);
  };

  return (
    <div className="pomo-card">
      <div className="pomo-header">
        <span className="pomo-title">Pomodoro Timer</span>
        <span className="pomo-sessions">{sessions} sessions today</span>
      </div>

      {/* Mode tabs */}
      <div className="pomo-modes">
        {POMO_MODES.map((m, i) => (
          <button
            key={m.key}
            className={`pomo-mode-btn ${modeIdx === i ? 'active' : ''}`}
            style={modeIdx === i ? { borderColor: m.color, color: m.color, background: `${m.color}18` } : {}}
            onClick={() => switchMode(i)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Ring */}
      <div className="pomo-ring-wrap">
        <svg className="pomo-ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={R} className="pomo-ring-bg" />
          <circle
            cx="100" cy="100" r={R}
            className="pomo-ring-progress"
            style={{
              stroke: mode.color,
              strokeDasharray: CIRC,
              strokeDashoffset: CIRC * (1 - progress),
              filter: `drop-shadow(0 0 8px ${mode.color}88)`,
            }}
          />
        </svg>
        <div className="pomo-time-display">
          <span className="pomo-time">{pad(Math.floor(seconds / 60))}:{pad(seconds % 60)}</span>
          <span className="pomo-mode-label" style={{ color: mode.color }}>{mode.label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="pomo-controls">
        <button className="pomo-ctrl-btn" onClick={reset} title="Reset">↺</button>
        <motion.button
          className="pomo-play-btn"
          style={{ background: `linear-gradient(135deg, ${mode.color}cc, ${mode.color})` }}
          onClick={() => setRunning(r => !r)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {running ? '⏸' : '▶'}
        </motion.button>
        <button className="pomo-ctrl-btn" onClick={() => switchMode((modeIdx + 1) % 3)} title="Skip">⏭</button>
      </div>

      {/* Session dots */}
      <div className="pomo-session-dots">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`pomo-dot ${i < sessions % 4 ? 'filled' : ''}`} />
        ))}
      </div>
    </div>
  );
}

/* ── Streak Card ─────────────────────────────────────────────────── */
function StreakCard({ streak = 0, longest = 0 }) {
  const today = new Date().getDay();

  return (
    <div className="dash-card streak-card">
      <div className="card-header">
        <span className="card-title">Streak</span>
        <span className="streak-fire">🔥</span>
      </div>

      <div className="streak-number-row">
        <span className="streak-number">{streak}</span>
        <div className="streak-meta">
          <span className="streak-label">day streak</span>
          <span className="streak-best">Best: {longest} days</span>
        </div>
      </div>

      <div className="streak-week">
        {DAYS.map((d, i) => (
          <div key={i} className="streak-day-col">
            <div className={`streak-day-dot ${MOCK_STREAK_WEEK[i] ? 'active' : ''} ${i === today ? 'today' : ''}`} />
            <span className="streak-day-label">{d}</span>
          </div>
        ))}
      </div>

      <div className="streak-bar-wrap">
        <div className="streak-bar" style={{ width: longest > 0 ? `${Math.min((streak / longest) * 100, 100)}%` : streak > 0 ? '100%' : '0%' }} />
        <span className="streak-bar-label">{streak}/{longest} personal best</span>
      </div>
    </div>
  );
}

/* ── Stats Row ───────────────────────────────────────────────────── */
function StatsRow({ todos, completedTodos }) {
  const todayActive    = todos.filter(isTodayOrPast);
  const todayCompleted = completedTodos.filter(t => dayTs(t.createdAt) === todayTs());
  const otherCompleted = completedTodos.filter(t => dayTs(t.createdAt) !== todayTs());

  const progressDone  = todayCompleted.length + otherCompleted.length;
  const progressTotal = todayActive.length + todayCompleted.length + otherCompleted.length;

  const stats = [
    { icon: '⏱', val: '4h 20m',                          label: 'Focus today',  color: '#8b5cf6' },
    { icon: '✅', val: `${progressDone} / ${progressTotal}`, label: 'Tasks done', color: '#22c55e' },
    { icon: '⬡',  val: '4',                               label: 'Communities',  color: '#06b6d4' },
    { icon: '📈', val: '+12%',                            label: 'vs last week', color: '#ec4899' },
  ];

  return (
    <div className="stats-row-grid">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          className="stat-mini-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          whileHover={{ y: -3 }}
        >
          <span className="stat-mini-icon" style={{ color: s.color }}>{s.icon}</span>
          <span className="stat-mini-val">{s.val}</span>
          <span className="stat-mini-label">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Communities Panel ───────────────────────────────────────────── */
function CommunitiesPanel({ navigate }) {
  return (
    <div className="dash-card communities-card">
      <div className="card-header">
        <span className="card-title">Your Communities</span>
        <button className="card-action-btn" onClick={() => navigate('/community')}>View all →</button>
      </div>
      <div className="communities-list">
        {MOCK_COMMUNITIES.map((c, i) => (
          <motion.div
            key={c._id}
            className="community-row"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ x: 4 }}
            onClick={() => navigate('/community')}
          >
            <div className="community-avatar" style={{ background: `linear-gradient(135deg, ${c.color}cc, ${c.color}66)`, color: c.color }}>
              {getInitials(c.communityName)}
            </div>
            <div className="community-info">
              <span className="community-name">{c.communityName}</span>
              <span className="community-tag">#{c.communityTag}</span>
            </div>
            <div className="community-stats">
              <span className="community-online">
                <span className="online-dot" />
                {c.online}
              </span>
              <span className="community-time">{c.lastMsg}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Todo Widget ─────────────────────────────────────────────────── */
const BLANK_FORM = { title: '', description: '', dueDate: '', originalDueDate: '' };

function sortTodos(list) {
  return [...list].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });
}

function TodoWidget({ todos, setTodos, completedTodos, setCompletedTodos, onComplete }) {
  const [tab,       setTab]       = useState('today');
  const [showForm,  setShowForm]  = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form,      setForm]      = useState(BLANK_FORM);
  const [saving,    setSaving]    = useState(false);

  const today = todayTs();

  // Active todos that belong to "today" (today or past-due)
  const todayActive    = todos.filter(isTodayOrPast).map(t => ({ ...t, isCompleted: false }));
  // Completed todos completed today
  const todayCompleted = completedTodos
    .filter(t => dayTs(t.createdAt) === today)
    .map(t => ({ ...t, isCompleted: true }));
  // All active + completed merged with isCompleted flag
  const allActive    = todos.map(t => ({ ...t, isCompleted: false }));
  const allCompleted = completedTodos.map(t => ({ ...t, isCompleted: true }));

  // Progress: today active total + any completed todos (today or others) done today or in other tabs
  const otherCompleted    = completedTodos.filter(t => dayTs(t.createdAt) !== today);
  const progressDone      = todayCompleted.length + otherCompleted.length;
  const progressTotal     = todayActive.length + progressDone;

  const displayList = sortTodos(
    tab === 'today'     ? [...todayActive, ...todayCompleted] :
    tab === 'all'       ? [...allActive, ...allCompleted] :
    /* completed tab */   allCompleted
  );

  const openAdd = () => { setEditingId(null); setForm(BLANK_FORM); setShowForm(true); };
  const openEdit = (todo) => {
    if (todo.isCompleted) return; // can't edit completed todos
    setEditingId(todo._id);
    const dueDateStr = todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '';
    setForm({ title: todo.title, description: todo.description || '', dueDate: dueDateStr, originalDueDate: dueDateStr });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(BLANK_FORM); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const dueDateChanged = form.dueDate !== form.originalDueDate;
      const body = {
        title: form.title.trim(),
        ...(form.description.trim() && { description: form.description.trim() }),
        ...(form.dueDate && (dueDateChanged || !editingId) && { dueDate: `${form.dueDate}T23:59:00` }),
      };
      if (editingId) {
        await editTodo(editingId, body);
        setTodos(prev => prev.map(t => t._id === editingId
          ? { ...t, ...body, dueDate: form.dueDate ? new Date(form.dueDate) : undefined }
          : t));
      } else {
        await addTodo(body);
        const { data } = await getTodos();
        setTodos(data);
      }
      closeForm();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleToggle = async (todo) => {
    try {
      await toggleTodo(todo._id);
      if (!todo.isCompleted) {
        // Active → Completed: remove from todos, add to completedTodos
        setTodos(prev => prev.filter(t => t._id !== todo._id));
        setCompletedTodos(prev => [{ ...todo, isCompleted: true, createdAt: new Date().toISOString() }, ...prev]);
        await onComplete(); // await so streak card re-renders with fresh DB value
      } else {
        // Completed → Active: remove from completedTodos, add to todos
        setCompletedTodos(prev => prev.filter(t => t._id !== todo._id));
        setTodos(prev => [{ ...todo, isCompleted: false }, ...prev]);
      }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (todoId, isCompleted) => {
    try {
      await deleteTodo(todoId);
      if (isCompleted) setCompletedTodos(prev => prev.filter(t => t._id !== todoId));
      else             setTodos(prev => prev.filter(t => t._id !== todoId));
    } catch (e) { console.error(e); }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const emptyMsg = tab === 'today' ? 'No tasks for today' : tab === 'all' ? 'No tasks yet' : 'No completed tasks';

  return (
    <div className="dash-card todo-card">
      <div className="card-header">
        <div className="todo-tabs">
          <button className={`todo-tab ${tab === 'today'     ? 'active' : ''}`} onClick={() => setTab('today')}>Today</button>
          <button className={`todo-tab ${tab === 'all'       ? 'active' : ''}`} onClick={() => setTab('all')}>All</button>
          <button className={`todo-tab ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>Done</button>
        </div>
        <div className="todo-header-right">
          <span className="todo-progress">{progressDone}/{progressTotal}</span>
          {tab !== 'completed' && (
            <button className="todo-add-icon-btn" onClick={showForm && !editingId ? closeForm : openAdd}>
              <span>{showForm && !editingId ? '✕' : '+'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="todo-progress-bar-wrap">
        <div className="todo-progress-bar" style={{ width: progressTotal ? `${(progressDone / progressTotal) * 100}%` : '0%' }} />
      </div>

      <AnimatePresence>
        {showForm && tab !== 'completed' && (
          <motion.div
            className="todo-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              className="todo-input"
              placeholder="Task title *"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <textarea
              className="todo-input todo-textarea"
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
            />
            <div className="todo-form-row">
              <input
                type="date"
                className="todo-input todo-date-input"
                value={form.dueDate}
                min={todayStr}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              />
              <button className="todo-save-btn" onClick={handleSave} disabled={saving || !form.title.trim()}>
                {saving ? '…' : editingId ? 'Save' : 'Add'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="todo-list">
        <AnimatePresence>
          {displayList.length === 0 && (
            <div className="todo-empty">{emptyMsg}</div>
          )}
          {displayList.map(t => {
            const due    = t.dueDate ? new Date(t.dueDate) : null;
            const dueTs  = due ? dayTs(due) : null;
            const isPast = dueTs !== null && dueTs < today;
            return (
              <motion.div
                key={t._id}
                className={`todo-item ${t.isCompleted ? 'done' : ''}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                layout
              >
                <button className={`todo-check ${t.isCompleted ? 'checked' : ''}`} onClick={() => handleToggle(t)}>
                  {t.isCompleted && <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </button>
                <div className="todo-content">
                  <span className="todo-title">{t.title}</span>
                  {due && (
                    <span className={`todo-due ${isPast && !t.isCompleted ? 'overdue' : ''}`}>
                      {isPast && !t.isCompleted ? '⚠ ' : '📅 '}
                      {due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                <div className="todo-actions">
                  {!t.isCompleted && (
                    <button className="todo-action-btn" onClick={() => openEdit(t)} title="Edit">✎</button>
                  )}
                  <button className="todo-action-btn todo-action-delete" onClick={() => handleDelete(t._id, t.isCompleted)} title="Delete">✕</button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Main Dashboard ──────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate  = useNavigate();
  const [active, setActive] = useState('/dashboard');
  const [user,           setUser]           = useState(null);
  const [todos,          setTodos]          = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const fetchUser           = useCallback(() => getUserProfile().then(({ userMetadata }) => setUser(userMetadata)).catch(console.error), []);
  const fetchTodos          = useCallback(() => getTodos().then(({ data }) => setTodos(data)).catch(console.error), []);
  const fetchCompletedTodos = useCallback(() => getCompletedTodos().then(({ data }) => setCompletedTodos(data)).catch(console.error), []);

  useEffect(() => { fetchUser(); fetchTodos(); fetchCompletedTodos(); }, [fetchUser, fetchTodos, fetchCompletedTodos]);

  return (
    <div className="dash-root">
      <AICoach />
      {/* background orbs */}
      <div className="dash-orb dash-orb-1" />
      <div className="dash-orb dash-orb-2" />

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <div className="dash-logo-icon">L</div>
          <span className="dash-logo-text">Lumora</span>
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              className={`dash-nav-item ${active === item.path ? 'active' : ''}`}
              onClick={() => { setActive(item.path); navigate(item.path); }}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              <span className="dash-nav-label">{item.label}</span>
              {active === item.path && <motion.div className="dash-nav-indicator" layoutId="navIndicator" />}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <div className="dash-user-card">
            <div className="dash-user-avatar">
              {user ? getInitials(user.profile?.fullName || user.userId?.username || '?') : '…'}
            </div>
            <div className="dash-user-info">
              <span className="dash-user-name">{user?.userId?.username ?? '—'}</span>
              <span className="dash-user-role">{user?.userId?.role ?? '—'}</span>
            </div>
            <button className="dash-user-menu">⋯</button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="dash-main">

        {/* Top bar */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <h1 className="dash-greeting">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},
              <em> {user?.profile?.fullName || user?.userId?.username || '…'}</em> 👋
            </h1>
            <p className="dash-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="dash-topbar-right">
            <button className="dash-icon-btn">🔔</button>
            <button className="dash-icon-btn">⚙</button>
          </div>
        </header>

        {/* Stats */}
        <StatsRow todos={todos} completedTodos={completedTodos} />

        {/* Main grid */}
        <div className="dash-grid">

          {/* Left column */}
          <div className="dash-col-right">
            <TodoWidget todos={todos} setTodos={setTodos} completedTodos={completedTodos} setCompletedTodos={setCompletedTodos} onComplete={fetchUser} />
            <CommunitiesPanel navigate={navigate} />
          </div>

          {/* Right column */}
          <div className="dash-col-left">
            <PomodoroTimer />
            <StreakCard streak={user?.streakCount ?? 0} longest={user?.maxStreakCount ?? 0} />
          </div>

        </div>
      </main>
    </div>
  );
}
