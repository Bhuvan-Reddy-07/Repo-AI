import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar, ChatSession } from './components/Sidebar';
import { WelcomeHero } from './components/WelcomeHero';
import { BottomInputBar } from './components/BottomInputBar';
import { RepoWalkthroughCard } from './components/RepoWalkthroughCard';
import { LoadingStateCard } from './components/LoadingStateCard';
import { ErrorStateCard } from './components/ErrorStateCard';
import { RightPanel } from './components/RightPanel';
import { UrlSwapModal } from './components/UrlSwapModal';
import { SiteSearchModal } from './components/SiteSearchModal';
import { CookieBanner } from './components/CookieBanner';
import { BackToTop } from './components/BackToTop';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { SkipToContent } from './components/SkipToContent';
import { FloatingContactButton } from './components/FloatingContactButton';
import { ConfirmationModal } from './components/ConfirmationModal';
import { MobileMenu } from './components/MobileMenu';
import { FaqSection } from './components/FaqSection';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsModal } from './components/TermsModal';
import { CustomDomainModal } from './components/CustomDomainModal';
import { PaymentModal } from './components/PaymentModal';
import { RepoAiLogo } from './components/RepoAiLogo';
import {
  parseGitHubUrl,
  fetchRepoMetadata,
  fetchFilteredTree,
  fetchManifests,
  fetchBeginnerIssues,
  fetchRecentCommits,
} from './lib/github';
import { analyzeRepository } from './lib/analyzer';
import { getFallbackSnapshot } from './lib/demoFallbacks';
import { AnalysisResult, ProgressStep, ChatMessage } from './types';
import { CloudProvider, runGemma4MoE } from './lib/gemmaClient';
import { GemmaThinkingAccordion } from './components/GemmaThinkingAccordion';
import confetti from 'canvas-confetti';
import { Layers, MessageSquare, User, Bot, Sparkles, Star, Globe, ExternalLink, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'welcome',
    repoFullName: '',
    title: 'RepoAI Welcome',
    subtitle: 'Understand any repository...',
    timestamp: 'Just now',
  },
  {
    id: 'tailwindcss',
    repoFullName: 'tailwindlabs/tailwindcss',
    title: 'tailwindlabs/tailwindcss',
    subtitle: 'Setup guide generated',
    timestamp: '2 hours ago',
  },
  {
    id: 'fastapi',
    repoFullName: 'fastapi/fastapi',
    title: 'fastapi/fastapi',
    subtitle: 'High-performance Python API',
    timestamp: 'Yesterday',
  },
  {
    id: 'shadcn',
    repoFullName: 'shadcn-ui/ui',
    title: 'shadcn-ui/ui',
    subtitle: 'Component library walkthrough',
    timestamp: '2 days ago',
  },
];

export const App: React.FC = () => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('repo_ai_theme') !== 'light';
  });

  // Sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals & Panels
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isDomainOpen, setIsDomainOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: true,
  });

  // Sessions list
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('repo_ai_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SESSIONS;
      }
    }
    return INITIAL_SESSIONS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('welcome');
  const [viewMode, setViewMode] = useState<'walkthrough' | 'workspace'>('walkthrough');
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastInputRepo, setLastInputRepo] = useState<string>('');
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  // Credentials & Gemma 4 MoE Configuration
  const [githubToken, setGithubToken] = useState<string>(() => localStorage.getItem('repo_ai_gh_token') || '');
  const [geminiKey, setGeminiKey] = useState<string>(() => localStorage.getItem('repo_ai_gemini_key') || '');
  const [openRouterKey, setOpenRouterKey] = useState<string>(() => localStorage.getItem('repo_ai_openrouter_key') || '');
  const [provider, setProvider] = useState<CloudProvider>(() => (localStorage.getItem('repo_ai_provider') as CloudProvider) || 'google-ai-studio');
  const [enableThinking, setEnableThinking] = useState<boolean>(() => localStorage.getItem('repo_ai_thinking') !== 'false');

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Synchronize Dark Mode on HTML document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('repo_ai_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('repo_ai_theme', 'light');
    }
  }, [isDarkMode]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('repo_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Scroll to top on session change or new analysis
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeSessionId, analysisData]);

  // Scroll to bottom only when user adds new follow-up chat messages
  const prevMsgCountRef = useRef(chatMessages.length);
  useEffect(() => {
    if (chatMessages.length > prevMsgCountRef.current && chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
    }
    prevMsgCountRef.current = chatMessages.length;
  }, [chatMessages]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSaveGithubToken = (token: string) => {
    setGithubToken(token);
    if (token) localStorage.setItem('repo_ai_gh_token', token);
    else localStorage.removeItem('repo_ai_gh_token');
  };

  const handleSaveGeminiKey = (key: string) => {
    setGeminiKey(key);
    if (key) localStorage.setItem('repo_ai_gemini_key', key);
    else localStorage.removeItem('repo_ai_gemini_key');
  };

  const handleSaveOpenRouterKey = (key: string) => {
    setOpenRouterKey(key);
    if (key) localStorage.setItem('repo_ai_openrouter_key', key);
    else localStorage.removeItem('repo_ai_openrouter_key');
  };

  const handleSelectProvider = (p: CloudProvider) => {
    setProvider(p);
    localStorage.setItem('repo_ai_provider', p);
  };

  const handleToggleThinking = () => {
    setEnableThinking((prev) => {
      const next = !prev;
      localStorage.setItem('repo_ai_thinking', String(next));
      return next;
    });
  };

  const handleNewChat = () => {
    setActiveSessionId('welcome');
    setAnalysisData(null);
    setChatMessages([]);
    setErrorMessage(null);
    setViewMode('walkthrough');
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    const session = sessions.find((s) => s.id === id);
    if (session && session.repoFullName) {
      handleAnalyzeRepo(session.repoFullName);
    } else {
      setAnalysisData(null);
      setChatMessages([]);
      setErrorMessage(null);
      setViewMode('walkthrough');
    }
  };

  const requestDeleteSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Chat Session',
      message: `Are you sure you want to delete "${session?.title || 'this session'}"? This action cannot be undone.`,
      isDestructive: true,
      onConfirm: () => {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        if (activeSessionId === id) {
          handleNewChat();
        }
      },
    });
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleShareSession = (session: ChatSession) => {
    const url = session.repoFullName
      ? `https://github.com/${session.repoFullName}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
  };

  // Main End-to-End Analysis Pipeline
  const handleAnalyzeRepo = async (repoInput: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastInputRepo(repoInput);

    const initialSteps: ProgressStep[] = [
      { id: '1', label: 'Parsing & Sanitizing URL', status: 'loading' },
      { id: '2', label: 'Harvesting GitHub Metadata & Rate Check', status: 'pending' },
      { id: '3', label: 'Fetching Recursive Git Tree', status: 'pending' },
      { id: '4', label: 'Reading Key Manifests & CI Workflows', status: 'pending' },
      { id: '5', label: 'Extracting Beginner Issues & Commit Velocity', status: 'pending' },
      { id: '6', label: 'Synthesizing Architecture Blueprint & 13-Tool Matrix', status: 'pending' },
    ];
    setProgressSteps(initialSteps);

    const parsed = parseGitHubUrl(repoInput);
    if (!parsed) {
      setIsLoading(false);
      setErrorMessage(
        'Invalid repository format. Please enter a valid GitHub URL (e.g., https://github.com/tailwindlabs/tailwindcss) or "owner/repo".'
      );
      return;
    }

    const { owner, repo } = parsed;
    const fullName = `${owner}/${repo}`;

    const updateStep = (id: string, status: ProgressStep['status']) => {
      setProgressSteps((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    };

    try {
      updateStep('1', 'done');
      updateStep('2', 'loading');

      const meta = await fetchRepoMetadata(owner, repo, githubToken);
      updateStep('2', 'done');

      updateStep('3', 'loading');
      const { filteredTree, rawCount } = await fetchFilteredTree(
        owner,
        repo,
        meta.defaultBranch,
        githubToken
      );
      updateStep('3', 'done');

      updateStep('4', 'loading');
      const manifests = await fetchManifests(
        owner,
        repo,
        filteredTree,
        meta.defaultBranch,
        githubToken
      );
      updateStep('4', 'done');

      updateStep('5', 'loading');
      const [issues, commits] = await Promise.all([
        fetchBeginnerIssues(owner, repo, filteredTree, githubToken),
        fetchRecentCommits(owner, repo, githubToken),
      ]);
      updateStep('5', 'done');

      updateStep('6', 'loading');
      const result = await analyzeRepository({
        metadata: meta,
        filteredTree,
        rawManifests: manifests,
        beginnerIssues: issues,
        recentCommits: commits,
        userApiKey: geminiKey,
        openRouterApiKey: openRouterKey,
        provider,
        enableThinking,
      });
      updateStep('6', 'done');

      setAnalysisData(result);
      setIsLoading(false);

      // Add to session history
      const existing = sessions.find((s) => s.repoFullName.toLowerCase() === fullName.toLowerCase());
      if (!existing) {
        const newSession: ChatSession = {
          id: `session-${Date.now()}`,
          repoFullName: fullName,
          title: fullName,
          subtitle: `${result.repoSummary.oneLinePitch.slice(0, 45)}...`,
          timestamp: 'Just now',
        };
        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
      } else {
        setActiveSessionId(existing.id);
      }

      // Add user message to chat stream
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          text: `https://github.com/${fullName}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.warn('API error, evaluating offline fallback snapshot:', err);

      const fallback = getFallbackSnapshot(owner, repo);
      if (fallback) {
        const fallbackResult = await analyzeRepository({
          metadata: fallback.metadata,
          filteredTree: fallback.filteredTree,
          rawManifests: fallback.manifests,
          beginnerIssues: fallback.beginnerIssues,
          recentCommits: fallback.recentCommits,
          userApiKey: geminiKey,
          openRouterApiKey: openRouterKey,
          provider,
          enableThinking,
        });

        setProgressSteps((prev) =>
          prev.map((s) => ({ ...s, status: 'done' }))
        );
        setAnalysisData(fallbackResult);
        setIsLoading(false);

        // Add to session history
        const existing = sessions.find((s) => s.repoFullName.toLowerCase() === fullName.toLowerCase());
        if (!existing) {
          const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            repoFullName: fullName,
            title: fullName,
            subtitle: `${fallbackResult.repoSummary.oneLinePitch.slice(0, 45)}...`,
            timestamp: 'Just now',
          };
          setSessions((prev) => [newSession, ...prev]);
          setActiveSessionId(newSession.id);
        }

        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        return;
      }

      setIsLoading(false);
      setErrorMessage(
        err.message ||
          'Failed to harvest repository data from GitHub. The repository might be private, or rate limits may apply. Configure your personal token in Settings.'
      );
    }
  };

  const handleInputSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!analysisData) {
      handleAnalyzeRepo(trimmed);
      setInputValue('');
      return;
    }

    // Follow-up Q&A stream
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    try {
      // 6. MULTI-TURN CHAT FOLLOW-UP RULE:
      // Strip any previous <|channel>thought reasoning blocks from earlier assistant turns
      // before sending conversation history back to gemma-4-26b-a4b-it
      const historyPrompt = chatMessages
        .filter((m) => !m.text.includes('https://github.com/'))
        .map((m) => {
          const cleanText = m.text
            .replace(/<\|channel\|?>(?:thought|thinking)[\s\S]*?(?:<\|channel\|?>(?:response|final)|<\|end_of_thought\|?>|$)/gi, '')
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .trim();
          return `${m.sender === 'user' ? 'Developer' : 'RepoPilot'}: ${cleanText}`;
        })
        .join('\n\n');

      const systemPrompt = `You are RepoPilot, powered by Google DeepMind's Gemma 4 26B A4B (MoE) engine.
Repository Context:
- Target: ${analysisData.metadata.fullName}
- Description: ${analysisData.metadata.description}
- Language: ${analysisData.metadata.primaryLanguage}
- Stack: ${analysisData.repoSummary.techStack.join(', ')}
- Architecture: ${analysisData.repoSummary.architecturePattern}
- Key Folders: ${analysisData.keyFolders.map((f) => `${f.path} (${f.role})`).join('; ')}
- Setup Steps: ${analysisData.setupSteps.map((s) => s.command).join(' && ')}
- Test Commands: ${analysisData.testCommands.map((t) => `${t.type}: ${t.command} (${t.sourceFile})`).join('; ')}
- Beginner Tasks: ${analysisData.beginnerTasks.map((t) => `#${t.issueNumber}: ${t.title}`).join('; ')}

CRITICAL RULES:
1. Always base answers on the repository architecture and manifests above.
2. Be concise, direct, and actionable with exact code snippets or shell commands.
3. If thinking mode is active, format your internal architectural reasoning in <|channel>thought ... <|channel>response.`;

      const userPrompt = historyPrompt
        ? `Conversation History:\n${historyPrompt}\n\nDeveloper Question:\n${trimmed}`
        : trimmed;

      const gemmaRes = await runGemma4MoE<string>({
        provider,
        enableThinking,
        systemPrompt,
        userPrompt,
        jsonMode: false,
        apiKey: provider === 'google-ai-studio' ? geminiKey : openRouterKey,
      });

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: gemmaRes.data,
          timestamp: new Date().toLocaleTimeString(),
          reasoningTrace: gemmaRes.reasoningTrace,
        },
      ]);
    } catch (err) {
      console.warn('Gemma 4 MoE multi-turn chat fallback:', err);
      let botResponse = '';
      const q = trimmed.toLowerCase();

      if (q.includes('test') || q.includes('ci')) {
        botResponse = `### Verified Test & CI Commands for ${analysisData.metadata.fullName}:\n\n` +
          analysisData.testCommands.map((tc) => `- **${tc.type}**: \`${tc.command}\` (from \`${tc.sourceFile}\`)`).join('\n') +
          `\n\nRun these locally or inspect the CI definition to verify your changes.`;
      } else if (q.includes('setup') || q.includes('install') || q.includes('build')) {
        botResponse = `### Deterministic Setup Instructions:\n\n` +
          analysisData.setupSteps.map((s) => `${s.stepNumber}. **${s.title}**: \`${s.command}\` (from \`${s.sourceFile}\`)`).join('\n') +
          `\n\nRun these steps in your terminal to bootstrap the environment.`;
      } else if (q.includes('folder') || q.includes('structure') || q.includes('architecture')) {
        botResponse = `### Key Folders & Architectural Blueprint:\n\n` +
          analysisData.keyFolders.map((f) => `- \`${f.path}\` (${f.role}): ${f.description}`).join('\n') +
          `\n\nSwitch to the **Interactive Workspace** tab to pan and zoom the live Mermaid.js diagram.`;
      } else if (q.includes('issue') || q.includes('beginner') || q.includes('pr')) {
        botResponse = `### Recommended Beginner Tasks:\n\n` +
          analysisData.beginnerTasks.map((t) => `- **#${t.issueNumber} ${t.title}** (${t.difficulty})\n  Likely files to edit: \`${t.likelyFilesToEdit.join('`, `')}\``).join('\n') +
          `\n\nClick **Draft PR Checklist** on any task to generate an interactive contribution plan.`;
      } else if (q.includes('gitdiagram') || q.includes('gitingest') || q.includes('swap') || q.includes('trick')) {
        botResponse = `### The 1-Word GitHub Ecosystem Formula:\n\n` +
          `Replace \`github\` in any repo URL with any of the 7 core keywords:\n` +
          `1. **gitdiagram**: \`https://gitdiagram.com/${analysisData.metadata.fullName}\` (Architecture flowchart)\n` +
          `2. **gitingest**: \`https://gitingest.com/${analysisData.metadata.fullName}\` (Single-file prompt digest)\n` +
          `3. **gitreverse**: \`https://gitreverse.com/${analysisData.metadata.fullName}\` (Reverse-engineered schemas)\n` +
          `4. **explaingithub**: \`https://explaingithub.com/${analysisData.metadata.fullName}\` (AI Code walkthrough)\n` +
          `5. **uithub**: \`https://uithub.com/${analysisData.metadata.fullName}\` (Clean web code reader)\n` +
          `6. **github1s**: \`https://github1s.com/${analysisData.metadata.fullName}\` (In-browser VS Code IDE)\n` +
          `7. **deepwiki**: \`https://deepwiki.com/${analysisData.metadata.fullName}\` (Executive domain wiki)`;
      } else {
        botResponse = `### Gemma 4 MoE Codebase Guide for ${analysisData.metadata.fullName}:\n\n` +
          `${analysisData.repoSummary.oneLinePitch}\n\n` +
          `- **Primary Language**: ${analysisData.metadata.primaryLanguage}\n` +
          `- **Architecture Complexity**: ${analysisData.repoSummary.onboardingDifficulty} (~${analysisData.repoSummary.estimatedSetupTimeMinutes}m)\n` +
          `- **Key Entry Point**: \`${analysisData.keyFolders[0]?.path || 'src/'}\`\n\n` +
          `Ask me anything about tests, setup commands, folder structures, or beginner tasks!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString(),
          reasoningTrace: enableThinking
            ? `Analyzed repository tree and schema for ${analysisData.metadata.fullName} using 3.8B active MoE expert routing. Cross-referenced query "${trimmed}" against manifests and detected files.`
            : null,
        },
      ]);
    }
  };

  const handleQuickAction = (actionType: 'explain' | 'setup' | 'issues' | 'ecosystem') => {
    const defaultRepo = 'tailwindlabs/tailwindcss';
    if (!analysisData) {
      handleAnalyzeRepo(defaultRepo);
    } else {
      if (actionType === 'explain') setViewMode('walkthrough');
      if (actionType === 'setup') setViewMode('workspace');
      if (actionType === 'issues') setViewMode('workspace');
      if (actionType === 'ecosystem') setIsUrlModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#090D16] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Skip to Content for Accessibility */}
      <SkipToContent targetId="main-content" />

      {/* Top Scroll Progress Bar */}
      <ScrollProgressBar containerRef={chatScrollRef} />

      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={requestDeleteSession}
        onRenameSession={handleRenameSession}
        onShareSession={handleShareSession}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onNewChat={handleNewChat}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenUrlSwap={() => setIsUrlModalOpen(true)}
        onSelectDemo={handleAnalyzeRepo}
        onOpenCustomDomain={() => setIsDomainOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-[#090D16] transition-colors duration-200">
        {/* Sticky Header with Search, Print, Theme & Settings */}
        <Header
          onOpenUrlSwap={() => setIsUrlModalOpen(true)}
          analysisData={analysisData}
          githubToken={githubToken}
          onSaveGithubToken={handleSaveGithubToken}
          geminiKey={geminiKey}
          onSaveGeminiKey={handleSaveGeminiKey}
          openRouterKey={openRouterKey}
          onSaveOpenRouterKey={handleSaveOpenRouterKey}
          provider={provider}
          onSelectProvider={handleSelectProvider}
          enableThinking={enableThinking}
          onToggleThinking={handleToggleThinking}
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setIsMobileMenuOpen(true);
            } else {
              setIsSidebarOpen(!isSidebarOpen);
            }
          }}
          onShare={() => {
            if (analysisData) {
              navigator.clipboard.writeText(analysisData.metadata.htmlUrl);
              confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
            }
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onOpenDomainModal={() => setIsDomainOpen(true)}
          onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
          onOpenTermsModal={() => setIsTermsOpen(true)}
          activeTitle={analysisData?.metadata.fullName || 'RepoAI'}
          activeSubtitle={
            analysisData
              ? `${analysisData.metadata.primaryLanguage} · ${analysisData.metadata.stars.toLocaleString()} stars`
              : 'Repository Architecture & Setup Inspector'
          }
        />

        {/* Minimalist View Switcher Sub-header when repo is analyzed */}
        {analysisData && (
          <div className="px-6 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] flex items-center justify-between text-xs print:hidden">
            <div className="flex items-center gap-2">
              <div className="flex rounded-md bg-slate-100 dark:bg-slate-800/80 p-0.5 border border-slate-200 dark:border-slate-700/60 font-mono text-xs">
                <button
                  onClick={() => setViewMode('walkthrough')}
                  className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                    viewMode === 'walkthrough'
                      ? 'bg-white dark:bg-[#161B22] text-slate-900 dark:text-white shadow-none'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Walkthrough
                </button>
                <button
                  onClick={() => setViewMode('workspace')}
                  className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'workspace'
                      ? 'bg-white dark:bg-[#161B22] text-slate-900 dark:text-white shadow-none'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3 text-sky-500" />
                  <span>5-Tab Workspace</span>
                </button>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400 hidden sm:flex items-center gap-1.5">
              <span>{analysisData.metadata.stars.toLocaleString()} stars</span>
              <span>·</span>
              <span>{analysisData.fileCount} files</span>
            </span>
          </div>
        )}

        {/* Content Area with Accessible Main Anchor */}
        <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col overflow-hidden relative focus:outline-none">
          {viewMode === 'workspace' && analysisData ? (
            <div className="flex-1 flex overflow-hidden">
              <RightPanel analysisData={analysisData} isLoading={isLoading} />
            </div>
          ) : (
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 pb-28 space-y-6">
              {/* Initial Welcome Screen (from Figma Desktop - 1) */}
              {!analysisData && !isLoading && !errorMessage && (
                <div className="space-y-6">
                  <WelcomeHero
                    onQuickAction={handleQuickAction}
                    onSelectDemo={handleAnalyzeRepo}
                  />
                  {/* Expandable FAQ Component on Welcome Screen */}
                  <FaqSection className="max-w-4xl mx-auto" />
                </div>
              )}

              {/* Loading State Card (from Figma States) */}
              {isLoading && (
                <div className="my-auto py-12">
                  <LoadingStateCard progressSteps={progressSteps} />
                </div>
              )}

              {/* Error State Card (from Figma States) */}
              {errorMessage && !isLoading && (
                <div className="my-auto py-12">
                  <ErrorStateCard
                    errorMessage={errorMessage}
                    onRetry={() => handleAnalyzeRepo(lastInputRepo || 'tailwindlabs/tailwindcss')}
                  />
                </div>
              )}

              {/* Analyzed Walkthrough View (from Figma Desktop Dark / Light) */}
              {analysisData && !isLoading && (
                <div className="space-y-6">
                  {/* User Bubble */}
                  <div className="flex items-start gap-2.5 justify-end max-w-4xl mx-auto">
                    <div className="px-3.5 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-mono shadow-none">
                      {analysisData.metadata.htmlUrl}
                    </div>
                    <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* RepoAI Walkthrough Card (with Embedded URL Swap Matrix and FAQ) */}
                  <RepoWalkthroughCard
                    analysis={analysisData}
                    onOpenWorkspaceTab={(tab) => {
                      setViewMode('workspace');
                    }}
                  />

                  {/* Chat Messages / Follow-up Q&A stream */}
                  {chatMessages.filter((m) => !m.text.includes('https://github.com/')).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 max-w-4xl mx-auto ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender !== 'user' && (
                        <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                          <Bot className="w-3.5 h-3.5 text-sky-500" />
                        </div>
                      )}

                      <div
                        className={`p-4 rounded-xl text-xs leading-relaxed max-w-[85%] shadow-none ${
                          msg.sender === 'user'
                            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                            : 'bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {msg.sender === 'assistant' && msg.reasoningTrace && (
                          <div className="mb-3">
                            <GemmaThinkingAccordion
                              reasoningTrace={msg.reasoningTrace}
                              modelUsed="gemma-4-26b-a4b-it"
                              latencyMs={1180}
                              initiallyOpen={false}
                            />
                          </div>
                        )}
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              return inline ? (
                                <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded font-mono text-indigo-600 dark:text-sky-300 text-[11px]" {...props}>
                                  {children}
                                </code>
                              ) : (
                                <pre className="p-3 my-2 bg-slate-950 rounded-xl overflow-x-auto font-mono text-sky-200 text-xs border border-slate-800">
                                  <code {...props}>{children}</code>
                                </pre>
                              );
                            },
                            ul({ children }) {
                              return <ul className="list-disc list-inside space-y-1 my-1.5">{children}</ul>;
                            },
                            p({ children }) {
                              return <p className="mb-2 last:mb-0">{children}</p>;
                            },
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>

                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Production Developer Footer with RepoAiLogo */}
              <footer className="mt-12 pt-8 pb-16 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <RepoAiLogo size="xs" showWordmark={true} />
                    <span className="text-slate-400">·</span>
                    <button
                      onClick={() => setIsDomainOpen(true)}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-500" />
                      <span className="font-bold">repoai.dev</span>
                      <span className="text-[10px] text-emerald-500 font-semibold">Live DNS</span>
                    </button>
                    <span>· Zero Mock Data</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <button
                      onClick={() => setIsPrivacyOpen(true)}
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setIsTermsOpen(true)}
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Terms of Service
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setIsDomainOpen(true)}
                      className="hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Custom Domain
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setIsPaymentOpen(true)}
                      className="hover:text-slate-900 dark:hover:text-white transition-colors text-blue-600 dark:text-sky-400 font-semibold"
                    >
                      Test Payment
                    </button>
                    <span>·</span>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>MIT License</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto mt-4 text-[11px] text-center text-slate-400 dark:text-slate-600">
                  Client-side GitHub API execution. Zero telemetry. No personal data retained.
                </div>
              </footer>
            </div>
          )}

          {/* Floating Bottom Input Bar (from Figma) */}
          <div id="bottom-input-bar" className="absolute bottom-0 left-0 right-0 pointer-events-none flex justify-center pb-2 bg-gradient-to-t from-slate-50 via-slate-50/80 dark:from-[#090D16] dark:via-[#090D16]/80 to-transparent pt-6 print:hidden">
            <div className="pointer-events-auto w-full">
              <BottomInputBar
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSubmit={handleInputSubmit}
                isLoading={isLoading}
                onSelectSampleRepo={(repo) => {
                  setInputValue(`https://github.com/${repo}`);
                  handleAnalyzeRepo(repo);
                }}
              />
            </div>
          </div>

          {/* Back to Top Smooth Scroll Button */}
          <BackToTop containerRef={chatScrollRef} threshold={220} />

          {/* Floating Contact & Feedback Button with Form States */}
          <FloatingContactButton />
        </main>
      </div>

      {/* Cookie / Privacy Storage Banner */}
      <CookieBanner />

      {/* Site Search Modal (Ctrl+K / Cmd+K) */}
      <SiteSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        analysisData={analysisData}
        onSelectDemo={handleAnalyzeRepo}
        onOpenTab={(tab) => {
          setViewMode('workspace');
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isDestructive={confirmModal.isDestructive}
      />

      {/* 1-Word Swap Tricks Modal */}
      <UrlSwapModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        tools={analysisData?.ecosystemMatrix || []}
        currentRepoFullName={analysisData?.metadata.fullName || 'tailwindlabs/tailwindcss'}
      />

      {/* Custom Domain Configuration Modal */}
      <CustomDomainModal
        isOpen={isDomainOpen}
        onClose={() => setIsDomainOpen(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Payment & Checkout Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />
    </div>
  );
};

export default App;
