import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import StockPage from "@/pages/StockPage";
import ProductsPage from "@/pages/ProductsPage";
import WarehousePage from "@/pages/WarehousePage";
import LocationsPage from "@/pages/LocationsPage";
import ReceiptsPage from "@/pages/ReceiptsPage";
import DeliveryPage from "@/pages/DeliveryPage";
import MoveHistoryPage from "@/pages/MoveHistoryPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/warehouse" element={<WarehousePage />} />
                <Route path="/locations" element={<LocationsPage />} />
                <Route path="/receipts" element={<ReceiptsPage />} />
                <Route path="/delivery" element={<DeliveryPage />} />
                <Route path="/move-history" element={<MoveHistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
