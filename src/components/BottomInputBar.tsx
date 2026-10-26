import React, { useState } from 'react';
import { Plus, Send, Link2, Loader2, GitBranch } from 'lucide-react';

interface BottomInputBarProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onSelectSampleRepo: (repo: string) => void;
  placeholder?: string;
}

const SAMPLE_REPOS = [
  { name: 'tailwindlabs/tailwindcss', desc: 'CSS Framework (TypeScript & Rust)' },
  { name: 'fastapi/fastapi', desc: 'Python API Framework' },
  { name: 'shadcn-ui/ui', desc: 'React Component Library' },
  { name: 'facebook/react', desc: 'Core Frontend Library' },
];

export const BottomInputBar: React.FC<BottomInputBarProps> = ({
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  onSelectSampleRepo,
  placeholder = 'Enter GitHub repository URL (e.g., https://github.com/tailwindlabs/tailwindcss)...',
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 relative">
      {/* Quick Repository Selector Popover */}
      {showQuickMenu && (
        <div className="absolute bottom-14 left-4 w-72 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 text-xs">
          <div className="px-2 py-1 text-[11px] font-mono text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 mb-1">
            Verified Sample Repositories
          </div>
          <div className="space-y-0.5">
            {SAMPLE_REPOS.map((r) => (
              <button
                key={r.name}
                type="button"
                onClick={() => {
                  onSelectSampleRepo(r.name);
                  setShowQuickMenu(false);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white font-mono text-xs">
                    {r.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{r.desc}</div>
                </div>
                <GitBranch className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Capsule with Minimalist Geometry */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 p-1.5 pl-3 rounded-lg bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-sm transition-all focus-within:border-sky-500/80 focus-within:ring-1 focus-within:ring-sky-500/20"
      >
        {/* Quick Menu Button */}
        <button
          type="button"
          onClick={() => setShowQuickMenu(!showQuickMenu)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Sample Repositories"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Input Field */}
        <div className="flex-1 flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none font-sans"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button: Clean & Minimal */}
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="px-3.5 py-1.5 rounded-md font-medium text-xs bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 disabled:opacity-30 transition-all flex items-center gap-1.5 cursor-pointer shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline font-mono text-[11px]">Inspecting...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline font-mono text-[11px]">Inspect</span>
              <Send className="w-3 h-3" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
