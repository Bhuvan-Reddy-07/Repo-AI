export interface RepoPromptPayload {
  owner: string;
  repo: string;
  repoMeta: any;
  fileTree: string[];
  configFiles: Record<string, string>;
  ciWorkflows: Record<string, string>;
  openIssues: any[];
  readmeContent: string;
}

export interface ContextUtilizationStats {
  totalTokensEstimated: number;
  maxContextTokens: number;
  percentUsed: number;
  filesCount: number;
  workflowsCount: number;
  issuesCount: number;
  formattedSummary: string;
}

/**
 * Calculates estimated token usage against Gemma 4 26B A4B's 256K (262,144) context window.
 */
export function calculateContextStats(
  fileTreeCount: number,
  configFilesCount: number,
  ciWorkflowsCount: number,
  openIssuesCount: number,
  charLength: number
): ContextUtilizationStats {
  const maxContextTokens = 262144; // Gemma 4 256K window
  // Standard rule-of-thumb: ~3.8 chars per token for code & structured manifests
  const totalTokensEstimated = Math.min(
    Math.round(charLength / 3.8) + (fileTreeCount * 3),
    maxContextTokens
  );
  const percentUsed = Number(
    ((totalTokensEstimated / maxContextTokens) * 100).toFixed(1)
  );

  const formattedSummary = `Ingested ${fileTreeCount} files + ${ciWorkflowsCount} CI workflows + ${openIssuesCount} Issues • ${totalTokensEstimated.toLocaleString()} / 262,144 tokens (${percentUsed}% of Gemma 4 Context)`;

  return {
    totalTokensEstimated,
    maxContextTokens,
    percentUsed,
    filesCount: fileTreeCount,
    workflowsCount: ciWorkflowsCount,
    issuesCount: openIssuesCount,
    formattedSummary,
  };
}

export function buildGemma4OnboardingPrompt(payload: RepoPromptPayload): {
  systemPrompt: string;
  userPrompt: string;
  contextStats: ContextUtilizationStats;
} {
  const systemPrompt = `You are RepoPilot, powered by Google DeepMind's Gemma 4 26B A4B (MoE) engine.
Your job is to drastically reduce Time-to-First-Contribution (TTFC) for newcomers joining an open-source repository.

CRITICAL RULES:
1. NEVER hallucinate file paths or commands. Every folder path in "keyFolders" and every file path in "beginnerTasks.likelyFilesToEdit" MUST exist in the provided [REPOSITORY FILE TREE].
2. Extract "setupSteps" and "testCommands" strictly from the provided [CONFIG & MANIFEST FILES] and [CI/CD WORKFLOWS]. Always cite the exact "sourceFile" where you found the command.
3. For "ecosystemPreviews", synthesize repo-specific micro-excerpts tailored to each of the 13 developer tools (GitDiagram, Gitingest, DeepWiki, GitProbe, Repoprep, Repomix, git2txt, CodeViz, DomoScope, Gitmotion, Diagrams-as-Code, LearnGitBranching, VisualizingGit).
4. Output valid JSON matching the exact schema requested, with no markdown wrappers outside the JSON.`;

  const configFilesBlock = Object.entries(payload.configFiles || {})
    .map(
      ([name, content]) =>
        `--- FILE: ${name} ---\n${(content || "").slice(0, 14000)}`
    )
    .join("\n\n");

  const workflowsBlock = Object.entries(payload.ciWorkflows || {})
    .map(
      ([name, content]) =>
        `--- WORKFLOW: ${name} ---\n${(content || "").slice(0, 12000)}`
    )
    .join("\n\n");

  const fileTreeSlice = (payload.fileTree || []).slice(0, 2500).join("\n");
  const readmeSlice = (payload.readmeContent || "").slice(0, 16000);
  const issuesSlice = JSON.stringify(payload.openIssues || [], null, 2).slice(
    0,
    18000
  );

  const userPrompt = `Analyze the following open-source repository: https://github.com/${payload.owner}/${payload.repo}

=== 1. REPOSITORY METADATA ===
Name: ${payload.owner}/${payload.repo}
Description: ${payload.repoMeta?.description || "N/A"}
Primary Language: ${payload.repoMeta?.language || "Multiple"}
Default Branch: ${payload.repoMeta?.default_branch || "main"}
Stars: ${payload.repoMeta?.stargazers_count ?? 0} | Open Issues: ${payload.repoMeta?.open_issues_count ?? 0}

=== 2. REPOSITORY FILE TREE (${payload.fileTree?.length || 0} files) ===
${fileTreeSlice}

=== 3. CONFIG & MANIFEST FILES (Ground Truth for Setup) ===
${configFilesBlock || "No raw manifest files detected."}

=== 4. CI/CD WORKFLOWS (Ground Truth for Test Commands) ===
${workflowsBlock || "No CI/CD workflows detected."}

=== 5. README.md EXCERPT ===
${readmeSlice || "No README.md content available."}

=== 6. LIVE OPEN ISSUES (Candidate Beginner Tasks) ===
${issuesSlice}

Return a valid JSON object matching this exact structure:
{
  "repoSummary": {
    "oneLinePitch": "Clear 1-sentence architectural summary of the repo",
    "techStack": ["List of detected languages, frameworks, and tools"],
    "architecturePattern": "e.g., Next.js App Router Monorepo / Python FastAPI Microservice",
    "onboardingDifficulty": "Beginner | Intermediate | Advanced",
    "estimatedSetupTimeMinutes": 10,
    "prerequisites": ["Required runtime versions e.g. Node 20+, Python 3.11+, Rust 1.75+"]
  },
  "keyFolders": [
    {
      "path": "Exact directory path from tree",
      "role": "Short architectural title",
      "description": "What lives here and why a contributor cares",
      "importance": "Critical: Start Here | Core Architecture | Important | Support | Testing"
    }
  ],
  "setupSteps": [
    {
      "stepNumber": 1,
      "title": "Action title",
      "command": "Exact shell command",
      "sourceFile": "e.g., package.json or Dockerfile or Makefile",
      "notes": "Runtime version or env requirements"
    }
  ],
  "testCommands": [
    {
      "type": "Unit Tests | Integration | Linter | E2E | Build Verification",
      "command": "Exact test command",
      "sourceFile": "e.g., .github/workflows/ci.yml",
      "description": "What this test suite verifies"
    }
  ],
  "beginnerTasks": [
    {
      "issueNumber": 123,
      "title": "Issue title",
      "url": "https://github.com/${payload.owner}/${payload.repo}/issues/123",
      "labels": ["good first issue"],
      "difficulty": "Easy | Intermediate | Good First Issue",
      "likelyFilesToEdit": ["Exact file paths from the File Tree"],
      "verificationCommand": "Exact test command to run after editing",
      "actionPlan": "Step-by-step developer guide on how to fix this specific issue"
    }
  ],
  "mermaidArchitectureDiagram": "graph TD\\n  A[Client] --> B[Router]",
  "pythonMingrammerSnippet": "# Python diagrams code snippet",
  "deepWikiSummary": [
    "Core Domain Concept: ...",
    "Primary Data Flow: ...",
    "State and Storage: ..."
  ],
  "ecosystemPreviews": {
    "gitdiagram": "Summary of main nodes and edges in the architecture diagram",
    "gitingest": "Token estimate and top 5 highest-signal files for LLM ingestion",
    "deepwiki": ["Core Domain Concept", "Primary Data Flow", "State/Storage Mechanism"],
    "gitprobe": "Top 3 entry-point files and their primary exported modules",
    "repoprep": "Pre-formatted system prompt header for AI coding assistants",
    "repomix": "npx repomix --remote ${payload.owner}/${payload.repo} summary & key include globs",
    "git2txt": "Plaintext digest overview of docs + config manifests",
    "codeviz": "Call hierarchy summary: Entry Layer -> Service Layer -> Data Layer",
    "domoscope": "Coupling analysis: which folders have the highest dependency fan-out",
    "gitmotion": "Summary of active development areas and contributor workflow",
    "diagramsMingrammer": "Valid Python diagrams library code snippet modeling this repo",
    "learnGitBranching": "Exact git branch & rebase command sequence for this repo's default branch",
    "visualizingGit": "Fork -> Clone -> Branch -> Test -> PR commands customized for ${payload.owner}/${payload.repo}"
  }
}`;

  const totalChars =
    systemPrompt.length +
    userPrompt.length +
    configFilesBlock.length +
    workflowsBlock.length;

  const contextStats = calculateContextStats(
    payload.fileTree?.length || 0,
    Object.keys(payload.configFiles || {}).length,
    Object.keys(payload.ciWorkflows || {}).length,
    payload.openIssues?.length || 0,
    totalChars
  );

  return { systemPrompt, userPrompt, contextStats };
}
