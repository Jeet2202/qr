import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle, FileText, CalendarCheck, Award,
  Users, Trophy, CheckCircle2, Clock, Bell,
  TrendingUp, ShieldCheck, ArrowUpRight, Zap,
  ChevronRight, BarChart2, Star,
} from 'lucide-react';
import OrganizerSidebar from '../../components/OrganizerSidebar';

/* ─── CONFIG DATA ─── */
const STAT_ICONS = [
  { label: 'Hackathons',   icon: Trophy,    iconCls: 'text-royal bg-royal/8',           sub: 'created'     },
  { label: 'Participants', icon: Users,     iconCls: 'text-emerald-600 bg-emerald-50',  sub: 'registered'  },
  { label: 'Submissions',  icon: FileText,  iconCls: 'text-violet-600 bg-violet-50',    sub: 'received'    },
  { label: 'Pending',      icon: Clock,     iconCls: 'text-amber-600 bg-amber-50',      sub: 'awaiting approval' },
];

const ACTIVITY_ICONS = {
  success: { icon: CheckCircle2, cls: 'text-emerald-500 bg-emerald-50' },
  info: { icon: FileText, cls: 'text-royal bg-royal/5' },
  neutral: { icon: Trophy, cls: 'text-gray-400 bg-gray-50' }
};

const QUICK = [
  { label: 'Create Hackathon', icon: PlusCircle,   href: '/organizer/create',       cls: 'text-royal bg-royal/5 hover:bg-royal/10 border-royal/15' },
  { label: 'Review PPTs',      icon: BarChart2,     href: '/organizer/ppt-review',   cls: 'text-violet-700 bg-violet-50 hover:bg-violet-100 border-violet-100' },
  { label: 'Manage Events',    icon: CalendarCheck, href: '/organizer/events',       cls: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-100' },
  { label: 'Certificates',     icon: Award,         href: '/organizer/certificates', cls: 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-100' },
];

/* ─── STATUS BADGE ─── */
function StatusBadge({ status }) {
  const map = {
    Live:      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    Pending:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    Completed: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>
      {status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
      {status}
    </span>
  );
}

/* ─── MAIN ─── */
export default function OrganizerDashboard() {
  const [sbOpen, setSbOpen] = useState(true);
  
  const [stats, setStats] = useState({ totalHackathons: 0, totalParticipants: 0, totalSubmissions: 0, totalPending: 0 });
  const [hackathons, setHackathons] = useState([]);
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('hf_token');
        const res = await fetch('http://localhost:5000/api/organizer/hackathons/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
          if (data.hackathons) setHackathons(data.hackathons);
          if (data.activities) setActivities(data.activities);
          if (data.user) setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-sans">
      <OrganizerSidebar open={sbOpen} onToggle={() => setSbOpen(s => !s)} />

      <div className={`transition-all duration-300 ${sbOpen ? 'lg:pl-60' : 'lg:pl-16'}`}>

        {/* ── TOP NAVBAR ── */}
        <div className="sticky top-0 z-20 h-[60px] bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-dark">Organizer Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/organizer/profile"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-royal border border-royal/20 rounded-lg hover:bg-royal/5 transition-colors cursor-pointer">
              <ShieldCheck size={12} /> My Profile
            </Link>
            <Link to="/organizer/create"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-royal rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-sm shadow-royal/20">
              <PlusCircle size={12} /> Create Hackathon
            </Link>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

          {/* ── PAGE HEADER CARD ── */}
          <div className="rounded-2xl mb-6 overflow-hidden border border-gray-100 shadow-[0_2px_16px_rgba(30,100,255,0.07)]">
            <div className="h-1.5 bg-gradient-to-r from-royal via-blue-500 to-violet-500" />
            <div className="bg-white px-6 py-5 flex items-center gap-4 flex-wrap">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-royal/10 text-royal flex items-center justify-center font-bold text-xl ring-4 ring-royal/10 uppercase">
                  {user?.name?.charAt(0) || 'O'}
                </div>
                {user?.orgVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h1 className="text-xl font-extrabold text-dark">{user?.name || 'Organizer'}</h1>
                  {user?.orgVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full ring-1 ring-emerald-200">
                      <ShieldCheck size={10} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{user?.email || 'Loading email...'}</p>
              </div>
              {/* Mini stats */}
              <div className="flex items-center gap-6 sm:border-l sm:border-gray-100 sm:pl-6">
                {[
                  [stats.totalHackathons, 'Events'], 
                  [stats.totalParticipants, 'Participants'], 
                  [stats.totalSubmissions, 'Submissions']
                ].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-xl font-extrabold text-dark">{v}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STAT_ICONS.map(({ label, icon: Icon, iconCls, sub }) => {
              const valMap = {
                'Hackathons': stats.totalHackathons,
                'Participants': stats.totalParticipants,
                'Submissions': stats.totalSubmissions,
                'Pending': stats.totalPending
              };
              const value = valMap[label] || 0;
              return (
                <div key={label}
                  className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_4px_20px_rgba(30,100,255,0.09)] hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconCls}`}>
                      <Icon size={17} />
                    </div>
                    <ArrowUpRight size={13} className="text-gray-300 group-hover:text-royal transition-colors mt-1" />
                  </div>
                  <p className="text-2xl font-extrabold text-dark">{value}</p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">{label}</p>
                  <p className="text-[11px] text-gray-300 mt-1.5 font-medium">{sub}</p>
                </div>
              );
            })}
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 mb-6">
            <h2 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {QUICK.map(({ label, icon: Icon, href, cls }) => (
                <Link key={label} to={href}
                  className={`flex flex-col items-start gap-2 px-3 py-3 rounded-xl border text-xs font-semibold transition-all hover:-translate-y-0.5 cursor-pointer ${cls}`}>
                  <Icon size={15} className="shrink-0" />{label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── MY HACKATHONS + ACTIVITY ── */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Hackathon list — 2/3 */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-dark flex items-center gap-2">
                  <Trophy size={14} className="text-amber-500" /> My Hackathons
                </h2>
                <Link to="/organizer/manage" className="text-xs font-semibold text-royal hover:underline flex items-center gap-1">
                  View all <ChevronRight size={11} />
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                {hackathons.length === 0 ? (
                  <div className="p-8 text-center">
                    <Trophy size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-600">No hackathons built yet</p>
                    <p className="text-xs text-gray-400 mt-1">Create your first event below!</p>
                  </div>
                ) : hackathons.map((h, i) => (
                  <div key={h._id || i}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-blue-50/30 transition-colors flex-wrap ${i < hackathons.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl bg-royal/8 flex items-center justify-center shrink-0">
                      <Star size={15} className="text-royal" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark text-sm truncate">{h.title}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400">Due {h.deadline ? new Date(h.deadline).toLocaleDateString() : 'TBD'}</span>
                      </div>
                    </div>
                    {/* Prize + Status */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ring-1 ring-amber-200 hidden sm:inline">
                        {h.prize || 'TBD'}
                      </span>
                      <StatusBadge status={h.status || 'Draft'} />
                      <Link to={`/organizer/manage/${h.hackathonId}`} className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 hover:border-royal hover:bg-royal/5 transition-colors cursor-pointer">
                        <ArrowUpRight size={13} className="text-gray-400 hover:text-royal" />
                      </Link>
                    </div>
                  </div>
                ))}
                {/* Create new */}
                <Link to="/organizer/create"
                  className="flex items-center gap-2.5 px-5 py-3.5 text-sm font-semibold text-royal border-t border-dashed border-gray-200 hover:bg-royal/5 transition-colors cursor-pointer">
                  <PlusCircle size={14} /> Create new hackathon
                </Link>
              </div>
            </div>

            {/* Activity feed — 1/3 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-dark flex items-center gap-2">
                  <Bell size={14} className="text-violet-500" /> Recent Activity
                </h2>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                {activities.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No recent activity</p>
                  </div>
                ) : activities.map((a, i) => {
                  const conf = ACTIVITY_ICONS[a.actionType] || ACTIVITY_ICONS.info;
                  const Icon = conf.icon;
                  return (
                    <div key={a._id || i}
                      className={`flex gap-3 p-4 hover:bg-gray-50 transition-colors ${i < activities.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${conf.cls}`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">{a.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
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