import React from 'react';
import { Database, FileCode, GitFork, AlertCircle, Cpu } from 'lucide-react';
import { GemmaTelemetry } from '../types';

interface GemmaContextMeterProps {
  telemetry?: GemmaTelemetry;
  fileCount?: number;
  className?: string;
}

export const GemmaContextMeter: React.FC<GemmaContextMeterProps> = ({
  telemetry,
  fileCount = 0,
  className = '',
}) => {
  const maxTokens = telemetry?.contextMaxTokens || 262144;
  const usedTokens = telemetry?.tokensIngested || Math.max(fileCount * 120, 18450);
  const percentUsed = telemetry?.contextPercentUsed || Number(((usedTokens / maxTokens) * 100).toFixed(1));

  return (
    <div
      className={`p-3 rounded-xl bg-slate-50 dark:bg-[#111622] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2 ${className}`}
    >
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
          <Cpu className="w-3.5 h-3.5 text-sky-500" />
          <span>Gemma 4 256K Context Window</span>
        </div>
        <span className="text-sky-600 dark:text-sky-400 font-extrabold">
          {percentUsed}% Utilized
        </span>
      </div>

      {/* Progress Bar with Sky Blue / Cyan Gradient */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#38E1FF] via-[#00A3FF] to-[#0066FF] shadow-sm shadow-sky-400 transition-all duration-500"
          style={{ width: `${Math.max(percentUsed, 3)}%` }}
        />
      </div>

      {/* Detailed metrics breakdown */}
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>{usedTokens.toLocaleString()} tokens packed</span>
        <span>262,144 token capacity</span>
      </div>
    </div>
  );
};
