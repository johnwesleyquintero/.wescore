import chalk from 'chalk';

export function categorizeError(output, errorCategories) {
  if (!output || typeof errorCategories !== 'object') return {};

  const matches = [];

  for (const [categoryName, category] of Object.entries(errorCategories)) {
    for (const pattern of category?.patterns || []) {
      try {
        const regexParts = pattern.match(/^\/(.*)\/([gimuy]*)$/);
        if (!regexParts) {
          console.warn(
            chalk.yellow(`Invalid regex format: ${pattern}. Should be in /pattern/flags format`)
          );
          continue;
        }

        const regex = new RegExp(regexParts[1], regexParts[2]);
        if (regex.test(output)) {
          matches.push({
            category: categoryName,
            severity: category.severity || 'error',
            suggestion: category.suggestion,
            pattern: regex,
          });
        }
      } catch (e) {
        console.warn(chalk.yellow(`Error processing pattern '${pattern}': ${e.message}`));
      }
    }
  }

  if (matches.length > 0) {
    const exactMatch = matches.find(m => m.pattern.test(output)) || matches[0];
    return {
      category: exactMatch.category,
      severity: exactMatch.severity,
      suggestion: exactMatch.suggestion,
    };
  }

  return {};
}
