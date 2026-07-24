import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SubmitConfirmModal = ({ isOpen, questionNum, totalQuestions, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  const isPremature = questionNum < totalQuestions;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <div className="flex items-center space-x-3 text-red-500">
          <AlertTriangle className="w-8 h-8 shrink-0" />
          <h3 className="text-lg font-bold text-slate-950">
            {isPremature ? 'Terminate & Submit Assessment?' : 'Submit Assessment?'}
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {isPremature
            ? `Warning: You have only answered ${questionNum} out of ${totalQuestions} questions. Submitting now will prematurely terminate your exam, and this attempt will be permanently marked as incomplete/terminated.`
            : `You have completed all ${totalQuestions} questions. Are you sure you want to submit your answers for final AI grading?`}
        </p>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-semibold rounded-xl text-xs transition-all shadow-[0_8px_18px_rgba(255,106,31,0.22)]"
          >
            {isPremature ? 'Yes, Terminate & Submit' : 'Yes, Submit Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmModal;
