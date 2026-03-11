import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle, Plus, Trash2, Eye, EyeOff, Check, ArrowLeft, Save,
  Trophy, Calendar, BookOpen, MessageCircle, Gift, MapPin, Wifi, WifiOff,
} from 'lucide-react';
import OrganizerSidebar from '../../components/OrganizerSidebar';



/* ───────────────────── REUSABLE FIELD COMPONENTS ───────────────────── */
function Card({ icon: Icon, color = 'text-royal bg-royal/8', title, sub, children }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
          <Icon size={16} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-dark leading-none">{title}</h3>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </section>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
      {children}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

const inputCls = "w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-royal/25 focus:border-royal focus:bg-white transition-all duration-200";

function Field({ label, required, children }) {
  return <div><Label required={required}>{label}</Label>{children}</div>;
}

/* ───────────────────── MAIN PAGE ───────────────────── */
export default function CreateHackathon() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  /* basic */
  const [basic, setBasic] = useState({ title: '', tagline: '', problemStatement: '', rules: '', whatsappLink: '' });
  const bSet = (k) => (e) => setBasic(b => ({ ...b, [k]: e.target.value }));

  /* timeline */
  const [tl, setTl] = useState({ regStart: '', regEnd: '', hackStart: '', hackEnd: '' });
  const tlSet = (k) => (e) => setTl(t => ({ ...t, [k]: e.target.value }));

  /* prize pool */
  const [totalPool, setTotalPool] = useState('');
  const [rankPrizes, setRankPrizes] = useState([
    { rank: '1st', amount: '' },
    { rank: '2nd', amount: '' },
    { rank: '3rd', amount: '' },
  ]);
  const [domainPrizes, setDomainPrizes] = useState([]);

  const addRankPrize = () => setRankPrizes(p => [...p, { rank: `${p.length + 1}th`, amount: '' }]);
  const removeRankPrize = (i) => setRankPrizes(p => p.filter((_, idx) => idx !== i));
  const updateRank = (i, amount) => setRankPrizes(p => p.map((x, idx) => idx === i ? { ...x, amount } : x));

  const addDomainPrize = () => setDomainPrizes(p => [...p, { name: '', amount: '' }]);
  const removeDomainPrize = (i) => setDomainPrizes(p => p.filter((_, idx) => idx !== i));
  const updateDomain = (i, k, v) => setDomainPrizes(p => p.map((x, idx) => idx === i ? { ...x, [k]: v } : x));

  /* event mode */
  const [mode, setMode] = useState('online');
  const [venue, setVenue] = useState({ college: '', address: '', city: '' });
  const vSet = (k) => (e) => setVenue(v => ({ ...v, [k]: e.target.value }));

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  /* ── Success ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(30,58,138,0.1)] p-10 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <Check size={26} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-extrabold text-dark mb-2">Submitted!</h2>
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold text-dark">"{basic.title}"</span> sent for admin review.
          </p>
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block mb-7">Status: Pending Approval</p>
          <div className="flex gap-3">
            <button onClick={() => setSubmitted(false)} className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Create Another</button>
            <Link to="/organizer-dashboard" className="flex-1 py-2.5 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-colors text-center">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-sans">
      <OrganizerSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(s => !s)} />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-60' : 'lg:pl-16'}`}>
        {/* ── Top bar ── */}
        <div className="sticky top-0 z-20 h-[60px] bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link to="/organizer-dashboard" className="p-1.5 rounded-lg text-gray-400 hover:text-royal hover:bg-royal/5 transition-colors">
              <ArrowLeft size={17} />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-dark leading-none">Create Hackathon</h1>
              <p className="text-xs text-gray-400 mt-0.5">Fill details and submit for admin approval</p>
            </div>
          </div>
          <button type="button" onClick={() => setShowPreview(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
        </div>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          {/* ── Preview ── */}
          {showPreview && (
            <div className="mb-6 bg-white rounded-2xl border border-royal/10 p-5 shadow-sm">
              <p className="text-xs font-bold text-royal uppercase tracking-widest mb-3">Live Preview</p>
              <div className="space-y-1.5 text-sm">
                <p><span className="text-gray-500 font-medium">Title:</span> <span className="text-dark font-semibold">{basic.title || '—'}</span></p>
                <p><span className="text-gray-500 font-medium">Tagline:</span> {basic.tagline || '—'}</p>
                <p><span className="text-gray-500 font-medium">Mode:</span> <span className={`font-semibold ${mode === 'online' ? 'text-royal' : 'text-amber-600'}`}>{mode === 'online' ? 'Online' : 'Offline / In-Person'}</span></p>
                {mode === 'offline' && venue.college && <p><span className="text-gray-500 font-medium">College:</span> {venue.college}</p>}
                {mode === 'offline' && venue.city && <p><span className="text-gray-500 font-medium">City:</span> {venue.city}</p>}
                <p><span className="text-gray-500 font-medium">Hack dates:</span> {tl.hackStart && tl.hackEnd ? `${tl.hackStart} → ${tl.hackEnd}` : '—'}</p>
                <p><span className="text-gray-500 font-medium">Total Prize Pool:</span> {totalPool ? `₹${Number(totalPool).toLocaleString('en-IN')}` : '—'}</p>
                {basic.whatsappLink && <p><span className="text-gray-500 font-medium">WhatsApp:</span> <a href={basic.whatsappLink} className="text-royal hover:underline" target="_blank" rel="noreferrer">{basic.whatsappLink}</a></p>}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── BASIC INFO ── */}
            <Card icon={BookOpen} color="text-royal bg-royal/8" title="Basic Information" sub="Core details about your event">
              <Field label="Hackathon Title" required>
                <input className={inputCls} placeholder="e.g. AI Innovation Hackathon 2026" value={basic.title} onChange={bSet('title')} required />
              </Field>
              <Field label="Tagline">
                <input className={inputCls} placeholder="e.g. Build the future with AI" value={basic.tagline} onChange={bSet('tagline')} />
              </Field>
              <Field label="Problem Statement" required>
                <textarea className={inputCls} rows={4} placeholder="Describe the problem participants will solve…" value={basic.problemStatement} onChange={bSet('problemStatement')} required />
              </Field>
              <Field label="Rules & Eligibility" required>
                <textarea className={inputCls} rows={3} placeholder="Rules, eligibility criteria, code of conduct…" value={basic.rules} onChange={bSet('rules')} required />
              </Field>
            </Card>

            {/* ── EVENT MODE ── */}
            <Card icon={MapPin} color="text-orange-500 bg-orange-50" title="Event Mode" sub="Is this hackathon online or in-person?">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode('online')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 cursor-pointer ${
                    mode === 'online'
                      ? 'border-royal bg-royal/5 text-royal'
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <Wifi size={16} /> Online
                  {mode === 'online' && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-royal" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('offline')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 cursor-pointer ${
                    mode === 'offline'
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <WifiOff size={16} /> Offline / In-Person
                  {mode === 'offline' && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </button>
              </div>

              {mode === 'offline' && (
                <div className="space-y-4 pt-2">
                  <div className="h-px bg-gray-100" />
                  <Field label="College / Institution" required>
                    <input className={inputCls} placeholder="e.g. IIT Bombay, BITS Pilani" value={venue.college} onChange={vSet('college')} required={mode === 'offline'} />
                  </Field>
                  <Field label="Venue / Address">
                    <input className={inputCls} placeholder="e.g. Main Auditorium, Block A" value={venue.address} onChange={vSet('address')} />
                  </Field>
                  <Field label="City" required>
                    <input className={inputCls} placeholder="e.g. Mumbai" value={venue.city} onChange={vSet('city')} required={mode === 'offline'} />
                  </Field>
                </div>
              )}

              {mode === 'online' && (
                <p className="text-xs text-gray-400 flex items-center gap-1.5 pt-1">
                  <Wifi size={12} className="text-royal" />
                  Participants will join remotely. Platform links can be shared after approval.
                </p>
              )}
            </Card>

            {/* ── TIMELINE ── */}
            <Card icon={Calendar} color="text-violet-500 bg-violet-50" title="Timeline" sub="Set registration and event schedule">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Registration Opens" required>
                  <input type="date" className={inputCls} value={tl.regStart} onChange={tlSet('regStart')} required />
                </Field>
                <Field label="Registration Closes" required>
                  <input type="date" className={inputCls} value={tl.regEnd} onChange={tlSet('regEnd')} required />
                </Field>
                <Field label="Hackathon Start" required>
                  <input type="date" className={inputCls} value={tl.hackStart} onChange={tlSet('hackStart')} required />
                </Field>
                <Field label="Hackathon End" required>
                  <input type="date" className={inputCls} value={tl.hackEnd} onChange={tlSet('hackEnd')} required />
                </Field>
              </div>

              {/* Timeline strip */}
              {(tl.regStart || tl.hackEnd) && (
                <div className="flex items-center gap-0 mt-2 overflow-x-auto pt-3 border-t border-gray-100">
                  {[
                    { label: 'Reg. Opens',  date: tl.regStart,  dot: 'bg-royal' },
                    { label: 'Reg. Closes', date: tl.regEnd,    dot: 'bg-amber-400' },
                    { label: 'Hack Starts', date: tl.hackStart, dot: 'bg-emerald-500' },
                    { label: 'Hack Ends',   date: tl.hackEnd,   dot: 'bg-gray-400' },
                  ].map((item, i, arr) => (
                    <div key={item.label} className="flex items-center gap-0">
                      <div className="text-center w-20">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.dot} mx-auto mb-1`} />
                        <p className="text-[9px] font-semibold text-gray-500 leading-tight">{item.label}</p>
                        <p className="text-[9px] text-gray-400">{item.date || '—'}</p>
                      </div>
                      {i < arr.length - 1 && <div className="w-10 h-px bg-gray-200 mb-4" />}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* ── PRIZE POOL ── */}
            <Card icon={Trophy} color="text-amber-500 bg-amber-50" title="Prize Pool" sub="Define winner rewards and special prizes">

              {/* Total pool */}
              <Field label="Total Prize Pool (₹)" required>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold select-none">₹</span>
                  <input type="number" className={`${inputCls} pl-8`} placeholder="e.g. 50000" value={totalPool} onChange={e => setTotalPool(e.target.value)} required />
                </div>
              </Field>

              {/* Rank-based prizes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Winner Prizes</Label>
                  <button type="button" onClick={addRankPrize}
                    className="flex items-center gap-1 text-xs font-semibold text-royal hover:text-royal-light transition-colors cursor-pointer">
                    <Plus size={13} /> Add Rank
                  </button>
                </div>
                <div className="space-y-2">
                  {rankPrizes.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`w-16 text-center text-[11px] font-bold px-2 py-1 rounded-full shrink-0 ${
                        i === 0 ? 'bg-amber-50 text-amber-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        i === 2 ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {p.rank}
                      </span>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">₹</span>
                        <input type="number" placeholder="Amount" value={p.amount} onChange={e => updateRank(i, e.target.value)}
                          className={`${inputCls} pl-7 py-2`} />
                      </div>
                      {rankPrizes.length > 1 && (
                        <button type="button" onClick={() => removeRankPrize(i)} className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Domain / Special prizes */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Label>Domain / Special Category Winners</Label>
                    <p className="text-[11px] text-gray-400 -mt-1">e.g. Best AI Project, Best UI/UX, Best Sustainability Hack</p>
                  </div>
                  <button type="button" onClick={addDomainPrize}
                    className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors cursor-pointer shrink-0 ml-2">
                    <Plus size={13} /> Add Domain
                  </button>
                </div>
                {domainPrizes.length === 0 && (
                  <button type="button" onClick={addDomainPrize}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-400 hover:border-violet-200 hover:text-violet-500 hover:bg-violet-50/30 transition-all cursor-pointer">
                    + Add a domain winner prize (e.g. Best AI, Best UI/UX…)
                  </button>
                )}
                <div className="space-y-2">
                  {domainPrizes.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input placeholder="Category name (e.g. Best AI)" value={d.name} onChange={e => updateDomain(i, 'name', e.target.value)}
                        className={`${inputCls} py-2 flex-1`} />
                      <div className="relative w-32 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">₹</span>
                        <input type="number" placeholder="Amount" value={d.amount} onChange={e => updateDomain(i, 'amount', e.target.value)}
                          className={`${inputCls} pl-7 py-2`} />
                      </div>
                      <button type="button" onClick={() => removeDomainPrize(i)} className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ── WHATSAPP ── */}
            <Card icon={MessageCircle} color="text-emerald-600 bg-emerald-50" title="Community Link" sub="Optional WhatsApp or Discord group for participants">
              <Field label="WhatsApp Group Link">
                <input className={inputCls} placeholder="https://chat.whatsapp.com/..." value={basic.whatsappLink} onChange={bSet('whatsappLink')} />
              </Field>
            </Card>

            {/* ── SUBMIT ── */}
            <div className="flex flex-col sm:flex-row gap-3 pb-10">
              <button type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors">
                <Save size={15} /> Save Draft
              </button>
              <button type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <Check size={15} /> Submit for Admin Approval
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}