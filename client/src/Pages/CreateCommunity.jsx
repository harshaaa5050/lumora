import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  primary: "#F9F7F7",
  secondary: "#3F72AF",
  tertiary: "#112D4E",
};

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14,
  border: "1.5px solid rgba(63,114,175,0.2)", outline: "none",
  color: "#112D4E", background: "#fff", boxSizing: "border-box",
  fontFamily: "'DM Sans','Segoe UI',sans-serif", transition: "border-color 0.15s",
};

const labelStyle = { fontSize: 13, fontWeight: 600, color: "#112D4E", marginBottom: 6, display: "block" };

const sectionStyle = {
  background: "#fff", border: "1px solid rgba(63,114,175,0.1)",
  boxShadow: "0 1px 4px rgba(17,45,78,0.06)", borderRadius: 16, padding: "20px 24px",
};

export default function CreateCommunity() {
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules]             = useState([{ id: 1, text: "" }]);
  const [privacy, setPrivacy]         = useState("public");
  const [passcode, setPasscode]       = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [moderatorInput, setModeratorInput] = useState("");
  const [moderators, setModerators]   = useState([]);
  const [submitted, setSubmitted]     = useState(false);
  const [errors, setErrors]           = useState({});
  const fileRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addRule    = () => setRules((r) => [...r, { id: Date.now(), text: "" }]);
  const updateRule = (id, val) => setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, text: val } : rule)));
  const removeRule = (id) => setRules((r) => r.filter((rule) => rule.id !== id));

  const addModerator = () => {
    const trimmed = moderatorInput.trim();
    if (!trimmed || moderators.includes(trimmed)) return;
    setModerators((m) => [...m, trimmed]);
    setModeratorInput("");
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Community name is required.";
    if (privacy === "private" && !passcode.trim()) errs.passcode = "Please set a passcode for private communities.";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
    // after success navigate back to dashboard
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: "#EEF2F8", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
        style={{ background: "rgba(238,242,248,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(63,114,175,0.12)" }}>
        <div className="flex items-center gap-3">
          {/* ← back to dashboard */}
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "#EBF3FF", border: "none", borderRadius: 10, width: 34, height: 34, cursor: "pointer", fontSize: 16, color: colors.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ←
          </button>
          <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: colors.secondary }}>
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-base tracking-tight" style={{ color: colors.tertiary }}>Lumora</span>
          <span style={{ color: "#CBD5E1", fontSize: 16 }}>›</span>
          <span className="text-sm font-medium" style={{ color: "#64748b" }}>Create Community</span>
        </div>
        <div className="rounded-full flex items-center justify-center font-bold text-sm"
          style={{ width: 36, height: 36, background: colors.secondary, color: "#fff" }}>J</div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 60px" }}>
        <div className="mb-8">
          <h1 className="font-bold" style={{ fontSize: 26, color: colors.tertiary, margin: "0 0 4px" }}>Create a Community</h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Build a focused space where people can learn, share, and grow together.</p>
        </div>

        <div className="flex flex-col gap-5">

          {/* Community Icon */}
          <div style={sectionStyle}>
            <span style={{ ...labelStyle, marginBottom: 12 }}>Community Icon</span>
            <div className="flex items-center gap-5">
              <div onClick={() => fileRef.current.click()}
                style={{ width: 90, height: 90, flexShrink: 0, cursor: "pointer", background: avatarPreview ? "transparent" : "#EBF3FF", border: `2px dashed ${avatarPreview ? "transparent" : "rgba(63,114,175,0.4)"}`, borderRadius: 18, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>🖼️</div><div style={{ fontSize: 10, color: colors.secondary, fontWeight: 600, marginTop: 2 }}>Upload</div></div>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: colors.tertiary, margin: "0 0 4px" }}>Set a community icon</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px" }}>PNG or JPG, up to 5 MB. Recommended 256×256 px.</p>
                <div className="flex gap-2">
                  <button onClick={() => fileRef.current.click()} style={{ background: colors.secondary, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Choose File</button>
                  {avatarPreview && <button onClick={() => setAvatarPreview(null)} style={{ background: "#FEE2E2", color: "#991B1B", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div style={sectionStyle}>
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: 3, height: 16, background: colors.secondary, borderRadius: 2 }} />
              <h2 style={{ fontSize: 12, fontWeight: 700, color: colors.secondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Basic Info</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label style={labelStyle}>Community Name <span style={{ color: "#DC2626" }}>*</span></label>
                <input value={name} onChange={(e) => { setName(e.target.value); setErrors((e2) => ({ ...e2, name: null })); }}
                  placeholder="e.g. React Developers Hub"
                  style={{ ...inputStyle, borderColor: errors.name ? "#DC2626" : "rgba(63,114,175,0.2)" }}
                  onFocus={e => e.target.style.borderColor = colors.secondary}
                  onBlur={e => e.target.style.borderColor = errors.name ? "#DC2626" : "rgba(63,114,175,0.2)"} />
                {errors.name && <p style={{ fontSize: 11, color: "#DC2626", marginTop: 4 }}>{errors.name}</p>}
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  placeholder="What is this community about? What will members learn or discuss?"
                  rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = colors.secondary}
                  onBlur={e => e.target.style.borderColor = "rgba(63,114,175,0.2)"} />
                <div style={{ textAlign: "right", fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{description.length}/500</div>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div style={sectionStyle}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div style={{ width: 3, height: 16, background: colors.secondary, borderRadius: 2 }} />
                <h2 style={{ fontSize: 12, fontWeight: 700, color: colors.secondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Community Rules</h2>
              </div>
              <button onClick={addRule} style={{ background: "#EBF3FF", color: colors.secondary, border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add Rule</button>
            </div>
            <div className="flex flex-col gap-3">
              {rules.map((rule, i) => (
                <div key={rule.id} className="flex items-center gap-3">
                  <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 8, background: "#EBF3FF", color: colors.secondary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                  <input value={rule.text} onChange={(e) => updateRule(rule.id, e.target.value)}
                    placeholder={`Rule ${i + 1} — e.g. Be respectful`}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => e.target.style.borderColor = colors.secondary}
                    onBlur={e => e.target.style.borderColor = "rgba(63,114,175,0.2)"} />
                  {rules.length > 1 && (
                    <button onClick={() => removeRule(rule.id)} style={{ width: 32, height: 32, flexShrink: 0, border: "none", borderRadius: 8, background: "#FEE2E2", color: "#DC2626", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div style={sectionStyle}>
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: 3, height: 16, background: colors.secondary, borderRadius: 2 }} />
              <h2 style={{ fontSize: 12, fontWeight: 700, color: colors.secondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Privacy Settings</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { val: "public",  icon: "🌐", title: "Public",  desc: "Anyone can discover and join" },
                { val: "private", icon: "🔒", title: "Private", desc: "Join with a passcode only"    },
              ].map((opt) => (
                <button key={opt.val} onClick={() => { setPrivacy(opt.val); setErrors((e2) => ({ ...e2, passcode: null })); }}
                  style={{ background: privacy === opt.val ? "#EBF3FF" : "#F8FAFC", border: `2px solid ${privacy === opt.val ? colors.secondary : "rgba(63,114,175,0.1)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: privacy === opt.val ? colors.tertiary : "#64748b", marginBottom: 3 }}>{opt.title}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            {privacy === "private" && (
              <div style={{ background: "#F8FAFC", borderRadius: 12, border: "1px solid rgba(63,114,175,0.12)", padding: "16px" }}>
                <label style={labelStyle}>Join Passcode <span style={{ color: "#DC2626" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <input type={showPasscode ? "text" : "password"} value={passcode}
                    onChange={(e) => { setPasscode(e.target.value); setErrors((e2) => ({ ...e2, passcode: null })); }}
                    placeholder="Create a passcode for members to join"
                    style={{ ...inputStyle, paddingRight: 46, borderColor: errors.passcode ? "#DC2626" : "rgba(63,114,175,0.2)" }}
                    onFocus={e => e.target.style.borderColor = colors.secondary}
                    onBlur={e => e.target.style.borderColor = errors.passcode ? "#DC2626" : "rgba(63,114,175,0.2)"} />
                  <button onClick={() => setShowPasscode((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8" }}>
                    {showPasscode ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.passcode && <p style={{ fontSize: 11, color: "#DC2626", marginTop: 4 }}>{errors.passcode}</p>}
                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Members must enter this passcode to join. Keep it safe.</p>
              </div>
            )}
          </div>

          {/* Moderators */}
          <div style={sectionStyle}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ width: 3, height: 16, background: colors.secondary, borderRadius: 2 }} />
              <h2 style={{ fontSize: 12, fontWeight: 700, color: colors.secondary, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Moderators</h2>
            </div>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Add trusted members by username or email to help manage your community.</p>
            <div className="flex gap-2 mb-4">
              <input value={moderatorInput} onChange={(e) => setModeratorInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addModerator()} placeholder="Username or email address"
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor = colors.secondary}
                onBlur={e => e.target.style.borderColor = "rgba(63,114,175,0.2)"} />
              <button onClick={addModerator} style={{ background: colors.secondary, color: "#fff", border: "none", borderRadius: 10, padding: "0 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Add</button>
            </div>
            {moderators.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {moderators.map((mod) => (
                  <div key={mod} className="flex items-center gap-2" style={{ background: "#EBF3FF", border: "1px solid rgba(63,114,175,0.2)", borderRadius: 999, padding: "5px 10px 5px 6px" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.secondary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{mod[0].toUpperCase()}</div>
                    <span style={{ fontSize: 13, color: colors.tertiary, fontWeight: 500 }}>{mod}</span>
                    <button onClick={() => setModerators((m) => m.filter((x) => x !== mod))} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 13, lineHeight: 1, padding: 0 }}>✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 8, border: "1px dashed rgba(63,114,175,0.15)" }}>
                <span style={{ fontSize: 18 }}>👥</span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>No moderators added yet. You'll be the default admin.</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <div style={{ ...sectionStyle, display: "flex", gap: 12 }}>
            {/* Cancel → back to dashboard */}
            <button onClick={() => navigate("/dashboard")}
              style={{ flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 600, background: "#F1F5F9", color: "#64748b", border: "none", cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={handleSubmit}
              style={{ flex: 2, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", background: submitted ? "#16a34a" : colors.secondary, color: "#fff", transition: "background 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {submitted ? <><span>✓</span> Community Created!</> : "Create Community"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
