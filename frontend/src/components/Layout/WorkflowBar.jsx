import React from 'react';
import { 
  Globe, 
  BarChart2, 
  ShieldAlert, 
  Sliders, 
  GitCompare, 
  FileText, 
  ChevronRight
} from 'lucide-react';

const USER_MODULES = [
  { id: 'digital-twin', title: 'Live Climate Map', icon: Globe },
  { id: 'forecast', title: 'Weather Forecast', icon: BarChart2 },
  { id: 'alerts', title: 'Alerts & Risks', icon: ShieldAlert },
  { id: 'scenario', title: 'What-If Scenarios', icon: Sliders },
  { id: 'compare', title: 'Compare Districts', icon: GitCompare },
  { id: 'reports', title: 'Climate Reports', icon: FileText }
];

export const WorkflowBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800/80 px-6 py-2.5 overflow-x-auto no-scrollbar">
      <div className="flex items-center min-w-max gap-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-2 flex items-center gap-1.5 font-sans">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          DECISION MODULES:
        </span>

        {USER_MODULES.map((mod, idx) => {
          const Icon = mod.icon;
          const isActive = activeTab === mod.id;

          return (
            <React.Fragment key={mod.id}>
              <button
                onClick={() => setActiveTab(mod.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 scale-102'
                    : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{mod.title}</span>
              </button>

              {idx < USER_MODULES.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-700 shrink-0 mx-0.5" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowBar;
