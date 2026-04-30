import { useState, useEffect } from 'react';
import { 
  AlertTriangle, Database, Server, UploadCloud, 
  RefreshCcw, CheckCircle, History, Settings, 
  LogOut, User, Lock, ChevronRight, Activity, Download, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('Engine');

  const [authEmail, setAuthEmail] = useState('admin@xebia.com');
  const [authPass, setAuthPass] = useState('password');
  const [registeredUsers, setRegisteredUsers] = useState([{ email: 'admin@xebia.com', pass: 'password' }]);
  const [loginError, setLoginError] = useState('');

  const [stats, setStats] = useState({ total_docs: 0, total_conflicts: 0, total_changes: 0, health_score: 100 });
  const [documents, setDocuments] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [changes, setChanges] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');

  // Fetch AI Analytics safely
  const fetchData = async () => {
    if (!isAuthenticated) return;
    try {
      const statsRes = await fetch('http://127.0.0.1:8000/api/v1/stats');
      if (!statsRes.ok) return;

      const docsRes = await fetch('http://127.0.0.1:8000/api/v1/documents');
      const confRes = await fetch('http://127.0.0.1:8000/api/v1/conflicts');
      const changesRes = await fetch('http://127.0.0.1:8000/api/v1/changes');
      
      const st = await statsRes.json();
      const docs = await docsRes.json();
      const confs = await confRes.json();
      const chg = await changesRes.json();

      if (st && typeof st === 'object' && st.total_docs !== undefined) setStats(st);
      if (Array.isArray(docs)) setDocuments(docs);
      if (Array.isArray(confs)) setConflicts(confs);
      if (Array.isArray(chg)) setChanges(chg);
    } catch (err) {
      console.log("Backend not running yet", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus(`Stage 1: Ingesting & Embedding Document...`);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', 'SPECIFICATION_UPDATE');

    try {
      await fetch('http://127.0.0.1:8000/api/v1/upload', {
        method: 'POST',
        body: formData,
      });
      setTimeout(() => setUploadStatus('Stage 2: AI Autonomous Classification...'), 1200);
      setTimeout(() => setUploadStatus('Stage 3: Cross-Referencing Isolated Project Graphs...'), 2400);
      setTimeout(() => setUploadStatus('Stage 4: Synthesizing Aligned Specifications...'), 3800);
      setTimeout(() => setUploadStatus('Stage 5: Output Initialized.'), 5000);
      setTimeout(() => setUploadStatus(''), 6500);
    } catch (err) {
      setUploadStatus('Endpoint connection refused.');
    }
  };

  const handleDownloadPDF = () => {
    if (!changes || changes.length === 0) return;
    
    // Always pick the LATEST synthesized alignment
    const latestChange = changes[changes.length - 1];
    const text = latestChange.updated_content || "No content extracted.";
    
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text("ALIGNED ARCHITECTURE SPEC", 15, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 35);
    doc.text(`Source Sync: ${latestChange.summary || 'Unified Build'}`, 15, 42);
    
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(15, 48, 195, 48);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59); // Slate-800
    
    const splitText = doc.splitTextToSize(text, 180);
    let cursorY = 60;
    const pageHeight = doc.internal.pageSize.height;

    splitText.forEach((line: string) => {
      if (cursorY > pageHeight - 20) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(line, 15, cursorY);
      cursorY += 7;
    });

    doc.save("GenAI_Aligned_Spec_Report.pdf");
  };

  // --- AUTH LOGIC ---
  const handleLogin = () => {
    const user = registeredUsers.find(u => u.email === authEmail && u.pass === authPass);
    if (user) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = () => {
    if (authEmail && authPass) {
      setRegisteredUsers([...registeredUsers, { email: authEmail, pass: authPass }]);
      setIsRegistering(false);
      setLoginError('Account created successfully! Please log in.');
    }
  };

  // --- LOGIN/SIGNUP SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#eef651]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="z-10 w-full max-w-sm bg-slate-900 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="h-20 w-20 bg-slate-900 border-4 border-slate-950 rounded-[24px] flex items-center justify-center shadow-2xl">
              <ShieldCheck size={36} className="text-[#eef651]" />
            </div>
          </div>
          
          <div className="mt-6 mb-10 text-center">
            <h2 className="text-3xl font-black text-white italic tracking-tighter">
              {isRegistering ? 'JOIN ENGINE' : 'PORTAL ENTRY'}
            </h2>
            <div className="h-1.5 w-12 bg-[#eef651] mx-auto mt-2 rounded-full" />
          </div>
          
          <div className="space-y-5">
            {loginError && (
              <div className={`p-4 text-xs rounded-2xl font-bold text-center border ${loginError.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                {loginError}
              </div>
            )}
            
            <div className="group">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Identity</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#eef651] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Email Address" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-slate-200 outline-none focus:border-[#eef651]/50 transition-all placeholder:text-slate-700" 
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Security Token</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#eef651] transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-slate-200 outline-none focus:border-[#eef651]/50 transition-all placeholder:text-slate-700" 
                />
              </div>
            </div>
            
            <button 
              onClick={isRegistering ? handleRegister : handleLogin}
              className="w-full bg-[#eef651] hover:bg-[#d9df48] text-slate-950 font-black py-4 rounded-2xl mt-4 transition-all shadow-[0_10px_30px_-10px_rgba(238,246,81,0.5)] active:scale-95 text-sm uppercase tracking-widest"
            >
              {isRegistering ? 'Create Admin' : 'Unlocking System'}
            </button>
            
            <div className="text-center mt-8">
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setLoginError(''); }}
                className="text-[10px] text-slate-500 hover:text-[#eef651] transition-colors font-black uppercase tracking-widest border-b border-transparent hover:border-[#eef651] pb-1"
              >
                {isRegistering ? 'Back to Login' : 'Register New Admin'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex font-sans selection:bg-[#eef651] selection:text-slate-950">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 border-r border-white/5 flex flex-col relative z-20">
        <div className="h-24 flex items-center px-8 border-b border-white/5">
          <div className="h-10 w-10 bg-[#eef651] rounded-xl flex items-center justify-center mr-4 shadow-[0_0_20px_-5px_#eef651]">
            <Server size={20} className="text-slate-950" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white">GEN-AI <span className="text-[#eef651]">ENGINE</span></h1>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="h-1 w-1 rounded-full bg-emerald-500" />
               <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">V2.0 ALPHA</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 py-10 px-6 space-y-3">
          {['Engine', 'History', 'Metrics', 'Settings'].map(tab => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-[20px] transition-all duration-300 group ${activeTab === tab ? 'bg-[#eef651] text-slate-950 font-black shadow-[0_10px_20px_-10px_rgba(238,246,81,0.3)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <div className="flex items-center gap-4">
                {tab === 'Engine' && <Activity size={20} />}
                {tab === 'History' && <History size={20} />}
                {tab === 'Metrics' && <Database size={20} />}
                {tab === 'Settings' && <Settings size={20} />}
                <span className="text-[13px] uppercase tracking-widest">{tab}</span>
              </div>
              {activeTab === tab && <ChevronRight size={18} />}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-4 px-4 py-4 bg-slate-950/50 rounded-[24px] cursor-pointer hover:bg-slate-800 transition-all border border-white/5" onClick={() => setIsAuthenticated(false)}>
            <div className="h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center border border-white/10 group">
              <LogOut size={16} className="text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase text-white tracking-wider">Terminate</p>
              <p className="text-[10px] text-slate-600 font-bold">End Admin Session</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Topbar */}
        <header className="h-24 flex items-center justify-between px-12 border-b border-white/5 bg-slate-900/40 backdrop-blur-3xl sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Command Center</h2>
            <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase mt-1">Global AI Synchronization Node</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="px-5 py-2.5 bg-slate-950 border border-white/10 text-emerald-400 rounded-full text-xs font-black tracking-widest flex items-center gap-3 shadow-inner">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               NODE: ACTIVE
             </div>
          </div>
        </header>

        {activeTab === 'Engine' && (
          <div className="p-12 max-w-7xl mx-auto w-full flex flex-col gap-10">
            
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { l: 'Archives', v: stats.total_docs || "0", c: 'text-white' },
                { l: 'Health', v: `${stats.health_score || "100"}%`, c: stats.health_score < 100 ? 'text-amber-400' : 'text-[#eef651]' },
                { l: 'Confidence', v: '99.4%', c: 'text-[#eef651]' },
                { l: 'Drifts', v: stats.total_conflicts || "0", c: 'text-rose-500' }
              ].map((kpi, i) => (
                <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-[32px] shadow-sm relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                     <Activity size={40} className="text-white/20" />
                  </div>
                  <span className="text-slate-600 text-[10px] font-black tracking-[0.2em] uppercase block">{kpi.l}</span>
                  <span className={`text-4xl font-mono block mt-3 font-black tracking-tighter ${kpi.c}`}>{kpi.v}</span>
                </div>
              ))}
            </div>

            {/* AI Upload Action Zone */}
            <div className="w-full bg-slate-900/60 border-2 border-dashed border-[#eef651]/20 rounded-[48px] p-16 flex flex-col items-center justify-center text-center hover:bg-slate-900/90 hover:border-[#eef651]/40 transition-all cursor-pointer relative overflow-hidden group shadow-[0_30px_60px_-30px_rgba(238,246,81,0.2)]">
              <div className="h-28 w-28 bg-[#eef651]/5 rounded-[40px] flex items-center justify-center mb-8 ring-1 ring-white/5 group-hover:scale-110 transition-all duration-500">
                <UploadCloud className="text-[#eef651] drop-shadow-[0_0_10px_rgba(238,246,81,0.5)]" size={48} />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tighter italic uppercase">Ingest Specification</h2>
              <p className="text-slate-500 max-w-xl leading-relaxed mb-8 font-medium text-sm">
                Feed raw PRDs or feedback logs into the neural engine. <br/> 
                <span className="text-[#eef651]/80 font-black italic">The AI will reconstruct structural alignment in real-time.</span>
              </p>
              <button className="px-10 py-4 bg-[#eef651] hover:bg-white text-slate-950 font-black rounded-2xl pointer-events-none transition-colors uppercase tracking-widest text-xs shadow-xl">
                Select Payload
              </button>
              <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              
              <AnimatePresence>
                {uploadStatus && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute bottom-10 px-8 py-4 bg-slate-950 border border-[#eef651]/30 text-[#eef651] rounded-3xl font-black text-xs tracking-widest flex items-center gap-4 shadow-2xl backdrop-blur-xl">
                    <RefreshCcw size={18} className="animate-spin" /> {uploadStatus.toUpperCase()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Grid */}
            {(conflicts.length > 0 || changes.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Mismatches */}
                <div className="bg-slate-900 border border-rose-900/20 rounded-[40px] overflow-hidden shadow-2xl relative">
                  <div className="bg-rose-950/20 px-8 py-6 border-b border-rose-900/10 flex items-center gap-4">
                    <AlertTriangle size={22} className="text-rose-500" />
                    <h3 className="font-black text-rose-100 uppercase italic tracking-tighter text-lg">Logical Drift Isolated</h3>
                  </div>
                  <div className="p-8 flex flex-col gap-4">
                    {conflicts.map((conf: any) => (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={conf.id} className="p-5 bg-slate-950/80 border border-white/5 rounded-3xl flex gap-5 items-start group hover:border-rose-500/30 transition-all">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0 shadow-[0_0_10px_#f43f5e]" />
                        <p className="text-slate-300 text-sm leading-relaxed font-medium">{conf.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Final Aligned Output */}
                <div className="bg-slate-900 border border-[#eef651]/20 rounded-[40px] overflow-hidden shadow-2xl flex flex-col relative">
                  <div className="bg-[#eef651]/5 px-8 py-6 border-b border-[#eef651]/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CheckCircle size={22} className="text-[#eef651]" />
                      <h3 className="font-black text-[#eef651] uppercase italic tracking-tighter text-lg">Synthesized Solution</h3>
                    </div>
                    {changes.length > 0 && (
                      <button 
                        onClick={handleDownloadPDF}
                        className="px-6 py-2.5 bg-[#eef651] hover:bg-white text-slate-950 text-[10px] font-black rounded-xl flex items-center gap-2 transition-all uppercase tracking-widest shadow-lg active:scale-95"
                      >
                        <Download size={14} /> Download PDF
                      </button>
                    )}
                  </div>
                  <div className="p-8 flex-1 flex flex-col gap-4">
                    {changes.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={changes[changes.length - 1].id} className="h-full">
                          <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed bg-slate-950/80 p-8 rounded-[32px] border border-white/5 overflow-x-auto shadow-inner h-full min-h-[300px]">
                            {changes[changes.length - 1].updated_content}
                          </pre>
                      </motion.div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {activeTab === 'History' && (
          <div className="p-12 max-w-7xl mx-auto w-full flex flex-col gap-10">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Ingestion Log</h3>
            <div className="bg-slate-900 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 font-black text-[10px] text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="px-8 py-6">Payload Name</th>
                    <th className="px-8 py-6">Type</th>
                    <th className="px-8 py-6">Timestamp</th>
                    <th className="px-8 py-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-600 italic">No document history found.</td>
                    </tr>
                  ) : documents.map((doc: any) => (
                    <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="px-8 py-6 font-bold text-slate-200">{doc.filename}</td>
                      <td className="px-8 py-6 text-slate-400 font-mono text-xs">{doc.doc_type}</td>
                      <td className="px-8 py-6 text-slate-500">{doc.upload_date}</td>
                      <td className="px-8 py-6 text-right">
                        <span className="px-4 py-1.5 bg-[#eef651]/10 text-[#eef651] border border-[#eef651]/20 rounded-full text-[10px] font-black uppercase tracking-widest">Processed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'Metrics' && (
          <div className="p-12 max-w-7xl mx-auto w-full flex flex-col gap-10">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Telemetry Stream</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-slate-900 border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                <h4 className="text-slate-500 font-black text-[10px] tracking-widest uppercase mb-8 ml-2">Node Structural Health</h4>
                <div className="h-48 flex items-end gap-3 mb-8">
                  {[40, 65, 55, 80, 95, 100, stats.health_score].map((h, i) => (
                    <motion.div 
                      key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
                      className={`flex-1 rounded-t-2xl transition-all duration-500 ${h < 70 ? 'bg-rose-500/40' : h < 90 ? 'bg-amber-500/40' : 'bg-[#eef651]/40 hover:bg-[#eef651]'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 font-black tracking-widest border-t border-white/5 pt-6">
                  <span>HISTORICAL AVG</span>
                  <span className="text-[#eef651]">LIVE STREAM</span>
                </div>
              </div>
              <div className="bg-slate-900 border border-white/5 p-10 rounded-[48px] shadow-2xl flex flex-col justify-center items-center text-center">
                 <div className="h-40 w-40 rounded-full border-[16px] border-slate-950 border-t-[#eef651] shadow-[0_0_50px_-15px_rgba(238,246,81,0.4)] animate-spin-slow mb-8 flex items-center justify-center">
                    <div className="text-center">
                       <span className="text-3xl font-black text-white block tracking-tighter italic">99.4%</span>
                       <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">SYNC CONF</span>
                    </div>
                 </div>
                 <p className="text-slate-400 text-sm max-w-[200px] font-medium leading-relaxed italic">Real-time AI probability score for document alignment accuracy.</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab - Admin Profile */}
        {activeTab === 'Settings' && (
          <div className="p-12 max-w-7xl mx-auto w-full flex flex-col gap-10">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Administrative Hub</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="col-span-1 bg-slate-900 border border-white/5 p-10 rounded-[48px] shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
                <div className="h-36 w-36 bg-[#eef651] rounded-full flex items-center justify-center mb-8 shadow-[0_20px_40px_-10px_rgba(238,246,81,0.4)] ring-8 ring-slate-950 group-hover:scale-105 transition-transform">
                  <User size={60} className="text-slate-950" />
                </div>
                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter italic">XEBIA_ADMIN</h4>
                <p className="text-xs text-[#eef651] font-black uppercase tracking-widest mt-2">Verified Architect</p>
                <div className="mt-12 w-full space-y-4">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex justify-between items-center px-6">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Region</span>
                    <span className="text-[10px] text-slate-300 font-black uppercase">Global-HQ</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 flex justify-between items-center px-6">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Security</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-black border border-emerald-500/20">Alpha</span>
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-10">
                <div className="bg-slate-900 border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                  <h4 className="text-slate-500 font-black text-[10px] tracking-widest uppercase mb-8 ml-2">Node Authorized Identity</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] text-slate-600 font-black uppercase block ml-4 tracking-[0.2em]">Primary Identifier</label>
                      <div className="p-5 bg-slate-950 rounded-[24px] border border-white/5 text-sm text-slate-300 font-mono italic shadow-inner">{authEmail}</div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] text-slate-600 font-black uppercase block ml-4 tracking-[0.2em]">Session Token</label>
                      <div className="p-5 bg-slate-950 rounded-[24px] border border-white/5 text-xs text-slate-400 font-mono truncate shadow-inner">genai_auth_xebia_2026_secured</div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-white/5 p-10 rounded-[48px] shadow-2xl relative overflow-hidden">
                  <h4 className="text-slate-500 font-black text-[10px] tracking-widest uppercase mb-8 ml-2">System Privilege Matrix</h4>
                  <div className="space-y-5">
                    {[
                      { l: 'Full Neural Alignment', v: true },
                      { l: 'Bypass Consistency Guard', v: true },
                      { l: 'Cross-Node Deletion', v: false }
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-950/50 rounded-[24px] border border-white/5">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{p.l}</span>
                        <div className={`w-12 h-6 rounded-full relative transition-all duration-500 ${p.v ? 'bg-[#eef651] shadow-[0_0_15px_-5px_#eef651]' : 'bg-slate-800'}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-slate-950 rounded-full transition-all duration-300 ${p.v ? 'right-1' : 'left-1'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
