import React, { useState } from 'react';
import {
  FolderTree,
  Terminal,
  Target,
  Globe2,
  FileText,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GitPullRequest,
  CheckCircle,
  FileCode2,
  Clock,
  Zap,
  Layers,
  Code2,
  Star,
  GitFork,
  Cpu,
} from 'lucide-react';
import { AnalysisResult, BeginnerTask, EcosystemTool } from '../types';
import { MermaidViewer } from './MermaidViewer';
import { DraftPRModal } from './DraftPRModal';
import { generateOnboardingMarkdown } from '../lib/exportMarkdown';
import confetti from 'canvas-confetti';

interface RightPanelProps {
  analysisData: AnalysisResult | null;
  isLoading: boolean;
}

type TabType = 'folders' | 'setup' | 'tasks' | 'ecosystem' | 'export';

export const RightPanel: React.FC<RightPanelProps> = ({ analysisData, isLoading }) => {
  const [activeTab, setActiveTab] = useState<TabType>('folders');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [selectedTaskForPr, setSelectedTaskForPr] = useState<BeginnerTask | null>(null);
  const [ecosystemFilter, setEcosystemFilter] = useState<string>('All');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    gitdiagram: true,
    gitingest: true,
    deepwiki: true,
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAllPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex('all-prompt');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!analysisData && !isLoading) {
    return (
      <main className="w-full lg:w-[65%] flex-1 flex flex-col items-center justify-center p-8 bg-[#090D16] text-center">
        <div className="max-w-md p-8 rounded-2xl bg-surface-card border border-surface-border shadow-2xl space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <Globe2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Repository Command Center
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter any public GitHub repository URL or choose a demo in the left panel to generate architecture blueprints, deterministic setup runbooks, and the 13-tool ecosystem matrix.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
              <Sparkles className="w-3 h-3 text-sky-400" /> Zero Mock Data
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
              <Zap className="w-3 h-3 text-amber-400" /> &lt; 3.5s Engine
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading && !analysisData) {
    return (
      <main className="w-full lg:w-[65%] flex-1 flex flex-col items-center justify-center p-8 bg-[#090D16] text-center">
        <div className="space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 mx-auto flex items-center justify-center text-sky-400">
            <Terminal className="w-6 h-6 animate-spin" />
          </div>
          <h2 className="text-base font-semibold text-white">Harvesting Repository Intel...</h2>
          <p className="text-xs text-slate-400 font-mono">Parallel fetching git trees, manifests & CI workflows</p>
        </div>
      </main>
    );
  }

  const {
    metadata,
    repoSummary,
    keyFolders,
    setupSteps,
    testCommands,
    beginnerTasks,
    mermaidArchitectureDiagram,
    ecosystemMatrix,
    fileCount,
    estimatedTokens,
  } = analysisData!;

  // Filtered tools
  const filteredEcosystem = ecosystemMatrix.filter((tool) => {
    if (ecosystemFilter === 'All') return true;
    if (ecosystemFilter === 'Core Keyword Swaps (7)') {
      return ['gitdiagram', 'gitingest', 'gitreverse', 'explaingithub', 'uithub', 'github1s', 'deepwiki'].includes(tool.id);
    }
    return tool.category === ecosystemFilter;
  });

  const fullMarkdownDoc = generateOnboardingMarkdown(analysisData!);

  return (
    <main className="w-full lg:w-[65%] flex-1 flex flex-col h-full bg-[#090D16] overflow-hidden">
      {/* Top Context & Stats Bar */}
      <div className="px-6 py-3 border-b border-surface-border bg-surface-200/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <a
              href={metadata.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-white hover:text-sky-300 transition-colors flex items-center gap-1.5"
            >
              <span>{metadata.fullName}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-sky-300 border border-slate-700/60">
              {metadata.primaryLanguage}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {metadata.stars.toLocaleString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-slate-400" /> {metadata.forks.toLocaleString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><FolderTree className="w-3.5 h-3.5 text-sky-400" /> {fileCount} files</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> ~{estimatedTokens.toLocaleString()} tokens</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Clock className="w-3 h-3" />
            {repoSummary.onboardingDifficulty} (~{repoSummary.estimatedSetupTimeMinutes}m setup)
          </span>
        </div>
      </div>

      {/* 5-Tab Navigation Bar */}
      <nav aria-label="Command Center Tabs" className="flex items-center px-6 border-b border-surface-border bg-surface-300/40 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('folders')}
          className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'folders'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>1. Key Folders & Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('setup')}
          className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'setup'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>2. Setup & Test Runbook</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'tasks'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>3. Beginner Tasks</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-md text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30">
            {beginnerTasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ecosystem')}
          className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'ecosystem'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>4. 13-Tool Ecosystem</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-md text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            13
          </span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'export'
              ? 'border-sky-400 text-sky-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>5. Export & LLM Pack</span>
        </button>
      </nav>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ==================== TAB 1: KEY FOLDERS & ARCHITECTURE ==================== */}
        {activeTab === 'folders' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Architecture Overview Banner */}
            <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
                  Pattern Classification
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {repoSummary.architecturePattern}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {repoSummary.oneLinePitch}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 shrink-0">
                {repoSummary.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Mermaid.js System Flowchart */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  System Architecture Blueprint
                </h4>
                <span className="text-[11px] text-slate-400">
                  Interactive diagram rendered with Mermaid.js
                </span>
              </div>
              <MermaidViewer chart={mermaidArchitectureDiagram} repoFullName={metadata.fullName} />
            </div>

            {/* Key Folders Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
                  Directory Map & Subsystem Responsibilities
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {keyFolders.length} Identified Core Nodes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {keyFolders.map((folder, idx) => (
                  <div
                    key={folder.path}
                    className="p-4 rounded-xl bg-surface-card border border-surface-border hover:border-sky-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono font-semibold text-sky-300 group-hover:text-white transition-colors">
                            {folder.path}
                          </code>
                        </div>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                            folder.importance.includes('Critical')
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : folder.importance.includes('Core')
                              ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                              : folder.importance.includes('Testing')
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700/60'
                          }`}
                        >
                          {folder.importance}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-200 mb-1">
                        {folder.role}
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {folder.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/60 mt-3 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-mono">Node #{idx + 1}</span>
                      <a
                        href={`${metadata.htmlUrl}/tree/${metadata.defaultBranch}/${folder.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono text-[10px]"
                      >
                        <span>Browse files</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: SETUP & TEST RUNBOOK ==================== */}
        {activeTab === 'setup' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Prerequisites Badge Row */}
            <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold block mb-2">
                Auto-Detected Prerequisites
              </span>
              <div className="flex flex-wrap gap-2">
                {repoSummary.prerequisites.map((req) => (
                  <div
                    key={req}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Deterministic Setup Terminal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  Deterministic Setup Runbook
                </h4>
                <span className="text-[11px] text-slate-400">
                  Extracted from project configuration files
                </span>
              </div>

              <div className="space-y-3">
                {setupSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="rounded-xl border border-surface-border bg-surface-card overflow-hidden"
                  >
                    <div className="px-4 py-2.5 bg-slate-900/60 border-b border-surface-border/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 font-mono text-xs font-bold">
                          {step.stepNumber}
                        </span>
                        <span className="text-xs font-semibold text-white">
                          {step.title}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60">
                        Verified via {step.sourceFile}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-950 font-mono text-xs text-sky-300 flex items-center justify-between gap-4">
                      <pre className="overflow-x-auto whitespace-pre-wrap flex-1">{step.command}</pre>
                      <button
                        onClick={() => handleCopy(`setup-${step.stepNumber}`, step.command)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-xs shrink-0 transition-colors"
                      >
                        {copiedIndex === `setup-${step.stepNumber}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedIndex === `setup-${step.stepNumber}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {step.notes && (
                      <div className="px-4 py-2 bg-slate-900/40 text-[11px] text-slate-400 border-t border-slate-800/40">
                        Note: {step.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Test Suite Command Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Test Suite & CI Command Matrix
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {testCommands.length} Verified Targets
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testCommands.map((test, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-surface-card border border-surface-border flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {test.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                          {test.sourceFile}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-emerald-300 flex items-center justify-between gap-2 mb-2 border border-slate-800">
                        <code className="truncate">{test.command}</code>
                        <button
                          onClick={() => handleCopy(`test-${idx}`, test.command)}
                          className="p-1 hover:text-white text-slate-400"
                          title="Copy command"
                        >
                          {copiedIndex === `test-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-slate-400">{test.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: BEGINNER TASKS ==================== */}
        {activeTab === 'tasks' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-sky-400" />
                  Starter Tasks & Good First Issues
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  AI-mapped issues connecting live tickets to the exact files you need to touch.
                </p>
              </div>
              <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                {beginnerTasks.length} Available
              </span>
            </div>

            <div className="space-y-4">
              {beginnerTasks.map((task) => (
                <div
                  key={task.issueNumber}
                  className="p-5 rounded-xl bg-surface-card border border-surface-border hover:border-sky-500/40 transition-all space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <a
                      href={task.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-white hover:text-sky-300 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-sky-400 font-mono">#{task.issueNumber}</span>
                      <span>{task.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          task.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : task.difficulty === 'Good First Issue'
                            ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {task.difficulty}
                      </span>
                      {task.isFallback && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                          Unclaimed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="flex flex-wrap gap-1.5">
                    {task.labels.map((lbl) => (
                      <span
                        key={lbl}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>

                  {/* Likely Files to Touch */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold block mb-1.5 flex items-center gap-1">
                      <FileCode2 className="w-3 h-3" /> Likely Files to Touch:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {task.likelyFilesToEdit.map((file) => (
                        <code
                          key={file}
                          className="px-2 py-0.5 rounded bg-slate-900 text-sky-300 font-mono text-xs border border-slate-800"
                        >
                          {file}
                        </code>
                      ))}
                    </div>
                  </div>

                  {/* Action Plan */}
                  <div className="text-xs text-slate-300 leading-relaxed bg-surface-200/50 p-3 rounded-lg border border-surface-border/60">
                    <span className="font-semibold text-slate-200 block mb-1">Recommended Action Plan:</span>
                    <p className="whitespace-pre-line text-slate-400 font-mono text-[11px]">{task.actionPlan}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
                    <button
                      onClick={() => setSelectedTaskForPr(task)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      <GitPullRequest className="w-3.5 h-3.5" />
                      <span>Draft PR Checklist</span>
                    </button>

                    <a
                      href={task.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>View on GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: 13-TOOL ECOSYSTEM MATRIX ==================== */}
        {activeTab === 'ecosystem' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-surface-card border border-surface-border">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  The 13-Tool Developer Matrix
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['All', 'Core Keyword Swaps (7)', 'Architecture & Wiki', 'LLM Context & Ingestion', 'Git Activity & Learning'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEcosystemFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      ecosystemFilter === cat
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 13-Tool Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredEcosystem.map((tool) => (
                <div
                  key={tool.id}
                  className="rounded-xl border border-surface-border bg-surface-card overflow-hidden transition-all hover:border-sky-500/40"
                >
                  {/* Card Header */}
                  <div className="p-4 bg-surface-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border/60">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{tool.name}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60">
                          {tool.category}
                        </span>
                        {tool.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20">
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      {/* URL-Swap Shortcut Pill */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-amber-300 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/40">
                          {tool.shortcutRule}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(`eco-link-${tool.id}`, tool.linkUrl)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors"
                        title="Copy transformed tool URL"
                      >
                        {copiedIndex === `eco-link-${tool.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedIndex === `eco-link-${tool.id}` ? 'Copied' : 'Copy URL'}</span>
                      </button>

                      <a
                        href={tool.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1.5 transition-colors"
                      >
                        <span>Launch Tool</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => toggleCard(tool.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title={expandedCards[tool.id] ? 'Collapse preview' : 'Expand preview'}
                      >
                        {expandedCards[tool.id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Live Content Preview Box */}
                  {expandedCards[tool.id] && (
                    <div className="p-4 space-y-2 bg-[#0B0F19]">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>Preview: {tool.previewTitle}</span>
                        <button
                          onClick={() => handleCopy(`eco-prev-${tool.id}`, tool.previewContent)}
                          className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-[11px]"
                        >
                          {copiedIndex === `eco-prev-${tool.id}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy Excerpt</span>
                        </button>
                      </div>

                      {tool.previewType === 'mermaid' ? (
                        <div className="max-h-64 overflow-auto rounded-lg border border-slate-800">
                          <MermaidViewer chart={tool.previewContent} repoFullName={metadata.fullName} />
                        </div>
                      ) : tool.previewType === 'bullets' ? (
                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
                          {JSON.parse(tool.previewContent).map((bullet: string, bIdx: number) => (
                            <div key={bIdx} className="flex items-start gap-2">
                              <span className="text-sky-400 font-bold">•</span>
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 max-h-56 overflow-y-auto whitespace-pre-wrap">
                          {tool.previewContent}
                        </pre>
                      )}

                      {tool.cliCommand && (
                        <div className="pt-2 flex items-center justify-between text-[11px] font-mono bg-slate-900/60 px-3 py-1.5 rounded border border-slate-800 text-slate-400">
                          <span>CLI Shortcut: <code className="text-sky-300">{tool.cliCommand}</code></span>
                          <button
                            onClick={() => handleCopy(`cli-${tool.id}`, tool.cliCommand!)}
                            className="hover:text-white"
                          >
                            {copiedIndex === `cli-${tool.id}` ? 'Copied' : 'Copy CLI'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: EXPORT & LLM PACK ==================== */}
        {activeTab === 'export' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  Unified Onboarding Markdown & AI Context Pack
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete documentation package ready for Claude, ChatGPT, or your repo's docs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyAllPrompt(fullMarkdownDoc)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-1.5 transition-colors shadow-lg shadow-sky-500/20"
                >
                  {copiedIndex === 'all-prompt' ? (
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedIndex === 'all-prompt' ? 'Copied Everything!' : 'Copy All for AI Prompt'}</span>
                </button>
              </div>
            </div>

            {/* Markdown Preview Viewer */}
            <div className="relative rounded-xl border border-surface-border bg-slate-950 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900/70 border-b border-surface-border/60 text-xs text-slate-400 font-mono flex items-center justify-between">
                <span>ONBOARDING_{metadata.repo.toUpperCase()}.md</span>
                <span className="text-[11px] text-slate-500">{fullMarkdownDoc.length.toLocaleString()} characters</span>
              </div>
              <pre className="p-6 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-[600px] overflow-y-auto leading-relaxed">
                {fullMarkdownDoc}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Draft PR Checklist Modal */}
      <DraftPRModal
        isOpen={!!selectedTaskForPr}
        onClose={() => setSelectedTaskForPr(null)}
        task={selectedTaskForPr}
        metadata={metadata}
      />
    </main>
  );
};
