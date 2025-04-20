import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, User, Edit, AlertCircle } from "lucide-react";
import { getReports, updateReport, getActivitiesByReportId } from "@/services/reportService";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import SingleReportMap from "@/components/map/ui/SingleReportMap";
import type { Report, Activity } from "@/services/reportService";
import { getUserById } from "@/services/adminService";

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const reports = getReports();
      const foundReport = reports.find(r => r.id === parseInt(id));
      setReport(foundReport || null);
      
      if (foundReport) {
        const reportActivities = getActivitiesByReportId(foundReport.id);
        setActivities(reportActivities);
      }
      
      setLoading(false);
    }
  }, [id]);

  const handleStatusChange = (newStatus: string) => {
    if (!report) return;
    
    const updatedReport = updateReport(report.id, { status: newStatus });
    if (updatedReport) {
      setReport(updatedReport);
      
      const updatedActivities = getActivitiesByReportId(report.id);
      setActivities(updatedActivities);
      
      toast.success(`Report status updated to ${newStatus}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "report_created":
        return "border-green-500";
      case "report_updated":
        return "border-blue-500";
      case "report_resolved":
        return "border-purple-500";
      case "report_assigned":
        return "border-orange-500";
      case "priority_changed":
        return "border-red-500";
      case "category_changed":
        return "border-yellow-500";
      case "location_changed":
        return "border-teal-500";
      default:
        return "border-gray-500";
    }
  };

  const getAssignedUserName = (userId: string | undefined): string => {
    if (!userId) return "No asignado";
    const user = getUserById(userId);
    return user ? user.name : "No asignado";
  };

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
            The report you're looking for doesn't exist or has been removed.
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
          onClick={() => navigate("/reports")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">{report?.title}</h1>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <Badge 
              variant="outline" 
              className={getStatusColor(report?.status || "")}
            >
              {report?.status}
            </Badge>
            <Badge 
              variant="outline" 
              className={getPriorityColor(report?.priority || "")}
            >
              {report?.priority} Priority
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>
              Complete information about this report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground mt-1">
                {report.description || "No description provided."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground">{report.location}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Reported On</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(report.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Assigned To</h4>
                  <p className="text-sm text-muted-foreground">
                    {getAssignedUserName(report.assignedTo)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Category</h4>
                  <p className="text-sm text-muted-foreground">{report.category}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => navigate(`/reports/${report.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Report
            </Button>
            
            <div className="space-x-2">
              {report.status !== "Open" && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange("Open")}
                >
                  Reopen
                </Button>
              )}
              
              {report.status !== "In Progress" && report.status !== "Resolved" && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange("In Progress")}
                >
                  Mark In Progress
                </Button>
              )}
              
              {report.status !== "Resolved" && (
                <Button
                  variant="default"
                  onClick={() => handleStatusChange("Resolved")}
                >
                  Mark Resolved
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px] pr-4">
                <div className="space-y-3">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className={`border-l-2 pl-4 py-1 ${getActivityColor(activity.type)}`}
                      >
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.createdAt)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No activity recorded for this report.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Report Location</CardTitle>
              <CardDescription>
                Geographic location of this report
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {report && (
                <SingleReportMap
                  reportTitle={report.title}
                  reportStatus={report.status}
                  reportLocation={report.location}
                  height="250px"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportDetail;
