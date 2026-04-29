import { useState, useEffect } from 'react';
import { FileText, AlertTriangle, Database, Server, UploadCloud, RefreshCcw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [stats, setStats] = useState({ total_docs: 0, total_conflicts: 0, total_changes: 0, health_score: 100 });
  const [documents, setDocuments] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [changes, setChanges] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  // Fetch live AI Analytics safely
  const fetchData = async () => {
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
      console.log("Backend not running yet or CORS error", err);
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

    setUploadStatus(`Step 1 & 2: Uploading Document & AI Change Detection...`);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', 'SPECIFICATION_UPDATE');

    try {
      await fetch('http://127.0.0.1:8000/api/v1/upload', {
        method: 'POST',
        body: formData,
      });
      setTimeout(() => setUploadStatus('Step 3: AI Analyzing Content & Formatting Summaries...'), 1000);
      setTimeout(() => setUploadStatus('Step 4 & 5: Checking Consistency & Generating Document Updates...'), 2500);
      setTimeout(() => setUploadStatus('Step 6: Dashboard Aligned & Synced!'), 4500);
      setTimeout(() => setUploadStatus(''), 6500);
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
            <p className="text-xs text-slate-400 font-mono tracking-wider">FULL PROJECT MODE</p>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl mt-10 px-6 flex flex-col gap-6">

        {/* Single Dynamic Upload Action Zone */}
        <div className="w-full bg-darkSecondary/50 border border-dashed border-slate-500 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition cursor-pointer relative overflow-hidden group">
          <UploadCloud className="text-blue-400 mb-4 transition-transform group-hover:scale-110" size={56} />
          <h2 className="text-2xl font-bold text-white mb-3">Upload Product Document</h2>
          <p className="text-slate-400 max-w-lg leading-relaxed">
            Upload any PRD, Component Code, or API Spec. <br />
            <span className="text-emerald-400/80 font-semibold mt-1 block">The AI Engine will automatically detect updates, check consistencies, and instantly generate the aligned architecture.</span>
          </p>
          <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />

          {uploadStatus && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 px-6 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl font-bold font-mono border border-emerald-500/30 flex items-center justify-center gap-3">
              <RefreshCcw size={18} className="animate-spin" /> {uploadStatus}
            </motion.div>
          )}
        </div>

        {/* Global KPI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="bg-darkSecondary/30 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center">
            <span className="text-slate-400 text-sm font-bold tracking-wider">TOTAL DOCS</span>
            <span className="text-2xl font-mono text-white">{stats.total_docs || "0"}</span>
          </div>
          <div className={`bg-darkSecondary/30 border p-4 rounded-xl flex justify-between items-center ${stats.health_score < 100 ? 'border-amber-500/30' : 'border-slate-700/50'}`}>
            <span className="text-slate-400 text-sm font-bold tracking-wider">HEALTH SCORE</span>
            <span className={`text-2xl font-mono ${stats.health_score < 100 ? 'text-amber-400' : 'text-emerald-400'}`}>{stats.health_score || "100"}%</span>
          </div>
          <div className="bg-darkSecondary/30 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center">
            <span className="text-slate-400 text-sm font-bold tracking-wider">DOCS SYNCED</span>
            <div className="flex -space-x-2">
              {(documents || []).slice(0, 3).map((doc: any) => (
                <div key={doc.id} title={doc.filename} className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-300 shadow-md">
                  <CheckCircle size={14} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Results Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

          {/* Conflicts / Mismatches Detected */}
          <div className="col-span-1 border border-slate-700/50 rounded-2xl p-6 bg-darkSecondary/50 border-t-4 border-t-rose-500">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-400"><AlertTriangle size={20} /> 1. Mismatches Detected</h3>
            <div className="flex flex-col gap-3">
              {(!conflicts || conflicts.length === 0) ? (
                <p className="text-slate-500 italic text-sm">Validating structure...</p>
              ) : conflicts.map((conf: any) => (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={conf.id} className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl shadow-lg relative overflow-hidden">
                  <p className="text-slate-200 text-sm font-bold leading-relaxed">{conf.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Auto-Updates Summaries */}
          <div className="col-span-1 border border-slate-700/50 rounded-2xl p-6 bg-darkSecondary/50 border-t-4 border-t-emerald-500">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><FileText size={20} /> 2. Document Auto-Updates</h3>
            <div className="flex flex-col gap-3">
              {(!changes || changes.length === 0) ? (
                <p className="text-slate-500 italic text-sm">System establishing standard truth.</p>
              ) : changes.map((ch: any) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={ch.id} className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <span className="text-xs bg-emerald-500/30 font-bold px-2 py-1 rounded text-emerald-200 inline-block mb-2">ACTION</span>
                  <p className="text-sm font-semibold text-slate-200">{ch.summary}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final Aligned Output */}
          <div className="col-span-1 border border-slate-700/50 rounded-2xl p-6 bg-darkSecondary/50 border-t-4 border-t-blue-500 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-blue-400"><Database size={20} /> 3. Aligned Architecture</h3>
              {changes && changes.length > 0 && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => {
                    const text = changes[0].updated_content || "No content extracted.";
                    const file = new Blob([text], { type: 'text/markdown' });
                    const element = document.createElement("a");
                    element.href = URL.createObjectURL(file);
                    element.download = "GenAI_Aligned_Spec_Document.md";
                    document.body.appendChild(element);
                    element.click();
                  }}
                  className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-md border border-blue-500/30"
                >
                  <FileText size={14} /> Download Document
                </motion.button>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {(!changes || changes.length === 0) ? (
                <p className="text-slate-500 italic text-sm">No alignment generated yet.</p>
              ) : changes.map((ch: any) => (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} key={ch.id} className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <pre className="text-xs text-blue-100 whitespace-pre-wrap font-mono leading-relaxed font-semibold">
                    {ch.updated_content}
                  </pre>
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
