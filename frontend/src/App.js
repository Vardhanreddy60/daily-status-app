import { useState, useEffect, useCallback } from "react";
import { api } from "./api";

const STATUS_OPTIONS = [
  { id: "gym",    icon: "🏋️", label: "Gym",    color: "#E07B54" },
  { id: "office", icon: "💼", label: "Office", color: "#5B8DEF" },
  { id: "sleep",  icon: "😴", label: "Sleep",  color: "#9B6EE8" },
];
const MOODS       = ["😤","😐","🙂","😄","🔥"];
const MOOD_LABELS = ["Rough","Meh","Okay","Good","Amazing"];
const MOOD_COLORS = ["#E05454","#888","#E0B354","#54C47A","#E07B54"];

const S = {
  label: { color:"#555", fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:12, display:"block" },
  card:  { background:"#1C1C26", border:"1px solid rgba(255,255,255,0.06)", borderRadius:18, padding:"16px 18px", marginBottom:14 },
};

const todayISO  = () => new Date().toISOString().slice(0,10);
const fmtDate   = (iso) => new Date(iso).toLocaleDateString("en-US",{ weekday:"short", month:"short", day:"numeric" });

export default function App() {
  const [tab,      setTab]      = useState("log");
  const [logs,     setLogs]     = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [selected, setSelected] = useState([]);
  const [mood,     setMood]     = useState(null);
  const [sleepH,   setSleepH]   = useState(7);
  const [note,     setNote]     = useState("");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [toast,    setToast]    = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try { setLogs(await api.getLogs()); }
    catch (e) { showToast(e.message, "error"); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const toggle = (id) => setSelected(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const canSave = mood !== null || selected.length > 0;

  function showToast(msg, type="success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const entry = await api.createLog({ date:todayISO(), selected, mood, sleepH, note:note.trim() });
      setLogs(p => [entry, ...p]);
      setSaved(true);
      showToast("✓  Saved to MongoDB!");
      setTimeout(() => { setSaved(false); setSelected([]); setMood(null); setSleepH(7); setNote(""); setTab("history"); }, 1200);
    } catch(e) { showToast(e.message,"error"); }
    finally   { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.deleteLog(id); setLogs(p => p.filter(l=>l._id!==id)); showToast("Entry deleted"); }
    catch(e) { showToast(e.message,"error"); }
  };

  const today = new Date().toLocaleDateString("en-US",{ weekday:"long", month:"long", day:"numeric" });

  return (
    <div style={{ minHeight:"100vh", background:"#0A0A0F", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"32px 16px", fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,serif" }}>
      <div style={{ width:370, background:"#12121A", borderRadius:46, overflow:"hidden", boxShadow:"0 60px 140px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.07)", position:"relative" }}>

        {/* Status bar */}
        <div style={{ padding:"14px 28px 0", display:"flex", justifyContent:"space-between", color:"#3A3A4A", fontSize:12 }}>
          <span>9:41</span>
          <span style={{ color:"#2A5A2A", fontSize:10 }}>● MongoDB</span>
        </div>

        {/* Header */}
        <div style={{ padding:"22px 28px 0" }}>
          <div style={{ color:"#484858", fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>{today}</div>
          <div style={{ color:"#F0EDE6", fontSize:24, fontWeight:"bold", lineHeight:1.25 }}>
            {tab==="log" ? <>How was your <span style={{ color:"#C9A96E" }}>day?</span></> : <>Your <span style={{ color:"#C9A96E" }}>Log</span></>}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", margin:"20px 24px 0", background:"#1A1A24", borderRadius:14, padding:4, gap:4 }}>
          {[["log","✍️  Log Today"],["history","📅  History"]].map(([t,label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:"10px 0", borderRadius:11, border:"none", cursor:"pointer", background:tab===t?"#C9A96E":"transparent", color:tab===t?"#0A0A0F":"#555", fontSize:13, fontWeight:tab===t?"bold":"normal", transition:"all 0.2s" }}>{label}</button>
          ))}
        </div>

        {/* ── LOG TAB ── */}
        {tab==="log" && (
          <div style={{ padding:"24px 22px 36px" }}>

            <span style={S.label}>What did you do?</span>
            <div style={{ display:"flex", gap:10, marginBottom:24 }}>
              {STATUS_OPTIONS.map(opt => {
                const active = selected.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => toggle(opt.id)} style={{ flex:1, background:active?`${opt.color}15`:"#1C1C26", border:`1.5px solid ${active?opt.color:"rgba(255,255,255,0.07)"}`, borderRadius:20, padding:"16px 6px 14px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:7, transition:"all 0.2s", boxShadow:active?`0 0 18px ${opt.color}25`:"none" }}>
                    <span style={{ fontSize:26 }}>{opt.icon}</span>
                    <span style={{ color:active?opt.color:"#555", fontSize:12, fontWeight:active?"bold":"normal" }}>{opt.label}</span>
                    {active && <div style={{ width:5, height:5, borderRadius:"50%", background:opt.color }} />}
                  </button>
                );
              })}
            </div>

            <span style={S.label}>Sleep hours</span>
            <div style={{ ...S.card, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <button onClick={() => setSleepH(h=>Math.max(0,+(h-0.5).toFixed(1)))} style={{ width:36,height:36,borderRadius:10,background:"#13131C",border:"1px solid #2A2A3A",color:"#F0EDE6",fontSize:20,cursor:"pointer" }}>−</button>
              <div style={{ textAlign:"center" }}>
                <div style={{ color:"#C9A96E", fontSize:36, fontWeight:"bold", lineHeight:1 }}>{sleepH}</div>
                <div style={{ color:"#555", fontSize:11, marginTop:3 }}>hours</div>
              </div>
              <button onClick={() => setSleepH(h=>Math.min(12,+(h+0.5).toFixed(1)))} style={{ width:36,height:36,borderRadius:10,background:"#13131C",border:"1px solid #2A2A3A",color:"#F0EDE6",fontSize:20,cursor:"pointer" }}>+</button>
            </div>

            <span style={S.label}>Overall mood</span>
            <div style={{ ...S.card, marginBottom:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                {MOODS.map((m,i) => (
                  <button key={i} onClick={() => setMood(i)} style={{ background:mood===i?`${MOOD_COLORS[i]}18`:"transparent", border:`1.5px solid ${mood===i?MOOD_COLORS[i]:"transparent"}`, borderRadius:13, width:46, height:54, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, transition:"all 0.2s" }}>
                    <span style={{ fontSize:22 }}>{m}</span>
                    {mood===i && <span style={{ color:MOOD_COLORS[i], fontSize:8, letterSpacing:0.5 }}>{MOOD_LABELS[i]}</span>}
                  </button>
                ))}
              </div>
            </div>

            <span style={S.label}>Quick note <span style={{ color:"#2E2E3E" }}>— optional</span></span>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Anything on your mind…" rows={3} style={{ width:"100%", boxSizing:"border-box", background:"#1C1C26", border:"1px solid rgba(255,255,255,0.06)", borderRadius:16, padding:"13px 15px", color:"#F0EDE6", fontSize:14, resize:"none", outline:"none", fontFamily:"inherit", lineHeight:1.6, marginBottom:22 }} />

            <button onClick={handleSave} disabled={!canSave||saving} style={{ width:"100%", padding:"15px", borderRadius:18, border:"none", background:saved?"#3A7D44":canSave?"linear-gradient(135deg,#C9A96E 0%,#A8793C 100%)":"#1C1C26", color:saved?"#fff":canSave?"#0A0A0F":"#333", fontSize:15, fontWeight:"bold", cursor:canSave&&!saving?"pointer":"default", letterSpacing:0.5, transition:"all 0.3s", boxShadow:canSave?"0 8px 28px rgba(201,169,110,0.25)":"none", opacity:saving?0.7:1 }}>
              {saving ? "Saving to MongoDB…" : saved ? "✓  Saved!" : "Save today's status"}
            </button>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab==="history" && (
          <div style={{ padding:"24px 22px 36px", maxHeight:580, overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
              <button onClick={fetchLogs} disabled={loading} style={{ background:"#1C1C26", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, padding:"6px 14px", color:"#C9A96E", fontSize:12, cursor:"pointer", opacity:loading?0.5:1 }}>
                {loading?"Loading…":"↻ Refresh"}
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign:"center", color:"#444", fontSize:14, marginTop:40 }}>Fetching from MongoDB…</div>
            ) : logs.length===0 ? (
              <div style={{ textAlign:"center", color:"#444", fontSize:15, marginTop:40, lineHeight:2 }}>
                No logs yet.<br />
                <span style={{ color:"#C9A96E", cursor:"pointer" }} onClick={() => setTab("log")}>Log today →</span>
              </div>
            ) : logs.map(log => (
              <div key={log._id} style={{ background:"#1C1C26", border:"1px solid rgba(255,255,255,0.06)", borderRadius:20, padding:"16px 18px", marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ color:"#555", fontSize:12 }}>{fmtDate(log.date)}</div>
                  <button onClick={() => handleDelete(log._id)} style={{ background:"none", border:"none", color:"#444", cursor:"pointer", fontSize:20, padding:0, lineHeight:1 }}>×</button>
                </div>
                {log.selected?.length>0 && (
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                    {log.selected.map(id => { const o=STATUS_OPTIONS.find(x=>x.id===id); return o ? <span key={id} style={{ background:`${o.color}18`, color:o.color, fontSize:12, padding:"4px 10px", borderRadius:8 }}>{o.icon} {o.label}</span> : null; })}
                  </div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:log.note?10:0 }}>
                  {log.mood!=null && <span style={{ fontSize:20 }}>{MOODS[log.mood]}</span>}
                  <span style={{ color:"#9B6EE8", fontSize:13 }}>😴 {log.sleepH}h sleep</span>
                  {log.mood!=null && <span style={{ color:MOOD_COLORS[log.mood], fontSize:12 }}>{MOOD_LABELS[log.mood]}</span>}
                </div>
                {log.note && <div style={{ color:"#888", fontSize:13, fontStyle:"italic", marginTop:8, lineHeight:1.5 }}>"{log.note}"</div>}
              </div>
            ))}
          </div>
        )}

        <div style={{ height:4, width:80, background:"#2A2A3A", borderRadius:2, margin:"0 auto 18px" }} />
      </div>

      {toast && (
        <div style={{ position:"fixed", bottom:40, left:"50%", transform:"translateX(-50%)", background:toast.type==="error"?"#8B2020":"#C9A96E", color:toast.type==="error"?"#fff":"#0A0A0F", fontSize:13, fontWeight:"bold", padding:"10px 22px", borderRadius:12, pointerEvents:"none", boxShadow:"0 8px 24px rgba(0,0,0,0.4)", zIndex:999, whiteSpace:"nowrap" }}>{toast.msg}</div>
      )}
    </div>
  );
}
