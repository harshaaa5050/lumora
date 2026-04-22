import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const colors = {
  primary: "#F9F7F7",
  secondary: "#3F72AF",
  tertiary: "#112D4E",
};

// ── Community store (replace with API call in production) ──────────────────
const COMMUNITIES = {
  "mern-stack": {
    name: "MERN Stack", description: "A community for full-stack developers learning MongoDB, Express, React and Node. We share projects, do code reviews, and tackle real-world problems together.",
    type: "public", passcode: "", members: 12, tag: "Web Dev", icon: "🌐", online: 4,
    createdAt: "March 5, 2024",
    rules: ["Share knowledge freely", "No spam or self-promotion", "Be respectful", "Keep discussions on topic"],
    memberList: [
      { id: 1, name: "You",   avatar: "J", role: "admin",  online: true  },
      { id: 2, name: "Kiran", avatar: "K", role: "member", online: true  },
      { id: 3, name: "Sneha", avatar: "S", role: "member", online: true  },
      { id: 4, name: "Dev",   avatar: "D", role: "member", online: false },
    ],
    messages: [
      { id: 1, sender: "Kiran", avatar: "K", text: "Just pushed the auth middleware, can someone review?", time: "10:02 AM", mine: false },
      { id: 2, sender: "You",   avatar: "J", text: "On it! Will check in 10 mins.",                        time: "10:05 AM", mine: true  },
      { id: 3, sender: "Sneha", avatar: "S", text: "Also fixed the CORS issue from yesterday 🎉",          time: "10:08 AM", mine: false },
    ],
  },
  "dsa-neeks": {
    name: "DSA Neeks", description: "A focused group for mastering Data Structures & Algorithms. We do daily problems, weekly contests, and peer code reviews to sharpen problem-solving skills together.",
    type: "private", passcode: "dsa123", members: 24, tag: "Algorithms", icon: "🧠", online: 7,
    createdAt: "January 12, 2024",
    rules: ["Be respectful to all members", "No spam or self-promotion", "Share resources freely", "Stay on topic"],
    memberList: [
      { id: 1, name: "You",   avatar: "J", role: "admin",  online: true  },
      { id: 2, name: "Rahul", avatar: "R", role: "member", online: true  },
      { id: 3, name: "Priya", avatar: "P", role: "member", online: true  },
      { id: 4, name: "Arun",  avatar: "A", role: "member", online: false },
      { id: 5, name: "Sneha", avatar: "S", role: "member", online: true  },
      { id: 6, name: "Dev",   avatar: "D", role: "member", online: false },
    ],
    messages: [
      { id: 1, sender: "Rahul", avatar: "R", text: "Hey everyone! Did anyone solve today's Leetcode hard?",                           time: "9:14 AM", mine: false },
      { id: 2, sender: "Priya", avatar: "P", text: "Yes! Used monotonic stack. Took me 45 mins though 😅",                            time: "9:16 AM", mine: false },
      { id: 3, sender: "You",   avatar: "J", text: "Same approach here. The tricky part was the edge cases.",                         time: "9:18 AM", mine: true  },
      { id: 4, sender: "Arun",  avatar: "A", text: "Can someone share the problem link? I missed the daily ping.",                    time: "9:21 AM", mine: false },
      { id: 5, sender: "Rahul", avatar: "R", text: "This one is a classic. O(n) with stack is the way to go 🔥",                     time: "9:25 AM", mine: false },
      { id: 6, sender: "You",   avatar: "J", text: "Totally agree. Also good to know the O(n²) brute force first before optimizing.", time: "9:27 AM", mine: true  },
    ],
  },
  "uiux-designers": {
    name: "UI/UX Designers", description: "A creative space for UI/UX designers to share work, get feedback, and discuss design systems, accessibility, and modern tooling.",
    type: "public", passcode: "", members: 5, tag: "Design", icon: "🎨", online: 2,
    createdAt: "February 20, 2024",
    rules: ["Constructive feedback only", "Credit original work", "Stay design-focused"],
    memberList: [
      { id: 1, name: "You",  avatar: "J", role: "admin",  online: true  },
      { id: 2, name: "Maya", avatar: "M", role: "member", online: true  },
      { id: 3, name: "Leo",  avatar: "L", role: "member", online: false },
    ],
    messages: [
      { id: 1, sender: "Maya", avatar: "M", text: "Sharing my new component library — Figma link in pinned!", time: "8:30 AM", mine: false },
      { id: 2, sender: "You",  avatar: "J", text: "This looks amazing, love the color tokens!",               time: "8:35 AM", mine: true  },
    ],
  },
  "python-guild": {
    name: "Python Guild", description: "Python enthusiasts building everything from web scrapers to ML models. We meet weekly for coding challenges and project showcases.",
    type: "private", passcode: "py2024", members: 8, tag: "Backend", icon: "🐍", online: 3,
    createdAt: "April 1, 2024",
    rules: ["Python-focused discussions", "Share code with context", "Help others learn"],
    memberList: [
      { id: 1, name: "You", avatar: "J", role: "admin",  online: true  },
      { id: 2, name: "Dev", avatar: "D", role: "member", online: true  },
    ],
    messages: [
      { id: 1, sender: "Dev", avatar: "D", text: "FastAPI + SQLModel is a game changer seriously",             time: "11:00 AM", mine: false },
      { id: 2, sender: "You", avatar: "J", text: "Agreed! Way cleaner than Flask+SQLAlchemy for new projects.", time: "11:03 AM", mine: true  },
    ],
  },
  "react-native": {
    name: "React Native", description: "Cross-platform mobile developers sharing tips, components, and best practices for building React Native apps on iOS and Android.",
    type: "public", passcode: "", members: 6, tag: "Mobile", icon: "📱", online: 1,
    createdAt: "March 15, 2024",
    rules: ["Mobile-focused topics only", "Share working code snippets", "Be patient with beginners"],
    memberList: [
      { id: 1, name: "You", avatar: "J", role: "admin",  online: true  },
      { id: 2, name: "Leo", avatar: "L", role: "member", online: true  },
    ],
    messages: [
      { id: 1, sender: "Leo", avatar: "L", text: "Anyone tried the new Expo SDK 51?",  time: "2:10 PM", mine: false },
      { id: 2, sender: "You", avatar: "J", text: "Yes, the new router is much better!", time: "2:12 PM", mine: true  },
    ],
  },
};

const avatarColors = {
  R: "#E07B54", P: "#7B61FF", A: "#16a34a", J: colors.secondary,
  S: "#db2777", D: "#ea580c", K: "#0891b2", M: "#9333ea", L: "#0284c7",
};

// ── Avatar ────────────────────────────────────────────────────────────────
function Avatar({ letter, size = 34 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: avatarColors[letter] || colors.secondary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, flexShrink: 0 }}>
      {letter}
    </div>
  );
}

// ── Video Session Modal ────────────────────────────────────────────────────
function VideoSessionModal({ community, onClose }) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const participants = community.memberList.filter((m) => m.online);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(17,45,78,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", borderRadius: 20, width: 420, overflow: "hidden", boxShadow: "0 20px 60px rgba(17,45,78,0.25)" }}>
        <div style={{ background: `linear-gradient(135deg, ${colors.tertiary}, ${colors.secondary})`, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>📹 Video Session</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>{community.name}</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#fff", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          {!sessionStarted ? (
            <>
              <p style={{ fontSize: 13, color: "#475569", marginBottom: 16, lineHeight: 1.6 }}>Starting a video session will notify all online members. They can join from their devices.</p>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Online now — will be notified</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {participants.map((m) => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#F8FAFC", borderRadius: 10 }}>
                      <div style={{ position: "relative" }}>
                        <Avatar letter={m.avatar} size={32} />
                        <span style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: colors.tertiary }}>{m.name}</span>
                      {m.role === "admin" && <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, background: "#EBF3FF", color: colors.secondary, padding: "2px 7px", borderRadius: 999 }}>HOST</span>}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setSessionStarted(true)} style={{ width: "100%", padding: "13px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, background: colors.secondary, color: "#fff", border: "none", cursor: "pointer" }}>🎥 Start Session</button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#EBF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>🎥</div>
              <h3 style={{ color: colors.tertiary, margin: "0 0 8px", fontSize: 18 }}>Session Live!</h3>
              <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>{participants.length} members notified. Waiting for them to join...</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {participants.map((m) => (
                  <div key={m.id} style={{ textAlign: "center" }}>
                    <Avatar letter={m.avatar} size={40} />
                    <div style={{ fontSize: 10, color: "#64748b", marginTop: 4 }}>{m.name}</div>
                  </div>
                ))}
              </div>
              <button onClick={onClose} style={{ marginTop: 24, padding: "10px 28px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "#FEE2E2", color: "#DC2626", border: "none", cursor: "pointer" }}>End Session</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Edit Field ────────────────────────────────────────────────────────────
function EditField({ label, value, onChange, multiline = false, maxLen = 300, placeholder = "" }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: colors.secondary, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
      {multiline ? (
        <>
          <textarea value={value} onChange={(e) => onChange(e.target.value.slice(0, maxLen))} placeholder={placeholder} rows={3}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, color: colors.tertiary, border: "1.5px solid rgba(63,114,175,0.25)", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box", background: "#F8FAFC" }}
            onFocus={e => e.target.style.borderColor = colors.secondary}
            onBlur={e => e.target.style.borderColor = "rgba(63,114,175,0.25)"} />
          <div style={{ textAlign: "right", fontSize: 10, color: "#94a3b8", marginTop: 3 }}>{value.length}/{maxLen}</div>
        </>
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, color: colors.tertiary, border: "1.5px solid rgba(63,114,175,0.25)", outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#F8FAFC" }}
          onFocus={e => e.target.style.borderColor = colors.secondary}
          onBlur={e => e.target.style.borderColor = "rgba(63,114,175,0.25)"} />
      )}
    </div>
  );
}

// ── Group Info Panel ───────────────────────────────────────────────────────
function GroupInfo({ community, isAdmin, onClose, onSave, onLeave }) {
  const [activeEdit, setActiveEdit] = useState(null);
  const [name, setName]   = useState(community.name);
  const [desc, setDesc]   = useState(community.description);
  const [icon, setIcon]   = useState(community.icon);
  const [showVideo, setShowVideo] = useState(false);
  const [saved, setSaved] = useState(false);

  const emojiOptions = ["🧠","🌐","🎨","🐍","📱","🚀","💡","🔬","📚","🎯","⚡","🔥","🏆","🌟","💎","🔑"];

  const handleSave = () => { onSave({ name, description: desc, icon }); setActiveEdit(null); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const InfoRow = ({ iconEl, label, value, editKey }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: "1px solid rgba(63,114,175,0.06)", background: "#fff" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#EBF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{iconEl}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, color: colors.tertiary, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
      </div>
      {isAdmin && editKey && (
        <button onClick={() => setActiveEdit(activeEdit === editKey ? null : editKey)}
          style={{ background: activeEdit === editKey ? colors.secondary : "#EBF3FF", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: activeEdit === editKey ? "#fff" : colors.secondary, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {activeEdit === editKey ? "✕" : "✏️"}
        </button>
      )}
    </div>
  );

  return (
    <>
      {showVideo && <VideoSessionModal community={community} onClose={() => setShowVideo(false)} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#EEF2F8", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

        {/* Top bar */}
        <div style={{ background: colors.tertiary, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, boxShadow: "0 2px 12px rgba(17,45,78,0.2)" }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.2px" }}>Community Info</div>
          </div>
          {saved && <span style={{ fontSize: 12, fontWeight: 600, color: "#86EFAC" }}>✓ Saved</span>}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* Hero */}
          <div style={{ position: "relative" }}>
            <div style={{ height: 130, background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.secondary} 100%)` }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 75% 50%, rgba(255,255,255,0.08) 0%, transparent 65%)" }} />
              <div style={{ position: "absolute", top: 14, right: 16 }}>
                <span style={{ background: community.type === "private" ? "rgba(220,38,38,0.2)" : "rgba(34,197,94,0.2)", color: community.type === "private" ? "#FCA5A5" : "#86EFAC", border: `1px solid ${community.type === "private" ? "rgba(220,38,38,0.35)" : "rgba(34,197,94,0.35)"}`, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                  {community.type === "private" ? "🔒 Private" : "🌐 Public"}
                </span>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: -36, left: 20 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 78, height: 78, borderRadius: 22, background: "#fff", boxShadow: "0 4px 20px rgba(17,45,78,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, border: "3px solid #fff" }}>{icon}</div>
                {isAdmin && (
                  <button onClick={() => setActiveEdit(activeEdit === "icon" ? null : "icon")}
                    style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, borderRadius: "50%", background: activeEdit === "icon" ? colors.tertiary : colors.secondary, border: "2px solid #fff", cursor: "pointer", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {activeEdit === "icon" ? "✕" : "✏️"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name & desc */}
          <div style={{ background: "#fff", padding: "52px 20px 20px", borderBottom: "1px solid rgba(63,114,175,0.07)" }}>
            <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: colors.tertiary, letterSpacing: "-0.3px" }}>{name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ background: "#EBF3FF", color: colors.secondary, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>{community.tag}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Created {community.createdAt}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: "#475569", lineHeight: 1.7 }}>{desc}</p>
          </div>

          {/* Icon picker */}
          {activeEdit === "icon" && (
            <div style={{ background: "#fff", borderBottom: "1px solid rgba(63,114,175,0.07)", padding: "16px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.secondary, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Choose Community Icon</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {emojiOptions.map((e) => (
                  <button key={e} onClick={() => setIcon(e)}
                    style={{ width: 42, height: 42, borderRadius: 12, border: `2px solid ${icon === e ? colors.secondary : "rgba(63,114,175,0.12)"}`, background: icon === e ? "#EBF3FF" : "#F8FAFC", fontSize: 22, cursor: "pointer" }}>{e}</button>
                ))}
              </div>
              <button onClick={handleSave} style={{ background: colors.secondary, color: "#fff", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Apply Icon</button>
            </div>
          )}

          {/* Edit name */}
          {activeEdit === "name" && (
            <div style={{ background: "#fff", borderBottom: "1px solid rgba(63,114,175,0.07)", padding: "16px 20px" }}>
              <EditField label="Community Name" value={name} onChange={setName} placeholder="Enter community name" maxLen={60} />
              <button onClick={handleSave} style={{ background: colors.secondary, color: "#fff", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Name</button>
            </div>
          )}

          {/* Edit description */}
          {activeEdit === "description" && (
            <div style={{ background: "#fff", borderBottom: "1px solid rgba(63,114,175,0.07)", padding: "16px 20px" }}>
              <EditField label="Description" value={desc} onChange={setDesc} multiline placeholder="What is this community about?" maxLen={300} />
              <button onClick={handleSave} style={{ background: colors.secondary, color: "#fff", border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Description</button>
            </div>
          )}

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", margin: "8px 16px", gap: 8 }}>
            {[
              { icon: "👥", label: "Members", value: community.members },
              { icon: "🟢", label: "Online",  value: community.online  },
              { icon: "📅", label: "Since",   value: community.createdAt.split(" ")[2] },
            ].map((s) => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "14px 12px", textAlign: "center", border: "1px solid rgba(63,114,175,0.08)", boxShadow: "0 1px 4px rgba(17,45,78,0.04)" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: colors.tertiary, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Editable info rows */}
          <div style={{ margin: "8px 0" }}>
            <div style={{ padding: "10px 20px 6px", background: "#EEF2F8" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {isAdmin ? "Community Settings" : "Details"}
              </span>
            </div>
            <InfoRow iconEl="✏️" label="Community Name" value={name} editKey="name" />
            <InfoRow iconEl="📝" label="Description" value={desc.length > 60 ? desc.slice(0, 60) + "…" : desc} editKey="description" />
            <InfoRow iconEl="🏷️" label="Category Tag" value={community.tag} editKey={null} />
            <InfoRow iconEl="🔒" label="Privacy" value={community.type === "private" ? "Private — Passcode required" : "Public — Open to all"} editKey={null} />
          </div>

          {/* Admin tools */}
          {isAdmin && (
            <div style={{ margin: "8px 0" }}>
              <div style={{ padding: "10px 20px 6px", background: "#EEF2F8" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin Tools</span>
              </div>
              {[
                { icon: "📹", label: "Start Video Session", sub: "Invite online members to a live session", gradient: true, action: () => setShowVideo(true) },
                { icon: "🔗", label: "Copy Invite Link",    sub: "Share link for members to join",          gradient: false, action: () => {} },
                { icon: "👥", label: "Manage Members",      sub: "Promote, remove or mute members",         gradient: false, action: () => {} },
              ].map((item) => (
                <button key={item.label} onClick={item.action}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "15px 20px", background: "#fff", border: "none", borderBottom: "1px solid rgba(63,114,175,0.06)", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: item.gradient ? `linear-gradient(135deg,${colors.secondary},${colors.tertiary})` : "#EBF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.tertiary }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>{item.sub}</div>
                  </div>
                  <span style={{ fontSize: 18, color: "#CBD5E1" }}>›</span>
                </button>
              ))}
            </div>
          )}

          {/* Rules */}
          <div style={{ margin: "8px 0" }}>
            <div style={{ padding: "10px 20px 6px", background: "#EEF2F8" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Community Rules</span>
            </div>
            <div style={{ background: "#fff" }}>
              {community.rules.map((rule, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 20px", borderBottom: i < community.rules.length - 1 ? "1px solid rgba(63,114,175,0.06)" : "none" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 8, background: colors.secondary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6 }}>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Members */}
          <div style={{ margin: "8px 0" }}>
            <div style={{ padding: "10px 20px 6px", background: "#EEF2F8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{community.members} Members</span>
              <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>● {community.online} online</span>
            </div>
            <div style={{ background: "#fff" }}>
              {community.memberList.map((m, i) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < community.memberList.length - 1 ? "1px solid rgba(63,114,175,0.05)" : "none" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <Avatar letter={m.avatar} size={42} />
                    <span style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: m.online ? "#22c55e" : "#e2e8f0", border: "2px solid #fff" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.tertiary }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: m.online ? "#22c55e" : "#94a3b8", marginTop: 1 }}>{m.online ? "Online" : "Offline"}</div>
                  </div>
                  {m.role === "admin" && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: "linear-gradient(135deg,#EBF3FF,#dbeafe)", color: colors.secondary, padding: "3px 9px", borderRadius: 999, border: "1px solid rgba(63,114,175,0.2)" }}>Admin</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Leave Community → navigates to /dashboard */}
          <div style={{ padding: "16px 20px 36px", background: "#EEF2F8" }}>
            <button onClick={onLeave}
              style={{ width: "100%", padding: "13px 0", borderRadius: 14, fontSize: 14, fontWeight: 600, background: "#fff", color: "#DC2626", border: "1.5px solid rgba(220,38,38,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🚪</span> Leave Community
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

// ── Chat View ──────────────────────────────────────────────────────────────
function ChatView({ community: initialCommunity, onLeave }) {
  const [community, setCommunity] = useState(initialCommunity);
  const [messages, setMessages]   = useState(initialCommunity.messages);
  const [input, setInput]         = useState("");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [showInfo, setShowInfo]   = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const isAdmin   = true; // "You" is always admin in this demo

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: Date.now(), sender: "You", avatar: "J", text, time, mine: true }]);
    setInput(""); inputRef.current?.focus();
  };

  if (showInfo) {
    return (
      <GroupInfo
        community={community} isAdmin={isAdmin}
        onClose={() => setShowInfo(false)}
        onSave={(updated) => setCommunity((prev) => ({ ...prev, ...updated }))}
        onLeave={onLeave}
      />
    );
  }

  return (
    <>
      {showVideo && <VideoSessionModal community={community} onClose={() => setShowVideo(false)} />}

      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#EEF2F8", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

        {/* Header */}
        <div style={{ background: colors.tertiary, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(17,45,78,0.18)", zIndex: 10, flexShrink: 0, position: "relative" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#EBF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, cursor: "pointer" }}
            onClick={() => setShowInfo(true)}>
            {community.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => setShowInfo(true)}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{community.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>{community.members} members · {community.online} online</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {isAdmin && (
              <button onClick={() => setShowVideo(true)}
                style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, width: 34, height: 34, fontSize: 15, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                📹
              </button>
            )}
            <button onClick={() => setMenuOpen((o) => !o)}
              style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, width: 34, height: 34, fontSize: 18, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              ⋮
            </button>
          </div>
          {menuOpen && (
            <div style={{ position: "absolute", top: 62, right: 16, background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(17,45,78,0.15)", zIndex: 100, overflow: "hidden", width: 190 }}>
              {[{ label: "Community Info", icon: "ℹ️" }, { label: "Mute Notifications", icon: "🔕" }, { label: "Search Messages", icon: "🔍" }].map((item) => (
                <button key={item.label} onClick={() => { setMenuOpen(false); if (item.label === "Community Info") setShowInfo(true); }}
                  style={{ width: "100%", padding: "10px 16px", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: colors.tertiary, display: "flex", alignItems: "center", gap: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid rgba(63,114,175,0.1)" }} />
              {/* Leave Community from menu → navigate to dashboard */}
              <button onClick={onLeave}
                style={{ width: "100%", padding: "10px 16px", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#DC2626", fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}
                onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span>🚪</span> Leave Community
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", position: "relative" }} onClick={() => menuOpen && setMenuOpen(false)}>
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.035, backgroundImage: "radial-gradient(circle, #112D4E 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ background: "rgba(17,45,78,0.12)", color: colors.tertiary, fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 999 }}>TODAY</span>
          </div>
          {showVideo && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <span style={{ background: "#EBF3FF", color: colors.secondary, fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(63,114,175,0.2)" }}>📹 You started a video session</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, position: "relative", zIndex: 1 }}>
            {messages.map((msg, idx) => {
              const showSender    = !msg.mine && (idx === 0 || messages[idx - 1].sender !== msg.sender);
              const showAvatar    = !msg.mine && (idx === messages.length - 1 || messages[idx + 1]?.sender !== msg.sender || messages[idx + 1]?.mine);
              const isGroupBottom = idx === messages.length - 1 || messages[idx + 1]?.sender !== msg.sender || messages[idx + 1]?.mine !== msg.mine;
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: msg.mine ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 6, marginBottom: isGroupBottom ? 6 : 1 }}>
                  {!msg.mine && <div style={{ width: 28, flexShrink: 0 }}>{showAvatar && <Avatar letter={msg.avatar} size={28} />}</div>}
                  <div style={{ maxWidth: "68%" }}>
                    {showSender && !msg.mine && <div style={{ fontSize: 11, fontWeight: 700, color: avatarColors[msg.avatar] || colors.secondary, marginBottom: 2, marginLeft: 4 }}>{msg.sender}</div>}
                    <div style={{ background: msg.mine ? colors.secondary : "#fff", color: msg.mine ? "#fff" : colors.tertiary, padding: "8px 12px", borderRadius: msg.mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: 13.5, lineHeight: 1.5, boxShadow: "0 1px 3px rgba(17,45,78,0.08)", wordBreak: "break-word" }}>
                      {msg.text}
                      <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 8, whiteSpace: "nowrap", display: "inline-block", float: "right", marginTop: 2 }}>{msg.time}{msg.mine && " ✓✓"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input bar */}
        <div style={{ background: "#fff", padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid rgba(63,114,175,0.1)", flexShrink: 0, boxShadow: "0 -2px 8px rgba(17,45,78,0.05)" }}>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>😊</button>
          <button style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>📎</button>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Type a message..."
            style={{ flex: 1, border: "1.5px solid rgba(63,114,175,0.15)", borderRadius: 22, padding: "9px 16px", fontSize: 13.5, outline: "none", color: colors.tertiary, background: "#F8FAFC", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
            onFocus={e => e.target.style.borderColor = colors.secondary}
            onBlur={e => e.target.style.borderColor = "rgba(63,114,175,0.15)"} />
          <button onClick={send}
            style={{ width: 40, height: 40, borderRadius: "50%", background: input.trim() ? colors.secondary : "#E2E8F0", border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "background 0.2s", flexShrink: 0 }}>
            <span style={{ color: input.trim() ? "#fff" : "#94a3b8", transform: "rotate(45deg)", display: "inline-block", marginTop: -2 }}>➤</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ── View Community Page ────────────────────────────────────────────────────
export default function ViewCommunity() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const community = COMMUNITIES[id];

  const [joined,   setJoined]   = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [shake,    setShake]    = useState(false);

  // Unknown community id
  if (!community) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#EEF2F8", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ color: colors.tertiary, marginBottom: 8 }}>Community not found</h2>
        <button onClick={() => navigate("/dashboard")}
          style={{ background: colors.secondary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isPrivate = community.type === "private";

  const handleJoin = () => {
    if (isPrivate && passcode !== community.passcode) {
      setError("Incorrect passcode. Please try again.");
      setShake(true); setTimeout(() => setShake(false), 500); return;
    }
    setJoined(true);
  };

  // Leave community → back to dashboard
  const handleLeave = () => navigate("/dashboard");

  if (joined) return <ChatView community={community} onLeave={handleLeave} />;

  return (
    <div className="min-h-screen" style={{ background: "#EEF2F8", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", background: "rgba(238,242,248,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(63,114,175,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* ← back to dashboard */}
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "#EBF3FF", border: "none", borderRadius: 10, width: 34, height: 34, cursor: "pointer", fontSize: 16, color: colors.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: colors.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>L</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.tertiary }}>Lumora</span>
          <span style={{ color: "#CBD5E1", fontSize: 16 }}>›</span>
          <span style={{ fontSize: 13, color: "#64748b" }}>Community</span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: colors.secondary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>J</div>
      </div>

      {/* Card */}
      <div style={{ maxWidth: 560, margin: "48px auto", padding: "0 24px" }}>
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid rgba(63,114,175,0.1)", boxShadow: "0 4px 24px rgba(17,45,78,0.08)", overflow: "hidden" }}>
          <div style={{ height: 100, background: `linear-gradient(135deg, ${colors.tertiary} 0%, ${colors.secondary} 100%)`, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", top: 12, right: 14 }}>
              <span style={{ background: isPrivate ? "rgba(220,38,38,0.18)" : "rgba(34,197,94,0.18)", color: isPrivate ? "#FCA5A5" : "#86EFAC", border: `1px solid ${isPrivate ? "rgba(220,38,38,0.3)" : "rgba(34,197,94,0.3)"}`, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                {isPrivate ? "🔒 Private" : "🌐 Public"}
              </span>
            </div>
          </div>
          <div style={{ padding: "0 28px", position: "relative" }}>
            <div style={{ width: 76, height: 76, borderRadius: 20, background: "#EBF3FF", border: "4px solid #fff", boxShadow: "0 4px 12px rgba(17,45,78,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginTop: -38, position: "relative", zIndex: 1 }}>
              {community.icon}
            </div>
          </div>
          <div style={{ padding: "12px 28px 28px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.tertiary, margin: "0 0 4px" }}>{community.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>👥 {community.members} members</span>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#CBD5E1", display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>● {community.online} online</span>
                </div>
              </div>
              <span style={{ background: "#EBF3FF", color: colors.secondary, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, flexShrink: 0 }}>{community.tag}</span>
            </div>
            <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.65, margin: "16px 0 0" }}>{community.description}</p>
            <div style={{ height: 1, background: "rgba(63,114,175,0.08)", margin: "24px 0" }} />
            {isPrivate ? (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: colors.tertiary, marginBottom: 10 }}>🔒 This community is private. Enter the passcode to join.</p>
                <div style={{ position: "relative", marginBottom: 8 }}>
                  <input type={showPass ? "text" : "password"} value={passcode}
                    onChange={(e) => { setPasscode(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                    placeholder="Enter passcode"
                    style={{ width: "100%", padding: "11px 46px 11px 16px", borderRadius: 12, fontSize: 14, outline: "none", border: `1.5px solid ${error ? "#DC2626" : "rgba(63,114,175,0.2)"}`, color: colors.tertiary, background: "#F8FAFC", boxSizing: "border-box", fontFamily: "inherit", animation: shake ? "shake 0.4s ease" : "none" }}
                    onFocus={e => e.target.style.borderColor = colors.secondary}
                    onBlur={e => e.target.style.borderColor = error ? "#DC2626" : "rgba(63,114,175,0.2)"} />
                  <button onClick={() => setShowPass((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8" }}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {error && <p style={{ fontSize: 11, color: "#DC2626", margin: "0 0 10px" }}>{error}</p>}
                <button onClick={handleJoin} style={{ width: "100%", padding: "13px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, background: colors.secondary, color: "#fff", border: "none", cursor: "pointer", marginTop: 4 }}>
                  Join Community →
                </button>
                <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 10 }}>Don't have the passcode? Contact a community admin.</p>
              </div>
            ) : (
              <button onClick={handleJoin} style={{ width: "100%", padding: "13px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, background: colors.secondary, color: "#fff", border: "none", cursor: "pointer" }}>
                Join Community →
              </button>
            )}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer" }}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`}</style>
    </div>
  );
}
