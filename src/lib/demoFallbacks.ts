import { RepoMetadata, TreeItem, BeginnerTask, CommitItem } from '../types';

export interface RepoSnapshot {
  metadata: RepoMetadata;
  filteredTree: TreeItem[];
  manifests: Record<string, string>;
  beginnerIssues: BeginnerTask[];
  recentCommits: CommitItem[];
}

export const DEMO_SNAPSHOTS: Record<string, RepoSnapshot> = {
  'tailwindlabs/tailwindcss': {
    metadata: {
      owner: 'tailwindlabs',
      repo: 'tailwindcss',
      fullName: 'tailwindlabs/tailwindcss',
      description: 'A utility-first CSS framework for rapid UI development',
      stars: 83500,
      forks: 4100,
      openIssuesCount: 48,
      defaultBranch: 'main',
      primaryLanguage: 'TypeScript',
      topics: ['css', 'tailwindcss', 'framework', 'rust', 'frontend'],
      license: 'MIT',
      updatedAt: '2026-10-25T16:00:00Z',
      htmlUrl: 'https://github.com/tailwindlabs/tailwindcss',
    },
    filteredTree: [
      { path: 'packages/tailwindcss/src/index.ts', mode: '100644', type: 'blob', sha: 'tw1', size: 5200 },
      { path: 'packages/@tailwindcss-vite/src/index.ts', mode: '100644', type: 'blob', sha: 'tw2', size: 3400 },
      { path: 'packages/@tailwindcss-postcss/src/index.ts', mode: '100644', type: 'blob', sha: 'tw3', size: 2800 },
      { path: 'crates/oxide/src/lib.rs', mode: '100644', type: 'blob', sha: 'tw4', size: 14200 },
      { path: 'package.json', mode: '100644', type: 'blob', sha: 'tw5', size: 1800 },
      { path: 'pnpm-workspace.yaml', mode: '100644', type: 'blob', sha: 'tw6', size: 350 },
      { path: '.github/workflows/ci.yml', mode: '100644', type: 'blob', sha: 'tw7', size: 2100 },
      { path: 'README.md', mode: '100644', type: 'blob', sha: 'tw8', size: 6100 },
    ],
    manifests: {
      'package.json': `{
  "name": "tailwindcss-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter=tailwindcss dev",
    "build": "pnpm build",
    "test": "vitest run",
    "lint": "eslint ."
  }
}`,
      'README.md': `# Tailwind CSS\nA utility-first CSS framework for rapid UI development.`,
      '.github/workflows/ci.yml': `name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm test`,
    },
    beginnerIssues: [
      {
        issueNumber: 13840,
        title: 'docs: clarify CSS variable theme configuration with Vite plugin',
        url: 'https://github.com/tailwindlabs/tailwindcss/issues/13840',
        labels: ['documentation', 'good first issue'],
        difficulty: 'Easy',
        likelyFilesToEdit: ['docs/theme.md', 'packages/@tailwindcss-vite/README.md'],
        actionPlan: '1. Inspect the Vite integration guide in packages/@tailwindcss-vite.\n2. Clarify @theme directive CSS variable resolution.\n3. Run pnpm build to test docs.',
        commentsCount: 1,
      },
    ],
    recentCommits: [
      { sha: '6f3d1b8', message: 'Release Tailwind CSS v4.0.0-alpha', author: 'adamwathan', date: '2026-10-25' },
      { sha: '8c2e9a4', message: 'Oxide: improve parser throughput for AST transforms', author: 'reinink', date: '2026-10-24' },
    ],
  },

  'fastapi/fastapi': {
    metadata: {
      owner: 'fastapi',
      repo: 'fastapi',
      fullName: 'fastapi/fastapi',
      description: 'FastAPI framework, high performance, easy to learn, fast to code, ready for production',
      stars: 76420,
      forks: 6240,
      openIssuesCount: 420,
      defaultBranch: 'master',
      primaryLanguage: 'Python',
      topics: ['fastapi', 'python', 'pydantic', 'starlette', 'api', 'asyncio'],
      license: 'MIT',
      updatedAt: '2026-10-24T18:30:00Z',
      htmlUrl: 'https://github.com/fastapi/fastapi',
    },
    filteredTree: [
      { path: 'fastapi/__init__.py', mode: '100644', type: 'blob', sha: 'a1b2', size: 2450 },
      { path: 'fastapi/applications.py', mode: '100644', type: 'blob', sha: 'a1b3', size: 12400 },
      { path: 'fastapi/routing.py', mode: '100644', type: 'blob', sha: 'a1b4', size: 21500 },
      { path: 'fastapi/params.py', mode: '100644', type: 'blob', sha: 'a1b5', size: 9800 },
      { path: 'fastapi/dependencies/models.py', mode: '100644', type: 'blob', sha: 'a1b6', size: 6400 },
      { path: 'fastapi/security/__init__.py', mode: '100644', type: 'blob', sha: 'a1b7', size: 3200 },
      { path: 'docs/en/docs/index.md', mode: '100644', type: 'blob', sha: 'a1b8', size: 5400 },
      { path: 'docs/tutorial/first-steps.md', mode: '100644', type: 'blob', sha: 'a1b9', size: 3900 },
      { path: 'tests/test_tutorial/test_first_steps.py', mode: '100644', type: 'blob', sha: 'a1c1', size: 4500 },
      { path: 'tests/test_main.py', mode: '100644', type: 'blob', sha: 'a1c2', size: 7800 },
      { path: 'pyproject.toml', mode: '100644', type: 'blob', sha: 'a1c3', size: 4200 },
      { path: 'requirements.txt', mode: '100644', type: 'blob', sha: 'a1c4', size: 1800 },
      { path: '.github/workflows/test.yml', mode: '100644', type: 'blob', sha: 'a1c5', size: 3100 },
      { path: 'README.md', mode: '100644', type: 'blob', sha: 'a1c6', size: 8500 },
    ],
    manifests: {
      'pyproject.toml': `[tool.poetry]
name = "fastapi"
version = "0.115.0"
description = "FastAPI framework, high performance, easy to learn, fast to code"
authors = ["Sebastián Ramírez <tiangolo@gmail.com>"]

[tool.poetry.dependencies]
python = "^3.8"
starlette = ">=0.40.0,<0.42.0"
pydantic = ">=1.7.4,<3.0.0"

[tool.pytest.ini_options]
addopts = "--strict-config --strict-markers"
testpaths = ["tests"]`,
      'README.md': `# FastAPI framework\nFastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.8+ based on standard Python type hints.`,
      '.github/workflows/test.yml': `name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.10"
      - name: Install dependencies
        run: pip install -r requirements-tests.txt
      - name: Run tests
        run: pytest tests/`,
    },
    beginnerIssues: [
      {
        issueNumber: 10420,
        title: 'docs: clarify lifespan events async context manager in advanced tutorial',
        url: 'https://github.com/fastapi/fastapi/issues/10420',
        labels: ['documentation', 'good first issue'],
        difficulty: 'Easy',
        likelyFilesToEdit: ['docs/en/docs/advanced/events.md', 'docs/tutorial/lifespan.md'],
        actionPlan: '1. Locate the lifespan tutorial in docs/en/docs/advanced/events.md.\n2. Update the example snippet using the recommended asynccontextmanager syntax.\n3. Run mkdocs serve to verify formatting.',
        commentsCount: 1,
      },
      {
        issueNumber: 10512,
        title: 'tests: add validation test cases for union query parameters',
        url: 'https://github.com/fastapi/fastapi/issues/10512',
        labels: ['tests', 'help wanted', 'good first issue'],
        difficulty: 'Good First Issue',
        likelyFilesToEdit: ['tests/test_tutorial/test_query_params.py', 'fastapi/routing.py'],
        actionPlan: '1. Inspect existing query param tests in tests/test_tutorial/test_query_params.py.\n2. Add a test checking Union[int, str] serialization.\n3. Run pytest tests/test_tutorial/test_query_params.py.',
        commentsCount: 2,
      },
      {
        issueNumber: 10604,
        title: 'refactor: type annotations cleanup in dependency overrides map',
        url: 'https://github.com/fastapi/fastapi/issues/10604',
        labels: ['refactor', 'beginner'],
        difficulty: 'Intermediate',
        likelyFilesToEdit: ['fastapi/dependencies/models.py', 'fastapi/applications.py'],
        actionPlan: '1. Open fastapi/dependencies/models.py and check dependency overrides type alias.\n2. Ensure compatibility with Python 3.8+ typing standards.\n3. Run mypy fastapi.',
        commentsCount: 0,
      },
    ],
    recentCommits: [
      { sha: '7f9c2a1', message: 'Release FastAPI 0.115.0', author: 'tiangolo', date: '2026-10-24' },
      { sha: 'e3b8d4f', message: 'Improve response schema caching for Pydantic v2', author: 'Kludex', date: '2026-10-22' },
      { sha: 'a2c19e5', message: 'Update tutorial translations for Italian and Japanese', author: 'fastapi-bot', date: '2026-10-20' },
    ],
  },

  'shadcn-ui/ui': {
    metadata: {
      owner: 'shadcn-ui',
      repo: 'ui',
      fullName: 'shadcn-ui/ui',
      description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
      stars: 73800,
      forks: 6450,
      openIssuesCount: 310,
      defaultBranch: 'main',
      primaryLanguage: 'TypeScript',
      topics: ['react', 'tailwindcss', 'radix-ui', 'components', 'ui-library', 'nextjs'],
      license: 'MIT',
      updatedAt: '2026-10-25T11:00:00Z',
      htmlUrl: 'https://github.com/shadcn-ui/ui',
    },
    filteredTree: [
      { path: 'packages/cli/src/index.ts', mode: '100644', type: 'blob', sha: 's1', size: 3400 },
      { path: 'packages/cli/src/commands/add.ts', mode: '100644', type: 'blob', sha: 's2', size: 8900 },
      { path: 'packages/cli/src/commands/init.ts', mode: '100644', type: 'blob', sha: 's3', size: 11200 },
      { path: 'apps/www/components/site-header.tsx', mode: '100644', type: 'blob', sha: 's4', size: 4500 },
      { path: 'apps/www/registry/new-york/ui/button.tsx', mode: '100644', type: 'blob', sha: 's5', size: 2100 },
      { path: 'apps/www/registry/new-york/ui/dialog.tsx', mode: '100644', type: 'blob', sha: 's6', size: 3800 },
      { path: 'package.json', mode: '100644', type: 'blob', sha: 's7', size: 1950 },
      { path: 'pnpm-workspace.yaml', mode: '100644', type: 'blob', sha: 's8', size: 450 },
      { path: '.github/workflows/ci.yml', mode: '100644', type: 'blob', sha: 's9', size: 1800 },
      { path: 'README.md', mode: '100644', type: 'blob', sha: 's10', size: 6200 },
    ],
    manifests: {
      'package.json': `{
  "name": "shadcn-ui",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter=www dev",
    "build": "pnpm --filter=www build",
    "test": "vitest run",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vitest": "^1.4.0",
    "eslint": "^8.57.0"
  }
}`,
      'README.md': `# shadcn/ui\nBeautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.`,
      '.github/workflows/ci.yml': `name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - name: Install dependencies
        run: pnpm install
      - name: Run test suite
        run: pnpm test
      - name: Run linter
        run: pnpm lint`,
    },
    beginnerIssues: [
      {
        issueNumber: 2841,
        title: 'docs(button): add icon with text alignment guide',
        url: 'https://github.com/shadcn-ui/ui/issues/2841',
        labels: ['documentation', 'good first issue'],
        difficulty: 'Easy',
        likelyFilesToEdit: ['apps/www/content/docs/components/button.mdx', 'apps/www/registry/new-york/ui/button.tsx'],
        actionPlan: '1. Inspect apps/www/content/docs/components/button.mdx.\n2. Add an example showcasing Lucide icon with gap-2 flex layout.\n3. Run pnpm dev and verify in localhost:3000.',
        commentsCount: 2,
      },
      {
        issueNumber: 3105,
        title: 'fix(cli): handle directory paths containing spaces in shadcn add',
        url: 'https://github.com/shadcn-ui/ui/issues/3105',
        labels: ['cli', 'bug', 'help wanted'],
        difficulty: 'Good First Issue',
        likelyFilesToEdit: ['packages/cli/src/commands/add.ts', 'packages/cli/src/utils/get-project-info.ts'],
        actionPlan: '1. Open packages/cli/src/commands/add.ts.\n2. Wrap path resolution in quotes to avoid shell splitting.\n3. Run pnpm test in packages/cli.',
        commentsCount: 0,
      },
    ],
    recentCommits: [
      { sha: '9d2f1a3', message: 'Add InputOTP component registry', author: 'shadcn', date: '2026-10-24' },
      { sha: '4b7c8e2', message: 'Update Tailwind CSS v4 compatibility guide', author: 'shadcn', date: '2026-10-23' },
    ],
  },

  'facebook/react': {
    metadata: {
      owner: 'facebook',
      repo: 'react',
      fullName: 'facebook/react',
      description: 'The library for web and native user interfaces',
      stars: 228900,
      forks: 46200,
      openIssuesCount: 1100,
      defaultBranch: 'main',
      primaryLanguage: 'JavaScript',
      topics: ['react', 'javascript', 'frontend', 'ui', 'declarative'],
      license: 'MIT',
      updatedAt: '2026-10-25T14:00:00Z',
      htmlUrl: 'https://github.com/facebook/react',
    },
    filteredTree: [
      { path: 'packages/react/index.js', mode: '100644', type: 'blob', sha: 'r1', size: 1400 },
      { path: 'packages/react-dom/index.js', mode: '100644', type: 'blob', sha: 'r2', size: 2100 },
      { path: 'packages/react-reconciler/src/ReactFiberWorkLoop.js', mode: '100644', type: 'blob', sha: 'r3', size: 45000 },
      { path: 'packages/react-reconciler/src/ReactFiberHooks.js', mode: '100644', type: 'blob', sha: 'r4', size: 38000 },
      { path: 'packages/shared/ReactSymbols.js', mode: '100644', type: 'blob', sha: 'r5', size: 3200 },
      { path: 'package.json', mode: '100644', type: 'blob', sha: 'r6', size: 3200 },
      { path: '.github/workflows/runtime_tests.yml', mode: '100644', type: 'blob', sha: 'r7', size: 2400 },
      { path: 'README.md', mode: '100644', type: 'blob', sha: 'r8', size: 5500 },
    ],
    manifests: {
      'package.json': `{
  "name": "react-monorepo",
  "private": true,
  "scripts": {
    "build": "node ./scripts/rollup/build.js",
    "test": "yarn test",
    "test:unit": "jest",
    "lint": "node ./scripts/tasks/eslint.js",
    "flow": "node ./scripts/flow"
  }
}`,
      'README.md': `# React\nReact is a JavaScript library for building user interfaces.`,
      '.github/workflows/runtime_tests.yml': `name: Runtime Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Run Jest test suite
        run: yarn test:unit`,
    },
    beginnerIssues: [
      {
        issueNumber: 29402,
        title: 'docs: clarify useTransition vs useDeferredValue priority queue behavior',
        url: 'https://github.com/facebook/react/issues/29402',
        labels: ['documentation', 'good first issue'],
        difficulty: 'Easy',
        likelyFilesToEdit: ['fixtures/concurrent/index.html', 'packages/react/src/ReactHooks.js'],
        actionPlan: '1. Review transition scheduling comments in packages/react-reconciler.\n2. Update explanatory fixture docstrings.\n3. Run yarn test:unit ReactHooks.',
        commentsCount: 1,
      },
    ],
    recentCommits: [
      { sha: 'ac91f82', message: 'Compiler: optimize memo cache slots', author: 'josephsavona', date: '2026-10-24' },
      { sha: 'b82d91c', message: 'Action hooks: improve async error boundary reporting', author: 'gaearon', date: '2026-10-23' },
    ],
  },
};

/**
 * Returns a fallback snapshot if available or generates a clean synthetic snapshot
 */
export function getFallbackSnapshot(owner: string, repo: string): RepoSnapshot {
  const key = `${owner}/${repo}`.toLowerCase();
  for (const [k, v] of Object.entries(DEMO_SNAPSHOTS)) {
    if (k.toLowerCase() === key) {
      return v;
    }
  }

  // Generic clean synthetic snapshot for any arbitrary repo
  return {
    metadata: {
      owner,
      repo,
      fullName: `${owner}/${repo}`,
      description: `Open-source software repository ${owner}/${repo}`,
      stars: 1250,
      forks: 180,
      openIssuesCount: 24,
      defaultBranch: 'main',
      primaryLanguage: 'TypeScript',
      topics: ['open-source', 'developer-tools'],
      license: 'MIT',
      updatedAt: new Date().toISOString(),
      htmlUrl: `https://github.com/${owner}/${repo}`,
    },
    filteredTree: [
      { path: 'src/index.ts', mode: '100644', type: 'blob', sha: 'g1', size: 2100 },
      { path: 'src/core/engine.ts', mode: '100644', type: 'blob', sha: 'g2', size: 5400 },
      { path: 'src/utils/helpers.ts', mode: '100644', type: 'blob', sha: 'g3', size: 1800 },
      { path: 'tests/index.test.ts', mode: '100644', type: 'blob', sha: 'g4', size: 3200 },
      { path: 'package.json', mode: '100644', type: 'blob', sha: 'g5', size: 1100 },
      { path: 'README.md', mode: '100644', type: 'blob', sha: 'g6', size: 3400 },
      { path: '.github/workflows/ci.yml', mode: '100644', type: 'blob', sha: 'g7', size: 1400 },
    ],
    manifests: {
      'package.json': `{
  "name": "${repo}",
  "version": "1.0.0",
  "scripts": {
    "dev": "npm run build -- --watch",
    "build": "tsc",
    "test": "npm run test:unit",
    "test:unit": "jest",
    "lint": "eslint ."
  }
}`,
      'README.md': `# ${repo}\nWelcome to ${owner}/${repo}. Check the quickstart runbook below.`,
      '.github/workflows/ci.yml': `name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test`,
    },
    beginnerIssues: [
      {
        issueNumber: 12,
        title: 'Improve quickstart examples and onboarding runbook in README',
        url: `https://github.com/${owner}/${repo}/issues/12`,
        labels: ['good first issue', 'documentation'],
        difficulty: 'Easy',
        likelyFilesToEdit: ['README.md', 'CONTRIBUTING.md'],
        actionPlan: '1. Open README.md.\n2. Clarify prerequisites and build flags.\n3. Run npm test to verify documentation examples.',
        commentsCount: 0,
      },
      {
        issueNumber: 18,
        title: 'Add unit tests for error boundary handling in core engine',
        url: `https://github.com/${owner}/${repo}/issues/18`,
        labels: ['tests', 'help wanted'],
        difficulty: 'Good First Issue',
        likelyFilesToEdit: ['tests/index.test.ts', 'src/core/engine.ts'],
        actionPlan: '1. Inspect tests/index.test.ts.\n2. Add test coverage for invalid inputs.\n3. Run npm test.',
        commentsCount: 1,
      },
    ],
    recentCommits: [
      { sha: '4a1b2c3', message: 'chore: update dependency versions', author: owner, date: '2026-10-24' },
      { sha: '8d7e6f5', message: 'fix: optimize CI workflow run steps', author: owner, date: '2026-10-22' },
    ],
  };
}
