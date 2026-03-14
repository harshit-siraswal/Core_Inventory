import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isAxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, 
      'Password must include uppercase, lowercase, number and special character',
    ),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Registration successful. Please log in.');
      navigate('/login');
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? String(error.response?.data?.message ?? 'Failed to register')
        : 'Failed to register';
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Create a new account
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign in here
        </Link>
      </p>

      <div className="mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="mt-2">
              <Input
                id="name"
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                {...register('name')}
                className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email address</Label>
            <div className="mt-2">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-2">
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
                className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
