import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Settings, ChevronRight, ChevronLeft, Users, Star, Award,
  Search, Download, Copy, Mail, Trash2, Eye, BarChart2, ClipboardList,
  ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import OrganizerSidebar from '../../components/OrganizerSidebar';

/* ─── MOCK DATA ─── */
const HACKATHONS = [
  { id:'1', title:'HackFlow Spring Invitational', status:'Active',    deadline:'2026-03-20', prize:'1,50,000', regCount:8,  subCount:4  },
  { id:'2', title:'AI Build Challenge',           status:'Pending',   deadline:'2026-04-10', prize:'80,000',   regCount:0,  subCount:0  },
  { id:'3', title:'GreenTech Hack 2026',          status:'Completed', deadline:'2026-02-28', prize:'50,000',   regCount:30, subCount:14 },
];
const PHASES=[{label:'Registration Open',date:'Mar 1',status:'done'},{label:'Submissions Open',date:'Mar 10',status:'active'},{label:'Shortlist Announced',date:'Mar 22',status:'upcoming'},{label:'Event Day',date:'Mar 25',status:'upcoming'},{label:'Results Published',date:'Mar 27',status:'upcoming'}];
const TRACKS=[{id:'T1',title:'Climate & Sustainability',teams:2},{id:'T2',title:'Healthcare AI',teams:1},{id:'T3',title:'FinTech Innovation',teams:1}];
const ACTIVITY=[{id:1,actor:'Arjun Mehta',action:'joined team ByteForce',time:'2h ago'},{id:2,actor:'NullPointers',action:'submitted MedAI project',time:'4h ago'},{id:3,actor:'Sneha Kulkarni',action:'email verified',time:'5h ago'},{id:4,actor:'404Found',action:'registered for hackathon',time:'8h ago'},{id:5,actor:'Dev Patel',action:'updated team StackSmash profile',time:'1d ago'}];
const PARTICIPANTS=[{id:'P001',name:'Arjun Mehta',email:'arjun@bits.edu',college:'BITS Pilani',team:'ByteForce',status:'Verified',joined:'Mar 5'},{id:'P002',name:'Priya Sharma',email:'priya@iit.ac.in',college:'IIT Bombay',team:'ByteForce',status:'Verified',joined:'Mar 5'},{id:'P003',name:'Rohan Das',email:'rohan@vit.edu',college:'VIT Vellore',team:'NullPointers',status:'Verified',joined:'Mar 6'},{id:'P004',name:'Sneha Kulkarni',email:'sneha@mit.edu',college:'MIT Manipal',team:'NullPointers',status:'Pending',joined:'Mar 6'},{id:'P005',name:'Karan Singh',email:'karan@nit.ac.in',college:'NIT Trichy',team:'404Found',status:'Verified',joined:'Mar 7'},{id:'P006',name:'Anjali Nair',email:'anjali@iiit.ac.in',college:'IIIT Hyderabad',team:'404Found',status:'Verified',joined:'Mar 7'},{id:'P007',name:'Dev Patel',email:'dev@daiict.ac.in',college:'DAIICT',team:'StackSmash',status:'Verified',joined:'Mar 8'},{id:'P008',name:'Meera Iyer',email:'meera@psg.edu',college:'PSG Tech',team:'StackSmash',status:'Pending',joined:'Mar 8'}];
const TEAMS=[{id:'T001',name:'ByteForce',members:['Arjun Mehta','Priya Sharma'],college:'BITS / IIT B',submitted:true},{id:'T002',name:'NullPointers',members:['Rohan Das','Sneha Kulkarni'],college:'VIT / MIT',submitted:true},{id:'T003',name:'404Found',members:['Karan Singh','Anjali Nair'],college:'NIT / IIIT H',submitted:true},{id:'T004',name:'StackSmash',members:['Dev Patel','Meera Iyer'],college:'DAIICT / PSG',submitted:true}];
const SUBS_INIT=[{id:'S001',team:'ByteForce',title:'EcoTrack — Carbon Footprint Monitor',at:'Mar 10, 2:30 PM',score:91,sc:{innovation:95,technical:88,clarity:92,design:89},shortlisted:false},{id:'S002',team:'NullPointers',title:'MedAI — Diagnosis Assistant',at:'Mar 10, 4:15 PM',score:87,sc:{innovation:88,technical:90,clarity:82,design:86},shortlisted:false},{id:'S003',team:'404Found',title:'FinFlow — Smart Budget Planner',at:'Mar 11, 9:00 AM',score:78,sc:{innovation:75,technical:80,clarity:79,design:78},shortlisted:false},{id:'S004',team:'StackSmash',title:'RuralConnect — Last Mile Delivery',at:'Mar 11,11:45 AM',score:84,sc:{innovation:86,technical:82,clarity:85,design:83},shortlisted:false}];

/* ─── HELPERS ─── */
const sColor = s => s>=90?'#22c55e':s>=80?'#3b82f6':s>=70?'#f59e0b':'#ef4444';
const sBg    = s => s>=90?'rgba(34,197,94,.1)':s>=80?'rgba(59,130,246,.1)':s>=70?'rgba(245,158,11,.1)':'rgba(239,68,68,.1)';
const initials = n => n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const avBg = n => `hsl(${n.charCodeAt(0)*47%360},55%,55%)`;



/* ─── ATOMS ─── */
function AnimCount({ to }) {
  const [v,setV]=useState(0);
  useEffect(()=>{ if(!to)return; const step=Math.ceil(to/20); const iv=setInterval(()=>setV(c=>{const n=c+step;if(n>=to){clearInterval(iv);return to;}return n;}),40); return()=>clearInterval(iv); },[to]);
  return <>{v}</>;
}
function ScoreBar({ label, value }) {
  const [w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW(value),100);return()=>clearTimeout(t);},[value]);
  return <div className="mb-2"><div className="flex justify-between mb-1"><span className="text-[11px] text-gray-400">{label}</span><span className="text-[11px] font-bold" style={{color:sColor(value)}}>{value}</span></div><div className="h-1 rounded bg-gray-100"><div className="h-full rounded transition-all duration-700" style={{width:`${w}%`,background:sColor(value)}}/></div></div>;
}
function SBadge({ s }) {
  const map={Verified:'text-emerald-700 bg-emerald-50 ring-emerald-200',Pending:'text-amber-700 bg-amber-50 ring-amber-200',Active:'text-emerald-700 bg-emerald-50 ring-emerald-200',Completed:'text-gray-600 bg-gray-100 ring-gray-200'};
  return <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ring-1 ${map[s]||'text-gray-500 bg-gray-100 ring-gray-200'}`}>{s}</span>;
}
function Toast({ t }) {
  if(!t)return null;
  return <div className="fixed bottom-6 right-6 z-[9999] bg-dark text-white px-4 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2" style={{animation:'toastIn .3s ease'}}><CheckCircle2 size={15} className="text-emerald-400 shrink-0"/>{t.msg}</div>;
}

/* ─── TABS CONFIG ─── */
const TABS=[{key:'overview',label:'Overview',icon:LayoutDashboard},{key:'participants',label:'Participants',icon:Users},{key:'teams',label:'Teams',icon:Award},{key:'submissions',label:'Submissions',icon:FileText},{key:'shortlist',label:'Shortlist',icon:Star},{key:'settings',label:'Settings',icon:Settings}];

function TabBar({ active, set, slCount }) {
  return (
    <div className="flex border-b border-gray-100 overflow-x-auto">
      {TABS.map(({key,label,icon:Icon})=>{
        const on=active===key;
        return <button key={key} onClick={()=>set(key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all cursor-pointer ${on?'border-royal text-royal':'border-transparent text-gray-500 hover:text-gray-800'}`}><Icon size={14}/>{label}{key==='shortlist'&&slCount>0&&<span className="w-5 h-5 rounded-full bg-royal text-white text-[10px] font-bold flex items-center justify-center">{slCount}</span>}</button>;
      })}
    </div>
  );
}

/* ─── HACKATHON PICKER ─── */
function HackPicker({ onSelect }) {
  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-royal flex items-center justify-center mx-auto mb-4"><ClipboardList size={22} className="text-white"/></div>
          <h1 className="text-2xl font-extrabold text-dark">Manage Hackathons</h1>
          <p className="text-sm text-gray-400 mt-1">Select a hackathon to open its control panel</p>
        </div>
        <div className="space-y-3">
          {HACKATHONS.map(h=>(
            <button key={h.id} onClick={()=>onSelect(h)} className="w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_rgba(30,100,255,0.1)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-4 text-left cursor-pointer">
              <div>
                <div className="flex items-center gap-2 mb-2"><span className="text-sm font-bold text-dark">{h.title}</span><SBadge s={h.status}/></div>
                <div className="flex gap-4 text-xs text-gray-400"><span>Deadline: {h.deadline}</span><span>Prize: Rs.{h.prize}</span><span>{h.regCount} registered</span></div>
              </div>
              <ChevronRight size={18} className="text-royal shrink-0"/>
            </button>
          ))}
        </div>
        <div className="text-center mt-5"><Link to="/organizer/create" className="text-sm text-royal font-semibold hover:underline">+ Create New Hackathon</Link></div>
      </div>
    </div>
  );
}

/* ─── HEADER CARD ─── */
function HackHeader({ hack, onBack, showToast }) {
  return (
    <div className="rounded-2xl overflow-hidden mb-6" style={{background:'linear-gradient(135deg,#0A1628,#1E3A6E)'}}>
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2"><button onClick={onBack} className="text-white/40 hover:text-white cursor-pointer"><ChevronLeft size={16}/></button><SBadge s={hack.status}/></div>
            <h1 className="text-xl font-extrabold text-white mb-1">{hack.title}</h1>
            <div className="flex gap-5 text-xs text-white/50"><span>Deadline: {hack.deadline}</span><span>Prize: Rs.{hack.prize}</span><span>{hack.regCount} registered</span></div>
          </div>
          <button onClick={()=>showToast('Registration link copied')} className="px-3 py-1.5 text-xs font-semibold text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5"><Copy size={12}/> Copy Link</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-5">
          {[['Registrations',hack.regCount,10,'#3b82f6'],['Submissions',hack.subCount,8,'#22c55e']].map(([l,v,mx,c])=>(
            <div key={l}><div className="flex justify-between text-xs text-white/40 mb-1"><span>{l}</span><span>{v}/{mx}</span></div><div className="h-1.5 rounded bg-white/10"><div className="h-full rounded transition-all duration-700" style={{width:`${(v/mx)*100}%`,background:c}}/></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── STATS ROW ─── */
function StatsRow({ hack, subs, setTab }) {
  const slCount=subs.filter(s=>s.shortlisted).length;
  const cards=[
    {icon:Users,    label:'Participants', value:hack.regCount,    sub:'registered',      color:'text-royal bg-royal/8',        tab:'participants'},
    {icon:Award,    label:'Teams',        value:TEAMS.length,     sub:'teams',           color:'text-violet-600 bg-violet-50', tab:'teams'},
    {icon:FileText, label:'Submissions',  value:subs.length,      sub:'received',        color:'text-amber-600 bg-amber-50',   tab:'submissions'},
    {icon:Star,     label:'Shortlisted',  value:slCount,          sub:`of ${subs.length}`,color:'text-emerald-600 bg-emerald-50',tab:'shortlist'},
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({icon:Icon,label,value,sub,color,tab})=>(
        <div key={label} onClick={()=>setTab(tab)} className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_4px_20px_rgba(30,100,255,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={17}/></div>
          <p className="text-2xl font-extrabold text-dark"><AnimCount to={value}/></p>
          <p className="text-xs text-gray-400 mt-1">{label} · {sub}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── OVERVIEW TAB ─── */
function OverviewTab({ showToast }) {
  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <h3 className="text-sm font-bold text-dark mb-4">Hackathon Phases</h3>
          {PHASES.map((p,i)=>(
            <div key={p.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${p.status==='done'?'bg-emerald-500':p.status==='active'?'bg-royal ring-4 ring-royal/20':'bg-gray-200'}`}>
                  {p.status==='done'?<CheckCircle2 size={12} className="text-white"/>:p.status==='active'?<span className="w-2 h-2 rounded-full bg-white"/>:<span className="w-1.5 h-1.5 rounded-full bg-gray-400"/>}
                </div>
                {i<PHASES.length-1&&<div className={`w-px mt-1 mb-1 ${p.status==='done'?'bg-emerald-300':'bg-gray-100'}`} style={{minHeight:'20px'}}/>}
              </div>
              <div className="pb-4"><p className={`text-sm font-semibold ${p.status==='active'?'text-royal':p.status==='done'?'text-emerald-600':'text-gray-400'}`}>{p.label}</p><p className="text-xs text-gray-400">{p.date}</p></div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-dark mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[[Mail,'Send Announcement',()=>showToast('Email composer opened')],[Download,'Export CSV',()=>showToast('CSV downloaded')],[Copy,'Copy Reg. Link',()=>showToast('Link copied')],[BarChart2,'Download Report',()=>showToast('Report generated')]].map(([Icon,label,fn])=>(
                <button key={label} onClick={fn} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-xs font-semibold text-gray-700 hover:border-royal/30 hover:bg-royal/5 hover:text-royal transition-all cursor-pointer text-left"><Icon size={13} className="shrink-0"/>{label}</button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-bold text-dark mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {ACTIVITY.map(a=>(
                <div key={a.id} className="flex gap-2.5"><div className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0" style={{background:avBg(a.actor)}}>{initials(a.actor)}</div><div><p className="text-xs text-gray-700"><b>{a.actor}</b> {a.action}</p><p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p></div></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h3 className="text-sm font-bold text-dark mb-3">Problem Tracks</h3>
        <div className="divide-y divide-gray-100">
          {TRACKS.map(t=><div key={t.id} className="flex justify-between items-center py-2.5"><span className="text-sm text-gray-700">{t.title}</span><span className="text-xs font-semibold text-royal bg-royal/5 px-2.5 py-0.5 rounded-full">{t.teams} teams</span></div>)}
        </div>
      </div>
    </div>
  );
}

/* ─── PARTICIPANTS TAB ─── */
function ParticipantsTab({ showToast }) {
  const [search,setSearch]=useState('');
  const [filter,setFilter]=useState('');
  const [selected,setSelected]=useState([]);
  const [drawer,setDrawer]=useState(null);
  const [page,setPage]=useState(0);
  const PER=5;
  const filtered=PARTICIPANTS.filter(r=>(!search||[r.name,r.email,r.college].some(v=>v.toLowerCase().includes(search.toLowerCase())))&&(!filter||r.status===filter));
  const paged=filtered.slice(page*PER,page*PER+PER);
  const pages=Math.max(1,Math.ceil(filtered.length/PER));
  const toggleSel=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  return (
    <div>
      {drawer&&<div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={()=>setDrawer(null)}><div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto" onClick={e=>e.stopPropagation()}><button onClick={()=>setDrawer(null)} className="absolute top-4 right-4 text-gray-400 hover:text-dark cursor-pointer text-lg leading-none">x</button><div className="text-center mb-5 pt-4"><div className="w-14 h-14 rounded-full text-white text-xl font-bold flex items-center justify-center mx-auto mb-3" style={{background:avBg(drawer.name)}}>{initials(drawer.name)}</div><p className="text-base font-bold text-dark">{drawer.name}</p><p className="text-xs text-gray-400">{drawer.id}</p></div>{[['Email',drawer.email],['College',drawer.college],['Team',drawer.team],['Status',drawer.status],['Joined',drawer.joined]].map(([k,v])=><div key={k} className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{k}</span><span className="text-sm text-dark">{v}</span></div>)}</div></div>}
      {selected.length>0&&<div className="bg-royal text-white px-4 py-2.5 rounded-xl mb-3 flex items-center gap-3 text-sm font-semibold"><span>{selected.length} selected</span><button onClick={()=>{showToast('Emails sent');setSelected([]);}} className="px-3 py-1 rounded-lg border border-white/30 bg-white/10 text-xs cursor-pointer flex items-center gap-1"><Mail size={11}/>Email</button><button onClick={()=>{showToast('CSV exported');setSelected([]);}} className="px-3 py-1 rounded-lg border border-white/30 bg-white/10 text-xs cursor-pointer flex items-center gap-1"><Download size={11}/>Export</button><button onClick={()=>setSelected([])} className="ml-auto text-white/60 hover:text-white cursor-pointer text-xs">Clear</button></div>}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-[200px] relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, college..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/25 focus:border-royal"/></div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal/25 cursor-pointer"><option value=''>All Status</option><option value='Verified'>Verified</option><option value='Pending'>Pending</option></select>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full border-collapse">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="p-3 text-left"><input type="checkbox" className="accent-royal" checked={selected.length===paged.length&&paged.length>0} onChange={()=>setSelected(s=>s.length===paged.length?[]:paged.map(r=>r.id))}/></th>{['Name','Email','College','Team','Status','Joined',''].map(h=><th key={h} className="px-3 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>{paged.map(r=><tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors"><td className="p-3"><input type="checkbox" className="accent-royal" checked={selected.includes(r.id)} onChange={()=>toggleSel(r.id)} onClick={e=>e.stopPropagation()}/></td><td className="px-3 py-3 cursor-pointer" onClick={()=>setDrawer(r)}><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0" style={{background:avBg(r.name)}}>{initials(r.name)}</div><span className="text-sm font-semibold text-dark">{r.name}</span></div></td><td className="px-3 py-3 text-xs text-gray-500">{r.email}</td><td className="px-3 py-3 text-xs text-gray-500">{r.college}</td><td className="px-3 py-3"><span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{r.team}</span></td><td className="px-3 py-3"><SBadge s={r.status}/></td><td className="px-3 py-3 text-xs text-gray-400">{r.joined}</td><td className="px-3 py-3"><button onClick={()=>setDrawer(r)} className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:border-royal hover:text-royal transition-colors cursor-pointer"><Eye size={12}/></button></td></tr>)}</tbody>
        </table></div>
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100"><span className="text-xs text-gray-400">{filtered.length} participants</span><div className="flex gap-1.5 items-center"><button disabled={page===0} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:border-royal hover:text-royal transition-colors cursor-pointer">Prev</button><span className="text-xs text-gray-500">{page+1}/{pages}</span><button disabled={page>=pages-1} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:border-royal hover:text-royal transition-colors cursor-pointer">Next</button></div></div>
      </div>
    </div>
  );
}

/* ─── TEAMS TAB ─── */
function TeamsTab({ subs }) {
  const [view,setView]=useState('grid');
  const [filter,setFilter]=useState('all');
  const filtered=TEAMS.filter(t=>filter==='all'?true:filter==='submitted'?t.submitted:!t.submitted);
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-2">{[['all','All'],['submitted','Submitted'],['pending','Not Submitted']].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${filter===v?'bg-royal text-white border-royal':'border-gray-200 text-gray-600 hover:border-royal/40'}`}>{l}</button>)}</div>
        <div className="flex gap-1.5">{[['grid',LayoutDashboard],['list',ClipboardList]].map(([v,Icon])=><button key={v} onClick={()=>setView(v)} className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${view===v?'bg-royal text-white border-royal':'border-gray-200 text-gray-400'}`}><Icon size={13}/></button>)}</div>
      </div>
      {view==='grid'?(
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((t,i)=>{
            const sub=subs.find(s=>s.team===t.name);
            return <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(30,100,255,0.08)] hover:-translate-y-0.5 transition-all duration-200"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{background:`hsl(${i*70+200},55%,55%)`}}>{t.name[0]}</div><SBadge s={t.submitted?'Active':'Pending'}/></div><p className="font-bold text-dark text-sm mb-1">{t.name}</p><p className="text-xs text-gray-400 mb-3">{t.college}</p><div className="space-y-1 mb-3">{t.members.map(m=><div key={m} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-royal"/><span className="text-xs text-gray-600">{m}</span></div>)}</div>{sub&&<div className="pt-3 border-t border-gray-100 flex justify-between items-center"><span className="text-xs text-gray-400">AI Score</span><span className="text-sm font-bold" style={{color:sColor(sub.score)}}>{sub.score}/100</span></div>}</div>;
          })}
        </div>
      ):(
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
          <table className="w-full border-collapse">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">{['Team','Members','College','Submission','Score'].map(h=><th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide">{h}</th>)}</tr></thead>
            <tbody>{filtered.map(t=>{const sub=subs.find(s=>s.team===t.name);return <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors"><td className="px-4 py-3 text-sm font-semibold text-dark">{t.name}</td><td className="px-4 py-3 text-xs text-gray-500">{t.members.join(', ')}</td><td className="px-4 py-3 text-xs text-gray-500">{t.college}</td><td className="px-4 py-3"><SBadge s={t.submitted?'Active':'Pending'}/></td><td className="px-4 py-3 text-sm font-bold" style={{color:sub?sColor(sub.score):'#94a3b8'}}>{sub?sub.score:'—'}</td></tr>;})}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── SUBMISSIONS TAB ─── */
function SubmissionsTab({ subs, setSubs, showToast }) {
  const [exp,setExp]=useState(null);
  const [notes,setNotes]=useState({});
  const [sortBy,setSortBy]=useState('score');
  const [threshold,setThreshold]=useState(85);
  const sorted=[...subs].sort((a,b)=>sortBy==='score'?b.score-a.score:a.team.localeCompare(b.team));
  const toggleSl=id=>{const s=subs.find(x=>x.id===id);setSubs(p=>p.map(x=>x.id===id?{...x,shortlisted:!x.shortlisted}:x));showToast(s.shortlisted?`${s.team} removed`:`${s.team} shortlisted`);};
  const autoShortlist=()=>{
    const eligible=subs.filter(s=>s.score>=threshold&&!s.shortlisted);
    if(!eligible.length){showToast('No new teams above threshold');return;}
    setSubs(p=>p.map(s=>s.score>=threshold?{...s,shortlisted:true}:s));
    showToast(`${eligible.length} team${eligible.length>1?'s':''} auto-shortlisted (score >= ${threshold})`);
  };
  return (
    <div>
      {/* Auto Shortlist Banner */}
      <div className="flex items-center justify-between bg-royal/5 border border-royal/15 rounded-xl px-4 py-3 mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center shrink-0"><Star size={15} className="text-white"/></div>
          <div>
            <p className="text-sm font-bold text-dark">Auto Shortlist by AI Score</p>
            <p className="text-xs text-gray-400">Shortlist all teams scoring at or above threshold</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Threshold:</span>
            <input type="range" min={50} max={100} step={5} value={threshold} onChange={e=>setThreshold(Number(e.target.value))} className="w-24 accent-royal cursor-pointer"/>
            <span className="text-sm font-bold text-royal w-8 text-center">{threshold}</span>
          </div>
          <button onClick={autoShortlist} className="px-4 py-2 text-xs font-bold text-white bg-royal rounded-lg hover:bg-royal-light transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm shadow-royal/20 whitespace-nowrap">
            <Star size={12}/> Auto Shortlist ({subs.filter(s=>s.score>=threshold).length} teams)
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <span className="text-sm text-gray-500">{subs.length} submissions</span>
        <div className="flex gap-2 items-center"><span className="text-xs text-gray-400">Sort:</span>{[['score','AI Score'],['team','Team']].map(([v,l])=><button key={v} onClick={()=>setSortBy(v)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${sortBy===v?'bg-royal text-white border-royal':'border-gray-200 text-gray-600'}`}>{l}</button>)}</div>
      </div>
      <div className="space-y-3">
        {sorted.map((s,i)=>(
          <div key={s.id} className={`bg-white rounded-2xl border shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden transition-all ${s.shortlisted?'border-emerald-200':'border-gray-100'}`}>
            <div className="p-5 cursor-pointer" onClick={()=>setExp(exp===s.id?null:s.id)}>
              <div className="flex items-center gap-3 flex-wrap">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold shrink-0 ${i===0?'bg-amber-400 text-white':i===1?'bg-gray-300 text-white':i===2?'bg-orange-400 text-white':'bg-gray-100 text-gray-500'}`}>#{i+1}</div>
                <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap mb-0.5"><span className="font-bold text-dark text-sm">{s.title}</span>{s.shortlisted&&<span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-200">Shortlisted</span>}</div><p className="text-xs text-gray-400">{s.team} · {s.at}</p></div>
                <div className="px-3 py-1.5 rounded-xl shrink-0" style={{background:sBg(s.score)}}><span className="text-xl font-extrabold" style={{color:sColor(s.score)}}>{s.score}</span><span className="text-xs text-gray-400 ml-1">/ 100</span></div>
                <div className="flex gap-2 shrink-0" onClick={e=>e.stopPropagation()}><button className="px-3 py-1.5 text-xs font-semibold border border-gray-200 text-gray-600 rounded-lg hover:border-royal hover:text-royal transition-colors cursor-pointer flex items-center gap-1"><FileText size={11}/>PPT</button><button onClick={()=>toggleSl(s.id)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${s.shortlisted?'text-emerald-700 bg-emerald-50 border border-emerald-200':'text-white bg-royal border border-royal hover:bg-royal-light'}`}><Star size={11}/>{s.shortlisted?'Listed':'Shortlist'}</button></div>
                <ChevronRight size={13} className={`text-gray-300 transition-transform shrink-0 ${exp===s.id?'rotate-90':''}`}/>
              </div>
            </div>
            {exp===s.id&&<div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/30"><div className="grid grid-cols-2 gap-x-8 mb-4"><ScoreBar label="Innovation (40%)" value={s.sc.innovation}/><ScoreBar label="Technical (30%)" value={s.sc.technical}/><ScoreBar label="Clarity (20%)" value={s.sc.clarity}/><ScoreBar label="Design (10%)" value={s.sc.design}/></div><div><label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Organizer Note</label><textarea rows={2} value={notes[s.id]||''} onChange={e=>setNotes(n=>({...n,[s.id]:e.target.value}))} className="w-full px-3 py-2 text-sm bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none" placeholder="Add a note…"/></div></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SHORTLIST TAB ─── */
function ShortlistTab({ subs, setSubs, showToast }) {
  const sl=subs.filter(s=>s.shortlisted).sort((a,b)=>b.score-a.score);
  const rm=id=>{setSubs(p=>p.map(s=>s.id===id?{...s,shortlisted:false}:s));showToast('Removed from shortlist');};
  if(!sl.length)return <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-[0_1px_4px_rgba(0,0,0,0.04)]"><div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4"><Star size={22} className="text-gray-300"/></div><h3 className="text-base font-bold text-dark mb-1">No teams shortlisted</h3><p className="text-sm text-gray-400">Go to Submissions to shortlist teams.</p></div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3"><div><h2 className="text-base font-bold text-dark">{sl.length} team{sl.length!==1?'s':''} shortlisted</h2><p className="text-xs text-gray-400">Send confirmation emails to notify teams</p></div><button onClick={()=>showToast('Confirmation emails sent')} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer flex items-center gap-2"><Mail size={13}/>Send Confirmations</button></div>
      <div className="space-y-3">{sl.map((s,i)=><div key={s.id} className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex items-center gap-4 flex-wrap"><div className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0" style={{background:sBg(s.score),color:sColor(s.score)}}>#{i+1}</div><div className="flex-1 min-w-0"><p className="font-bold text-dark text-sm">{s.title}</p><p className="text-xs text-gray-400">{s.team}</p></div><span className="text-lg font-extrabold shrink-0" style={{color:sColor(s.score)}}>{s.score}</span><button onClick={()=>rm(s.id)} className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"><Trash2 size={11}/>Remove</button></div>)}</div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"><h3 className="text-sm font-bold text-dark mb-2">Publish Results</h3><p className="text-xs text-gray-400 mb-4">This will make results visible on the public hackathon page.</p><button onClick={()=>showToast('Results published!')} className="px-5 py-2.5 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-colors shadow-md cursor-pointer">Publish Results</button></div>
    </div>
  );
}

/* ─── SETTINGS TAB ─── */
function SettingsTab({ hack, showToast }) {
  const [regOpen,setRegOpen]=useState(true);
  const [subsOpen,setSubsOpen]=useState(true);
  const [delInput,setDelInput]=useState('');
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <h3 className="text-sm font-bold text-dark mb-4">Event Controls</h3>
        <div className="space-y-4">
          {[['Accept New Registrations',regOpen,setRegOpen],['Submissions Open',subsOpen,setSubsOpen]].map(([label,val,setVal])=>(
            <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"><div><p className="text-sm font-semibold text-dark">{label}</p><p className="text-xs text-gray-400 mt-0.5">{val?'Enabled':'Disabled'}</p></div><button onClick={()=>{setVal(v=>!v);showToast(label+' '+(val?'disabled':'enabled'));}} className="cursor-pointer">{val?<ToggleRight size={28} className="text-royal"/>:<ToggleLeft size={28} className="text-gray-300"/>}</button>
          </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-3"><AlertTriangle size={15} className="text-red-500"/><h3 className="text-sm font-bold text-red-600">Danger Zone</h3></div>
        <p className="text-xs text-gray-400 mb-3">Type the hackathon title to confirm permanent deletion.</p>
        <input value={delInput} onChange={e=>setDelInput(e.target.value)} placeholder={hack.title} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 bg-gray-50"/>
        <button disabled={delInput!==hack.title} onClick={()=>showToast('Hackathon deleted')} className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"><Trash2 size={13}/>Delete Hackathon</button>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function ManageHackathon() {
  const [sbOpen,setSbOpen]=useState(true);
  const [hack,setHack]=useState(null);
  const [tab,setTab]=useState('overview');
  const [subs,setSubs]=useState(SUBS_INIT);
  const [toast,setToast]=useState(null);
  const showToast=msg=>{setToast({msg});setTimeout(()=>setToast(null),2800);};
  const slCount=subs.filter(s=>s.shortlisted).length;

  if(!hack)return(
    <div className="min-h-screen bg-[#F5F7FB] font-sans">
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <OrganizerSidebar open={sbOpen} onToggle={()=>setSbOpen(s=>!s)}/>
      <div className={`transition-all duration-300 ${sbOpen?'lg:pl-60':'lg:pl-16'}`}>
        <div className="sticky top-0 z-20 h-[60px] bg-white/90 backdrop-blur border-b border-gray-100 flex items-center px-6"><h1 className="text-sm font-bold text-dark">Manage Hackathons</h1></div>
        <HackPicker onSelect={h=>{setHack(h);setTab('overview');}}/>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] font-sans">
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
      <OrganizerSidebar open={sbOpen} onToggle={()=>setSbOpen(s=>!s)}/>
      <Toast t={toast}/>
      <div className={`transition-all duration-300 ${sbOpen?'lg:pl-60':'lg:pl-16'}`}>
        <div className="sticky top-0 z-20 h-[60px] bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm"><Link to="/organizer-dashboard" className="text-gray-400 hover:text-royal transition-colors">Dashboard</Link><ChevronRight size={13} className="text-gray-300"/><span className="text-gray-400 cursor-pointer hover:text-royal" onClick={()=>setHack(null)}>Manage</span><ChevronRight size={13} className="text-gray-300"/><span className="font-semibold text-dark truncate max-w-[200px]">{hack.title}</span></div>
        </div>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <HackHeader hack={hack} onBack={()=>setHack(null)} showToast={showToast}/>
          <StatsRow hack={hack} subs={subs} setTab={setTab}/>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <TabBar active={tab} set={setTab} slCount={slCount}/>
            <div className="p-6">
              {tab==='overview'     && <OverviewTab showToast={showToast}/>}
              {tab==='participants' && <ParticipantsTab showToast={showToast}/>}
              {tab==='teams'        && <TeamsTab subs={subs}/>}
              {tab==='submissions'  && <SubmissionsTab subs={subs} setSubs={setSubs} showToast={showToast}/>}
              {tab==='shortlist'    && <ShortlistTab subs={subs} setSubs={setSubs} showToast={showToast}/>}
              {tab==='settings'     && <SettingsTab hack={hack} showToast={showToast}/>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}