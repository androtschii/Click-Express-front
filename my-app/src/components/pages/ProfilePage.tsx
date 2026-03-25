import React, { useState, useEffect } from "react";
import type { Session } from "../../services/authService";
import { getUserById, updateUser } from "../../services/authService";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface ProfilePageProps {
  session: Session;
  theme?: "dark" | "light";
  savedCount?: number;
  bookedCount?: number;
  onBack?: () => void;
  onLogout?: () => void;
  onSessionUpdate?: (name: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  session,
  theme = "dark",
  savedCount = 0,
  bookedCount = 0,
  onBack,
  onLogout,
  onSessionUpdate,
}) => {
  const isDark = theme === "dark";
  const { lang } = useLanguage();
  const t = translations[lang].profile;

  const bg = isDark ? "#080808" : "#f5f5f5";
  const card = isDark ? "#0d0d0d" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const text = isDark ? "#fff" : "#1a1a1a";
  const muted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)";

  const fullUser = getUserById(session.userId);
  const isGoogle = fullUser?.provider === "google";
  const createdAt = fullUser?.createdAt
    ? new Date(fullUser.createdAt).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(session.name);
  const [editingPass, setEditingPass] = useState(false);
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [displayName, setDisplayName] = useState(session.name);

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(id);
    }
  }, [toast]);

  const handleSaveName = () => {
    if (!nameVal.trim()) return;
    const res = updateUser(session.userId, { name: nameVal.trim() });
    if (res.ok) {
      setDisplayName(nameVal.trim());
      onSessionUpdate?.(nameVal.trim());
      setEditingName(false);
      setToast({ msg: t.nameSaved, ok: true });
    }
  };

  const handleSavePass = () => {
    const res = updateUser(session.userId, { currentPassword: curPass, newPassword: newPass });
    if (!res.ok) {
      const msg = res.error === "wrong_password" ? t.wrongPassword : t.passwordShort;
      setToast({ msg, ok: false });
    } else {
      setCurPass(""); setNewPass("");
      setEditingPass(false);
      setToast({ msg: t.passwordSaved, ok: true });
    }
  };

  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "calc(100vh - 70px)", background: bg, padding: "clamp(24px,4vw,56px) clamp(16px,4vw,40px)" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .prof-input:focus { border-color: #CC0000 !important; outline: none; }
        .prof-btn-ghost:hover { border-color: #CC0000 !important; color: #CC0000 !important; }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
        {/* Back button */}
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: muted, fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: 1, cursor: "pointer", marginBottom: 32, padding: 0, display: "flex", alignItems: "center", gap: 6, transition: "color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#CC0000"; }}
          onMouseLeave={e => { e.currentTarget.style.color = muted; }}>
          {t.back}
        </button>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>● {lang === "ru" ? "АККАУНТ" : "ACCOUNT"}</div>
          <h1 style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,44px)", color: text, textTransform: "uppercase", lineHeight: 1 }}>
            {t.title.split(" ").map((w, i) => i === 1 ? <span key={i} style={{ color: "#CC0000" }}> {w}</span> : w)}
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Left — User card */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Avatar + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {session.avatar ? (
                <img src={session.avatar} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid #CC0000", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#CC0000,#ff4d4d)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 26, color: "#fff", flexShrink: 0, boxShadow: "0 0 24px rgba(204,0,0,0.4)" }}>
                  {initials}
                </div>
              )}
              <div>
                <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 22, color: text, lineHeight: 1.2 }}>{displayName}</div>
                <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: muted, marginTop: 4 }}>{session.email}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, background: isGoogle ? "rgba(66,133,244,0.12)" : "rgba(204,0,0,0.1)", border: `1px solid ${isGoogle ? "rgba(66,133,244,0.3)" : "rgba(204,0,0,0.25)"}`, borderRadius: 20, padding: "3px 10px" }}>
                  <span style={{ fontSize: 11 }}>{isGoogle ? "🌐" : "🔒"}</span>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: isGoogle ? "#4285F4" : "#CC0000" }}>
                    {isGoogle ? t.google : t.local}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: border }} />

            {/* Member since */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: muted, textTransform: "uppercase", letterSpacing: 1 }}>{t.memberSince}</span>
              <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, color: text }}>{createdAt}</span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: border }} />

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: t.savedLoads, val: savedCount, icon: "🤍" },
                { label: t.bookedLoads, val: bookedCount, icon: "📋" },
              ].map(stat => (
                <div key={stat.label} style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}`, borderRadius: 8, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
                  <div style={{ fontFamily: "'Oswald',sans-serif", fontWeight: 700, fontSize: 28, color: "#CC0000", lineHeight: 1 }}>{stat.val}</div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 10, color: muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Sign out */}
            <button onClick={onLogout} style={{ marginTop: 4, padding: "10px 0", background: "transparent", border: "1px solid rgba(204,0,0,0.3)", borderRadius: 6, color: "#ff6b6b", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(204,0,0,0.1)"; e.currentTarget.style.borderColor = "#CC0000"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(204,0,0,0.3)"; }}>
              🚪 {t.signOut}
            </button>
          </div>

          {/* Right — Edit options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Edit name */}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editingName ? 16 : 0 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>👤 {lang === "ru" ? "ИМЯ" : "NAME"}</div>
                  {!editingName && <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 15, color: text }}>{displayName}</div>}
                </div>
                {!editingName && (
                  <button onClick={() => setEditingName(true)} className="prof-btn-ghost" style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 6, padding: "7px 16px", color: muted, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}>
                    {t.editName}
                  </button>
                )}
              </div>
              {editingName && (
                <div style={{ animation: "slideDown 0.2s ease" }}>
                  <input className="prof-input" value={nameVal} onChange={e => setNameVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSaveName()}
                    style={{ width: "100%", padding: "10px 14px", background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 6, color: text, fontFamily: "'Barlow',sans-serif", fontSize: 14, marginBottom: 12, transition: "border-color 0.2s" }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleSaveName} style={{ flex: 1, padding: "9px 0", background: "#CC0000", border: "none", borderRadius: 6, color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#aa0000"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#CC0000"; }}>
                      {t.save}
                    </button>
                    <button onClick={() => { setEditingName(false); setNameVal(displayName); }} style={{ padding: "9px 16px", background: "transparent", border: `1px solid ${border}`, borderRadius: 6, color: muted, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                      {t.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Change password — local accounts only */}
            {!isGoogle && (
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editingPass ? 16 : 0 }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>🔑 {lang === "ru" ? "ПАРОЛЬ" : "PASSWORD"}</div>
                    {!editingPass && <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 15, color: text }}>••••••••</div>}
                  </div>
                  {!editingPass && (
                    <button onClick={() => setEditingPass(true)} className="prof-btn-ghost" style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 6, padding: "7px 16px", color: muted, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}>
                      {t.changePassword}
                    </button>
                  )}
                </div>
                {editingPass && (
                  <div style={{ animation: "slideDown 0.2s ease" }}>
                    <input type="password" className="prof-input" value={curPass} onChange={e => setCurPass(e.target.value)} placeholder={t.currentPassword}
                      style={{ width: "100%", padding: "10px 14px", background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 6, color: text, fontFamily: "'Barlow',sans-serif", fontSize: 14, marginBottom: 10, transition: "border-color 0.2s" }} />
                    <input type="password" className="prof-input" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder={t.newPassword} onKeyDown={e => e.key === "Enter" && handleSavePass()}
                      style={{ width: "100%", padding: "10px 14px", background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 6, color: text, fontFamily: "'Barlow',sans-serif", fontSize: 14, marginBottom: 12, transition: "border-color 0.2s" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={handleSavePass} style={{ flex: 1, padding: "9px 0", background: "#CC0000", border: "none", borderRadius: 6, color: "#fff", fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#aa0000"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#CC0000"; }}>
                        {t.save}
                      </button>
                      <button onClick={() => { setEditingPass(false); setCurPass(""); setNewPass(""); }} style={{ padding: "9px 16px", background: "transparent", border: `1px solid ${border}`, borderRadius: 6, color: muted, fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Account info box */}
            <div style={{ background: isDark ? "rgba(204,0,0,0.06)" : "rgba(204,0,0,0.04)", border: "1px solid rgba(204,0,0,0.2)", borderRadius: 12, padding: 20 }}>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 10, color: "#CC0000", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>ℹ️ {lang === "ru" ? "ИНФОРМАЦИЯ" : "ACCOUNT INFO"}</div>
              {[
                { key: t.accountType, val: isGoogle ? t.google : t.local },
                { key: "User ID", val: `#${session.userId.slice(0, 8).toUpperCase()}` },
              ].map(row => (
                <div key={row.key} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontSize: 12, color: muted }}>{row.key}</span>
                  <span style={{ fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 12, color: text }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: toast.ok ? "#1a1a1a" : "#1a0000", border: `1px solid ${toast.ok ? "#CC0000" : "#ff4444"}`, borderRadius: 8, padding: "12px 20px", fontFamily: "'Barlow',sans-serif", fontWeight: 600, fontSize: 13, color: toast.ok ? "#fff" : "#ff6b6b", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "slideDown 0.3s ease" }}>
          {toast.ok ? "✓ " : "⚠ "}{toast.msg}
        </div>
      )}
    </div>
  );
};
