# AI Release Notes Generator

## Overview

**AI Release Notes Generator** is a GitHub Action that automatically generates human‑friendly release notes from your commit messages using OpenAI's Chat Completion API. It saves time during the release process by summarising features, improvements and bug fixes directly from your commit history.

## Usage

To use this action in your workflow, add the following step to your workflow YAML file:

```yaml
jobs:
  generate_release_notes:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Generate release notes
        id: release_notes
        uses: your-username/release-notes-ai@v1
        with:
          openai_key: ${{ secrets.OPENAI_API_KEY }}

      - name: Display release notes
        run: echo "${{ steps.release_notes.outputs.release_notes }}"
```

Replace `your-username` with your GitHub username (or organisation) and ensure you have stored your OpenAI API key in a repository secret named `OPENAI_API_KEY`.

## Inputs

| Name | Description | Required |
|------|-------------|---------|
| `openai_key` | OpenAI API key used to authenticate API requests. Store this in `secrets` and pass it via workflow inputs. | ✅ |

## Outputs

| Name | Description |
|------|-------------|
| `release_notes` | The generated release notes text. |

## How It Works

When triggered by a push event, the action collects the commit messages contained in the event payload. It constructs a prompt asking OpenAI to summarise the changes and posts this to the Chat Completion API. The resulting release notes are set as an output variable (`release_notes`) that you can use in subsequent steps, such as creating a GitHub Release or updating a changelog file.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests to improve the action, add features or translations. Please ensure any code changes include appropriate tests and documentation updates.