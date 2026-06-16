import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Copy,
  Download,
  Calendar,
  ShieldCheck,
  FileSpreadsheet,
  HelpCircle,
  BarChart3,
  Network,
  Brain
} from 'lucide-react';
import { ThemeMode } from '../types';
import { AnalysisResult } from '../api';

interface ReportsScreenProps {
  theme: ThemeMode;
  analysisResult?: AnalysisResult | null;
}

export default function ReportsScreen({ theme, analysisResult }: ReportsScreenProps) {
  const [copied, setCopied] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const hasReport = Boolean(analysisResult);

  const reportJson = analysisResult
    ? JSON.stringify(analysisResult, null, 2)
    : JSON.stringify(
      {
        message: 'No report generated yet. Please analyze a codebase first.'
      },
      null,
      2
    );

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy report.');
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleDownload = (format: string) => {
    setDownloadingFormat(format);

    setTimeout(() => {
      if (format === 'json') {
        downloadFile(reportJson, 'analysis_report.json', 'application/json;charset=utf-8');
      }

      if (format === 'md') {
        const readmeContent =
          analysisResult?.readme ||
          '# No README Generated\n\nPlease analyze a codebase first.';

        downloadFile(readmeContent, 'README_generated.md', 'text/markdown;charset=utf-8');
      }

      if (format === 'txt') {
        const summaryContent =
          analysisResult?.architecture_summary ||
          'No architecture summary generated yet.';

        downloadFile(summaryContent, 'architecture_summary.txt', 'text/plain;charset=utf-8');
      }

      setDownloadingFormat(null);
    }, 500);
  };

  const stats = [
    {
      label: 'Files Analyzed',
      value: analysisResult?.files_analyzed ?? 0,
      icon: <FileText className="w-4 h-4" />
    },
    {
      label: 'Functions Found',
      value: analysisResult?.functions_found ?? 0,
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      label: 'Classes Found',
      value: analysisResult?.classes_found ?? 0,
      icon: <Brain className="w-4 h-4" />
    },
    {
      label: 'Imports Found',
      value: analysisResult?.imports_found ?? 0,
      icon: <Network className="w-4 h-4" />
    }
  ];

  const generatedAt = new Date().toLocaleString();

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-sans">

      <header className="space-y-1 pb-4 border-b border-slate-200/10">
        <h2 className="text-xl sm:text-2xl font-bold font-headline-md">
          Project Reports
        </h2>

        <p className="text-xs text-slate-500 font-label-md">
          {hasReport
            ? `Latest report generated for ${analysisResult?.project_name}`
            : 'No active report yet. Analyze a codebase first.'}
        </p>
      </header>

      <section
        className={`border rounded-xl p-5 space-y-4 ${theme === 'dark'
            ? 'bg-[#122131]/80 border-[#464555] shadow-xs'
            : 'bg-white border-slate-200 shadow-sm'
          }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-bold">Active Report Summary</h3>
            <p className="text-[11px] text-slate-500 font-mono">
              {hasReport ? analysisResult?.project_name : 'No project analyzed'}
            </p>
          </div>

          <div
            className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${hasReport
                ? 'bg-emerald-500/10 border-emerald-500/30 text-[#44f5bd]'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
          >
            {hasReport ? 'READY' : 'EMPTY'}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {stats.map(stat => (
            <div
              key={stat.label}
              className={`rounded-xl border p-4 ${theme === 'dark'
                  ? 'bg-[#1c2b3c]/50 border-[#464555]/30'
                  : 'bg-slate-50 border-slate-100'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className="text-[#8781ff]">{stat.icon}</div>
              </div>

              <p className="text-2xl font-bold text-[#8781ff]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-200/10">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 font-label-md">
            Included In This Report
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Overview', desc: 'Project stats and high-level summary' },
              { label: 'Architecture', desc: 'AI-generated architecture explanation' },
              { label: 'Files', desc: 'Parsed functions, classes, imports, and previews' },
              { label: 'README', desc: 'AI-generated developer documentation' },
              { label: 'Graph', desc: 'Interactive dependency graph' },
              { label: 'Reports', desc: 'Exportable project analysis bundle' }
            ].map(item => (
              <div
                key={item.label}
                className={`flex items-center gap-3 p-3 rounded-xl border ${theme === 'dark'
                    ? 'bg-[#1c2b3c]/50 border-[#464555]/30'
                    : 'bg-slate-50 border-slate-100'
                  }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#8781ff]/10 text-[#8781ff] flex items-center justify-center flex-none">
                  <FileText className="w-4 h-4" />
                </div>

                <div className="truncate pr-1">
                  <p className="text-xs font-bold">{item.label}</p>
                  <p className="text-[10px] text-slate-500 truncate">{item.desc}</p>
                </div>

                <CheckCircle className="w-4 h-4 text-[#44f5bd] ml-auto flex-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`border rounded-xl p-5 space-y-3 ${theme === 'dark'
            ? 'bg-[#122131]/80 border-[#464555]'
            : 'bg-white border-slate-200 shadow-sm'
          }`}
      >
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-label-md">
          Copy Report JSON
        </h3>

        <div className="flex gap-2">
          <div
            className={`flex-1 border rounded-xl px-3.5 py-2.5 flex items-center overflow-hidden ${theme === 'dark'
                ? 'bg-[#010f1f]/80 border-[#464555]'
                : 'bg-slate-50 border-slate-200'
              }`}
          >
            <span className="text-xs truncate font-mono text-[#8781ff]">
              {hasReport
                ? `${analysisResult?.project_name}_analysis_report.json`
                : 'No report generated yet'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyReport}
            className={`px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${theme === 'dark'
                ? 'bg-[#8781ff] text-white hover:bg-[#a9a5ff]'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {copied && (
          <p className="text-[#44f5bd] text-[10px] font-bold text-right tracking-widest animate-pulse leading-none">
            REPORT JSON COPIED TO CLIPBOARD
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 font-label-md">
          Export Formats
        </h3>

        <div className="space-y-2">
          {[
            {
              tag: 'json',
              title: 'JSON Export',
              desc: 'Raw machine-readable analysis result',
              size: 'Dynamic',
              color: 'bg-indigo-500/10 text-indigo-400',
              icon: <FileSpreadsheet className="w-5 h-5" />
            },
            {
              tag: 'md',
              title: 'Markdown README',
              desc: 'AI-generated README documentation',
              size: 'Dynamic',
              color: 'bg-amber-500/10 text-amber-500',
              icon: <FileText className="w-5 h-5" />
            },
            {
              tag: 'txt',
              title: 'Architecture Summary',
              desc: 'AI-generated architecture explanation',
              size: 'Dynamic',
              color: 'bg-emerald-500/10 text-emerald-400',
              icon: <ShieldCheck className="w-5 h-5" />
            }
          ].map(fmt => (
            <div
              key={fmt.tag}
              onClick={() => handleDownload(fmt.tag)}
              className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:scale-[1.005] active:scale-95 transition-all ${theme === 'dark'
                  ? 'bg-[#0d1c2d] border-[#464555] hover:bg-[#122131]'
                  : 'bg-white border-slate-200 hover:bg-slate-50 shadow-xs'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-none ${fmt.color}`}>
                  {fmt.icon}
                </div>

                <div>
                  <p className="text-sm font-bold">{fmt.title}</p>
                  <p className="text-[11px] text-slate-500 leading-none mt-1">
                    {fmt.desc} ({fmt.size})
                  </p>
                </div>
              </div>

              <button className="text-slate-400 p-1">
                {downloadingFormat === fmt.tag ? (
                  <span className="w-4 h-4 rounded-full border border-[#8781ff] border-t-transparent animate-spin block"></span>
                ) : (
                  <Download className="w-4.5 h-4.5 hover:text-[#8781ff]" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-label-md">
          Latest Analysis Details
        </h3>

        <div
          className={`border rounded-xl divide-y overflow-hidden ${theme === 'dark'
              ? 'bg-[#0d1c2d] border-[#464555] divide-[#464555]/40'
              : 'bg-white border-slate-200 divide-slate-100'
            }`}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="space-y-1 pr-2">
              <p className="text-xs font-bold leading-normal">
                {hasReport
                  ? `${analysisResult?.project_name} full codebase analysis`
                  : 'No analysis history yet'}
              </p>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                <Calendar className="w-3 h-3" />
                <span>{generatedAt}</span>
                <span>•</span>
                <span>{hasReport ? 'Local Flask + Ollama' : 'Waiting for analysis'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(hasReport ? reportJson : 'No report generated yet.')}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${theme === 'dark'
                  ? 'bg-[#1c2b3c] border-[#464555] hover:bg-[#8781ff] hover:text-white hover:border-[#8781ff]'
                  : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50'
                }`}
            >
              View
            </button>
          </div>
        </div>
      </section>

      <section
        className={`border rounded-xl p-4 flex items-start gap-3 ${theme === 'dark'
            ? 'bg-[#122131]/70 border-[#464555]'
            : 'bg-white border-slate-200'
          }`}
      >
        <HelpCircle className="w-4 h-4 text-[#8781ff] mt-0.5 flex-none" />

        <div>
          <h3 className="text-sm font-semibold">Report Notes</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Reports are generated locally from your Flask backend. No cloud storage or paid API is required.
            Downloaded files are created directly in your browser from the latest analysis result.
          </p>
        </div>
      </section>
    </div>
  );
}