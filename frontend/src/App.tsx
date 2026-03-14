import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'sonner';

import { AuthLayout } from './components/layout/AuthLayout';
import { AuthenticatedLayout } from './components/layout/AuthenticatedLayout';

import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

// Features - Dashboard
import { DashboardView } from './features/dashboard/views/DashboardView';

// Features - Inventory
import { CategoriesView } from './features/inventory/views/CategoriesView';
import { ProductsView } from './features/inventory/views/ProductsView';
import { LocationsView } from './features/inventory/views/LocationsView';
import { CreateProductView } from './features/inventory/views/CreateProductView';
import { EditProductView } from './features/inventory/views/EditProductView';

// Features - Operations (Mocks)
import { AdjustmentsView } from './features/operations/views/AdjustmentsView';
import { InternalTransfersView } from './features/operations/views/InternalTransfersView';
import { DeliveriesView } from './features/operations/views/DeliveriesView';
import { ReceiptsView } from './features/operations/views/ReceiptsView';
import { MovementHistoryView } from './features/operations/views/MovementHistoryView';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route path="/" element={<AuthenticatedLayout />}>
            <Route index element={<DashboardView />} />

            {/* Master Data */}
            <Route path="products" element={<ProductsView />} />
            <Route path="products/new" element={<CreateProductView />} />
            <Route path="products/:id/edit" element={<EditProductView />} />
            
            <Route path="categories" element={<CategoriesView />} />
            <Route path="locations" element={<LocationsView />} />

            {/* Operations placeholders */}
            <Route path="adjustments" element={<AdjustmentsView />} />
            <Route path="transfers" element={<InternalTransfersView />} />
            <Route path="deliveries" element={<DeliveriesView />} />
            <Route path="receipts" element={<ReceiptsView />} />
            <Route path="history" element={<MovementHistoryView />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
