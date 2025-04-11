
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ReportList from "@/components/reports/ReportList";
import { TimeFilterProvider } from "@/context/TimeFilterContext";

const Reports = () => {
  const [key, setKey] = useState(0);

  // Force refresh when navigating to this page
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, []);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reports Management</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all submitted reports
        </p>
      </div>
      <TimeFilterProvider>
        <ReportList key={key} />
      </TimeFilterProvider>
    </AppLayout>
  );
};

export default Reports;
