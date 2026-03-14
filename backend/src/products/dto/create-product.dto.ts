import { z } from 'zod';

export const CreateProductSchema = z.object({
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(64, 'SKU must be at most 64 characters'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be at most 255 characters'),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  minStockLevel: z.number().int().min(0).default(0),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
