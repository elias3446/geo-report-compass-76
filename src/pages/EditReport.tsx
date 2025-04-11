
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ReportForm from "@/components/reports/ReportForm";
import { getReports } from "@/services/reportService";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimeFilterProvider } from "@/context/TimeFilterContext";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const reports = getReports();
      const foundReport = reports.find(r => r.id === parseInt(id));
      setReport(foundReport || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-96">
          <p>Loading report details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!report) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold">Report Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The report you're trying to edit doesn't exist or has been removed.
          </p>
          <Button
            className="mt-6"
            onClick={() => navigate("/reports")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => navigate(`/reports/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Report
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Report</h1>
        <p className="text-muted-foreground mt-1">
          Update the details of this report
        </p>
      </div>
      <TimeFilterProvider>
        <ReportForm isEditing={true} initialData={report} />
      </TimeFilterProvider>
    </AppLayout>
  );
};

export default EditReport;
