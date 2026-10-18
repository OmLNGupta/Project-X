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
  historyCount, 
  onOpenArchitecture 
}) {
  const isMock = healthInfo?.mode === 'mock_simulated';

  return (
    <header className="border-b border-border/80 bg-surface/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Branding */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-nvidia-dark via-nvidia to-nebius flex items-center justify-center shadow-lg shadow-nvidia/20 ring-1 ring-white/20">
              <ShieldAlert className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nvidia opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-nvidia"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Project X
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-nvidia/10 text-nvidia border border-nvidia/30 rounded-full">
                Autonomous SRE
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Tier Nemotron Remediation Agent
            </p>
          </div>
        </div>

        {/* Center: System Status Badges */}
        <div className="hidden md:flex items-center space-x-2.5">
          {/* Nebius Connection Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs">
            <span className={`w-2 h-2 rounded-full ${isMock ? 'bg-amber-400 animate-pulse' : 'bg-nebius animate-ping'}`} />
            <span className="text-slate-400 font-medium">Nebius Token Factory:</span>
            <span className={`font-semibold ${isMock ? 'text-amber-300' : 'text-nebius'}`}>
              {isMock ? 'Simulated Fallback' : 'Online'}
            </span>
          </div>

          {/* NVIDIA Multi-Tier Router Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs">
            <Cpu className="w-3.5 h-3.5 text-nvidia" />
            <span className="text-slate-400 font-medium">Router:</span>
            <span className="text-slate-200 font-mono font-medium">Nemotron 4B ⇄ 70B</span>
          </div>

          {/* Track Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-semibold">Best Apps & Agents Track</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Architecture Info Button */}
          <button
            onClick={onOpenArchitecture}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-card rounded-lg transition-colors border border-transparent hover:border-border"
            title="System Architecture & Flow"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* History Drawer Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-cardHover border border-border text-xs font-medium text-slate-300 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Incidents</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-slate-800 text-nebius font-mono rounded text-[10px] border border-border">
                {historyCount}
              </span>
            )}
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/OmLNGupta/Project-X.git"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-white hover:bg-card rounded-lg transition-colors border border-transparent hover:border-border"
            title="View GitHub Repository"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
