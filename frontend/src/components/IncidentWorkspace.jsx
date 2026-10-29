import React from 'react';
import { 
  AlertTriangle, 
  Code2, 
  Play, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Zap,
  Terminal,
  FileCode
} from 'lucide-react';
import DiffViewer from './DiffViewer';

export default function IncidentWorkspace({
  errorLog,
  setErrorLog,
  codeSnippet,
  setCodeSnippet,
  diff,
  isStreaming,
  onRunTriage,
  onLoadPreset,
  samples = []
}) {
  return (
    <div className="flex flex-col space-y-4">
      {/* Workspace Header & Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white/45 backdrop-blur-2xl p-4 rounded-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Incident Workspace
          </span>
        </div>

        {/* 1-Click Hero Pre-fill Buttons in Frosted Capsule Style */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onLoadPreset(0)}
            className="bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/80 text-violet-900 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all flex items-center space-x-1.5 active:scale-[0.98]"
            title="Load the Pydantic v2 Deprecation Crash hero scenario"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>Load Sample Incident (Pydantic v2 Crash)</span>
          </button>

          {samples.length > 1 && (
            <button
              onClick={() => onLoadPreset(1)}
              className="bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/80 text-slate-800 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98]"
              title="FastAPI Lifespan Deprecation"
            >
              FastAPI Lifespan
            </button>
          )}

          <button
            onClick={() => {
              setErrorLog('');
              setCodeSnippet('');
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-full transition-colors border border-white/80 shadow-sm"
            title="Clear Inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Input Editors (Two side-by-side inputs: Error Log + Source Code) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Error Log / Stack Trace Editor */}
        <div className="flex flex-col rounded-2xl border border-white/70 bg-white/45 backdrop-blur-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9)] transition-all">
          <div className="px-4 py-3 bg-white/30 border-b border-white/50 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-800">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Incident Stack Trace / Terminal Error Log</span>
            </div>
            <span className="bg-white/50 backdrop-blur-sm border border-white/70 text-rose-700 text-[10px] font-mono px-2.5 py-0.5 rounded-full shadow-sm">
              stderr
            </span>
          </div>
          <div className="p-3">
            <textarea
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="Paste Python traceback, compiler error, or container crash log here..."
              rows={8}
              className="w-full p-3.5 bg-white/35 backdrop-blur-md border border-white/60 focus:border-violet-400 focus:bg-white/60 focus:ring-4 focus:ring-violet-300/30 text-slate-800 font-mono text-xs rounded-xl shadow-inner transition-all resize-none leading-relaxed focus:outline-none"
            />
          </div>
        </div>

        {/* Vulnerable Source Code Editor */}
        <div className="flex flex-col rounded-2xl border border-white/70 bg-white/45 backdrop-blur-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9)] transition-all">
          <div className="px-4 py-3 bg-white/30 border-b border-white/50 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-800">
              <FileCode className="w-3.5 h-3.5 text-teal-600" />
              <span>Vulnerable Code Snippet</span>
            </div>
            <span className="bg-white/50 backdrop-blur-sm border border-white/70 text-teal-700 text-[10px] font-mono px-2.5 py-0.5 rounded-full shadow-sm">
              python3.11
            </span>
          </div>
          <div className="p-3">
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Paste the target module, class, or function code snippet here..."
              rows={8}
              className="w-full p-3.5 bg-white/35 backdrop-blur-md border border-white/60 focus:border-violet-400 focus:bg-white/60 focus:ring-4 focus:ring-violet-300/30 text-slate-800 font-mono text-xs rounded-xl shadow-inner transition-all resize-none leading-relaxed focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* Primary Triage CTA Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/45 backdrop-blur-2xl p-4 rounded-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9)]">
        <div className="text-xs text-slate-700 flex items-center space-x-2 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shadow-[0_0_8px_rgba(16,185,129,0.7)]"></span>
          <span>Dual-tier autonomous workflow: 4B Fast Triage ➔ Tavily Search ➔ 70B Patch Synthesis</span>
        </div>

        <button
          onClick={onRunTriage}
          disabled={isStreaming || (!errorLog && !codeSnippet)}
          className={`flex items-center space-x-2.5 px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 border border-white/60 active:scale-[0.98] ${
            isStreaming
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 cursor-not-allowed animate-pulse shadow-sm'
              : !errorLog && !codeSnippet
              ? 'bg-white/40 text-slate-400 border-white/50 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-slate-950 shadow-[0_8px_20px_rgba(20,184,166,0.35)] hover:shadow-[0_10px_25px_rgba(20,184,166,0.5)]'
          }`}
        >
          {isStreaming ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Autonomous Agent Running...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-slate-950" />
              <span>Run Autonomous Triage & Fix</span>
              <kbd className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] bg-slate-950/15 text-slate-900 rounded-md border border-slate-950/20 font-mono font-medium">
                ⌘↵
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Unified Git Diff Patch Output Viewer */}
      <DiffViewer diff={diff} isStreaming={isStreaming} />

    </div>
  );
}
