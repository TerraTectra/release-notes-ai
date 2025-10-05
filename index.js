const core = require('@actions/core');
const github = require('@actions/github');

/**
 * Generate release notes from commit messages without external APIs.
 *
 * This script groups commit messages by prefix (e.g. `feat`, `fix`) and
 * produces a formatted Markdown string. The resulting notes are exposed
 * via the `release_notes` output of this action.
 */
async function run() {
  try {
    // Gather commit messages from the push event payload. When no commits
    // are present (for example, if the workflow was triggered by a different
    // event), an empty array is used.
    const commits = (github.context.payload.commits || []).map(c => c.message);
    if (commits.length === 0) {
      core.warning('No commit messages found in the event payload.');
    }

    // Categorize commit messages by their prefixes. Conventional prefixes such
    // as `feat` or `feature` will be grouped under "Features", `fix` or `bug`
    // under "Bug Fixes", and all others under "Other Changes".
    const sections = {
      Features: [],
      'Bug Fixes': [],
      Other: []
    };

    commits.forEach(msg => {
      const lower = msg.toLowerCase();
      if (lower.startsWith('feat') || lower.startsWith('feature')) {
        sections.Features.push(msg);
      } else if (lower.startsWith('fix') || lower.startsWith('bug')) {
        sections['Bug Fixes'].push(msg);
      } else {
        sections.Other.push(msg);
      }
    });

    // Build the release notes in Markdown format.
    let output = '';
    if (sections.Features.length > 0) {
      output += '### Features\n';
      sections.Features.forEach(m => {
        output += `- ${m}\n`;
      });
      output += '\n';
    }
    if (sections['Bug Fixes'].length > 0) {
      output += '### Bug Fixes\n';
      sections['Bug Fixes'].forEach(m => {
        output += `- ${m}\n`;
      });
      output += '\n';
    }
    if (sections.Other.length > 0) {
      output += '### Other Changes\n';
      sections.Other.forEach(m => {
        output += `- ${m}\n`;
      });
    }

    // Output the result to the `release_notes` output variable.
    core.setOutput('release_notes', output.trim());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();