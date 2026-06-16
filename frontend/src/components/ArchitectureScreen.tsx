import React, { useState } from 'react';
import { Info, HelpCircle, GitCommit, AlertTriangle, Code, Play, Plus, Minus, Filter, X } from 'lucide-react';
import { ThemeMode, ArchNode } from '../types';
import { ARCH_NODES } from '../data';

interface ArchitectureScreenProps {
  projectId: string;
  theme: ThemeMode;
  onNavigateToFile: (fileName: string) => void;
}

export default function ArchitectureScreen({
  projectId,
  theme,
  onNavigateToFile
}: ArchitectureScreenProps) {
  const nodes = ARCH_NODES[projectId] || ARCH_NODES['main-branch'];
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);

  const handleSelectNode = (node: ArchNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="relative h-[650px] w-full rounded-2xl border overflow-hidden animate-fade-in flex flex-col font-sans">
      
      {/* Grid Canvas background visual decorations */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: theme === 'dark' 
            ? 'radial-gradient(circle at 1.5px 1.5px, #273647 1.5px, transparent 0)' 
            : 'radial-gradient(circle at 1.5px 1.5px, #cbd5e1 1.5px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Interactive Visual circles layer mapping relative coordinate specs */}
      <div className="flex-1 w-full relative z-10">
        
        {/* Simple inline lines mapping nodes to represent connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <line x1="25%" y1="25%" x2="60%" y2="38%" stroke="#918fa1" strokeWidth="1" />
          <line x1="25%" y1="25%" x2="45%" y2="65%" stroke="#918fa1" strokeWidth="1" />
        </svg>

        {nodes.map((node) => {
          let nodeColor = 'bg-[#8781ff] border-indigo-400';
          let iconVal = <Play className="w-5 h-5 text-white" />;

          if (node.type === 'complexity') {
            nodeColor = 'bg-[#ffb785] border-amber-400 shadow-[0_0_15px_rgba(219,118,31,0.4)]';
            iconVal = <AlertTriangle className="w-5 h-5 text-[#461f00]" />;
          } else if (node.type === 'util') {
            nodeColor = 'bg-slate-500 border-slate-350';
            iconVal = <Code className="w-4 h-4 text-white" />;
          } else if (node.type === 'orphaned') {
            nodeColor = 'bg-red-500 border-red-400';
            iconVal = <Info className="w-4 h-4 text-white" />;
          }

          return (
            <div
              key={node.id}
              onClick={() => handleSelectNode(node)}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                width: `${node.size}px`,
                height: `${node.size}px`
              }}
              className={`absolute rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 group shadow-lg ${nodeColor}`}
            >
              {iconVal}
              
              {/* Dynamic tag banner */}
              <span className={`absolute top-full mt-2 font-mono text-[10px] bg-slate-50 border border-slate-200 text-slate-800 dark:bg-[#122131] dark:border-[#464555] dark:text-[#d4e4fa] px-2 py-0.5 rounded font-bold whitespace-nowrap opacity-90 group-hover:opacity-100`}>
                {node.id}
              </span>
            </div>
          );
        })}

      </div>

      {/* Floating control buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button className="w-9 h-9 border rounded-lg flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer bg-white dark:bg-[#1c2b3c] border-slate-250 dark:border-[#464555]">
          <Plus className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 border rounded-lg flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer bg-white dark:bg-[#1c2b3c] border-slate-250 dark:border-[#464555]">
          <Minus className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 border rounded-lg flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer bg-white dark:bg-[#1c2b3c] border-slate-250 dark:border-[#464555]">
          <Filter className="w-4 h-4 text-[#44f5bd]" />
        </button>
      </div>

      {/* Modular Legend Display Card overlay positioned at bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <div className={`border rounded-xl p-3.5 shadow-lg pointer-events-auto backdrop-blur-sm ${
          theme === 'dark' ? 'bg-[#0d1c2d]/90 border-[#464555]' : 'bg-white/95 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 font-label-md">
              Architecture Legend
            </h3>
            <HelpCircle className="w-4 h-4 text-slate-500" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8781ff]"></div>
              <span className="font-semibold text-slate-400">Entry Points</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffb785] shadow-[0_0_8px_rgba(219,118,31,0.5)]"></div>
              <span className="font-semibold text-slate-400">High Complexity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-500"></div>
              <span className="font-semibold text-slate-400">Utils / Libs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="font-semibold text-slate-400">Orphaned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Node detailed summary popover drawer */}
      {selectedNode && (
        <div className="fixed inset-x-0 bottom-14 z-40 p-4 transition-transform duration-300 animate-slide-up">
          <div className={`border rounded-t-2xl p-6 shadow-2xl relative ${
            theme === 'dark' ? 'bg-[#122131] border-[#464555] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-red-400 cursor-pointer"
            >
              <X className="w-5 h-5 animate-pulse" />
            </button>

            <div>
              <div className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase mb-2 ${
                selectedNode.type === 'entry' ? 'bg-indigo-500/10 text-indigo-400' : selectedNode.type === 'complexity' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'
              }`}>
                {selectedNode.type} module
              </div>
              
              <h2 className="text-xl font-bold font-mono">{selectedNode.file}</h2>
              <p className="text-xs text-slate-500">{selectedNode.path}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3.5">
              <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]/30' : 'bg-slate-50 border-slate-100'}`}>
                <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mb-1">Cyclomatic Score</div>
                <div className="text-amber-500 font-extrabold text-lg">{selectedNode.cyclomatic}</div>
              </div>
              <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]/30' : 'bg-slate-50 border-slate-100'}`}>
                <div className="text-slate-500 text-[9px] uppercase font-bold tracking-wider mb-1">Dependencies count</div>
                <div className="text-emerald-450 font-extrabold text-lg">{selectedNode.dependencies}</div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setSelectedNode(null);
                  onNavigateToFile(selectedNode.file);
                }}
                className={`flex-1 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer text-white ${
                  theme === 'dark' ? 'bg-[#8781ff]' : 'bg-indigo-600'
                }`}
              >
                Open File
              </button>
              <button
                onClick={() => {
                  setSelectedNode(null);
                  onNavigateToFile(selectedNode.file);
                }}
                className={`flex-1 h-10 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 cursor-pointer ${
                  theme === 'dark' ? 'border-[#464555] text-slate-350 bg-transparent' : 'border-slate-200 text-slate-600 bg-white'
                }`}
              >
                Review Graph
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
