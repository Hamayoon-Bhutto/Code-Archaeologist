import { FileData, RiskIndicator, StartingPath, GraphNode, ArchNode } from './types';

export interface ProjectStats {
  id: string;
  name: string;
  branch: string;
  totalFiles: string;
  filesDiff: string;
  functions: string;
  coverage: string;
  complexity: string;
  grade: string;
  onboarding: string;
  summary: string;
}

export const PROJECTS: ProjectStats[] = [
  {
    id: 'main-branch',
    name: 'CodeArchaeologist',
    branch: 'main-branch',
    totalFiles: '1,284',
    filesDiff: '+12',
    functions: '8,432',
    coverage: '92% Cov',
    complexity: '68.2',
    grade: 'B+ Grade',
    onboarding: '4.5h',
    summary: 'CodeArchaeologist follows a modularized event-driven architecture. The core logic resides in /src/engine, utilizing a high-performance graph traversal for dependency mapping. Interaction flows primarily through a centralized dispatcher, minimizing tight coupling between analysis modules.'
  },
  {
    id: 'rust-compiler',
    name: 'NanoRust-Parser',
    branch: 'lexer-refactor',
    totalFiles: '4,912',
    filesDiff: '+142',
    functions: '31,844',
    coverage: '74% Cov',
    complexity: '94.6',
    grade: 'C- Grade',
    onboarding: '18.2h',
    summary: 'NanoRust implements a strict functional-compiler pass hierarchy. The architecture utilizes recursive descent parsers written in procedural rust modules under /src/passes/lexer. Module resolution relies heavily on standard trait patterns, creating thick execution stacks during type inference and syntax check stages.'
  },
  {
    id: 'website-frontend',
    name: 'DevAnalytics-UI',
    branch: 'feature-charts',
    totalFiles: '342',
    filesDiff: '+4',
    functions: '2,118',
    coverage: '98% Cov',
    complexity: '24.1',
    grade: 'A+ Grade',
    onboarding: '1.2h',
    summary: 'DevAnalytics is a client-side SPA written in TypeScript, using modular layouts. State transitions flow through standard reactive hooks, ensuring isolation of view states. Complexity remains exceptionally low because network fetches are abstracted to unified services.'
  }
];

export const RISK_INDICATORS: RiskIndicator[] = [
  {
    type: 'complexity',
    title: 'High Complexity',
    valueLabel: '12 Files',
    color: 'error',
    icon: 'AlertTriangle',
    details: 'These source files exceed the maximum target cyclomatic complexity of 30, meaning they are prone to translation defects and require urgent decomposition into smaller testable sub-kernels.'
  },
  {
    type: 'circular',
    title: 'Circular Dependencies',
    valueLabel: '3 Paths',
    color: 'tertiary',
    icon: 'RefreshCw',
    details: 'High coupling detected between core adapters and worker nodes. These circular chains introduce start-up locks and complicate separate modules execution during isolated testing phases.'
  },
  {
    type: 'documentation',
    title: 'Well-documented',
    valueLabel: '84% Meta',
    color: 'secondary',
    icon: 'CheckCircle',
    details: 'Documentation indicators confirm comprehensive docstrings and metadata integration across classes and interfaces, satisfying team code guidelines and reducing long-term upkeep overhead.'
  },
  {
    type: 'entry',
    title: 'Entry Points',
    valueLabel: '2 Apps',
    color: 'primary',
    icon: 'Navigation',
    details: 'The project exports distinct binaries as core service wrappers. This setup guarantees modular micro-service execution scopes.'
  }
];

export const START_GUIDES: StartingPath[] = [
  {
    id: 1,
    file: 'bootstrap.ts',
    description: 'Initializes system kernels, prepares the registry, loading critical process modules.',
    readTime: '12 min read'
  },
  {
    id: 2,
    file: 'core/registry.py',
    description: 'The central hub for component discovery, resource tracking, and type-safe resolution mapping.',
    readTime: '8 min read'
  },
  {
    id: 3,
    file: 'handlers/main.go',
    description: 'Entry points for external API interactions and low-level system events request routing.',
    readTime: '15 min read'
  }
];

export const EXPLORER_FILES: Record<string, FileData[]> = {
  'main-branch': [
    {
      path: 'src/components',
      name: 'MainParser.ts',
      lang: 'TypeScript',
      lines: 1248,
      complexity: 'High (42)',
      modified: '2h ago',
      description: 'This file acts as the central orchestrator for the project\'s syntax analysis. It exhibits high cyclomatic complexity primarily within the parseASTNode function.',
      insights: [
        'Strong modularity in helper methods.',
        'Potential recursion depth issue on line 452.'
      ],
      functions: [
        { name: 'initializeLexer', params: 2, calls: 12, complexityScore: 30, complexityLabel: 'Low' },
        { name: 'parseASTNode', params: 1, calls: 84, complexityScore: 95, complexityLabel: 'High' },
        { name: 'resolveImports', params: 3, calls: 5, complexityScore: 55, complexityLabel: 'Med' },
        { name: 'validateSchema', params: 2, calls: 18, complexityScore: 40, complexityLabel: 'Low' }
      ],
      code: `import { ASTNode, ParserConfig } from './types';\n\nexport class MainParser {\n  // Critical: Recursive descent entry point\n  public parse(input: string): ASTNode {\n    return this.parseNode(input);\n  }\n}`
    },
    {
      path: 'src/components',
      name: 'Utils.ts',
      lang: 'TypeScript',
      lines: 240,
      complexity: 'Low (8)',
      modified: 'Yesterday',
      description: 'Shared helper functions for generic string tokenizing, arrays filtering, and local buffer processing.',
      insights: [
        'Pure pure functions facilitate easy regression writing.',
        'Consider optimizing sanitizeString algorithm.'
      ],
      functions: [
        { name: 'sanitizeString', params: 1, calls: 121, complexityScore: 15, complexityLabel: 'Low' },
        { name: 'filterDuplicateNodes', params: 2, calls: 45, complexityScore: 25, complexityLabel: 'Low' }
      ],
      code: `export function sanitizeString(val: string): string {\n  return val.replace(/[^\\w\\s]/gi, '').trim();\n}\n\nexport function filterDuplicateNodes(nodes: any[], prop: string): any[] {\n  return nodes.filter((obj, pos, arr) => {\n    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;\n  });\n}`
    },
    {
      path: 'src/components',
      name: 'ThemeEngine.ts',
      lang: 'TypeScript',
      lines: 850,
      complexity: 'Medium (18)',
      modified: '3 days ago',
      description: 'Handles real-time global UI style swaps and CSS variable bindings for client widgets.',
      insights: [
        'Direct browser localState persistence is solid.',
        'Unnecessary theme calculations on window resizing can be debounced.'
      ],
      functions: [
        { name: 'applyThemeStyles', params: 2, calls: 4, complexityScore: 45, complexityLabel: 'Med' },
        { name: 'readDevicePreference', params: 0, calls: 2, complexityScore: 20, complexityLabel: 'Low' }
      ],
      code: `export class ThemeEngine {\n  static applyTheme(mode: 'dark' | 'light') {\n    const root = document.documentElement;\n    if (mode === 'light') {\n      root.classList.add('light');\n      root.classList.remove('dark');\n    } else {\n      root.classList.add('dark');\n      root.classList.remove('light');\n    }\n  }\n}`
    }
  ],
  'rust-compiler': [
    {
      path: 'src/passes/lexer',
      name: 'TokenMatcher.rs',
      lang: 'Rust',
      lines: 3410,
      complexity: 'High (55)',
      modified: '12m ago',
      description: 'Crucial macro dispatcher parsing standard patterns inside lexical Rust buffers. High branching triggers heavy static verification stacks.',
      insights: [
        'Avoid nested Match statements on generic characters rules.',
        'Compiler tail-call optimization handles parse recursive paths cleanly.'
      ],
      functions: [
        { name: 'match_symbol', params: 3, calls: 1205, complexityScore: 88, complexityLabel: 'High' },
        { name: 'build_token_type', params: 2, calls: 954, complexityScore: 42, complexityLabel: 'Med' }
      ],
      code: `impl TokenMatcher {\n    pub fn match_symbol(&self, ch: char) -> Option<Token> {\n        match ch {\n            '{' => Some(Token::LeftBrace),\n            '}' => Some(Token::RightBrace),\n            '[' => Some(Token::LeftBracket),\n            ']' => Some(Token::RightBracket),\n            _ => None,\n        }\n    }\n}`
    }
  ],
  'website-frontend': [
    {
      path: 'src/views/dashboard',
      name: 'ChartsView.tsx',
      lang: 'TypeScript',
      lines: 512,
      complexity: 'Low (12)',
      modified: 'Just now',
      description: 'Renders custom SVG area-charts reporting branch code-coverage timelines and system health stats.',
      insights: [
        'Highly responsive CSS layouts implementation.',
        'Safe lazy loading states provide lightning-fast loading screens.'
      ],
      functions: [
        { name: 'renderLineChart', params: 1, calls: 8, complexityScore: 22, complexityLabel: 'Low' },
        { name: 'onHoverInteractive', params: 2, calls: 42, complexityScore: 12, complexityLabel: 'Low' }
      ],
      code: `import { LineChart, Line, XAxis } from 'recharts';\n\nexport const ChartsView = ({ data }) => {\n  return (\n    <LineChart width={400} height={200} data={data}>\n      <Line type="monotone" dataKey="cov" stroke="#44f5bd" />\n      <XAxis dataKey="day" />\n    </LineChart>\n  );\n};`
    }
  ]
};

export const GRAPH_NODES: Record<string, GraphNode[]> = {
  'main-branch': [
    {
      id: 'processQueue',
      label: 'processQueue',
      type: 'active',
      file: 'core/worker.ts',
      x: 50,
      y: 50,
      callersCount: 4,
      calleesCount: 12,
      complexity: 8,
      description: 'High priority loop picking queued task packages, validating headers, and triggering parsing threads recursively.',
      callers: ['mainLoop.ts', 'retryHandler.ts', 'webSocketReceiver.py', 'cronScheduler.ts'],
      callees: ['validateToken', 'fetchMetaData', 'splitJobTask', 'compressCodeBlob', 'spawnSyntaxKernel']
    },
    {
      id: 'mainLoop',
      label: 'mainLoop',
      type: 'caller',
      file: 'core/kernel.ts',
      x: 22,
      y: 30,
      callersCount: 1,
      calleesCount: 3,
      complexity: 12,
      description: 'System-level core loop keeping process channels listening to local system inputs.',
      callers: ['init.ts'],
      callees: ['processQueue', 'refreshConfig', 'flushBuffers']
    },
    {
      id: 'validateToken',
      label: 'validateToken',
      type: 'callee',
      file: 'auth/jwt.ts',
      x: 78,
      y: 40,
      callersCount: 3,
      calleesCount: 1,
      complexity: 4,
      description: 'Decodes local session parameters confirming proper user encryption tags.',
      callers: ['processQueue', 'apiHandler.go', 'uploadTrigger.ts'],
      callees: ['decryptKey']
    },
    {
      id: 'fetchMetaData',
      label: 'fetchMetaData',
      type: 'callee',
      file: 'api/github.go',
      x: 62,
      y: 78,
      callersCount: 2,
      calleesCount: 2,
      complexity: 5,
      description: 'Retrieves repo commit details and active branch references via rest triggers.',
      callers: ['processQueue', 'reportsGenerator.py'],
      callees: ['parseRestResponse', 'getRateLimit']
    },
    {
      id: 'retryHandler',
      label: 'retryHandler',
      type: 'caller',
      file: 'utils/failures.ts',
      x: 18,
      y: 70,
      callersCount: 2,
      calleesCount: 2,
      complexity: 3,
      description: 'Catches parsing crash warnings, scaling timeouts exponentially.',
      callers: ['processQueue', 'networkBuffer.go'],
      callees: ['logErrorToDisk', 'reconnectSockets']
    }
  ]
};

export const ARCH_NODES: Record<string, ArchNode[]> = {
  'main-branch': [
    { id: 'main.ts', label: 'main.ts', type: 'entry', file: 'main.ts', x: 25, y: 25, size: 50, cyclomatic: 5, dependencies: 18, path: '/src/core/main.ts' },
    { id: 'parser-engine.cc', label: 'parser-engine.cc', type: 'complexity', file: 'parser-engine.cc', x: 60, y: 38, size: 70, cyclomatic: 42, dependencies: 34, path: '/src/native/parser-engine.cc' },
    { id: 'string-utils.hpp', label: 'string-utils.hpp', type: 'util', file: 'string-utils.hpp', x: 45, y: 65, size: 40, cyclomatic: 8, dependencies: 2, path: '/src/native/string-utils.hpp' },
    { id: 'legacy-auth.js', label: 'legacy-auth.js', type: 'orphaned', file: 'legacy-auth.js', x: 75, y: 72, size: 30, cyclomatic: 15, dependencies: 0, path: '/legacy/legacy-auth.js' }
  ]
};

export const MOCK_REPORT_HISTORY = [
  { id: 1, title: 'Full Dependency Audit', time: 'Today, 10:24 AM', commit: '8fa21' },
  { id: 2, title: 'Architecture Structural Map', time: 'Yesterday, 04:15 PM', commit: 'f2e90' },
  { id: 3, title: 'Baseline Security Scan', time: 'Oct 12, 09:10 AM', commit: 'a1b2c' },
  { id: 4, title: 'Cyclometric Flow Overview', time: 'Sep 24, 11:42 AM', commit: '3fb01' }
];

export const MOCK_AI_RESPONSES: Record<string, string> = {
  'bootstrap.ts': 'The file `bootstrap.ts` is the initial runtime entry kernel. It configures basic process boundaries, initializes module registry tracking databases, loads system path variables, and registers core callbacks so third-party microservices can hook into key analysis steps.',
  'core/registry.py': 'Core registry is an central Python hub. It tracks active system interfaces, manages structural typing mapping files dynamically, registers parsed AST components, and blocks duplicate namespace registration, preventing circular runtime bindings.',
  'handlers/main.go': 'The low-level API proxy written in Go. It handles heavy socket and REST streams from outer agents, maps headers, and routes syntax-checking payloads efficiently to corresponding thread buffers.',
  'default': 'Let\'s analyze this structure. The module implements a robust interface separating structural patterns from actual execution states. Complexity metrics are stable, though recursive paths should be monitored to prevent stack overflows.'
};
