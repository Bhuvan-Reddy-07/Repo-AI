import React, { useState, useEffect } from 'react';
import { Cookie, X, ShieldCheck } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('repo_ai_cookie_consent');
    if (!consent) {
      // Show banner after brief delay
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('repo_ai_cookie_consent', JSON.stringify({ essential: true, analytics: true, date: new Date().toISOString() }));
    setIsOpen(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('repo_ai_cookie_consent', JSON.stringify({ essential: true, analytics: false, date: new Date().toISOString() }));
    setIsOpen(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('repo_ai_cookie_consent', JSON.stringify({ essential: true, analytics: analyticsEnabled, date: new Date().toISOString() }));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      id="cookie-banner"
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-5 left-5 z-50 max-w-sm p-4 rounded-xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 shadow-lg text-left print:hidden animate-fadeIn"
    >
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
          <Cookie className="w-4 h-4" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Privacy & Storage</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </h4>
            <button
              onClick={handleAcceptEssential}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            RepoAI stores session history and keys locally in your browser. Zero tracking.
          </p>

          {showPreferences && (
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Essential Storage</span>
                <span className="text-[10px] font-mono text-emerald-500">Required</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Anonymous Latency Check</span>
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-0.5">
            {showPreferences ? (
              <button
                onClick={handleSaveCustom}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleAcceptAll}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors"
              >
                Accept All
              </button>
            )}

            <button
              onClick={handleAcceptEssential}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Essential Only
            </button>

            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-auto underline"
            >
              {showPreferences ? 'Hide' : 'Options'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
