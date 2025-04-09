import { z } from 'zod';

export const ConfigSchema = z.object({
  commands: z.array(
    z.object({
      name: z.string().min(1, 'Command name required'),
      command: z.string().min(1, 'Command string required'),
      args: z.array(z.string()).optional(),
      timeout: z.number().int().positive().optional(),
      retries: z.number().int().min(0).optional(),
    }).strict()
  ).min(1, 'At least one command required'),
  errorCategories: z.record(
    z.object({
      patterns: z.array(z.string().regex(/^\/(.*)\/[gimuy]*$/, 'Invalid regex pattern')).min(1)),
      suggestion: z.string().optional(),
      severity: z.enum(['warning', 'error', 'critical']).default('error')
    }).strict()
  ).optional(),
  reporters: z.array(
    z.enum(['console', 'json', 'html'])
  ).nonempty('At least one reporter required')
}).strict();
