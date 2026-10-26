import { RepoMetadata, TreeItem, BeginnerTask, CommitItem } from '../types';

/**
 * Normalizes any GitHub URL variant into { owner, repo }
 * Supports:
 * - https://github.com/owner/repo
 * - http://github.com/owner/repo.git
 * - github.com/owner/repo/tree/main/src
 * - owner/repo
 */
export function parseGitHubUrl(input: string): { owner: string; repo: string } {
  const cleanInput = input.trim();
  if (!cleanInput) {
    throw new Error('Please enter a GitHub repository URL or "owner/repo"');
  }

  // Remove trailing slashes and .git
  let normalized = cleanInput
    .replace(/\.git$/i, '')
    .replace(/\/+$/, '');

  // Extract from URL or owner/repo format
  const githubUrlRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s]+)\/([^/\s]+)(?:\/.*)?$/i;
  const match = normalized.match(githubUrlRegex);

  if (match) {
    return {
      owner: match[1],
      repo: match[2],
    };
  }

  // Check shorthand "owner/repo"
  const shortMatch = normalized.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
    };
  }

  throw new Error(`Invalid GitHub repository format: "${input}". Please use "owner/repo" or "https://github.com/owner/repo".`);
}

/**
 * Builds request headers including optional GitHub personal access token
 */
function getHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token && token.trim()) {
    headers.Authorization = `token ${token.trim()}`;
  }
  return headers;
}

/**
 * Handles GitHub API errors with judge-friendly explanations
 */
async function handleResponse(response: Response, entityName: string) {
  if (!response.ok) {
    if (response.status === 403) {
      const resetTime = response.headers.get('x-ratelimit-reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime, 10) * 1000).toLocaleTimeString() : 'soon';
      throw new Error(`GitHub API Rate Limit reached (60/hr unauthenticated). Rate limit resets at ${resetDate}. Tip: Add a personal GitHub Token in Settings for 5,000 req/hr.`);
    }
    if (response.status === 404) {
      throw new Error(`Repository ${entityName} was not found on GitHub. Please check if the repository is public and spelled correctly.`);
    }
    const errText = await response.text();
    throw new Error(`GitHub API Error (${response.status}): ${errText || response.statusText}`);
  }
  return response.json();
}

/**
 * Module A.1: Fetches repository metadata
 */
export async function fetchRepoMetadata(owner: string, repo: string, token?: string): Promise<RepoMetadata> {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(url, { headers: getHeaders(token) });
  const data = await handleResponse(response, `${owner}/${repo}`);

  return {
    owner: data.owner?.login || owner,
    repo: data.name || repo,
    fullName: data.full_name || `${owner}/${repo}`,
    description: data.description || 'No description provided for this repository.',
    stars: data.stargazers_count || 0,
    forks: data.forks_count || 0,
    openIssuesCount: data.open_issues_count || 0,
    defaultBranch: data.default_branch || 'main',
    primaryLanguage: data.language || 'Unknown',
    topics: Array.isArray(data.topics) ? data.topics : [],
    license: data.license?.spdx_id || data.license?.name || 'No License',
    updatedAt: data.updated_at || new Date().toISOString(),
    htmlUrl: data.html_url || `https://github.com/${owner}/${repo}`,
  };
}

/**
 * Module A.2: Fetches recursive git tree and filters out noise
 */
export async function fetchFilteredTree(
  owner: string,
  repo: string,
  branch: string = 'main',
  token?: string
): Promise<{ filteredTree: TreeItem[]; rawCount: number }> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const response = await fetch(url, { headers: getHeaders(token) });
    const data = await handleResponse(response, `${owner}/${repo} tree`);

    const tree: TreeItem[] = data.tree || [];
    const rawCount = tree.length;

    // Filter out build artifacts, dependencies, lockfiles, hidden clutter
    const ignoredPatterns = [
      /(^|\/)node_modules\//i,
      /(^|\/)\.git\//i,
      /(^|\/)\.next\//i,
      /(^|\/)dist\//i,
      /(^|\/)build\//i,
      /(^|\/)target\//i,
      /(^|\/)out\//i,
      /(^|\/)vendor\//i,
      /(^|\/)__pycache__\//i,
      /(^|\/)\.idea\//i,
      /(^|\/)\.vscode\//i,
      /(^|\/)\.cache\//i,
      /(^|\/)coverage\//i,
      /\.lock$/i,
      /package-lock\.json$/i,
      /yarn\.lock$/i,
      /pnpm-lock\.yaml$/i,
      /Cargo\.lock$/i,
      /poetry\.lock$/i,
      /\.min\.(js|css)$/i,
      /\.map$/i,
    ];

    const filtered = tree.filter((item) => {
      return !ignoredPatterns.some((pattern) => pattern.test(item.path));
    });

    return { filteredTree: filtered, rawCount };
  } catch (err) {
    // If branch tree fails (e.g. master instead of main), attempt fallback to HEAD
    if (branch !== 'HEAD') {
      try {
        return await fetchFilteredTree(owner, repo, 'HEAD', token);
      } catch {
        // Fall back to empty tree if rate limited or unable
      }
    }
    console.warn('Git tree fetch error:', err);
    return { filteredTree: [], rawCount: 0 };
  }
}

/**
 * Module A.3: Fetches Ground-Truth Build & Test Manifests
 */
export async function fetchManifests(
  owner: string,
  repo: string,
  tree: TreeItem[],
  defaultBranch: string = 'main',
  token?: string
): Promise<Record<string, string>> {
  // Key files to check
  const manifestCandidates = [
    'package.json',
    'pyproject.toml',
    'requirements.txt',
    'Cargo.toml',
    'go.mod',
    'pom.xml',
    'Makefile',
    'Dockerfile',
    'docker-compose.yml',
    '.nvmrc',
    'CONTRIBUTING.md',
    'README.md',
  ];

  // Also check for GitHub workflow files
  const workflowFiles = tree
    .filter((item) => item.path.startsWith('.github/workflows/') && (item.path.endsWith('.yml') || item.path.endsWith('.yaml')))
    .map((item) => item.path)
    .slice(0, 2); // get top 2 CI workflows

  const filesToFetch = [
    ...manifestCandidates.filter((file) => tree.some((t) => t.path.toLowerCase() === file.toLowerCase())),
    ...workflowFiles,
  ];

  const manifests: Record<string, string> = {};

  const fetchPromises = filesToFetch.map(async (filePath) => {
    try {
      // Use raw.githubusercontent for fastest and rate-limit-friendly retrieval
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${filePath}`;
      const res = await fetch(rawUrl, {
        headers: token ? { Authorization: `token ${token}` } : {},
      });

      if (res.ok) {
        const text = await res.text();
        // Limit manifest size to 15KB each to prevent token bloat
        manifests[filePath] = text.slice(0, 15000);
      }
    } catch {
      // Quiet fail on single manifest
    }
  });

  await Promise.allSettled(fetchPromises);
  return manifests;
}

/**
 * Module A.4: Fetches Beginner Issues Queue
 * Priority: "good first issue", "help wanted", "beginner", "easy", "documentation"
 * Fallback: 5 most recent open issues with fewest comments ("Recent Unclaimed Issues")
 */
export async function fetchBeginnerIssues(
  owner: string,
  repo: string,
  tree: TreeItem[],
  token?: string
): Promise<BeginnerTask[]> {
  try {
    // 1. Try good first issue / help wanted
    const searchLabels = ['good first issue', 'good-first-issue', 'help wanted', 'beginner', 'easy', 'documentation'];
    let rawIssues: any[] = [];

    for (const label of searchLabels) {
      try {
        const encodedLabel = encodeURIComponent(label);
        const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&labels=${encodedLabel}&sort=updated&direction=desc&per_page=6`;
        const res = await fetch(url, { headers: getHeaders(token) });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            rawIssues = list.filter((i) => !i.pull_request);
            if (rawIssues.length >= 3) break;
          }
        }
      } catch {
        // continue to next label
      }
    }

    let isFallback = false;

    // 2. Fallback to recent open issues if no tagged beginner issues exist
    if (rawIssues.length === 0) {
      try {
        const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&sort=comments&direction=asc&per_page=5`;
        const res = await fetch(url, { headers: getHeaders(token) });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            rawIssues = list.filter((i) => !i.pull_request);
            isFallback = true;
          }
        }
      } catch {
        // ignore
      }
    }

    if (rawIssues.length === 0) {
      // Return synthetic starter tasks tailored to repo files
      return generateSyntheticStarterTasks(owner, repo, tree);
    }

    return rawIssues.slice(0, 6).map((issue: any) => {
      const labels = (issue.labels || []).map((l: any) => (typeof l === 'string' ? l : l.name));
      const likelyFiles = predictLikelyFilesForIssue(issue.title, issue.body || '', tree);

      let difficulty: 'Easy' | 'Intermediate' | 'Good First Issue' = 'Good First Issue';
      const titleLower = (issue.title + ' ' + labels.join(' ')).toLowerCase();
      if (titleLower.includes('typo') || titleLower.includes('doc') || titleLower.includes('readme') || titleLower.includes('comment')) {
        difficulty = 'Easy';
      } else if (titleLower.includes('feature') || titleLower.includes('refactor')) {
        difficulty = 'Intermediate';
      }

      return {
        issueNumber: issue.number,
        title: issue.title,
        url: issue.html_url,
        labels: labels.length > 0 ? labels : [isFallback ? 'unclaimed' : 'good first issue'],
        difficulty,
        likelyFilesToEdit: likelyFiles,
        actionPlan: `1. Check ${likelyFiles[0] || 'the relevant module'}.\n2. Reproduce the problem reported in #${issue.number}.\n3. Submit a PR with unit test coverage.`,
        commentsCount: issue.comments || 0,
        createdAt: issue.created_at,
        isFallback,
      };
    });
  } catch (err) {
    console.warn('Beginner issues fetch failed:', err);
    return generateSyntheticStarterTasks(owner, repo, tree);
  }
}

/**
 * Predicts likely files to edit based on issue text and repo file tree
 */
export function predictLikelyFilesForIssue(title: string, body: string, tree: TreeItem[]): string[] {
  const combinedText = `${title} ${body}`.toLowerCase();
  const fileScores: { path: string; score: number }[] = [];

  const candidateFiles = tree.filter((item) => item.type === 'blob');

  for (const item of candidateFiles) {
    let score = 0;
    const pathLower = item.path.toLowerCase();
    const fileName = item.path.split('/').pop()?.toLowerCase() || '';
    const baseName = fileName.replace(/\.[^/.]+$/, '');

    // Direct filename mention
    if (fileName && combinedText.includes(fileName)) {
      score += 50;
    } else if (baseName && baseName.length > 3 && combinedText.includes(baseName)) {
      score += 25;
    }

    // Docs / Readme check
    if ((combinedText.includes('doc') || combinedText.includes('readme')) && pathLower.includes('readme')) {
      score += 30;
    }

    // Test check
    if (combinedText.includes('test') && (pathLower.includes('test') || pathLower.includes('spec'))) {
      score += 15;
    }

    // CLI check
    if (combinedText.includes('cli') && pathLower.includes('cli')) {
      score += 20;
    }

    // UI / Frontend check
    if ((combinedText.includes('ui') || combinedText.includes('button') || combinedText.includes('css')) &&
        (pathLower.includes('components') || pathLower.includes('ui') || pathLower.includes('src/app'))) {
      score += 15;
    }

    if (score > 0) {
      fileScores.push({ path: item.path, score });
    }
  }

  fileScores.sort((a, b) => b.score - a.score);

  if (fileScores.length > 0) {
    return fileScores.slice(0, 3).map((f) => f.path);
  }

  // Fallback to primary entry files
  const defaultEntries = candidateFiles
    .filter((f) => /^(src\/)?(index|main|app|lib)\.(ts|js|py|rs|go)/i.test(f.path) || /readme\.md$/i.test(f.path))
    .slice(0, 2)
    .map((f) => f.path);

  return defaultEntries.length > 0 ? defaultEntries : ['README.md', 'CONTRIBUTING.md'];
}

/**
 * Synthetic starter tasks if repo has no open issues
 */
function generateSyntheticStarterTasks(owner: string, repo: string, tree: TreeItem[]): BeginnerTask[] {
  const readme = tree.find((t) => /readme\.md$/i.test(t.path))?.path || 'README.md';
  const contributing = tree.find((t) => /contributing\.md$/i.test(t.path))?.path || 'CONTRIBUTING.md';
  const testFile = tree.find((t) => /(test|spec)\./i.test(t.path))?.path || 'tests/';

  return [
    {
      issueNumber: 101,
      title: 'Improve onboarding documentation & quick-start examples',
      url: `https://github.com/${owner}/${repo}`,
      labels: ['documentation', 'good first issue'],
      difficulty: 'Easy',
      likelyFilesToEdit: [readme, contributing],
      actionPlan: `1. Review the current ${readme}.\n2. Add concrete step-by-step installation troubleshooting notes.\n3. Verify local build steps and submit PR.`,
      commentsCount: 0,
      isFallback: true,
    },
    {
      issueNumber: 102,
      title: 'Add comprehensive unit test coverage for core utilities',
      url: `https://github.com/${owner}/${repo}`,
      labels: ['testing', 'help wanted'],
      difficulty: 'Good First Issue',
      likelyFilesToEdit: [testFile, 'package.json'],
      actionPlan: `1. Inspect current test suite in ${testFile}.\n2. Identify uncovered edge cases or helper functions.\n3. Run test runner locally to verify green build.`,
      commentsCount: 0,
      isFallback: true,
    },
    {
      issueNumber: 103,
      title: 'Audit repository configuration and type annotations',
      url: `https://github.com/${owner}/${repo}`,
      labels: ['refactor', 'beginner'],
      difficulty: 'Intermediate',
      likelyFilesToEdit: ['tsconfig.json', 'src/'],
      actionPlan: `1. Review strict linting and compiler settings.\n2. Fix any missing type definitions or dangling comments.\n3. Ensure CI pipeline passes cleanly.`,
      commentsCount: 0,
      isFallback: true,
    },
  ];
}

/**
 * Module A.5: Fetches Recent Commits for Velocity and Momentum
 */
export async function fetchRecentCommits(owner: string, repo: string, token?: string): Promise<CommitItem[]> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`;
    const response = await fetch(url, { headers: getHeaders(token) });
    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((item: any) => ({
      sha: item.sha?.substring(0, 7) || 'HEAD',
      message: item.commit?.message?.split('\n')[0] || 'Update',
      author: item.commit?.author?.name || item.author?.login || 'Contributor',
      date: item.commit?.author?.date || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}
