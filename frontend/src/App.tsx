import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./contexts/BookingContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import BookingForm from "./pages/BookingForm";
import GuestsList from "./pages/GuestsList";
import CheckStatus from "./pages/CheckStatus";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Debug } from "./components/Debug";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BookingProvider>
          <Toaster />
          <Sonner position="top-right" />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <Debug />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/booking" element={<BookingForm />} />
                  <Route path="/check-status" element={<CheckStatus />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/guests" element={
                    <ProtectedRoute requireAdmin>
                      <GuestsList />
                    </ProtectedRoute>
                  } />
                  <Route path="/bookings" element={
                    <ProtectedRoute requireAdmin>
                      <GuestsList />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
