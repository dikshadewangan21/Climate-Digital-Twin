import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  BrainCircuit, 
  MapPin, 
  History, 
  Sliders, 
  PlaneTakeoff, 
  Columns2, 
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';

export const HomePage = ({ setActiveTab, districts = [], activeDistrict }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300 pb-12 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CHHATTISGARH CLIMATE DIGITAL TWIN</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading leading-tight">
            ClimateTwin <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Climate and weather intelligence platform designed for the 33 districts of Chhattisgarh. Bringing together live weather observations, smart AI-driven forecasts, and multi-year climate history in one accessible place.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer group"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('district-explorer')}
              className="px-6 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Explore 33 Districts</span>
            </button>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-2xl font-black text-white font-heading">33</div>
              <div className="text-xs text-slate-400">Districts Covered</div>
            </div>
            <div>
              <div className="text-2xl font-black text-cyan-400 font-heading">7 to 14</div>
              <div className="text-xs text-slate-400">Days Forecast Range</div>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-400 font-heading">120,000+</div>
              <div className="text-xs text-slate-400">Weather Records</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400 font-heading">8</div>
              <div className="text-xs text-slate-400">Weather Factors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-heading tracking-tight">
              Weather Intelligence & Features
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive tools designed for citizens, farmers, and planners across Chhattisgarh.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* 1. AI Climate Prediction */}
          <div 
            onClick={() => setActiveTab('ai-prediction')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
              Intelligent Weather Forecasts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart artificial intelligence forecasting system analyzing atmospheric factors to predict upcoming temperature, rainfall, wind, and humidity trends.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 pt-1">
              <span>View AI Forecasts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. District Intelligence */}
          <div 
            onClick={() => setActiveTab('district-explorer')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
              District Explorer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live weather conditions across all 33 Chhattisgarh districts including temperature, rainfall, humidity, and heat comfort ratings.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 pt-1">
              <span>Explore All 33 Districts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Climate History */}
          <div 
            onClick={() => setActiveTab('climate-history')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
              Climate History & Trends
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Long-term historical weather charts spanning multiple decades. Explore seasonal temperature shifts, monsoon rainfall cycles, and climate patterns.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 pt-1">
              <span>View Historical Trends</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Scenario Simulation */}
          <div 
            onClick={() => setActiveTab('scenario-simulation')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
              Weather What-If Simulation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive climate simulation tool. Test what happens if temperature rises or rainfall decreases, helping understand agricultural and water impacts.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 pt-1">
              <span>Try Weather Simulation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Travel Assistant */}
          <div 
            onClick={() => setActiveTab('travel-assistant')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <PlaneTakeoff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
              Travel Weather Guide
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              District-specific travel suitability advisory based on live forecasts, rainfall probability, wind speeds, and heat comfort.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 pt-1">
              <span>Check Travel Weather</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. Compare Districts */}
          <div 
            onClick={() => setActiveTab('compare-districts')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all duration-200 cursor-pointer group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <Columns2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-heading group-hover:text-cyan-300 transition-colors">
              District Comparison
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Side-by-side comparison between any Chhattisgarh districts across temperature, rainfall, and humidity.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 pt-1">
              <span>Compare Districts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default HomePage;
