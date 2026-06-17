import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Sparkles, Shield, HelpCircle } from 'lucide-react';
import { ThemeMode } from '../types';
import { PROJECTS } from '../data';
import { analyzeCodebase, AnalysisResult } from '../api.ts';

interface UploadScreenProps {
  onAnalyze: (result: AnalysisResult) => void;
  theme: ThemeMode;
}

export default function UploadScreen({ onAnalyze, theme }: UploadScreenProps) {
  const [folderPath, setFolderPath] = useState('');
  const [aiProvider, setAiProvider] = useState('gemini');
  const [selectedPresetId, setSelectedPresetId] = useState('main-branch');
  const [analyzing, setAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handlePresetSelect = (id: string) => {
    setSelectedPresetId(id);

    if (id === 'main-branch') {
      setFolderPath('D:\\code-archaeologist\\sample_codebase');
    }
  };

  const handleLangBadgeClick = (lang: string) => {
    if (lang === 'Python') {
      setFolderPath('D:\\code-archaeologist\\sample_codebase');
      setSelectedPresetId('main-branch');
    }
  };

  const handleStartAnalysis = async () => {
    if (!folderPath.trim()) {
      setError('Please enter a local folder path first.');
      return;
    }

    try {
      setError('');
      setAnalyzing(true);

      setLogs([
        '[SYSTEM] Connecting to local Flask backend...',
        `[SYSTEM] Selected AI Provider: ${aiProvider === 'gemini' ? 'Gemini API' : 'Local Model'}`,
        '[SYSTEM] Sending request to Flask backend...',
        `[SYSTEM] Waiting for ${aiProvider === 'gemini' ? 'Gemini' : 'Local'} response...`,
        '[SYSTEM] Scanning files, functions, classes, and imports...'
      ]);

      const result = await analyzeCodebase(folderPath, aiProvider);

      setLogs(prev => [
        ...prev,
        '[SYSTEM] Files scanned successfully.',
        '[SYSTEM] Dependency graph generated.',
        '[AI] README and architecture summary generated.',
        `[SYSTEM] Backend returned provider: ${result.ai_provider_used || result.ai_provider || aiProvider}`,
        `[SYSTEM] Analysis complete in ${result.analysis_time_seconds?.toFixed(1) || '?'}s!`
      ]);

      setAnalyzing(false);
      onAnalyze(result);
    } catch (err: any) {
      setAnalyzing(false);
      setError(err.message || 'Something went wrong while analyzing.');
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#051424] text-[#d4e4fa]' : 'bg-slate-50 text-slate-900'} relative overflow-hidden transition-colors duration-300`}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#8781ff]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#44f5bd]/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 flex flex-col pt-24 pb-20 px-6 items-center justify-center min-h-[calc(100vh-64px)] max-w-lg mx-auto">
        <div className="w-full flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-display sm:text-4xl font-headline-lg font-extrabold tracking-tight mb-2">
              Unearth Insights
            </h2>
            <p className={`text-body-md ${theme === 'dark' ? 'text-[#c4c0ff]/80' : 'text-slate-600'} px-4`}>
              Deep architecture analysis for complex codebases.
            </p>
          </div>

          {analyzing ? (
            <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'bg-[#122131] border-[#464555]' : 'bg-white border-slate-200'} shadow-xl flex flex-col gap-4 animate-fade-in`}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-[#8781ff] border-t-transparent animate-spin"></div>
                <h3 className="font-semibold text-[#8781ff] text-base">Analyzing Codebase...</h3>
              </div>

              <div className={`p-4 rounded-lg font-mono text-xs ${theme === 'dark' ? 'bg-[#010f1f]/80 text-[#44f5bd]' : 'bg-slate-100 text-teal-700'} flex flex-col gap-2 h-44 overflow-y-auto`}>
                {logs.map((log, index) => (
                  <div key={index} className="opacity-90 leading-relaxed font-code-md">
                    {log}
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 italic text-center">
                {aiProvider === 'local' ? 'Processing locally through Flask + Ollama.' : 'Processing securely via Gemini API.'}
              </p>
            </div>
          ) : (
            <div className={`p-6 rounded-xl border flex flex-col gap-6 shadow-xl ${theme === 'dark' ? 'bg-[#122131]/80 border-[#464555] backdrop-blur-md' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Choose Codebase Template</span>
                  <HelpCircle className="w-3.5 h-3.5 cursor-pointer hover:text-[#8781ff]" />
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {PROJECTS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetSelect(p.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                        selectedPresetId === p.id
                          ? theme === 'dark'
                            ? 'bg-[#8781ff]/20 text-[#c4c0ff] border-[#8781ff]'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                          : theme === 'dark'
                            ? 'bg-[#0d1c2d] border-transparent hover:border-[#464555] text-[#d4e4fa]/80'
                            : 'bg-slate-100 border-transparent hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div
                onClick={handleStartAnalysis}
                className={`w-full h-44 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all duration-300 border-2 border-dashed ${
                  theme === 'dark'
                    ? 'border-[#464555] hover:border-[#c4c0ff] hover:bg-[#1c2b3c]/50'
                    : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  theme === 'dark' ? 'bg-[#1c2b3c] text-[#c4c0ff]' : 'bg-slate-100 text-indigo-600'
                }`}>
                  <Upload className="w-6 h-6" />
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold">Analyze local codebase folder</p>
                  <p className="text-xs text-slate-500 mt-1">Enter folder path below, then click analyze</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`h-[1px] flex-1 ${theme === 'dark' ? 'bg-[#464555]' : 'bg-slate-200'}`}></div>
                <span className="text-xs font-bold text-slate-500">LOCAL PATH</span>
                <div className={`h-[1px] flex-1 ${theme === 'dark' ? 'bg-[#464555]' : 'bg-slate-200'}`}></div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Enter Local Codebase Folder Path
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    placeholder="D:\\code-archaeologist\\sample_codebase"
                    className={`w-full rounded-lg pl-4 pr-10 py-2.5 text-sm outline-none transition-all border ${
                      theme === 'dark'
                        ? 'bg-[#0d1c2d] border-[#464555] text-white focus:border-[#8781ff] focus:ring-1 focus:ring-[#8781ff]/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20'
                    }`}
                  />
                  <LinkIcon className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-500" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-center">
                {['Python', 'JS', 'TS', 'Java', 'Go', 'PHP', 'Ruby'].map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLangBadgeClick(lang)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
                      theme === 'dark'
                        ? 'bg-[#1c2b3c] border-[#464555] hover:bg-[#8781ff]/10 hover:border-[#8781ff]/40 text-[#44f5bd]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-indigo-600 text-teal-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Select AI Model
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setAiProvider('local')}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      aiProvider === 'local'
                        ? theme === 'dark' ? 'bg-[#8781ff]/20 border-[#8781ff]' : 'bg-indigo-50 border-indigo-500'
                        : theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555] hover:border-[#8781ff]/50' : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Local Model</div>
                    <div className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Private and offline, but slower</div>
                  </div>
                  <div
                    onClick={() => setAiProvider('gemini')}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      aiProvider === 'gemini'
                        ? theme === 'dark' ? 'bg-[#8781ff]/20 border-[#8781ff]' : 'bg-indigo-50 border-indigo-500'
                        : theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555] hover:border-[#8781ff]/50' : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Gemini API</div>
                    <div className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Cloud-based and faster, requires backend API key</div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={analyzing}
                className={`w-full py-3.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                  theme === 'dark'
                    ? 'bg-[#8781ff] text-white hover:bg-[#a9a5ff] shadow-lg shadow-indigo-500/20'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/10'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Analyze with AI
              </button>
            </div>
          )}

          <div className="flex flex-col items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium ${
              theme === 'dark'
                ? 'bg-[#44f5bd]/5 border-[#44f5bd]/20 text-[#44f5bd]'
                : 'bg-teal-50 border-teal-100 text-teal-700'
            }`}>
              <Shield className="w-4 h-4" />
              <span>
                {aiProvider === 'local' 
                  ? 'Runs 100% locally. Your code never leaves your machine.' 
                  : 'Code is analyzed using cloud-based Gemini API.'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}