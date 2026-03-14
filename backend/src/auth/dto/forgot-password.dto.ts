import { z } from 'zod/v4';

export const ForgotPasswordSchema = z.object({
  email: z.email(),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;
