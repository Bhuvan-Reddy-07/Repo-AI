import React, { useState } from 'react';
import {
  Terminal,
  FolderTree,
  ExternalLink,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Calendar,
  GitBranch,
  Star,
  GitFork,
  CheckCircle2,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { UrlSwapHub } from './UrlSwapHub';
import { RepoAiLogo } from './RepoAiLogo';
import { GemmaThinkingAccordion } from './GemmaThinkingAccordion';
import { GemmaContextMeter } from './GemmaContextMeter';

interface RepoWalkthroughCardProps {
  analysis: AnalysisResult;
  onOpenWorkspaceTab: (tab: 'folders' | 'setup' | 'tasks' | 'ecosystem' | 'export') => void;
}

export const RepoWalkthroughCard: React.FC<RepoWalkthroughCardProps> = ({
  analysis,
  onOpenWorkspaceTab,
}) => {
  const [copied, setCopied] = useState(false);

  const cloneCmd = analysis.setupSteps[0]?.command || `git clone ${analysis.metadata.htmlUrl}.git`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(cloneCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Formatted last updated date
  const lastUpdatedFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date());

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-none overflow-hidden text-left">
      {/* Header with Title and Last Updated Date */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0D1117] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <RepoAiLogo size="xs" showWordmark={false} />
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white">RepoAI</span>
            <span className="text-slate-400 mx-1.5">/</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Repository Inspection</span>
          </div>
        </div>

        {/* Last Updated Date & Git Branch Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            <span>Updated: <strong className="text-slate-700 dark:text-slate-200">{lastUpdatedFormatted}</strong></span>
          </div>

          <button
            onClick={() => onOpenWorkspaceTab('folders')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1 transition-colors"
          >
            <span>Open Architecture Tree</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Gemma 4 MoE Thinking Accordion (if enabled & reasoning available) */}
        {analysis.gemmaTelemetry?.reasoningTrace && (
          <GemmaThinkingAccordion
            reasoningTrace={analysis.gemmaTelemetry.reasoningTrace}
            modelUsed={analysis.gemmaTelemetry.modelUsed}
            latencyMs={analysis.gemmaTelemetry.latencyMs}
            initiallyOpen={true}
          />
        )}

        {/* Gemma 4 256K Context Utilization Meter */}
        <GemmaContextMeter
          telemetry={analysis.gemmaTelemetry}
          fileCount={analysis.fileCount}
        />
        {/* Section 1: Overview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Overview
            </h4>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-slate-400" /> {analysis.metadata.defaultBranch}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {analysis.metadata.stars.toLocaleString()}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3 text-slate-400" /> {analysis.metadata.forks.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
            {analysis.repoSummary.oneLinePitch}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {analysis.repoSummary.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Section 2: Setup Commands */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Deterministic Setup Commands
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              Source: {analysis.setupSteps[0]?.sourceFile || 'package.json'}
            </span>
          </div>

          <div className="rounded-xl bg-[#090D16] p-4 text-xs font-mono text-slate-200 border border-slate-800">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-blue-400" /> Terminal Runbook
              </span>
              <button
                onClick={handleCopyCmd}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                title="Copy commands"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-blue-200">
              {cloneCmd}
              {analysis.setupSteps[1] ? `\n${analysis.setupSteps[1].command}` : ''}
            </pre>
          </div>
        </div>

        {/* Section 3: Folder Explanations */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
              Directory Structure Roles
            </h4>
            <button
              onClick={() => onOpenWorkspaceTab('folders')}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
            >
              View architecture tree
            </button>
          </div>

          <div className="space-y-2">
            {analysis.keyFolders.slice(0, 4).map((f) => (
              <div
                key={f.path}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2">
                  <FolderTree className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {f.path}
                    </span>
                    <span className="text-slate-400 mx-1">:</span>
                    <span className="text-slate-600 dark:text-slate-300">{f.description}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                  {f.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: The 1-Word GitHub URL Swap Matrix */}
        <div>
          <UrlSwapHub metadata={analysis.metadata} />
        </div>

        {/* Bottom Workspace Action Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Explore complete architecture diagram and contribution checklist:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenWorkspaceTab('tasks')}
              className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Good First Issues ({analysis.beginnerTasks.length})
            </button>
            <button
              onClick={() => onOpenWorkspaceTab('folders')}
              className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-none"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Open 5-Tab Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
