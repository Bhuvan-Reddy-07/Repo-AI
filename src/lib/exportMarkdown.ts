import { AnalysisResult } from '../types';

/**
 * Generates an end-to-end, publication-grade ONBOARDING_{REPO}.md document
 */
export function generateOnboardingMarkdown(data: AnalysisResult): string {
  const { metadata, repoSummary, keyFolders, setupSteps, testCommands, beginnerTasks, mermaidArchitectureDiagram, ecosystemMatrix } = data;

  const date = new Date().toISOString().split('T')[0];

  return `# Onboarding Runbook & Architecture Guide: ${metadata.fullName}
> Generated on ${date} by **RepoPilot // Open-Source Onboarding Engine**  
> GitHub Repository: [${metadata.htmlUrl}](${metadata.htmlUrl})

---

## Repository Overview & Metadata
- **One-Line Summary:** ${repoSummary.oneLinePitch}
- **Primary Language:** \`${metadata.primaryLanguage}\`
- **Stars:** ${metadata.stars.toLocaleString()} | **Forks:** ${metadata.forks.toLocaleString()} | **Open Issues:** ${metadata.openIssuesCount.toLocaleString()}
- **License:** \`${metadata.license}\` | **Default Branch:** \`${metadata.defaultBranch}\`
- **Architecture Pattern:** \`${repoSummary.architecturePattern}\`
- **Onboarding Difficulty:** **${repoSummary.onboardingDifficulty}** (Estimated Setup Time: ~${repoSummary.estimatedSetupTimeMinutes} mins)
- **Tech Stack:** ${repoSummary.techStack.map((t) => `\`${t}\``).join(', ')}
- **Prerequisites:** ${repoSummary.prerequisites.map((p) => `\`${p}\``).join(', ')}

---

## Key Folders & Architecture Blueprint

### Directory Hierarchy & Roles
| Folder Path | Role | Importance | Description |
| :--- | :--- | :--- | :--- |
${keyFolders.map((f) => `| \`${f.path}\` | **${f.role}** | *${f.importance}* | ${f.description} |`).join('\n')}

### Mermaid.js Architecture Flowchart
\`\`\`mermaid
${mermaidArchitectureDiagram}
\`\`\`

---

## Deterministic Setup Runbook

Follow these sequential steps extracted directly from repository manifests:

${setupSteps.map((s) => `### Step ${s.stepNumber}: ${s.title}
- **Verified via:** \`${s.sourceFile}\`
${s.notes ? `- **Notes:** ${s.notes}\n` : ''}
\`\`\`bash
${s.command}
\`\`\`
`).join('\n')}

---

## Verified Test Suite & CI Commands

Run these commands locally to verify your changes match CI standards:

| Test Type | Command | Source File | Description |
| :--- | :--- | :--- | :--- |
${testCommands.map((t) => `| **${t.type}** | \`${t.command}\` | \`${t.sourceFile}\` | ${t.description} |`).join('\n')}

---

## Good First Issues (Triage Tasks)

${beginnerTasks.map((t) => `### Issue #${t.issueNumber}: [${t.title}](${t.url})
- **Labels:** ${t.labels.map((l) => `\`${l}\``).join(' ')}
- **Difficulty:** **${t.difficulty}**
- **Likely Files to Touch:**
${t.likelyFilesToEdit.map((f) => `  - \`${f}\``).join('\n')}
- **Recommended Action Plan:**
${t.actionPlan.split('\n').map((line) => `  ${line}`).join('\n')}
`).join('\n')}

---

## Developer Ecosystem Matrix

Leverage these specialized web shortcuts for deep repository exploration:

| # | Tool | URL Swap Shortcut | Deep Link |
| :- | :--- | :--- | :--- |
${ecosystemMatrix.map((tool, idx) => `| ${idx + 1} | **${tool.name}** | \`${tool.shortcutRule}\` | [Launch ${tool.name}](${tool.linkUrl}) |`).join('\n')}

---

## LLM Context Prompt (For Claude / ChatGPT)
Copy this prompt to jumpstart an AI coding assistant session:

\`\`\`markdown
I am working on the open-source repository ${metadata.fullName} (${metadata.htmlUrl}).
Tech Stack: ${repoSummary.techStack.join(', ')}
Architecture: ${repoSummary.architecturePattern}
Key Directory Structure:
${keyFolders.map((f) => `- ${f.path}: ${f.role}`).join('\n')}

Setup Command: ${setupSteps.map((s) => s.command).join(' && ')}
Test Command: ${testCommands[0]?.command || 'npm test'}

Please help me implement changes with full test coverage following this project's conventions.
\`\`\`
`;
}
