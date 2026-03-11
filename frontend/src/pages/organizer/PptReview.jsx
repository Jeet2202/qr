import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Star, FileText, Mail, Trash2, CheckCircle2,
  ChevronDown, BarChart2, ArrowLeft,
} from 'lucide-react';
import OrganizerSidebar from '../../components/OrganizerSidebar';

/* ─── MOCK DATA ─── */
const SUBS_INIT = [
  { id:'S001', team:'ByteForce',   title:'EcoTrack — Carbon Footprint Monitor',   at:'Mar 10, 2:30 PM', score:91, sc:{innovation:95,technical:88,clarity:92,design:89}, shortlisted:false, track:'Climate & Sustainability' },
  { id:'S002', team:'NullPointers',title:'MedAI — Diagnosis Assistant',            at:'Mar 10, 4:15 PM', score:87, sc:{innovation:88,technical:90,clarity:82,design:86}, shortlisted:false, track:'Healthcare AI'            },
  { id:'S003', team:'404Found',    title:'FinFlow — Smart Budget Planner',         at:'Mar 11, 9:00 AM', score:78, sc:{innovation:75,technical:80,clarity:79,design:78}, shortlisted:false, track:'FinTech Innovation'        },
  { id:'S004', team:'StackSmash',  title:'RuralConnect — Last Mile Delivery',      at:'Mar 11,11:45 AM', score:84, sc:{innovation:86,technical:82,clarity:85,design:83}, shortlisted:false, track:'Climate & Sustainability' },
];

/* ─── HELPERS ─── */
const sColor = s => s >= 90 ? '#22c55e' : s >= 80 ? '#3b82f6' : s >= 70 ? '#f59e0b' : '#ef4444';
const sBg    = s => s >= 90 ? 'rgba(34,197,94,.1)' : s >= 80 ? 'rgba(59,130,246,.1)' : s >= 70 ? 'rgba(245,158,11,.1)' : 'rgba(239,68,68,.1)';
const sLabel = s => s >= 90 ? 'Excellent' : s >= 80 ? 'Strong' : s >= 70 ? 'Good' : 'Needs Work';

/* ─── ATOMS ─── */
function ScoreBar({ label, value, pct }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 120); return () => clearTimeout(t); }, [value]);
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-bold" style={{ color: sColor(value) }}>{value}{pct ? '%' : ''}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w}%`, background: sColor(value) }} />
      </div>
    </div>
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

/* ─── SUBMISSIONS TAB ─── */
function SubmissionsTab({ subs, setSubs, showToast }) {
  const [exp, setExp]           = useState(null);
  const [notes, setNotes]       = useState({});
  const [sortBy, setSortBy]     = useState('score');
  const [threshold, setThreshold] = useState(85);

  const sorted = [...subs].sort((a, b) => sortBy === 'score' ? b.score - a.score : a.team.localeCompare(b.team));

  const toggleSl = id => {
    const s = subs.find(x => x.id === id);
    setSubs(p => p.map(x => x.id === id ? { ...x, shortlisted: !x.shortlisted } : x));
    showToast(s.shortlisted ? `${s.team} removed from shortlist` : `${s.team} shortlisted ✓`);
  };

  const autoShortlist = () => {
    const eligible = subs.filter(s => s.score >= threshold && !s.shortlisted);
    if (!eligible.length) { showToast('No new teams above threshold'); return; }
    setSubs(p => p.map(s => s.score >= threshold ? { ...s, shortlisted: true } : s));
    showToast(`${eligible.length} team${eligible.length > 1 ? 's' : ''} auto-shortlisted (score ≥ ${threshold})`);
  };

  return (
    <div>
      {/* Auto shortlist banner */}
      <div className="flex items-center justify-between bg-royal/5 border border-royal/15 rounded-2xl px-5 py-4 mb-5 flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-9 h-9 rounded-xl bg-royal flex items-center justify-center shrink-0">
            <BarChart2 size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-dark">Auto Shortlist by AI Score</p>
            <p className="text-xs text-gray-400">Shortlist all teams at or above the threshold in one click</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Threshold:</span>
            <input type="range" min={50} max={100} step={5} value={threshold} onChange={e => setThreshold(Number(e.target.value))}
              className="w-28 accent-royal cursor-pointer" />
            <span className="text-sm font-bold text-royal w-7 text-center">{threshold}</span>
          </div>
          <button onClick={autoShortlist}
            className="px-4 py-2 text-xs font-bold text-white bg-royal rounded-xl hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-royal/20 whitespace-nowrap">
            <Star size={12} /> Auto Shortlist ({subs.filter(s => s.score >= threshold).length} teams)
          </button>
        </div>
      </div>

      {/* Sort bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <span className="text-sm font-medium text-gray-500">{subs.length} submissions</span>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-400">Sort:</span>
          {[['score', 'AI Score'], ['team', 'Team']].map(([v, l]) => (
            <button key={v} onClick={() => setSortBy(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${sortBy === v ? 'bg-royal text-white border-royal' : 'border-gray-200 text-gray-600 hover:border-royal/40'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Submission cards */}
      <div className="space-y-3">
        {sorted.map((s, i) => (
          <div key={s.id}
            className={`bg-white rounded-2xl border shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 ${s.shortlisted ? 'border-emerald-200 shadow-emerald-50' : 'border-gray-100'}`}>
            {/* Rank stripe */}
            <div className="h-0.5" style={{ background: i === 0 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : i === 1 ? 'linear-gradient(90deg,#94a3b8,#cbd5e1)' : i === 2 ? 'linear-gradient(90deg,#f97316,#fb923c)' : '#f1f5f9' }} />

            {/* Main row */}
            <div className="p-5 cursor-pointer" onClick={() => setExp(exp === s.id ? null : s.id)}>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Rank badge */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  #{i + 1}
                </div>

                {/* Title + team */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-dark text-sm">{s.title}</span>
                    {s.shortlisted && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-200">Shortlisted</span>}
                  </div>
                  <p className="text-xs text-gray-400">{s.team} · {s.track} · {s.at}</p>
                </div>

                {/* Score pill */}
                <div className="px-3 py-2 rounded-xl shrink-0 flex items-baseline gap-1" style={{ background: sBg(s.score) }}>
                  <span className="text-2xl font-extrabold leading-none" style={{ color: sColor(s.score) }}>{s.score}</span>
                  <span className="text-xs text-gray-400">/ 100</span>
                </div>
                <span className="text-xs font-semibold hidden sm:block" style={{ color: sColor(s.score) }}>{sLabel(s.score)}</span>

                {/* Actions */}
                <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <button className="px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-600 rounded-xl hover:border-royal hover:text-royal transition-colors cursor-pointer flex items-center gap-1">
                    <FileText size={11} /> PPT
                  </button>
                  <button onClick={() => toggleSl(s.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${s.shortlisted ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100' : 'text-white bg-royal border border-royal hover:bg-blue-700'}`}>
                    <Star size={11} fill={s.shortlisted ? 'currentColor' : 'none'} />
                    {s.shortlisted ? 'Listed' : 'Shortlist'}
                  </button>
                </div>

                <ChevronDown size={14} className={`text-gray-300 transition-transform shrink-0 ${exp === s.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Expanded breakdown */}
            {exp === s.id && (
              <div className="px-5 pb-5 pt-3 border-t border-gray-100 bg-gray-50/40">
                <div className="grid sm:grid-cols-2 gap-x-8 mb-5">
                  <ScoreBar label="Innovation (40%)" value={s.sc.innovation} />
                  <ScoreBar label="Technical (30%)"  value={s.sc.technical}  />
                  <ScoreBar label="Clarity (20%)"    value={s.sc.clarity}    />
                  <ScoreBar label="Design (10%)"     value={s.sc.design}     />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Organizer Note</label>
                  <textarea rows={2} value={notes[s.id] || ''} onChange={e => setNotes(n => ({ ...n, [s.id]: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none placeholder-amber-300"
                    placeholder="Add a private note about this submission…" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SHORTLIST TAB ─── */
function ShortlistTab({ subs, setSubs, showToast }) {
  const sl = subs.filter(s => s.shortlisted).sort((a, b) => b.score - a.score);

  const rm = id => {
    setSubs(p => p.map(s => s.id === id ? { ...s, shortlisted: false } : s));
    showToast('Removed from shortlist');
  };

  if (!sl.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Star size={24} className="text-gray-300" />
        </div>
        <h3 className="text-base font-bold text-dark mb-1">No teams shortlisted yet</h3>
        <p className="text-sm text-gray-400">Go to Submissions tab to shortlist teams.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-dark">{sl.length} team{sl.length !== 1 ? 's' : ''} shortlisted</h2>
          <p className="text-xs text-gray-400 mt-0.5">Send confirmation emails to notify selected teams</p>
        </div>
        <button onClick={() => showToast('Confirmation emails sent to all shortlisted teams')}
          className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer flex items-center gap-2">
          <Mail size={13} /> Send Confirmation Emails
        </button>
      </div>

      {/* Shortlist cards */}
      <div className="space-y-3">
        {sl.map((s, i) => (
          <div key={s.id}
            className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex items-center gap-4 flex-wrap hover:shadow-[0_4px_20px_rgba(34,197,94,0.1)] transition-all duration-200">
            {/* Rank */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0" style={{ background: sBg(s.score), color: sColor(s.score) }}>
              #{i + 1}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-dark text-sm truncate">{s.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.team} · {s.track}</p>
            </div>

            {/* Score */}
            <div className="flex items-baseline gap-1 shrink-0">
              <span className="text-xl font-extrabold" style={{ color: sColor(s.score) }}>{s.score}</span>
              <span className="text-xs text-gray-400">/100</span>
            </div>

            {/* Remove */}
            <button onClick={() => rm(s.id)}
              className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1 shrink-0">
              <Trash2 size={11} /> Remove
            </button>
          </div>
        ))}
      </div>

      {/* Publish panel */}
      <div className="bg-gradient-to-br from-royal/5 to-violet-50 rounded-2xl border border-royal/10 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-bold text-dark mb-1">Publish Results</h3>
            <p className="text-xs text-gray-500">Make results visible on the public hackathon page. This cannot be undone.</p>
          </div>
          <button onClick={() => showToast('Results published!')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-royal/20 cursor-pointer flex items-center gap-2 shrink-0">
            <CheckCircle2 size={14} /> Publish Results
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function PptReview() {
  const [sbOpen, setSbOpen] = useState(true);
  const [tab, setTab]       = useState('submissions');
  const [subs, setSubs]     = useState(SUBS_INIT);
  const [toast, setToast]   = useState(null);
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2800); };
  const slCount = subs.filter(s => s.shortlisted).length;

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
            <Link to="/organizer/manage" className="text-gray-400 hover:text-royal transition-colors">Manage</Link>
            <ChevronRight size={13} className="text-gray-300" />
            <span className="font-semibold text-dark">PPT Review</span>
          </div>
          <Link to="/organizer/manage"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:border-royal hover:text-royal transition-colors cursor-pointer">
            <ArrowLeft size={11} /> Back to Manage
          </Link>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
              <h1 className="text-2xl font-extrabold text-dark tracking-tight">PPT Review Panel</h1>
              {slCount > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  {slCount} team{slCount !== 1 ? 's' : ''} shortlisted
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">Review submissions, view AI scores, and shortlist teams for the offline event.</p>
          </div>

          {/* Tab card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-gray-100">
              {[
                { key: 'submissions', label: 'Submissions', icon: FileText, count: subs.length },
                { key: 'shortlist',   label: 'Shortlist',   icon: Star,     count: slCount    },
              ].map(({ key, label, icon: Icon, count }) => {
                const on = tab === key;
                return (
                  <button key={key} onClick={() => setTab(key)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${on ? 'border-royal text-royal' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'}`}>
                    <Icon size={14} />
                    {label}
                    {count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${on ? 'bg-royal text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {tab === 'submissions' && <SubmissionsTab subs={subs} setSubs={setSubs} showToast={showToast} />}
              {tab === 'shortlist'   && <ShortlistTab   subs={subs} setSubs={setSubs} showToast={showToast} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
