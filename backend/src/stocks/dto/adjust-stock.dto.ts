import { z } from 'zod';

export const AdjustStockSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  locationId: z.string().uuid('Invalid location ID'),
  quantityOriginal: z.number().int().optional(), // For optimistic locking if needed
  quantityChange: z
    .number()
    .int()
    .min(-100000, 'Quantity change is too small')
    .max(100000, 'Quantity change is too large')
    .refine((n) => n !== 0, 'Quantity change cannot be zero'), // positive to add, negative to remove
  reason: z
    .string()
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must be at most 500 characters'),
});

export type AdjustStockDto = z.infer<typeof AdjustStockSchema>;
