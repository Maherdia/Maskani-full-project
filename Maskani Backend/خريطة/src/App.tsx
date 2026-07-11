import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-provider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { initNavigate } from "@/lib/navigation";
import Index from "./pages/Index";
import Apartments from "./pages/Apartments";
import DormDetailsPage from './pages/DormDetailsPage';
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Booking from "./pages/Booking";
import StudentRegistrationPage from "./pages/StudentRegistrationPage";
import UserAccountEdit from "./pages/UserAccountEdit";
import RoomsPage from "./pages/RoomsPage";
import OwnerBookings from './pages/OwnerBookings';
import MapPage from './pages/MapPage';
import 'leaflet/dist/leaflet.css';
import DormClientPage from './pages/DormClientPage';
import StudentBooking from './pages/StudentBooking';

const AppWithNavigation = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    initNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/rooms" element={<RoomsPage />} />
      <Route path="/bookings/owner/:ownerId" element={<OwnerBookings />} />
      <Route path="/apartments" element={<Apartments />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/students/add" element={<StudentRegistrationPage />} />
      <Route path="/booking/:dormId" element={<Booking />} />
      <Route path="/student-booking/:bookingId" element={<StudentBooking />} />
      <Route path="/my-bookings" element={
        <ProtectedRoute allowedRoles={['Student']}>
          <OwnerBookings />
        </ProtectedRoute>
      } />
      <Route path="/account/edit" element={<UserAccountEdit />} />
      <Route 
        path="/owner-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['Owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'User']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/dorms" element={<DormClientPage />} />
      <Route path="/dorms/:dormId" element={<DormDetailsPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <AppWithNavigation />
            <Toaster />
            <Sonner />
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App; 