import React from 'react';
import { X, Shield, Lock, HardDrive, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn print:hidden">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Privacy Policy
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Effective Date: October 26, 2026 · Client-Side Architecture Guarantee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Policy Content */}
        <div className="overflow-y-auto py-5 space-y-5 text-xs leading-relaxed pr-2">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-500" />
              1. Architecture & Data Handling
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              RepoAI operates as a client-side developer utility. All repository inspection requests are sent directly from your browser to GitHub's public REST APIs (<code>api.github.com</code>) or your designated proxy. RepoAI does not operate an intermediate server that intercepts, stores, or inspects your source code.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-500" />
              2. Credentials and Local Storage
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Any personal access token (PAT) or optional API key you provide in Settings is persisted exclusively within your local browser <code>localStorage</code>. These credentials never leave your browser for any third-party analytics, tracking servers, or log aggregators.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              3. Telemetry and Cookies
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              We do not track IP addresses, build customer surveillance profiles, or employ advertising trackers. Browser storage is used solely to maintain your interface theme preference, active chat sessions, and local cache to minimize redundant GitHub API calls.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              4. Data Deletion and Portability
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              You retain full control over all stored data. At any time, you can clear all cached repository analysis and credentials by clicking "Clear keys" in Settings, clearing your browser site data, or deleting individual chat sessions from the sidebar.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            RepoAI Open-Source Compliance
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
