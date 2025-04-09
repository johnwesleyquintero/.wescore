import { ConfigSchema } from '../../config/schema.js';

describe('Configuration Schema Validation', () => {
  test('should validate minimal valid configuration', async () => {
    const validConfig = {
      commands: [{ name: 'lint', command: 'npm run lint' }],
      reporters: ['console'],
    };
    await expect(ConfigSchema.parseAsync(validConfig)).resolves.toBeDefined();
  });

  test('should reject missing commands array', async () => {
    const invalidConfig = { reporters: ['console'] };
    await expect(ConfigSchema.parseAsync(invalidConfig)).rejects.toThrow('commands');
  });

  test('should validate error categories with regex patterns', async () => {
    const configWithErrors = {
      commands: [{ name: 'build', command: 'npm run build' }],
      reporters: ['json'],
      errorCategories: {
        'dependency-error': {
          patterns: ["/^Error: Cannot find module '.+'$/"],
          severity: 'critical',
        },
      },
    };
    await expect(ConfigSchema.parseAsync(configWithErrors)).resolves.toBeDefined();
  });
});
