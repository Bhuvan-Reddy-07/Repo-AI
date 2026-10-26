# RepoPilot // Open-Source Onboarding Engine & Ecosystem Command Center

> **Repo-AI: The 60-Second Open-Source Onboarding Assistant**  
> Built for hackathons, open-source maintainers, and first-time contributors.

---

## ⚡ Problem Solved
New contributors abandon open-source repositories because environment setup is undocumented or outdated, project architecture is obscure, and finding beginner-friendly issues with clear starting points is difficult. 

**RepoPilot** dynamically analyzes any public GitHub repository URL (`https://github.com/{owner}/{repo}`) and generates:
1. **Interactive Key Folders & Architecture Blueprint** (Visual directory map + live Mermaid.js diagram).
2. **Deterministic Setup Runbook** (Prerequisites, sequential installation, and run commands extracted from manifests).
3. **Verified CI Test Commands** (Extracted directly from `.github/workflows/*.yml`, `package.json`, `Makefile`, etc.).
4. **Beginner-Friendly Tasks** (Live open issues labeled `good first issue` or `help wanted` mapped to the specific files to touch, plus 1-click **Draft PR Checklist**).
5. **The 13-Tool Developer Ecosystem Matrix** (Instant URL-swap shortcuts + synthesized micro-previews for 13 specialized developer platforms).

---

## 🌐 The 13-Tool Developer Ecosystem Matrix

RepoPilot transforms `{owner}/{repo}` into 13 specialized developer deep links with zero third-party scraping overhead (< 3.5s response):

| # | Tool | URL Swap Shortcut | In-App Live Preview |
| :- | :--- | :--- | :--- |
| 1 | **GitDiagram** | `https://gitdiagram.com/{owner}/{repo}` | Native Mermaid.js architecture flowchart |
| 2 | **Gitingest** | `https://gitingest.com/{owner}/{repo}` | ASCII directory tree digest + token estimate |
| 3 | **DeepWiki** | `https://deepwiki.com/{owner}/{repo}` | 3-bullet executive domain & architecture summary |
| 4 | **GitProbe** | `https://gitprobe.dev/{owner}/{repo}` | Top 3 entry-point files & exported signatures |
| 5 | **Repoprep** | `https://repoprep.com/?repo=...` | Pre-packaged LLM context prompt header |
| 6 | **Repomix** | `https://repomix.com/?repo={owner}/{repo}` | XML-style `<file_summary>` structure + CLI runner |
| 7 | **git2txt** | `https://git2txt.com/?url=...` | Plain-text concatenation of README + manifests |
| 8 | **CodeViz** | `https://codeviz.ai/repos?url=...` | Module call-hierarchy layers (UI ➔ Logic ➔ Data) |
| 9 | **DomoScope** | `https://domoscope.vercel.app/?repo=...` | Component dependency coupling & complexity score |
| 10 | **Gitmotion** | `https://gitmotion.com/{owner}/{repo}` | Recent commit velocity & contributor momentum |
| 11 | **Diagrams (as Code)** | `https://diagrams.mingrammer.com/` | Tailored Python `diagrams` cloud topology script |
| 12 | **Learn Git Branching** | `https://learngitbranching.js.org/` | Repository-tailored Git branching runbook |
| 13 | **Visualizing Git** | `https://git-school.github.io/visualizing-git/` | Step-by-step Fork ➔ Branch ➔ PR commit-graph runbook |

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js >= 18.x
- npm / pnpm / yarn

### Installation
```bash
# Clone or navigate to the directory
cd Repo-AI

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛡️ Reliability & Zero-Crash Architecture
- **Zero External Scraping Delays:** Previews are generated deterministically from official GitHub REST API payloads + LLM synthesis.
- **Rate-Limit & Offline Immunity:** If GitHub API hits unauthenticated rate limits (60 req/hr) or network drops, RepoPilot automatically activates built-in verified ground-truth snapshots (`fastapi/fastapi`, `shadcn-ui/ui`, `facebook/react`, `pallets/flask`).
- **Flexible Credentials:** Top-right Settings ⚙️ popover allows adding a personal GitHub token (for 5,000 req/hr) and Gemini API key.
- **Export Ready:** 1-Click download of `ONBOARDING_{REPO}.md` and 1-Click "Copy All for AI Prompt" (ChatGPT/Claude).
