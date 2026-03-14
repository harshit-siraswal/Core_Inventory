import { z } from 'zod';
import { LOCATION_TYPES } from './location.constants';

export const CreateLocationSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  type: z.enum(LOCATION_TYPES),
});

export type CreateLocationDto = z.infer<typeof CreateLocationSchema>;
