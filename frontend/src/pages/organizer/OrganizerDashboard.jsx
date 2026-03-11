import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, ClipboardList, FileText,
  CalendarCheck, Award, Settings, ChevronRight, ChevronLeft,
  Users, Trophy, CheckCircle2, Clock, ArrowRight, Bell,
  TrendingUp, Zap, Eye,
} from 'lucide-react';

/* ──────────────── SIDEBAR CONFIG ──────────────── */
const sidebarLinks = [
  { label: 'Dashboard',         href: '/organizer-dashboard', icon: LayoutDashboard },
  { label: 'Create Hackathon',  href: '/organizer/create',    icon: PlusCircle },
  { label: 'Manage Hackathons', href: '/organizer/manage',    icon: ClipboardList },
  { label: 'PPT Review',        href: '/organizer/ppt-review',icon: FileText },
  { label: 'Event Management',  href: '/organizer/events',    icon: CalendarCheck },
  { label: 'Certificates',      href: '/organizer/certificates', icon: Award },
  { label: 'Settings',          href: '/organizer/settings',  icon: Settings },
];

/* ──────────────── MOCK DATA ──────────────── */
const stats = [
  { label: 'Hackathons Created', value: 3,   icon: Trophy,       color: 'bg-royal/5 text-royal',    ring: 'ring-royal/20' },
  { label: 'Total Participants', value: 240,  icon: Users,        color: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-200' },
  { label: 'Submissions',        value: 96,   icon: FileText,     color: 'bg-violet-50 text-violet-600', ring: 'ring-violet-200' },
  { label: 'Pending Approval',   value: 1,    icon: Clock,        color: 'bg-amber-50 text-amber-600',  ring: 'ring-amber-200' },
];

const hackathons = [
  { id: 1, title: 'AI Innovation Hackathon', status: 'Live',      participants: 120, submissions: 50,  deadline: 'Mar 25, 2026', prize: '₹2,00,000' },
  { id: 2, title: 'Sustainability Hack',     status: 'Pending',   participants: 80,  submissions: 30,  deadline: 'Apr 10, 2026', prize: '₹1,00,000' },
  { id: 3, title: 'HealthTech Challenge',    status: 'Completed', participants: 40,  submissions: 16,  deadline: 'Feb 28, 2026', prize: '₹75,000' },
];

const activities = [
  { id: 1, msg: 'Admin approved your hackathon',   time: '2m ago',  type: 'success', icon: CheckCircle2 },
  { id: 2, msg: '12 new submissions received',     time: '1h ago',  type: 'info',    icon: FileText },
  { id: 3, msg: 'Team Alpha submitted their PPT',  time: '3h ago',  type: 'info',    icon: FileText },
  { id: 4, msg: 'Sustainability Hack went live',   time: '1d ago',  type: 'success', icon: TrendingUp },
  { id: 5, msg: 'HealthTech Challenge completed',  time: '3d ago',  type: 'neutral', icon: Trophy },
];

const quickActions = [
  { label: 'Create Hackathon', icon: PlusCircle,   href: '/organizer/create',     primary: true  },
  { label: 'Review PPTs',      icon: FileText,      href: '/organizer/ppt-review', primary: false },
  { label: 'Manage Events',    icon: CalendarCheck, href: '/organizer/events',     primary: false },
  { label: 'Certificates',     icon: Award,         href: '/organizer/certificates', primary: false },
];

/* ──────────────── STATUS BADGE ──────────────── */
function StatusBadge({ status }) {
  const styles = {
    Live:      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Pending:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Completed: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${styles[status]}`}>
      {status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {status}
    </span>
  );
}

/* ──────────────── SIDEBAR ──────────────── */
function Sidebar({ open, onClose, onToggle }) {
  const location = useLocation();
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 z-30 h-full bg-white shadow-[2px_0_12px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col ${open ? 'w-64' : 'w-0 lg:w-16'} overflow-hidden`}>
        {/* Logo + collapse toggle */}
        <div className={`flex items-center h-16 px-4 border-b border-gray-100 shrink-0 ${open ? 'gap-3' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          {open && (
            <span className="flex-1 text-lg font-extrabold text-royal tracking-tight whitespace-nowrap">
              Hack<span className="text-dark">Flow</span>
            </span>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-gray-400 hover:text-royal hover:bg-royal/5 transition-colors shrink-0 cursor-pointer"
            title={open ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {sidebarLinks.map(({ label, href, icon: Icon }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={label}
                to={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-royal text-white shadow-md shadow-royal/25'
                    : 'text-gray-600 hover:bg-royal/5 hover:text-royal'
                }`}
                title={!open ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {open && <span className="whitespace-nowrap">{label}</span>}
                {open && active && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Organizer info at bottom */}
        {open && (
          <div className="px-3 py-4 border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-royal/5">
              <img src="https://i.pravatar.cc/40?img=12" alt="profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-royal/20" />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-dark truncate">Organizer</p>
                <p className="text-xs text-gray-500 truncate">Tech Club · Verified ✓</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

/* ──────────────── HACKATHON CARD ──────────────── */
function HackathonCard({ hack }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(30,58,138,0.1)] hover:-translate-y-1 transition-all duration-300 group">
      <div className="h-1 bg-gradient-to-r from-royal to-blue-400" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-dark text-base leading-snug flex-1 mr-3">{hack.title}</h3>
          <StatusBadge status={hack.status} />
        </div>

        <div className="flex gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Users size={13} /> {hack.participants}</span>
          <span className="flex items-center gap-1"><FileText size={13} /> {hack.submissions}</span>
          <span className="flex items-center gap-1"><Trophy size={13} /> {hack.prize}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Clock size={12} />
          Deadline: {hack.deadline}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/organizer/manage/${hack.id}`}
            className="flex-1 text-center py-2 rounded-lg text-xs font-semibold text-white bg-royal hover:bg-royal-light transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Manage
          </Link>
          <Link
            to={`/organizer/ppt-review/${hack.id}`}
            className="flex-1 text-center py-2 rounded-lg text-xs font-semibold text-royal border border-royal/20 hover:bg-royal/5 hover:border-royal transition-all duration-200"
          >
            Review PPT
          </Link>
          <button className="p-2 rounded-lg text-gray-400 hover:text-royal hover:bg-royal/5 transition-colors border border-gray-100">
            <Eye size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────── MAIN DASHBOARD ──────────────── */
export default function OrganizerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-light-gray font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarOpen(s => !s)} />

      {/* Main content area shifts right when sidebar is open */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-16'}`}>

        {/* Page content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Page Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-dark tracking-tight">Organizer Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your hackathons.</p>
            </div>
            <Link
              to="/organizer/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 self-start sm:self-auto"
            >
              <PlusCircle size={16} /> Create Hackathon
            </Link>
          </div>

          {/* ── Organizer Summary ── */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
            <img src="https://i.pravatar.cc/80?img=12" alt="profile" className="w-14 h-14 rounded-2xl object-cover ring-4 ring-royal/10 shrink-0" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-dark">Tech Club</h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-200">
                  <CheckCircle2 size={10} /> Verified
                </span>
              </div>
              <p className="text-sm text-gray-500">XYZ University · organizer@techclub.edu</p>
            </div>
            <div className="flex items-center gap-6 sm:border-l sm:border-gray-100 sm:pl-6">
              <div className="text-center">
                <p className="text-xl font-bold text-dark">3</p>
                <p className="text-xs text-gray-500">Events</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-dark">240</p>
                <p className="text-xs text-gray-500">Participants</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-dark">96</p>
                <p className="text-xs text-gray-500">Submissions</p>
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(({ label, value, icon: Icon, color, ring }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(30,58,138,0.08)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${color} ring-1 ${ring} mb-3`}>
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-extrabold text-dark">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Quick Actions ── */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
            <h2 className="text-base font-bold text-dark mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map(({ label, icon: Icon, href, primary }) => (
                <Link
                  key={label}
                  to={href}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                    primary
                      ? 'bg-royal text-white shadow-md shadow-royal/25 hover:bg-royal-light hover:shadow-lg'
                      : 'text-gray-700 bg-gray-50 hover:bg-royal/5 hover:text-royal border border-gray-100 hover:border-royal/20'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-center leading-snug">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Hackathon List + Activity ── */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Hackathon Cards — 2/3 width */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-dark">Your Hackathons</h2>
                <Link to="/organizer/manage" className="text-sm font-medium text-royal hover:underline flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-4">
                {hackathons.map(hack => (
                  <HackathonCard key={hack.id} hack={hack} />
                ))}
              </div>
            </div>

            {/* Activity Feed — 1/3 width */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-dark">Recent Activity</h2>
                <Bell size={16} className="text-gray-400" />
              </div>
              <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                {activities.map((activity, i) => {
                  const Icon = activity.icon;
                  const iconColor = activity.type === 'success'
                    ? 'text-emerald-500 bg-emerald-50'
                    : activity.type === 'info'
                    ? 'text-royal bg-royal/5'
                    : 'text-gray-400 bg-gray-50';
                  return (
                    <div key={activity.id} className={`flex gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${i < activities.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">{activity.msg}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}