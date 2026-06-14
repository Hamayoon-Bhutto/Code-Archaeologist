import React, { useState } from 'react';
import { Search, Filter, Plus, Minus, Info, ChevronUp, ChevronDown, Network, LogIn, LogOut, Code } from 'lucide-react';
import { ThemeMode, GraphNode } from '../types';
import { GRAPH_NODES } from '../data';

interface CallGraphScreenProps {
  projectId: string;
  theme: ThemeMode;
  onNavigateToFile: (fileName: string) => void;
}

export default function CallGraphScreen({
  projectId,
  theme,
  onNavigateToFile
}: CallGraphScreenProps) {
  const [scale, setScale] = useState(1);
  const [depth, setDepth] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(GRAPH_NODES[projectId]?.[0] || GRAPH_NODES['main-branch'][0]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const nodesList = GRAPH_NODES[projectId] || GRAPH_NODES['main-branch'];

  // Zoom controllers
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.6));

  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node);
    setSheetOpen(true);
  };

  // Filter list based on search query
  const filteredNodes = nodesList.filter(n => 
    n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Depth filter criteria simulation
  const visibleNodes = filteredNodes.filter(n => {
    if (depth === 1) return n.type === 'active';
    if (depth === 2) return n.type === 'active' || n.label === 'mainLoop' || n.label === 'validateToken';
    return true; // shows all at higher depth
  });

  return (
    <div className="relative h-[650px] w-full rounded-2xl border overflow-hidden animate-fade-in flex flex-col font-sans">
      
      {/* Background canvas layout logic */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: theme === 'dark' 
            ? 'radial-gradient(circle at 2px 2px, #273647 1.5px, transparent 0)' 
            : 'radial-gradient(circle at 2px 2px, #cbd5e1 1.5px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Function Search Area Overlay popup */}
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
        <div className={`flex-1 flex items-center gap-2.5 px-3 py-2 border rounded-xl shadow-lg backdrop-blur-md ${
          theme === 'dark' ? 'bg-[#122131]/90 border-[#464555]' : 'bg-white/90 border-slate-200'
        }`}>
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search functions (e.g. handleRequest)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full focus:ring-0 placeholder-slate-500"
          />
          <Filter className="w-4.5 h-4.5 text-slate-500 cursor-pointer hover:text-[#8781ff]" />
        </div>
      </div>

      {/* Actual Connected Graph SVG Area Container */}
      <div className="flex-1 w-full relative overflow-hidden">
        
        {/* Dynamic Interactive SVG Connections list layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {visibleNodes.map((node) => {
            if (node.type === 'active') return null;
            // Draw lines stemming from nodes to active core processQueue node
            const x1 = '50%';
            const y1 = '50%';
            const x2 = `${node.x}%`;
            const y2 = `${node.y}%`;
            return (
              <line
                key={node.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={theme === 'dark' ? '#918fa1' : '#64748b'}
                strokeWidth="1.5"
                strokeDasharray={node.type === 'caller' ? '4' : '0'}
              />
            );
          })}
        </svg>

        {/* Nodes layer scaled based on scale state */}
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
        >
          {visibleNodes.map((node) => {
            const isActive = node.type === 'active';
            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute z-10 p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95 group font-sans ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-[#8781ff] border-[#c4c0ff] text-white shadow-[0_0_15px_4px_rgba(135,129,255,0.4)]'
                      : 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_4px_rgba(79,70,229,0.3)]'
                    : theme === 'dark'
                    ? 'bg-[#1c2b3c] border-[#464555] text-[#d4e4fa]'
                    : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:border-indigo-400'
                }`}
              >
                {isActive ? (
                  <Network className="w-5 h-5 text-white animate-pulse" />
                ) : node.type === 'caller' ? (
                  <LogIn className="w-4 h-4 text-[#44f5bd]" />
                ) : (
                  <LogOut className="w-4 h-4 text-[#ffb785]" />
                )}
                
                <span className="font-mono text-xs font-bold leading-none">{node.label}</span>
                <span className="text-[9px] opacity-65 font-medium">{node.file}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Floating interactive scale & depth sliders */}
      <div className="absolute right-4 bottom-28 flex flex-col gap-3 z-20">
        
        {/* Zoom button cluster */}
        <div className={`p-1.5 rounded-full border flex flex-col items-center gap-2.5 shadow-xl backdrop-blur-md ${
          theme === 'dark' ? 'bg-[#1c2b3c]/90 border-[#464555]' : 'bg-white/95 border-slate-200'
        }`}>
          <button 
            onClick={handleZoomIn}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-slate-500/10 cursor-pointer`}
          >
            <Plus className="w-4.5 h-4.5 text-[#8781ff]" />
          </button>
          <div className={`h-[1px] w-5 ${theme === 'dark' ? 'bg-[#464555]' : 'bg-slate-200'}`}></div>
          <button 
            onClick={handleZoomOut}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-slate-500/10 cursor-pointer`}
          >
            <Minus className="w-4.5 h-4.5 text-[#8781ff]" />
          </button>
        </div>

        {/* Depth Selector Slider screen */}
        <div className={`rounded-2xl border p-4 shadow-xl w-48 backdrop-blur-md ${
          theme === 'dark' ? 'bg-[#1a2d3c]/90 border-[#464555]' : 'bg-white/95 border-slate-200'
        }`}>
          <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
            <span className="text-slate-400 font-label-md">Graph Depth</span>
            <span className="font-mono text-[#8781ff]">{depth}</span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            className="w-full h-1 bg-slate-400 accent-[#8781ff] rounded-lg cursor-pointer outline-none"
          />
          <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>
        </div>

      </div>

      {/* Accordion peeking summary details sheet at the bottom */}
      {selectedNode && (
        <div className={`absolute bottom-0 left-0 right-0 z-30 border-t transition-transform duration-300 ${
          sheetOpen ? 'translate-y-0' : 'translate-y-[82%]'
        } ${
          theme === 'dark' ? 'bg-[#122131] border-[#464555]' : 'bg-white border-slate-200 shadow-2xl'
        }`}>
          {/* Header click bar to toggle */}
          <div 
            onClick={() => setSheetOpen(prev => !prev)}
            className="h-10 w-full flex items-center justify-center cursor-pointer hover:bg-slate-500/5 group"
          >
            <div className="flex flex-col items-center">
              <span className={`text-[10px] uppercase font-bold tracking-widest text-[#8781ff] flex items-center gap-1`}>
                {sheetOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                <span>{sheetOpen ? 'Collapse Sheet' : 'Tap for details'}</span>
              </span>
            </div>
          </div>

          {/* Details metadata lists content */}
          <div className="px-6 pb-6 pt-2 font-sans space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{selectedNode.label}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedNode.file} • Complexity Score: {selectedNode.complexity}</p>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                selectedNode.type === 'active' 
                  ? 'bg-[#8781ff]/15 text-[#8781ff] border border-[#8781ff]/30' 
                  : 'bg-slate-500/10 text-slate-400'
              }`}>
                {selectedNode.type} Node
              </span>
            </div>

            <p className="text-xs text-slate-450 leading-relaxed">
              {selectedNode.description}
            </p>

            {/* List callers and callees modules */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Callers ({selectedNode.callers.length})</span>
                <div className="flex flex-col gap-1.5 h-20 overflow-y-auto no-scrollbar pr-1">
                  {selectedNode.callers.map(caller => (
                    <div 
                      key={caller}
                      onClick={() => onNavigateToFile(caller)}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-[#0d1c2d] border border-[#464555]/30 truncate text-emerald-400 cursor-pointer hover:underline"
                    >
                      {caller}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Callees ({selectedNode.callees.length})</span>
                <div className="flex flex-col gap-1.5 h-20 overflow-y-auto no-scrollbar pr-1">
                  {selectedNode.callees.map(callee => (
                    <div 
                      key={callee}
                      onClick={() => onNavigateToFile(callee)}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-[#0d1c2d] border border-[#464555]/30 truncate text-amber-400 cursor-pointer hover:underline"
                    >
                      {callee}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Open Code Button returning back safely to explorer tab */}
            <button
              onClick={() => onNavigateToFile(selectedNode.file)}
              className="w-full h-10 rounded-xl bg-[#8781ff] hover:bg-[#a9a5ff] text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all text-sm cursor-pointer whitespace-nowrap"
            >
              <Code className="w-4.5 h-4.5 text-white" />
              <span>Open Source Code ({selectedNode.file})</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
