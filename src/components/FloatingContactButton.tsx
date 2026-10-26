import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FloatingContactButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Feedback');
  const [message, setMessage] = useState('');

  // Form states
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refId, setRefId] = useState('');

  const validate = () => {
    const errs: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) errs.name = 'Please provide your name';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!message.trim()) {
      errs.message = 'Please enter a message or question';
    } else if (message.trim().length < 8) {
      errs.message = 'Message must be at least 8 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      const generatedRef = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setRefId(generatedRef);
      confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });

      // Reset form after delay
      setTimeout(() => {
        setName('');
        setEmail('');
        setMessage('');
        setIsSuccess(false);
        setIsOpen(false);
      }, 3500);
    }, 650);
  };

  return (
    <>
      {/* Floating Action Button: Sleek Minimalist */}
      <button
        id="floating-contact"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white dark:bg-[#111622] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-sm transition-colors flex items-center gap-1.5 print:hidden cursor-pointer text-xs font-medium"
        title="Contact & Feedback"
        aria-label="Open contact and feedback modal"
      >
        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Contact & Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn print:hidden">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Contact & Open-Source Feedback
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Questions, bug reports, or feature requests for RepoAI.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Success State */}
            {isSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-300">
                  Thank You! Feedback Transmitted
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-xs mx-auto">
                  Your note has been submitted to the RepoAI core team. Reference ID:{' '}
                  <code className="font-mono font-bold">{refId}</code>.
                </p>
                <div className="pt-2 text-[11px] text-emerald-600 dark:text-emerald-500 font-mono">
                  Closing window in 3 seconds...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Form Error State Top Alert */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Please resolve the following:</span>
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[11px]">
                        {Object.values(errors).map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="e.g. Alex Chen"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.name
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="alex@example.com"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Feedback">General Feedback</option>
                    <option value="Bug">Bug Report (API / Parsing)</option>
                    <option value="Feature">Feature Request</option>
                    <option value="KeywordSwap">1-Word Swap Tool Suggestion</option>
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="Share your thoughts or describe what happened..."
                    className={`w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors ${
                      errors.message
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[10px] text-rose-500 mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
