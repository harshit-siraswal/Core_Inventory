import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      const response = await api.post<{ data?: { resetFlowInitiated?: boolean } }>(
        '/auth/forgot-password',
        data,
      );
      toast.success('If an account exists, a reset link has been sent to your email.');

      const devAutoRedirect = import.meta.env.DEV;
      const resetFlowInitiated = response.data?.data?.resetFlowInitiated === true;
      if (devAutoRedirect || resetFlowInitiated) {
        navigate('/reset-password');
      }
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? String(error.response?.data?.message ?? 'Failed to request password reset')
        : 'Failed to request password reset';
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Reset your password
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign in instead
        </Link>
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending instructions...' : 'Send reset instructions'}
          </Button>
        </form>
      </div>
    </div>
  );
}
