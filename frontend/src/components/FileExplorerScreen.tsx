import React, { useState, useEffect, useRef } from 'react';
import { Folder, FileCode, CheckCircle, AlertTriangle, Play, Sparkles, Send, Search, HelpCircle, ChevronRight, X } from 'lucide-react';
import { ActiveScreen, ThemeMode, FileData, FileFunction } from '../types';
import { EXPLORER_FILES, MOCK_AI_RESPONSES } from '../data';

interface FileExplorerScreenProps {
  projectId: string;
  theme: ThemeMode;
  initialSelectedFile?: string;
}

export default function FileExplorerScreen({
  projectId,
  theme,
  initialSelectedFile
}: FileExplorerScreenProps) {
  const filesList = EXPLORER_FILES[projectId] || EXPLORER_FILES['main-branch'];
  const [selectedFile, setSelectedFile] = useState<FileData>(filesList[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [queryText, setQueryText] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [showHotspotsModal, setShowHotspotsModal] = useState(false);
  const [analyzingQuery, setAnalyzingQuery] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // If parent specified an initial source file, switch to it safely
  useEffect(() => {
    if (initialSelectedFile) {
      const match = filesList.find(f => f.name.toLowerCase() === initialSelectedFile.toLowerCase() || f.name.toLowerCase().includes(initialSelectedFile.toLowerCase()));
      if (match) {
        setSelectedFile(match);
      }
    }
  }, [initialSelectedFile, filesList]);

  // Scroll chat answers to bottom smoothly
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSelectFile = (file: FileData) => {
    setSelectedFile(file);
    // Flush previous chats for fresh contextual questions
    setChatMessages([]);
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryText.trim() || analyzingQuery) return;

    const userMsg = queryText.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setQueryText('');
    setAnalyzingQuery(true);

    setTimeout(() => {
      let aiResponse = MOCK_AI_RESPONSES[selectedFile.name] || MOCK_AI_RESPONSES['default'];
      
      // Smart matching based on keywords in query
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('optimize') || lowerMsg.includes('speed') || lowerMsg.includes('fix')) {
        aiResponse = `Regarding your optimization audit on \`${selectedFile.name}\`: I recommend decoupling heavy loop branches inside helper subroutines to avoid stacking values. Line-scanning triggers should utilize debounced buffers.`;
      } else if (lowerMsg.includes('recursive') || lowerMsg.includes('recursion')) {
        aiResponse = `The structural tree traversing contains recursive loops on parse entries. Wrapping the parser state in safe recursion depths avoids runtime stack fault triggers.`;
      } else if (lowerMsg.includes('complexity') || lowerMsg.includes('lines')) {
        aiResponse = `Currently, cyclomatic complexity of this module matches ${selectedFile.complexity}. Refactoring heavy branching structures into clean functional pure blocks is advised.`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setAnalyzingQuery(false);
    }, 1000);
  };

  // Filter project explorer tree nodes
  const filteredFiles = filesList.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative animate-fade-in">
      
      {/* File Tree Left Navigation aside component */}
      <aside className={`md:col-span-3 rounded-xl border p-4 transition-all ${
        sidebarOpen ? 'block' : 'hidden md:block'
      } ${
        theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8781ff] font-label-md">
              File Explorer
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Sources ({filesList.length})</span>
          </div>

          {/* Quick filter input field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search source code folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-1.5 pl-8 pr-3 rounded text-xs outline-none border ${
                theme === 'dark'
                  ? 'bg-[#122131] border-[#464555] text-white focus:border-[#8781ff]'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
              }`}
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          </div>

          {/* Simulated File List tree rendering */}
          <div className="space-y-1 pt-1">
            <div className={`p-1.5 rounded flex items-center gap-2 text-xs font-semibold ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <Folder className="w-4 h-4 text-amber-400" />
              <span>src/components</span>
            </div>

            <div className="pl-3.5 space-y-1.5">
              {filteredFiles.map((file) => {
                const isActive = selectedFile.name === file.name;
                return (
                  <div
                    key={file.name}
                    onClick={() => handleSelectFile(file)}
                    className={`p-2 rounded-lg cursor-pointer flex items-center justify-between border transition-all hover:scale-[1.01] ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-[#8781ff]/20 border-[#8781ff] text-white'
                          : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : theme === 'dark'
                        ? 'bg-transparent border-transparent text-slate-400 hover:bg-[#122131]'
                        : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-[#8781ff]' : 'text-slate-400'}`} />
                      <span className="font-mono text-xs truncate max-w-[130px]">{file.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        file.complexity.includes('High') ? 'bg-red-400' : 'bg-[#44f5bd]'
                      }`}></span>
                      <span className="text-[10px] text-slate-500 font-mono font-medium">{file.lines}L</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Main File Details Canvas component */}
      <section className="md:col-span-9 space-y-6">
        
        {/* Dynamic Source Code Header Details */}
        <div className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-label-md">
              <span>{selectedFile.path}</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#8781ff]">{selectedFile.name}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold font-mono">{selectedFile.name}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-label-md border ${
                theme === 'dark'
                  ? 'bg-[#8781ff]/10 border-[#8781ff]/30 text-[#c4c0ff]'
                  : 'bg-indigo-50 border-indigo-100 text-indigo-700'
              }`}>
                {selectedFile.lang}
              </span>
            </div>
          </div>

          {/* Performance values timeline display */}
          <div className="flex items-center gap-6 self-end md:self-center">
            <div className="text-center">
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-label-md mb-0.5">Lines</div>
              <div className="font-mono text-sm font-semibold">{selectedFile.lines}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-label-md mb-0.5">Complexity</div>
              <div className={`font-mono text-sm font-semibold ${selectedFile.complexity.includes('High') ? 'text-red-400' : 'text-[#44f5bd]'}`}>
                {selectedFile.complexity}
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider font-label-md mb-0.5">Modified</div>
              <div className="font-mono text-sm font-semibold text-slate-450">{selectedFile.modified}</div>
            </div>
          </div>
        </div>

        {/* AI Suggestions Bento layout */}
        <section className={`rounded-xl border p-6 relative overflow-hidden ${
          theme === 'dark' 
            ? 'bg-[#122131] border-[#8781ff]/40 shadow-indigo-500/5 shadow-lg' 
            : 'bg-indigo-50/30 border-indigo-200/60 shadow-sm'
        }`}>
          <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
            <Sparkles className="w-16 h-16 text-[#8781ff]" />
          </div>

          <div className="flex items-center gap-2.5 mb-3">
            <Sparkles className="w-5 h-5 text-[#8781ff] animate-pulse" />
            <h3 className="text-base font-bold font-headline-md text-slate-350">
              AI Insights
            </h3>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {selectedFile.description}
          </p>

          <div className="space-y-2.5">
            {selectedFile.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                {idx === 0 ? (
                  <CheckCircle className="w-4 h-4 text-[#44f5bd] mt-0.5 flex-none" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#ffb785] mt-0.5 flex-none" />
                )}
                <span className="leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>

          {/* Trigger interactive actions popup */}
          <div className="mt-5 pt-4 border-t border-slate-200/10 flex gap-3">
            <button
              onClick={() => setShowOptimizationModal(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.98] cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#8781ff] text-white hover:bg-[#a9a5ff]'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Optimization Guide
            </button>
            <button
              onClick={() => setShowHotspotsModal(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all hover:bg-slate-500/5 cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#464555] text-slate-400'
                  : 'border-slate-200 text-slate-600 shadow-xs'
              }`}
            >
              View Hotspots
            </button>
          </div>
        </section>

        {/* Function Inventory breakdown list table */}
        <section className={`rounded-xl border overflow-hidden ${
          theme === 'dark' ? 'bg-[#122131] border-[#464555]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`px-5 py-3 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-[#464555] bg-[#1c2b3c]' : 'border-slate-100 bg-slate-50'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider font-sans">
              Functions Inventory
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold font-mono tracking-wider">
              {selectedFile.functions.length} Methods Detected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className={`text-[10px] uppercase font-bold tracking-wider text-slate-500 border-b ${
                theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-slate-50 border-slate-100'
              }`}>
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold text-center">Params</th>
                  <th className="px-5 py-3 font-semibold text-center">Calls</th>
                  <th className="px-5 py-3 font-semibold">Complexity</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#464555]' : 'divide-slate-100'}`}>
                {selectedFile.functions.map((fn) => (
                  <tr key={fn.name} className="hover:bg-slate-500/5 transition-colors group cursor-pointer">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-[#44f5bd] group-hover:underline">
                      {fn.name}
                    </td>
                    <td className="px-5 py-3 text-center text-slate-500 font-mono font-medium">{fn.params}</td>
                    <td className="px-5 py-3 text-center text-slate-500 font-mono font-medium">{fn.calls}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-16 h-1.5 rounded-full overflow-hidden ${
                          theme === 'dark' ? 'bg-[#273647]' : 'bg-slate-150'
                        }`}>
                          <div 
                            className={`h-full rounded-full ${
                              fn.complexityLabel === 'High' ? 'bg-red-400' : fn.complexityLabel === 'Med' ? 'bg-amber-400' : 'bg-[#44f5bd]'
                            }`}
                            style={{ width: `${fn.complexityScore}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{fn.complexityLabel}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Code Raw Preview content screen */}
        <section className={`rounded-xl border overflow-hidden ${
          theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200'
        }`}>
          <div className={`px-4 py-2 border-b flex items-center justify-between text-xs ${
            theme === 'dark' ? 'border-[#464555] bg-[#122131]' : 'border-slate-100 bg-slate-50'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Raw Code Analysis Preview</span>
            <div className="flex gap-1.5 pointer-events-none">
              <span className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#273647]' : 'bg-slate-200'}`}></span>
              <span className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#273647]' : 'bg-slate-200'}`}></span>
              <span className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-[#273647]' : 'bg-slate-200'}`}></span>
            </div>
          </div>

          <div className={`p-4 font-mono text-xs overflow-x-auto leading-relaxed ${
            theme === 'dark' ? 'bg-[#010f1f]/60 text-slate-300' : 'bg-slate-50 text-slate-800'
          }`}>
            <pre className="flex gap-4">
              <span className="text-right text-slate-450 select-none border-r pr-3 opacity-30">
                {selectedFile.code.split('\n').map((_, i) => (
                  <span key={i} className="block">{i + 1}</span>
                ))}
              </span>
              <code className="text-indigo-400 font-code-md">
                {selectedFile.code.split('\n').map((line, idx) => {
                  // Custom highlighted style mappings
                  const hasImport = line.startsWith('import');
                  const hasExport = line.includes('export');
                  const hasComment = line.trim().startsWith('//') || line.trim().startsWith('/*');
                  
                  return (
                    <span key={idx} className="block">
                      {hasImport ? (
                        <span className="text-[#8781ff]">{line}</span>
                      ) : hasExport ? (
                        <span className="text-[#ffb785]">{line}</span>
                      ) : hasComment ? (
                        <span className="text-slate-500 italic">{line}</span>
                      ) : (
                        <span className={theme === 'dark' ? 'text-[#d4e4fa]' : 'text-slate-800'}>{line}</span>
                      )}
                    </span>
                  );
                })}
              </code>
            </pre>
          </div>
        </section>

        {/* Render Chat conversation box logs as prompt responses */}
        {chatMessages.length > 0 && (
          <div className={`p-4 rounded-xl border flex flex-col gap-3 h-52 overflow-y-auto ${
            theme === 'dark' ? 'bg-[#122131] border-[#464555]' : 'bg-white border-slate-200'
          }`}>
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? theme === 'dark'
                      ? 'bg-[#1c2b3c] text-white self-end font-medium'
                      : 'bg-indigo-50 text-indigo-900 self-end font-medium'
                    : 'bg-[#44f5bd]/5 text-[#44f5bd] self-start font-mono'
                }`}
              >
                {msg.sender === 'ai' && (
                  <span className="font-bold text-[#8781ff] block mb-1">AI Analytical Kernel:</span>
                )}
                {msg.text}
              </div>
            ))}
            <div ref={chatBottomRef}></div>
          </div>
        )}

        {/* AI Query Chat Box container */}
        <form onSubmit={handleSendChat} className="flex gap-2">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={`Ask AI about ${selectedFile.name}...`}
            className={`flex-1 px-4 py-3 rounded-xl border text-xs outline-none transition-all ${
              theme === 'dark'
                ? 'bg-[#122131]/90 border-[#8781ff]/20 text-white focus:border-[#8781ff] focus:ring-1 focus:ring-[#8781ff]/15'
                : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/15 shadow-sm'
            }`}
          />
          <button
            type="submit"
            disabled={analyzingQuery}
            className={`px-4 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all active:scale-95 text-white cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#8781ff] hover:bg-[#a9a5ff]'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <span>{analyzingQuery ? 'Parsing...' : 'Analyze'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </section>

      {/* Optimization Guide Modal Backdrop overlay */}
      {showOptimizationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-sm rounded-xl p-5 border shadow-2xl relative ${
            theme === 'dark' ? 'bg-[#122131] border-[#464555] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button 
              onClick={() => setShowOptimizationModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-[#ffb785]"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex gap-2 items-center mb-4">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider font-mono">Optimization Guide</h4>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-slate-400 pr-1">
              <p>The parser algorithms inside <code className="text-amber-400 font-semibold">{selectedFile.name}</code> trigger recursion loops under standard compile modes.</p>
              <div className="border border-slate-550/10 p-2.5 rounded bg-black/10">
                <span className="font-bold block text-emerald-400 mb-0.5">Recommended Actions:</span>
                <ul className="list-disc list-inside space-y-1">
                  <li>Incorporate loop stacks in recursive routines</li>
                  <li>Incorporate debounced triggers on streams resize</li>
                  <li>Flatten branching macros filters</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setShowOptimizationModal(false)}
              className={`w-full mt-4 py-2 rounded-lg font-bold text-xs text-white ${
                theme === 'dark' ? 'bg-[#8781ff]' : 'bg-indigo-600'
              }`}
            >
              Got it, Proceed
            </button>
          </div>
        </div>
      )}

      {/* View Hotspots Modal Component */}
      {showHotspotsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-sm rounded-xl p-5 border shadow-2xl relative ${
            theme === 'dark' ? 'bg-[#122131] border-[#464555] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button 
              onClick={() => setShowHotspotsModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-[#ffb785]"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex gap-2 items-center mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold uppercase tracking-wider font-mono">Module Hotspots Analysis</h4>
            </div>
            <div className="space-y-2 text-xs leading-relaxed text-slate-400">
              <p>Hot spots show critical lines triggering excessive execution stack allocations:</p>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between border-b pb-1">
                  <span className="text-red-400">Lines 41-84 (Recursion)</span>
                  <span className="font-bold">Score: 92/100</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="text-amber-400">Line 252 (Buffer Scanning)</span>
                  <span className="font-bold">Score: 68/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-400">Line 452 (Stack depth checks)</span>
                  <span className="font-bold">Score: 45/100</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowHotspotsModal(false)}
              className={`w-full mt-4 py-2 rounded-lg font-bold text-xs text-white ${
                theme === 'dark' ? 'bg-[#8781ff]' : 'bg-indigo-600'
              }`}
            >
              Close Summary
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
