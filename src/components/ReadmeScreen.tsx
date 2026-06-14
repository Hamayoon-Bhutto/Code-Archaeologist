import React, { useState } from 'react';
import { Info, Rocket, FolderOpen, Boxes, Puzzle, Copy, Download, RefreshCw, Check, ChevronRight } from 'lucide-react';
import { ThemeMode } from '../types';

interface ReadmeScreenProps {
  theme: ThemeMode;
}

export default function ReadmeScreen({ theme }: ReadmeScreenProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  
  // Accordion active flags
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const mdContent = `# CodeArchaeologist

CodeArchaeologist is a high-performance static analysis tool designed to uncover hidden architectural patterns in legacy codebases.

## Getting Started
Ensure you have Node.js version 18.x or higher installed.

## Sub-modules
The registry binds AST generation outputs dynamically on matching buffers.`;

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(mdContent);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1200);
  };

  const toggleAccordion = (secName: string) => {
    if (expandedSection === secName) {
      setExpandedSection(null);
    } else {
      setExpandedSection(secName);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Breadcrumb section */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono font-label-md mb-0.5">
          <span>Projects</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#8781ff]">README.md</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-sans">
          Generated Documentation
        </h2>
      </div>

      {/* Action Bar */}
      <div className={`flex items-center justify-between gap-3 p-2 border rounded-xl ${
        theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            type="button"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'preview'
                ? theme === 'dark'
                  ? 'bg-[#8781ff] text-white'
                  : 'bg-indigo-600 text-white shadow-xs'
                : theme === 'dark'
                ? 'text-slate-400 hover:bg-[#122131]'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('source')}
            type="button"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'source'
                ? theme === 'dark'
                  ? 'bg-[#8781ff] text-white'
                  : 'bg-indigo-600 text-white shadow-xs'
                : theme === 'dark'
                ? 'text-slate-400 hover:bg-[#122131]'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Source
          </button>
        </div>

        {/* Action icons stack */}
        <div className="flex items-center gap-1">
          <button 
            onClick={handleCopy}
            title="Copy to clipboard"
            className={`p-2 rounded-lg transition-colors cursor-pointer text-[#8781ff] hover:bg-slate-500/10`}
          >
            {copied ? <Check className="w-4 h-4 text-[#44f5bd]" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleDownload}
            title="Download Markdown"
            className={`p-2 rounded-lg transition-colors cursor-pointer text-[#8781ff] hover:bg-slate-500/10`}
          >
            {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleRegenerate}
            title="Regenerate all"
            className={`p-2 rounded-lg transition-all text-[#8781ff] hover:bg-slate-500/10 active:scale-90`}
          >
            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        /* Accordion Collapsible list component */
        <div className="space-y-3">
          
          {/* Overview module */}
          <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' ? 'border-[#464555]' : 'border-slate-200'
          }`}>
            <div 
              onClick={() => toggleAccordion('overview')}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-500/5 ${
                theme === 'dark' ? 'bg-[#0d1c2d]' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-sm">Overview</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                expandedSection === 'overview' ? 'rotate-90' : ''
              }`} />
            </div>
            
            {expandedSection === 'overview' && (
              <div className={`px-4 py-3 border-t font-sans text-xs ${
                theme === 'dark' ? 'bg-[#010f1f]/60 border-[#464555]' : 'bg-slate-50/50 border-slate-100'
              }`}>
                <p className="leading-relaxed mb-3 text-slate-400">
                  CodeArchaeologist is a high-performance static analysis tool designed to uncover hidden architectural patterns in legacy codebases. It provides developers with deep insights through call graphs, dependency maps, and AI-generated documentation.
                </p>
                <code className={`font-mono block p-3 rounded-lg text-xs font-semibold ${
                  theme === 'dark' ? 'bg-[#0d1c2d] text-emerald-400 border border-[#464555]/50' : 'bg-slate-100/70 border border-slate-200 text-teal-800'
                }`}>
                  $ npm install -g codearchaeologist
                </code>
              </div>
            )}
          </div>

          {/* Getting Started Module */}
          <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' ? 'border-[#464555]' : 'border-slate-200'
          }`}>
            <div 
              onClick={() => toggleAccordion('started')}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-500/5 ${
                theme === 'dark' ? 'bg-[#0d1c2d]' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Rocket className="w-4 h-4 text-emerald-450" />
                <span className="font-semibold text-sm">Getting Started</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                expandedSection === 'started' ? 'rotate-90' : ''
              }`} />
            </div>

            {expandedSection === 'started' && (
              <div className={`px-4 py-3 border-t font-sans text-xs ${
                theme === 'dark' ? 'bg-[#010f1f]/60 border-[#464555]' : 'bg-slate-50/50 border-slate-100'
              }`}>
                <h4 className="font-bold mb-1 uppercase tracking-wider text-[10px] text-slate-500">Prerequisites</h4>
                <p className="text-slate-405 leading-relaxed mb-3">Ensure you have Node.js version 18.x or higher and a compatible Git client installed.</p>
                <h4 className="font-bold mb-1 uppercase tracking-wider text-[10px] text-slate-500">Quick Start</h4>
                <code className={`font-mono block p-3 rounded-lg text-xs font-semibold ${
                  theme === 'dark' ? 'bg-[#0d1c2d] text-emerald-450 border border-[#464555]/50' : 'bg-slate-100/70 border border-slate-200 text-teal-800'
                }`}>
                  archaeologist init --path ./my-project
                </code>
              </div>
            )}
          </div>

          {/* File Structure Module */}
          <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' ? 'border-[#464555]' : 'border-slate-200'
          }`}>
            <div 
              onClick={() => toggleAccordion('folder')}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-500/5 ${
                theme === 'dark' ? 'bg-[#0d1c2d]' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderOpen className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-sm">File Structure</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                expandedSection === 'folder' ? 'rotate-90' : ''
              }`} />
            </div>

            {expandedSection === 'folder' && (
              <div className={`px-4 py-3 border-t font-mono text-xs leading-relaxed ${
                theme === 'dark' ? 'bg-[#010f1f]/60 border-[#464555] text-slate-300' : 'bg-slate-50/50 border-slate-150 text-slate-800'
              }`}>
                <pre>{`.
├── src/
│   ├── core/         # Analysis engines
│   ├── ui/           # Dashboard components
│   └── utils/        # Shared helpers
├── tests/            # Suite of integration tests
└── archaeologist.json # Config`}</pre>
              </div>
            )}
          </div>

          {/* Key Modules breakdown */}
          <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' ? 'border-[#464555]' : 'border-slate-200'
          }`}>
            <div 
              onClick={() => toggleAccordion('modules')}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-500/5 ${
                theme === 'dark' ? 'bg-[#0d1c2d]' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-sm">Key Modules</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                expandedSection === 'modules' ? 'rotate-90' : ''
              }`} />
            </div>

            {expandedSection === 'modules' && (
              <div className={`px-4 py-3 border-t font-sans text-xs space-y-2 text-slate-400 ${
                theme === 'dark' ? 'bg-[#010f1f]/60 border-[#464555]' : 'bg-slate-50/50 border-slate-100'
              }`}>
                <p><strong>Parser Engine:</strong> Responsible for generating ASTs from multiple languages including static TS, procedural Go, and macro Rust formats.</p>
                <p><strong>Graph Generator:</strong> Maps relationships and identifies critical circular dependencies.</p>
              </div>
            )}
          </div>

          {/* Dependencies breakdown */}
          <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' ? 'border-[#464555]' : 'border-slate-200'
          }`}>
            <div 
              onClick={() => toggleAccordion('dep')}
              className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-500/5 ${
                theme === 'dark' ? 'bg-[#0d1c2d]' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Puzzle className="w-4 h-4 text-emerald-450" />
                <span className="font-semibold text-sm">Dependencies</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                expandedSection === 'dep' ? 'rotate-90' : ''
              }`} />
            </div>

            {expandedSection === 'dep' && (
              <div className={`px-4 py-3 border-t font-sans text-xs ${
                theme === 'dark' ? 'bg-[#010f1f]/60 border-[#464555]' : 'bg-slate-50/50 border-slate-100'
              }`}>
                <ul className="list-disc list-inside space-y-2 text-slate-400">
                  <li><code>tree-sitter</code>: For multi-language parsing</li>
                  <li><code>d3-graphviz</code>: For visual call tree renders</li>
                  <li><code>openai</code>: For documentation synthesis and AI answers</li>
                </ul>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Raw Source Markdown screen layout value */
        <div className={`rounded-xl border p-5 font-mono text-xs leading-relaxed ${
          theme === 'dark' ? 'bg-[#010f1f] border-[#464555] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <pre className="whitespace-pre-wrap font-code-md text-emerald-400">{mdContent}</pre>
        </div>
      )}

    </div>
  );
}
