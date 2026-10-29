import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Zap, 
  History, 
  ExternalLink, 
  Sparkles,
  Info
} from 'lucide-react';

export default function Header({ 
  healthInfo, 
  onOpenHistory, 
  historyCount = 0, 
  onOpenArchitecture 
}) {
  const isMock = healthInfo?.mode === 'mock_simulated';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/45 backdrop-blur-2xl border-b border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Branding */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-300/40 border border-white/80">
              <ShieldAlert className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Project X
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-800 border border-emerald-300/80 rounded-full shadow-sm">
                AUTONOMOUS SRE
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">
              Multi-Tier Nemotron Remediation Agent
            </p>
          </div>
        </div>

        {/* Center: System Status Badges in Frosted Capsule Style */}
        <div className="hidden md:flex items-center space-x-2.5">
          {/* Nebius Connection Badge */}
          <div className="bg-white/50 backdrop-blur-md border border-white/80 shadow-sm text-slate-700 font-medium px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${isMock ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.7)]' : 'bg-cyan-500 animate-ping shadow-[0_0_8px_rgba(6,182,212,0.7)]'}`} />
            <span className="text-slate-500">Nebius Token Factory:</span>
            <span className={`font-semibold ${isMock ? 'text-amber-700' : 'text-cyan-700'}`}>
              {isMock ? 'Simulated Fallback' : 'Online'}
            </span>
          </div>

          {/* NVIDIA Multi-Tier Router Badge */}
          <div className="bg-white/50 backdrop-blur-md border border-white/80 shadow-sm text-slate-700 font-medium px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500">Router:</span>
            <span className="text-slate-800 font-mono font-semibold">Nemotron 4B ⇄ 70B</span>
          </div>

          {/* Track Badge */}
          <div className="bg-amber-500/15 backdrop-blur-md border border-amber-300/60 text-amber-900 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Best Apps & Agents Track</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Architecture Info Button */}
          <button
            onClick={onOpenArchitecture}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white/80 backdrop-blur-md rounded-full transition-all border border-white/80 shadow-sm"
            title="System Architecture & Flow"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* History Drawer Button */}
          <button
            onClick={onOpenHistory}
            className="bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/80 text-slate-700 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all flex items-center space-x-1.5"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Incidents</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-violet-100 text-violet-800 font-mono rounded-full text-[10px] border border-violet-200">
                {historyCount}
              </span>
            )}
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/OmLNGupta/Project-X.git"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-600 hover:text-slate-900 bg-white/50 hover:bg-white/80 backdrop-blur-md rounded-full transition-all border border-white/80 shadow-sm"
            title="View GitHub Repository"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </header>
  );
}
