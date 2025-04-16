
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import NewReport from "./pages/NewReport";
import ReportDetail from "./pages/ReportDetail";
import EditReport from "./pages/EditReport";
import MapPage from "./pages/MapView";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import { ReportProvider } from "./contexts/ReportContext";
import { TimeFilterProvider } from "./context/TimeFilterContext";
import { AuthProvider } from "./hooks/useAuth";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/auth/PrivateRoute";

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ReportProvider>
              <TimeFilterProvider>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
                  <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                  <Route path="/reports/:id" element={<PrivateRoute><ReportDetail /></PrivateRoute>} />
                  <Route path="/reports/:id/edit" element={<PrivateRoute><EditReport /></PrivateRoute>} />
                  <Route path="/new-report" element={<PrivateRoute><NewReport /></PrivateRoute>} />
                  <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
                  <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TimeFilterProvider>
            </ReportProvider>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
