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

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <UserProvider>
            <ReportProvider>
              <TimeFilterProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/reports/:id" element={<ReportDetail />} />
                  <Route path="/reports/:id/edit" element={<EditReport />} />
                  <Route path="/new-report" element={<NewReport />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users/:id" element={<UserDetail />} />
                  <Route path="/categories/:id" element={<CategoryDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TimeFilterProvider>
            </ReportProvider>
          </UserProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
