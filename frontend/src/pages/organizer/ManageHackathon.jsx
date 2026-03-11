import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Settings, ChevronRight, Users, Star, Award,
  Search, Download, Copy, Mail, Trash2, Eye, BarChart2, ClipboardList,
  ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2, ExternalLink,
  CalendarDays, Trophy, Zap, Grid3X3, List, TrendingUp, Clock, ArrowUpRight,
} from 'lucide-react';
import OrganizerSidebar from '../../components/OrganizerSidebar';

/* ─── MOCK DATA ─── */
const HACK = {
  id: '1', title: 'HackFlow Spring Invitational', status: 'Active',
  deadline: 'Mar 20, 2026', prize: '1,50,000', regCount: 8, subCount: 4,
  regLink: 'https://hackflow.app/h/spring-2026',
};
const PHASES = [
  { label: 'Registration Open',    date: 'Mar 1',  status: 'done'    },
  { label: 'Submissions Open',     date: 'Mar 10', status: 'active'  },
  { label: 'Shortlist Announced',  date: 'Mar 22', status: 'upcoming'},
  { label: 'Event Day',            date: 'Mar 25', status: 'upcoming'},
  { label: 'Results Published',    date: 'Mar 27', status: 'upcoming'},
];
const TRACKS = [
  { id: 'T1', title: 'Climate & Sustainability', teams: 2 },
  { id: 'T2', title: 'Healthcare AI',            teams: 1 },
  { id: 'T3', title: 'FinTech Innovation',        teams: 1 },
];
const ACTIVITY = [
  { id: 1, actor: 'Arjun Mehta',    action: 'joined team ByteForce',            time: '2h ago',  type: 'join'   },
  { id: 2, actor: 'NullPointers',   action: 'submitted MedAI project',          time: '4h ago',  type: 'submit' },
  { id: 3, actor: 'Sneha Kulkarni', action: 'email verified',                   time: '5h ago',  type: 'verify' },
  { id: 4, actor: '404Found',       action: 'registered for hackathon',         time: '8h ago',  type: 'reg'    },
  { id: 5, actor: 'Dev Patel',      action: 'updated team StackSmash profile',  time: '1d ago',  type: 'update' },
];
const PARTICIPANTS = [
  { id:'P001', name:'Arjun Mehta',    email:'arjun@bits.edu',    college:'BITS Pilani',    team:'ByteForce',   status:'Verified', joined:'Mar 5' },
  { id:'P002', name:'Priya Sharma',   email:'priya@iit.ac.in',   college:'IIT Bombay',     team:'ByteForce',   status:'Verified', joined:'Mar 5' },
  { id:'P003', name:'Rohan Das',      email:'rohan@vit.edu',     college:'VIT Vellore',    team:'NullPointers',status:'Verified', joined:'Mar 6' },
  { id:'P004', name:'Sneha Kulkarni', email:'sneha@mit.edu',     college:'MIT Manipal',    team:'NullPointers',status:'Pending',  joined:'Mar 6' },
  { id:'P005', name:'Karan Singh',    email:'karan@nit.ac.in',   college:'NIT Trichy',     team:'404Found',    status:'Verified', joined:'Mar 7' },
  { id:'P006', name:'Anjali Nair',    email:'anjali@iiit.ac.in', college:'IIIT Hyderabad', team:'404Found',    status:'Verified', joined:'Mar 7' },
  { id:'P007', name:'Dev Patel',      email:'dev@daiict.ac.in',  college:'DAIICT',         team:'StackSmash',  status:'Verified', joined:'Mar 8' },
  { id:'P008', name:'Meera Iyer',     email:'meera@psg.edu',     college:'PSG Tech',       team:'StackSmash',  status:'Pending',  joined:'Mar 8' },
];
const TEAMS = [
  { id:'T001', name:'ByteForce',   members:['Arjun Mehta','Priya Sharma'],    college:'BITS / IIT B',  submitted:true,  score:91 },
  { id:'T002', name:'NullPointers',members:['Rohan Das','Sneha Kulkarni'],    college:'VIT / MIT',     submitted:true,  score:87 },
  { id:'T003', name:'404Found',    members:['Karan Singh','Anjali Nair'],     college:'NIT / IIIT H',  submitted:true,  score:78 },
  { id:'T004', name:'StackSmash',  members:['Dev Patel','Meera Iyer'],        college:'DAIICT / PSG',  submitted:false, score:null },
];

/* ─── HELPERS ─── */
const sColor = s => s >= 90 ? '#22c55e' : s >= 80 ? '#3b82f6' : s >= 70 ? '#f59e0b' : '#ef4444';
const sBg    = s => s >= 90 ? 'rgba(34,197,94,.1)' : s >= 80 ? 'rgba(59,130,246,.1)' : s >= 70 ? 'rgba(245,158,11,.1)' : 'rgba(239,68,68,.1)';
const initials = n => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
const avBg = n => `hsl(${n.charCodeAt(0) * 47 % 360},55%,55%)`;

/* ─── ATOMS ─── */
function AnimCount({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!to) return;
    const step = Math.ceil(to / 20);
    const iv = setInterval(() => setV(c => { const n = c + step; if (n >= to) { clearInterval(iv); return to; } return n; }), 40);
    return () => clearInterval(iv);
  }, [to]);
  return <>{v}</>;
}

function SBadge({ s }) {
  const map = {
    Verified:  'text-emerald-700 bg-emerald-50 ring-emerald-200',
    Pending:   'text-amber-700 bg-amber-50 ring-amber-200',
    Active:    'text-emerald-700 bg-emerald-50 ring-emerald-200',
    Completed: 'text-gray-600 bg-gray-100 ring-gray-200',
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ring-1 ${map[s] || 'text-gray-500 bg-gray-100 ring-gray-200'}`}>
      {s === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
      {s}
    </span>
  );
}

function Toast({ t }) {
  if (!t) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[9999] bg-[#0A1628] text-white px-4 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2"
      style={{ animation: 'toastIn .3s ease' }}>
      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />{t}
    </div>
  );
}

/* ─── TABS CONFIG (4 only) ─── */
const TABS = [
  { key: 'overview',      label: 'Overview',      icon: LayoutDashboard },
  { key: 'participants',  label: 'Participants',   icon: Users           },
  { key: 'teams',         label: 'Teams',          icon: Award           },
  { key: 'settings',      label: 'Settings',       icon: Settings        },
];

function TabBar({ active, set }) {
  return (
    <div className="flex border-b border-gray-100 overflow-x-auto bg-white">
      {TABS.map(({ key, label, icon: Icon }) => {
        const on = active === key;
        return (
          <button key={key} onClick={() => set(key)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${on ? 'border-royal text-royal' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'}`}>
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── HACK HEADER ─── */
function HackHeader({ showToast }) {
  return (
    <div className="rounded-2xl mb-6 overflow-hidden border border-gray-100 shadow-[0_2px_16px_rgba(30,100,255,0.07)]">
      {/* Gradient top strip */}
      <div className="h-1.5 bg-gradient-to-r from-royal via-blue-500 to-violet-500" />

      <div className="bg-white px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 flex-wrap">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <SBadge s={HACK.status} />
              <span className="text-xs text-gray-400 font-medium">ID: HF-001</span>
            </div>
            <h1 className="text-2xl font-extrabold text-dark tracking-tight mb-3 truncate">{HACK.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                [CalendarDays, `Deadline: ${HACK.deadline}`,   'text-gray-500'],
                [Trophy,       `Prize: ₹${HACK.prize}`,        'text-amber-600'],
                [Users,        `${HACK.regCount} Registered`,  'text-royal'],
                [FileText,     `${HACK.subCount} Submissions`,  'text-violet-600'],
              ].map(([Icon, text, cls]) => (
                <div key={text} className={`flex items-center gap-1.5 text-sm font-medium ${cls}`}>
                  <Icon size={13} className="shrink-0" />{text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — quick actions */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button onClick={() => { navigator.clipboard?.writeText(HACK.regLink); showToast('Registration link copied!'); }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-royal border border-royal/20 bg-royal/5 rounded-xl hover:bg-royal/10 transition-all cursor-pointer">
              <Copy size={12} /> Copy Link
            </button>
            <button onClick={() => showToast('Email composer opened')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:border-royal/40 hover:text-royal transition-all cursor-pointer">
              <Mail size={12} /> Announce
            </button>
            <Link to="/organizer/ppt-review"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-royal rounded-xl hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-royal/20">
              <ExternalLink size={12} /> PPT Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── STATS ROW ─── */
function StatsRow({ setTab }) {
  const slCount = 0;
  const cards = [
    { icon: Users,    label: 'Participants', value: HACK.regCount, sub: 'registered',      color: 'text-royal bg-royal/8',         tab: 'participants', trend: '+2 this week'     },
    { icon: Award,    label: 'Teams',        value: TEAMS.length,  sub: 'formed',          color: 'text-violet-600 bg-violet-50',  tab: 'teams',        trend: 'All formed'        },
    { icon: FileText, label: 'Submissions',  value: HACK.subCount, sub: 'received',        color: 'text-amber-600 bg-amber-50',    tab: 'participants', trend: '4 of 4 submitted'  },
    { icon: Star,     label: 'Shortlisted',  value: slCount,       sub: `of ${HACK.subCount}`, color: 'text-emerald-600 bg-emerald-50', tab: 'participants', trend: 'Go to PPT Review' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ icon: Icon, label, value, sub, color, tab, trend }) => (
        <div key={label} onClick={() => setTab(tab)}
          className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_4px_20px_rgba(30,100,255,0.09)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={17} />
            </div>
            <ArrowUpRight size={13} className="text-gray-300 group-hover:text-royal transition-colors mt-1" />
          </div>
          <p className="text-2xl font-extrabold text-dark"><AnimCount to={value} /></p>
          <p className="text-xs font-medium text-gray-400 mt-0.5">{label} · {sub}</p>
          <p className="text-[11px] text-gray-300 mt-1.5 font-medium">{trend}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab({ showToast }) {
  const activityDot = { join: '#3b82f6', submit: '#22c55e', verify: '#8b5cf6', reg: '#f59e0b', update: '#64748b' };
  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Phases timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-bold text-dark mb-4 flex items-center gap-2">
            <Clock size={14} className="text-royal" /> Hackathon Phases
          </h3>
          {PHASES.map((p, i) => (
            <div key={p.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${p.status === 'done' ? 'bg-emerald-500' : p.status === 'active' ? 'bg-royal ring-4 ring-royal/20' : 'bg-gray-200'}`}>
                  {p.status === 'done'
                    ? <CheckCircle2 size={11} className="text-white" />
                    : p.status === 'active'
                    ? <span className="w-2 h-2 rounded-full bg-white" />
                    : <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                </div>
                {i < PHASES.length - 1 && <div className={`w-px mt-1 mb-1 ${p.status === 'done' ? 'bg-emerald-300' : 'bg-gray-100'}`} style={{ minHeight: '20px' }} />}
              </div>
              <div className="pb-4">
                <p className={`text-sm font-semibold ${p.status === 'active' ? 'text-royal' : p.status === 'done' ? 'text-emerald-600' : 'text-gray-400'}`}>{p.label}</p>
                <p className="text-xs text-gray-400">{p.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions + Activity */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                [Mail,     'Send Announcement', () => showToast('Email composer opened'),        'text-royal bg-royal/5 hover:bg-royal/10 border-royal/15'],
                [Download, 'Export CSV',         () => showToast('CSV downloaded'),              'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-100'],
                [Copy,     'Copy Reg. Link',      () => showToast('Link copied!'),               'text-violet-700 bg-violet-50 hover:bg-violet-100 border-violet-100'],
                [BarChart2,'Download Report',    () => showToast('Report generated'),            'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-100'],
              ].map(([Icon, label, fn, cls]) => (
                <button key={label} onClick={fn}
                  className={`flex flex-col items-start gap-2 px-3 py-3 rounded-xl border ${cls} text-xs font-semibold transition-all cursor-pointer`}>
                  <Icon size={14} className="shrink-0" />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-violet-500" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {ACTIVITY.map(a => (
                <div key={a.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0" style={{ background: avBg(a.actor) }}>
                    {initials(a.actor)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700"><b>{a.actor}</b> {a.action}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: activityDot[a.type] }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problem Tracks */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h3 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
          <Grid3X3 size={14} className="text-gray-500" /> Problem Tracks
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {TRACKS.map(t => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-sm font-semibold text-dark">{t.title}</span>
              <span className="text-xs font-bold text-royal bg-royal/8 px-2.5 py-0.5 rounded-full">{t.teams} teams</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PARTICIPANTS TAB ─── */
function ParticipantsTab({ showToast }) {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('');
  const [selected, setSelected] = useState([]);
  const [drawer, setDrawer]   = useState(null);
  const [page, setPage]       = useState(0);
  const PER = 5;

  const filtered = PARTICIPANTS.filter(r =>
    (!search || [r.name, r.email, r.college].some(v => v.toLowerCase().includes(search.toLowerCase()))) &&
    (!filter || r.status === filter)
  );
  const paged = filtered.slice(page * PER, page * PER + PER);
  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const toggleSel = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div>
      {/* Detail drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setDrawer(null)}>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setDrawer(null)} className="absolute top-4 right-4 text-gray-400 hover:text-dark cursor-pointer w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm">✕</button>
            <div className="text-center mb-6 pt-2">
              <div className="w-16 h-16 rounded-2xl text-white text-xl font-bold flex items-center justify-center mx-auto mb-3" style={{ background: avBg(drawer.name) }}>{initials(drawer.name)}</div>
              <p className="text-base font-bold text-dark">{drawer.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{drawer.id}</p>
            </div>
            {[['Email', drawer.email], ['College', drawer.college], ['Team', drawer.team], ['Status', drawer.status], ['Joined', drawer.joined]].map(([k, v]) => (
              <div key={k} className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{k}</span>
                <span className="text-sm font-medium text-dark">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="bg-royal text-white px-4 py-2.5 rounded-xl mb-3 flex items-center gap-3 text-sm font-semibold">
          <span>{selected.length} selected</span>
          <button onClick={() => { showToast('Emails sent'); setSelected([]); }} className="px-3 py-1 rounded-lg border border-white/30 bg-white/10 text-xs cursor-pointer flex items-center gap-1"><Mail size={11} />Email</button>
          <button onClick={() => { showToast('CSV exported'); setSelected([]); }} className="px-3 py-1 rounded-lg border border-white/30 bg-white/10 text-xs cursor-pointer flex items-center gap-1"><Download size={11} />Export</button>
          <button onClick={() => setSelected([])} className="ml-auto text-white/60 hover:text-white cursor-pointer text-xs">Clear</button>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, college…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/25 focus:border-royal" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/25 cursor-pointer">
          <option value="">All Status</option>
          <option value="Verified">Verified</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="p-3">
                  <input type="checkbox" className="accent-royal" checked={selected.length === paged.length && paged.length > 0} onChange={() => setSelected(s => s.length === paged.length ? [] : paged.map(r => r.id))} />
                </th>
                {['Name', 'Email', 'College', 'Team', 'Status', 'Joined', ''].map(h => (
                  <th key={h} className="px-3 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                  <td className="p-3"><input type="checkbox" className="accent-royal" checked={selected.includes(r.id)} onChange={() => toggleSel(r.id)} onClick={e => e.stopPropagation()} /></td>
                  <td className="px-3 py-3 cursor-pointer" onClick={() => setDrawer(r)}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0" style={{ background: avBg(r.name) }}>{initials(r.name)}</div>
                      <span className="text-sm font-semibold text-dark">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500">{r.email}</td>
                  <td className="px-3 py-3 text-xs text-gray-500">{r.college}</td>
                  <td className="px-3 py-3"><span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{r.team}</span></td>
                  <td className="px-3 py-3"><SBadge s={r.status} /></td>
                  <td className="px-3 py-3 text-xs text-gray-400">{r.joined}</td>
                  <td className="px-3 py-3"><button onClick={() => setDrawer(r)} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:border-royal hover:text-royal transition-colors cursor-pointer"><Eye size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">{filtered.length} participants</span>
          <div className="flex gap-1.5 items-center">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:border-royal hover:text-royal transition-colors cursor-pointer">Prev</button>
            <span className="text-xs text-gray-500 font-medium">{page + 1}/{pages}</span>
            <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:border-royal hover:text-royal transition-colors cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TEAMS TAB ─── */
function TeamsTab() {
  const [view, setView]     = useState('grid');
  const [filter, setFilter] = useState('all');
  const filtered = TEAMS.filter(t => filter === 'all' ? true : filter === 'submitted' ? t.submitted : !t.submitted);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-2">
          {[['all', 'All'], ['submitted', 'Submitted'], ['pending', 'Not Submitted']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${filter === v ? 'bg-royal text-white border-royal' : 'border-gray-200 text-gray-600 hover:border-royal/40'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {[[Grid3X3, 'grid'], [List, 'list']].map(([Icon, v]) => (
            <button key={v} onClick={() => setView(v)}
              className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${view === v ? 'bg-royal text-white border-royal' : 'border-gray-200 text-gray-400 hover:border-royal/40'}`}>
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((t, i) => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(30,100,255,0.09)] hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: `hsl(${i * 70 + 200},55%,55%)` }}>{t.name[0]}</div>
                <SBadge s={t.submitted ? 'Active' : 'Pending'} />
              </div>
              <p className="font-bold text-dark text-sm mb-0.5">{t.name}</p>
              <p className="text-xs text-gray-400 mb-3">{t.college}</p>
              <div className="space-y-1 mb-3">
                {t.members.map(m => (
                  <div key={m} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-royal" />
                    <span className="text-xs text-gray-600">{m}</span>
                  </div>
                ))}
              </div>
              {t.score != null && (
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">AI Score</span>
                  <span className="text-sm font-bold" style={{ color: sColor(t.score) }}>{t.score}/100</span>
                </div>
              )}
              {!t.submitted && (
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-xs text-amber-600 font-semibold">No submission yet</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {['Team', 'Members', 'College', 'Submission', 'Score'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-dark">{t.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{t.members.join(', ')}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{t.college}</td>
                    <td className="px-4 py-3"><SBadge s={t.submitted ? 'Active' : 'Pending'} /></td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: t.score ? sColor(t.score) : '#94a3b8' }}>{t.score ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SETTINGS TAB ─── */
function SettingsTab({ showToast }) {
  const [regOpen, setRegOpen]   = useState(true);
  const [subsOpen, setSubsOpen] = useState(true);
  const [delInput, setDelInput] = useState('');

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Event controls */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h3 className="text-sm font-bold text-dark mb-5">Event Controls</h3>
        <div className="space-y-4">
          {[
            ['Accept New Registrations', 'Allow new participants to register', regOpen, setRegOpen],
            ['Submissions Open',         'Allow teams to submit their projects', subsOpen, setSubsOpen],
          ].map(([label, desc, val, setVal]) => (
            <div key={label} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <button onClick={() => { setVal(v => !v); showToast(label + ' ' + (val ? 'disabled' : 'enabled')); }}
                className="flex items-center gap-2 cursor-pointer shrink-0">
                <span className={`text-xs font-semibold ${val ? 'text-emerald-600' : 'text-gray-400'}`}>{val ? 'On' : 'Off'}</span>
                {val
                  ? <ToggleRight size={30} className="text-emerald-500" />
                  : <ToggleLeft size={30} className="text-gray-300" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={15} className="text-red-500" />
          <h3 className="text-sm font-bold text-red-600">Danger Zone</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">This action is permanent and cannot be undone. Type the hackathon title to confirm.</p>
        <input value={delInput} onChange={e => setDelInput(e.target.value)} placeholder={HACK.title}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 bg-gray-50" />
        <button disabled={delInput !== HACK.title} onClick={() => showToast('Hackathon deleted')}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 shadow-sm">
          <Trash2 size={13} /> Delete Hackathon
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function ManageHackathon() {
  const [sbOpen, setSbOpen] = useState(true);
  const [tab, setTab]       = useState('overview');
  const [toast, setToast]   = useState(null);
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-sans">
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <OrganizerSidebar open={sbOpen} onToggle={() => setSbOpen(s => !s)} />
      <Toast t={toast} />

      <div className={`transition-all duration-300 ${sbOpen ? 'lg:pl-60' : 'lg:pl-16'}`}>
        {/* Top navbar */}
        <div className="sticky top-0 z-20 h-[60px] bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/organizer-dashboard" className="text-gray-400 hover:text-royal transition-colors">Dashboard</Link>
            <ChevronRight size={13} className="text-gray-300" />
            <span className="font-semibold text-dark truncate max-w-[240px]">{HACK.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/organizer/ppt-review"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-royal border border-royal/20 rounded-lg hover:bg-royal/5 transition-colors cursor-pointer">
              <ExternalLink size={11} /> PPT Review
            </Link>
          </div>
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <HackHeader showToast={showToast} />
          <StatsRow setTab={setTab} />

          {/* Tab card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
            <TabBar active={tab} set={setTab} />
            <div className="p-6">
              {tab === 'overview'     && <OverviewTab showToast={showToast} />}
              {tab === 'participants' && <ParticipantsTab showToast={showToast} />}
              {tab === 'teams'        && <TeamsTab />}
              {tab === 'settings'     && <SettingsTab showToast={showToast} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}