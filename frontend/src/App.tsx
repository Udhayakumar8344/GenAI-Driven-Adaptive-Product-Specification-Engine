import { useState, useEffect } from 'react';
import { FileText, AlertTriangle, Database, Server, UploadCloud, RefreshCcw, FileCode2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const [stats, setStats] = useState({ total_docs: 0, total_conflicts: 0, total_changes: 0, health_score: 100 });
  const [documents, setDocuments] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [changes, setChanges] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  // Fetch live AI Analytics
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

  const handleFileUpload = async (e: any, docType: string) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus(`Step 1: Tracking ${docType} Changes...`);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);

    try {
      await fetch('http://127.0.0.1:8000/api/v1/upload', {
        method: 'POST',
        body: formData,
      });
      setTimeout(() => setUploadStatus('Step 2: AI Detecting Mismatches...'), 1000);
      setTimeout(() => setUploadStatus('Step 3: AI Auto-Updating Documents...'), 2500);
      setTimeout(() => setUploadStatus('Step 4: Everything Aligned & Synced!'), 4000);
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
            <p className="text-xs text-slate-400 font-mono tracking-wider">FULL PROJECT MODE</p>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl mt-10 px-6 flex flex-col gap-6">

        {/* Upload Action Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">

          <div className="bg-darkSecondary/50 border border-slate-600 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-800/50 transition cursor-pointer relative overflow-hidden group">
            <UploadCloud className="text-blue-400 mb-4 transition-transform group-hover:scale-110" size={40} />
            <h2 className="text-xl font-bold text-white mb-2">1. Upload Original Document</h2>
            <p className="text-slate-400 text-sm max-w-xs">Upload your Master PRD or Tech Spec.</p>
            <input type="file" onChange={(e) => handleFileUpload(e, 'ORIGINAL_SPEC')} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          <div className="bg-darkSecondary/50 border border-slate-600 rounded-2xl p-8 flex flex-col items-center text-center hover:bg-slate-800/50 transition cursor-pointer relative overflow-hidden group">
            <FileCode2 className="text-emerald-400 mb-4 transition-transform group-hover:scale-110" size={40} />
            <h2 className="text-xl font-bold text-white mb-2">2. Commit Code/Feedback</h2>
            <p className="text-slate-400 text-sm max-w-xs">Upload new changed code, feature feedback, or API schemas.</p>
            <input type="file" onChange={(e) => handleFileUpload(e, 'CODE_OR_FEEDBACK_CHANGE')} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

        </div>

        {uploadStatus && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5 py-3 bg-emerald-500/20 text-emerald-300 rounded-xl font-bold font-mono border border-emerald-500/30 flex items-center justify-center gap-3">
            <RefreshCcw size={18} className="animate-spin" /> {uploadStatus}
          </motion.div>
        )}

        {/* Global KPI Stats showing documents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="bg-darkSecondary/30 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center">
            <span className="text-slate-400 text-sm font-bold tracking-wider">TOTAL DOCS</span>
            <span className="text-2xl font-mono text-white">{stats.total_docs}</span>
          </div>
          <div className={`bg-darkSecondary/30 border p-4 rounded-xl flex justify-between items-center ${stats.health_score < 100 ? 'border-amber-500/30' : 'border-slate-700/50'}`}>
            <span className="text-slate-400 text-sm font-bold tracking-wider">HEALTH SCORE</span>
            <span className={`text-2xl font-mono ${stats.health_score < 100 ? 'text-amber-400' : 'text-emerald-400'}`}>{stats.health_score}%</span>
          </div>
          <div className="bg-darkSecondary/30 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center">
            <span className="text-slate-400 text-sm font-bold tracking-wider">DOCS SYNCED</span>
            <div className="flex -space-x-2">
              {documents.slice(0, 3).map((doc: any) => (
                <div key={doc.id} title={doc.filename} className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-300">
                  <CheckCircle size={14} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Results Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

          {/* Conflicts / Mismatches Detected */}
          <div className="col-span-1 border border-slate-700/50 rounded-2xl p-6 bg-darkSecondary/50 border-l-4 border-l-rose-500">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-400"><AlertTriangle size={20} /> 1. Mismatches Detected</h3>
            <div className="flex flex-col gap-3">
              {conflicts.length === 0 ? (
                <p className="text-slate-500 italic text-sm">Waiting for code tracking...</p>
              ) : conflicts.map((conf: any) => (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={conf.id} className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl shadow-lg relative overflow-hidden">
                  <p className="text-slate-200 text-sm font-bold leading-relaxed">{conf.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* AI Auto-Updates */}
          <div className="col-span-1 border border-slate-700/50 rounded-2xl p-6 bg-darkSecondary/50 border-l-4 border-l-emerald-500">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400"><FileText size={20} /> 2. Document Auto-Updates</h3>
            <div className="flex flex-col gap-3">
              {changes.length === 0 ? (
                <p className="text-slate-500 italic text-sm">System holds original state.</p>
              ) : changes.map((ch: any) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={ch.id} className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <span className="text-xs bg-emerald-500/30 font-bold px-2 py-1 rounded text-emerald-200 inline-block mb-2">ACTION</span>
                  <p className="text-sm font-semibold text-slate-200">{ch.summary}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final Aligned Output */}
          <div className="col-span-1 border border-slate-700/50 rounded-2xl p-6 bg-darkSecondary/50 border-l-4 border-l-blue-500">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400"><Database size={20} /> 3. Aligned Architecture</h3>
            <div className="flex flex-col gap-3">
              {changes.length === 0 ? (
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
