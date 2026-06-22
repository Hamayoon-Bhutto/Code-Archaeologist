import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  LayoutDashboard,
  FolderOpen,
  Terminal,
  History,
  X,
  Sparkles,
  Network,
  FileText,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

import { ActiveScreen, ThemeMode, RiskIndicator } from './types';
import { PROJECTS } from './data';
import { AnalysisResult } from './api';

import UploadScreen from './components/UploadScreen';
import OverviewScreen from './components/OverviewScreen';
import FileExplorerScreen from './components/FileExplorerScreen';
import ReadmeScreen from './components/ReadmeScreen';
import CallGraphScreen from './components/CallGraphScreen';
import ArchitectureScreen from './components/ArchitectureScreen';
import ReportsScreen from './components/ReportsScreen';

export default function App() {
  const [projectId, setProjectId] = useState<string>('main-branch');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(ActiveScreen.Upload);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [selectedFileToExplore, setSelectedFileToExplore] = useState<string>('');

  const activeProject = analysisResult
    ? {
      id: 'analyzed-project',
      name: analysisResult.project_name,
      branch: 'local-analysis',
      totalFiles: String(analysisResult.files_analyzed),
      filesDiff: 'Analyzed',
      functions: String(analysisResult.functions_found),
      coverage: `${analysisResult.classes_found} Classes`,
      complexity: String(analysisResult.imports_found),
      grade: `${analysisResult.imports_found} Imports`,
      onboarding: 'Ready',
      summary: analysisResult.architecture_summary
    }
    : PROJECTS.find(p => p.id === projectId) || PROJECTS[0];

  useEffect(() => {
    const body = document.body;

    if (theme === 'dark') {
      body.style.backgroundColor = '#051424';
      body.className =
        'bg-[#051424] text-[#d4e4fa] font-sans antialiased selection:bg-[#8781ff]/30 min-h-screen';
    } else {
      body.style.backgroundColor = '#f8fafc';
      body.className =
        'bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500/20 min-h-screen';
    }
  }, [theme]);

  const handleAnalyzeCompletion = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setProjectId('analyzed-project');
    setActiveScreen(ActiveScreen.Overview);
  };

  const handleNavigateToFile = (fileName: string) => {
    setSelectedFileToExplore(fileName);
    setActiveScreen(ActiveScreen.Explorer);
  };

  const handleSelectRisk = (risk: RiskIndicator) => {
    if (risk.type === 'complexity') {
      setActiveScreen(ActiveScreen.Explorer);
    } else if (risk.type === 'circular') {
      setActiveScreen(ActiveScreen.CallGraph);
    } else if (risk.type === 'entry') {
      setActiveScreen(ActiveScreen.Architecture);
    } else if (risk.type === 'documentation') {
      setActiveScreen(ActiveScreen.Readme);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const resetSandbox = () => {
    setAnalysisResult(null);
    setProjectId('main-branch');
    setSelectedFileToExplore('');
    setActiveScreen(ActiveScreen.Upload);
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans transition-colors duration-300 ${theme === 'dark'
        ? 'bg-[#051424] text-[#d4e4fa]'
        : 'bg-slate-50 text-slate-900'
        }`}
    >
      {activeScreen !== ActiveScreen.Upload && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 right-0 w-[420px] h-[420px] bg-[#8781ff]/10 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-10 left-0 w-[420px] h-[420px] bg-[#44f5bd]/5 blur-[120px] rounded-full mix-blend-screen"></div>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 h-16 z-40 border-b flex items-center justify-between px-6 backdrop-blur-md transition-colors ${theme === 'dark'
          ? 'bg-[#051424]/85 border-slate-200/10'
          : 'bg-white/85 border-slate-200 shadow-xs'
          }`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-500/10 cursor-pointer active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5 text-[#8781ff]" />
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8781ff] animate-pulse" />
            <h1
              className="text-lg font-bold tracking-tight text-[#8781ff] font-headline-lg-mobile select-none cursor-pointer"
              onClick={() => setActiveScreen(ActiveScreen.Overview)}
            >
              CodeArchaeologist
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="flex items-center gap-1.5 animate-fade-in relative z-50">
              <input
                type="text"
                placeholder="Find modules..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className={`py-1.5 px-3 rounded-lg text-xs outline-none border ${theme === 'dark'
                  ? 'bg-[#122131] border-[#464555] text-white focus:border-[#8781ff]'
                  : 'bg-slate-100 border-slate-200 text-slate-800 focus:border-indigo-500'
                  }`}
              />

              <button
                onClick={() => {
                  setSearchOpen(false);

                  if (searchVal.trim()) {
                    handleNavigateToFile(searchVal);
                    setSearchVal('');
                  }
                }}
                className={`p-1.5 rounded-lg text-xs font-bold text-white ${theme === 'dark' ? 'bg-[#8781ff]' : 'bg-indigo-600'
                  }`}
              >
                Go
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-500/10 cursor-pointer text-[#8781ff] transition-transform active:scale-95"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          )}

          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg border flex items-center justify-center cursor-pointer transition-all active:scale-90 ${theme === 'dark'
              ? 'bg-[#122131]/60 border-[#464555] text-amber-300'
              : 'bg-slate-100 border-slate-200 text-indigo-700 shadow-xs'
              }`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex pt-16 z-10 w-full relative">
        {activeScreen !== ActiveScreen.Upload && (
          <aside
            className={`hidden md:flex w-64 border-r flex-col p-5 space-y-5 select-none shrink-0 ${theme === 'dark'
              ? 'bg-[#0d1c2d]/50 border-slate-200/10'
              : 'bg-white border-slate-200 shadow-sm'
              }`}
          >
            <div className="space-y-1">
              <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase">
                REPOSITORY
              </span>

              <p className="text-sm font-bold font-mono truncate text-[#8781ff]">
                {activeProject.name}
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse"></span>
                <span>Active Branch: {activeProject.branch}</span>
              </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1.5 pt-4">
              {[
                {
                  tab: ActiveScreen.Overview,
                  label: 'Overview',
                  icon: <LayoutDashboard className="w-4 h-4" />
                },
                {
                  tab: ActiveScreen.Explorer,
                  label: 'File Explorer',
                  icon: <FolderOpen className="w-4 h-4" />
                },
                {
                  tab: ActiveScreen.Readme,
                  label: 'Documentation',
                  icon: <FileText className="w-4 h-4" />
                },
                {
                  tab: ActiveScreen.CallGraph,
                  label: 'Call Graph',
                  icon: <Network className="w-4 h-4" />
                },
                {
                  tab: ActiveScreen.Architecture,
                  label: 'Architecture Map',
                  icon: <Terminal className="w-4 h-4" />
                },
                {
                  tab: ActiveScreen.Reports,
                  label: 'Project Reports',
                  icon: <History className="w-4 h-4" />
                }
              ].map(link => {
                const isActive = activeScreen === link.tab;

                return (
                  <button
                    key={link.tab}
                    onClick={() => setActiveScreen(link.tab)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:scale-[1.01] ${isActive
                      ? theme === 'dark'
                        ? 'bg-[#8781ff]/20 text-white border border-[#8781ff]/30'
                        : 'bg-indigo-50 border border-indigo-200/50 text-indigo-700 font-bold'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:bg-[#122131]/60'
                        : 'text-slate-650 hover:bg-slate-100'
                      }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </button>
                );
              })}

              <button
                onClick={resetSandbox}
                className="mt-8 flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Reset Sandbox</span>
              </button>
            </nav>
          </aside>
        )}

        <div className="flex-1 min-w-0 max-w-full px-6 py-6 md:px-8">
          {activeScreen === ActiveScreen.Upload ? (
            <UploadScreen
              onAnalyze={handleAnalyzeCompletion}
              theme={theme}
            />
          ) : activeScreen === ActiveScreen.Overview ? (
            <OverviewScreen
              project={activeProject}
              theme={theme}
              onThemeToggle={toggleTheme}
              onSelectRisk={handleSelectRisk}
              onSelectFile={handleNavigateToFile}
            />
          ) : activeScreen === ActiveScreen.Explorer ? (
            <FileExplorerScreen
              projectId={projectId}
              theme={theme}
              initialSelectedFile={selectedFileToExplore}
              files={analysisResult?.file_summaries}
            />
          ) : activeScreen === ActiveScreen.Readme ? (
            <ReadmeScreen
              theme={theme}
              readme={analysisResult?.readme}
            />
          ) : activeScreen === ActiveScreen.CallGraph ? (
            <CallGraphScreen
              projectId={projectId}
              theme={theme}
              graphPath={analysisResult?.graph_path}
              onNavigateToFile={handleNavigateToFile}
            />
          ) : activeScreen === ActiveScreen.Architecture ? (
            <ArchitectureScreen
              projectId={projectId}
              theme={theme}
              architectureSummary={analysisResult?.architecture_summary}
              onNavigateToFile={handleNavigateToFile}
            />
          ) : (
            <ReportsScreen theme={theme} analysisResult={analysisResult} />
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          <aside
            className={`w-72 h-full border-r relative z-10 flex flex-col p-6 animate-slide-right ${theme === 'dark'
              ? 'bg-[#0d1c2d] border-slate-200/10'
              : 'bg-white border-slate-250 shadow-2xl'
              }`}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-500/10"
            >
              <X className="w-5 h-5 text-slate-500 cursor-pointer" />
            </button>

            <div className="space-y-1 mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8781ff] font-label-md">
                REPOSITORY
              </span>
              <p className="text-base font-bold font-mono truncate">
                {activeProject.name}
              </p>
              <p className="text-[11px] text-slate-500">
                Branch: {activeProject.branch}
              </p>
            </div>

            <nav className="flex-grow flex flex-col gap-2">
              {[
                {
                  tab: ActiveScreen.Overview,
                  label: 'Overview',
                  icon: <LayoutDashboard className="w-4.5 h-4.5" />
                },
                {
                  tab: ActiveScreen.Explorer,
                  label: 'File Explorer',
                  icon: <FolderOpen className="w-4.5 h-4.5" />
                },
                {
                  tab: ActiveScreen.Readme,
                  label: 'Documentation',
                  icon: <FileText className="w-4.5 h-4.5" />
                },
                {
                  tab: ActiveScreen.CallGraph,
                  label: 'Call Graph',
                  icon: <Network className="w-4.5 h-4.5" />
                },
                {
                  tab: ActiveScreen.Architecture,
                  label: 'System Architecture',
                  icon: <Terminal className="w-4.5 h-4.5" />
                },
                {
                  tab: ActiveScreen.Reports,
                  label: 'Project Reports',
                  icon: <History className="w-4.5 h-4.5" />
                }
              ].map(link => {
                const isActive = activeScreen === link.tab;

                return (
                  <button
                    key={link.tab}
                    onClick={() => {
                      setActiveScreen(link.tab);
                      setDrawerOpen(false);
                    }}
                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${isActive
                      ? theme === 'dark'
                        ? 'bg-[#8781ff]/20 text-white border border-[#8781ff]/30'
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:bg-[#122131]'
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  resetSandbox();
                }}
                className="mt-8 flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-500 hover:text-red-400 cursor-pointer"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Reset Sandbox</span>
              </button>
            </nav>
          </aside>
        </div>
      )}

      {activeScreen !== ActiveScreen.Upload && (
        <nav
          className={`fixed bottom-0 left-0 right-0 h-14 md:hidden border-t z-45 flex justify-around items-center px-4 pb-safe ${theme === 'dark'
            ? 'bg-[#122131]/95 border-slate-200/10 shadow-[0_-5px_15px_rgba(0,0,0,0.4)] backdrop-blur-md'
            : 'bg-white border-slate-200 shadow-md backdrop-blur-md'
            }`}
        >
          {[
            {
              screen: ActiveScreen.Overview,
              label: 'Overview',
              icon: <LayoutDashboard className="w-5 h-5" />
            },
            {
              screen: ActiveScreen.Explorer,
              label: 'Explorer',
              icon: <FolderOpen className="w-5 h-5" />
            },
            {
              screen: ActiveScreen.CallGraph,
              label: 'Graph',
              icon: <Network className="w-5 h-5" />
            },
            {
              screen: ActiveScreen.Readme,
              label: 'Docs',
              icon: <FileText className="w-5 h-5" />
            },
            {
              screen: ActiveScreen.Reports,
              label: 'Reports',
              icon: <History className="w-5 h-5" />
            }
          ].map(item => {
            const isActive = activeScreen === item.screen;

            return (
              <button
                key={item.screen}
                onClick={() => setActiveScreen(item.screen)}
                className={`py-1 px-3.5 rounded-full flex flex-col items-center gap-0.5 cursor-pointer transition-all duration-150 active:scale-90 ${isActive
                  ? 'text-[#44f5bd] bg-[#44f5bd]/10 shadow-[0_0_8px_rgba(68,245,189,0.1)] font-bold'
                  : 'text-slate-550'
                  }`}
              >
                {item.icon}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}