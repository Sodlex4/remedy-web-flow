
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { BusinessProvider } from "@/context/BusinessContext";
import { LocationProvider } from "@/context/LocationContext";
import Index from "./pages/Index";
import RequestPickup from "./pages/RequestPickup";
import StrainSearch from "./pages/StrainSearch";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PickupCalendar from "./pages/PickupCalendar";
import AdminMessages from "./pages/AdminMessages";
import AdminRatings from "./pages/AdminRatings";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BusinessProvider>
          <LocationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<StrainSearch />} />
              <Route path="/request-pickup" element={<RequestPickup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/calendar" element={<PickupCalendar />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/ratings" element={<AdminRatings />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </LocationProvider>
        </BusinessProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
