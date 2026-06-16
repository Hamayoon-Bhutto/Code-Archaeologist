import React, { useState } from 'react';
import { FileText, CheckCircle, Copy, Download, Calendar, ArrowRight, ShieldCheck, FileSpreadsheet, HelpCircle } from 'lucide-react';
import { ThemeMode } from '../types';
import { MOCK_REPORT_HISTORY } from '../data';

interface ReportsScreenProps {
  theme: ThemeMode;
}

export default function ReportsScreen({ theme }: ReportsScreenProps) {
  const [copied, setCopied] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const handleCopyLink = () => {
    setCopied(true);
    navigator.clipboard.writeText('https://codearc.io/r/a7f3-k92m-z10x');
    setTimeout(() => setCopied(false), 2000);
  };

  const startFakeDownload = (format: string) => {
    setDownloadingFormat(format);
    setTimeout(() => {
      setDownloadingFormat(null);
      alert(`Simulation: Successfully triggered download path for CodeArchaeologist_${format}.`);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-sans">
      
      {/* Header section summaries */}
      <header className="space-y-1 pb-4 border-b border-slate-200/10">
        <h2 className="text-xl sm:text-2xl font-bold font-headline-md">
          Project Reports
        </h2>
        <p className="text-xs text-slate-500 font-label-md">Last deep scan completed 14m ago by pipeline</p>
      </header>

      {/* Active report summary card bento pattern */}
      <section className={`border rounded-xl p-5 space-y-4 ${
        theme === 'dark' ? 'bg-[#122131]/80 border-[#464555] shadow-xs' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-bold">Active Report Summary</h3>
            <p className="text-[11px] text-slate-500 font-mono">archaeologist-v2.0.4-full</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-[#44f5bd] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            PREVIEW
          </div>
        </div>

        {/* Inclusion lists */}
        <div className="space-y-2 pt-2 border-t border-slate-200/10">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 font-label-md">Inclusion List</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Overview', desc: 'Summary of file/complexity structures' },
              { label: 'Architecture', desc: 'Visual component mapping coordinates' },
              { label: 'Files', desc: 'Functions definitions parsed breakdown' },
              { label: 'README', desc: 'Collapsible setup instructions bundle' }
            ].map(item => (
              <div 
                key={item.label}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  theme === 'dark' ? 'bg-[#1c2b3c]/50 border-[#464555]/30' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#8781ff]/10 text-[#8781ff] flex items-center justify-center flex-none">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate pr-1">
                  <p className="text-xs font-bold">{item.label}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-[#44f5bd] ml-auto flex-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Link box section */}
      <section className={`border rounded-xl p-5 space-y-3 ${
        theme === 'dark' ? 'bg-[#122131]/80 border-[#464555]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-label-md">Share Report</h3>
        <div className="flex gap-2">
          <div className={`flex-1 border rounded-xl px-3.5 py-2.5 flex items-center overflow-hidden ${
            theme === 'dark' ? 'bg-[#010f1f]/80 border-[#464555]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-xs truncate font-mono text-[#8781ff]">codearc.io/r/a7f3-k92m-z10x</span>
          </div>
          <button 
            type="button"
            onClick={handleCopyLink}
            className={`px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              theme === 'dark' ? 'bg-[#8781ff] text-white hover:bg-[#a9a5ff]' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {copied && (
          <p className="text-[#44f5bd] text-[10px] font-bold text-right tracking-widest animate-pulse leading-none">
            SHARED LINK COPIED TO CLIPBOARD
          </p>
        )}
      </section>

      {/* Export Options layout with download simulations */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 font-label-md">Export Formats</h3>
        
        <div className="space-y-2">
          {[
            { tag: 'pdf', title: 'PDF Report', desc: 'For executive presentation summaries', size: '12.4 MB', color: 'bg-red-500/10 text-red-400' },
            { tag: 'json', title: 'JSON Export', desc: 'Raw machine-readable parsing objects', size: '1.2 MB', color: 'bg-indigo-500/10 text-indigo-400' },
            { tag: 'zip', title: 'Markdown Bundle (.zip)', desc: 'Complete documentation archives', size: '8.5 MB', color: 'bg-amber-500/10 text-amber-500' }
          ].map(fmt => (
            <div
              key={fmt.tag}
              onClick={() => startFakeDownload(fmt.tag)}
              className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer hover:scale-[1.005] active:scale-95 transition-all ${
                theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555] hover:bg-[#122131]' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-none ${fmt.color}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{fmt.title}</p>
                  <p className="text-[11px] text-slate-500 leading-none mt-1">{fmt.desc} ({fmt.size})</p>
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

      {/* Historically run scanner reports updates pipeline */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-label-md">
          Analysis History
        </h3>
        
        <div className={`border rounded-xl divide-y overflow-hidden ${
          theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555] divide-[#464555]/40' : 'bg-white border-slate-200 divide-slate-100'
        }`}>
          {MOCK_REPORT_HISTORY.map(history => (
            <div key={history.id} className="p-4 flex items-center justify-between">
              <div className="space-y-1 pr-2">
                <p className="text-xs font-bold leading-normal">{history.title}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                  <Calendar className="w-3 h-3" />
                  <span>{history.time}</span>
                  <span>•</span>
                  <span>Commit: {history.commit}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Simulation: Displaying static report metrics logged on commit hash ${history.commit}.`)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#1c2b3c] border-[#464555] hover:bg-[#8781ff] hover:text-white hover:border-[#8781ff]'
                    : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-55'
                }`}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
