import React from 'react';
import { Loader2, Sparkles, Database, FileCode2, Terminal } from 'lucide-react';
import { ProgressStep } from '../types';

interface LoadingStateCardProps {
  progressSteps: ProgressStep[];
}

export const LoadingStateCard: React.FC<LoadingStateCardProps> = ({ progressSteps }) => {
  const activeStep = progressSteps.find((s) => s.status === 'loading') || progressSteps[0];

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Analyzing repository...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeStep ? activeStep.label : 'Fetching metadata...'}
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs font-mono">
        {progressSteps.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            {s.status === 'done' ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            ) : s.status === 'loading' ? (
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
            )}
            <span
              className={`${
                s.status === 'done'
                  ? 'text-slate-600 dark:text-slate-400'
                  : s.status === 'loading'
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
