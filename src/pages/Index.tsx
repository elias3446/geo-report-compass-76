
import AppLayout from "@/components/layout/AppLayout";
import DashboardView from "@/components/dashboard/DashboardView";
import { TimeFilterProvider } from "@/context/TimeFilterContext";

const Index = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of reports and analytics
        </p>
      </div>
      <TimeFilterProvider>
        <DashboardView />
      </TimeFilterProvider>
    </AppLayout>
  );
};

export default Index;
