# Wescode - Code Quality Framework

## Table of Contents
- [Overview](#overview)
- [Why Wescode?](#why-wescode)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
  - [Step 1: Get the Framework Script](#step-1-get-the-framework-script)
  - [Step 2: Install Dependencies](#step-2-install-dependencies)
  - [Step 3: Configure `package.json`](#step-3-configure-packagejson)
  - [Step 4: (Optional) Create Configuration File](#step-4-optional-create-configuration-file)
- [Usage](#usage)
- [How it Works](#how-it-works)
- [Configuration Details (`.code-quality.json`)](#configuration-details-code-qualityjson)
  - [Configuration Options Summary](#configuration-options-summary)
  - [Option Details](#option-details)
    - [`parallel` (boolean)](#parallel-boolean)
    - [`commands` (array of strings)](#commands-array-of-strings)
    - [`commandTimeout` (number)](#commandtimeout-number)
    - [`stopOnFail` (boolean)](#stoponfail-boolean)
    - [`errorCategories` (object)](#errorcategories-object)
  - [Example Configuration](#example-configuration)
  - [Example Error Categories](#example-error-categories)
- [Best Practices](#best-practices)
- [CI/CD Integration Examples](#cicd-integration-examples)
  - [GitHub Actions](#github-actions)
  - [GitLab CI](#gitlab-ci)
- [Troubleshooting](#troubleshooting)
- [Reusability Across Projects](#reusability-across-projects)

## Overview

The Wescode Code Quality Framework offers a **robust** solution for maintaining high code standards through automated checks and comprehensive reporting. Designed for flexibility, it adapts to diverse project types while ensuring consistent quality enforcement.

It automates essential code quality checks, ensuring adherence to formatting standards, linting rules, type safety, and successful builds via a unified script (`npm run cq`).

## Why Wescode?

While you can run individual checks like `npm run lint` or `npm run format` manually, Wescode provides several advantages:

- **Consolidation:** Executes multiple quality checks with a single command (`npm run cq`).
- **Control:** Offers options for sequential or parallel execution, timeouts, and early exit on failure.
- **Reporting:** Captures output from failed checks and presents a clear, consolidated summary.
- **Insight:** Categorizes common errors with custom suggestions, speeding up debugging.
- **Consistency:** Ensures the same quality gate is applied locally and in CI/CD pipelines.

## Key Features

- **Automated Checks:** Runs formatter, linter, type checker, and build commands (or any custom commands).
- **Flexible Execution:** Supports **sequential** and **parallel** execution of checks.
- **Consolidated Reporting:** Provides a clear summary of failed checks and their output.
- **Error Categorization:** Groups errors based on configurable regex patterns with custom suggestions.
- **Easy Integration:** Designed for simple setup and use in local development and CI pipelines.
- **Configurable:** Uses an optional `.code-quality.json` file for advanced customization.
- **Timeout Control:** Set maximum execution time per command.
- **Failure Control:** Option to stop sequential runs on the first failure (`stopOnFail`).

## Prerequisites

Before implementing the framework, ensure your development environment meets these requirements:

- **`Node.js`:** Required to run the script and associated tools.
- **Package Manager:** `npm`, `yarn`, `pnpm`, or `bun`.
- **Project-Specific Tools:** Your project must have its own chosen tools installed and configured for:
  - Formatting (e.g., Prettier)
  - Linting (e.g., ESLint)
  - Type Checking (e.g., TypeScript's `tsc`)
  - Building (e.g., Vite, Webpack, `tsc`)
  *(These are examples; use the tools relevant to your project.)*
- **Configured `package.json` Scripts:** The framework relies on scripts defined in your `package.json` (e.g., `npm run format`, `npm run lint`). Ensure these exist, are correctly configured for your project, and work independently.

## Setup Guide

Follow these steps to integrate the Code Quality Framework into your project:

### Step 1: Get the Framework Script

Place the core framework script (`main.js`) into a `.wescode` directory in your project root.

**Option A: Using `curl` (Recommended)**

```bash
# Create the directory if it doesn't exist
mkdir -p .wescode

# Download the script (ensure the URL points to the desired version/branch)
curl -o .wescode/main.js https://raw.githubusercontent.com/johnwesleyquintero/.wescode/main/.wescode/main.js
```

**Option B: Cloning/Copying**

If you have the .wescode repository cloned elsewhere, copy the `main.js` file into your project's `.wescode` directory.

### Step 2: Install Dependencies

The framework script requires the `chalk` package for colorful console output. Install it as a development dependency:

```bash
npm install --save-dev chalk
# or
yarn add --dev chalk
# or
pnpm add --save-dev chalk
# or
bun add --dev chalk
```

Ensure your project's specific formatter, linter, type checker, and build tool (e.g., prettier, eslint, typescript, vite) are also installed as development dependencies.

### Step 3: Configure `package.json`

Add the `cq` script to your `package.json` to run the framework. Also, ensure the scripts that `cq` will call (like `format`, `lint`, `typecheck`, `build`) are defined correctly for your project.

```json
{
  "scripts": {
    // --- YOUR PROJECT'S SPECIFIC COMMANDS (EXAMPLES) ---
    // Adapt these to match your tools and configurations!
    "format": "prettier --write . --ignore-unknown",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit",
    "build": "vite build",
    // --- END OF PROJECT-SPECIFIC COMMANDS ---

    // The framework execution script:
    "cq": "node .wescode/main.js"
  }
  // ... other package.json contents
}
```

**Important:** Adapt the `format`, `lint`, `typecheck`, and `build` script examples above to match your project's actual tools and desired configurations.

### Step 4: (Optional) Create Configuration File

For advanced customization (parallel execution, custom commands, error categorization, timeouts), create a file named `.code-quality.json` in your project root. If this file exists, the script will use its settings; otherwise, it uses the defaults defined within the script (see below).

See the [Configuration Details](#configuration-details-code-qualityjson) section for available options.

## Usage

Run the code quality checks using your package manager:

```bash
npm run cq
# or
yarn cq
# or
pnpm cq
# or
bun cq
```

The script will execute the configured checks (sequentially by default, or in parallel if configured) and report a summary of any failures.

## How it Works

1. **Configuration:** The script first looks for a `.code-quality.json` file in the project root. If found, it loads the configuration. If not found, or if specific settings are missing, it uses hardcoded defaults (e.g., sequential execution, default commands, default timeout).
2. **Execution:** It runs the specified commands either sequentially or in parallel based on the configuration.
3. **Output Capture:** For each command, it captures stdout and stderr.
4. **Status Tracking:** It logs the start, success, or failure (including duration) of each command. If a command fails, its name and output are stored.
5. **Timeout Handling:** If a command exceeds its configured `commandTimeout`, it's terminated, marked as failed due to timeout, and its output (if any) is captured.
6. **Error Categorization:** If `errorCategories` are defined in the config, the script attempts to match the output of failed commands against the defined regex patterns to assign a category and suggestion.
7. **Summary Report:** After all commands finish (or stop early if `stopOnFail` is true and a failure occurs in sequential mode), it prints a final status. If any command failed, it displays a detailed summary, grouping errors by category (if applicable) and showing the captured output (truncated in the summary for brevity) for each failed command.
8. **Exit Code:** Exits with code 0 on success and 1 on failure, making it suitable for CI environments.

## Configuration Details (`.code-quality.json`)

The optional `.code-quality.json` file allows fine-tuning the framework's behavior. Place this file in your project's root directory.

### Configuration Options Summary

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `parallel` | boolean | `false` | Run checks concurrently if `true`. |
| `commands` | array<string> | `['npm run format', 'npm run lint', 'npx tsc --noEmit', 'npm run build']` | List of exact commands to execute. Falls back to default if missing/empty. |
| `commandTimeout` | number | `300000` (5 minutes) | Default maximum execution time per command in milliseconds. |
| `stopOnFail` | boolean | `false` | In sequential mode (`parallel: false`), stop execution on the first failure. |
| `errorCategories` | object | `{}` | Rules for categorizing errors based on output patterns (regex). |

### Option Details

#### `parallel` (boolean)
- `true`: Run the commands concurrently. Faster on multi-core systems but console output might be interleaved, potentially making debugging harder during execution.
- `false` (Default): Run commands sequentially, one after the other. Easier to follow logs for individual steps.

#### `commands` (array of strings)
An array of the exact shell commands to execute. These should typically correspond to scripts in your `package.json` (e.g., `"npm run lint"`) or direct CLI calls (like `"npx tsc --noEmit"`).

If this array is missing, empty, or invalid in the `.code-quality.json` file, the script falls back to its hardcoded default command list: `['npm run format', 'npm run lint', 'npx tsc --noEmit', 'npm run build']`.

#### `commandTimeout` (number)
The default maximum time (in milliseconds) allowed for each command to run. If a command exceeds this duration, it will be terminated and marked as failed due to timeout. Default: `300000` (5 minutes).

#### `stopOnFail` (boolean)
Only applicable when `parallel` is `false`.

- `true`: If a command fails during sequential execution, the framework will stop immediately and not run any subsequent commands.
- `false` (Default): All commands will be run sequentially, even if earlier ones fail. The final report will list all failures.

#### `errorCategories` (object)
An object where each key is a custom category name (e.g., `"style"`, `"types"`, `"security"`). The value for each key is an object containing:

- `patterns` (array of strings): An array of JavaScript-compatible regular expression patterns (provided as strings). These patterns are tested against the combined stdout and stderr of a failed command.
  - Use standard regex syntax.
  - **Important:** Remember to escape backslashes within the JSON string. For example, a regex like `\d+` must be written as `"\\d+"` in the JSON file. Similarly, `\s*` becomes `"\\s*"`.
  - You can include flags like `/pattern/gi` directly in the string: `"/Type Error/i"`. If no flags are provided (e.g., `"eslint"`), matching defaults to case-insensitive (i).
- `suggestion` (string): A helpful message displayed in the summary report when an error matches one of the patterns in this category.

### Example Configuration

```json
{
  "parallel": true,
  "stopOnFail": false, // Note: Ignored because parallel is true
  "commandTimeout": 600000, // 10 minutes default timeout per command
  "commands": [
    "npm run format",
    "npm run lint -- --max-warnings=0", // Example: Pass specific args to lint script
    "npm run typecheck",
    "npm run build"
  ],
  "errorCategories": {
    "style": {
      "patterns": ["eslint", "prettier", "stylelint", "[Ss]tyle.*rule"],
      "suggestion": "Run formatters/linters (e.g., `npm run format`, `npm run lint`) and fix reported style issues."
    },
    "types": {
      "patterns": ["TS\\d+", "error TS", "[Tt]ype error:", "/Could not find a declaration file/i"],
      "suggestion": "Check TypeScript types, annotations, imports, and configurations (`tsconfig.json`)."
    },
    "build": {
      "patterns": ["build failed", "vite", "webpack", "[Cc]ompilation error"],
      "suggestion": "Review build configuration (e.g., `vite.config.js`) and resolve compilation errors."
    },
    "security": {
      "patterns": [
        "/security\\s*vulnerability/gi",
        "CVE-",
        "npm audit"
      ],
      "suggestion": "Run `npm audit fix` or manually review dependency vulnerabilities reported."
    }
  }
}
```

### Example Error Categories

```json
{
  "style": {
    "patterns": ["eslint", "prettier", "[Ss]tyle.*rule"],
    "suggestion": "Review code style guidelines and run formatting/linting tools."
  },
  "types": {
    "patterns": ["TS\\d+", "[Tt]ype.*error"],
    "suggestion": "Fix type inconsistencies, check interfaces/types, and ensure correct type annotations."
  },
  "build": {
    "patterns": ["build.*failed", "webpack", "vite", "[Cc]ompilation"],
    "suggestion": "Check build configuration (e.g., `vite.config.js`, `webpack.config.js`) and resolve compilation errors."
  },
  "testing": {
    "patterns": ["Test suite failed", "Jest", "Vitest", "\\d+ failed"],
    "suggestion": "Review failing tests, check test setup and assertions."
  }
}
```

## Best Practices

1. **Command Accuracy:** Ensure the commands listed in `package.json` (and potentially overridden in `.code-quality.json`) correctly invoke your project's tools with the desired flags (e.g., `eslint --max-warnings=0` to treat warnings as errors). Test each script individually first.
2. **Execution Mode:** Use `parallel: true` in CI for potential speed gains on multi-core runners. Consider `parallel: false` (default) for local development if interleaved output is confusing.
3. **Timeouts:** Set a reasonable `commandTimeout` in `.code-quality.json` (e.g., 5-15 minutes) to prevent stalled jobs in CI, adjusting based on your project's typical build/check times.
4. **Error Categories:** Define specific categories relevant to your project (e.g., accessibility, security, testing). Use precise regex patterns and provide actionable suggestion messages. Test your regex patterns against actual error output.
5. **CI Integration:** Use the `npm run cq` command as a dedicated step in your CI pipeline (GitHub Actions, GitLab CI, etc.) to enforce quality checks automatically on pushes or pull requests. Use `npm ci` for installing dependencies in CI.
6. **Keep Script Updated:** Periodically check the source repository for updates to the `main.js` script to benefit from bug fixes or new features. Use the `curl` command or update manually.

## CI/CD Integration Examples

### GitHub Actions

```yaml
# .github/workflows/code-quality.yml
name: Code Quality Checks

on: [push, pull_request]

jobs:
  code-quality:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v4

    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20' # Use your project's required Node version
        cache: 'npm' # Or 'yarn', 'pnpm', 'bun'

    - name: Install Dependencies
      # Use 'ci' for faster, deterministic installs in CI environments
      run: npm ci

    - name: Run Code Quality Checks
      # Executes the framework script defined as "cq" in package.json
      run: npm run cq
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - quality

code_quality_check:
  stage: quality
  image: node:20 # Use your project's required Node version
  cache:
    # Cache node_modules based on the branch/commit ref slug
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
  script:
    # Use 'ci' for faster, deterministic installs in CI environments
    - npm ci
    # Executes the framework script defined as "cq" in package.json
    - npm run cq
  # Optional: Define artifacts if your script generates report files
  # artifacts:
  #   when: always
  #   paths:
  #     - code-quality-report.json # Example path
  #   expire_in: 1 week
```

## Troubleshooting

**Command Not Found:**
- Ensure the commands listed in `package.json` scripts (e.g., `lint`, `format`) or `.code-quality.json` (`commands` array) are spelled correctly.
- Verify that the corresponding tools (ESLint, Prettier, TSC, Vite, etc.) are installed as dev dependencies (`npm install` or `npm ci`).
- Check that the individual scripts run correctly on their own (e.g., `npm run lint`).
- Ensure `node .wescode/main.js` is correctly specified in the `cq` script in `package.json`.

**Parallel Issues:** If `parallel: true` causes unexpected behavior or race conditions (rare, but possible with some tools), switch to `parallel: false` for debugging and see if the issue persists.

**Timeout Failures:** If commands consistently time out:
- Increase the `commandTimeout` value in `.code-quality.json`.
- Investigate why the specific command is taking so long (e.g., linting too many files, complex build process). Optimize the underlying task if possible.

**Regex Errors:** Look for warnings in the console output like `! Invalid regex pattern "..."`. Ensure patterns in `errorCategories` are valid JavaScript regex strings. Remember to escape special characters like backslashes (`\`) within the JSON string (e.g., use `"\\d+"` for `\d+`, `"\\s*"` for `\s*`).

**Categorization Not Working:**
- Verify that the regex patterns accurately match the error messages produced by your tools. Copy the exact error output from the failed command log.
- Test your patterns using online regex testers against the actual error output.
- Remember matching is case-insensitive by default unless flags like `/pattern/g` are used in the pattern string (e.g., `"/CaseSensitive/g"`).

## Reusability Across Projects

This framework is designed as a portable quality gate.

- **Core Logic:** `.wescode/main.js` contains the reusable execution and reporting logic. It can be shared or version-controlled separately (e.g., in its own repository or as a submodule).
- **Project Configuration:** `.code-quality.json` allows project-specific overrides for commands, timeouts, parallel execution, and error categorization.
- **Task Definition:** `package.json` scripts define the `cq` entry point and the underlying project-specific tasks (`format`, `lint`, etc.).

You can maintain the `.wescode/main.js` script centrally and distribute it to projects (e.g., via `curl` during setup), while each project tailors its quality checks via `.code-quality.json` and its own `package.json` scripts.
