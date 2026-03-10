import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff,
  User, GraduationCap, Building2, ShieldCheck, RotateCcw,
} from "lucide-react";
import AnimatedCharactersPanel from "../components/ui/AnimatedCharactersPanel";

/* ══════════════ AuthInput ══════════════ */

function AuthInput({
  label, type = "text", placeholder, value, onChange, error,
  icon: Icon, onFocus, onBlur,
}: {
  label?: string; type?: string; placeholder?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string;
  icon?: React.FC<{ size?: number; className?: string }>;
  onFocus?: () => void; onBlur?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={onChange} onFocus={onFocus} onBlur={onBlur}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3 text-sm text-gray-900 bg-gray-50 border ${error ? "border-red-400 focus:ring-red-500" : "border-gray-200 focus:ring-royal"} rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all duration-200 placeholder:text-gray-400`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ══════════════ Role Selector ══════════════ */

const roles = [
  { id: "student",   label: "Student",   description: "Participate in hackathons, create teams, and submit projects.", icon: GraduationCap },
  { id: "organizer", label: "Organizer",  description: "Create and manage hackathons, review submissions and participants.", icon: Building2 },
];

function RoleSelector({ selectedRole, onSelect }: { selectedRole: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {roles.map(role => {
        const sel = selectedRole === role.id;
        return (
          <button key={role.id} type="button" onClick={() => onSelect(role.id)}
            className={`relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${sel ? "border-royal bg-royal/5 shadow-md" : "border-gray-200 bg-white hover:border-royal/40 hover:bg-gray-50"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${sel ? "bg-royal text-white" : "bg-gray-100 text-gray-500 group-hover:bg-royal/10 group-hover:text-royal"}`}>
              <role.icon size={20} />
            </div>
            <h3 className={`text-xs font-bold mb-1 ${sel ? "text-royal" : "text-gray-900"}`}>{role.label}</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">{role.description}</p>
            <div className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 flex items-center justify-center ${sel ? "border-royal" : "border-gray-300"}`}>
              {sel && <div className="w-2 h-2 rounded-full bg-royal" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════ Signup Page ══════════════ */

export default function AnimatedSignupPage() {
  const navigate  = useNavigate();

  /* steps: 1=role, 2=form, 3=otp */
  const [step, setStep]   = useState(1);
  const [role, setRole]   = useState("");

  /* form */
  const [form, setForm]     = useState({ name: "", email: "", password: "", confirmPassword: "", agreeTerms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /* password visibility — confirm eye reveals BOTH; password eye reveals only itself */
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* character animation */
  const [isTyping, setIsTyping] = useState(false);

  /* otp */
  const [otp, setOtp]           = useState(Array(6).fill(""));
  const [otpError, setOtpError]  = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [otpLoading, setOtpLoading]  = useState(false);
  const [otpSuccess, setOtpSuccess]  = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* resend countdown (starts when step 3 is active) */
  useEffect(() => {
    if (step !== 3 || resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [step, resendTimer]);

  /* auto-focus first OTP box on step 3 */
  useEffect(() => {
    if (step === 3) setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [step]);

  /* ── Password eye handlers ── */
  const toggleShowPwd = () => setShowPwd(v => !v);          // only affects password field
  const toggleShowConfirm = () => {                          // controls BOTH fields
    const next = !showConfirm;
    setShowConfirm(next);
    if (next) setShowPwd(true);                              // turning confirm ON  → show both
    else       setShowPwd(false);                            // turning confirm OFF → hide both
  };

  /* ── Form validation ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.agreeTerms) e.agreeTerms = "You must agree to the terms";
    return e;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 800);
  };

  /* ── OTP handlers ── */
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otp]; next[index] = value; setOtp(next); setOtpError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };
  const handleOtpKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < 6) { setOtpError("Please enter the complete 6-digit code"); return; }
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setOtpSuccess(true);
      setTimeout(() => navigate(role === "organizer" ? "/organizer-dashboard" : "/student-dashboard"), 1500);
    }, 1200);
  };
  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30); setOtp(Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  /* ── Captions per step ── */
  const captions = [
    { title: "Join HackFlow Today",       subtitle: "Select your role to start your hackathon journey." },
    { title: "Almost There!",             subtitle: "Fill in your details to create your account." },
    { title: "Verify Your Email",         subtitle: "Enter the 6-digit code we sent to your inbox." },
  ];

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      {/* Left — shared animated characters */}
      <AnimatedCharactersPanel
        isTyping={isTyping}
        passwordValue={form.password || form.confirmPassword}
        passwordVisible={showPwd || showConfirm}
        caption={captions[step - 1]}
      />

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto px-4 py-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-7">

          {/* Logo */}
          <Link to="/" className="inline-block mb-4">
            <span className="text-2xl font-extrabold text-royal tracking-tight">Hack<span className="text-gray-900">Flow</span></span>
          </Link>

          {/* ─── STEP 1: Role selector ─── */}
          {step === 1 && (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Create your HackFlow account</h1>
              <p className="text-sm text-gray-500 mb-5">Select your role to get started.</p>
              <div className="space-y-4">
                <RoleSelector selectedRole={role} onSelect={setRole} />
                <button type="button" disabled={!role} onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-40 cursor-pointer">
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* ─── STEP 2: Details form ─── */}
          {step === 2 && (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Create your HackFlow account</h1>
              <p className="text-sm text-gray-500 mb-5">
                Signing up as {role === "student" ? "a Student" : "an Organizer"}
              </p>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-royal transition-colors cursor-pointer mb-1">
                  <ArrowLeft size={14} /> Change role
                </button>

                <AuthInput label="Full Name" placeholder="John Doe" icon={User}
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} error={errors.name} />

                <AuthInput label="Email" type="email" placeholder="you@example.com" icon={Mail}
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)} error={errors.email} />

                {/* Password — eye controls only this field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={(showPwd || showConfirm) ? "text" : "password"}
                      placeholder="••••••••" value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      className={`w-full pl-11 pr-11 py-3 text-sm text-gray-900 bg-gray-50 border ${errors.password ? "border-red-400 focus:ring-red-500" : "border-gray-200 focus:ring-royal"} rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all duration-200 placeholder:text-gray-400`}
                    />
                    <button type="button" onClick={toggleShowPwd}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                      {(showPwd || showConfirm) ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password — eye reveals BOTH fields when toggled on */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={(showPwd || showConfirm) ? "text" : "password"}
                      placeholder="••••••••" value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      className={`w-full pl-11 pr-11 py-3 text-sm text-gray-900 bg-gray-50 border ${errors.confirmPassword ? "border-red-400 focus:ring-red-500" : "border-gray-200 focus:ring-royal"} rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all duration-200 placeholder:text-gray-400`}
                    />
                    <button type="button" onClick={toggleShowConfirm}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.agreeTerms}
                      onChange={e => setForm({ ...form, agreeTerms: e.target.checked })}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-royal focus:ring-royal cursor-pointer" />
                    <span className="text-sm text-gray-600">
                      I agree to the <a href="#" className="text-royal font-medium hover:underline">Terms of Service</a>{" "}
                      and <a href="#" className="text-royal font-medium hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.agreeTerms && <p className="text-xs text-red-500 ml-6">{errors.agreeTerms}</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <>Send OTP <ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          )}

          {/* ─── STEP 3: OTP verification ─── */}
          {step === 3 && (
            otpSuccess ? (
              /* Success state */
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-5">
                  <ShieldCheck size={32} className="text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
                <p className="text-sm text-gray-500 mb-4">Redirecting you to your dashboard...</p>
                <div className="w-5 h-5 mx-auto border-2 border-royal/30 border-t-royal rounded-full animate-spin" />
              </div>
            ) : (
              /* OTP input */
              <>
                <button type="button" onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-royal transition-colors cursor-pointer mb-4">
                  <ArrowLeft size={14} /> Back
                </button>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-royal/5 mb-4">
                    <ShieldCheck size={26} className="text-royal" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-1">Verify your email</h1>
                  <p className="text-sm text-gray-500">
                    We sent a 6-digit code to{" "}
                    <span className="font-semibold text-gray-800">{form.email}</span>
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="flex justify-center gap-2.5">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { inputRefs.current[i] = el; }}
                        type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        className={`w-11 h-13 text-center text-lg font-bold rounded-xl border-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${
                          otpError
                            ? "border-red-300 focus:ring-red-400 focus:border-transparent"
                            : digit
                            ? "border-royal/40 focus:ring-royal focus:border-transparent"
                            : "border-gray-200 focus:ring-royal focus:border-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  {otpError && <p className="text-center text-xs text-red-500">{otpError}</p>}

                  <button type="submit" disabled={otpLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer">
                    {otpLoading
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <>Verify & Create Account <ArrowRight size={16} /></>}
                  </button>
                </form>

                <div className="text-center mt-4">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-400">
                      Resend code in <span className="font-semibold text-gray-700">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button type="button" onClick={handleResend}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-royal hover:text-royal-light transition-colors cursor-pointer">
                      <RotateCcw size={14} /> Resend OTP
                    </button>
                  )}
                </div>
              </>
            )
          )}

          {/* Sign in link (hidden on success screen) */}
          {!(step === 3 && otpSuccess) && (
            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-royal hover:text-royal-light transition-colors">Sign In</Link>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
