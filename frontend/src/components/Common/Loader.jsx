import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      {message && <p className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(254,254,254,0.92)_0%,rgba(247,244,241,0.92)_48%,rgba(240,236,231,0.92)_100%)] backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
