# AI Release Notes Generator

## Overview

**AI Release Notes Generator** is a GitHub Action that automatically generates release notes from commit messages **without relying on any external APIs or services**. It groups commit messages by common prefixes (such as `feat` for features and `fix` for bug fixes) and assembles them into a structured Markdown document.

## Usage

To use this action in your workflow, add a step similar to the following in your workflow YAML file:

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

      - name: Display release notes
        run: echo "${{ steps.release_notes.outputs.release_notes }}"
```

Replace `your-username` with your GitHub username or organisation name. The action will run on every push event and set the `release_notes` output to a formatted string containing your release notes.

## Outputs

| Name | Description |
|------|-------------|
| `release_notes` | The generated release notes text. |

## How It Works

The action inspects the commit messages associated with the push event that triggered the workflow. It categorizes each commit message as follows:

- **Features**: Any commit message beginning with `feat` or `feature`.
- **Bug Fixes**: Any commit message beginning with `fix` or `bug`.
- **Other Changes**: All remaining commit messages.

These categories are then assembled into a Markdown document with headings for each section and bullet points for each commit. The result is returned via the `release_notes` output for use in subsequent steps, such as creating a GitHub release or updating a changelog.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! If you'd like to improve this action or add new features, feel free to open an issue or submit a pull request. Please include appropriate tests and documentation with your changes.