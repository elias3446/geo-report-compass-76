
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "@/services/reportService";
import { useActivityList } from "@/hooks/useActivityList";
import { ActivityItem } from "./ActivityItem";

interface ActivityListProps {
  activities?: Activity[];
}

const ActivitySkeletons = () => (
  <>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="flex items-start space-x-4 p-4 border rounded-md">
        <Skeleton className="h-5 w-5 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </>
);

const ActivityList: React.FC<ActivityListProps> = ({ activities: propActivities }) => {
  const { activities } = useActivityList(propActivities);

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
            {activities.length > 0 
              ? activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              : <ActivitySkeletons />
            }
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityList;

