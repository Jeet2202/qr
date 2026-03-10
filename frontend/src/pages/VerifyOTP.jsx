import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, RotateCcw } from 'lucide-react';

/* ───────── Inline Component ───────── */

function AuthCard({ children }) {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 sm:p-10">
      {children}
    </div>
  );
}

/* ───────── VerifyOTP Page ───────── */

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';
  const role = location.state?.role || 'student';

  const [otp, setOtp] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.join('').length < 6) { setError('Please enter the complete 6-digit code'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate(role === 'organizer' ? '/organizer-dashboard' : '/student-dashboard'), 1500);
    }, 1200);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(Array(6).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center px-4 py-12">
      <AuthCard>
        <Link to="/" className="inline-block mb-8">
          <span className="text-2xl font-extrabold text-royal tracking-tight">Hack<span className="text-dark">Flow</span></span>
        </Link>

        {success ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
              <ShieldCheck size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-dark mb-2">Account Created Successfully!</h2>
            <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
            <div className="mt-4 w-5 h-5 mx-auto border-2 border-royal/30 border-t-royal rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-royal/5 mb-5">
                <ShieldCheck size={26} className="text-royal" />
              </div>
              <h1 className="text-2xl font-bold text-dark mb-2">Verify Your Email</h1>
              <p className="text-sm text-gray-500">
                We have sent a 6-digit verification code to <span className="font-medium text-dark">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input key={i} ref={(el) => (inputRefs.current[i] = el)} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} onPaste={i === 0 ? handlePaste : undefined}
                    className={`w-12 h-14 text-center text-lg font-bold rounded-xl border-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${error ? 'border-red-300 focus:ring-red-500 focus:border-transparent' : digit ? 'border-royal/40 focus:ring-royal focus:border-transparent' : 'border-gray-200 focus:ring-royal focus:border-transparent'}`}
                  />
                ))}
              </div>
              {error && <p className="text-center text-xs text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify OTP'}
              </button>
            </form>

            <div className="text-center mt-6">
              {resendTimer > 0 ? (
                <p className="text-sm text-gray-400">Resend code in <span className="font-semibold text-dark">{resendTimer}s</span></p>
              ) : (
                <button type="button" onClick={handleResend} className="inline-flex items-center gap-1.5 text-sm font-medium text-royal hover:text-royal-light transition-colors cursor-pointer">
                  <RotateCcw size={14} /> Resend OTP
                </button>
              )}
            </div>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-8">
          <Link to="/signup" className="font-medium text-gray-500 hover:text-royal transition-colors">← Back to Sign Up</Link>
        </p>
      </AuthCard>
    </div>
  );
}
