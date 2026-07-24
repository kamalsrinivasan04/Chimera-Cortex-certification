import React from 'react';
import { AlertTriangle } from 'lucide-react';

const WarningModal = ({ isOpen, warningMessage, cheatingCount, onAcknowledge }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto animate-pulse" />
        <h3 className="text-lg font-bold text-slate-950">Security Alert</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{warningMessage}</p>
        <div className="text-xs text-red-500 font-bold uppercase tracking-wider">
          Violations: {cheatingCount} / 3
        </div>
        <button
          onClick={onAcknowledge}
          className="w-full py-2 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-semibold rounded-xl text-xs transition-all shadow-[0_10px_24px_rgba(255,106,31,0.20)]"
        >
          Acknowledge & Resume
        </button>
      </div>
    </div>
  );
};

export default WarningModal;
