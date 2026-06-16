import React, { useState } from 'react';
import { FolderOpen, FileCode, Search, Box, Code2, Import } from 'lucide-react';
import { ThemeMode } from '../types';

interface FunctionInfo {
  name: string;
  line?: number;
  qualname?: string;
}

interface ClassInfo {
  name: string;
  line?: number;
}

interface FileSummary {
  file_path: string;
  absolute_path?: string;
  lines?: number;
  line_count?: number;
  functions?: FunctionInfo[];
  classes?: ClassInfo[];
  imports?: string[];
  content_preview?: string;
}

interface FileExplorerScreenProps {
  projectId: string;
  theme: ThemeMode;
  initialSelectedFile?: string;
  files?: FileSummary[];
}

export default function FileExplorerScreen({
  theme,
  initialSelectedFile,
  files = []
}: FileExplorerScreenProps) {
  const [searchTerm, setSearchTerm] = useState(initialSelectedFile || '');
  const [selectedFile, setSelectedFile] = useState<FileSummary | null>(
    files.length > 0 ? files[0] : null
  );

  const filteredFiles = files.filter(file =>
    file.file_path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFunctions = files.reduce(
    (total, file) => total + (file.functions?.length || 0),
    0
  );

  const totalClasses = files.reduce(
    (total, file) => total + (file.classes?.length || 0),
    0
  );

  const totalImports = files.reduce(
    (total, file) => total + (file.imports?.length || 0),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mb-1">
          <span>Projects</span>
          <span>/</span>
          <span className="text-[#8781ff]">File Explorer</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-sans flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-[#8781ff]" />
          File Explorer
        </h2>

        <p className="text-xs text-slate-500 mt-1">
          Real files scanned from your analyzed codebase.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200'
          }`}>
          <p className="text-xs text-slate-500">Files</p>
          <p className="text-2xl font-bold text-[#8781ff]">{files.length}</p>
        </div>

        <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200'
          }`}>
          <p className="text-xs text-slate-500">Functions</p>
          <p className="text-2xl font-bold text-[#44f5bd]">{totalFunctions}</p>
        </div>

        <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200'
          }`}>
          <p className="text-xs text-slate-500">Classes</p>
          <p className="text-2xl font-bold text-amber-400">{totalClasses}</p>
        </div>

        <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200'
          }`}>
          <p className="text-xs text-slate-500">Imports</p>
          <p className="text-2xl font-bold text-indigo-400">{totalImports}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={`lg:col-span-1 rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200'
          }`}>
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#464555]' : 'border-slate-200'
            }`}>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search files..."
                className={`w-full rounded-lg pl-9 pr-3 py-2 text-sm outline-none border ${theme === 'dark'
                    ? 'bg-[#010f1f] border-[#464555] text-white focus:border-[#8781ff]'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                  }`}
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            </div>
          </div>

          <div className="max-h-[650px] overflow-y-auto">
            {filteredFiles.length === 0 ? (
              <div className="p-5 text-sm text-slate-500">
                No files found. Analyze a project first.
              </div>
            ) : (
              filteredFiles.map(file => (
                <button
                  key={file.file_path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-4 border-b transition-colors ${theme === 'dark'
                      ? 'border-[#464555]/60 hover:bg-[#122131]'
                      : 'border-slate-100 hover:bg-slate-50'
                    } ${selectedFile?.file_path === file.file_path
                      ? theme === 'dark'
                        ? 'bg-[#8781ff]/10'
                        : 'bg-indigo-50'
                      : ''
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#8781ff]" />
                    <span className="text-sm font-semibold truncate">
                      {file.file_path}
                    </span>
                  </div>

                  <div className="mt-2 flex gap-2 text-[11px] text-slate-500">
                    <span>{file.lines || file.line_count || 0} lines</span>
                    <span>•</span>
                    <span>{file.functions?.length || 0} funcs</span>
                    <span>•</span>
                    <span>{file.classes?.length || 0} classes</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`lg:col-span-2 rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-[#0d1c2d] border-[#464555]' : 'bg-white border-slate-200'
          }`}>
          {!selectedFile ? (
            <div className="p-8 text-center text-slate-500">
              Select a file to view details.
            </div>
          ) : (
            <>
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#464555]' : 'border-slate-200'
                }`}>
                <h3 className="text-lg font-bold text-[#8781ff]">
                  {selectedFile.file_path}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {selectedFile.absolute_path}
                </p>
              </div>

              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-[#010f1f]' : 'bg-slate-50'
                    }`}>
                    <p className="text-xs text-slate-500">Lines</p>
                    <p className="font-bold">{selectedFile.lines || selectedFile.line_count || 0}</p>
                  </div>

                  <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-[#010f1f]' : 'bg-slate-50'
                    }`}>
                    <p className="text-xs text-slate-500">Functions</p>
                    <p className="font-bold">{selectedFile.functions?.length || 0}</p>
                  </div>

                  <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-[#010f1f]' : 'bg-slate-50'
                    }`}>
                    <p className="text-xs text-slate-500">Classes</p>
                    <p className="font-bold">{selectedFile.classes?.length || 0}</p>
                  </div>

                  <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-[#010f1f]' : 'bg-slate-50'
                    }`}>
                    <p className="text-xs text-slate-500">Imports</p>
                    <p className="font-bold">{selectedFile.imports?.length || 0}</p>
                  </div>
                </div>

                <Section
                  title="Functions"
                  icon={<Code2 className="w-4 h-4 text-[#44f5bd]" />}
                  items={(selectedFile.functions || []).map(fn =>
                    `${fn.qualname || fn.name}${fn.line ? ` — line ${fn.line}` : ''}`
                  )}
                  emptyText="No functions found."
                  theme={theme}
                />

                <Section
                  title="Classes"
                  icon={<Box className="w-4 h-4 text-amber-400" />}
                  items={(selectedFile.classes || []).map(cls =>
                    `${cls.name}${cls.line ? ` — line ${cls.line}` : ''}`
                  )}
                  emptyText="No classes found."
                  theme={theme}
                />

                <Section
                  title="Imports"
                  icon={<Import className="w-4 h-4 text-indigo-400" />}
                  items={selectedFile.imports || []}
                  emptyText="No imports found."
                  theme={theme}
                />

                <div>
                  <h4 className="text-sm font-semibold mb-2">Code Preview</h4>
                  <pre className={`rounded-xl p-4 text-xs overflow-x-auto whitespace-pre-wrap ${theme === 'dark'
                      ? 'bg-[#010f1f] text-slate-300 border border-[#464555]'
                      : 'bg-slate-50 text-slate-800 border border-slate-200'
                    }`}>
                    {selectedFile.content_preview || 'No preview available.'}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  items,
  emptyText,
  theme
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  emptyText: string;
  theme: ThemeMode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-500">{emptyText}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={`px-2.5 py-1 rounded-lg text-xs border ${theme === 'dark'
                  ? 'bg-[#010f1f] border-[#464555] text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}