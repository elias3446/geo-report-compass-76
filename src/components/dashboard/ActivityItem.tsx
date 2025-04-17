
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { ActivityIcon } from "./ActivityIcon";
import { UnifiedActivity } from "@/hooks/useActivityList";

interface ActivityItemProps {
  activity: UnifiedActivity;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <Alert variant="default" className="transition-all duration-300 animate-in fade-in">
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">
          <ActivityIcon type={activity.type} />
        </div>
        <div className="flex-1">
          <AlertTitle className="text-sm font-medium">
            {activity.title}
            {activity.user && (
              <Badge variant="outline" className="ml-2 text-xs">
                {activity.user}
              </Badge>
            )}
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span>{activity.description}</span>
              <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                <span className="text-muted-foreground">
                  {activity.time}
                </span>
                {activity.relatedReportId && (
                  <Link 
                    to={`/reports/${activity.relatedReportId}`} 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    <span className="text-xs">View</span>
                  </Link>
                )}
              </div>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

