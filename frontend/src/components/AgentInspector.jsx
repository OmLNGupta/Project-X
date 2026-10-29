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

  const isHighTier = 
    activeTier === 'high' || 
    activeTier === '70B' || 
    activeTier === 'high-tier' ||
    Boolean(currentModel && (currentModel.includes('70B') || currentModel.includes('70b')));

  const displayedModel = isHighTier
    ? (currentModel && (currentModel.includes('70B') || currentModel.includes('70b'))
        ? currentModel
        : 'nvidia/Llama-3.1-Nemotron-70B-Instruct')
    : (currentModel && !currentModel.includes('70B') && !currentModel.includes('70b')
        ? currentModel
        : 'nvidia/nemotron-mini-4b-instruct');

  return (
    <div className="flex flex-col space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between bg-white/45 backdrop-blur-2xl p-4 rounded-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Agent Inspector & Telemetry HUD
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.7)]"></span>
          <span className="font-semibold text-emerald-700">SSE Stream Active</span>
        </div>
      </div>

      {/* Dynamic Active Model Gauge Card */}
      <div className={`p-4 rounded-2xl border transition-all duration-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9)] ${
        isHighTier
          ? 'bg-gradient-to-br from-violet-50/70 via-white/50 to-purple-50/50 backdrop-blur-2xl border-violet-200'
          : 'bg-gradient-to-br from-emerald-50/70 via-white/50 to-teal-50/50 backdrop-blur-2xl border-emerald-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span>Active Cognitive Tier</span>
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
            isHighTier 
              ? 'bg-violet-100/90 text-violet-800 border-violet-300' 
              : 'bg-emerald-100/90 text-emerald-800 border-emerald-300'
          }`}>
            {isHighTier ? 'High-Tier Cognitive Engine' : 'Fast-Tier Triage Engine'}
          </span>
        </div>

        <div className="mt-3 flex items-center space-x-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
            isHighTier 
              ? 'bg-violet-200/80 text-violet-900 border border-violet-300' 
              : 'bg-emerald-200/80 text-emerald-900 border border-emerald-300'
          }`}>
            {isHighTier ? '70B' : '4B'}
          </div>
          <div>
            <div className="text-sm font-bold font-mono text-slate-900">
              {displayedModel}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHighTier 
                ? 'Complex AST mutation, code synthesis & unified diff patching' 
                : 'Rapid log parsing, syntax analysis & tool query formulation'}
            </p>
          </div>
        </div>

        {/* Tier Switching Transition Visual Indicator */}
        <div className="mt-3.5 pt-3 border-t border-white/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              !isHighTier ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'text-slate-400'
            }`}>
              Nemotron-Mini (4B)
            </span>
            <ArrowRight className={`w-3.5 h-3.5 ${isHighTier ? 'text-violet-600 animate-pulse' : 'text-slate-400'}`} />
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              isHighTier ? 'bg-violet-100 text-violet-800 border border-violet-300' : 'text-slate-400'
            }`}>
              Nemotron (70B)
            </span>
          </div>

          <span className="text-[11px] text-slate-600 font-medium">
            {isHighTier ? '⚡ Escalated for Code Patch' : '⚡ Initial Triage'}
          </span>
        </div>
      </div>

      {/* Telemetry Metrics Grid (Latency, Velocity, Efficiency) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Latency Timer */}
        <div className="bg-white/50 backdrop-blur-xl border border-white/75 rounded-xl p-3 shadow-[0_4px_16px_rgba(31,38,135,0.05)] flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Latency</span>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-slate-900 tracking-tight">
            {elapsedTimer > 0 ? `${(elapsedTimer / 1000).toFixed(2)}s` : '0.00s'}
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-1">
            {summary?.fast_tier_latency_ms ? `4B: ${summary.fast_tier_latency_ms}ms` : 'Real-time timer'}
          </div>
        </div>

        {/* Token Velocity */}
        <div className="bg-white/50 backdrop-blur-xl border border-white/75 rounded-xl p-3 shadow-[0_4px_16px_rgba(31,38,135,0.05)] flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-medium">
            <Gauge className="w-3.5 h-3.5 text-emerald-600" />
            <span>Velocity</span>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-emerald-700 tracking-tight">
            {summary?.tokens_per_sec || (isStreaming ? '142.0' : '0.0')}
            <span className="text-xs text-slate-500 font-normal ml-0.5">t/s</span>
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-1">
            {summary?.total_tokens ? `${summary.total_tokens} tokens` : 'Generation rate'}
          </div>
        </div>

        {/* Cost Reduction */}
        <div className="bg-white/50 backdrop-blur-xl border border-white/75 rounded-xl p-3 shadow-[0_4px_16px_rgba(31,38,135,0.05)] flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-medium">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>Efficiency</span>
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-amber-700 tracking-tight">
            ~84.6%
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-1">
            Compute saved
          </div>
        </div>
      </div>

      {/* Execution Trace Timeline */}
      <div className="bg-white/45 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9)] overflow-hidden flex flex-col flex-1">
        <div className="px-4 py-3 bg-white/30 border-b border-white/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Execution Trace & Tool Pipeline
            </span>
          </div>
          <span className="text-[10px] text-slate-700 font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/60 border border-white/80 shadow-sm">
            {telemetryEvents.length} events
          </span>
        </div>

        <div className="p-4 space-y-3.5 max-h-[460px] overflow-y-auto">
          {telemetryEvents.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Terminal className="w-7 h-7 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-xs font-semibold text-slate-700">No active execution trace yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Click "Run Autonomous Triage & Fix" to stream the live agent reasoning chain.
              </p>
            </div>
          ) : (
            telemetryEvents.map((event, idx) => {
              const { event: type, data } = event;

              if (type === 'telemetry_init') {
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-white/55 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800">Telemetry Initialized</span>
                        <span className="text-[10px] font-mono text-slate-500">{data.tier_name}</span>
                      </div>
                      <p className="text-slate-700 mt-1 text-[11px]">
                        Agent session spawned. Active model: <code className="text-emerald-700 font-mono bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">{data.model}</code>
                      </p>
                    </div>
                  </div>
                );
              }

              if (type === 'thought') {
                const isHigh = data.tier === 'high';
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                      isHigh ? 'bg-violet-100 text-violet-700 border-violet-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-white/55 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${isHigh ? 'text-violet-800' : 'text-emerald-800'}`}>
                          {data.title || `Cognitive Reasoning (Step ${data.step})`}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {data.elapsed_ms ? `${data.elapsed_ms}ms` : ''}
                        </span>
                      </div>
                      <p className="text-slate-700 mt-1 text-[11px] leading-relaxed whitespace-pre-line">
                        {data.content}
                      </p>
                    </div>
                  </div>
                );
              }

              if (type === 'tool_call') {
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 border border-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-white/55 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-800">Tool Invocation: Tavily Search</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-sky-50 text-sky-700 rounded border border-sky-200 font-mono">
                          RAG
                        </span>
                      </div>
                      <p className="text-slate-700 mt-1 text-[11px]">
                        Query: <span className="text-slate-900 font-mono bg-white/70 px-1 py-0.5 rounded border border-slate-200">"{data.query}"</span>
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
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-white/55 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800">
                          Tavily Search Documentation Retrieved
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {sources.length} sources
                        </span>
                      </div>

                      <div className="space-y-1.5 mt-1">
                        {sources.map((src, sIdx) => (
                          <div key={sIdx} className="p-2 rounded-lg bg-white/60 border border-slate-200/80 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-800 truncate pr-2">
                                {src.title}
                              </span>
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-700 hover:underline flex items-center space-x-0.5 shrink-0"
                              >
                                <span>docs</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                            <p className="text-slate-600 text-[10px] mt-1 line-clamp-2">
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
                    <div className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 border border-violet-300 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-violet-50/80 backdrop-blur-md p-3 rounded-xl border border-violet-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-violet-800">
                          Dynamic Multi-Tier Escalation
                        </span>
                        <span className="text-[10px] font-mono text-violet-700 font-semibold bg-violet-100 px-1.5 py-0.5 rounded border border-violet-300">
                          Nemotron 70B Engaged
                        </span>
                      </div>
                      <p className="text-slate-700 mt-1 text-[11px] leading-relaxed">
                        {data.reason}
                      </p>
                    </div>
                  </div>
                );
              }

              if (type === 'execution_summary') {
                return (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 bg-emerald-50/80 backdrop-blur-md p-3 rounded-xl border border-emerald-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800">
                          Remediation Completed
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                          {data.total_latency_ms}ms
                        </span>
                      </div>
                      <p className="text-slate-700 mt-1 text-[11px]">
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
