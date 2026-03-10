import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import RoleSelector from '../components/auth/RoleSelector';
import authImg from '../assets/auth-illustration.png';

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = role, 2 = form
  const [role, setRole] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
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
      {/* Left illustration — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-royal to-royal-dark items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img
            src={authImg}
            alt="HackFlow signup"
            className="w-full h-auto rounded-2xl mb-8 shadow-2xl"
          />
          <h2 className="text-2xl font-bold text-white mb-3">
            Join HackFlow Today
          </h2>
          <p className="text-blue-200/80 text-sm leading-relaxed">
            Create your account and start participating in or organizing hackathons.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <AuthCard>
          {/* Logo */}
          <Link to="/" className="inline-block mb-8">
            <span className="text-2xl font-extrabold text-royal tracking-tight">
              Hack<span className="text-dark">Flow</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-dark mb-1">Create Your HackFlow Account</h1>
          <p className="text-sm text-gray-500 mb-8">
            {step === 1
              ? 'Select your role to get started.'
              : `Signing up as ${role === 'student' ? 'a Student' : 'an Organizer'}`}
          </p>

          {step === 1 ? (
            /* Step 1: Role Selection */
            <div className="space-y-6">
              <RoleSelector selectedRole={role} onSelect={setRole} />
              <button
                type="button"
                disabled={!role}
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-40 cursor-pointer"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            /* Step 2: Signup Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-royal transition-colors mb-2 cursor-pointer"
              >
                <ArrowLeft size={14} />
                Change role
              </button>

              <AuthInput
                label="Full Name"
                placeholder="John Doe"
                icon={User}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
              />
              <AuthInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
              />
              <AuthInput
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
              />
              <AuthInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
              />

              {/* Terms checkbox */}
              <div className="space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-royal focus:ring-royal cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-royal font-medium hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-royal font-medium hover:underline">Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-500 ml-6">{errors.agreeTerms}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-royal hover:text-royal-light transition-colors">
              Sign In
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}
