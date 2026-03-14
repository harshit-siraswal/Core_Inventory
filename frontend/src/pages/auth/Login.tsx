import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isAxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface AuthResponse {
  data: {
    accessToken: string;
  };
}

export function Login() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      await login(response.data.data.accessToken);
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? String(error.response?.data?.message ?? 'Failed to login')
        : 'Failed to login';
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        Not a member?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Create an account
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

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <div className="text-sm leading-6">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
