import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} AI Adaptive Certification Assessment Platform. All rights reserved.</p>
        <p className="mt-1 text-slate-500">Enterprise Grade • Safe & Secure • Real-time AI Grading</p>
      </div>
    </footer>
  );
};

export default Footer;
