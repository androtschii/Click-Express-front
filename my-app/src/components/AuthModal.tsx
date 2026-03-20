import React, { useState } from "react";
import {
  login,
  register,
  loginWithGoogle,
  getSession,
  type Session,
} from "../services/authService";

interface AuthModalProps {
  onClose: () => void;
  theme?: "dark" | "light";
  onSuccess?: (session: Session) => void;
}

const INPUT_STYLE = (dark: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "12px 44px 12px 16px",
  background: dark ? "rgba(255,255,255,0.07)" : "#f5f5f5",
  border: "1px solid rgba(204,0,0,0.25)",
  borderRadius: 8,
  color: dark ? "#fff" : "#1a1a1a",
  fontSize: 14,
  fontFamily: "'Barlow',sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
});

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  theme = "dark",
  onSuccess,
}) => {
  const dark = theme === "dark";
  const [isLogin, setIsLogin] = useState(true);
  const [sliding, setSliding] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [doneUser, setDoneUser] = useState("");

  const switchMode = () => {
    if (sliding) return;
    setSliding(true);
    setError("");
    setTimeout(() => {
      setIsLogin((v) => !v);
      setSliding(false);
    }, 500);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300)); // small delay for UX
    const result = isLogin
      ? login(email, password)
      : register(name, email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || "Something went wrong");
      return;
    }
    setDoneUser(result.user!.name);
    setDone(true);
    // notify parent after short celebration
    setTimeout(() => {
      const session = getSession();
      if (session && onSuccess) onSuccess(session);
      onClose();
    }, 1800);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    const result = await loginWithGoogle();
    setGoogleLoading(false);
    if (!result.ok) {
      setError(result.error || "Google login failed");
      return;
    }
    setDoneUser(result.user!.name);
    setDone(true);
    setTimeout(() => {
      const session = getSession();
      if (session && onSuccess) onSuccess(session);
      onClose();
    }, 1800);
  };

  const panelLeft = isLogin ? "0%" : "55%";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.94) translateY(16px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes formFadeIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0); opacity:0; }
          60%  { transform: scale(1.2); opacity:1; }
          100% { transform: scale(1); opacity:1; }
        }
        .auth-input:focus { border-color: #CC0000 !important; }
        .auth-input::placeholder { color: rgba(150,150,150,0.5); }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 820,
          height: 500,
          borderRadius: 20,
          overflow: "hidden",
          position: "relative",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(204,0,0,0.35)",
          animation: "modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* ── Login form — right side ── */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "55%",
            background: dark ? "#0f0f0f" : "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 44px",
            opacity: isLogin && !sliding ? 1 : 0,
            transition: "opacity 0.25s ease",
            pointerEvents: isLogin && !sliding ? "auto" : "none",
          }}
        >
          <FormContent
            mode="login"
            dark={dark}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={name}
            setName={setName}
            error={error}
            loading={loading}
            googleLoading={googleLoading}
            done={done}
            doneUser={doneUser}
            onSubmit={handleSubmit}
            onGoogle={handleGoogle}
          />
        </div>

        {/* ── Register form — left side ── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "55%",
            background: dark ? "#0f0f0f" : "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 44px",
            opacity: !isLogin && !sliding ? 1 : 0,
            transition: "opacity 0.25s ease",
            pointerEvents: !isLogin && !sliding ? "auto" : "none",
          }}
        >
          <FormContent
            mode="register"
            dark={dark}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            name={name}
            setName={setName}
            error={error}
            loading={loading}
            googleLoading={googleLoading}
            done={done}
            doneUser={doneUser}
            onSubmit={handleSubmit}
            onGoogle={handleGoogle}
          />
        </div>

        {/* ── Sliding red welcome panel ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "45%",
            left: panelLeft,
            transition: "left 0.6s cubic-bezier(0.77,0,0.175,1)",
            background:
              "linear-gradient(145deg, #1a0000 0%, #CC0000 55%, #ff4d4d 100%)",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 28px",
            textAlign: "center",
          }}
        >
          {/* Logo circle */}
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                fill="white"
              />
            </svg>
          </div>

          <div
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontSize: 9,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Click Express
          </div>

          <h2
            style={{
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 700,
              fontSize: 26,
              color: "#fff",
              textTransform: "uppercase",
              marginBottom: 10,
              lineHeight: 1.2,
            }}
          >
            {isLogin ? "Welcome Back!" : "Hello, Friend!"}
          </h2>

          <p
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            {isLogin
              ? "New here? Create an account and start your journey"
              : "Already have an account? Sign in to continue"}
          </p>

          <button
            onClick={switchMode}
            disabled={sliding}
            style={{
              background: "transparent",
              border: "2px solid rgba(255,255,255,0.7)",
              borderRadius: 25,
              padding: "10px 30px",
              color: "#fff",
              fontFamily: "'Oswald',sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
              opacity: sliding ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.borderColor = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
            }}
          >
            {isLogin ? "Register" : "Sign In"}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            width: 30,
            height: 30,
            color: "rgba(255,255,255,0.7)",
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(204,0,0,0.5)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.3)";
            e.currentTarget.style.color = "rgba(255,255,255,0.7)";
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// ── Shared form content component ──────────────────────────────────────────
interface FormContentProps {
  mode: "login" | "register";
  dark: boolean;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  error: string;
  loading: boolean;
  googleLoading: boolean;
  done: boolean;
  doneUser: string;
  onSubmit: () => void;
  onGoogle: () => void;
}

const FormContent: React.FC<FormContentProps> = ({
  mode,
  dark,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  error,
  loading,
  googleLoading,
  done,
  doneUser,
  onSubmit,
  onGoogle,
}) => {
  const isLogin = mode === "login";

  if (done) {
    return (
      <div style={{ textAlign: "center", animation: "formFadeIn 0.4s ease" }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00b050, #00d060)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            animation: "checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "'Oswald',sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: dark ? "#fff" : "#1a1a1a",
            marginBottom: 6,
          }}
        >
          {isLogin ? "Welcome Back!" : "Account Created!"}
        </h3>
        <p
          style={{
            fontFamily: "'Barlow',sans-serif",
            fontSize: 13,
            color: "rgba(150,150,150,0.8)",
          }}
        >
          Signed in as <strong style={{ color: "#CC0000" }}>{doneUser}</strong>
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        animation: "formFadeIn 0.35s ease",
      }}
    >
      <h2
        style={{
          fontFamily: "'Oswald',sans-serif",
          fontWeight: 700,
          fontSize: 26,
          color: dark ? "#fff" : "#1a1a1a",
          textTransform: "uppercase",
          marginBottom: 22,
        }}
      >
        {isLogin ? "Sign In" : "Create Account"}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {!isLogin && (
          <InputField
            dark={dark}
            value={name}
            onChange={setName}
            placeholder="Full Name"
            type="text"
            icon="user"
          />
        )}
        <InputField
          dark={dark}
          value={email}
          onChange={setEmail}
          placeholder="Email"
          type="email"
          icon="email"
        />
        <InputField
          dark={dark}
          value={password}
          onChange={setPassword}
          placeholder="Password"
          type="password"
          icon="lock"
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
        {isLogin && (
          <div style={{ textAlign: "right", marginTop: -4 }}>
            <span
              style={{
                fontFamily: "'Barlow',sans-serif",
                fontSize: 12,
                color: "#CC0000",
                cursor: "pointer",
                opacity: 0.8,
              }}
            >
              Forgot Password?
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 10,
            padding: "8px 12px",
            background: "rgba(204,0,0,0.12)",
            border: "1px solid rgba(204,0,0,0.35)",
            borderRadius: 6,
            fontFamily: "'Barlow',sans-serif",
            fontSize: 12,
            color: "#ff6b6b",
            animation: "formFadeIn 0.2s ease",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: 16,
          padding: "12px",
          background: loading
            ? "rgba(204,0,0,0.5)"
            : "linear-gradient(135deg, #CC0000, #ff4d4d)",
          border: "none",
          borderRadius: 25,
          color: "#fff",
          fontFamily: "'Oswald',sans-serif",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 2,
          textTransform: "uppercase",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 6px 20px rgba(204,0,0,0.4)",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {loading ? (
          <span
            style={{
              width: 16,
              height: 16,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              display: "inline-block",
              animation: "spin 0.7s linear infinite",
            }}
          />
        ) : null}
        {isLogin ? "Sign In" : "Create Account"}
      </button>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          margin: "14px 0",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        />
        <span
          style={{
            fontFamily: "'Barlow',sans-serif",
            fontSize: 11,
            color: "rgba(150,150,150,0.6)",
          }}
        >
          or continue with
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* Social buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        {/* Google */}
        <button
          onClick={onGoogle}
          disabled={googleLoading}
          style={{
            flex: 1,
            padding: "9px 12px",
            background: googleLoading
              ? "rgba(234,67,53,0.1)"
              : dark
              ? "rgba(255,255,255,0.05)"
              : "#f9f9f9",
            border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
            borderRadius: 8,
            cursor: googleLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!googleLoading) {
              e.currentTarget.style.borderColor = "#EA4335";
              e.currentTarget.style.background = "rgba(234,67,53,0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (!googleLoading) {
              e.currentTarget.style.borderColor = dark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.12)";
              e.currentTarget.style.background = dark
                ? "rgba(255,255,255,0.05)"
                : "#f9f9f9";
            }
          }}
        >
          {googleLoading ? (
            <span
              style={{
                width: 14,
                height: 14,
                border: "2px solid rgba(234,67,53,0.3)",
                borderTopColor: "#EA4335",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }}
            />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span
            style={{
              fontFamily: "'Barlow',sans-serif",
              fontWeight: 600,
              fontSize: 12,
              color: dark ? "rgba(255,255,255,0.7)" : "#444",
            }}
          >
            {googleLoading ? "Connecting..." : "Google"}
          </span>
        </button>

        {/* Facebook */}
        <SocialBtn
          dark={dark}
          color="#1877F2"
          label="Facebook"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          }
        />

        {/* LinkedIn */}
        <SocialBtn
          dark={dark}
          color="#0A66C2"
          label="LinkedIn"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

// ── Input field ────────────────────────────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  ),
  email: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ),
};

const InputField: React.FC<{
  dark: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type: string;
  icon: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}> = ({ dark, value, onChange, placeholder, type, icon, onKeyDown }) => (
  <div style={{ position: "relative" }}>
    <input
      className="auth-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      type={type}
      style={INPUT_STYLE(dark)}
      onFocus={(e) => (e.target.style.borderColor = "#CC0000")}
      onBlur={(e) => (e.target.style.borderColor = "rgba(204,0,0,0.25)")}
    />
    <span
      style={{
        position: "absolute",
        right: 14,
        top: "50%",
        transform: "translateY(-50%)",
        color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
        pointerEvents: "none",
        display: "flex",
      }}
    >
      {ICONS[icon]}
    </span>
  </div>
);

// ── Social button (fb, linkedin) ───────────────────────────────────────────
const SocialBtn: React.FC<{
  dark: boolean;
  color: string;
  label: string;
  icon: React.ReactNode;
}> = ({ dark, color, label, icon }) => (
  <button
    title={label}
    onClick={() => alert(`${label} login is not configured in this demo.`)}
    style={{
      flex: 1,
      padding: "9px 12px",
      background: dark ? "rgba(255,255,255,0.05)" : "#f9f9f9",
      border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
      borderRadius: 8,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "all 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.background = `${color}15`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = dark
        ? "rgba(255,255,255,0.12)"
        : "rgba(0,0,0,0.12)";
      e.currentTarget.style.background = dark
        ? "rgba(255,255,255,0.05)"
        : "#f9f9f9";
    }}
  >
    {icon}
    <span
      style={{
        fontFamily: "'Barlow',sans-serif",
        fontWeight: 600,
        fontSize: 12,
        color: dark ? "rgba(255,255,255,0.7)" : "#444",
      }}
    >
      {label}
    </span>
  </button>
);
