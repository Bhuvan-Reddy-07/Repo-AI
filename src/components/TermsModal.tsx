import React from 'react';
import { X, FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn print:hidden">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Terms and Conditions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Effective Date: October 26, 2026 · Software License & Acceptable Use
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="overflow-y-auto py-5 space-y-5 text-xs leading-relaxed pr-2">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              1. Software License
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              RepoAI is provided as open-source developer software under the MIT License. You are free to inspect, deploy, run, and modify this utility for personal, internal, or commercial workflows in accordance with the license conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              2. Acceptable Use & API Rate Limits
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Users agree to abide by GitHub's Acceptable Use Policies and API Terms of Service. RepoAI provides client-side throttling and caching mechanisms to prevent exceeding unauthenticated (60 req/hr) and authenticated (5,000 req/hr) thresholds. Automated abusive scraping of GitHub endpoints is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              3. Terminal Execution & Verification Disclaimer
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Setup and test commands extracted by RepoAI reflect the manifest declarations found within the target repository. Users are responsible for inspecting commands prior to running them in local execution environments or on privileged hardware. The software is provided "as is", without warranty of any kind.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              4. Third-Party Ecosystem Integrations
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              The 1-word URL swap integrations (GitDiagram, Gitingest, GitReverse, ExplainGitHub, Uithub, GitHub1s, DeepWiki) are independent third-party services. Navigating to these domains is subject to their respective terms and data policies.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            MIT License · Open-Source Software
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors"
          >
            Agree & Close
          </button>
        </div>
      </div>
    </div>
  );
};
