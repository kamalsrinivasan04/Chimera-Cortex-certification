import React from 'react';
import { Download, Award, ShieldCheck, Calendar } from 'lucide-react';

export const CertificatePreview = ({ certificate, onDownload }) => {
  const { certificateId, name, certificationName, level, score, issueDate, verificationHash } = certificate;

  const dateString = new Date(issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-8">
      {/* Dynamic Certificate Card Mockup */}
      <div className="w-full bg-slate-900 border-4 border-double border-yellow-600 p-8 rounded-2xl relative shadow-2xl overflow-hidden text-slate-100 flex flex-col items-center">
        {/* Subtle geometric pattern backgrounds */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-950/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-950/10 rounded-full blur-3xl -z-10"></div>

        {/* Decorative corner borders */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-yellow-600"></div>
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-yellow-600"></div>
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-yellow-600"></div>
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-yellow-600"></div>

        {/* Badge header */}
        <div className="flex flex-col items-center mt-4">
          <div className="w-16 h-16 bg-yellow-600/10 border-2 border-yellow-600 rounded-full flex items-center justify-center text-yellow-500 shadow-md">
            <Award className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-4">
            AI ADAPTIVE CERTIFICATION SYSTEM
          </span>
        </div>

        {/* Certificate Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-500 tracking-wide mt-3 text-center">
          CERTIFICATE OF EXCELLENCE
        </h2>
        
        <p className="text-xs font-medium text-slate-500 italic mt-2">
          This is proudly presented to
        </p>

        {/* Candidate Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider mt-4 underline decoration-slate-700 decoration-double underline-offset-8 text-center">
          {name}
        </h1>

        <p className="text-sm text-slate-400 max-w-xl text-center mt-6">
          for successfully demonstrating proficiency and achieving the requirements of
        </p>

        {/* Course Details */}
        <h3 className="text-xl sm:text-2xl font-bold text-primary-400 text-center mt-2">
          {certificationName} — {level} Level
        </h3>

        {/* Performance Score */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-xs font-semibold px-4 py-1.5 bg-green-950/20 text-green-400 border border-green-800 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>Validated score of {score}% passing criteria</span>
        </div>

        {/* Footer layout: Dates, Details & Signatures */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-6 border-t border-slate-800 items-end">
          {/* Certificate IDs */}
          <div className="text-center sm:text-left space-y-1 text-slate-500">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Certificate ID</span>
            <span className="text-xs font-mono select-all text-slate-300">{certificateId}</span>
            <span className="block text-[10px] font-bold text-slate-400 uppercase pt-2">Date Verified</span>
            <span className="text-xs flex items-center justify-center sm:justify-start space-x-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateString}</span>
            </span>
          </div>

          {/* Verification badge */}
          <div className="flex flex-col items-center text-center">
            <div className="p-1 bg-white rounded-lg">
              {/* Representing verification QR */}
              <div className="w-14 h-14 bg-slate-800 flex items-center justify-center text-[8px] text-white">QR Code</div>
            </div>
            <span className="text-[8px] text-slate-500 mt-2 select-all">Verification Hash: {verificationHash.substring(0, 12)}...</span>
          </div>

          {/* Signature details */}
          <div className="text-center sm:text-right space-y-1">
            <span className="block font-serif italic text-lg text-slate-200">AI Assessor Agent</span>
            <div className="border-t border-slate-700 w-32 sm:w-auto ml-auto"></div>
            <span className="block text-[9px] font-bold text-slate-400 uppercase">Authorized Signature</span>
          </div>
        </div>
      </div>

      {/* Action panel */}
      <button
        onClick={onDownload}
        className="mt-6 flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-95"
      >
        <Download className="w-5 h-5" />
        <span>Download Official PDF Certificate</span>
      </button>
    </div>
  );
};
