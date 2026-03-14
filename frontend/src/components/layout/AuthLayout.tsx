import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function AuthLayout() {
  const { user, loading } = useAuth();

  // If loading, you could show a spinner here
  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-gray-50"
        aria-busy="true"
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 border-t-transparent"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Outlet />
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/auth-bg.svg"
          alt="Inventory Background"
          onError={(event) => {
            event.currentTarget.src = '/images/auth-bg-fallback.svg';
          }}
        />
      </div>
    </div>
  );
}
