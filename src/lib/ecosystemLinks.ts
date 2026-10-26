import { EcosystemTool, RepoMetadata, TreeItem, CommitItem } from '../types';

interface GenerationContext {
  metadata: RepoMetadata;
  tree: TreeItem[];
  filteredCount: number;
  estimatedTokens: number;
  asciiTree: string;
  entryFiles: string[];
  manifests: Record<string, string>;
  deepWikiSummary: string[];
  pythonMingrammerSnippet: string;
  mermaidDiagram: string;
  commits: CommitItem[];
}

/**
 * Builds the Ecosystem Matrix prioritizing the 7 Core URL Keyword Swap Tools:
 * https://[keyword].com/[username]/[repo name]
 * 1. gitdiagram
 * 2. gitingest
 * 3. gitreverse
 * 4. explaingithub
 * 5. uithub
 * 6. github1s
 * 7. deepwiki
 */
export function buildEcosystemMatrix(ctx: GenerationContext): EcosystemTool[] {
  const { owner, repo, defaultBranch } = ctx.metadata;
  const repoFullName = `${owner}/${repo}`;
  const repoUrl = `https://github.com/${repoFullName}`;

  // 1. gitdiagram
  const tool1: EcosystemTool = {
    id: 'gitdiagram',
    name: 'GitDiagram',
    category: 'Architecture & Wiki',
    shortcutRule: 'Swap github.com ➔ gitdiagram.com',
    urlSwapExplanation: 'Replace "github.com" with "gitdiagram.com" in any repo URL to render an instant visual diagram of the codebase.',
    linkUrl: `https://gitdiagram.com/${repoFullName}`,
    previewTitle: 'Interactive Architecture Flowchart (Mermaid.js)',
    previewType: 'mermaid',
    previewContent: ctx.mermaidDiagram || `graph TD\n  Client[App / Client] --> Core[Core Engine: ${repo}]\n  Core --> Lib[Internal Modules]\n  Core --> API[External Services]`,
    cliCommand: `open https://gitdiagram.com/${repoFullName}`,
    badge: 'Core Keyword',
  };

  // 2. gitingest
  const tool2: EcosystemTool = {
    id: 'gitingest',
    name: 'Gitingest',
    category: 'LLM Context & Ingestion',
    shortcutRule: 'Swap github.com ➔ gitingest.com',
    urlSwapExplanation: 'Replace "github.com" with "gitingest.com" to generate a single-file text bundle for feeding the repo into LLM prompts.',
    linkUrl: `https://gitingest.com/${repoFullName}`,
    previewTitle: `Ingest Digest (${ctx.filteredCount} files · ~${ctx.estimatedTokens.toLocaleString()} tokens)`,
    previewType: 'ascii-tree',
    previewContent: ctx.asciiTree,
    cliCommand: `npx gitingest ${repoFullName}`,
    badge: 'Core Keyword',
  };

  // 3. gitreverse
  const reverseAnalysis = `[Reverse-Engineered Architecture Model]
Repository: ${repoFullName}
Primary Language: ${ctx.metadata.primaryLanguage}
Entry Points: ${ctx.entryFiles.slice(0, 3).join(', ') || 'src/index.ts'}

Inferred Subsystem Interfaces:
├── Core Engine: State machine & main execution routines
├── Configuration: Environment manifests & build pipeline
└── Data Flow: Ingests user input ➔ processes logic ➔ emits output`;

  const tool3: EcosystemTool = {
    id: 'gitreverse',
    name: 'GitReverse',
    category: 'Architecture & Wiki',
    shortcutRule: 'Swap github.com ➔ gitreverse.com',
    urlSwapExplanation: 'Replace "github.com" with "gitreverse.com" to reverse-engineer architecture models, dependency hierarchies, and data contracts.',
    linkUrl: `https://gitreverse.com/${repoFullName}`,
    previewTitle: 'Reverse-Engineered Data Contracts & Subsystem Models',
    previewType: 'text',
    previewContent: reverseAnalysis,
    badge: 'Core Keyword',
  };

  // 4. explaingithub
  const explanationPreview = `Technical Architecture Analysis for ${repoFullName}:
1. What does it do?
   ${ctx.metadata.description || 'Provides a core reusable software engine for open-source developers.'}
   
2. Where to start reading?
   Begin with ${ctx.entryFiles[0] || 'the main entry file'} which initializes the primary runtime.
   
3. How are modules organized?
   Separated into modular subsystems under ${ctx.tree[0]?.path.split('/')[0] || 'src/'} for clean decoupling.`;

  const tool4: EcosystemTool = {
    id: 'explaingithub',
    name: 'ExplainGitHub',
    category: 'Architecture & Wiki',
    shortcutRule: 'Swap github.com ➔ explaingithub.com',
    urlSwapExplanation: 'Replace "github.com" with "explaingithub.com" to receive an interactive, conversational AI walkthrough of tricky files.',
    linkUrl: `https://explaingithub.com/${repoFullName}`,
    previewTitle: 'Conversational Codebase Explanation & File Walkthrough',
    previewType: 'text',
    previewContent: explanationPreview,
    badge: 'Core Keyword',
  };

  // 5. uithub
  const uithubPreview = `Uithub Instant Web Explorer:
Repository: ${repoFullName} (Branch: ${defaultBranch})
Total Files: ${ctx.filteredCount} files indexed

Quick File Access:
${ctx.entryFiles.slice(0, 4).map((f) => `• /${f}`).join('\n')}

Click 'Launch' to browse this repository in Uithub's zero-friction code viewer.`;

  const tool5: EcosystemTool = {
    id: 'uithub',
    name: 'Uithub',
    category: 'LLM Context & Ingestion',
    shortcutRule: 'Swap github.com ➔ uithub.com',
    urlSwapExplanation: 'Replace "github.com" with "uithub.com" for a clean, distraction-free web reader and instant single-file code viewer.',
    linkUrl: `https://uithub.com/${repoFullName}`,
    previewTitle: 'Instant Web Code Explorer & Clean File Viewer',
    previewType: 'text',
    previewContent: uithubPreview,
    badge: 'Core Keyword',
  };

  // 6. github1s
  const github1sPreview = `Web IDE Session:
Target: https://github1s.com/${repoFullName}

Capabilities:
• Full VS Code Editor running entirely in WebAssembly
• Instant file search (Ctrl/Cmd + P)
• Outline view & Symbol search (Ctrl/Cmd + Shift + O)
• Zero-clone code navigation with syntax highlighting`;

  const tool6: EcosystemTool = {
    id: 'github1s',
    name: 'GitHub1s',
    category: 'Git Activity & Learning',
    shortcutRule: 'Swap github.com ➔ github1s.com',
    urlSwapExplanation: 'Append "1s" after "github" (github1s.com) to instantly view and edit code in a full web-based VS Code IDE.',
    linkUrl: `https://github1s.com/${repoFullName}`,
    previewTitle: 'Instant In-Browser VS Code IDE Session',
    previewType: 'text',
    previewContent: github1sPreview,
    badge: 'Core Keyword',
  };

  // 7. deepwiki
  const defaultWiki = [
    `Core Domain: ${ctx.metadata.description || 'Open-source software component'} built with ${ctx.metadata.primaryLanguage}.`,
    `Data & Control Flow: Modular architecture centered around ${ctx.entryFiles[0] || 'core components'} with decoupled utility subsystems.`,
    `Design Pattern: Modern ${ctx.metadata.primaryLanguage} idioms utilizing event/functional pipelines and clear configuration boundaries.`,
  ];
  const tool7: EcosystemTool = {
    id: 'deepwiki',
    name: 'DeepWiki',
    category: 'Architecture & Wiki',
    shortcutRule: 'Swap github.com ➔ deepwiki.com',
    urlSwapExplanation: 'Replace "github.com" with "deepwiki.com" to read an AI-generated architectural wiki and high-level breakdown.',
    linkUrl: `https://deepwiki.com/${repoFullName}`,
    previewTitle: '3-Bullet Executive Architecture Summary',
    previewType: 'bullets',
    previewContent: JSON.stringify(ctx.deepWikiSummary.length > 0 ? ctx.deepWikiSummary : defaultWiki),
    badge: 'Core Keyword',
  };

  // 8. GitProbe
  const top3Entries = ctx.entryFiles.slice(0, 3);
  const probeContent = top3Entries.length > 0
    ? top3Entries.map((f, i) => `${i + 1}. [Entry] ${f}\n   Exports: Primary module bootstrap & public interfaces`).join('\n\n')
    : '1. src/index.ts (Main module entrypoint)\n2. src/core.ts (Core routines)\n3. config.ts (Configuration)';

  const tool8: EcosystemTool = {
    id: 'gitprobe',
    name: 'GitProbe',
    category: 'LLM Context & Ingestion',
    shortcutRule: 'Swap github.com ➔ gitprobe.dev',
    urlSwapExplanation: 'Replace "github.com" with "gitprobe.dev" to probe file entrypoints, call graphs, and exports without cloning.',
    linkUrl: `https://gitprobe.dev/${repoFullName}`,
    previewTitle: 'Top Entrypoint Files & Exported Signatures',
    previewType: 'code-files',
    previewContent: probeContent,
    badge: 'Entrypoints Probe',
  };

  // 9. Repomix
  const manifestSnippet = ctx.manifests['package.json'] || ctx.manifests['pyproject.toml'] || ctx.manifests['Cargo.toml'] || '';
  const first20Lines = manifestSnippet.split('\n').slice(0, 8).join('\n');
  const repomixXml = `<file_summary>
  <repository>${repoFullName}</repository>
  <default_branch>${defaultBranch}</default_branch>
  <filtered_files count="${ctx.filteredCount}" />
  <entry_manifest>
${first20Lines || '    // manifest details loaded'}
  </entry_manifest>
</file_summary>`;

  const tool9: EcosystemTool = {
    id: 'repomix',
    name: 'Repomix',
    category: 'LLM Context & Ingestion',
    shortcutRule: 'Pass {owner}/{repo} to Repomix Web / CLI',
    urlSwapExplanation: 'Use repomix.com or run the CLI to pack this entire repository into a standardized XML format for AI models.',
    linkUrl: `https://repomix.com/?repo=${repoFullName}`,
    previewTitle: 'Standardized XML <file_summary> Digest',
    previewType: 'xml',
    previewContent: repomixXml,
    cliCommand: `npx repomix --remote ${repoFullName}`,
    badge: 'XML Code Packager',
  };

  // 10. git2txt
  const readmeSample = (ctx.manifests['README.md'] || 'README information').slice(0, 300);
  const git2txtPreview = `=== ${repoFullName} / README.md ===\n${readmeSample}...\n\n=== MANIFEST DIGEST ===\n${first20Lines || 'Project Manifest'}`;

  const tool10: EcosystemTool = {
    id: 'git2txt',
    name: 'git2txt',
    category: 'LLM Context & Ingestion',
    shortcutRule: 'Pass URL to git2txt.com / CLI',
    urlSwapExplanation: 'Prepend "git2txt.com/?url=" or run the CLI command to get a pure ASCII concatenation of code files.',
    linkUrl: `https://git2txt.com/?url=${encodeURIComponent(repoUrl)}`,
    previewTitle: 'Concatenated README + Config Digest',
    previewType: 'text',
    previewContent: git2txtPreview,
    cliCommand: `npx git2txt ${repoFullName}`,
    badge: 'Plain-Text Stream',
  };

  // 11. Gitmotion
  const commitList = ctx.commits.length > 0
    ? ctx.commits.map((c) => `• [${c.sha}] ${c.message} (${c.author})`).join('\n')
    : `• [HEAD] Recent release updates\n• [HEAD~1] CI test configuration fixes\n• [HEAD~2] Documentation updates`;

  const tool11: EcosystemTool = {
    id: 'gitmotion',
    name: 'Gitmotion',
    category: 'Git Activity & Learning',
    shortcutRule: 'Swap github.com ➔ gitmotion.com',
    urlSwapExplanation: 'Replace "github.com" with "gitmotion.com" to visualize contributor momentum, velocity charts, and commit rhythms.',
    linkUrl: `https://gitmotion.com/${repoFullName}`,
    previewTitle: 'Recent Commit Velocity & Contributor Momentum',
    previewType: 'text',
    previewContent: `Recent Commits Velocity:\n${commitList}\n\nActivity Status: Active development on branch '${defaultBranch}'`,
    badge: 'Commit Velocity',
  };

  // 12. Diagrams (as Code)
  const mingrammerCode = ctx.pythonMingrammerSnippet || `# Python Diagrams as Code for ${repo}
from diagrams import Diagram, Cluster
from diagrams.programming.language import ${ctx.metadata.primaryLanguage === 'Python' ? 'Python' : 'Nodejs'}
from diagrams.onprem.vcs import Github

with Diagram("${repo} Architecture", show=False):
    repo = Github("${repo}")
    with Cluster("Core Runtime"):
        engine = ${ctx.metadata.primaryLanguage === 'Python' ? 'Python' : 'Nodejs'}("Engine")
    repo >> engine`;

  const tool12: EcosystemTool = {
    id: 'diagrams-mingrammer',
    name: 'Diagrams (as Code)',
    category: 'Architecture & Wiki',
    shortcutRule: 'mingrammer/diagrams Cloud Architecture',
    urlSwapExplanation: 'Render Python-based declarative diagrams for cloud infrastructure and software topology.',
    linkUrl: 'https://diagrams.mingrammer.com/',
    previewTitle: 'Ready-to-Run Python `diagrams` Topology Script',
    previewType: 'python-code',
    previewContent: mingrammerCode,
    cliCommand: `python architecture.py`,
    badge: 'Python Diagrams-as-Code',
  };

  // 13. Learn Git Branching
  const gitBranchingCommands = `# Recommended Git Contribution Workflow for ${repoFullName}:
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/${repo}.git
cd ${repo}

# 2. Add upstream remote to stay synced
git remote add upstream ${repoUrl}.git
git fetch upstream

# 3. Create a feature branch for your issue
git checkout -b fix/issue-solve-onboarding upstream/${defaultBranch}

# 4. Keep your branch clean and linear
git pull --rebase upstream ${defaultBranch}`;

  const tool13: EcosystemTool = {
    id: 'learngitbranching',
    name: 'Learn Git Branching',
    category: 'Git Activity & Learning',
    shortcutRule: 'Interactive Git Sandbox',
    urlSwapExplanation: 'Master the exact branching commands needed for this repo in an interactive sandbox.',
    linkUrl: 'https://learngitbranching.js.org/',
    previewTitle: `Branching Runbook for ${repo} (${defaultBranch})`,
    previewType: 'git-commands',
    previewContent: gitBranchingCommands,
    badge: 'Git Sandbox Runbook',
  };

  return [tool1, tool2, tool3, tool4, tool5, tool6, tool7, tool8, tool9, tool10, tool11, tool12, tool13];
}
