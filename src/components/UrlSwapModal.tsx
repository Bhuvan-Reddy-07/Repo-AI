import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, ArrowRight, Layers } from 'lucide-react';
import { EcosystemTool } from '../types';

interface UrlSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: EcosystemTool[];
  currentRepoFullName: string;
}

const PRIMARY_KEYWORDS = [
  'gitdiagram',
  'gitingest',
  'gitreverse',
  'explaingithub',
  'uithub',
  'github1s',
  'deepwiki',
];

export const UrlSwapModal: React.FC<UrlSwapModalProps> = ({
  isOpen,
  onClose,
  tools,
  currentRepoFullName,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sampleRepo = currentRepoFullName || 'tailwindlabs/tailwindcss';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn print:hidden">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                1-Word GitHub URL Swap Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Pattern: https://[keyword].com/[username]/[repo name]
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Formula Callout Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white font-mono text-[11px] uppercase tracking-wider">
                Core Swappable Keywords
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Target: https://github.com/{sampleRepo}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRIMARY_KEYWORDS.map((kw) => (
                <a
                  key={kw}
                  href={`https://${kw}.com/${sampleRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-white dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
                >
                  <span>{kw}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tools.map((tool) => {
              const isCore = PRIMARY_KEYWORDS.some((kw) => tool.shortcutRule.toLowerCase().includes(kw));

              return (
                <div
                  key={tool.id}
                  className={`p-4 rounded-xl border transition-colors flex flex-col justify-between ${
                    isCore
                      ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60'
                      : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {tool.name}
                        </span>
                        {isCore && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            Core
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {tool.category}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 mb-2">
                      <strong className="text-blue-600 dark:text-blue-400">Rule:</strong> {tool.shortcutRule}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                      {tool.urlSwapExplanation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-auto gap-2">
                    <div className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                      {tool.linkUrl}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(tool.id, tool.linkUrl)}
                        className="px-2 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === tool.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <a
                        href={tool.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
