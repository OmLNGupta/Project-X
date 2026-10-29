import React from 'react';
import { 
  X, 
  History, 
  Clock, 
  Cpu, 
  ArrowUpRight, 
  FileText, 
  CheckCircle2 
} from 'lucide-react';

export default function IncidentHistoryModal({
  isOpen,
  onClose,
  incidents = [],
  onSelectIncident
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/65 backdrop-blur-2xl w-full max-w-2xl rounded-3xl border border-white/85 shadow-[0_20px_50px_rgba(31,38,135,0.12),inset_0_1px_1px_0_rgba(255,255,255,0.9)] flex flex-col max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white/40 border-b border-white/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-300 text-teal-800 flex items-center justify-center shadow-sm">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Incident Remediation History</h2>
              <p className="text-xs text-slate-500">Stored in lightweight SQLite persistence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/60 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Incidents List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {incidents.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">No recorded incidents yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Run an autonomous triage session to persist telemetry logs and patches.
              </p>
            </div>
          ) : (
            incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => {
                  onSelectIncident(inc);
                  onClose();
                }}
                className="group p-4 rounded-2xl bg-white/50 hover:bg-white/80 border border-white/70 hover:border-teal-300 cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                      {inc.title || 'Incident Triage'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/70 text-slate-600 border border-white/80">
                      {inc.id}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mt-2 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{inc.latency_ms ? `${(inc.latency_ms / 1000).toFixed(2)}s` : 'N/A'}</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Cpu className="w-3 h-3 text-emerald-600" />
                      <span className="font-mono text-slate-700 font-medium">
                        {inc.high_model ? inc.high_model.split('/').pop() : 'Nemotron 70B'}
                      </span>
                    </span>

                    <span className="text-emerald-700 font-mono text-[10px] font-bold">
                      ~{inc.cost_reduction_percent || 84.6}% saved
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-slate-400 group-hover:text-teal-700 transition-colors">
                  <span className="text-xs font-semibold hidden sm:inline">Load</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white/40 border-t border-white/60 flex items-center justify-between text-xs text-slate-500">
          <span>{incidents.length} stored incidents</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white/60 hover:bg-white/90 text-slate-700 font-semibold border border-white/80 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
