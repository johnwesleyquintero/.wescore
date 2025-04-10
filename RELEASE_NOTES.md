# Wescore v1.0.0: Comprehensive Code Quality Framework

We're excited to announce the first stable release of Wescore, a comprehensive Code Quality Framework designed to maintain high standards in your codebase through automated checks and reporting.

## Key Features

- **Automated Quality Checks:** Run formatter, linter, type checker, and build commands seamlessly
- **Flexible Execution:** Support for both sequential and parallel execution of checks
- **Consolidated Reporting:** Clear summary of failed checks with detailed output
- **Error Categorization:** Smart grouping of errors with actionable suggestions
- **Easy Integration:** Simple setup for local development and CI pipelines
- **Configurable:** Advanced customization via `.wescore.json`
- **Type Safety:** Built-in configuration validation using Zod schema

## Installation

1. Download the `wescore-latest.zip` from the release assets
2. Extract the contents into your project directory
3. Install required dependencies:
   ```bash
   npm install --save-dev chalk zod
   ```
4. Ensure your project has the necessary development tools installed (formatter, linter, type checker, build tool)

## Prerequisites

- **Node.js:** Required to run the framework
- **Package Manager:** Compatible with npm, yarn, pnpm, or bun
- **Project-Specific Tools:** Your project should have configured:
  - Formatting (e.g., Prettier)
  - Linting (e.g., ESLint)
  - Type Checking (e.g., TypeScript)
  - Building (e.g., Vite, Webpack)

## What's Included

This release includes:
- Core framework files for quality checks
- Configuration schema and loader
- Command runner and process management
- Reporting and error categorization utilities
- Complete documentation and examples
- CI/CD integration templates

## Getting Started

After installation, add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit",
    "build": "vite build",
    "cq": "node .wescore/main.js"
  }
}
```

Then run the quality checks with:
```bash
npm run cq
```

## Documentation

For complete documentation, configuration options, and best practices, please refer to our [README.md](README.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.