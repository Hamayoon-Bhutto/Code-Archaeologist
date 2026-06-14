export enum ActiveScreen {
  Upload = 'upload',
  Overview = 'overview',
  Explorer = 'explorer',
  Readme = 'readme',
  CallGraph = 'callgraph',
  Architecture = 'architecture',
  Reports = 'reports'
}

export type ThemeMode = 'dark' | 'light';

export interface FileFunction {
  name: string;
  params: number;
  calls: number;
  complexityScore: number; // 0-100 percentage
  complexityLabel: 'Low' | 'Med' | 'High';
}

export interface FileData {
  path: string;
  name: string;
  lang: string;
  lines: number;
  complexity: string; // e.g., "High (42)", "Low (8)"
  modified: string;
  description: string;
  insights: string[];
  functions: FileFunction[];
  code: string;
}

export interface RiskIndicator {
  type: 'complexity' | 'circular' | 'documentation' | 'entry';
  title: string;
  valueLabel: string;
  color: 'error' | 'tertiary' | 'secondary' | 'primary';
  icon: string;
  details: string;
}

export interface StartingPath {
  id: number;
  file: string;
  description: string;
  readTime: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'caller' | 'callee' | 'active';
  file: string;
  x: number; // percentage width
  y: number; // percentage height
  callersCount: number;
  calleesCount: number;
  complexity: number;
  description: string;
  callers: string[];
  callees: string[];
}

export interface ArchNode {
  id: string;
  label: string;
  type: 'entry' | 'complexity' | 'util' | 'orphaned';
  file: string;
  x: number;
  y: number;
  size: number;
  cyclomatic: number;
  dependencies: number;
  path: string;
}
