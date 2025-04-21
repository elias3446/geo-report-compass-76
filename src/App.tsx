
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ReportProvider } from "./contexts/ReportContext";
import { TimeFilterProvider } from "./context/TimeFilterContext";
import { UserProvider } from "./contexts/UserContext";
import Index from "./pages/Index";
import Reports from "./pages/Reports";
import NewReport from "./pages/NewReport";
import ReportDetail from "./pages/ReportDetail";
import EditReport from "./pages/EditReport";
import MapPage from "./pages/MapView";
import Admin from "./pages/Admin";
import Help from "./pages/Help";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import UserDetail from "./pages/UserDetail";
import CategoryDetail from "./pages/CategoryDetail";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <UserProvider>
              <ReportProvider>
                <TimeFilterProvider>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<NotFound />} />
                    <Route
                      path="/"
                      element={
                        <PrivateRoute>
                          <Index />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <PrivateRoute>
                          <Reports />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/reports/:id"
                      element={
                        <PrivateRoute>
                          <ReportDetail />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/reports/:id/edit"
                      element={
                        <PrivateRoute>
                          <EditReport />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/new-report"
                      element={
                        <PrivateRoute>
                          <NewReport />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/map"
                      element={
                        <PrivateRoute>
                          <MapPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <PrivateRoute>
                          <Admin />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/help"
                      element={
                        <PrivateRoute>
                          <Help />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <PrivateRoute>
                          <SettingsPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/users/:id"
                      element={
                        <PrivateRoute>
                          <UserDetail />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/categories/:id"
                      element={
                        <PrivateRoute>
                          <CategoryDetail />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </TimeFilterProvider>
              </ReportProvider>
            </UserProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
