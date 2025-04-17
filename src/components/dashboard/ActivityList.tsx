
import React, { useEffect, useState } from 'react';
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
  Eye,
  FilePlus,
  FileText as FileRead,
  FilePen,
  FileX,
  UserPlus,
  UserX,
  User,
  Settings,
  Tag
} from "lucide-react";
import { Activity } from "@/services/reportService";
import { getAllActivities } from "@/services/reportService";
import { getAdminActivities, formatAdminActivityForDashboard } from "@/services/activityService";
import { AdminActivity } from "@/services/activityService";

interface ActivityListProps {
  activities?: Activity[];
}

// Tipo unificado para manejar tanto las actividades regulares como las administrativas
type UnifiedActivity = {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  relatedReportId?: string;
  user?: string; // Hacemos user opcional para manejar ambos tipos
};

const ActivityList = ({ activities: propActivities }: ActivityListProps) => {
  // Usamos un estado local para mantener las actividades actualizadas
  const [activities, setActivities] = useState<UnifiedActivity[]>([]);
  
  // Función para combinar y formatear todas las actividades
  const combineActivities = () => {
    // Obtenemos las actividades regulares
    const regularActivities: UnifiedActivity[] = propActivities?.map(activity => ({
      ...activity,
      id: activity.id.toString(), // Convertimos el id numérico a string
    })) || getAllActivities().map(activity => ({
      ...activity,
      id: activity.id.toString(), // Convertimos el id numérico a string
    }));
    
    // Obtenemos y formateamos las actividades administrativas
    const adminActivities: UnifiedActivity[] = getAdminActivities().map(formatAdminActivityForDashboard);
    
    // Combinamos ambas y las ordenamos por tiempo (asumiendo que el tiempo es un string ISO)
    const allActivities = [...regularActivities, ...adminActivities]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    
    return allActivities;
  };
  
  // Actualizamos el estado inicial con todas las actividades
  useEffect(() => {
    setActivities(combineActivities());
  }, [propActivities]);
  
  // Escuchamos cambios en las actividades (evento personalizado)
  useEffect(() => {
    const handleNewActivity = () => {
      setActivities(combineActivities());
    };
    
    // Registramos el event listener
    document.addEventListener('admin-activity-created', handleNewActivity);
    
    // Limpiamos el event listener
    return () => {
      document.removeEventListener('admin-activity-created', handleNewActivity);
    };
  }, [propActivities]);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      // Reportes
      case "report_created":
        return <FilePlus className="h-4 w-4 text-blue-500" />;
      case "report_updated":
        return <FilePen className="h-4 w-4 text-yellow-500" />;
      case "report_resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "report_deleted":
        return <FileX className="h-4 w-4 text-red-500" />;
      case "report_assigned":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "report_status_changed":
        return <Clock className="h-4 w-4 text-orange-500" />;
      
      // Usuarios
      case "user_created":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "user_updated":
        return <User className="h-4 w-4 text-blue-500" />;
      case "user_deleted":
        return <UserX className="h-4 w-4 text-red-500" />;
      
      // Categorías
      case "category_created":
        return <Tag className="h-4 w-4 text-green-500" />;
      case "category_updated":
        return <Tag className="h-4 w-4 text-blue-500" />;
      case "category_deleted":
        return <Tag className="h-4 w-4 text-red-500" />;
      
      // Configuración
      case "setting_updated":
        return <Settings className="h-4 w-4 text-indigo-500" />;
        
      // Otros tipos
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
