import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
