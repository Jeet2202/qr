import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, CheckCircle2, AlertTriangle, Download, X } from 'lucide-react';
import OrganizerSidebar from '../../components/OrganizerSidebar';

/* ═══ MOCK DATA ═══ */
const MOCK_PARTICIPANTS=[
  {id:"P001",name:"Arjun Mehta",   team:"ByteForce",   workspace:"WS-01",entry:true, entryTime:"9:42 AM",lunch:true, lunchTime:"1:02 PM",dinner:false,dinnerTime:null},
  {id:"P002",name:"Priya Sharma",  team:"ByteForce",   workspace:"WS-01",entry:true, entryTime:"9:44 AM",lunch:true, lunchTime:"1:05 PM",dinner:false,dinnerTime:null},
  {id:"P003",name:"Rohan Das",     team:"NullPointers",workspace:"WS-02",entry:true, entryTime:"9:51 AM",lunch:false,lunchTime:null,     dinner:false,dinnerTime:null},
  {id:"P004",name:"Sneha Kulkarni",team:"NullPointers",workspace:"WS-02",entry:false,entryTime:null,     lunch:false,lunchTime:null,     dinner:false,dinnerTime:null},
  {id:"P005",name:"Karan Singh",   team:"404Found",    workspace:"WS-03",entry:false,entryTime:null,     lunch:false,lunchTime:null,     dinner:false,dinnerTime:null},
  {id:"P006",name:"Anjali Nair",   team:"404Found",    workspace:"WS-03",entry:false,entryTime:null,     lunch:false,lunchTime:null,     dinner:false,dinnerTime:null},
  {id:"P007",name:"Dev Patel",     team:"StackSmash",  workspace:"WS-04",entry:false,entryTime:null,     lunch:false,lunchTime:null,     dinner:false,dinnerTime:null},
  {id:"P008",name:"Meera Iyer",    team:"StackSmash",  workspace:"WS-04",entry:false,entryTime:null,     lunch:false,lunchTime:null,     dinner:false,dinnerTime:null},
];
const MOCK_WORKSPACES_INIT=[
  {id:"WS-01",label:"Table A1",zone:"Zone A",capacity:4,assignedTeam:"ByteForce",   status:"occupied" },
  {id:"WS-02",label:"Table A2",zone:"Zone A",capacity:4,assignedTeam:"NullPointers",status:"occupied" },
  {id:"WS-03",label:"Table A3",zone:"Zone A",capacity:4,assignedTeam:"404Found",    status:"occupied" },
  {id:"WS-04",label:"Table A4",zone:"Zone A",capacity:4,assignedTeam:"StackSmash",  status:"occupied" },
  {id:"WS-05",label:"Table B1",zone:"Zone B",capacity:4,assignedTeam:null,          status:"available"},
  {id:"WS-06",label:"Table B2",zone:"Zone B",capacity:4,assignedTeam:null,          status:"available"},
  {id:"WS-07",label:"Table B3",zone:"Zone B",capacity:4,assignedTeam:null,          status:"available"},
  {id:"WS-08",label:"Table B4",zone:"Zone B",capacity:4,assignedTeam:null,          status:"available"},
  {id:"WS-09",label:"Table C1",zone:"Zone C",capacity:4,assignedTeam:null,          status:"reserved" },
  {id:"WS-10",label:"Table C2",zone:"Zone C",capacity:4,assignedTeam:null,          status:"reserved" },
  {id:"WS-11",label:"Table C3",zone:"Zone C",capacity:4,assignedTeam:null,          status:"available"},
  {id:"WS-12",label:"Table C4",zone:"Zone C",capacity:4,assignedTeam:null,          status:"available"},
];
const MOCK_HELP_INIT=[
  {id:"H001",name:"Dev Patel", workspace:"Table C3",message:"Need extension cord",   time:"2 min ago"},
  {id:"H002",name:"Meera Iyer",workspace:"Table C4",message:"Laptop charger missing",time:"5 min ago"},
];
const TIMELINE_INIT=[
  {id:1,time:"09:00 AM",label:"Registration & Check-In Opens",status:"done"    },
  {id:2,time:"10:00 AM",label:"Hacking Begins",                status:"active"  },
  {id:3,time:"01:00 PM",label:"Lunch Distribution",            status:"upcoming"},
  {id:4,time:"04:00 PM",label:"Submission Deadline",           status:"upcoming"},
  {id:5,time:"05:00 PM",label:"Judging Panel Begins",          status:"upcoming"},
  {id:6,time:"07:00 PM",label:"Dinner Distribution",           status:"upcoming"},
  {id:7,time:"08:00 PM",label:"Results & Prize Distribution",  status:"upcoming"},
];
const ALL_TEAMS=["ByteForce","NullPointers","404Found","StackSmash","FreeTeam1","FreeTeam2"];
const PHASES=["Check-In","Hacking","Lunch","Judging","Dinner","Results"];

/* ═══ HELPERS ═══ */
const initials=n=>n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const avBg=n=>`hsl(${n.charCodeAt(0)*47%360},55%,55%)`;
const fmt=d=>`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
const nowTime=()=>{const d=new Date();return `${d.getHours()%12||12}:${String(d.getMinutes()).padStart(2,'0')} ${d.getHours()>=12?'PM':'AM'}`;};



/* ═══ ATOMS ═══ */
function AnimCount({ to }) {
  const [v,setV]=useState(0);
  useEffect(()=>{if(!to)return;const step=Math.ceil(to/20);const iv=setInterval(()=>setV(c=>{const n=c+step;if(n>=to){clearInterval(iv);return to;}return n;}),40);return()=>clearInterval(iv);},[to]);
  return <>{v}</>;
}
function Toast({ t }) {
  if(!t)return null;
  return <div className="fixed bottom-6 right-6 z-[9999] bg-dark text-white px-4 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2" style={{animation:'toastIn .3s ease',zIndex:9998}}><CheckCircle2 size={15} className="text-emerald-400 shrink-0"/>{t.msg}</div>;
}
function FeedCard({ f }) {
  if(!f)return null;
  const map={success:{border:'#22c55e',bg:'rgba(34,197,94,0.06)'},warning:{border:'#f59e0b',bg:'rgba(245,158,11,0.06)'},error:{border:'#ef4444',bg:'rgba(239,68,68,0.06)'}};
  const s=map[f.type]||map.success;
  return <div style={{borderLeft:`3px solid ${s.border}`,background:s.bg,borderRadius:'10px',padding:'10px 14px',marginTop:'10px',animation:'slideDown .25s ease'}}><p style={{fontSize:'13px',fontWeight:700,color:'#0f172a'}}>{f.title}</p>{f.sub&&<p style={{fontSize:'12px',color:'#64748b',marginTop:'2px'}}>{f.sub}</p>}</div>;
}

/* ═══ STATS BAR ═══ */
function StatCard({ label, value, total, color }) {
  const [w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW(total?(value/total)*100:0),150);return()=>clearTimeout(t);},[value,total]);
  return (
    <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #f1f5f9',boxShadow:'0 1px 3px rgba(0,0,0,0.04)',padding:'18px 20px',flex:'1 1 140px',minWidth:'130px',transition:'all .2s'}}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 4px 20px rgba(30,100,255,0.08)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)';}}>
      <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`${color}18`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'12px'}}>
        <div style={{width:'12px',height:'12px',borderRadius:'3px',background:color}}/>
      </div>
      <div style={{fontSize:'26px',fontWeight:800,color:'#0f172a',lineHeight:1}}><AnimCount to={value}/><span style={{fontSize:'13px',fontWeight:400,color:'#94a3b8',marginLeft:'4px'}}>/ {total}</span></div>
      <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'4px',marginBottom:'10px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px'}}>{label}</div>
      <div style={{height:'4px',borderRadius:'4px',background:'#f1f5f9'}}><div style={{height:'100%',borderRadius:'4px',width:`${w}%`,background:color,transition:'width 1s ease'}}/></div>
    </div>
  );
}

/* ═══ EVENT HEADER ═══ */
function EventHeader({ hackId, onTime }) {
  const activePhase=1;
  return (
    <div style={{borderRadius:'20px',overflow:'hidden',marginBottom:'24px',background:'linear-gradient(135deg,#0A1628,#1E3A6E)',position:'relative'}}>
      <div style={{position:'absolute',top:'-60px',right:'-60px',width:'200px',height:'200px',borderRadius:'50%',background:'rgba(77,142,255,0.06)'}}/>
      <div style={{position:'absolute',bottom:'-40px',left:'10%',width:'120px',height:'120px',borderRadius:'50%',background:'rgba(255,255,255,0.03)'}}/>
      <div style={{padding:'28px 32px',position:'relative'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'16px',marginBottom:'20px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#22c55e',animation:'pulse 1.5s infinite'}}/>
              <span style={{fontSize:'10px',fontWeight:800,color:'#22c55e',letterSpacing:'1.5px',textTransform:'uppercase'}}>Active</span>
              <span style={{fontSize:'11px',color:'rgba(255,255,255,0.25)'}}>ID: {hackId}</span>
            </div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(18px,3vw,26px)',fontWeight:800,color:'#fff',marginBottom:'8px'}}>HackFlow Spring Invitational</h1>
            <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
              {[['Date','Mar 20, 2026'],['Venue','BITS Pilani Auditorium'],['Registered','8 participants']].map(([k,v])=>(
                <div key={k} style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',display:'flex',gap:'4px'}}><span style={{color:'rgba(255,255,255,0.3)'}}>{k}:</span>{v}</div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button style={{padding:'8px 16px',borderRadius:'10px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.8)',fontSize:'12px',fontWeight:700,cursor:'pointer',transition:'all .2s'}} className="btn-hover">Edit</button>
            <button style={{padding:'8px 16px',borderRadius:'10px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.8)',fontSize:'12px',fontWeight:700,cursor:'pointer',transition:'all .2s'}} className="btn-hover">View Public Page</button>
            <button style={{padding:'8px 16px',borderRadius:'10px',background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'rgb(252,165,165)',fontSize:'12px',fontWeight:700,cursor:'pointer',transition:'all .2s'}} className="btn-hover">End Event</button>
          </div>
        </div>
        {/* Phase stepper */}
        <div style={{display:'flex',alignItems:'center',overflowX:'auto',paddingBottom:'4px'}}>
          {PHASES.map((p,i)=>{
            const done=i<activePhase,act=i===activePhase;
            return (
              <div key={p} style={{display:'flex',alignItems:'center',flexShrink:0}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'5px'}}>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',background:done?'#22c55e':act?'#1E64FF':'rgba(255,255,255,0.2)',animation:act?'pulse 1.5s infinite':undefined,boxShadow:act?'0 0 0 4px rgba(30,100,255,0.25)':undefined}}/>
                  <span style={{fontSize:'10px',fontWeight:700,color:done?'#22c55e':act?'#4D8EFF':'rgba(255,255,255,0.3)',whiteSpace:'nowrap',padding:'3px 8px',borderRadius:'20px',background:done?'rgba(34,197,94,0.1)':act?'rgba(30,100,255,0.2)':'rgba(255,255,255,0.04)',border:act?'1px solid rgba(30,100,255,0.4)':'1px solid transparent'}}>{p}</span>
                </div>
                {i<PHASES.length-1&&<div style={{width:'20px',height:'1px',background:'rgba(255,255,255,0.1)',margin:'0 2px',marginBottom:'18px'}}/>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══ WORKSPACE PANEL ═══ */
function WorkspacePanel({ workspaces, setWorkspaces, showToast }) {
  const [zone,setZone]=useState('All');
  const [assigning,setAssigning]=useState(null);
  const [selTeam,setSelTeam]=useState('');
  const filtered=workspaces.filter(w=>zone==='All'||w.zone===zone);
  const avail=workspaces.filter(w=>w.status==='available').length;
  const occ=workspaces.filter(w=>w.status==='occupied').length;
  const res=workspaces.filter(w=>w.status==='reserved').length;
  const unassignedTeams=ALL_TEAMS.filter(t=>!workspaces.find(w=>w.assignedTeam===t));

  const assign=(wsId)=>{
    if(!selTeam)return;
    setWorkspaces(p=>p.map(w=>w.id===wsId?{...w,assignedTeam:selTeam,status:'occupied'}:w));
    showToast(`${selTeam} assigned to ${wsId}`);
    setAssigning(null);setSelTeam('');
  };
  const release=(wsId,team)=>{
    setWorkspaces(p=>p.map(w=>w.id===wsId?{...w,assignedTeam:null,status:'available'}:w));
    showToast(`${team} released`);
  };

  return (
    <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #f1f5f9',boxShadow:'0 1px 3px rgba(0,0,0,0.04)',overflow:'hidden'}}>
      <div style={{padding:'16px 20px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:'15px',fontWeight:700,color:'#0f172a'}}>Workspace Assignment</div>
          <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'2px'}}>Assign tables to teams</div>
        </div>
        <div style={{display:'flex',gap:'12px',fontSize:'11px',fontWeight:600}}>
          {[['Available',avail,'#22c55e'],['Occupied',occ,'#1E64FF'],['Reserved',res,'#f59e0b']].map(([l,n,c])=>(
            <span key={l} style={{display:'flex',alignItems:'center',gap:'5px',color:'#64748b'}}><span style={{width:'6px',height:'6px',borderRadius:'50%',background:c,display:'inline-block'}}/>{l}: <b style={{color:'#0f172a'}}>{n}</b></span>
          ))}
        </div>
      </div>
      {/* Zone tabs */}
      <div style={{display:'flex',borderBottom:'1px solid #f1f5f9',padding:'0 12px'}}>
        {['All','Zone A','Zone B','Zone C'].map(z=>(
          <button key={z} onClick={()=>setZone(z)} style={{padding:'10px 14px',fontSize:'12px',fontWeight:zone===z?700:500,color:zone===z?'#1E64FF':'#94a3b8',background:'transparent',border:'none',cursor:'pointer',borderBottom:zone===z?'2px solid #1E64FF':'2px solid transparent',transition:'all .15s',whiteSpace:'nowrap'}}>{z}</button>
        ))}
      </div>
      {/* Grid */}
      <div style={{padding:'16px',maxHeight:'360px',overflowY:'auto',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:'10px'}}>
        {filtered.map(ws=>{
          const occ=ws.status==='occupied';
          const res=ws.status==='reserved';
          const clr=occ?'#1E64FF':res?'#f59e0b':'#22c55e';
          const bg=occ?'rgba(30,100,255,0.04)':res?'rgba(245,158,11,0.04)':'#fff';
          const br=occ?'rgba(30,100,255,0.15)':res?'rgba(245,158,11,0.2)':'#f1f5f9';
          return (
            <div key={ws.id} className="ws-card" style={{background:bg,border:`1px solid ${br}`,borderRadius:'12px',padding:'12px',transition:'all .2s',cursor:'default'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
                <span style={{fontSize:'12px',fontWeight:700,color:'#0f172a'}}>{ws.label}</span>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:clr,flexShrink:0,marginTop:'2px'}}/>
              </div>
              <div style={{fontSize:'10px',color:'#94a3b8',marginBottom:'8px'}}>{ws.zone} · Cap {ws.capacity}</div>
              {occ&&<div style={{fontSize:'11px',fontWeight:700,background:'rgba(30,100,255,0.08)',color:'#1E64FF',borderRadius:'6px',padding:'3px 7px',marginBottom:'8px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ws.assignedTeam}</div>}
              {res&&<div style={{fontSize:'11px',fontWeight:600,color:'#f59e0b',marginBottom:'8px'}}>Reserved</div>}
              {ws.status==='available'&&assigning===ws.id?(
                <div>
                  <select value={selTeam} onChange={e=>setSelTeam(e.target.value)} style={{width:'100%',padding:'4px 6px',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'11px',marginBottom:'6px',background:'#f8fafc'}}>
                    <option value=''>Pick team</option>
                    {unassignedTeams.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                  <div style={{display:'flex',gap:'4px'}}>
                    <button onClick={()=>assign(ws.id)} style={{flex:1,padding:'4px',borderRadius:'6px',background:'#1E64FF',color:'#fff',border:'none',fontSize:'10px',fontWeight:700,cursor:'pointer'}}>Assign</button>
                    <button onClick={()=>setAssigning(null)} style={{padding:'4px 6px',borderRadius:'6px',background:'#f1f5f9',color:'#64748b',border:'none',fontSize:'10px',cursor:'pointer'}}>x</button>
                  </div>
                </div>
              ):ws.status==='available'?(
                <button onClick={()=>setAssigning(ws.id)} style={{width:'100%',padding:'5px',borderRadius:'6px',border:'1px dashed #e2e8f0',background:'transparent',color:'#94a3b8',fontSize:'11px',fontWeight:600,cursor:'pointer'}}>+ Assign</button>
              ):occ?(
                <div style={{display:'flex',gap:'3px'}}>
                  <button onClick={()=>release(ws.id,ws.assignedTeam)} style={{flex:1,padding:'4px',borderRadius:'6px',background:'rgba(239,68,68,0.08)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.15)',fontSize:'10px',fontWeight:700,cursor:'pointer'}}>Release</button>
                </div>
              ):null}
            </div>
          );
        })}
      </div>
      <div style={{padding:'10px 20px',borderTop:'1px solid #f1f5f9',background:'#fafafa',display:'flex',gap:'20px',fontSize:'12px',color:'#64748b'}}>
        {[['Available',avail,'#22c55e'],['Occupied',occ,'#1E64FF'],['Reserved',res,'#f59e0b']].map(([l,n,c])=>(
          <span key={l} style={{display:'flex',alignItems:'center',gap:'5px'}}><span style={{width:'6px',height:'6px',borderRadius:'50%',background:c,display:'inline-block'}}/>{l}: <b>{n}</b></span>
        ))}
      </div>
    </div>
  );
}

/* ═══ ENTRY MONITOR ═══ */
function EntryMonitor({ participants, setParticipants, showToast }) {
  const [scan,setScan]=useState('');
  const [fb,setFb]=useState(null);
  const [checkIns,setCheckIns]=useState(participants.filter(p=>p.entry));
  const inputRef=useRef();
  const total=participants.length;
  const checkedIn=participants.filter(p=>p.entry).length;

  const doCheckIn=()=>{
    if(!scan.trim()){setFb({type:'error',title:'No ID entered',sub:'Enter a participant ID or name'});return;}
    const p=participants.find(x=>x.id.toLowerCase()===scan.toLowerCase()||x.name.toLowerCase().includes(scan.toLowerCase()));
    if(!p){setFb({type:'error',title:'Not found',sub:`No participant matching "${scan}"`});setScan('');return;}
    if(p.entry){setFb({type:'warning',title:'Already checked in',sub:`${p.name} checked in at ${p.entryTime}`});setScan('');return;}
    const t=nowTime();
    setParticipants(prev=>prev.map(x=>x.id===p.id?{...x,entry:true,entryTime:t}:x));
    setCheckIns(prev=>[{...p,entry:true,entryTime:t},...prev]);
    setFb({type:'success',title:`${p.name} checked in`,sub:`${p.team} · ${t}`});
    setScan('');showToast(`${p.name} checked in`);
  };
  useEffect(()=>{if(fb){const t=setTimeout(()=>setFb(null),2500);return()=>clearTimeout(t);}},[fb]);

  return (
    <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #f1f5f9',boxShadow:'0 1px 3px rgba(0,0,0,0.04)',overflow:'hidden'}}>
      <div style={{padding:'16px 20px',borderBottom:'1px solid #f1f5f9'}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:'15px',fontWeight:700,color:'#0f172a',marginBottom:'4px'}}>Entry Monitor</div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
          <div style={{fontSize:'12px',color:'#64748b'}}>{checkedIn} / {total} checked in</div>
          <div style={{flex:1,height:'6px',borderRadius:'4px',background:'#f1f5f9'}}>
            <div style={{height:'100%',borderRadius:'4px',background:'#1E64FF',width:`${total?(checkedIn/total)*100:0}%`,transition:'width .8s ease'}}/>
          </div>
          <span style={{fontSize:'12px',fontWeight:700,color:'#1E64FF'}}>{total?Math.round((checkedIn/total)*100):0}%</span>
        </div>
      </div>
      {/* Scanner */}
      <div style={{padding:'16px 20px'}}>
        <div onClick={()=>inputRef.current?.focus()} style={{border:'2px dashed #e2e8f0',borderRadius:'14px',background:'#fafbff',padding:'20px',textAlign:'center',cursor:'text',position:'relative',overflow:'hidden',marginBottom:'12px',minHeight:'80px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'absolute',left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#1E64FF,transparent)',animation:'scanLine 2s linear infinite'}}/>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:'13px',fontWeight:700,color:'#334155',zIndex:1}}>QR Entry Scanner</div>
          <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'3px',zIndex:1}}>Click to focus · Enter ID below</div>
        </div>
        <div style={{display:'flex',gap:'8px',marginBottom:'0'}}>
          <input ref={inputRef} value={scan} onChange={e=>setScan(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doCheckIn()} placeholder="Participant ID or name..." style={{flex:1,padding:'9px 14px',border:'1.5px solid #e2e8f0',borderRadius:'10px',fontSize:'13px',outline:'none',background:'#f8fafc'}} onFocus={e=>e.target.style.borderColor='#1E64FF'} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
          <button onClick={doCheckIn} style={{padding:'9px 18px',borderRadius:'10px',background:'linear-gradient(135deg,#1E64FF,#4D8EFF)',color:'#fff',fontWeight:700,fontSize:'13px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>Check In</button>
        </div>
        <FeedCard f={fb}/>
        {/* Recent feed */}
        <div style={{marginTop:'14px'}}>
          <div style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',color:'#94a3b8',marginBottom:'8px'}}>Recent Check-ins</div>
          <div style={{maxHeight:'200px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'6px'}}>
            {checkIns.length===0?<div style={{textAlign:'center',fontSize:'12px',color:'#94a3b8',padding:'20px 0'}}>No check-ins yet</div>:
            checkIns.map(p=>(
              <div key={p.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'10px',background:'#f8fafc',animation:'slideDown .3s ease'}}>
                <div style={{width:'30px',height:'30px',borderRadius:'50%',background:avBg(p.name),color:'#fff',fontSize:'11px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{initials(p.name)}</div>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:'13px',fontWeight:600,color:'#0f172a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div><div style={{fontSize:'11px',color:'#94a3b8'}}>{p.team}</div></div>
                <div style={{fontSize:'11px',fontWeight:600,color:'#22c55e',flexShrink:0}}>{p.entryTime}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ MEAL PANEL ═══ */
function MealPanel({ type, participants, setParticipants, showToast }) {
  const [input,setInput]=useState('');
  const [fb,setFb]=useState(null);
  const isLunch=type==='lunch';
  const accentColor=isLunch?'#f59e0b':'#22c55e';
  const served=participants.filter(p=>p[type]).length;
  const total=participants.filter(p=>p.entry).length;

  const markServed=()=>{
    if(!input.trim()){setFb({type:'error',title:'No ID entered'});return;}
    const p=participants.find(x=>x.id.toLowerCase()===input.toLowerCase()||x.name.toLowerCase().includes(input.toLowerCase()));
    if(!p){setFb({type:'error',title:'Not found',sub:`No participant matching "${input}"`});setInput('');return;}
    if(!p.entry){setFb({type:'warning',title:'Not checked in',sub:`${p.name} has not entered yet`});setInput('');return;}
    if(p[type]){setFb({type:'warning',title:'Already served',sub:`${p.name} already received ${isLunch?'lunch':'dinner'}`});setInput('');return;}
    const t=nowTime();
    setParticipants(prev=>prev.map(x=>x.id===p.id?{...x,[type]:true,[`${type}Time`]:t}:x));
    setFb({type:'success',title:`${p.name} served`,sub:`${isLunch?'Lunch':'Dinner'} at ${t}`});
    setInput('');showToast(`${p.name} marked as ${isLunch?'lunch':'dinner'} served`);
  };
  useEffect(()=>{if(fb){const t=setTimeout(()=>setFb(null),2500);return()=>clearTimeout(t);}},[fb]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:'14px',fontWeight:700,color:'#0f172a'}}>{isLunch?'Lunch':'Dinner'} Distribution</div>
        <span style={{padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:700,color:accentColor,background:`${accentColor}18`}}>{served} / {total} served</span>
      </div>
      <div style={{height:'5px',borderRadius:'4px',background:'#f1f5f9',marginBottom:'14px'}}>
        <div style={{height:'100%',borderRadius:'4px',background:accentColor,width:`${total?(served/total)*100:0}%`,transition:'width .8s ease'}}/>
      </div>
      {!isLunch&&<div style={{borderLeft:`3px solid #1E64FF`,background:'rgba(30,100,255,0.04)',borderRadius:'10px',padding:'10px 14px',marginBottom:'12px'}}><div style={{fontSize:'13px',fontWeight:700,color:'#0f172a'}}>Dinner service opens at 7:00 PM</div><div style={{fontSize:'12px',color:'#64748b',marginTop:'2px'}}>Can still mark served in advance for testing</div></div>}
      <div style={{display:'flex',gap:'8px'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&markServed()} placeholder="Participant ID or name..." style={{flex:1,padding:'8px 12px',border:'1.5px solid #e2e8f0',borderRadius:'10px',fontSize:'13px',outline:'none',background:'#f8fafc'}} onFocus={e=>e.target.style.borderColor=accentColor} onBlur={e=>e.target.style.borderColor='#e2e8f0'}/>
        <button onClick={markServed} style={{padding:'8px 14px',borderRadius:'10px',background:accentColor,color:'#fff',fontWeight:700,fontSize:'12px',border:'none',cursor:'pointer',whiteSpace:'nowrap'}}>Mark Served</button>
      </div>
      <FeedCard f={fb}/>
    </div>
  );
}

/* ═══ TIMELINE SECTION ═══ */
function TimelineSection({ timeline, setTimeline, showToast }) {
  const [open,setOpen]=useState(true);
  const markStarted=id=>{
    setTimeline(p=>p.map(t=>{
      if(t.id===id){return {...t,status:'active'};}
      if(t.status==='active'){return {...t,status:'done'};}
      return t;
    }));
    showToast('Phase marked as started');
  };
  return (
    <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #f1f5f9',boxShadow:'0 1px 3px rgba(0,0,0,0.04)',overflow:'hidden'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'transparent',border:'none',cursor:'pointer',borderBottom:open?'1px solid #f1f5f9':'none'}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:'15px',fontWeight:700,color:'#0f172a'}}>Event Timeline</div>
        <ChevronRight size={16} style={{color:'#94a3b8',transform:open?'rotate(90deg)':'rotate(0deg)',transition:'transform .2s'}}/>
      </button>
      {open&&<div style={{padding:'20px 24px',position:'relative'}}>
        <div style={{position:'absolute',left:'31px',top:'20px',bottom:'20px',width:'2px',background:'#f1f5f9',zIndex:0}}/>
        {timeline.map((t,i)=>{
          const done=t.status==='done',act=t.status==='active';
          return (
            <div key={t.id} style={{display:'flex',gap:'16px',marginBottom:i<timeline.length-1?'20px':'0',position:'relative',zIndex:1}}>
              <div style={{width:'24px',height:'24px',borderRadius:'50%',background:done?'#22c55e':act?'#1E64FF':'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,animation:act?'pulse 2s infinite':undefined,boxShadow:act?'0 0 0 4px rgba(30,100,255,0.15)':undefined}}>
                {done?<CheckCircle2 size={13} style={{color:'#fff'}}/>:act?<div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#fff'}}/>:<div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#cbd5e1'}}/>}
              </div>
              <div style={{flex:1,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px',paddingTop:'2px'}}>
                <div>
                  <div style={{fontSize:'13px',fontWeight:done||act?700:500,color:done?'#22c55e':act?'#1E64FF':'#94a3b8'}}>{t.label}</div>
                  <div style={{fontSize:'11px',color:'#94a3b8'}}>{t.time}</div>
                </div>
                {t.status==='upcoming'&&(
                  <button onClick={()=>markStarted(t.id)} style={{padding:'4px 12px',borderRadius:'20px',background:'#f1f5f9',color:'#64748b',border:'1px solid #e2e8f0',fontSize:'11px',fontWeight:600,cursor:'pointer',whiteSpace:'nowrap'}}>Mark Started</button>
                )}
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}

/* ═══ HELP REQUESTS ═══ */
function HelpButton({ requests, setRequests, showToast }) {
  const [open,setOpen]=useState(false);
  const count=requests.length;
  const resolve=id=>{setRequests(p=>p.filter(r=>r.id!==id));showToast('Request resolved');};
  return (
    <div style={{position:'fixed',bottom:'24px',right:'24px',zIndex:199}}>
      {open&&(
        <div style={{position:'absolute',bottom:'56px',right:0,width:'340px',background:'#fff',borderRadius:'16px',boxShadow:'0 8px 32px rgba(0,0,0,0.15)',border:'1px solid #f1f5f9',animation:'slideUp .3s ease',overflow:'hidden'}}>
          <div style={{padding:'14px 18px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:'14px',fontWeight:700,color:'#0f172a'}}>Help Requests {count>0&&<span style={{marginLeft:'6px',background:'rgba(239,68,68,0.1)',color:'#ef4444',borderRadius:'20px',padding:'1px 8px',fontSize:'11px',fontWeight:800}}>{count}</span>}</div>
            <button onClick={()=>setOpen(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#94a3b8'}}><X size={15}/></button>
          </div>
          <div style={{maxHeight:'300px',overflowY:'auto'}}>
            {requests.length===0?(
              <div style={{textAlign:'center',padding:'32px',color:'#94a3b8',fontSize:'13px'}}>No pending requests</div>
            ):requests.map(r=>(
              <div key={r.id} style={{padding:'14px 18px',borderBottom:'1px solid #f8fafc',display:'flex',gap:'12px',alignItems:'flex-start'}}>
                <div style={{width:'30px',height:'30px',borderRadius:'50%',background:avBg(r.name),color:'#fff',fontSize:'11px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{initials(r.name)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0f172a'}}>{r.name} <span style={{fontSize:'11px',fontWeight:400,color:'#94a3b8'}}>· {r.workspace}</span></div>
                  <div style={{fontSize:'12px',color:'#64748b',marginTop:'2px'}}>"{r.message}"</div>
                  <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'2px'}}>{r.time}</div>
                </div>
                <button onClick={()=>resolve(r.id)} style={{padding:'5px 10px',borderRadius:'8px',background:'rgba(34,197,94,0.1)',color:'#16a34a',border:'1px solid rgba(34,197,94,0.2)',fontSize:'11px',fontWeight:700,cursor:'pointer',flexShrink:0}}>Resolve</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} style={{padding:'10px 16px',borderRadius:'12px',background:count>0?'linear-gradient(135deg,#ef4444,#f87171)':'#0f172a',color:'#fff',fontWeight:700,fontSize:'13px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',boxShadow:count>0?'0 4px 20px rgba(239,68,68,0.35)':'0 4px 16px rgba(0,0,0,0.2)'}}>
        <AlertTriangle size={14}/>
        Help Requests {count>0&&<span style={{background:'rgba(255,255,255,0.2)',borderRadius:'20px',padding:'1px 7px',fontSize:'11px',fontWeight:800}}>{count}</span>}
      </button>
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function EventManagement() {
  const { id: hackathonId } = useParams();
  const [sbOpen, setSbOpen] = useState(true);
  const [participants,setParticipants]=useState(MOCK_PARTICIPANTS);
  const [workspaces,setWorkspaces]=useState(MOCK_WORKSPACES_INIT);
  const [timeline,setTimeline]=useState(TIMELINE_INIT);
  const [helpRequests,setHelpRequests]=useState(MOCK_HELP_INIT);
  const [mealFilter,setMealFilter]=useState('all');
  const [toast,setToast]=useState(null);
  const [clock,setClock]=useState(new Date());

  const showToast=msg=>{setToast({msg});setTimeout(()=>setToast(null),3000);};
  useEffect(()=>{const iv=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(iv);},[]);

  const checkedIn=participants.filter(p=>p.entry).length;
  const lunchServed=participants.filter(p=>p.lunch).length;
  const dinnerServed=participants.filter(p=>p.dinner).length;
  const wsOcc=workspaces.filter(w=>w.status==='occupied').length;

  const mealRows=participants.filter(p=>{
    if(mealFilter==='checked')return p.entry;
    if(mealFilter==='lunch-pending')return p.entry&&!p.lunch;
    if(mealFilter==='dinner-pending')return p.entry&&!p.dinner;
    return true;
  });

  return (
    <div style={{minHeight:'100vh',background:'#F5F7FB',fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;}
        @keyframes scanLine{0%{top:0%}100%{top:100%}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.2)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        .hover-row:hover{background:#f8fafc!important;}
        .ws-card:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(30,100,255,0.1)!important;}
        .btn-hover:hover{opacity:0.88;transform:translateY(-1px);}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px;}
      `}</style>

      <OrganizerSidebar open={sbOpen} onToggle={() => setSbOpen(s => !s)} />
      <Toast t={toast}/>
      <HelpButton requests={helpRequests} setRequests={setHelpRequests} showToast={showToast}/>

      <div style={{transition:'padding-left .3s', paddingLeft: sbOpen ? '240px' : '64px'}}>

        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'24px 20px',paddingBottom:'80px'}}>
          <EventHeader hackId={hackathonId||'HF-001'}/>

          {/* Stats */}
          <div style={{display:'flex',gap:'14px',flexWrap:'wrap',marginBottom:'24px'}}>
            <StatCard label="Checked In"      value={checkedIn}   total={participants.length} color="#1E64FF"/>
            <StatCard label="Workspaces Used" value={wsOcc}       total={workspaces.length}   color="#8b5cf6"/>
            <StatCard label="Lunches Served"  value={lunchServed} total={participants.filter(p=>p.entry).length} color="#f59e0b"/>
            <StatCard label="Dinners Served"  value={dinnerServed} total={participants.filter(p=>p.entry).length} color="#22c55e"/>
          </div>

          {/* 2-col grid */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(380px,1fr))',gap:'20px',marginBottom:'20px'}}>
            <WorkspacePanel workspaces={workspaces} setWorkspaces={setWorkspaces} showToast={showToast}/>
            <EntryMonitor participants={participants} setParticipants={setParticipants} showToast={showToast}/>
          </div>

          {/* Meal Distribution */}
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #f1f5f9',boxShadow:'0 1px 3px rgba(0,0,0,0.04)',padding:'20px 24px',marginBottom:'20px'}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:'15px',fontWeight:700,color:'#0f172a',marginBottom:'16px'}}>Meal Distribution</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'24px',marginBottom:'20px'}}>
              <MealPanel type="lunch"  participants={participants} setParticipants={setParticipants} showToast={showToast}/>
              <MealPanel type="dinner" participants={participants} setParticipants={setParticipants} showToast={showToast}/>
            </div>
            {/* Meal summary table */}
            <div style={{borderTop:'1px solid #f1f5f9',paddingTop:'16px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px',marginBottom:'14px'}}>
                <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                  {[['all','All'],['checked','Checked In'],['lunch-pending','Lunch Pending'],['dinner-pending','Dinner Pending']].map(([v,l])=>(
                    <button key={v} onClick={()=>setMealFilter(v)} style={{padding:'5px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:600,cursor:'pointer',border:'none',background:mealFilter===v?'#0f172a':'#f1f5f9',color:mealFilter===v?'#fff':'#64748b',transition:'all .15s'}}>{l}</button>
                  ))}
                </div>
                <button onClick={()=>showToast('Report exported')} style={{padding:'7px 14px',borderRadius:'10px',background:'linear-gradient(135deg,#1E64FF,#4D8EFF)',color:'#fff',fontWeight:700,fontSize:'12px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}><Download size={12}/>Export</button>
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr style={{borderBottom:'1px solid #f1f5f9',background:'#fafbff'}}>{['Participant','Team','Entry','Lunch','Dinner'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',fontSize:'11px',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.7px'}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {mealRows.map(p=>(
                      <tr key={p.id} className="hover-row" style={{borderBottom:'1px solid #f8fafc',transition:'background .15s'}}>
                        <td style={{padding:'10px 12px'}}><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'26px',height:'26px',borderRadius:'50%',background:avBg(p.name),color:'#fff',fontSize:'10px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{initials(p.name)}</div><span style={{fontSize:'13px',fontWeight:600,color:'#0f172a'}}>{p.name}</span></div></td>
                        <td style={{padding:'10px 12px',fontSize:'12px',color:'#64748b'}}>{p.team}</td>
                        <td style={{padding:'10px 12px'}}>{p.entry?<span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',color:'#22c55e'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#22c55e'}}/>{p.entryTime}</span>:<span style={{color:'#cbd5e1',fontSize:'12px'}}>—</span>}</td>
                        <td style={{padding:'10px 12px'}}>{p.lunch?<span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',color:'#f59e0b'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#f59e0b'}}/>{p.lunchTime}</span>:<span style={{color:'#cbd5e1',fontSize:'12px'}}>—</span>}</td>
                        <td style={{padding:'10px 12px'}}>{p.dinner?<span style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'12px',color:'#22c55e'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#22c55e'}}/>{p.dinnerTime}</span>:<span style={{color:'#cbd5e1',fontSize:'12px'}}>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <TimelineSection timeline={timeline} setTimeline={setTimeline} showToast={showToast}/>
        </div>
      </div>
    </div>
  );
}