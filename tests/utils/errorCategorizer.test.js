import { categorizeError } from '../../utils/errorCategorizer.js';

describe('Error Categorization', () => {
  const errorCategories = {
    'Dependency Issue': {
      patterns: ['/^Error: Cannot find module \'.+\'$/'],
      suggestion: 'Run `npm install`',
      severity: 'critical'
    },
    'Syntax Error': {
      patterns: ['/SyntaxError: .*/'],
      severity: 'error'
    }
  };

  test('should match valid regex patterns', () => {
    const output = 'Error: Cannot find module 'lodash'\nRequire stack:';
    const result = categorizeError(output, errorCategories);
    expect(result).toEqual({
      category: 'Dependency Issue',
      severity: 'critical',
      suggestion: 'Run `npm install`'
    });
  });

  test('should handle invalid regex formats', () => {
    const output = 'SyntaxError: Unexpected token';
    const invalidCategories = {
      'Bad Pattern': {
        patterns: ['missing(regex/delimiters']
      }
    };
    const result = categorizeError(output, invalidCategories);
    expect(result).toEqual({});
  });

  test('should return highest severity match', () => {
    const output = 'SyntaxError: Unexpected token\nError: Cannot find module'; 
    const result = categorizeError(output, errorCategories);
    expect(result.severity).toBe('critical');
  });
});