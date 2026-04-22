import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  primary: "#F9F7F7",
  secondary: "#3F72AF",
  tertiary: "#112D4E",
};

const initialTasks = [
  { id: 1, title: "Review MERN stack PR", due: "Apr 19", done: false, priority: "high" },
  { id: 2, title: "DSA Problem Set #4", due: "Apr 20", done: false, priority: "medium" },
  { id: 3, title: "Update API documentation", due: "Apr 21", done: true, priority: "low" },
];

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const streakActive = [true, true, true, true, false, false, false];

function CircularTimer({ seconds, total, mode }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = 1 - seconds / total;
  const strokeDashoffset = circumference * (1 - progress);
  const modeColors = { Focus: colors.secondary, Break: "#27ae60", "Long Break": "#8e44ad" };
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#DBE8F5" strokeWidth="8" />
        <circle cx="70" cy="70" r={radius} fill="none"
          stroke={modeColors[mode] || colors.secondary} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="font-bold" style={{ color: "#FFFFFF", letterSpacing: 2, fontSize: 30, textShadow: "0 0 20px rgba(255,255,255,0.4)" }}>
          {mins}:{secs}
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.65)", marginTop: 2 }}>
          {mode}
        </span>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [timerMode, setTimerMode] = useState("Focus");
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [customMins, setCustomMins] = useState(25);
  const [focusHours, setFocusHours] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [streak] = useState(3);
  const [profileOpen, setProfileOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [communitySearch, setCommunitySearch] = useState("");

  const profileRef = useRef(null);
  const intervalRef = useRef(null);
  const focusRef = useRef(0);

  const modeDurations = { Focus: customMins * 60, Break: 5 * 60, "Long Break": 15 * 60 };

  const allCommunities = [
    { id: "mern-stack",     name: "MERN Stack",     members: 2, active: true,  tag: "Web Dev"    },
    { id: "dsa-neeks",      name: "DSA Neeks",       members: 1, active: false, tag: "Algorithms" },
    { id: "uiux-designers", name: "UI/UX Designers", members: 5, active: true,  tag: "Design"     },
    { id: "python-guild",   name: "Python Guild",    members: 3, active: true,  tag: "Backend"    },
    { id: "react-native",   name: "React Native",    members: 4, active: false, tag: "Mobile"     },
  ];

  const filteredCommunities = allCommunities.filter((c) =>
    c.name.toLowerCase().includes(communitySearch.toLowerCase())
  );

  // click-outside for profile dropdown
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // timer
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setTimerRunning(false);
            if (timerMode === "Focus") {
              focusRef.current += customMins / 60;
              setFocusHours(+(focusRef.current).toFixed(1));
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning]);

  const switchMode = (mode) => { setTimerMode(mode); setTimerSeconds(modeDurations[mode]); setTimerRunning(false); };

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) { const nowDone = !t.done; setTasksCompleted((c) => c + (nowDone ? 1 : -1)); return { ...t, done: nowDone }; }
      return t;
    }));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now(), title: newTask, due: "Apr 25", done: false, priority: "medium" }]);
    setNewTask(""); setAddingTask(false);
  };

  const priorityStyle = {
    high:   { bg: "#FEE2E2", text: "#991B1B" },
    medium: { bg: "#FEF3C7", text: "#92400E" },
    low:    { bg: "#D1FAE5", text: "#065F46" },
  };

  const totalTasks = tasks.length;
  const doneTasks  = tasks.filter((t) => t.done).length;
  const pendingCount = tasks.filter((t) => !t.done).length;

  return (
    <div className="min-h-screen flex" style={{ background: "#EEF2F8", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 230, minHeight: "100vh", background: colors.tertiary, position: "sticky", top: 0, height: "100vh", flexShrink: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: colors.secondary }}>
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: colors.primary }}>Lumora</span>
        </div>

        <div className="px-3 mt-1 flex-1 flex flex-col">

          {/* Dashboard */}
          <button onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left"
            style={{ background: colors.secondary, color: "#fff", border: "none", cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>⊞</span>
            <span className="text-sm font-medium">Dashboard</span>
          </button>

          {/* Community toggle */}
          <button onClick={() => setCommunityOpen((o) => !o)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl mb-1 text-left"
            style={{ background: communityOpen ? colors.secondary : "transparent", color: communityOpen ? "#fff" : "rgba(249,247,247,0.65)", border: "none", cursor: "pointer" }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 16 }}>🌐</span>
              <span className="text-sm font-medium">Community</span>
            </div>
            <span style={{ fontSize: 11, opacity: 0.7, transform: communityOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
          </button>

          {/* Community panel */}
          {communityOpen && (
            <div className="mx-1 mb-2 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="px-3 pt-3 pb-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: 12, opacity: 0.6, color: "#fff" }}>🔍</span>
                  <input value={communitySearch} onChange={(e) => setCommunitySearch(e.target.value)}
                    placeholder="Search communities..."
                    className="flex-1 bg-transparent outline-none text-xs"
                    style={{ color: "#fff", border: "none" }} />
                </div>
              </div>
              <div className="px-3 pb-1">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(249,247,247,0.35)" }}>Active Communities</span>
              </div>
              <div className="pb-2">
                {filteredCommunities.length === 0 ? (
                  <div className="px-3 py-2 text-xs" style={{ color: "rgba(249,247,247,0.4)" }}>No communities found</div>
                ) : (
                  filteredCommunities.map((c) => (
                    <button key={c.id}
                      onClick={() => navigate(`/view-community/${c.id}`)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left"
                      style={{ background: "transparent", border: "none", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div className="flex items-center justify-center rounded-lg flex-shrink-0 text-xs font-bold"
                        style={{ width: 28, height: 28, background: colors.secondary + "55", color: "#fff" }}>
                        {c.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate" style={{ color: "rgba(249,247,247,0.9)" }}>{c.name}</div>
                        <div className="text-xs" style={{ color: "rgba(249,247,247,0.4)" }}>{c.members} member{c.members > 1 ? "s" : ""}</div>
                      </div>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.active ? "#22c55e" : "rgba(255,255,255,0.2)", display: "inline-block", flexShrink: 0 }} />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "6px 8px" }} />

          {/* Create Community → /community/create */}
          <button onClick={() => navigate("/community")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left"
            style={{ background: "transparent", color: "rgba(249,247,247,0.65)", border: "none", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 16 }}>➕</span>
            <span className="text-sm font-medium">Create Community</span>
          </button>

          {/* Analytics */}
          <button onClick={() => navigate("/analytics")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left"
            style={{ background: "transparent", color: "rgba(249,247,247,0.65)", border: "none", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 16 }}>📊</span>
            <span className="text-sm font-medium">Analytics</span>
          </button>

          {/* Settings */}
          <button onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left"
            style={{ background: "transparent", color: "rgba(249,247,247,0.65)", border: "none", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 16 }}>⚙</span>
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(63,114,175,0.3)" }}>
          <div className="flex items-center gap-3">
            <div className="rounded-full flex items-center justify-center font-bold text-sm"
              style={{ width: 36, height: 36, background: colors.secondary, color: "#fff" }}>J</div>
            <div>
              <div className="text-sm font-semibold" style={{ color: colors.primary }}>User</div>
              <div className="text-xs" style={{ color: "rgba(249,247,247,0.5)" }}>Pro Member</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
          style={{ background: "rgba(238,242,248,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(63,114,175,0.12)" }}>
          <div>
            <h1 className="text-xl font-bold" style={{ color: colors.tertiary }}>Good afternoon, User ☁️</h1>
            <p className="text-sm" style={{ color: "#64748b" }}>
              You have {pendingCount} task{pendingCount !== 1 ? "s" : ""} pending
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: "#EBF3FF", color: colors.secondary, border: "none", cursor: "pointer" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", flexShrink: 0 }} />
              Focus Coach
            </button>
            <div ref={profileRef} style={{ position: "relative" }}>
              <button onClick={() => setProfileOpen((o) => !o)}
                className="rounded-full flex items-center justify-center font-bold text-sm"
                style={{ width: 36, height: 36, background: colors.secondary, color: "#fff", border: profileOpen ? `2px solid ${colors.tertiary}` : "2px solid transparent", cursor: "pointer", transition: "border 0.15s" }}>
                U
              </button>
              {profileOpen && (
                <div style={{ position: "absolute", top: 44, right: 0, width: 200, background: "#fff", borderRadius: 14, border: "1px solid rgba(63,114,175,0.15)", boxShadow: "0 8px 24px rgba(17,45,78,0.13)", zIndex: 100, overflow: "hidden" }}>
                  <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(63,114,175,0.1)" }}>
                    <div className="rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ width: 36, height: 36, background: colors.secondary, color: "#fff" }}>J</div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: colors.tertiary }}>User</div>
                      <div className="text-xs" style={{ color: "#94a3b8" }}>user@lumora.app</div>
                    </div>
                  </div>
                  {[{ icon: "👤", label: "Profile" }, { icon: "⚙️", label: "Settings" }, { icon: "🔔", label: "Notifications" }].map((item) => (
                    <button key={item.label} onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left"
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.tertiary }}
                      onMouseEnter={e => e.currentTarget.style.background = "#EBF3FF"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <span style={{ fontSize: 15 }}>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(63,114,175,0.1)", margin: "4px 0" }} />
                  <button onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left"
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#DC2626" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize: 15 }}>🚪</span>
                    <span className="font-medium">Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 py-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Day Streak",  value: streak,                       icon: "🔥", sub: "Keep it going!", color: "#FFF7ED", accent: "#F97316"       },
              { label: "Focus Hours", value: focusHours.toFixed(1) + "h",  icon: "⏱", sub: "Today",          color: "#EFF6FF", accent: colors.secondary },
              { label: "Tasks Done",  value: `${doneTasks} / ${totalTasks}`, icon: "✓", sub: "Completed",     color: "#F0FDF4", accent: "#16a34a"       },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background: "#fff", border: "1px solid rgba(63,114,175,0.1)", boxShadow: "0 1px 3px rgba(17,45,78,0.05)" }}>
                <div className="flex items-center justify-center rounded-xl text-2xl"
                  style={{ width: 52, height: 52, background: card.color, flexShrink: 0 }}>{card.icon}</div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>{card.label}</div>
                  <div className="text-2xl font-bold" style={{ color: colors.tertiary }}>{card.value}</div>
                  <div className="text-xs" style={{ color: card.accent }}>{card.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 320px" }}>

            {/* Left Column */}
            <div className="flex flex-col gap-5">

              {/* Tasks */}
              <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid rgba(63,114,175,0.1)", boxShadow: "0 1px 3px rgba(17,45,78,0.05)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-base" style={{ color: colors.tertiary }}>Tasks</h2>
                  <button onClick={() => setAddingTask(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: colors.secondary, color: "#fff", border: "none", cursor: "pointer" }}>
                    + Add Task
                  </button>
                </div>
                {addingTask && (
                  <div className="flex gap-2 mb-3">
                    <input autoFocus value={newTask} onChange={(e) => setNewTask(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Task title..."
                      className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                      style={{ border: `1.5px solid ${colors.secondary}`, color: colors.tertiary }} />
                    <button onClick={addTask} style={{ background: colors.secondary, color: "#fff", border: "none", borderRadius: 10, padding: "0 14px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Save</button>
                    <button onClick={() => setAddingTask(false)} style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 10, padding: "0 12px", cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                      style={{ background: task.done ? "#F8FAFC" : "#fff", border: "1px solid rgba(63,114,175,0.08)" }}>
                      <button onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0 rounded-full flex items-center justify-center"
                        style={{ width: 22, height: 22, border: `2px solid ${task.done ? colors.secondary : "#CBD5E1"}`, background: task.done ? colors.secondary : "transparent", cursor: "pointer", color: "#fff", fontSize: 11, fontWeight: "bold" }}>
                        {task.done ? "✓" : ""}
                      </button>
                      <div className="flex-1">
                        <span className="text-sm font-medium"
                          style={{ color: task.done ? "#94a3b8" : colors.tertiary, textDecoration: task.done ? "line-through" : "none" }}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs" style={{ color: "#94a3b8" }}>📅 {task.due}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: priorityStyle[task.priority].bg, color: priorityStyle[task.priority].text }}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Streak */}
              <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid rgba(63,114,175,0.1)", boxShadow: "0 1px 3px rgba(17,45,78,0.05)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-base" style={{ color: colors.tertiary }}>This Week's Streak</h2>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#FFF7ED", color: "#F97316" }}>🏆 Longest: 14 days</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center justify-center rounded-xl font-bold"
                        style={{ width: "100%", height: 48, background: streakActive[i] ? colors.secondary : i === 3 ? colors.tertiary : "#F1F5F9", color: streakActive[i] || i === 3 ? "#fff" : "#94a3b8", fontSize: streakActive[i] ? 22 : 14 }}>
                        {streakActive[i] ? "🔥" : day}
                      </div>
                      <span className="text-xs" style={{ color: "#94a3b8" }}>{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column — Timer */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl p-5" style={{ background: colors.tertiary, border: "none", boxShadow: "0 4px 16px rgba(17,45,78,0.2)" }}>
                <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: "rgba(255,255,255,0.08)" }}>
                  {["Focus", "Break", "Long Break"].map((mode) => (
                    <button key={mode} onClick={() => switchMode(mode)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: timerMode === mode ? colors.secondary : "transparent", color: timerMode === mode ? "#fff" : "rgba(249,247,247,0.55)", border: "none", cursor: "pointer" }}>
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center mb-5">
                  <CircularTimer seconds={timerSeconds} total={modeDurations[timerMode]} mode={timerMode} />
                </div>
                <div className="flex justify-center gap-3 mb-4">
                  <button onClick={() => { setTimerSeconds(modeDurations[timerMode]); setTimerRunning(false); }}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ background: "rgba(255,255,255,0.1)", color: "rgba(249,247,247,0.8)", border: "none", cursor: "pointer" }}>
                    ↺ Reset
                  </button>
                  <button onClick={() => setTimerRunning((r) => !r)}
                    className="px-6 py-2 rounded-xl text-sm font-bold"
                    style={{ background: colors.secondary, color: "#fff", border: "none", cursor: "pointer" }}>
                    {timerRunning ? "⏸ Pause" : "▶ Start"}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: "rgba(249,247,247,0.5)" }}>Custom:</span>
                  <input type="range" min="5" max="90" step="5" value={customMins}
                    onChange={(e) => { setCustomMins(+e.target.value); if (timerMode === "Focus") setTimerSeconds(+e.target.value * 60); }}
                    style={{ flex: 1, accentColor: colors.secondary }} />
                  <span className="text-xs font-semibold" style={{ color: colors.primary, minWidth: 28 }}>{customMins}m</span>
                </div>
              </div>

              {/* Achievements */}
              <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid rgba(63,114,175,0.1)", boxShadow: "0 1px 3px rgba(17,45,78,0.05)" }}>
                <h2 className="font-bold text-base mb-4" style={{ color: colors.tertiary }}>Achievements</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: "🔥", label: "Streak", unlocked: true  }, { icon: "⚡", label: "Speed",  unlocked: true  },
                    { icon: "✓",  label: "Done",   unlocked: true  }, { icon: "🏆", label: "Goal",   unlocked: false },
                    { icon: "💎", label: "Elite",  unlocked: false }, { icon: "🌟", label: "Star",   unlocked: false },
                  ].map((ach) => (
                    <div key={ach.label} className="flex flex-col items-center gap-1 py-3 rounded-xl"
                      style={{ background: ach.unlocked ? "#EBF3FF" : "#F8FAFC", border: `1px solid ${ach.unlocked ? "rgba(63,114,175,0.2)" : "rgba(0,0,0,0.05)"}` }}>
                      <span style={{ fontSize: 22, opacity: ach.unlocked ? 1 : 0.3 }}>{ach.icon}</span>
                      <span className="text-xs font-medium" style={{ color: ach.unlocked ? colors.secondary : "#94a3b8" }}>{ach.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Groups — clicking a group navigates to its community page */}
              <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid rgba(63,114,175,0.1)", boxShadow: "0 1px 3px rgba(17,45,78,0.05)" }}>
                <h2 className="font-bold text-base mb-3" style={{ color: colors.tertiary }}>Study Groups</h2>
                {[
                  { id: "mern-stack", name: "MERN Stack", members: 2, active: true  },
                  { id: "dsa-neeks",  name: "DSA Neeks",  members: 1, active: false },
                ].map((group) => (
                  <button key={group.id}
                    onClick={() => navigate(`/community/${group.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl mb-2 text-left"
                    style={{ background: "#F8FAFC", border: "1px solid rgba(63,114,175,0.08)", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#EBF3FF"}
                    onMouseLeave={e => e.currentTarget.style.background = "#F8FAFC"}>
                    <div className="flex items-center justify-center rounded-lg"
                      style={{ width: 36, height: 36, background: colors.secondary + "22", color: colors.secondary, fontWeight: 700, fontSize: 14 }}>
                      {group.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: colors.tertiary }}>{group.name}</div>
                      <div className="text-xs" style={{ color: "#94a3b8" }}>{group.members} member{group.members > 1 ? "s" : ""}</div>
                    </div>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: group.active ? "#22c55e" : "#cbd5e1", display: "inline-block" }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
