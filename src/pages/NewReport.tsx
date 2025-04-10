
import AppLayout from "@/components/layout/AppLayout";
import ReportForm from "@/components/reports/ReportForm";

const NewReport = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Report</h1>
        <p className="text-muted-foreground mt-1">
          Submit a new issue or problem that needs attention
        </p>
      </div>
      <ReportForm />
    </AppLayout>
  );
};

export default NewReport;
