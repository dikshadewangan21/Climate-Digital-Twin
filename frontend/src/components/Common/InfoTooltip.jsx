import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export const InfoTooltip = ({ text, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1.5 z-20">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-400 hover:text-cyan-400 focus:outline-none transition-colors p-0.5"
        aria-label="Information"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900/95 border border-cyan-500/30 rounded-lg shadow-2xl backdrop-blur-md text-xs text-slate-200 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          {title && <div className="font-semibold text-cyan-400 mb-1 border-b border-slate-800 pb-1">{title}</div>}
          <p className="leading-relaxed">{text}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
