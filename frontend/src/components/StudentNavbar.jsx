import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const navLinks = [
  { label: 'Dashboard', to: '/student/dashboard' },
  { label: 'Certificates', to: '/student/certificates' },
];

// mock user – replace with real auth context / props when ready
const mockUser = {
  userId: 'stu_001',
  name: 'Arjun Mehta',
  profileImage: null,
};

export default function StudentNavbar({ user = mockUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-extrabold text-royal tracking-tight">
              Hack<span className="text-dark">Flow</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-gray-600 hover:text-royal transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Profile Icon ── */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => navigate('/student/profile')}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-royal/10 hover:bg-royal hover:text-white text-royal transition-all duration-200 font-semibold text-sm overflow-hidden cursor-pointer"
              aria-label="View profile"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </button>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden p-2 text-dark cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-2 bg-white border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-royal hover:bg-royal/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100">
            <Link
              to="/student/profile"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-royal hover:bg-royal/5 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <User size={16} />
              {user.name || 'Profile'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
