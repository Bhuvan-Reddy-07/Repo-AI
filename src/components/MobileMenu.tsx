import React from 'react';
import {
  X,
  Plus,
  Moon,
  Sun,
  Search,
  Sparkles,
  GitBranch,
  Settings,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { ChatSession } from '../types';
import { RepoAiLogo } from './RepoAiLogo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNewChat: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onOpenSearch: () => void;
  onOpenFaq?: () => void;
  onOpenUrlSwap: () => void;
  onSelectDemo: (repo: string) => void;
  onOpenCustomDomain?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
  onNewChat,
  sessions,
  activeSessionId,
  onSelectSession,
  onOpenSearch,
  onOpenFaq,
  onOpenUrlSwap,
  onSelectDemo,
  onOpenCustomDomain,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex bg-black/75 backdrop-blur-md animate-fadeIn print:hidden">
      <div className="relative w-4/5 max-w-xs h-full bg-white dark:bg-[#161B22] border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col p-4 space-y-4 overflow-y-auto">
        {/* Header with RepoAI Logo */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <RepoAiLogo size="sm" showWordmark={true} />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search & New Chat Buttons with Sky Blue Gradient */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              onNewChat();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00A3FF] via-[#0080FF] to-[#0066FF] hover:from-[#38E1FF] hover:to-[#0070F3] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-sky-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Repository Inspection</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search site & tools...</span>
            </span>
            <kbd className="text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* 1-Word Swap Tricks Link */}
        <button
          onClick={() => {
            onClose();
            onOpenUrlSwap();
          }}
          className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-200 flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-sky-400" />
            <span>1-Word URL Swap Matrix</span>
          </span>
          <span className="text-[10px] font-mono text-blue-500 font-bold">7 Tools</span>
        </button>

        {/* Quick Demo Repositories */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
            Verified Repositories
          </span>
          <div className="space-y-1">
            {[
              { name: 'Tailwind CSS', repo: 'tailwindlabs/tailwindcss' },
              { name: 'FastAPI', repo: 'fastapi/fastapi' },
              { name: 'Shadcn UI', repo: 'shadcn-ui/ui' },
              { name: 'React', repo: 'facebook/react' },
            ].map((d) => (
              <button
                key={d.repo}
                onClick={() => {
                  onSelectDemo(d.repo);
                  onClose();
                }}
                className="w-full px-3 py-1.5 rounded-lg text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between"
              >
                <span>{d.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{d.repo.split('/')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Compliance & Custom Domain */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
            Production & Legal
          </span>
          {onOpenCustomDomain && (
            <button
              onClick={() => {
                onClose();
                onOpenCustomDomain();
              }}
              className="w-full px-3 py-1.5 rounded-lg text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
            >
              <span>Custom Domain (repoai.dev)</span>
              <span className="text-[10px] font-mono text-emerald-400">Connected</span>
            </button>
          )}
          {onOpenPrivacy && (
            <button
              onClick={() => {
                onClose();
                onOpenPrivacy();
              }}
              className="w-full px-3 py-1.5 rounded-lg text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Privacy Policy
            </button>
          )}
          {onOpenTerms && (
            <button
              onClick={() => {
                onClose();
                onOpenTerms();
              }}
              className="w-full px-3 py-1.5 rounded-lg text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Terms and Conditions
            </button>
          )}
        </div>

        {/* Recent Chat Sessions */}
        {sessions.length > 0 && (
          <div className="flex-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
              Recent Sessions
            </span>
            <div className="space-y-1">
              {sessions.slice(0, 5).map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    onClose();
                  }}
                  className={`w-full px-3 py-1.5 rounded-lg text-left text-xs transition-colors truncate block ${
                    s.id === activeSessionId
                      ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-sky-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar: Dark Mode Toggle */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 mt-auto">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              {isDarkMode ? <Moon className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <button
              onClick={onToggleDarkMode}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
