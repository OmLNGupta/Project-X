import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import IncidentWorkspace from './components/IncidentWorkspace';
import AgentInspector from './components/AgentInspector';
import IncidentHistoryModal from './components/IncidentHistoryModal';
import ArchitectureModal from './components/ArchitectureModal';

const DEFAULT_SAMPLES = [
  {
    id: "pydantic-v2-crash",
    name: "Pydantic v2 Deprecation Crash (Hero Scenario)",
    badge: "Critical AST Migration",
    error_log: `Traceback (most recent call last):
  File "/app/services/user_service.py", line 14, in <module>
    class UserPayload(BaseModel):
  File "pydantic/main.py", line 198, in __new__
    return super().__new__(mcs, name, bases, namespace, **kwargs)
pydantic.errors.PydanticUserError: The \`@validator\` decorator has been removed in Pydantic V2. Please use \`@field_validator\` instead.
See https://docs.pydantic.dev/2.0/migration/ for more information.

During handling of the above exception, another exception occurred:
ImportError: cannot import name 'BaseSettings' from 'pydantic' (/usr/local/lib/python3.11/site-packages/pydantic/__init__.py)`,
    code_snippet: `from pydantic import BaseModel, validator, BaseSettings

class ServiceSettings(BaseSettings):
    app_name: str = "Project X Engine"
    port: int = 8000
    environment: str = "production"

class UserPayload(BaseModel):
    username: str
    email: str
    role: str = "analyst"

    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('username must be at least 3 characters')
        return v.lower()

    class Config:
        schema_extra = {"example": {"username": "admin", "email": "ops@projectx.ai"}}

def export_user_data(user: UserPayload) -> dict:
    return user.dict(exclude={"role"})`
  },
  {
    id: "fastapi-lifespan-deprecation",
    name: "FastAPI Lifespan Events Deprecation",
    badge: "Async Lifecycle",
    error_log: `DeprecationWarning: on_event is deprecated, use lifespan event handlers instead.
  See https://fastapi.tiangolo.com/advanced/events/ for more information.
  @app.on_event("startup")
  def startup_event():
      pass`,
    code_snippet: `from fastapi import FastAPI
import asyncio

app = FastAPI(title="Project X Microservice")

@app.on_event("startup")
async def startup_event():
    print("Connecting to Redis cache and warming model weights...")

@app.on_event("shutdown")
async def shutdown_event():
    print("Flushing buffers and closing active telemetry streams...")

@app.get("/health")
def health():
    return {"status": "ok"}`
  }
];

export default function App() {
  const [errorLog, setErrorLog] = useState(DEFAULT_SAMPLES[0].error_log);
  const [codeSnippet, setCodeSnippet] = useState(DEFAULT_SAMPLES[0].code_snippet);
  const [diff, setDiff] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTier, setActiveTier] = useState('fast');
  const [currentModel, setCurrentModel] = useState('nvidia/nemotron-mini-4b-instruct');
  const [telemetryEvents, setTelemetryEvents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [startTime, setStartTime] = useState(null);
  
  const [healthInfo, setHealthInfo] = useState({
    status: 'connecting',
    mode: 'mock_simulated',
    nebius_base_url: 'https://api.tokenfactory.nebius.com/v1/',
    fast_model: 'nvidia/nemotron-mini-4b-instruct',
    high_model: 'nvidia/Llama-3.1-Nemotron-70B-Instruct'
  });
  
  const [samples, setSamples] = useState(DEFAULT_SAMPLES);
  const [incidents, setIncidents] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  // Fetch initial health and incident history
  const fetchHealthAndHistory = useCallback(async () => {
    try {
      const healthRes = await fetch('/api/v1/health');
      if (healthRes.ok) {
        const data = await healthRes.json();
        setHealthInfo(data);
        if (data.fast_model) setCurrentModel(data.fast_model);
      }
    } catch (e) {
      console.warn("Backend not yet connected:", e);
    }

    try {
      const incRes = await fetch('/api/v1/incidents');
      if (incRes.ok) {
        const incData = await incRes.json();
        setIncidents(incData.incidents || []);
      }
    } catch (e) {
      console.warn("Could not fetch incident history:", e);
    }

    try {
      const samplesRes = await fetch('/api/v1/samples');
      if (samplesRes.ok) {
        const sData = await samplesRes.json();
        if (sData.samples && sData.samples.length > 0) {
          setSamples(sData.samples);
        }
      }
    } catch (e) {
      console.warn("Could not fetch samples:", e);
    }
  }, []);

  useEffect(() => {
    fetchHealthAndHistory();
  }, [fetchHealthAndHistory]);

  // Load a preset sample
  const handleLoadPreset = (index) => {
    if (samples[index]) {
      setErrorLog(samples[index].error_log);
      setCodeSnippet(samples[index].code_snippet);
      setDiff('');
      setTelemetryEvents([]);
      setSummary(null);
      setActiveTier('fast');
      setCurrentModel(healthInfo.fast_model || 'nvidia/nemotron-mini-4b-instruct');
    }
  };

  // Load an incident from history
  const handleSelectIncident = (inc) => {
    setErrorLog(inc.error_log || '');
    setCodeSnippet(inc.code_snippet || '');
    setDiff(inc.resolution_diff || '');
    if (inc.high_model) setCurrentModel(inc.high_model);
    setActiveTier('high');
    setSummary({
      total_latency_ms: inc.latency_ms,
      total_tokens: inc.tokens_used,
      tokens_per_sec: inc.tokens_used && inc.latency_ms ? (inc.tokens_used / (inc.latency_ms / 1000)).toFixed(1) : 150,
      cost_reduction_percent: inc.cost_reduction_percent || 84.6
    });
  };

  // Run autonomous triage via SSE stream
  const handleRunTriage = async () => {
    if (isStreaming || (!errorLog && !codeSnippet)) return;

    setIsStreaming(true);
    setDiff('');
    setTelemetryEvents([]);
    setSummary(null);
    setActiveTier('fast');
    setCurrentModel(healthInfo.fast_model || 'nvidia/nemotron-mini-4b-instruct');
    const startTimestamp = Date.now();
    setStartTime(startTimestamp);

    try {
      const response = await fetch('/api/v1/agent/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
          error_log: errorLog,
          code_snippet: codeSnippet,
          title: errorLog.includes('pydantic') ? 'Pydantic v2 Deprecation Crash' : 'Incident Triage',
          language: 'python'
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const block of parts) {
          if (!block.trim()) continue;
          
          let eventType = 'message';
          let eventData = null;

          const lines = block.split('\n');
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.replace('event: ', '').trim();
            } else if (line.startsWith('data: ')) {
              try {
                eventData = JSON.parse(line.replace('data: ', '').trim());
              } catch (parseErr) {
                console.warn("JSON parse error on SSE line:", line);
              }
            }
          }

          if (!eventData) continue;

          // Dispatch Event Handling
          if (eventType === 'telemetry_init') {
            setActiveTier('fast');
            if (eventData.model) setCurrentModel(eventData.model);
            setTelemetryEvents(prev => [...prev, { event: eventType, data: eventData }]);
          } else if (eventType === 'thought') {
            if (eventData.tier) setActiveTier(eventData.tier);
            if (eventData.model) setCurrentModel(eventData.model);
            setTelemetryEvents(prev => [...prev, { event: eventType, data: eventData }]);
          } else if (eventType === 'tool_call' || eventType === 'tool_result') {
            setTelemetryEvents(prev => [...prev, { event: eventType, data: eventData }]);
          } else if (eventType === 'telemetry_switch') {
            setActiveTier('high');
            setCurrentModel(eventData.to_model || healthInfo.high_model || 'nvidia/Llama-3.1-Nemotron-70B-Instruct');
            setTelemetryEvents(prev => [...prev, { event: eventType, data: eventData }]);
          } else if (eventType === 'patch_stream') {
            setDiff(eventData.cumulative_diff || '');
          } else if (eventType === 'execution_summary') {
            setSummary(eventData);
            setTelemetryEvents(prev => [...prev, { event: eventType, data: eventData }]);
          }
        }
      }

    } catch (err) {
      console.error("SSE stream error:", err);
      setTelemetryEvents(prev => [
        ...prev,
        {
          event: 'thought',
          data: {
            step: 0,
            tier: 'fast',
            title: 'Stream Connection Error',
            content: `Failed to stream triage: ${err.message}. Please verify the backend is running.`
          }
        }
      ]);
    } finally {
      setIsStreaming(false);
      setTimeout(fetchHealthAndHistory, 500);
    }
  };

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunTriage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [errorLog, codeSnippet, isStreaming]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 relative overflow-x-hidden text-slate-800 font-sans selection:bg-violet-200 selection:text-violet-900 flex flex-col">
      
      {/* =========================================================================
          1. VIBRANT AMBIENT BACKGROUND: Fixed glowing orbs behind the glass UI
          ========================================================================= */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Top-left vibrant cyan/sky glow */}
        <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-cyan-400/35 blur-[120px]" />
        
        {/* Center-right electric violet glow */}
        <div className="absolute top-1/4 -right-20 w-[42rem] h-[42rem] rounded-full bg-violet-500/30 blur-[140px]" />
        
        {/* Bottom-left fuchsia/orchid glow */}
        <div className="absolute -bottom-24 left-1/3 w-[38rem] h-[38rem] rounded-full bg-fuchsia-400/25 blur-[130px]" />
        
        {/* Top-center soft blue beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-64 bg-blue-300/30 blur-[100px]" />
      </div>

      {/* Top Navigation */}
      <Header
        healthInfo={healthInfo}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={incidents.length}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Hero Banner in true Frosted Glassmorphism */}
        <div className="mb-6 p-5 rounded-2xl bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.08)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Autonomous DevOps & SRE Incident Remediation Agent
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Powered by <strong className="text-sky-700 font-semibold">Nebius AI Token Factory</strong> and <strong className="text-emerald-700 font-semibold">NVIDIA Nemotron</strong> models. Features dynamic multi-tier cognitive routing: ultra-fast 4B AST triage, real-time Tavily search RAG, and deep 70B unified git diff synthesis.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => handleLoadPreset(0)}
              className="bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/80 text-violet-900 font-semibold text-xs px-4 py-2 rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98] flex items-center space-x-1.5"
            >
              <span>⚡ 1-Click Hero Demo</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Workspace (Incident Inputs & Diff Viewer): 7 Cols */}
          <div className="lg:col-span-7">
            <IncidentWorkspace
              errorLog={errorLog}
              setErrorLog={setErrorLog}
              codeSnippet={codeSnippet}
              setCodeSnippet={setCodeSnippet}
              diff={diff}
              isStreaming={isStreaming}
              onRunTriage={handleRunTriage}
              onLoadPreset={handleLoadPreset}
              samples={samples}
            />
          </div>

          {/* Right Panel (Agent Inspector & Telemetry HUD): 5 Cols */}
          <div className="lg:col-span-5 sticky top-20">
            <AgentInspector
              activeTier={activeTier}
              currentModel={currentModel}
              telemetryEvents={telemetryEvents}
              isStreaming={isStreaming}
              summary={summary}
              startTime={startTime}
            />
          </div>

        </div>
      </main>

      {/* Footer in Frosted Glass */}
      <footer className="relative z-10 mt-12 border-t border-white/60 bg-white/40 backdrop-blur-xl py-4 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Project X © 2026 Om Laxmi Narayan Gupta. Released under the MIT License.
          </div>
          <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-600">
            <span>Nebius x NVIDIA Global AI Hackathon</span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Best Apps & Agents Track</span>
          </div>
        </div>
      </footer>

      {/* Incident History Drawer */}
      <IncidentHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        incidents={incidents}
        onSelectIncident={handleSelectIncident}
      />

      {/* Architecture & Flow Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

    </div>
  );
}
