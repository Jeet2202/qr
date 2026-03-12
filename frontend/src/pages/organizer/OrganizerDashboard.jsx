import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle, FileText, CalendarCheck, Award,
  Users, Trophy, CheckCircle2, Clock, ArrowRight, Bell,
  TrendingUp, Calendar,
} from 'lucide-react';
import axios from 'axios';

import OrganizerSidebar from '../../components/OrganizerSidebar';
/* ──────────────── MOCK DATA ──────────────── */
const stats = [
  { label: 'Hackathons Created', value: 3,   icon: Trophy,       color: 'bg-royal/5 text-royal',    ring: 'ring-royal/20' },
  { label: 'Total Participants', value: 240,  icon: Users,        color: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-200' },
  { label: 'Submissions',        value: 96,   icon: FileText,     color: 'bg-violet-50 text-violet-600', ring: 'ring-violet-200' },
  { label: 'Pending Approval',   value: 1,    icon: Clock,        color: 'bg-amber-50 text-amber-600',  ring: 'ring-amber-200' },
];

// Remove mock hackathons array

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

/* ──────────────── MAIN DASHBOARD ──────────────── */
export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/hackathons')
      .then(res => {
        setHackathons(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-light-gray font-sans">
      <OrganizerSidebar />

      {/* Main content area shifts right when sidebar is open */}
      <div className="transition-all duration-300 lg:pl-60">

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

            {/* Hackathon List — 2/3 width */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-dark">Your Hackathons</h2>
                <Link to="/organizer/events" className="text-sm font-bold text-royal hover:underline">View All</Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-gray-500 text-center py-6">Loading hackathons...</p>
                ) : hackathons.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center shadow-sm">
                    <Trophy size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-semibold mb-1">No Hackathons yet</p>
                    <p className="text-sm text-gray-400 mb-4">You haven't created any hackathons.</p>
                    <Link to="/organizer/create" className="text-sm font-bold text-royal bg-royal/10 px-4 py-2 rounded-xl">Create One Now</Link>
                  </div>
                ) : (
                  hackathons.map((hack) => (
                    <div
                      key={hack.slug}
                      onClick={() => navigate(`/organizer/hackathon/${hack.slug}/preview`)}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-royal/30 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4 sm:items-center"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center border border-gray-200">
                        {hack.logoImage ? (
                          <img src={`http://localhost:5000/${hack.logoImage}`} alt="logo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 font-black text-2xl">{hack.title?.[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-dark truncate">{hack.title}</h3>
                          <StatusBadge status="Live" />
                        </div>
                        <p className="text-xs text-gray-500 font-semibold mb-2">
                          <Calendar size={12} className="inline mr-1" />
                          Deadline: {hack.registrationDeadline ? new Date(hack.registrationDeadline).toLocaleDateString() : 'TBA'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                          <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                            <Users size={12} /> {hack.teamSizeMin || 2}-{hack.teamSizeMax || 4} Members
                          </span>
                          <span className="flex items-center gap-1.5 text-royal bg-royal/5 px-2 py-0.5 rounded-lg border border-royal/10">
                            <Trophy size={12} /> {hack.prizePool || '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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