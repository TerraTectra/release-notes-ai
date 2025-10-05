const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

/**
 * Main function for generating release notes using OpenAI.
 * This script is designed to run inside a GitHub Action context. It collects
 * commit messages from the push event payload, constructs a prompt, and
 * sends it to the OpenAI Chat Completion API to generate human‑friendly
 * release notes. The generated notes are returned as an output variable
 * named `release_notes`.
 */
async function run() {
  try {
    // Read inputs from action configuration
    const openaiKey = core.getInput('openai_key', { required: true });

    // Collect commit messages from the push event payload. If no commits
    // are present (e.g. workflow triggered by a different event), fall back
    // to an empty array.
    const commits = (github.context.payload.commits || []).map((c) => c.message);
    if (commits.length === 0) {
      core.warning('No commit messages found in the event payload.');
    }

    const commitMessages = commits.join('\n');
    const prompt = `Generate concise and informative release notes for the following list of commit messages. Summarise features, improvements and fixes in plain language without code details.\n\n${commitMessages}`;

    // Prepare request body for OpenAI API
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant that writes clean and friendly release notes for software projects.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.5
    };

    // Call OpenAI Chat Completion API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}: ${text}`);
    }
    const data = await response.json();
    const notes = data.choices && data.choices.length > 0 ? data.choices[0].message.content.trim() : '';

    // Set the notes as an output
    core.setOutput('release_notes', notes);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();