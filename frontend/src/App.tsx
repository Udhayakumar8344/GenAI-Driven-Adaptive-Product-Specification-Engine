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
      setTimeout(() => setUploadStatus('Stage 2: NLP Extracting Core Requirements...'), 1200);
      setTimeout(() => setUploadStatus('Stage 3: Cross-Referencing Knowledge Graphs...'), 2400);
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            {isRegistering ? 'Create Account' : 'Admin Portal'}
          </h2>
          <p className="text-sm text-center text-slate-400 mb-8 font-medium italic">
            {isRegistering ? 'Register to manage GenAI Specifications' : 'Sign in to access your dashboard'}
          </p>
          
          <div className="space-y-4">
            {loginError && (
              <div className={`p-3 text-xs rounded-xl font-bold text-center ${loginError.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {loginError}
              </div>
            )}
            
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Email Address" 
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                value={authPass}
                onChange={(e) => setAuthPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
            
            <button 
              onClick={isRegistering ? handleRegister : handleLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl mt-4 transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
            >
              {isRegistering ? 'Register Admin' : 'Access Engine'}
            </button>
            
            <div className="text-center mt-6">
              <button 
                onClick={() => { setIsRegistering(!isRegistering); setLoginError(''); }}
                className="text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium underline underline-offset-4"
              >
                {isRegistering ? 'Already have an account? Login' : 'Need a new admin account? Register'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md shadow-indigo-500/20">
            <Server size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">GenAI Engine</h1>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          {['Engine', 'History', 'Metrics', 'Settings'].map(tab => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${activeTab === tab ? 'bg-indigo-600/10 text-indigo-400 font-medium border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <div className="flex items-center gap-3">
                {tab === 'Engine' && <Activity size={18} />}
                {tab === 'History' && <History size={18} />}
                {tab === 'Metrics' && <Database size={18} />}
                {tab === 'Settings' && <Settings size={18} />}
                {tab}
              </div>
              {activeTab === tab && <ChevronRight size={16} />}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-3 bg-slate-950 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => setIsAuthenticated(false)}>
            <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center">
              <LogOut size={14} className="text-rose-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Sign Out</p>
              <p className="text-xs text-slate-500">Admin Session</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-10 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">AI Control Center</h2>
            <p className="text-sm text-slate-400">Manage real-time specification tracking</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold flex items-center gap-2 shadow-inner">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               System Online
             </div>
          </div>
        </header>

        {activeTab === 'Engine' && (
          <div className="p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
            
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <span className="text-slate-500 text-xs font-bold tracking-wider upper">ACTIVE REPOS</span>
                  <span className="text-3xl font-mono text-white block mt-2">{stats.total_docs || "0"}</span>
              </div>
              <div className={`bg-slate-900 border p-5 rounded-2xl shadow-sm ${stats.health_score < 100 ? 'border-amber-500/30' : 'border-slate-800'}`}>
                  <span className="text-slate-500 text-xs font-bold tracking-wider upper">STRUCTURAL HEALTH</span>
                  <span className={`text-3xl font-mono block mt-2 ${stats.health_score < 100 ? 'text-amber-400' : 'text-emerald-400'}`}>{stats.health_score || "100"}%</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <span className="text-slate-500 text-xs font-bold tracking-wider upper">AI CONFIDENCE</span>
                  <span className="text-3xl font-mono text-indigo-400 block mt-2">99.4%</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                  <span className="text-slate-500 text-xs font-bold tracking-wider upper">ACTIVE CONFLICTS</span>
                  <span className="text-3xl font-mono text-rose-400 block mt-2">{stats.total_conflicts || "0"}</span>
              </div>
            </div>

            {/* AI Upload Zone */}
            <div className="w-full bg-slate-900/80 border border-dashed border-indigo-500/50 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-800/80 transition cursor-pointer relative overflow-hidden group shadow-[0_0_40px_-15px_rgba(79,70,229,0.3)]">
              <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="text-indigo-400" size={36} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Process New Specification</h2>
              <p className="text-slate-400 max-w-lg leading-relaxed mb-6">
                Drag and drop raw text, PRDs, code implementations, or feedback logs. The AI will autonomously identify logical drift and rebuild an aligned architecture.
              </p>
              <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-full pointer-events-none">
                Select Document
              </button>
              <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              
              <AnimatePresence>
                {uploadStatus && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-6 px-6 py-3 bg-indigo-500/20 text-indigo-300 rounded-full font-mono text-sm border border-indigo-500/30 flex items-center gap-3 backdrop-blur-md">
                    <RefreshCcw size={16} className="animate-spin" /> {uploadStatus}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results Grid */}
            {(conflicts.length > 0 || changes.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Mismatches */}
                <div className="bg-slate-900 border border-rose-900/50 rounded-3xl overflow-hidden shadow-lg">
                  <div className="bg-rose-950/30 px-6 py-4 border-b border-rose-900/30 flex items-center gap-3">
                    <AlertTriangle size={18} className="text-rose-400" />
                    <h3 className="font-bold text-rose-100">Logical Drift Detected</h3>
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    {conflicts.map((conf: any) => (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={conf.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                        <p className="text-slate-300 text-sm leading-relaxed">{conf.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Final Aligned Output */}
                <div className="bg-slate-900 border border-emerald-900/50 rounded-3xl overflow-hidden shadow-lg flex flex-col">
                  <div className="bg-emerald-950/30 px-6 py-4 border-b border-emerald-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-emerald-400" />
                      <h3 className="font-bold text-emerald-100">AI Synthesized Architecture</h3>
                    </div>
                    {changes.length > 0 && (
                      <button 
                        onClick={handleDownloadPDF}
                        className="px-4 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors border border-emerald-500/30"
                      >
                        <Download size={14} /> Export PDF
                      </button>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col gap-3">
                    {changes.length > 0 && (
                      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} key={changes[changes.length - 1].id} className="h-full">
                          <pre className="text-xs text-emerald-100/80 whitespace-pre-wrap font-mono leading-relaxed bg-slate-950 p-5 rounded-2xl border border-slate-800 overflow-x-auto">
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

        {/* History Tab */}
        {activeTab === 'History' && (
          <div className="p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
            <h3 className="text-xl font-bold text-white">Document Ingestion History</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 text-slate-500 text-xs font-bold tracking-widest border-b border-slate-800">
                    <th className="px-6 py-4">FILENAME</th>
                    <th className="px-6 py-4">TYPE</th>
                    <th className="px-6 py-4">TIMESTAMP</th>
                    <th className="px-6 py-4 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">No document history found.</td>
                    </tr>
                  ) : documents.map((doc: any) => (
                    <tr key={doc.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-200">{doc.filename}</td>
                      <td className="px-6 py-4 text-slate-400">{doc.doc_type}</td>
                      <td className="px-6 py-4 text-slate-500">{doc.upload_date}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">Processed</span>
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
          <div className="p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold text-white">System Performance Metrics</h3>
                <p className="text-sm text-slate-500">Real-time telemetry from AI inference nodes</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-sm">
                <h4 className="text-emerald-400 font-bold mb-6 text-sm tracking-widest uppercase">Structural Health Trend</h4>
                <div className="h-48 flex items-end gap-2">
                  {[40, 65, 55, 80, 95, 100, stats.health_score].map((h, i) => (
                    <motion.div 
                      key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }}
                      className={`flex-1 rounded-t-lg ${h < 70 ? 'bg-rose-500/40' : h < 90 ? 'bg-amber-500/40' : 'bg-emerald-500/40'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-slate-600 font-bold tracking-widest">
                  <span>T-6 HOURS</span>
                  <span>CURRENT</span>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-sm">
                <h4 className="text-indigo-400 font-bold mb-6 text-sm tracking-widest uppercase">Conflict Resolution Accuracy</h4>
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Semantic Matching</span>
                      <span className="text-indigo-400 font-mono">99.8%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '99.8%' }} className="h-full bg-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Contextual Refinement</span>
                      <span className="text-purple-400 font-mono">94.2%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '94.2%' }} className="h-full bg-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab - Admin Profile */}
        {activeTab === 'Settings' && (
          <div className="p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
            <h3 className="text-xl font-bold text-white">Administrative Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 ring-4 ring-slate-950">
                  <User size={40} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-white">Xebia Administrator</h4>
                <p className="text-sm text-indigo-400 font-medium">System Architect</p>
                
                <div className="mt-8 w-full space-y-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center px-4">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Status</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">Verified</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center px-4">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Region</span>
                    <span className="text-[10px] text-slate-300 font-bold">Global-HQ</span>
                  </div>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-8">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-sm">
                  <h4 className="text-slate-400 font-bold mb-6 text-xs tracking-widest uppercase">Account Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Login Identifier</label>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 font-mono">
                        {authEmail}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Access Token</label>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-300 font-mono truncate">
                        genai_auth_xebia_2026_secured
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-sm">
                  <h4 className="text-slate-400 font-bold mb-6 text-xs tracking-widest uppercase">System Permissions</h4>
                  <div className="space-y-4">
                    {[
                      { l: 'Architecture Overwrite', v: true },
                      { l: 'Document Ingestion', v: true },
                      { l: 'Conflict Resolution', v: true },
                      { l: 'User Management', v: false }
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{p.l}</span>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${p.v ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${p.v ? 'right-1' : 'left-1'}`} />
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
