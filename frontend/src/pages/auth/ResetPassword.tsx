import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isAxiosError } from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, 
      'Password must include uppercase, lowercase, number and special character',
    ),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultEmail = location.state?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: defaultEmail,
      otp: '',
    },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await api.post('/auth/reset-password', data);
      toast.success('Password has been reset successfully. Please log in.');
      navigate('/login');
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? String(error.response?.data?.message ?? 'Failed to reset password')
        : 'Failed to reset password';
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Enter new password
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        Check your email for the 6-digit OTP code.
      </p>

      <div className="mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-2">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="otp">6-Digit OTP</Label>
            <div className="mt-2">
              <Input
                id="otp"
                type="text"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                {...register('otp')}
                className={errors.otp ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="mt-2">
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...register('newPassword')}
                className={errors.newPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting password...' : 'Reset password'}
          </Button>
          
          <div className="text-center mt-4">
            <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
