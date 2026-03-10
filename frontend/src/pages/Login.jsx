import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import authImg from '../assets/auth-illustration.png';

/* ───────── Inline Components ───────── */

function AuthCard({ children }) {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 sm:p-10">
      {children}
    </div>
  );
}

function AuthInput({ label, type = 'text', placeholder, value, onChange, error, icon: Icon, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-${isPassword ? '11' : '4'} py-3 text-sm text-dark bg-gray-50 border ${
            error ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-royal'
          } rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all duration-200 placeholder:text-gray-400`}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ───────── Login Page ───────── */

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/student-dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-light-gray flex">
      {/* Left illustration — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-royal to-royal-dark items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img src={authImg} alt="HackFlow authentication" className="w-full h-auto rounded-2xl mb-8 shadow-2xl" />
          <h2 className="text-2xl font-bold text-white mb-3">Welcome Back to HackFlow</h2>
          <p className="text-blue-200/80 text-sm leading-relaxed">Sign in to access your hackathons, manage teams, and track submissions.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <AuthCard>
          <Link to="/" className="inline-block mb-8">
            <span className="text-2xl font-extrabold text-royal tracking-tight">Hack<span className="text-dark">Flow</span></span>
          </Link>

          <h1 className="text-2xl font-bold text-dark mb-1">Sign in to your account</h1>
          <p className="text-sm text-gray-500 mb-8">Enter your credentials to access your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput label="Email" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <AuthInput label="Password" type="password" placeholder="••••••••" icon={Lock} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-royal focus:ring-royal cursor-pointer" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-royal hover:text-royal-light transition-colors">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (<>Sign In <ArrowRight size={16} /></>)}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-gray-400 uppercase tracking-wider">or</span></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-royal hover:text-royal-light transition-colors">Sign Up</Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
