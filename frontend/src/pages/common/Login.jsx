import { useState, useEffect } from "react";
import robotLeft   from "../../assets/robot-left.png.png";
import robotRight  from "../../assets/robot-right.png.png";
import robotBottom from "../../assets/robot-bottom.png.png";

/* ─────────────────────── Responsive Width Hook ─────────────────────── */
function useWindowWidth() {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

/* ─────────────────────────── Robot Component ─────────────────────────── */
function Robot({ position, isHiding, isWaving }) {
  const w = useWindowWidth();

  const transforms = {
    left: {
      visible: "translateX(-80%) translateY(10%) rotate(45deg)",
      hidden:  "translateX(-110%) rotate(45deg)",
    },
    right: {
      visible: "translateX(80%) translateY(-10%) rotate(-45deg)",
      hidden:  "translateX(110%) rotate(-45deg)",
    },
    bottom: {
      visible: "translateX(-50%) translateY(45%)",
      hidden:  "translateX(-50%) translateY(110%)",
    },
  };

  const positionStyles = {
    left:   { bottom: 0, left: 0 },
    right:  { bottom: 0, right: 0 },
    bottom: { bottom: 0, left: "50%" },
  };

  // Responsive sizes — xs(<480) | sm(<640) | md(<1024) | lg(1024+)
  function getWidth(pos) {
    if (pos === "bottom") {
      if (w < 480)  return "110px";
      if (w < 640)  return "130px";
      if (w < 1024) return "170px";
      return "clamp(180px, 20vw, 300px)";
    }
    // left / right
    if (w < 480)  return "200px";
    if (w < 640)  return "260px";
    if (w < 1024) return "340px";
    return "clamp(380px, 38vw, 580px)";
  }

  const sources = {
    left:   robotLeft,
    right:  robotRight,
    bottom: robotBottom,
  };

  const zIndexes = {
    left:   10,
    right:  10,
    bottom: 5,
  };

  return (
    <div
      style={{
        position: "fixed",
        ...positionStyles[position],
        zIndex: zIndexes[position],
        transition: "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.7s ease",
        transform: isHiding
          ? transforms[position].hidden
          : transforms[position].visible,
        opacity: isHiding ? 0 : 1,
        transformOrigin: position === "bottom" ? "center bottom" : "bottom center",
      }}
    >
      <img
        src={sources[position]}
        alt={`${position} robot`}
        draggable={false}
        style={{
          width: getWidth(position),
          height: "auto",
          display: "block",
          filter: isWaving
            ? "drop-shadow(0 0 28px rgba(30,100,255,0.6))"
            : "drop-shadow(0 8px 32px rgba(0,0,0,0.15))",
          transition: "filter 0.4s ease, width 0.3s ease",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ─────────────────────────── Spinner SVG ─────────────────────────── */
function Spinner() {
  return (
    <svg
      style={{ animation: "spin 0.8s linear infinite" }}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

/* ─────────────────────────── Main Login Component ─────────────────────────── */
export default function Login() {
  const [form, setForm]         = useState({ identifier: "", password: "" });
  const [errors, setErrors]     = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [success, setSuccess]   = useState(false);

  const robotsHide   = passwordValue.length > 0;
  const robotsWaving = success;

  /* ── Validation ── */
  function validate() {
    const errs = {};
    if (!form.identifier.trim()) errs.identifier = "Email or username is required.";
    if (!form.password)          errs.password   = "Password is required.";
    return errs;
  }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setLoginError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);

    // Simulated API call
    await new Promise((r) => setTimeout(r, 1400));

    if (form.password === "wrongpass") {
      setLoginError("⚠️ Invalid credentials. Please try again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setSuccess(true);
  }

  /* ── Field change ── */
  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "password") setPasswordValue(value);
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  }

  /* ── Input shared style ── */
  function inputStyle(fieldName) {
    const hasError = !!errors[fieldName];
    return {
      width: "100%",
      padding: "11px 14px",
      border: `1.5px solid ${hasError ? "#f87171" : "#e5e7eb"}`,
      borderRadius: "10px",
      background: "#fff",
      fontSize: "15px",
      fontFamily: "'DM Sans', sans-serif",
      color: "#0A1628",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
      WebkitAppearance: "none",
    };
  }

  /* ── Focus handler ── */
  function handleInputFocus(e) {
    e.target.style.borderColor = "#1E64FF";
    e.target.style.boxShadow   = "0 0 0 3px rgba(30,100,255,0.12)";
  }
  function handleInputBlur(e, fieldName) {
    e.target.style.boxShadow = "none";
    e.target.style.borderColor = errors[fieldName] ? "#f87171" : "#e5e7eb";
  }

  /* ────────────────────────── SUCCESS STATE ────────────────────────── */
  if (success) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
          @keyframes spin   { to { transform: rotate(360deg); } }
          @keyframes pop    { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes glowPulse {
            0%, 100% { filter: drop-shadow(0 0 18px rgba(30,100,255,0.5)); }
            50%       { filter: drop-shadow(0 0 36px rgba(30,100,255,0.9)); }
          }
          body { margin: 0; background: #ffffff; }
        `}</style>

        {/* Background */}
        <div style={{
          minHeight: "100vh",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Top bar */}
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, height: "3px",
            background: "linear-gradient(90deg, #1E64FF 0%, #3b82f6 50%, #1E64FF 100%)",
            zIndex: 100,
          }} />

          {/* Robots waving with glow */}
          <div>
            <Robot position="left"   isHiding={false} isWaving={true} />
            <Robot position="right"  isHiding={false} isWaving={true} />
            <Robot position="bottom" isHiding={false} isWaving={true} />
          </div>

          {/* Success card */}
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 8px 40px rgba(30,100,255,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            padding: "44px 36px",
            width: "100%",
            maxWidth: "420px",
            textAlign: "center",
            position: "relative",
            zIndex: 20,
            animation: "fadeUp 0.5s ease both",
          }}>
            <div style={{ fontSize: "52px", animation: "pop 0.5s ease both" }}>👋</div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "26px",
              fontWeight: 800,
              color: "#0A1628",
              margin: "16px 0 8px",
            }}>Welcome back!</h1>
            <p style={{ color: "#6b7280", fontSize: "15px", margin: "0 0 6px" }}>
              Signed in as
            </p>
            <p style={{
              color: "#1E64FF",
              fontWeight: 600,
              fontSize: "16px",
              margin: "0 0 12px",
              wordBreak: "break-all",
            }}>
              {form.identifier}
            </p>
            <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 28px" }}>
              The robots are waving! 🤖
            </p>
            <a
              href="/dashboard"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #1E64FF 0%, #3b82f6 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "13px 32px",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                textDecoration: "none",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => { e.target.style.transform = "scale(1.02)"; e.target.style.boxShadow = "0 4px 20px rgba(30,100,255,0.35)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
            >
              Go to Dashboard →
            </a>
          </div>
        </div>
      </>
    );
  }

  /* ────────────────────────── LOGIN FORM ────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pop    { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
          -webkit-text-fill-color: #0A1628 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        body { margin: 0; background: #ffffff; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "24px 16px",
      }}>

        {/* Top gradient bar */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg, #1E64FF 0%, #3b82f6 50%, #1E64FF 100%)",
          zIndex: 100,
        }} />

        {/* 3 Robots — always visible, responsive sizes */}
        <div>
          <Robot position="left"   isHiding={robotsHide} isWaving={robotsWaving} />
          <Robot position="right"  isHiding={robotsHide} isWaving={robotsWaving} />
          <Robot position="bottom" isHiding={robotsHide} isWaving={robotsWaving} />
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
          padding: "40px 36px 32px",
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 20,
          animation: "fadeUp 0.4s ease both",
        }}>

          {/* Logo / Brand */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 46,
              height: 46,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #1E64FF 0%, #3b82f6 100%)",
              marginBottom: "12px",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "26px",
              fontWeight: 800,
              color: "#0A1628",
              margin: "0 0 4px",
              letterSpacing: "-0.5px",
            }}>HackFlow</h1>
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
              Sign in to continue hacking
            </p>
          </div>

          {/* Error banner */}
          {loginError && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "11px 14px",
              color: "#dc2626",
              fontSize: "14px",
              fontWeight: 500,
              marginBottom: "18px",
              animation: "fadeUp 0.3s ease",
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Email / Username */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#9ca3af",
                marginBottom: "7px",
              }}>
                Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="you@college.edu or hacker_42"
                value={form.identifier}
                onChange={(e) => handleChange("identifier", e.target.value)}
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur(e, "identifier")}
                style={inputStyle("identifier")}
              />
              {errors.identifier && (
                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "5px", marginBottom: 0 }}>
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                <label style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                }}>
                  Password
                </label>
                <a href="/forgot-password" style={{
                  fontSize: "12px",
                  color: "#1E64FF",
                  textDecoration: "none",
                  fontWeight: 500,
                }}>
                  Forgot password?
                </a>
              </div>

              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onFocus={(e) => {
                    setIsPasswordFocused(true);
                    handleInputFocus(e);
                  }}
                  onBlur={(e) => {
                    setIsPasswordFocused(false);
                    handleInputBlur(e, "password");
                  }}
                  style={{ ...inputStyle("password"), paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "2px",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              {errors.password && (
                <p style={{ color: "#f87171", fontSize: "12px", marginTop: "5px", marginBottom: 0 }}>
                  {errors.password}
                </p>
              )}

              {/* Mobile robot hint */}
              <p className="sm:hidden" style={{
                fontSize: "12px",
                color: "#9ca3af",
                marginTop: "7px",
                marginBottom: 0,
                textAlign: "center",
              }}>
                🤖 Robots looking away!
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "13px",
                background: isLoading
                  ? "linear-gradient(135deg, #6b9fff 0%, #93b8ff 100%)"
                  : "linear-gradient(135deg, #1E64FF 0%, #3b82f6 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "transform 0.15s, box-shadow 0.15s",
                boxShadow: "0 2px 12px rgba(30,100,255,0.25)",
              }}
              onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,100,255,0.35)"; }}}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(30,100,255,0.25)"; }}
              onMouseDown={(e)  => { if (!isLoading) e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={(e)    => { if (!isLoading) e.currentTarget.style.transform = "scale(1.02)"; }}
            >
              {isLoading ? (
                <><Spinner /> Signing in...</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>



          {/* Footer */}
          <p style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#6b7280",
            margin: 0,
          }}>
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              style={{ color: "#1E64FF", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
            >
              Sign up free
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
