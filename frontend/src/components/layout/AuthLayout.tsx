import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function AuthLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

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
    <div className="relative flex min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(1000px circle at 0% -20%, rgba(245, 208, 114, 0.32), transparent 56%), radial-gradient(1000px circle at 100% 10%, rgba(120, 142, 175, 0.26), transparent 46%)',
        }}
      />
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={toggleTheme}
          className="skeuo-toggle inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium"
        >
          <span>{isDark ? 'Dark' : 'Light'}</span>
          <span aria-hidden="true">{isDark ? 'Moon' : 'Sun'}</span>
        </button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-10">
        <div
          className={
            isLoginPage
              ? 'skeuo-shell mx-auto w-full max-w-5xl overflow-hidden p-3 lg:grid lg:grid-cols-[1fr_360px] lg:gap-3'
              : 'skeuo-shell mx-auto w-full max-w-sm p-6 lg:w-96'
          }
        >
          {isLoginPage && (
            <div
              className="skeuo-hero relative hidden overflow-hidden rounded-2xl border p-6 text-white lg:block"
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
                const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
                setOffset({ x, y });
              }}
              onMouseLeave={() => setOffset({ x: 0, y: 0 })}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(245,208,114,0.5),transparent_45%),radial-gradient(circle_at_90%_85%,rgba(148,163,184,0.35),transparent_40%)]" />

              <svg
                viewBox="0 0 320 320"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="flowA" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
                    <stop offset="100%" stopColor="rgba(245,208,114,0.85)" />
                  </linearGradient>
                  <linearGradient id="flowB" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(148,163,184,0.28)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.24)" />
                  </linearGradient>
                </defs>

                <g
                  style={{ transform: `translate(${offset.x * 0.25}px, ${offset.y * 0.25}px)` }}
                >
                  <circle cx="62" cy="68" r="44" fill="url(#flowA)" opacity="0.85" />
                  <circle cx="250" cy="86" r="56" fill="url(#flowB)" opacity="0.9" />
                </g>

                <g
                  style={{ transform: `translate(${offset.x * -0.35}px, ${offset.y * -0.35}px)` }}
                >
                  <path
                    d="M40 225C90 170 145 150 220 180C265 198 286 232 294 278"
                    stroke="rgba(255,255,255,0.92)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M36 250C90 196 160 190 234 220"
                    stroke="rgba(245,208,114,0.88)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              </svg>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center gap-2">
                  <img src="/assets/source-icon.svg" alt="Core logo" className="h-7 w-7" />
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Core Inventory</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold leading-tight text-balance">
                    Track products, stock, and movement in one focused workspace.
                  </p>
                  <p className="mt-3 text-sm text-slate-300">
                    Fast prototype mode with clear hierarchy, stronger contrast, and motion-guided onboarding.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={isLoginPage ? 'p-3 sm:p-6' : ''}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
