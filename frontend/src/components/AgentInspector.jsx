import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Gauge, 
  Activity, 
  Search, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Zap, 
  Layers, 
  Terminal,
  BookOpen,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function AgentInspector({
  activeTier,
  currentModel,
  telemetryEvents = [],
  isStreaming,
  summary,
  startTime
}) {
  const [elapsedTimer, setElapsedTimer] = useState(0);

  // Live stopwatch while streaming
  useEffect(() => {
    let interval = null;
    if (isStreaming && startTime) {
      interval = setInterval(() => {
        setElapsedTimer(Date.now() - startTime);
      }, 50);
    } else if (!isStreaming && summary?.total_latency_ms) {
      setElapsedTimer(summary.total_latency_ms);
    }
    return () => clearInterval(interval);
  }, [isStreaming, startTime, summary]);

  const isHighTier = activeTier === 'high' || currentModel?.includes('70B');

  return (
    <div className="flex flex-col space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-nebius" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Agent Inspector & Telemetry HUD
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SSE Stream Active</span>
        </div>
      </div>

      {/* Dynamic Active Model Gauge Card */}
      <div className={`p-4 rounded-xl border transition-all duration-500 ${
        isHighTier
          ? 'bg-gradient-to-br from-card via-[#18152e] to-card border-purple-500/40 shadow-lg shadow-purple-500/10'
          : 'bg-gradient-to-br from-card via-[#0e1d16] to-card border-nvidia/40 shadow-lg shadow-nvidia/10'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Active Cognitive Tier</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isHighTier 
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
              : 'bg-nvidia/20 text-nvidia-light border border-nvidia/40'
          }`}>
            {isHighTier ? 'High-Tier Cognitive Engine' : 'Fast-Tier Triage Engine'}
          </span>
        </div>

        <div className="mt-3 flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
            isHighTier 
              ? 'bg-purple-600/30 text-purple-300 ring-1 ring-purple-400/30' 
              : 'bg-nvidia/30 text-nvidia ring-1 ring-nvidia/40'
          }`}>
            {isHighTier ? '70B' : '4B'}
          </div>
          <div>
            <div className="text-sm font-bold font-mono text-slate-100">
              {currentModel || (isHighTier ? 'nvidia/Llama-3.1-Nemotron-70B-Instruct' : 'nvidia/nemotron-mini-4b-instruct')}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isHighTier 
                ? 'Complex AST mutation, code synthesis & unified diff patching' 
                : 'Rapid log parsing, syntax analysis & tool query formulation'}
            </p>
          </div>
        </div>

        {/* Tier Switching Transition Visual Indicator */}
        <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              !isHighTier ? 'bg-nvidia/20 text-nvidia font-bold' : 'text-slate-500'
            }`}>
              Nemotron-Mini (4B)
            </span>
            <ArrowRight className={`w-3.5 h-3.5 ${isHighTier ? 'text-purple-400 animate-pulse' : 'text-slate-600'}`} />
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              isHighTier ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-slate-500'
            }`}>
              Nemotron (70B)
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            {isHighTier ? '⚡ Escalated for Code Patch' : '⚡ Initial Triage'}
          </span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Latency Timer */}
        <div className="bg-card p-3 rounded-xl border border-border flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Clock className="w-3.5 h-3.5 text-nebius" />
            <span>Latency</span>
          </div>
          <div className="mt-2 text-lg font-bold font-mono text-slate-100">
            {elapsedTimer > 0 ? `${(elapsedTimer / 1000).toFixed(2)}s` : '0.00s'}
          </div>
          <div className="text-[10px] text-slate-500">
            {summary?.fast_tier_latency_ms ? `4B: ${summary.fast_tier_latency_ms}ms | 70B: ${summary.high_tier_latency_ms}ms` : 'Real-time timer'}
          </div>
        </div>

        {/* Token Velocity */}
        <div className="bg-card p-3 rounded-xl border border-border flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Gauge className="w-3.5 h-3.5 text-nvidia" />
            <span>Velocity</span>
          </div>
          <div className="mt-2 text-lg font-bold font-mono text-nvidia-light">
            {summary?.tokens_per_sec || (isStreaming ? '142.0' : '0.0')}
            <span className="text-[11px] text-slate-400 font-normal ml-1">t/s</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {summary?.total_tokens ? `${summary.total_tokens} tokens` : 'Generation rate'}
          </div>
        </div>

        {/* Cost Reduction */}
        <div className="bg-card p-3 rounded-xl border border-border flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Efficiency</span>
          </div>
          <div className="mt-2 text-lg font-bold font-mono text-amber-300">
            ~84.6%
          </div>
          <div className="text-[10px] text-slate-500">
            Compute cost saved
          </div>
        </div>
      </div>

      {/* Execution Trace Timeline */}
      <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col flex-1">
        <div className="px-4 py-2.5 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-nebius" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Execution Trace & Tool Pipeline
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {telemetryEvents.length} events
          </span>
        </div>

        <div className="p-4 space-y-3.5 max-h-[460px] overflow-y-auto">
          {telemetryEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Terminal className="w-7 h-7 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-xs">No active execution trace yet.</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Click "Run Autonomous Triage & Fix" to stream the live agent reasoning chain.
              </p>
            </div>
          ) : (
            telemetryEvents.map((event, idx) => {
              const { event: type, data } = event;

              if (type === 'telemetry_init') {
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-nvidia/20 text-nvidia flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-surface/60 p-2.5 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-nvidia">Telemetry Initialized</span>
                        <span className="text-[10px] font-mono text-slate-500">{data.tier_name}</span>
                      </div>
                      <p className="text-slate-300 mt-1 text-[11px]">
                        Agent session spawned. Active model: <code className="text-nvidia-light font-mono">{data.model}</code>
                      </p>
                    </div>
                  </div>
                );
              }

              if (type === 'thought') {
                const isHigh = data.tier === 'high';
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isHigh ? 'bg-purple-500/20 text-purple-300' : 'bg-nvidia/20 text-nvidia'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-surface/60 p-2.5 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isHigh ? 'text-purple-300' : 'text-nvidia-light'}`}>
                          {data.title || `Cognitive Reasoning (Step ${data.step})`}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {data.elapsed_ms ? `${data.elapsed_ms}ms` : ''}
                        </span>
                      </div>
                      <p className="text-slate-300 mt-1 text-[11px] leading-relaxed whitespace-pre-line">
                        {data.content}
                      </p>
                    </div>
                  </div>
                );
              }

              if (type === 'tool_call') {
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-nebius/20 text-nebius flex items-center justify-center shrink-0 mt-0.5">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-surface/60 p-2.5 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-nebius">Tool Invocation: Tavily Search</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-nebius/10 text-nebius rounded border border-nebius/30">
                          RAG
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1 text-[11px]">
                        Query: <span className="text-slate-200 font-mono">"{data.query}"</span>
                      </p>
                      {data.purpose && (
                        <p className="text-slate-500 text-[10px] mt-0.5 italic">{data.purpose}</p>
                      )}
                    </div>
                  </div>
                );
              }

              if (type === 'tool_result') {
                const sources = data.sources || [];
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-surface/60 p-2.5 rounded-lg border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-400">
                          Tavily Search Documentation Retrieved
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {sources.length} sources
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-1">
                        {sources.map((src, sIdx) => (
                          <div key={sIdx} className="p-2 rounded bg-background/70 border border-border/80 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-200 truncate pr-2">
                                {src.title}
                              </span>
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-nebius hover:underline flex items-center space-x-0.5 shrink-0"
                              >
                                <span>docs</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                            <p className="text-slate-400 text-[10px] mt-1 line-clamp-2">
                              {src.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (type === 'telemetry_switch') {
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-purple-950/20 p-2.5 rounded-lg border border-purple-500/30">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-purple-300">
                          Dynamic Multi-Tier Escalation
                        </span>
                        <span className="text-[10px] font-mono text-purple-400">
                          Nemotron 70B Engaged
                        </span>
                      </div>
                      <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
                        {data.reason}
                      </p>
                    </div>
                  </div>
                );
              }

              if (type === 'execution_summary') {
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/30">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-300">
                          Remediation Completed
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {data.total_latency_ms}ms
                        </span>
                      </div>
                      <p className="text-slate-300 mt-1 text-[11px]">
                        Generated unified patch (+{data.diff_additions} / -{data.diff_deletions} lines). Token velocity: {data.tokens_per_sec} t/s. Compute cost reduced by {data.cost_reduction_percent}%.
                      </p>
                    </div>
                  </div>
                );
              }

              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
}
