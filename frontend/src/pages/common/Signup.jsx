import { useState, useEffect, useRef } from "react";
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

  function getWidth(pos) {
    if (pos === "bottom") {
      if (w < 640)  return "100px";
      if (w < 768)  return "clamp(100px, 10vw, 160px)";
      return "clamp(180px, 20vw, 300px)";
    }
    if (w < 640)  return "160px";
    if (w < 768)  return "clamp(160px, 18vw, 260px)";
    return "clamp(380px, 38vw, 580px)";
  }

  const sources  = { left: robotLeft, right: robotRight, bottom: robotBottom };
  const zIndexes = { left: 10, right: 10, bottom: 5 };

  if (w < 640) return null; // hidden on mobile, show text hint instead

  return (
    <div
      style={{
        position: "fixed",
        ...positionStyles[position],
        zIndex: zIndexes[position],
        transition: "transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.7s ease",
        transform: isHiding ? transforms[position].hidden : transforms[position].visible,
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
          animation: isWaving ? "bounce 0.6s ease-in-out infinite alternate" : "none",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ─────────────────── Password Strength Bar ─────────────────── */
function PasswordStrength({ password }) {
  function getStrength(p) {
    if (!p) return 0;
    if (p.length < 6) return 1;
    if (p.length < 8) return 2;
    if (p.length >= 8 && /[A-Z]/.test(p) && /[0-9]/.test(p)) return 4;
    return 3;
  }
  const strength = getStrength(password);
  const colors   = ["#e5e7eb", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels   = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4].map((seg) => (
          <div key={seg} style={{
            flex: 1, height: "4px", borderRadius: "2px",
            background: seg <= strength ? colors[strength] : "#e5e7eb",
            transition: "background 0.3s ease",
          }} />
        ))}
      </div>
      {password.length > 0 && (
        <p style={{
          fontSize: "11px", color: colors[strength],
          margin: 0, fontWeight: 500, transition: "color 0.3s ease",
        }}>
          {labels[strength]}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────── Spinner ─────────────────────── */
function Spinner() {
  return (
    <svg style={{ animation: "spin 0.8s linear infinite" }} width="18" height="18"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

/* ─────────────────────── Page Wrapper (defined OUTSIDE SignUp!) ─────────────────────── */
/* Keeping this outside prevents remount on every state change                            */
function PageWrap({ robotsHide, robotsWaving, children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pop    { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounce { from { transform: translateY(0px); } to { transform: translateY(-12px); } }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #ffffff inset !important; -webkit-text-fill-color: #1f2937 !important; }
        body { margin: 0; background: #ffffff; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Top blue bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, #1E64FF 0%, #3b82f6 50%, #1E64FF 100%)",
        zIndex: 100,
      }} />

      {/* Robots */}
      <Robot position="left"   isHiding={robotsHide} isWaving={robotsWaving} />
      <Robot position="right"  isHiding={robotsHide} isWaving={robotsWaving} />

      {/* Page */}
      <div style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "32px 16px",
        position: "relative",
      }}>
        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
          padding: "40px 36px 36px",
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 20,
        }}>
          {children}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */
export default function SignUp() {
  const [step, setStep]         = useState("form");
  const [form, setForm]         = useState({ username: "", email: "", password: "" });
  const [errors, setErrors]     = useState({});
  const [passwordValue, setPasswordValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);

  const otpRefs = useRef([]);
  const w       = useWindowWidth();

  // Robots hide ONLY when actually typing in password (not on focus)
  const robotsHide   = (step === "form" && passwordValue.length > 0)
                     || (step === "otp"  && otp.some(d => d !== ""));
  const robotsWaving = step === "success";

  /* ── OTP auto-focus ── */
  useEffect(() => {
    if (step === "otp") setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }, [step]);

  /* ── Resend countdown ── */
  useEffect(() => {
    if (step !== "otp") return;
    const timer = setInterval(() => setResendTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [step]);

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.username.trim())         e.username = "Username is required";
    else if (form.username.length < 3) e.username = "Minimum 3 characters";
    if (!form.email.trim())            e.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password)                e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    return e;
  };

  /* ── Form submit → OTP ── */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setIsLoading(false);
    setStep("otp");
  };

  /* ── OTP verify ── */
  const handleOTPVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setOtpError("Enter all 6 digits"); return; }
    setOtpError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setIsLoading(false);
    setStep("success");
  };

  /* ── OTP input ── */
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  /* ── Styles ── */
  const inputStyle = (field) => ({
    width: "100%",
    padding: "12px 16px",
    border: `1.5px solid ${errors[field] ? "#f87171" : "#e5e7eb"}`,
    borderRadius: "12px",
    background: "#ffffff",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#1f2937",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  });

  const handleFocus = (e) => {
    e.target.style.borderColor = "#1E64FF";
    e.target.style.boxShadow   = "0 0 0 3px rgba(30,100,255,0.12)";
  };
  const handleBlur = (e, field) => {
    e.target.style.boxShadow  = "none";
    e.target.style.borderColor = errors[field] ? "#f87171" : "#e5e7eb";
  };

  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 600,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "#9ca3af", marginBottom: "7px",
  };

  const btnStyle = (disabled) => ({
    width: "100%", padding: "14px",
    background: disabled
      ? "linear-gradient(135deg, #93b8ff 0%, #bad3ff 100%)"
      : "linear-gradient(135deg, #1E64FF 0%, #4D8EFF 100%)",
    color: "#fff", border: "none", borderRadius: "12px",
    fontSize: "15px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    boxShadow: "0 4px 20px rgba(30,100,255,0.25)",
    transition: "transform 0.15s, box-shadow 0.15s",
  });

  const hoverOn  = (e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(30,100,255,0.35)"; };
  const hoverOff = (e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,100,255,0.25)"; };
  const pressOn  = (e) => { e.currentTarget.style.transform = "scale(0.98)"; };
  const pressOff = (e) => { e.currentTarget.style.transform = "scale(1.02)"; };

  /* ══════════════════════════════════════
     STEP 1 — FORM
  ══════════════════════════════════════ */
  if (step === "form") {
    return (
      <PageWrap robotsHide={robotsHide} robotsWaving={robotsWaving}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 46, height: 46, borderRadius: "12px",
            background: "linear-gradient(135deg, #1E64FF 0%, #3b82f6 100%)",
            marginBottom: "12px",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: 800,
            color: "#0A1628", margin: "0 0 4px", letterSpacing: "-0.5px",
          }}>Create Account</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
            Join HackFlow and start hacking
          </p>
        </div>

        <form onSubmit={handleFormSubmit} noValidate>

          {/* Username */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              placeholder="eg. hacker_42"
              value={form.username}
              onChange={(e) => {
                setForm(f => ({ ...f, username: e.target.value }));
                if (errors.username) setErrors(er => ({ ...er, username: "" }));
              }}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, "username")}
              style={inputStyle("username")}
            />
            {errors.username && (
              <p style={{ color: "#f87171", fontSize: "12px", margin: "5px 0 0" }}>
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@college.edu"
              value={form.email}
              onChange={(e) => {
                setForm(f => ({ ...f, email: e.target.value }));
                if (errors.email) setErrors(er => ({ ...er, email: "" }));
              }}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, "email")}
              style={inputStyle("email")}
            />
            {errors.email && (
              <p style={{ color: "#f87171", fontSize: "12px", margin: "5px 0 0" }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm(f => ({ ...f, password: val }));
                  setPasswordValue(val);
                  if (errors.password) setErrors(er => ({ ...er, password: "" }));
                }}
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, "password")}
                style={inputStyle("password")}
              />
            </div>

            <PasswordStrength password={form.password} />

            {errors.password && (
              <p style={{ color: "#f87171", fontSize: "12px", margin: "5px 0 0" }}>
                {errors.password}
              </p>
            )}

            {/* Mobile hint — only when typing */}
            {w < 640 && passwordValue.length > 0 && (
              <p style={{
                fontSize: "12px", color: "#9ca3af",
                marginTop: "6px", marginBottom: 0, textAlign: "center",
              }}>
                🤖 Robots looking away!
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={btnStyle(isLoading)}
            onMouseEnter={!isLoading ? hoverOn : undefined}
            onMouseLeave={hoverOff}
            onMouseDown={!isLoading ? pressOn : undefined}
            onMouseUp={!isLoading ? pressOff : undefined}
          >
            {isLoading ? <><Spinner /> Sending OTP...</> : "Continue →"}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", margin: "20px 0 0" }}>
          Already have an account?{" "}
          <a href="/login"
            style={{ color: "#1E64FF", fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={e => e.target.style.textDecoration = "underline"}
            onMouseLeave={e => e.target.style.textDecoration = "none"}>
            Sign in
          </a>
        </p>

      </PageWrap>
    );
  }

  /* ══════════════════════════════════════
     STEP 2 — OTP
  ══════════════════════════════════════ */
  if (step === "otp") {
    return (
      <PageWrap robotsHide={robotsHide} robotsWaving={robotsWaving}>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: "16px",
            background: "rgba(30,100,255,0.08)", fontSize: "28px",
            marginBottom: "16px", animation: "pop 0.4s ease both",
          }}>
            📬
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "24px", fontWeight: 800,
            color: "#0A1628", margin: "0 0 8px",
          }}>
            Verify your email
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
            Enter the 6-digit code sent to{" "}
            <span style={{ color: "#1E64FF", fontWeight: 600 }}>{form.email}</span>
          </p>
        </div>

        {/* OTP boxes */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "8px" }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => otpRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              onPaste={i === 0 ? handleOtpPaste : undefined}
              style={{
                width: "44px", height: "52px",
                textAlign: "center", fontSize: "20px", fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                border: `1.5px solid ${otpError ? "#f87171" : digit ? "#1E64FF" : "#e5e7eb"}`,
                borderRadius: "12px",
                background: digit ? "rgba(30,100,255,0.04)" : "#fff",
                color: "#0A1628", outline: "none",
                transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
              }}
            />
          ))}
        </div>

        {otpError && (
          <p style={{ color: "#f87171", fontSize: "12px", textAlign: "center", margin: "6px 0 0" }}>
            {otpError}
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleOTPVerify}
            disabled={isLoading}
            style={btnStyle(isLoading)}
            onMouseEnter={!isLoading ? hoverOn : undefined}
            onMouseLeave={hoverOff}
            onMouseDown={!isLoading ? pressOn : undefined}
            onMouseUp={!isLoading ? pressOff : undefined}
          >
            {isLoading ? <><Spinner /> Verifying...</> : "Verify OTP"}
          </button>
        </div>

        {/* Bottom row */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: "16px",
        }}>
          <button
            onClick={() => { setStep("form"); setOtp(["","","","","",""]); setOtpError(""); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#9ca3af", fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif", padding: 0,
            }}
          >
            ← Change email
          </button>

          {resendTimer > 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>
              Resend in <span style={{ fontWeight: 600, color: "#6b7280" }}>{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={() => { setResendTimer(30); setOtp(["","","","","",""]); setOtpError(""); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#1E64FF", fontSize: "13px", fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", padding: 0,
              }}
            >
              Resend OTP
            </button>
          )}
        </div>

      </PageWrap>
    );
  }

  /* ══════════════════════════════════════
     STEP 3 — SUCCESS
  ══════════════════════════════════════ */
  return (
    <PageWrap robotsHide={false} robotsWaving={true}>
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 64, height: 64, borderRadius: "20px",
          background: "rgba(34,197,94,0.1)", fontSize: "34px",
          marginBottom: "20px",
          animation: "pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          🎉
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: "28px", fontWeight: 800,
          color: "#0A1628", margin: "0 0 8px",
        }}>
          You're in!
        </h1>
        <p style={{ color: "#6b7280", fontSize: "15px", margin: "0 0 4px" }}>
          Welcome to HackFlow,
        </p>
        <p style={{
          color: "#1E64FF", fontWeight: 700, fontSize: "17px",
          margin: "0 0 28px", letterSpacing: "-0.3px",
        }}>
          @{form.username}
        </p>
        <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 24px" }}>
          The robots are waving! 🤖
        </p>

        <a
          href="/dashboard"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #1E64FF 0%, #4D8EFF 100%)",
            color: "#fff", textDecoration: "none", borderRadius: "12px",
            padding: "14px 36px", fontSize: "15px", fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 20px rgba(30,100,255,0.3)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(30,100,255,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,100,255,0.3)"; }}
        >
          Go to Dashboard →
        </a>
      </div>
    </PageWrap>
  );
}
