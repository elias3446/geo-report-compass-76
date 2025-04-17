
import { useState, useEffect } from 'react';
import { Activity } from "@/services/reportService";
import { getAllActivities } from "@/services/reportService";
import { getAdminActivities, formatAdminActivityForDashboard } from "@/services/activityService";
import { AdminActivity } from "@/services/activityService";

export type UnifiedActivity = {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  relatedReportId?: string;
  user?: string;
};

export const useActivityList = (propActivities?: Activity[]) => {
  const [activities, setActivities] = useState<UnifiedActivity[]>([]);
  
  const combineActivities = () => {
    const regularActivities: UnifiedActivity[] = propActivities?.map(activity => ({
      ...activity,
      id: activity.id.toString(),
      relatedReportId: activity.relatedReportId?.toString()
    })) || getAllActivities().map(activity => ({
      ...activity,
      id: activity.id.toString(),
      relatedReportId: activity.relatedReportId?.toString()
    }));
    
    const adminActivities: UnifiedActivity[] = getAdminActivities().map(formatAdminActivityForDashboard);
    
    return [...regularActivities, ...adminActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  };
  
  useEffect(() => {
    setActivities(combineActivities());
  }, [propActivities]);
  
  useEffect(() => {
    const handleNewActivity = () => {
      setActivities(combineActivities());
    };
    
    document.addEventListener('admin-activity-created', handleNewActivity);
    return () => {
      document.removeEventListener('admin-activity-created', handleNewActivity);
    };
  }, [propActivities]);

  return { activities };
};

