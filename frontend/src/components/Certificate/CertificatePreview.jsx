import React from 'react';
import { Download, Calendar } from 'lucide-react';
import chimeraLogo from '../../assets/Chimera Technologies Emblem.png';

export const CertificatePreview = ({ certificate, onDownload }) => {
  const { certificateId, name, certificationName, level, score, issueDate, verificationHash } = certificate;

  const dateString = new Date(issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  const expiryString = expiryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-8">
      {/* Dynamic Certificate Card Mockup */}
      <div className="w-full aspect-[1.414/1] bg-white border border-slate-200 p-8 rounded-2xl relative shadow-[0_25px_80px_-35px_rgba(17,17,17,0.28)] overflow-hidden text-slate-900 flex flex-col items-center justify-between select-none">
        
        {/* CORNER RIBBON DECORATIONS (Template Match) */}
        {/* Top-Left red/orange ribbons */}
        <div className="absolute top-0 left-0 w-44 h-44 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[240px] h-[240px] bg-[#ff4a03] -translate-x-[120px] -translate-y-[120px] rotate-45"></div>
          <div className="absolute top-0 left-0 w-[240px] h-[240px] bg-[#ff6a1f] -translate-x-[140px] -translate-y-[140px] rotate-45"></div>
        </div>

        {/* Bottom-Right red/orange ribbons */}
        <div className="absolute bottom-0 right-0 w-44 h-44 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[240px] h-[240px] bg-[#ff4a03] translate-x-[120px] translate-y-[120px] rotate-45"></div>
          <div className="absolute bottom-0 right-0 w-[240px] h-[240px] bg-[#ff6a1f] translate-x-[140px] translate-y-[140px] rotate-45"></div>
        </div>

        {/* Gold Seal Rosette in top-left */}
        <div className="absolute top-[60px] left-[60px] flex flex-col items-center pointer-events-none z-10">
          <div className="relative w-14 h-14 bg-[#fbbf24] border-4 border-[#d97706] rounded-full flex items-center justify-center shadow-md">
            {/* Rosette ribbon tails */}
            <div className="absolute bottom-[-15px] left-[10px] w-3 h-8 bg-[#d97706] -rotate-12 origin-top"></div>
            <div className="absolute bottom-[-15px] right-[10px] w-3 h-8 bg-[#d97706] rotate-12 origin-top"></div>
            {/* Inner golden star circle */}
            <div className="w-10 h-10 bg-[#fbbf24] rounded-full border border-dashed border-[#b45309] flex items-center justify-center font-bold text-[#b45309] text-[8px]">
              ★ AI ★
            </div>
          </div>
        </div>

        {/* Brand Group at top center */}
        <div className="flex items-center space-x-3.5 z-10">
          <img src={chimeraLogo} alt="Chimera Logo" className="w-12 h-12 object-contain" />
          <div className="text-left flex flex-col justify-center">
            <span className="font-sans font-extrabold text-lg text-slate-800 leading-none tracking-wide">CHIMERA</span>
            <span className="font-sans text-[8px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">Built on Trust, Building Tech</span>
          </div>
        </div>

        {/* Certificate Typography */}
        <div className="w-full text-center flex flex-col items-center justify-center space-y-3 z-10 flex-1 my-auto">
          <h2 className="text-xl sm:text-2xl font-black text-slate-700 tracking-[0.2em] uppercase leading-none">
            C E R T I F I C A T E
          </h2>
          <p className="text-sm font-serif italic text-slate-500 leading-none">
            of Completion
          </p>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none pt-2">
            THIS CERTIFICATE IS PRESENTED TO
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-none py-1">
            {name}
          </h1>
          
          <div className="text-[10px] sm:text-xs text-slate-600 max-w-xl leading-relaxed space-y-1">
            <p>for successfully completing the adaptive assessment and demonstrating excellence in</p>
            <p className="text-sm font-bold text-slate-900">"Cortex Training: {level}"</p>
            <p>as a certified {certificationName}.</p>
          </div>
        </div>

        {/* Footer Details, Verification QR & Signatures */}
        <div className="w-full grid grid-cols-3 gap-4 items-end z-10 pt-4 border-t border-slate-100">
          {/* Left Details */}
          <div className="text-left space-y-1 text-slate-600 text-[8px] sm:text-[9px]">
            <span className="block font-bold text-slate-400 uppercase leading-none">Certificate ID</span>
            <span className="font-mono font-semibold select-all text-slate-850 block">{certificateId}</span>
            
            <span className="block font-bold text-slate-400 uppercase leading-none pt-1">Date of Issuance</span>
            <span className="flex items-center space-x-1 text-slate-700 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{dateString}</span>
            </span>

            <span className="block font-bold text-slate-400 uppercase leading-none pt-1">Validity (1 Year)</span>
            <span className="text-slate-750 block font-semibold">Expires: {expiryString}</span>
          </div>

          {/* Verification Hash Representation */}
          <div className="flex flex-col items-center text-center">
            <div className="p-1 bg-white border border-slate-100 rounded-lg shadow-sm">
              <div className="w-14 h-14 bg-slate-900 flex flex-col items-center justify-center rounded p-1 select-all cursor-copy">
                {/* Visual indicator of barcode/QR */}
                <div className="w-10 h-10 border border-dashed border-white/20 flex items-center justify-center text-[6px] text-white/50">
                  QR
                </div>
              </div>
            </div>
            <span className="text-[7px] text-slate-400 mt-1 select-all font-mono">Verify Hash: {verificationHash.substring(0, 10)}...</span>
          </div>

          {/* Right Signature */}
          <div className="text-right space-y-1 pb-1">
            <span className="block font-serif text-slate-800 text-[10px] sm:text-xs font-semibold">Karthick Purushothaman</span>
            <div className="border-t border-slate-200 w-full"></div>
            <span className="block text-[8px] font-bold text-slate-400 uppercase leading-none">CTO - Founder</span>
          </div>
        </div>

      </div>

      {/* Action panel */}
      <button
        type="button"
        onClick={onDownload}
        className="mt-6 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-bold rounded-xl transition-all shadow-[0_10px_24px_rgba(255,106,31,0.22)] active:scale-95 z-20"
      >
        <Download className="w-4 h-4" />
        <span>Download Combined PDF Certificate & Report</span>
      </button>
    </div>
  );
};
