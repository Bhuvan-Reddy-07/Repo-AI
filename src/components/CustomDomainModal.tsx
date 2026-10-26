import React, { useState } from 'react';
import { X, Globe, CheckCircle2, Copy, Check, ArrowRight, ShieldCheck, Server } from 'lucide-react';

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({ isOpen, onClose }) => {
  const [customDomain, setCustomDomain] = useState(() => localStorage.getItem('repo_ai_custom_domain') || 'repoai.dev');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDomain.trim()) {
      localStorage.setItem('repo_ai_custom_domain', customDomain.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn print:hidden">
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Custom Domain Configuration</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Ready for Production
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect your custom domain for clean production deployments.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Domain Form */}
        <form onSubmit={handleSaveDomain} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Active Domain Name
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="e.g. repoai.dev or onboard.company.com"
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {isSaved ? 'Saved!' : 'Save Domain'}
            </button>
          </div>
        </form>

        {/* DNS Configuration Table */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-500" /> DNS Records
            </span>
            <span className="text-[10px] text-slate-500 font-mono">TTL: 300s</span>
          </div>

          <div className="space-y-2 text-[11px] font-mono">
            {/* CNAME Record */}
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Type: CNAME</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">@ or sub</span>
                <span className="text-slate-400 mx-1.5">➔</span>
                <span className="text-blue-600 dark:text-blue-400">cname.vercel-dns.com</span>
              </div>
              <button
                onClick={() => handleCopy('cname', 'cname.vercel-dns.com')}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Copy Value"
              >
                {copiedRecord === 'cname' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* A Record */}
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Type: A</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">@ (Apex)</span>
                <span className="text-slate-400 mx-1.5">➔</span>
                <span className="text-blue-600 dark:text-blue-400">76.76.21.21</span>
              </div>
              <button
                onClick={() => handleCopy('a', '76.76.21.21')}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Copy Value"
              >
                {copiedRecord === 'a' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Automatic SSL / TLS certificate issued via Let's Encrypt</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
