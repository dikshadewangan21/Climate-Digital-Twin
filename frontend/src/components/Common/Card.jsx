import React from 'react';

export const Card = ({ children, className = '', title, icon: Icon, badge, action }) => {
  return (
    <div className={`bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-lg ${className}`}>
      {(title || Icon || badge || action) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Icon className="w-4 h-4" />
              </div>
            )}
            {title && <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">{title}</h3>}
          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                {badge}
              </span>
            )}
            {action}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
