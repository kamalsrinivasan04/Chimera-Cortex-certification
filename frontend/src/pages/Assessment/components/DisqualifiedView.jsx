import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisqualifiedView = ({ terminationReason, onRestart }) => {
  return (
    <div className="bg-white border border-red-200 p-8 rounded-2xl flex flex-col items-center justify-center space-y-6 my-auto text-center shadow-sm">
      <AlertTriangle className="w-16 h-16 text-red-500 animate-bounce" />
      <h2 className="text-2xl font-extrabold text-slate-950">
        {terminationReason === 'user-abort' ? 'Assessment Terminated' : 'Assessment Disqualified'}
      </h2>
      <p className="text-sm text-slate-600 max-w-md">
        {terminationReason === 'user-abort'
          ? 'You chose to submit the assessment before finishing all questions. This attempt has been terminated and permanently discarded.'
          : 'The security integrity system logged 3 or more tab switching/exit-fullscreen events. This attempt has been permanently discarded.'}
      </p>
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-semibold rounded-xl text-sm transition-all shadow-[0_10px_24px_rgba(255,106,31,0.22)]"
      >
        Restart New Assessment
      </button>
    </div>
  );
};

export default DisqualifiedView;
