
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin, 
  Users,
  Edit,
  Eye
} from "lucide-react";
import { Activity } from "@/services/reportService";

interface ActivityListProps {
  activities: Activity[];
}

const ActivityList = ({ activities }: ActivityListProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "report_created":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "report_updated":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "report_resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "report_assigned":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "priority_changed":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "category_changed":
        return <Edit className="h-4 w-4 text-indigo-500" />;
      case "location_changed":
        return <MapPin className="h-4 w-4 text-pink-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and submitted reports
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            Real-time updates
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <Alert key={activity.id} variant="default" className="transition-all duration-300 animate-in fade-in">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <AlertTitle className="text-sm font-medium">
                        {activity.title}
                      </AlertTitle>
                      <AlertDescription className="text-xs mt-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span>{activity.description}</span>
                          <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                            <span className="text-muted-foreground">
                              {activity.time}
                            </span>
                            <Link 
                              to={`/reports/${activity.relatedReportId}`} 
                              className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              <span className="text-xs">View</span>
                            </Link>
                          </div>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-md">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityList;
