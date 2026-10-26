import React, { useState } from 'react';
import {
  Download,
  Settings,
  Key,
  ShieldCheck,
  Check,
  Menu,
  Share2,
  ExternalLink,
  Search,
  Printer,
  Moon,
  Sun,
  AlertCircle,
  Globe,
  FileText,
  Shield,
  Layers,
  MoreHorizontal,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { generateOnboardingMarkdown } from '../lib/exportMarkdown';
import { RepoAiLogo } from './RepoAiLogo';
import { GemmaTelemetryPill } from './GemmaTelemetryPill';
import { CloudProvider } from '../lib/gemmaClient';

interface HeaderProps {
  onOpenUrlSwap: () => void;
  analysisData: AnalysisResult | null;
  githubToken: string;
  onSaveGithubToken: (token: string) => void;
  geminiKey: string;
  onSaveGeminiKey: (key: string) => void;
  openRouterKey?: string;
  onSaveOpenRouterKey?: (key: string) => void;
  provider: CloudProvider;
  onSelectProvider: (provider: CloudProvider) => void;
  enableThinking: boolean;
  onToggleThinking: () => void;
  onToggleSidebar?: () => void;
  onShare?: () => void;
  onOpenSearch?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenDomainModal?: () => void;
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
  activeTitle?: string;
  activeSubtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUrlSwap,
  analysisData,
  githubToken,
  onSaveGithubToken,
  geminiKey,
  onSaveGeminiKey,
  openRouterKey = '',
  onSaveOpenRouterKey,
  provider,
  onSelectProvider,
  enableThinking,
  onToggleThinking,
  onToggleSidebar,
  onShare,
  onOpenSearch,
  isDarkMode,
  onToggleDarkMode,
  onOpenDomainModal,
  onOpenPrivacyModal,
  onOpenTermsModal,
  activeTitle = 'RepoAI',
  activeSubtitle = 'Repository Architecture & Setup Inspector',
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempGhToken, setTempGhToken] = useState(githubToken);
  const [tempGeminiKey, setTempGeminiKey] = useState(geminiKey);
  const [tempOpenRouterKey, setTempOpenRouterKey] = useState(openRouterKey);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanGh = tempGhToken.trim();
    const cleanGemini = tempGeminiKey.trim();
    const cleanOpenRouter = tempOpenRouterKey.trim();

    onSaveGithubToken(cleanGh);
    onSaveGeminiKey(cleanGemini);
    if (onSaveOpenRouterKey) {
      onSaveOpenRouterKey(cleanOpenRouter);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSettings(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    if (!analysisData) return;
    const markdown = generateOnboardingMarkdown(analysisData);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ONBOARDING_${analysisData.metadata.repo.toUpperCase()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] transition-colors print:hidden">
      {/* Left Title & Subtitle */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          {analysisData ? (
            <RepoAiLogo size="xs" showWordmark={false} />
          ) : (
            <RepoAiLogo size="sm" showWordmark={false} />
          )}
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {analysisData ? (
                <>
                  <span>{analysisData.metadata.fullName}</span>
                  <a
                    href={analysisData.metadata.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                    title="View on GitHub"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </>
              ) : (
                <div className="flex items-baseline font-extrabold tracking-tight">
                  <span className="text-slate-900 dark:text-white">Repo</span>
                  <span className="bg-gradient-to-r from-[#38E1FF] via-[#00A3FF] to-[#0066FF] bg-clip-text text-transparent">AI</span>
                </div>
              )}
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {analysisData ? 'Repository Architecture Inspector' : activeSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Minimalist Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Gemma 4 MoE Telemetry Pill & Provider Switcher */}
        <GemmaTelemetryPill
          provider={provider}
          onSelectProvider={onSelectProvider}
          enableThinking={enableThinking}
          onToggleThinking={onToggleThinking}
          latencyMs={analysisData?.gemmaTelemetry?.latencyMs}
          modelUsed={analysisData?.gemmaTelemetry?.modelUsed}
          onOpenSettings={() => setShowSettings(true)}
        />

        {/* Global Site Search Trigger */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="px-2.5 py-1.5 text-xs rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            title="Search site & tools (Ctrl+K / Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden md:inline text-[11px] font-mono">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-white dark:bg-slate-900 text-slate-500 rounded border border-slate-200 dark:border-slate-800">
              Ctrl+K
            </kbd>
          </button>
        )}

        {/* URL Swap Modal Trigger */}
        <button
          onClick={onOpenUrlSwap}
          className="hidden md:flex px-2.5 py-1.5 text-xs font-mono rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 items-center gap-1.5 transition-colors cursor-pointer"
          title="Domain Keyword Swap Integrations"
        >
          <Layers className="w-3.5 h-3.5 text-sky-500" />
          <span>URL Swap</span>
        </button>

        {/* Dark Mode Toggle */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark and Light Mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        )}

        {/* Overflow Menu for Secondary Actions */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-2 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="More actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 text-xs font-mono space-y-0.5 animate-fadeIn">
              {analysisData && (
                <button
                  onClick={() => {
                    handleExportMarkdown();
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-500" />
                  <span>Export ONBOARDING.md</span>
                </button>
              )}
              <button
                onClick={() => {
                  handlePrint();
                  setShowMoreMenu(false);
                }}
                className="w-full px-2.5 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print Runbook (Ctrl+P)</span>
              </button>
              {onShare && (
                <button
                  onClick={() => {
                    onShare();
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Share Repository Link</span>
                </button>
              )}
              {onOpenDomainModal && (
                <button
                  onClick={() => {
                    onOpenDomainModal();
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Custom Domain (repoai.dev)</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Settings Popover Button */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              githubToken || geminiKey
                ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Configure GitHub Token & API Credentials"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Settings Dropdown Popover */}
          {showSettings && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 p-4 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 shadow-xl z-50 text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Credentials & API Access</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">client-side only</span>
              </div>

              {/* Form Success State Banner */}
              {saveSuccess && (
                <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Credentials stored securely in browser localStorage</span>
                </div>
              )}

              {/* Form Error State Banner */}
              {formError && (
                <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      GitHub Personal Access Token (Optional)
                    </label>
                  </div>
                  <input
                    type="password"
                    value={tempGhToken}
                    onChange={(e) => {
                      setTempGhToken(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="ghp_... (Unlocks 5,000 req/hr rate limit)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-200 font-mono text-xs placeholder:text-slate-400"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Bypasses the public 60 req/hr unauthenticated limit during analysis.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      Google AI Studio Key (GEMINI_API_KEY)
                    </label>
                  </div>
                  <input
                    type="password"
                    value={tempGeminiKey}
                    onChange={(e) => {
                      setTempGeminiKey(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="AIzaSy... (Direct Gemma 4 26B A4B MoE)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none text-slate-800 dark:text-slate-200 font-mono text-xs placeholder:text-slate-400"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Powers gemma-4-26b-a4b-it via @google/genai SDK.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      OpenRouter API Key (OPENROUTER_API_KEY)
                    </label>
                  </div>
                  <input
                    type="password"
                    value={tempOpenRouterKey}
                    onChange={(e) => {
                      setTempOpenRouterKey(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="sk-or-v1-... (Free tier MoE endpoint)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none text-slate-800 dark:text-slate-200 font-mono text-xs placeholder:text-slate-400"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Routes to google/gemma-4-26b-a4b-it:free ($0 cost failover).
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setTempGhToken('');
                      setTempGeminiKey('');
                      setTempOpenRouterKey('');
                      onSaveGithubToken('');
                      onSaveGeminiKey('');
                      if (onSaveOpenRouterKey) onSaveOpenRouterKey('');
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 1200);
                    }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs"
                  >
                    Clear keys
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg font-semibold bg-gradient-to-r from-[#00A3FF] via-[#0080FF] to-[#0066FF] hover:from-[#38E1FF] hover:to-[#0070F3] text-white flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {saveSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{saveSuccess ? 'Saved' : 'Save Credentials'}</span>
                  </button>
                </div>
              </form>

              {/* Legal and Domain Quick Links */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                {onOpenPrivacyModal && (
                  <button onClick={onOpenPrivacyModal} className="hover:underline hover:text-slate-800 dark:hover:text-slate-200">
                    Privacy Policy
                  </button>
                )}
                {onOpenTermsModal && (
                  <button onClick={onOpenTermsModal} className="hover:underline hover:text-slate-800 dark:hover:text-slate-200">
                    Terms & Conditions
                  </button>
                )}
                {onOpenDomainModal && (
                  <button onClick={onOpenDomainModal} className="hover:underline hover:text-slate-800 dark:hover:text-slate-200">
                    Custom Domain
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
