import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, LogOut, Settings, User, Shield } from 'lucide-react';

const adminLinks = [
  { label: 'Dashboard',      href: '/admin-dashboard' },
  { label: 'Hackathons',     href: '/admin/hackathons' },
  { label: 'Organizers',     href: '/admin/organizers' },
  { label: 'Students',       href: '/admin/students' },
  { label: 'Reports',        href: '/admin/reports' },
];

export default function AdminNavbar({ onToggleSidebar, sidebarOpen }) {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const location = useLocation();

  const notifications = [
    { id: 1, msg: 'New hackathon pending approval',   time: '5m ago',  unread: true },
    { id: 2, msg: 'Organizer "Tech Club" registered', time: '30m ago', unread: true },
    { id: 3, msg: 'System report generated',          time: '2h ago',  unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left — Logo + sidebar toggle */}
          <div className="flex items-center gap-4">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 text-gray-600 hover:text-royal hover:bg-royal/5 rounded-lg transition-colors duration-200 cursor-pointer"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-royal tracking-tight">
                Hack<span className="text-dark">Flow</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded-md">
                <Shield size={10} /> Admin
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {adminLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.href
                    ? 'text-royal'
                    : 'text-gray-600 hover:text-royal'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Notifications + Profile */}
          <div className="flex items-center gap-3">

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 text-gray-600 hover:text-royal hover:bg-royal/5 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className={`absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transition-all duration-200 ${notifOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-dark">Notifications</span>
                  <span className="text-xs text-royal font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-royal/[0.02]' : ''}`}>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-royal mt-1.5 shrink-0" />}
                    {!n.unread && <div className="w-2 h-2 mt-1.5 shrink-0" />}
                    <div>
                      <p className="text-sm text-gray-700">{n.msg}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-royal/5 transition-colors duration-200 cursor-pointer"
              >
                <img src="https://i.pravatar.cc/40?img=8" alt="admin" className="w-8 h-8 rounded-full object-cover ring-2 ring-red-200" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-dark leading-none">Admin</p>
                  <p className="text-xs text-gray-500 leading-none mt-0.5">HackFlow</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transition-all duration-200 ${profileOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-royal/5 hover:text-royal transition-colors">
                  <User size={15} /> Profile
                </Link>
                <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-royal/5 hover:text-royal transition-colors">
                  <Settings size={15} /> Settings
                </Link>
                <div className="border-t border-gray-100" />
                <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={15} /> Sign Out
                </Link>
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-dark cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pt-2 space-y-1 bg-white border-t border-gray-100">
          {adminLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === link.href
                  ? 'text-royal bg-royal/5'
                  : 'text-gray-700 hover:text-royal hover:bg-royal/5'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
