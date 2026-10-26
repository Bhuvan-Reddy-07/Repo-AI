import React, { useState } from 'react';
import {
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Terminal,
  Copy,
  Check,
  Sparkles,
  Zap,
} from 'lucide-react';

interface GemmaThinkingAccordionProps {
  reasoningTrace: string | null;
  modelUsed?: string;
  latencyMs?: number;
  initiallyOpen?: boolean;
}

export const GemmaThinkingAccordion: React.FC<GemmaThinkingAccordionProps> = ({
  reasoningTrace,
  modelUsed = 'gemma-4-26b-a4b-it',
  latencyMs = 1420,
  initiallyOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [copied, setCopied] = useState(false);

  if (!reasoningTrace) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reasoningTrace);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl border border-sky-500/30 dark:border-sky-500/40 bg-white dark:bg-[#0D1117] overflow-hidden shadow-sm transition-all mb-4">
      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-gradient-to-r from-sky-500/10 via-blue-600/5 to-transparent dark:from-sky-950/40 dark:via-[#111622] dark:to-[#0D1117] flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-sky-500/15"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-gradient-to-r from-[#00A3FF] to-[#0066FF] flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
            <BrainCircuit className="w-3.5 h-3.5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                Gemma 4 &lt;|channel&gt;thought
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-400/30">
                MoE Reasoning Trace
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              3.8B active expert routing • Latency {(latencyMs / 1000).toFixed(2)}s
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {isOpen ? 'Collapse Trace' : 'Expand Trace'}
          </span>
          <div className="p-1 rounded text-slate-400 hover:text-slate-200">
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-sky-400" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Accordion Body: Raw Step-by-Step Terminal Card */}
      {isOpen && (
        <div className="p-4 bg-[#080C14] border-t border-slate-100 dark:border-slate-800/80 font-mono text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Model Channel: {modelUsed}</span>
            </div>

            <button
              onClick={handleCopy}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 transition-colors text-[10px]"
              title="Copy Reasoning Trace"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Trace</span>
                </>
              )}
            </button>
          </div>

          <pre className="whitespace-pre-wrap break-words text-slate-300 leading-relaxed max-h-72 overflow-y-auto selection:bg-sky-500 selection:text-white pr-2">
            {reasoningTrace}
          </pre>
        </div>
      )}
    </div>
  );
};
