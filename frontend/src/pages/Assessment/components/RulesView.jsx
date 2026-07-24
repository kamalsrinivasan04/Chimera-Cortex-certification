import React from 'react';
import { ShieldCheck, AlertTriangle, Play, Clock } from 'lucide-react';

const RulesView = ({ onBack, onStart }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[82vh] flex items-center justify-center text-slate-950">
      <div className="bg-white border border-slate-200 p-8 rounded-2xl flex flex-col space-y-6 overflow-y-auto max-h-[80vh] shadow-lg w-full">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center space-x-2">
            <ShieldCheck className="w-7 h-7 text-[#ff6a1f]" />
            <span>Assessment Rules & Instructions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Please read all instructions carefully before starting the exam.</p>
        </div>

        {/* Rules body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            {/* Security */}
            <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-2">
              <h3 className="font-bold text-[#ff6a1f] flex items-center space-x-1.5 text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#ff6a1f]" />
                <span>Security & Integrity</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tab switching, copying, pasting, right-clicking, and exiting fullscreen are strictly prohibited. Doing any of these logs a security violation.
              </p>
              <div className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-100 rounded px-2.5 py-1 inline-block">
                MAXIMUM 3 WARNINGS ALLOWED
              </div>
            </div>

            {/* Attempts */}
            <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-2">
              <h3 className="font-bold text-[#ff6a1f] flex items-center space-x-1.5 text-xs uppercase tracking-wider">
                <Play className="w-4 h-4 shrink-0 text-[#ff6a1f]" />
                <span>Attempt Details</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Only 1 attempt is allowed. Once you begin, you cannot pause or resume later. You must stay online until completion.
              </p>
            </div>

            {/* Fullscreen */}
            <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-2">
              <h3 className="font-bold text-[#ff6a1f] flex items-center space-x-1.5 text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#ff6a1f]" />
                <span>Fullscreen Requirement</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The test runs strictly in fullscreen mode. Leaving fullscreen triggers an immediate integrity warning.
              </p>
            </div>
          </div>

          {/* Timings */}
          <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-3">
            <h3 className="font-bold text-[#ff6a1f] flex items-center space-x-1.5 text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 shrink-0 text-[#ff6a1f]" />
              <span>Timing Allotments</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Timers tick individually for each question. Unanswered questions submit automatically when time expires.
            </p>

            {/* Timing Table */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-50 font-bold border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="px-3 py-2">Question Type</th>
                    <th className="px-3 py-2 text-right">Time Allotment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="px-3 py-2 font-medium text-slate-800">Multiple Choice (MCQ)</td>
                    <td className="px-3 py-2 text-right">30s</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-slate-800">Multiple Selection (MSQ)</td>
                    <td className="px-3 py-2 text-right">45s</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-slate-800">Short Answer</td>
                    <td className="px-3 py-2 text-right">90s (1.5m)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-slate-800">Logical / Analytical</td>
                    <td className="px-3 py-2 text-right">120s (2m)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-slate-800">Scenario-based</td>
                    <td className="px-3 py-2 text-right">240s (4m)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-slate-800">Long Answer</td>
                    <td className="px-3 py-2 text-right">300s (5m)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
          >
            Back to Chat
          </button>
          <button
            onClick={onStart}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-bold text-sm transition-all shadow-[0_10px_24px_rgba(255,106,31,0.22)]"
          >
            Acknowledge & Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesView;
