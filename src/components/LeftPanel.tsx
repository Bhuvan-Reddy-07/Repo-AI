import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bot,
  User,
  GitBranch,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { ProgressStep, ChatMessage, AnalysisResult } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LeftPanelProps {
  onAnalyzeRepo: (repoUrl: string) => Promise<void>;
  isLoading: boolean;
  progressSteps: ProgressStep[];
  chatMessages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  analysisData: AnalysisResult | null;
}

const DEMO_REPOS = [
  { name: 'facebook/react', label: 'facebook/react', lang: 'JavaScript', stars: '228k' },
  { name: 'fastapi/fastapi', label: 'fastapi/fastapi', lang: 'Python', stars: '75k' },
  { name: 'shadcn-ui/ui', label: 'shadcn-ui/ui', lang: 'TypeScript', stars: '72k' },
  { name: 'pallets/flask', label: 'pallets/flask', lang: 'Python', stars: '67k' },
];

export const LeftPanel: React.FC<LeftPanelProps> = ({
  onAnalyzeRepo,
  isLoading,
  progressSteps,
  chatMessages,
  onSendMessage,
  analysisData,
}) => {
  const [inputValue, setInputValue] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, progressSteps]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query || isLoading) return;

    // Check if input looks like a repo url or owner/repo shorthand
    const isRepoInput =
      query.includes('github.com') ||
      /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/.test(query) ||
      !analysisData;

    if (isRepoInput) {
      onAnalyzeRepo(query);
    } else {
      onSendMessage(query);
    }
    setInputValue('');
  };

  const handleDemoClick = (repoName: string) => {
    if (isLoading) return;
    setInputValue(`https://github.com/${repoName}`);
    onAnalyzeRepo(`https://github.com/${repoName}`);
  };

  return (
    <aside className="w-full lg:w-[35%] flex flex-col h-full border-r border-surface-border bg-[#0B0F19]/95 overflow-hidden">
      {/* Panel Subheader */}
      <div className="px-4 py-3 border-b border-surface-border/60 bg-surface-300/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase font-mono">
            Assistant Stream
          </span>
        </div>

        {analysisData && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700/60 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="truncate max-w-[130px]">{analysisData.metadata.fullName}</span>
          </div>
        )}
      </div>

      {/* Demo Repository Quick-Pick Pills */}
      <div className="p-3 border-b border-surface-border/40 bg-surface-card/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            Demo Showcase (Instant 1-Click Test)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Live API</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {DEMO_REPOS.map((demo) => (
            <button
              key={demo.name}
              onClick={() => handleDemoClick(demo.name)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-900 hover:bg-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <GitBranch className="w-3 h-3 text-slate-400" />
              <span>{demo.label}</span>
              <span className="text-[10px] text-sky-400/80">{demo.stars}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation & Progress Scroll Area */}
      <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Welcome message if fresh session */}
        {chatMessages.length === 0 && !isLoading && (
          <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-2.5 my-auto">
            <div className="mx-auto w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white">
              Ready to Onboard Any Repository
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Paste any GitHub repository URL below or click one of the demo pills above to generate a 60-second onboarding runbook.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-[11px] text-slate-400 text-left font-mono bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
              <span className="text-slate-500">// Example inputs accepted:</span>
              <span className="text-sky-300">https://github.com/facebook/react</span>
              <span className="text-sky-300">https://github.com/fastapi/fastapi.git</span>
              <span className="text-sky-300">shadcn-ui/ui</span>
            </div>
          </div>
        )}

        {/* Live Step-by-Step Progress Terminal */}
        {isLoading && progressSteps.length > 0 && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30 font-mono text-xs shadow-lg space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-sky-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                PIPELINE EXECUTING
              </span>
              <span className="text-[10px] text-slate-500">Live Stage</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {progressSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-2">
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  ) : step.status === 'loading' ? (
                    <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin mt-0.5 shrink-0" />
                  ) : step.status === 'error' ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-700 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <span
                      className={`${
                        step.status === 'done'
                          ? 'text-slate-200'
                          : step.status === 'loading'
                          ? 'text-sky-300 font-bold'
                          : step.status === 'error'
                          ? 'text-rose-300'
                          : 'text-slate-600'
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.detail && (
                      <span className="block text-[10px] text-slate-500">
                        ↳ {step.detail}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Stream History */}
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                msg.sender === 'user'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-surface-card border border-surface-border text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    return inline ? (
                      <code className="px-1 py-0.5 bg-slate-900 rounded font-mono text-sky-300 text-[11px]" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="p-2.5 my-1.5 bg-slate-950 rounded-lg overflow-x-auto font-mono text-sky-200 text-[11px] border border-slate-800">
                        <code {...props}>{children}</code>
                      </pre>
                    );
                  },
                  ul({ children }) {
                    return <ul className="list-disc list-inside space-y-1 my-1.5 text-slate-300">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal list-inside space-y-1 my-1.5 text-slate-300">{children}</ol>;
                  },
                  p({ children }) {
                    return <p className="mb-1.5 last:mb-0">{children}</p>;
                  },
                }}
              >
                {msg.text}
              </ReactMarkdown>
              <div className="text-[10px] text-slate-400 mt-1 text-right font-mono">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Follow-up Questions when Repo is Loaded */}
      {analysisData && !isLoading && (
        <div className="px-3 py-2 border-t border-surface-border/40 bg-surface-card/30 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-slate-400 shrink-0">Ask:</span>
          <button
            onClick={() => onSendMessage('Where is authentication / routing handled?')}
            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] shrink-0 transition-colors"
          >
            Where is routing?
          </button>
          <button
            onClick={() => onSendMessage('How do I run tests for the beginner issues?')}
            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] shrink-0 transition-colors"
          >
            How to run tests?
          </button>
          <button
            onClick={() => onSendMessage('Explain the key folder structure')}
            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] shrink-0 transition-colors"
          >
            Explain structure
          </button>
        </div>
      )}

      {/* Chat Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-surface-border bg-surface-300/60">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={
              analysisData
                ? `Ask about ${analysisData.metadata.repo} or enter new GitHub URL...`
                : 'Enter GitHub repo URL (e.g. facebook/react)...'
            }
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-surface-border focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none text-xs text-white placeholder:text-slate-500 font-mono disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-1.5 p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-40 disabled:hover:bg-sky-500 transition-colors"
            title="Submit URL or Question"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </form>
    </aside>
  );
};
