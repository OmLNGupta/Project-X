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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-nebius/15 text-nebius flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Incident Remediation History</h2>
              <p className="text-xs text-slate-400">Stored in lightweight SQLite persistence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Incidents List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {incidents.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-medium">No recorded incidents yet</p>
              <p className="text-xs text-slate-600 mt-1">
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
                className="group p-3.5 rounded-xl bg-surface/70 hover:bg-surface border border-border hover:border-nebius/40 cursor-pointer transition-all flex items-center justify-between shadow-sm"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-nebius transition-colors">
                      {inc.title || 'Incident Triage'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                      {inc.id}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{inc.latency_ms ? `${(inc.latency_ms / 1000).toFixed(2)}s` : 'N/A'}</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Cpu className="w-3 h-3 text-nvidia" />
                      <span className="font-mono text-slate-300">
                        {inc.high_model ? inc.high_model.split('/').pop() : 'Nemotron 70B'}
                      </span>
                    </span>

                    <span className="text-emerald-400 font-mono text-[10px]">
                      ~{inc.cost_reduction_percent || 84.6}% saved
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-slate-500 group-hover:text-nebius transition-colors">
                  <span className="text-xs font-medium hidden sm:inline">Load</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface/60 border-t border-border flex items-center justify-between text-xs text-slate-400">
          <span>{incidents.length} stored incidents</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
