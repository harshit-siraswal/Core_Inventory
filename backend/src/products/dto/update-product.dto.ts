import { z } from 'zod';

export const UpdateProductSchema = z.object({
  sku: z
    .string()
    .min(1, 'SKU must not be empty')
    .max(64, 'SKU must be at most 64 characters')
    .optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be at most 255 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  minStockLevel: z.number().int().min(0).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']).optional(),
});

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
