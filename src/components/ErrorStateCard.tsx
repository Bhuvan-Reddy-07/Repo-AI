import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateCardProps {
  errorMessage?: string;
  onRetry: () => void;
}

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({
  errorMessage = 'Invalid repository URL or network error.',
  onRetry,
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-rose-200 dark:border-rose-900/60 shadow-xl space-y-3.5 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">
            Failed to analyze repository
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {errorMessage}
          </p>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={onRetry}
          className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-colors shadow-md shadow-rose-600/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
};
