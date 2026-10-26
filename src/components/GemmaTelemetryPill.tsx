import React, { useState, useRef, useEffect } from 'react';
import { CloudProvider } from '../lib/gemmaClient';
import {
  Zap,
  ChevronDown,
  BrainCircuit,
  Check,
  Activity,
  Layers,
  Key,
} from 'lucide-react';

interface GemmaTelemetryPillProps {
  provider: CloudProvider;
  onSelectProvider: (provider: CloudProvider) => void;
  enableThinking: boolean;
  onToggleThinking: () => void;
  latencyMs?: number;
  modelUsed?: string;
  onOpenSettings?: () => void;
}

export const GemmaTelemetryPill: React.FC<GemmaTelemetryPillProps> = ({
  provider,
  onSelectProvider,
  enableThinking,
  onToggleThinking,
  latencyMs = 1420,
  modelUsed = 'gemma-4-26b-a4b-it',
  onOpenSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const providerLabels: Record<CloudProvider, { name: string; tag: string; endpoint: string }> = {
    'google-ai-studio': {
      name: 'Google AI Studio',
      tag: 'Native SDK',
      endpoint: 'gemma-4-26b-a4b-it',
    },
    openrouter: {
      name: 'OpenRouter Free Tier',
      tag: 'MoE Nitro',
      endpoint: 'google/gemma-4-26b-a4b-it:free',
    },
    together: {
      name: 'Together / Groq',
      tag: '125+ tok/s',
      endpoint: 'google/gemma-4-26B-A4B-it',
    },
  };

  const currentLabel = providerLabels[provider];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Minimalist Telemetry Capsule Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer text-xs font-mono"
        title="Gemma 4 26B A4B MoE Cloud Telemetry & Provider Settings"
      >
        {/* Subtle Status Indicator Dot */}
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
        </span>

        {/* Minimal Pill Text */}
        <div className="flex items-center gap-1.5 font-medium">
          <span className="font-semibold text-slate-900 dark:text-white">Gemma 4 MoE</span>
          <span className="text-slate-400 hidden md:inline">· 256K</span>
          <span className="text-slate-400 font-normal">
            {(latencyMs / 1000).toFixed(1)}s
          </span>
        </div>

        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-sky-500' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-fadeIn text-xs">
          {/* Header */}
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                Gemma 4 MoE Architecture
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                128 Experts
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              3.8B active params per token • 262,144 token context window.
            </p>
          </div>

          {/* Provider Selection Options */}
          <div className="space-y-1">
            {(Object.keys(providerLabels) as CloudProvider[]).map((prov) => {
              const info = providerLabels[prov];
              const isSelected = provider === prov;

              return (
                <button
                  key={prov}
                  type="button"
                  onClick={() => {
                    onSelectProvider(prov);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-sky-50 dark:bg-sky-950/40 border border-sky-400/30 text-sky-900 dark:text-sky-200'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs flex items-center gap-1.5">
                      <span>{info.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {info.tag}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">
                      {info.endpoint}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-sky-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Thinking Mode Toggle Switch */}
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-3 py-1.5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Thinking Mode</span>
                <span className="font-mono text-[9px] text-sky-400">&lt;|think|&gt;</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Outputs deep reasoning traces before code synthesis.
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleThinking}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enableThinking ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  enableThinking ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Cloud API Key Settings link */}
          {onOpenSettings && (
            <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenSettings();
                }}
                className="w-full px-3 py-1.5 rounded-lg text-left text-xs font-mono text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30 flex items-center gap-1.5 transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Configure Cloud API Keys...</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
