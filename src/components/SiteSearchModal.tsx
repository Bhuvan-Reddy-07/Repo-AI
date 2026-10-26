import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Layers,
  Terminal,
  FolderTree,
  Target,
  ExternalLink,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Tools' | 'Setup & Tests' | 'Folders' | 'Tasks' | 'FAQ' | 'Demos';
  actionType: 'url' | 'navigate' | 'demo' | 'copy';
  payload?: string;
  icon: React.ReactNode;
}

interface SiteSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: AnalysisResult | null;
  onSelectDemo: (repo: string) => void;
  onOpenTab: (tab: 'folders' | 'setup' | 'tasks' | 'ecosystem' | 'export') => void;
}

export const SiteSearchModal: React.FC<SiteSearchModalProps> = ({
  isOpen,
  onClose,
  analysisData,
  onSelectDemo,
  onOpenTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Search items list
  const allItems: SearchItem[] = useMemo(() => {
    const currentFullName = analysisData?.metadata.fullName || 'tailwindlabs/tailwindcss';
    const items: SearchItem[] = [
      // 7 Core Keyword Swaps
      {
        id: 'kw-gitdiagram',
        title: 'GitDiagram (gitdiagram.com)',
        subtitle: `Render interactive architecture diagrams: https://gitdiagram.com/${currentFullName}`,
        category: 'Tools',
        actionType: 'url',
        payload: `https://gitdiagram.com/${currentFullName}`,
        icon: <Layers className="w-4 h-4 text-sky-400" />,
      },
      {
        id: 'kw-gitingest',
        title: 'Gitingest (gitingest.com)',
        subtitle: `Single-file prompt digest for LLMs: https://gitingest.com/${currentFullName}`,
        category: 'Tools',
        actionType: 'url',
        payload: `https://gitingest.com/${currentFullName}`,
        icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'kw-gitreverse',
        title: 'GitReverse (gitreverse.com)',
        subtitle: `Reverse-engineer architecture & schemas: https://gitreverse.com/${currentFullName}`,
        category: 'Tools',
        actionType: 'url',
        payload: `https://gitreverse.com/${currentFullName}`,
        icon: <Code2 className="w-4 h-4 text-sky-400" />,
      },
      {
        id: 'kw-explaingithub',
        title: 'ExplainGitHub (explaingithub.com)',
        subtitle: `Conversational AI codebase walkthrough: https://explaingithub.com/${currentFullName}`,
        category: 'Tools',
        actionType: 'url',
        payload: `https://explaingithub.com/${currentFullName}`,
        icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'kw-uithub',
        title: 'Uithub (uithub.com)',
        subtitle: `Fast in-browser file explorer & viewer: https://uithub.com/${currentFullName}`,
        category: 'Tools',
        actionType: 'url',
        payload: `https://uithub.com/${currentFullName}`,
        icon: <FolderTree className="w-4 h-4 text-cyan-400" />,
      },
      {
        id: 'kw-github1s',
        title: 'GitHub1s (github1s.com)',
        subtitle: `In-browser VS Code IDE session: https://github1s.com/${currentFullName}`,
        category: 'Tools',
        actionType: 'url',
        payload: `https://github1s.com/${currentFullName}`,
        icon: <Terminal className="w-4 h-4 text-blue-400" />,
      },
      {
        id: 'kw-deepwiki',
        title: 'DeepWiki (deepwiki.com)',
        subtitle: `Executive 3-bullet architecture wiki: https://deepwiki.com/${currentFullName}`,
        category: 'Tools',
        actionType: 'url',
        payload: `https://deepwiki.com/${currentFullName}`,
        icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      },
      // Demo Repos
      {
        id: 'demo-tailwind',
        title: 'tailwindlabs/tailwindcss',
        subtitle: 'Analyze Tailwind CSS (TypeScript, Node.js)',
        category: 'Demos',
        actionType: 'demo',
        payload: 'tailwindlabs/tailwindcss',
        icon: <Sparkles className="w-4 h-4 text-sky-400" />,
      },
      {
        id: 'demo-fastapi',
        title: 'fastapi/fastapi',
        subtitle: 'Analyze FastAPI Framework (Python, Pytest)',
        category: 'Demos',
        actionType: 'demo',
        payload: 'fastapi/fastapi',
        icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      },
      {
        id: 'demo-shadcn',
        title: 'shadcn-ui/ui',
        subtitle: 'Analyze Shadcn UI components (React, Tailwind)',
        category: 'Demos',
        actionType: 'demo',
        payload: 'shadcn-ui/ui',
        icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      },
      // FAQs
      {
        id: 'faq-1',
        title: 'How does the 1-word URL swap work?',
        subtitle: 'Replace "github" in any repo URL with keywords like gitdiagram, gitingest, github1s',
        category: 'FAQ',
        actionType: 'navigate',
        payload: 'faq',
        icon: <HelpCircle className="w-4 h-4 text-amber-400" />,
      },
      {
        id: 'faq-2',
        title: 'How are setup commands verified?',
        subtitle: 'Commands are parsed directly from package.json, Makefile, and CI workflows',
        category: 'FAQ',
        actionType: 'navigate',
        payload: 'setup',
        icon: <HelpCircle className="w-4 h-4 text-amber-400" />,
      },
    ];

    // If analysis data exists, add repo-specific items
    if (analysisData) {
      // Key Folders
      analysisData.keyFolders.forEach((f) => {
        items.push({
          id: `folder-${f.path}`,
          title: f.path,
          subtitle: `${f.role}: ${f.description}`,
          category: 'Folders',
          actionType: 'navigate',
          payload: 'folders',
          icon: <FolderTree className="w-4 h-4 text-indigo-400" />,
        });
      });

      // Setup Steps
      analysisData.setupSteps.forEach((s) => {
        items.push({
          id: `setup-${s.stepNumber}`,
          title: `${s.title}: ${s.command}`,
          subtitle: `Source: ${s.sourceFile} ${s.notes ? `· ${s.notes}` : ''}`,
          category: 'Setup & Tests',
          actionType: 'navigate',
          payload: 'setup',
          icon: <Terminal className="w-4 h-4 text-amber-400" />,
        });
      });

      // Test Commands
      analysisData.testCommands.forEach((t, idx) => {
        items.push({
          id: `test-${idx}`,
          title: t.command,
          subtitle: `${t.type} · ${t.description} (${t.sourceFile})`,
          category: 'Setup & Tests',
          actionType: 'navigate',
          payload: 'setup',
          icon: <Terminal className="w-4 h-4 text-emerald-400" />,
        });
      });

      // Beginner Tasks
      analysisData.beginnerTasks.forEach((t) => {
        items.push({
          id: `task-${t.issueNumber}`,
          title: `#${t.issueNumber} ${t.title}`,
          subtitle: `${t.difficulty} · Likely files: ${t.likelyFilesToEdit.slice(0, 2).join(', ')}`,
          category: 'Tasks',
          actionType: 'navigate',
          payload: 'tasks',
          icon: <Target className="w-4 h-4 text-rose-400" />,
        });
      });
    }

    return items;
  }, [analysisData]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchItem) => {
    if (item.actionType === 'url' && item.payload) {
      window.open(item.payload, '_blank', 'noopener,noreferrer');
      onClose();
    } else if (item.actionType === 'demo' && item.payload) {
      onSelectDemo(item.payload);
      onClose();
    } else if (item.actionType === 'navigate' && item.payload) {
      if (item.payload === 'folders' || item.payload === 'setup' || item.payload === 'tasks' || item.payload === 'ecosystem' || item.payload === 'export') {
        onOpenTab(item.payload);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-fadeIn print:hidden">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, commands, folders, beginner issues, FAQs... (e.g. gitdiagram)"
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No results found for "{query}". Try "gitdiagram", "setup", or "tasks".
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full p-3 rounded-2xl text-left flex items-center justify-between gap-3 transition-colors ${
                  idx === selectedIndex
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-white'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold truncate">{item.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 font-mono">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center text-xs text-slate-400">
                  {item.actionType === 'url' ? (
                    <ExternalLink className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Search Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Tip: Type keyword name like "gitdiagram" or "gitingest" to launch instantly</span>
          </div>
          <button
            onClick={onClose}
            className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
