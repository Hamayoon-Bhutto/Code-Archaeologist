import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, PlayCircle, Shield, CheckCircle, Navigation, Clock, Sun, Moon, Sparkles } from 'lucide-react';
import { ActiveScreen, ThemeMode, RiskIndicator, StartingPath } from '../types';
import { ProjectStats, RISK_INDICATORS, START_GUIDES } from '../data';

interface OverviewScreenProps {
  project: ProjectStats;
  theme: ThemeMode;
  onThemeToggle: () => void;
  onSelectRisk: (risk: RiskIndicator) => void;
  onSelectFile: (fileName: string) => void;
}

export default function OverviewScreen({
  project,
  theme,
  onThemeToggle,
  onSelectRisk,
  onSelectFile
}: OverviewScreenProps) {
  const [regenerating, setRegenerating] = useState(false);
  const [archSummary, setArchSummary] = useState(project.summary);
  const [selectedRiskDetail, setSelectedRiskDetail] = useState<string | null>(null);

  const handleRegenerateArch = () => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      setArchSummary(
        project.summary + ' [AIs update]: Graph-traversal algorithms parsed successfully on the active repository branches. We detected standard isolated interfaces facilitating easy refactoring.'
      );
    }, 1200);
  };

  const getRiskIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />;
      case 'CheckCircle':
        return <CheckCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />;
      case 'Navigation':
        return <Navigation className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />;
      default:
        return <Shield className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section with Light Theme Option directly on Dashboard */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200/10">
        <div>
          <p className="text-xs uppercase font-semibold text-[#44f5bd] tracking-widest mb-1 font-label-md">
            Analysis Complete
          </p>
          <h2 className="text-2xl font-bold font-headline-md">
            Overview: {project.branch || 'main-branch'}
          </h2>
        </div>

        {/* Dynamic Theme Toggle Action */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onThemeToggle}
            type="button"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
              theme === 'dark'
                ? 'bg-[#122131] border-[#464555] hover:border-[#8781ff] text-white'
                : 'bg-white border-slate-200 hover:border-indigo-500 text-slate-800 shadow-sm'
            }`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Dark Theme</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Top Metrics Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3.5">
        
        {/* Total Files Card */}
        <div className={`p-4 rounded-xl border flex flex-col gap-1 transition-all hover:translate-y-[-2px] ${
          theme === 'dark' ? 'bg-[#122131] border-[#464555]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs font-medium text-slate-400 font-label-md">Total Files</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-headline-lg font-bold text-[#8781ff]">
              {project.totalFiles}
            </span>
            <span className="text-[10px] text-slate-500 font-medium font-mono">{project.filesDiff}</span>
          </div>
        </div>

        {/* Functions Card */}
        <div className={`p-4 rounded-xl border flex flex-col gap-1 transition-all hover:translate-y-[-2px] ${
          theme === 'dark' ? 'bg-[#122131] border-[#464555]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs font-medium text-slate-400 font-label-md font-sans">Functions</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-headline-lg font-bold text-[#44f5bd]">
              {project.functions}
            </span>
            <span className="text-[10px] text-[#44f5bd] font-medium font-mono">{project.coverage}</span>
          </div>
        </div>

        {/* Complexity Card */}
        <div className={`p-4 rounded-xl border flex flex-col gap-1 transition-all hover:translate-y-[-2px] ${
          theme === 'dark' ? 'bg-[#122131] border-[#464555]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs font-medium text-slate-400 font-label-md">Complexity</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-headline-lg font-bold text-[#ffb785]">
              {project.complexity}
            </span>
            <span className="text-[10px] text-[#ffb785] font-medium font-mono">{project.grade}</span>
          </div>
        </div>

        {/* Onboarding Estimate Card */}
        <div className={`p-4 rounded-xl border flex flex-col gap-1 transition-all hover:translate-y-[-2px] ${
          theme === 'dark' ? 'bg-[#122131] border-[#464555]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-xs font-medium text-slate-400 font-label-md">Onboarding</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-headline-lg font-bold text-[#44f5bd]">
              {project.onboarding}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Est.</span>
          </div>
        </div>

      </div>

      {/* Architecture Summary Card with purple top-border styling */}
      <section className={`border-l-4 border-l-[#8781ff] rounded-xl border p-5 shadow-sm ${
        theme === 'dark' 
          ? 'bg-[#122131] border-y-[#464555] border-r-[#464555]' 
          : 'bg-white border-y-slate-200 border-r-slate-200'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-[#8781ff] uppercase tracking-wider font-label-md">
            Architecture Summary
          </h3>
          <button
            onClick={handleRegenerateArch}
            type="button"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-[#8781ff] transition-colors uppercase tracking-tight"
          >
            <RefreshCw className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
        </div>
        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-350' : 'text-slate-600'}`}>
          {regenerating ? (
            <span className="flex items-center gap-2 text-slate-500 italic animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Generating fresh modular representations...
            </span>
          ) : (
            <>
              CodeArchaeologist follows a modularized event-driven architecture. The core logic resides in{' '}
              <code className={`font-mono px-1 py-0.5 rounded text-xs px-1.5 ${
                theme === 'dark' ? 'bg-[#1c2b3c] text-[#ffb785]' : 'bg-slate-100/80 text-orange-600 border border-slate-200'
              }`}>
                /src/engine
              </code>
              , utilizing a high-performance graph traversal for dependency mapping. Interaction flows primarily through a centralized dispatcher, minimizing tight coupling between analysis modules. See additional metrics in reports.
            </>
          )}
        </p>
      </section>

      {/* Risk Indicators section with toggles */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-label-md">
          Risk Indicators
        </h3>
        
        {selectedRiskDetail && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed animate-fade-in ${
            theme === 'dark' ? 'bg-[#1c2b3c] border-[#8781ff] text-amber-200' : 'bg-[#e3dfff]/20 border-[indigo-400] text-[#1b0091]'
          }`}>
            <span className="font-bold uppercase tracking-wider block mb-1">Risk Detail Insight:</span>
            <span>{selectedRiskDetail}</span>
            <button 
              onClick={() => setSelectedRiskDetail(null)}
              className="mt-2 text-[10px] font-bold block text-slate-500 hover:underline"
            >
              Dismiss info
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {RISK_INDICATORS.map((risk) => (
            <div
              key={risk.title}
              onClick={() => {
                setSelectedRiskDetail(risk.details);
                onSelectRisk(risk);
              }}
              className={`flex items-center justify-between border rounded-xl p-3.5 cursor-pointer group transition-all hover:bg-slate-500/5 ${
                theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-100 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRiskIcon(risk.icon)}
                <span className="text-sm font-semibold">{risk.title}</span>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded select-none ${
                risk.color === 'error'
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                  : risk.color === 'tertiary'
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  : risk.color === 'secondary'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-450'
                  : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
              }`}>
                {risk.valueLabel}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Horizontal scrolling 'Where to start' guides */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-label-md">
            Where to Start
          </h3>
          <span className="text-[10px] text-[#8781ff] font-semibold tracking-wider">Recommended Path</span>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
          {START_GUIDES.map((guide, idx) => (
            <div
              key={guide.id}
              onClick={() => onSelectFile(guide.file)}
              className={`min-w-[245px] max-w-[245px] snap-center border rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden cursor-pointer transition-all hover:border-[#8781ff] hover:scale-[1.01] ${
                theme === 'dark' ? 'bg-[#1c2b3c] border-[#464555]' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Giant numeral backdrop opacity watermarks */}
              <div className="absolute top-0 right-0 p-2 opacity-[0.03]">
                <span className="text-5xl font-extrabold font-headline-lg">{idx + 1}</span>
              </div>

              <span className="font-mono text-xs font-semibold text-[#8781ff] truncate">
                {guide.file}
              </span>
              <p className={`text-xs line-clamp-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {guide.description}
              </p>
              
              <div className="flex items-center gap-2 mt-auto pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] text-slate-500 font-semibold">{guide.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
