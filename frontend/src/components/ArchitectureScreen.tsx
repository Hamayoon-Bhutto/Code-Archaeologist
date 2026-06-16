import React from 'react';
import { Terminal, Brain, Compass, AlertTriangle, FileText } from 'lucide-react';
import { ThemeMode } from '../types';

interface ArchitectureScreenProps {
  projectId: string;
  theme: ThemeMode;
  architectureSummary?: string;
  onNavigateToFile: (fileName: string) => void;
}

export default function ArchitectureScreen({
  theme,
  architectureSummary
}: ArchitectureScreenProps) {
  const summary =
    architectureSummary ||
    'No architecture summary generated yet. Please analyze a project first.';

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mb-1">
          <span>Projects</span>
          <span>/</span>
          <span className="text-[#8781ff]">Architecture</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-sans flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#8781ff]" />
          Architecture Map
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          AI-generated explanation of the analyzed codebase structure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className={`rounded-xl border p-4 ${theme === 'dark'
              ? 'bg-[#0d1c2d] border-[#464555]'
              : 'bg-white border-slate-200'
            }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-[#8781ff]" />
            <h3 className="text-sm font-semibold">AI Architecture Summary</h3>
          </div>

          <p className="text-xs text-slate-500">
            High-level explanation of how the project is organized.
          </p>
        </div>

        <div
          className={`rounded-xl border p-4 ${theme === 'dark'
              ? 'bg-[#0d1c2d] border-[#464555]'
              : 'bg-white border-slate-200'
            }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-[#44f5bd]" />
            <h3 className="text-sm font-semibold">Where to Start</h3>
          </div>

          <p className="text-xs text-slate-500">
            Helps new developers understand which files to read first.
          </p>
        </div>

        <div
          className={`rounded-xl border p-4 ${theme === 'dark'
              ? 'bg-[#0d1c2d] border-[#464555]'
              : 'bg-white border-slate-200'
            }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold">Risks / Warnings</h3>
          </div>

          <p className="text-xs text-slate-500">
            Highlights confusing or risky areas in the legacy codebase.
          </p>
        </div>
      </div>

      <div
        className={`rounded-xl border overflow-hidden ${theme === 'dark'
            ? 'bg-[#0d1c2d] border-[#464555]'
            : 'bg-white border-slate-200'
          }`}
      >
        <div
          className={`p-4 border-b flex items-center gap-2 ${theme === 'dark' ? 'border-[#464555]' : 'border-slate-200'
            }`}
        >
          <FileText className="w-4 h-4 text-[#8781ff]" />
          <h3 className="text-sm font-semibold">Full Architecture Report</h3>
        </div>

        <div
          className={`p-5 ${theme === 'dark'
              ? 'bg-[#010f1f]/60 text-slate-300'
              : 'bg-slate-50/50 text-slate-700'
            }`}
        >
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {summary}
          </pre>
        </div>
      </div>
    </div>
  );
}