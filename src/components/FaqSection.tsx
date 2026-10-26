import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: 'What is the 1-Word GitHub URL Swap Formula?',
    answer:
      'Simply replace "github" in any repository URL with one of 7 keywords: gitdiagram (interactive architecture flowcharts), gitingest (single-file LLM prompt digests), gitreverse (reverse-engineered data models), explaingithub (AI codebase walkthroughs), uithub (distraction-free web file browser), github1s (full in-browser VS Code editor in WebAssembly), or deepwiki (executive architecture wiki). Formula: https://[keyword].com/[username]/[repo name].',
    category: 'Ecosystem',
  },
  {
    question: 'How are setup and test commands extracted without mock data?',
    answer:
      'RepoAI inspects the ground-truth repository manifests (e.g. package.json, requirements.txt, pyproject.toml, Cargo.toml, Go modules, Makefile) and actual CI pipeline definitions (.github/workflows/*.yml) to harvest exact, verified commands rather than hallucinating generic instructions.',
    category: 'Verification',
  },
  {
    question: 'How does RepoAI link beginner issues to specific files to edit?',
    answer:
      'Our engine fetches active issues tagged with "good first issue" or "help wanted" via the GitHub API, correlates issue descriptions with the project\'s recursive git directory tree, and recommends the precise source files and an actionable 3-step action plan to get started.',
    category: 'Beginner Tasks',
  },
  {
    question: 'Can I export the full onboarding guide to Markdown or Print?',
    answer:
      'Yes! You can click "Export ONBOARDING.md" to download a clean, publication-ready markdown file formatted for adding straight into your repository as ONBOARDING.md, or use your browser\'s Print function (Ctrl+P / Cmd+P) for a print-optimized runbook.',
    category: 'Export',
  },
  {
    question: 'Is my data secure, and are private repositories supported?',
    answer:
      'RepoAI runs completely client-side in your browser. All analysis, state, and tokens are stored in your browser\'s localStorage. To analyze private repositories or increase your GitHub API rate limit from 60 to 5,000 requests/hr, add your personal GitHub token in Settings.',
    category: 'Security',
  },
];

export const FaqSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className={`max-w-3xl mx-auto py-8 text-left space-y-6 ${className}`}>
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key details on the zero-mock onboarding and Gemma 4 MoE engine.
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          5 questions
        </span>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-3.5">
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 shrink-0">
                    {item.category}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {item.question}
                  </span>
                </div>
                <div className="p-1 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
                  {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>

              {isOpen && (
                <div className="pt-2.5 pb-1 pl-12 text-xs text-slate-600 dark:text-slate-400 leading-relaxed animate-fadeIn">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
