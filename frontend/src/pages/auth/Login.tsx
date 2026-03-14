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
  const { login, loginWithGoogle } = useAuth();
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
    <div className="animate-fade-in">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Welcome Back</p>
      <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-slate-900 text-balance dark:text-slate-100">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Not a member?{' '}
        <Link
          to="/register"
          className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100"
        >
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
                className={
                  errors.email
                    ? 'skeuo-input border-red-500 focus-visible:ring-red-500'
                    : 'skeuo-input'
                }
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <div className="text-sm leading-6">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-100"
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
                className={
                  errors.password
                    ? 'skeuo-input border-red-500 focus-visible:ring-red-500'
                    : 'skeuo-input'
                }
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="skeuo-btn h-11 w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="skeuo-btn-outline h-11 w-full cursor-pointer"
            onClick={() => void loginWithGoogle()}
          >
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
