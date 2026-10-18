import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('split'); // 'split' | 'error' | 'code'

  return (
    <div className="flex flex-col space-y-4">
      {/* Workspace Header & Preset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-card p-3 rounded-xl border border-border">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-nvidia" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Incident Workspace
          </span>
        </div>

        {/* 1-Click Hero Pre-fill Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onLoadPreset(0)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-nvidia/15 to-nebius/15 hover:from-nvidia/25 hover:to-nebius/25 border border-nvidia/30 text-xs font-semibold text-nvidia-light hover:text-white transition-all shadow-sm"
            title="Load the Pydantic v2 Deprecation Crash hero scenario"
          >
            <Sparkles className="w-3.5 h-3.5 text-nvidia" />
            <span>Load Sample Incident (Pydantic v2 Crash)</span>
          </button>

          {samples.length > 1 && (
            <button
              onClick={() => onLoadPreset(1)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-border text-xs text-slate-300 transition-colors"
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
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-border"
            title="Clear Inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Input Editors (Error Log + Source Code) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Error Log / Stack Trace Editor */}
        <div className="flex flex-col rounded-xl border border-border bg-card/70 overflow-hidden shadow-sm focus-within:border-rose-500/50 transition-colors">
          <div className="px-3.5 py-2 bg-surface/80 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Incident Stack Trace / Terminal Error Log</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">stderr</span>
          </div>
          <div className="relative">
            <textarea
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="Paste Python traceback, compiler error, or container crash log here..."
              rows={8}
              className="w-full p-3.5 bg-background/80 font-mono text-xs text-rose-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Vulnerable Source Code Editor */}
        <div className="flex flex-col rounded-xl border border-border bg-card/70 overflow-hidden shadow-sm focus-within:border-nebius/50 transition-colors">
          <div className="px-3.5 py-2 bg-surface/80 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-nebius-light">
              <FileCode className="w-3.5 h-3.5" />
              <span>Vulnerable Code Snippet</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">python3.11</span>
          </div>
          <div className="relative">
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Paste the target module, class, or function code snippet here..."
              rows={8}
              className="w-full p-3.5 bg-background/80 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

      </div>

      {/* Primary Triage CTA Button */}
      <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-nvidia"></span>
          <span>Dual-tier autonomous workflow: 4B Fast Triage ➔ Tavily Search ➔ 70B Patch Synthesis</span>
        </div>

        <button
          onClick={onRunTriage}
          disabled={isStreaming || (!errorLog && !codeSnippet)}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all ${
            isStreaming
              ? 'bg-nvidia/20 text-nvidia border border-nvidia/40 cursor-not-allowed animate-pulse'
              : !errorLog && !codeSnippet
              ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-nvidia via-nvidia-light to-nebius hover:from-nvidia-dark hover:to-nebius-dark text-slate-950 shadow-nvidia/25 hover:shadow-nvidia/40 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isStreaming ? (
            <>
              <div className="w-4 h-4 border-2 border-nvidia border-t-transparent rounded-full animate-spin"></div>
              <span>Autonomous Agent Running...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Autonomous Triage & Fix</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] bg-black/30 rounded border border-black/20 font-mono font-normal">
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
