export interface RepoMetadata {
  owner: string;
  repo: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  openIssuesCount: number;
  defaultBranch: string;
  primaryLanguage: string;
  topics: string[];
  license: string;
  updatedAt: string;
  htmlUrl: string;
}

export interface TreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  size?: number;
  sha: string;
}

export interface KeyFolder {
  path: string;
  role: string;
  description: string;
  importance: 'Critical: Start Here' | 'Core Architecture' | 'Important' | 'Support' | 'Testing';
}

export interface SetupStep {
  stepNumber: number;
  title: string;
  command: string;
  sourceFile: string;
  notes?: string;
}

export interface TestCommand {
  type: 'Unit Tests' | 'Integration' | 'Linter' | 'E2E' | 'Build Verification';
  command: string;
  sourceFile: string;
  description: string;
}

export interface BeginnerTask {
  issueNumber: number;
  title: string;
  url: string;
  labels: string[];
  difficulty: 'Easy' | 'Intermediate' | 'Good First Issue';
  likelyFilesToEdit: string[];
  actionPlan: string;
  commentsCount?: number;
  createdAt?: string;
  isFallback?: boolean;
}

export interface EcosystemTool {
  id: string;
  name: string;
  category: 'Architecture & Wiki' | 'LLM Context & Ingestion' | 'Git Activity & Learning';
  shortcutRule: string;
  urlSwapExplanation: string;
  linkUrl: string;
  previewTitle: string;
  previewType: 'mermaid' | 'ascii-tree' | 'bullets' | 'code-files' | 'prompt' | 'xml' | 'text' | 'hierarchy' | 'badge-metrics' | 'git-commands' | 'python-code';
  previewContent: string;
  cliCommand?: string;
  badge?: string;
}

export interface RepoSummary {
  oneLinePitch: string;
  techStack: string[];
  architecturePattern: string;
  onboardingDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedSetupTimeMinutes: number;
  prerequisites: string[];
}

export interface CommitItem {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface GemmaTelemetry {
  modelUsed: string;
  providerUsed: 'google-ai-studio' | 'openrouter' | 'together';
  activeParams: string;
  reasoningTrace: string | null;
  latencyMs: number;
  tokensIngested: number;
  contextMaxTokens: number;
  contextPercentUsed: number;
  thinkingEnabled: boolean;
}

export interface AnalysisResult {
  metadata: RepoMetadata;
  repoSummary: RepoSummary;
  keyFolders: KeyFolder[];
  setupSteps: SetupStep[];
  testCommands: TestCommand[];
  beginnerTasks: BeginnerTask[];
  mermaidArchitectureDiagram: string;
  pythonMingrammerSnippet: string;
  deepWikiSummary: string[];
  ecosystemMatrix: EcosystemTool[];
  fileCount: number;
  estimatedTokens: number;
  asciiTree: string;
  recentCommits: CommitItem[];
  rawManifests: Record<string, string>;
  gemmaTelemetry?: GemmaTelemetry;
}

export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'done' | 'error';
  detail?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  analysisRef?: boolean;
  reasoningTrace?: string | null;
}

export interface ChatSession {
  id: string;
  repoFullName: string;
  title: string;
  subtitle: string;
  timestamp: string;
}

