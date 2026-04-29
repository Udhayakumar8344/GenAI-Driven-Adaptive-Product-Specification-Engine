import React, { useState, useEffect } from 'react';
import { FileText, AlertTriangle, Activity, Settings, Database, Server, UploadCloud, CheckCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [stats, setStats] = useState({ total_docs: 0, total_conflicts: 0, total_changes: 0, health_score: 100 });
  const [documents, setDocuments] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [changes, setChanges] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  // Fetch data
  const fetchData = async () => {
    try {
      const statsRes = await fetch('http://127.0.0.1:8000/api/v1/stats');
      const docsRes = await fetch('http://127.0.0.1:8000/api/v1/documents');
      const confRes = await fetch('http://127.0.0.1:8000/api/v1/conflicts');
      const changesRes = await fetch('http://127.0.0.1:8000/api/v1/changes');
      
      setStats(await statsRes.json());
      setDocuments(await docsRes.json());
      setConflicts(await confRes.json());
      setChanges(await changesRes.json());
    } catch (err) {
      console.log("Backend not running yet", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // GUI for Steps
    setUploadStatus('Step 1 & 2: Document Upload & Change Detection...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch('http://127.0.0.1:8000/api/v1/upload', {
        method: 'POST',
        body: formData,
      });
      setTimeout(() => setUploadStatus('Step 3: AI Analysis (Comparing old vs new)...'), 1000);
      setTimeout(() => setUploadStatus('Step 4 & 5: Consistency Check & Conflict Detection...'), 2500);
      setTimeout(() => setUploadStatus('Step 6: Dashboard Output Generated!'), 4000);
      setTimeout(() => setUploadStatus(''), 6000);
    } catch (err) {
      setUploadStatus('Error connecting to backend API');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center pb-20 font-sans">
      
      <nav className="w-full bg-darkSecondary border-b border-slate-700/50 py-4 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
            <Server size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">GenAI Spec Engine</h1>
            <p className="text-xs text-slate-400 font-mono tracking-wider">MVP PRESENTATION VIEW</p>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl mt-10 px-6 flex flex-col gap-6">
        
        {/* Step 1 & 2: Upload Zone */}
        <div className="w-full bg-darkSecondary/50 border border-dashed border-slate-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition cursor-pointer relative overflow-hidden group">
          <UploadCloud className="text-primary-400 mb-4 transition-transform group-hover:scale-110" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Step 1: Upload Document</h2>
          <p className="text-slate-400 max-w-md">Drop PRD / API / technical document to trigger Change Detection & AI Analysis.</p>
          <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          
          {uploadStatus && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 px-5 py-3 bg-primary-500/20 text-primary-300 rounded-full font-bold font-mono border border-primary-500/30 flex items-center gap-3">
              <RefreshCcw size={18} className="animate-spin" /> {uploadStatus}
            </motion.div>
          )}
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-darkSecondary/80 border border-slate-700/50 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
             <h3 className="text-sm font-bold text-emerald-400 tracking-wider">TOTAL DOCS</h3>
             <p className="text-4xl font-bold font-mono text-white">{stats.total_docs}</p>
          </div>
          <div className="bg-darkSecondary/80 border border-slate-700/50 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
             <h3 className="text-sm font-bold text-blue-400 tracking-wider">AI SUMMARIES</h3>
             <p className="text-4xl font-bold font-mono text-white">{stats.total_changes}</p>
          </div>
          <div className={`bg-darkSecondary/80 border border-slate-700/50 p-6 rounded-2xl flex flex-col gap-4 shadow-xl transition-all ${stats.total_conflicts > 0 ? 'border-rose-500/50 shadow-rose-500/10' : ''}`}>
             <h3 className={`text-sm font-bold tracking-wider ${stats.total_conflicts > 0 ? 'text-rose-400' : 'text-amber-500'}`}>MISMATCHES (CONFLICTS)</h3>
             <p className="text-4xl font-bold font-mono text-white">{stats.total_conflicts}</p>
          </div>
          <div className="bg-darkSecondary/80 border border-slate-700/50 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
             <h3 className="text-sm font-bold text-purple-400 tracking-wider">HEALTH SCORE</h3>
             <p className={`text-4xl font-bold font-mono ${stats.health_score < 100 ? 'text-rose-400' : 'text-emerald-400'}`}>{stats.health_score}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Step 3: AI Summaries */}
          <div className="col-span-1 bg-darkSecondary/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400"><FileText size={20}/> Step 3: AI Analysis Summary</h3>
            <div className="flex flex-col gap-3">
              {changes.length === 0 ? (
                <p className="text-slate-500 italic text-sm">No changes detected yet.</p>
              ) : changes.map((ch: any) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={ch.id} className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-sm text-slate-200">
                  {ch.summary}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step 4 & 5: Conflicts */}
          <div className="col-span-1 bg-darkSecondary/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-400"><AlertTriangle size={20}/> Step 4 & 5: Conflict Detection</h3>
            <div className="flex flex-col gap-3">
              {conflicts.length === 0 ? (
                <p className="text-slate-500 italic text-sm">Consistency Check passed. No conflicts.</p>
              ) : conflicts.map((conf: any) => (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={conf.id} className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                  <p className="text-slate-200 text-sm font-bold leading-relaxed">{conf.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step 6: Final Output Docs */}
          <div className="col-span-1 bg-darkSecondary/50 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><Database size={20}/> Step 6: Updated Documents</h3>
            <div className="flex flex-col gap-3">
              {documents.map((doc: any) => (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} key={doc.id} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-slate-200">{doc.filename}</p>
                    <p className="text-xs text-slate-400 tracking-wide mt-1">TYPE: {doc.doc_type}</p>
                  </div>
                  <CheckCircle size={18} className="text-emerald-500" />
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

export default App;
