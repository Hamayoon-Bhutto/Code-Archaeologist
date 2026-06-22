import React, { useState } from 'react';
import {
  Info,
  Rocket,
  FolderOpen,
  Boxes,
  Puzzle,
  Copy,
  Download,
  RefreshCw,
  Check,
  ChevronRight
} from 'lucide-react';
import { ThemeMode } from '../types';

interface ReadmeScreenProps {
  theme: ThemeMode;
  readme?: string;
}

export default function ReadmeScreen({ theme, readme }: ReadmeScreenProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('Overview-0');

  const mdContent =
    readme ||
    `# No README Generated Yet

Please analyze a codebase first.

Go back to the upload screen, enter a local project folder path, and click "Analyze with AI".`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mdContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy README.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'README_generated.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1200);
  };

  const toggleAccordion = (secName: string) => {
    setExpandedSection(prev => (prev === secName ? null : secName));
  };

  const getReadmePreviewSections = () => {
    const sections = mdContent
      .split('\n## ')
      .map((section, index) => {
        if (index === 0) {
          return {
            title: 'Overview',
            content: section.trim()
          };
        }

        const lines = section.split('\n');
        const title = lines[0].replace(/^#+\s*/, '').trim();
        const content = lines.slice(1).join('\n').trim();

        return {
          title: title || `Section ${index + 1}`,
          content
        };
      })
      .filter(section => section.content.length > 0);

    return sections;
  };

  const sections = getReadmePreviewSections();

  const getIconForSection = (title: string) => {
    const lower = title.toLowerCase();

    if (lower.includes('overview')) return <Info className="w-4 h-4 text-amber-400" />;
    if (lower.includes('start') || lower.includes('run')) return <Rocket className="w-4 h-4 text-emerald-400" />;
    if (lower.includes('structure') || lower.includes('file')) return <FolderOpen className="w-4 h-4 text-indigo-400" />;
    if (lower.includes('module') || lower.includes('feature')) return <Boxes className="w-4 h-4 text-amber-400" />;

    return <Puzzle className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">

      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono font-label-md mb-0.5">
          <span>Projects</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#8781ff]">README.md</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-sans">
          Generated Documentation
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          AI-generated README from your analyzed codebase.
        </p>
      </div>

      <div
        className={`flex items-center justify-between gap-3 p-2 border rounded-xl ${
          theme === 'dark'
            ? 'bg-[#0d1c2d] border-[#464555]'
            : 'bg-white border-slate-200'
        }`}
      >
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

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="p-2 rounded-lg transition-colors cursor-pointer text-[#8781ff] hover:bg-slate-500/10"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#44f5bd]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleDownload}
            title="Download Markdown"
            className="p-2 rounded-lg transition-colors cursor-pointer text-[#8781ff] hover:bg-slate-500/10"
          >
            {downloaded ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleRegenerate}
            title="Regenerate all"
            className="p-2 rounded-lg transition-all text-[#8781ff] hover:bg-slate-500/10 active:scale-90"
          >
            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        <div className="space-y-3">
          {sections.map((section, index) => {
            const sectionKey = `${section.title}-${index}`;

            return (
              <div
                key={sectionKey}
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  theme === 'dark' ? 'border-[#464555]' : 'border-slate-200'
                }`}
              >
                <div
                  onClick={() => toggleAccordion(sectionKey)}
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-500/5 ${
                    theme === 'dark' ? 'bg-[#0d1c2d]' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getIconForSection(section.title)}
                    <span className="font-semibold text-sm">
                      {section.title.replace(/^#\s*/, '')}
                    </span>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                      expandedSection === sectionKey ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {expandedSection === sectionKey && (
                  <div
                    className={`px-4 py-3 border-t font-sans text-xs ${
                      theme === 'dark'
                        ? 'bg-[#010f1f]/60 border-[#464555] text-slate-300'
                        : 'bg-slate-50/50 border-slate-100 text-slate-700'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                      {section.content}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={`rounded-xl border p-5 font-mono text-xs leading-relaxed ${
            theme === 'dark'
              ? 'bg-[#010f1f] border-[#464555] text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <pre className="whitespace-pre-wrap font-code-md text-emerald-400">
            {mdContent}
          </pre>
        </div>
      )}
    </div>
  );
}