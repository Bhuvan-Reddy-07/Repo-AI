import React, { useState } from 'react';
import {
  Terminal,
  Layers,
  Code2,
  FileCode,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Search,
} from 'lucide-react';
import { RepoAiLogo } from './RepoAiLogo';

interface WelcomeHeroProps {
  onQuickAction: (actionType: 'explain' | 'setup' | 'issues' | 'ecosystem') => void;
  onSelectDemo?: (repo: string) => void;
}

interface CoreKeyword {
  keyword: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

const CORE_KEYWORDS: CoreKeyword[] = [
  {
    keyword: 'gitdiagram',
    name: 'GitDiagram',
    category: 'Architecture',
    icon: <Layers className="w-3.5 h-3.5 text-sky-500" />,
    description: 'Renders an interactive Mermaid.js diagram and component hierarchy directly from directory tree.',
  },
  {
    keyword: 'gitingest',
    name: 'Gitingest',
    category: 'LLM Digest',
    icon: <Terminal className="w-3.5 h-3.5 text-slate-400" />,
    description: 'Packs all files into a single text digest formatted for LLM context ingestion.',
  },
  {
    keyword: 'gitreverse',
    name: 'GitReverse',
    category: 'Architecture',
    icon: <Code2 className="w-3.5 h-3.5 text-slate-400" />,
    description: 'Extracts data contracts, component hierarchies, and inferred database schemas automatically.',
  },
  {
    keyword: 'explaingithub',
    name: 'ExplainGitHub',
    category: 'Walkthrough',
    icon: <BookOpen className="w-3.5 h-3.5 text-slate-400" />,
    description: 'Structured technical breakdown of algorithms and file responsibilities line by line.',
  },
  {
    keyword: 'uithub',
    name: 'Uithub',
    category: 'Code Reader',
    icon: <Search className="w-3.5 h-3.5 text-slate-400" />,
    description: 'High-speed browser interface for exploring raw source files and directory trees.',
  },
  {
    keyword: 'github1s',
    name: 'GitHub1s',
    category: 'In-Browser IDE',
    icon: <FileCode className="w-3.5 h-3.5 text-sky-500" />,
    description: 'Opens a complete VS Code editor session in WebAssembly with symbol search and code navigation.',
  },
  {
    keyword: 'deepwiki',
    name: 'DeepWiki',
    category: 'Domain Wiki',
    icon: <BookOpen className="w-3.5 h-3.5 text-slate-400" />,
    description: 'Generates structured technical documentation covering architecture boundaries and pipelines.',
  },
];

const SAMPLE_REPOSITORIES = [
  { name: 'tailwindlabs/tailwindcss', label: 'tailwindcss' },
  { name: 'fastapi/fastapi', label: 'fastapi' },
  { name: 'shadcn-ui/ui', label: 'shadcn/ui' },
  { name: 'facebook/react', label: 'react' },
];

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onSelectDemo }) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string>('gitdiagram');
  const [copied, setCopied] = useState<boolean>(false);
  const sampleRepo = 'tailwindlabs/tailwindcss';

  const currentTool = CORE_KEYWORDS.find((k) => k.keyword === selectedKeyword) || CORE_KEYWORDS[0];
  const transformedUrl = `https://${selectedKeyword}.com/${sampleRepo}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(transformedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Editorial Hero Header with Generous Macro-Whitespace */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex justify-center mb-2">
          <RepoAiLogo size="md" showWordmark={true} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
          Inspect any repository in 60 seconds
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
          Deterministic local setup steps, verified CI test runbooks, and deep-link developer ecosystem tools extracted directly from GitHub manifests.
        </p>

        {/* Quick-Start Demo Repository Chips */}
        {onSelectDemo && (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="text-slate-400 text-[11px]">Try sample:</span>
            {SAMPLE_REPOSITORIES.map((repo) => (
              <button
                key={repo.name}
                onClick={() => onSelectDemo(repo.name)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer"
              >
                {repo.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Flat Bento Grid: 3 Clean Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800/80 text-left space-y-2">
          <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
            Zero Mock Data
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Exact install & test commands harvested strictly from package manifests and live GitHub Actions CI workflows.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800/80 text-left space-y-2">
          <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <Cpu className="w-4 h-4 text-sky-500" />
          </div>
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
            Gemma 4 MoE Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            3.8B active parameters with a 256K token context window. Ingests entire git file trees with native thought traces.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800/80 text-left space-y-2">
          <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
            1-Word Ecosystem
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Instantly swap domain keywords in any repo URL to launch architecture diagrams, code digests, or VS Code sessions.
          </p>
        </div>
      </div>

      {/* 1-Word GitHub URL Swap Interactive Selector */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800/80 text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                Domain Keyword Swap
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                https://[keyword].com/[owner]/[repo]
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a keyword to inspect its deep-link shortcut.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <a
              href={transformedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <span>Open {currentTool.name}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 7 Clean Minimal Keyword Chips */}
        <div className="flex flex-wrap gap-1.5">
          {CORE_KEYWORDS.map((tool) => {
            const isSelected = selectedKeyword === tool.keyword;
            return (
              <button
                key={tool.keyword}
                onClick={() => setSelectedKeyword(tool.keyword)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600 text-sky-700 dark:text-sky-300 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tool.icon}
                <span>{tool.keyword}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic URL & Description preview */}
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 overflow-x-auto text-slate-700 dark:text-slate-300">
            <span className="text-slate-400">https://</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold">{selectedKeyword}</span>
            <span className="text-slate-400">.com/{sampleRepo}</span>
          </div>
          <span className="text-slate-400 text-[11px] font-sans">
            {currentTool.description}
          </span>
        </div>
      </div>
    </div>
  );
};
