import { z } from 'zod/v4';

export const ResetPasswordSchema = z.object({
  email: z.email(),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, 
      'Password must include uppercase, lowercase, number and special character',
    ),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
