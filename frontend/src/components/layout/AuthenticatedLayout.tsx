import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { Package, Boxes, Warehouse, ArrowLeftRight, User, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Package },
  { to: '/products', label: 'Products', icon: Boxes },
  { to: '/categories', label: 'Categories', icon: Boxes },
  { to: '/locations', label: 'Warehouses & Locations', icon: Warehouse },
  { to: '/receipts', label: 'Receipts', icon: ArrowLeftRight },
  { to: '/deliveries', label: 'Deliveries', icon: ArrowLeftRight },
  { to: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { to: '/adjustments', label: 'Adjustments', icon: ArrowLeftRight },
  { to: '/history', label: 'Move History', icon: ArrowLeftRight },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/alerts', label: 'Low-Stock Alerts', icon: Bell },
];

export function AuthenticatedLayout() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-r bg-white p-4">
          <div className="mb-6 rounded-lg bg-slate-900 p-4 text-white">
            <p className="text-xs uppercase tracking-wide text-slate-300">Core Inventory</p>
            <p className="mt-2 text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-300">{user.role}</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <Button className="mt-6 w-full" variant="outline" onClick={logout}>
            Logout
          </Button>
        </aside>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
