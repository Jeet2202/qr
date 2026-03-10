import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, GraduationCap, Building2 } from 'lucide-react';
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

const roles = [
  { id: 'student', label: 'Student', description: 'Participate in hackathons, create teams, and submit projects.', icon: GraduationCap },
  { id: 'organizer', label: 'Organizer', description: 'Create and manage hackathons, review submissions and manage participants.', icon: Building2 },
];

function RoleSelector({ selectedRole, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        return (
          <button key={role.id} type="button" onClick={() => onSelect(role.id)} className={`relative flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${isSelected ? 'border-royal bg-royal/5 shadow-md' : 'border-gray-200 bg-white hover:border-royal/40 hover:bg-gray-50'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-200 ${isSelected ? 'bg-royal text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-royal/10 group-hover:text-royal'}`}>
              <role.icon size={22} />
            </div>
            <h3 className={`text-sm font-bold mb-1 ${isSelected ? 'text-royal' : 'text-dark'}`}>{role.label}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{role.description}</p>
            <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-royal' : 'border-gray-300'}`}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-royal" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ───────── Signup Page ───────── */

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', agreeTerms: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms) errs.agreeTerms = 'You must agree to the terms';
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
      navigate('/verify-otp', { state: { email: form.email, role } });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-light-gray flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-royal to-royal-dark items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img src={authImg} alt="HackFlow signup" className="w-full h-auto rounded-2xl mb-8 shadow-2xl" />
          <h2 className="text-2xl font-bold text-white mb-3">Join HackFlow Today</h2>
          <p className="text-blue-200/80 text-sm leading-relaxed">Create your account and start participating in or organizing hackathons.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <AuthCard>
          <Link to="/" className="inline-block mb-8">
            <span className="text-2xl font-extrabold text-royal tracking-tight">Hack<span className="text-dark">Flow</span></span>
          </Link>

          <h1 className="text-2xl font-bold text-dark mb-1">Create Your HackFlow Account</h1>
          <p className="text-sm text-gray-500 mb-8">
            {step === 1 ? 'Select your role to get started.' : `Signing up as ${role === 'student' ? 'a Student' : 'an Organizer'}`}
          </p>

          {step === 1 ? (
            <div className="space-y-6">
              <RoleSelector selectedRole={role} onSelect={setRole} />
              <button type="button" disabled={!role} onClick={() => setStep(2)} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-40 cursor-pointer">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-royal transition-colors mb-2 cursor-pointer">
                <ArrowLeft size={14} /> Change role
              </button>

              <AuthInput label="Full Name" placeholder="John Doe" icon={User} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
              <AuthInput label="Email" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
              <AuthInput label="Password" type="password" placeholder="••••••••" icon={Lock} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
              <AuthInput label="Confirm Password" type="password" placeholder="••••••••" icon={Lock} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} />

              <div className="space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.agreeTerms} onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })} className="w-4 h-4 mt-0.5 rounded border-gray-300 text-royal focus:ring-royal cursor-pointer" />
                  <span className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-royal font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-royal font-medium hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-xs text-red-500 ml-6">{errors.agreeTerms}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (<>Send OTP <ArrowRight size={16} /></>)}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-royal hover:text-royal-light transition-colors">Sign In</Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
