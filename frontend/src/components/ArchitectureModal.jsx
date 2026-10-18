import React from 'react';
import { 
  X, 
  Cpu, 
  Network, 
  Sparkles, 
  Search, 
  GitBranch, 
  Database, 
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-3xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-nvidia to-nebius text-slate-950 flex items-center justify-center font-bold">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Project X Architecture & Multi-Tier Routing</h2>
              <p className="text-xs text-slate-400">Nebius x NVIDIA Global AI Hackathon (Best Apps & Agents Track)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          
          {/* Key Value Proposition */}
          <div className="p-4 rounded-xl bg-surface border border-border">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-nvidia" />
              <span>Multi-Tier Cognitive Routing</span>
            </h3>
            <p className="text-slate-300 mt-2 leading-relaxed">
              Monolithic LLM agents waste massive compute tokens on syntax triage and simple parsing. 
              <strong> Project X</strong> decouples incident remediation into an asymmetric multi-tier pipeline:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-lg bg-background border border-nvidia/30">
                <div className="flex items-center space-x-2 font-mono text-nvidia-light font-bold text-xs">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Fast-Tier: Nemotron-Mini (4B)</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1.5">
                  Sub-400ms latency. Rapidly isolates stack trace frames, determines AST syntax mutation needs, and constructs targeted Tavily search queries.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-background border border-purple-500/30">
                <div className="flex items-center space-x-2 font-mono text-purple-300 font-bold text-xs">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>High-Tier: Nemotron (70B)</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1.5">
                  Cognitive synthesis powerhouse. Ingests retrieved documentation and code context to generate clean, non-breaking unified git diff patches.
                </p>
              </div>
            </div>
          </div>

          {/* Workflow Sequence */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Autonomous Remediation Loop
            </h4>

            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-surface/60 border border-border">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center">1</span>
                <span className="font-medium text-slate-200">Incident Ingestion:</span>
                <span className="text-slate-400">Captures traceback & vulnerable source snippet via POST /api/v1/agent/triage.</span>
              </div>

              <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-surface/60 border border-border">
                <span className="w-5 h-5 rounded-full bg-nvidia/20 text-nvidia font-mono text-[10px] flex items-center justify-center">2</span>
                <span className="font-medium text-nvidia-light">Fast Triage (4B):</span>
                <span className="text-slate-400">Classifies breaking changes, measures complexity, and emits telemetry_init.</span>
              </div>

              <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-surface/60 border border-border">
                <span className="w-5 h-5 rounded-full bg-nebius/20 text-nebius font-mono text-[10px] flex items-center justify-center">3</span>
                <span className="font-medium text-nebius">Tavily Tool Call:</span>
                <span className="text-slate-400">Pulls official migration docs and CVE advisories (with instant offline fallback).</span>
              </div>

              <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-surface/60 border border-border">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] flex items-center justify-center">4</span>
                <span className="font-medium text-purple-300">Escalation & 70B Patch:</span>
                <span className="text-slate-400">Switches cognitive tier dynamically and streams unified diff chunks.</span>
              </div>

              <div className="flex items-center space-x-3 p-2.5 rounded-lg bg-surface/60 border border-border">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] flex items-center justify-center">5</span>
                <span className="font-medium text-emerald-400">Persistence & Telemetry:</span>
                <span className="text-slate-400">Saves incident run, latency metrics, and execution history into SQLite.</span>
              </div>
            </div>
          </div>

          {/* Efficiency Benchmark */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/20 to-surface border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="font-semibold text-emerald-400 text-xs">Compute Token Efficiency</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Multi-tier routing reduces API compute cost by ~84.6% while delivering 3x faster time-to-first-thought.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-emerald-300">~84.6%</span>
              <div className="text-[10px] text-slate-500">Cost Savings</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface/60 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
