import React, { useState } from 'react';
import { X, GitPullRequest, Copy, Check, ExternalLink } from 'lucide-react';
import { BeginnerTask, RepoMetadata } from '../types';

interface DraftPRModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: BeginnerTask | null;
  metadata: RepoMetadata;
}

export const DraftPRModal: React.FC<DraftPRModalProps> = ({
  isOpen,
  onClose,
  task,
  metadata,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !task) return null;

  const prTitle = `fix: ${task.title.toLowerCase().replace(/^(fix|bug|feat):\s*/i, '')} (#${task.issueNumber})`;

  const prMarkdown = `## Description
This pull request addresses issue #${task.issueNumber}: **${task.title}**.

### Proposed Changes:
${task.likelyFilesToEdit.map((f) => `- Modify \`${f}\` to resolve the root cause`).join('\n')}
- Followed recommended action plan:
${task.actionPlan.split('\n').map((l) => `  ${l}`).join('\n')}

### Linked Issue
Closes #${task.issueNumber}

---

## Contributor Verification Checklist
- [x] My code adheres to the project's coding standards and style guide
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have added unit test cases covering the fix/feature
- [x] All existing automated tests pass locally (\`${metadata.defaultBranch}\`)
- [x] No new warnings or linter errors introduced
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`### PR Title:\n${prTitle}\n\n### PR Body:\n${prMarkdown}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const compareUrl = `${metadata.htmlUrl}/compare`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0B101D] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Draft Pull Request Checklist
              </h2>
              <p className="text-xs text-slate-400">
                Ready-to-paste PR description for Issue #{task.issueNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Suggested PR Title:
            </label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300">
              {prTitle}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Suggested PR Body & Checklist:
            </label>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-72 overflow-y-auto">
              {prMarkdown}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Copy template then submit PR against <code className="text-sky-300 font-mono">{metadata.defaultBranch}</code>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy PR Markdown'}
            </button>
            <a
              href={compareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors"
            >
              <span>Open PR on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
