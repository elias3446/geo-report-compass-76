
import React from 'react';
import { useParams } from 'react-router-dom';
import { useReports } from '@/contexts/ReportContext';
import ReportForm from '@/components/ReportForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TimeFilterProvider } from "@/context/TimeFilterContext";

const ReportFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getReportById } = useReports();
  const navigate = useNavigate();
  
  const isEditMode = !!id;
  const report = isEditMode ? getReportById(id) : null;

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/reports')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Report' : 'Create New Report'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? `Editing: ${report?.title || 'Report'}`
              : 'Fill in the details to create a new geographic report'}
          </p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border p-6">
        <TimeFilterProvider>
          <ReportForm />
        </TimeFilterProvider>
      </div>
    </div>
  );
};

export default ReportFormPage;
