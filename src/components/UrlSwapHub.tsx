import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Layers,
  Code2,
  BookOpen,
  Search,
  FileCode,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { RepoMetadata } from '../types';

interface UrlSwapHubProps {
  metadata?: RepoMetadata | null;
  className?: string;
}

interface KeywordTool {
  keyword: string;
  name: string;
  tagline: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

const CORE_KEYWORDS: KeywordTool[] = [
  {
    keyword: 'gitdiagram',
    name: 'GitDiagram',
    tagline: 'System Architecture Flowchart',
    category: 'Architecture',
    icon: <Layers className="w-3.5 h-3.5 text-blue-500" />,
    description: 'Renders an interactive Mermaid.js diagram and component hierarchy directly from directory tree.',
  },
  {
    keyword: 'gitingest',
    name: 'Gitingest',
    tagline: 'Single-File Code Digest',
    category: 'Digest',
    icon: <Terminal className="w-3.5 h-3.5 text-slate-400" />,
    description: 'Packs all files into a single text digest formatted for LLMs.',
  },
  {
    keyword: 'gitreverse',
    name: 'GitReverse',
    tagline: 'Reverse-Engineered Schemas',
    category: 'Reverse Engineering',
    icon: <Code2 className="w-3.5 h-3.5 text-slate-400" />,
    description: 'Extracts data contracts, component hierarchies, and inferred database schemas automatically.',
  },
  {
    keyword: 'explaingithub',
    name: 'ExplainGitHub',
    tagline: 'Codebase Walkthrough',
    category: 'Documentation',
    icon: <BookOpen className="w-3.5 h-3.5 text-slate-400" />,
    description: 'Structured technical breakdown of algorithms and file responsibilities line by line.',
  },
  {
    keyword: 'uithub',
    name: 'Uithub',
    tagline: 'Web File Reader',
    category: 'File Browser',
    icon: <Search className="w-3.5 h-3.5 text-slate-400" />,
    description: 'Fast reader for exploring source files, raw contents, and directory structures.',
  },
  {
    keyword: 'github1s',
    name: 'GitHub1s',
    tagline: 'In-Browser VS Code IDE',
    category: 'IDE',
    icon: <FileCode className="w-3.5 h-3.5 text-blue-500" />,
    description: 'Opens a complete VS Code editor session in WebAssembly with symbol search and syntax highlighting.',
  },
  {
    keyword: 'deepwiki',
    name: 'DeepWiki',
    tagline: 'Architecture Wiki',
    category: 'Wiki',
    icon: <BookOpen className="w-3.5 h-3.5 text-slate-400" />,
    description: 'Generates structured technical documentation covering architecture boundaries and pipelines.',
  },
];

export const UrlSwapHub: React.FC<UrlSwapHubProps> = ({ metadata, className = '' }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string>('gitdiagram');
  const [copied, setCopied] = useState<boolean>(false);

  const owner = metadata?.owner || 'tailwindlabs';
  const repo = metadata?.repo || 'tailwindcss';
  const currentFullName = `${owner}/${repo}`;

  const currentTool = CORE_KEYWORDS.find((k) => k.keyword === selectedKeyword) || CORE_KEYWORDS[0];
  const transformedUrl = `https://${selectedKeyword}.com/${currentFullName}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(transformedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 p-5 shadow-sm text-left ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              Domain Keyword Swap
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              https://[keyword].com/[username]/[repo name]
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            1-Word GitHub URL Swap Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Replace "github.com" with any keyword to launch the repository directly in these developer services.
          </p>
        </div>

        {/* Action Buttons with Clean Rectangular Geometry */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy URL'}</span>
          </button>

          <a
            href={transformedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Launch {currentTool.name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Dynamic Visual Transformation Bar */}
      <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 font-mono text-xs mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400">https://</span>
          <span className="line-through text-slate-400 font-medium">github</span>
          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
            {selectedKeyword}
          </span>
          <span className="text-slate-900 dark:text-white font-semibold">.com/{currentFullName}</span>
        </div>

        <span className="text-[10px] text-slate-500 font-mono">
          Direct Deep Link
        </span>
      </div>

      {/* The 7 Core Keyword Selector Buttons (No Emojis, No Pills) */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {CORE_KEYWORDS.map((tool) => {
            const isSelected = selectedKeyword === tool.keyword;
            return (
              <button
                key={tool.keyword}
                onClick={() => setSelectedKeyword(tool.keyword)}
                className={`p-2 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100'
                    : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="p-1 rounded bg-slate-100 dark:bg-slate-800">{tool.icon}</div>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-sm bg-blue-600" />}
                </div>
                <div>
                  <div className="font-mono text-xs font-bold truncate">
                    {tool.keyword}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {tool.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tool Details */}
      <div className="mt-4 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentTool.icon}
            <span className="font-bold text-slate-900 dark:text-white text-xs">
              {currentTool.name}
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {currentTool.tagline}
            </span>
          </div>

          <a
            href={transformedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <span>Open in new tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentTool.description}
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
          <code className="text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-md">
            {transformedUrl}
          </code>
          <button
            onClick={handleCopy}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
