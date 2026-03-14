import { z } from 'zod/v4';

export const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
