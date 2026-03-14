import { z } from 'zod';
import { LOCATION_STATUSES, LOCATION_TYPES } from './location.constants';

export const UpdateLocationSchema = z.object({
  code: z
    .string()
    .min(1, 'Code must not be empty when provided')
    .max(50)
    .optional(),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  type: z.enum(LOCATION_TYPES).optional(),
  status: z.enum(LOCATION_STATUSES).optional(),
});

export type UpdateLocationDto = z.infer<typeof UpdateLocationSchema>;
