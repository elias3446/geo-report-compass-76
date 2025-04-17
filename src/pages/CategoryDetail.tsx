
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
import { 
  ArrowLeft, 
  Calendar, 
  Edit, 
  AlertCircle,
  Tag,
  Info,
  FileText
} from "lucide-react";
import { getCategoryById } from "@/services/adminService";
import { Category } from "@/types/admin";
import { format } from 'date-fns';
import { Icons } from '@/components/ui/icons';
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActivitiesByCategoryId } from "@/services/activityService";
import { AdminActivity } from "@/services/activityService";
import { getReportsByCategoryId } from "@/services/adminService";
import { Report } from "@/types/admin";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [relatedReports, setRelatedReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundCategory = getCategoryById(id);
      setCategory(foundCategory || null);
      
      if (foundCategory) {
        const categoryActivities = getActivitiesByCategoryId(id);
        setActivities(categoryActivities);
        
        // Obtener reportes relacionados con esta categoría
        const reports = getReportsByCategoryId(id);
        setRelatedReports(reports);
      }
      
      setLoading(false);
    }
  }, [id]);

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "category_created":
        return "border-green-500";
      case "category_updated":
        return "border-blue-500";
      case "category_deleted":
        return "border-red-500";
      default:
        return "border-gray-500";
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-96">
          <p>Cargando detalles de la categoría...</p>
        </div>
      </AppLayout>
    );
  }

  if (!category) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold">Categoría no encontrada</h2>
          <p className="text-muted-foreground mt-2">
            La categoría que buscas no existe o ha sido eliminada.
          </p>
          <Button
            className="mt-6"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Administración
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Renderiza el ícono de la categoría
  const CategoryIcon = Icons[category.icon] || Icons.category;

  return (
    <AppLayout>
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Administración
        </Button>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center">
            <span 
              className="mr-3 flex h-10 w-10 items-center justify-center rounded-full" 
              style={{ backgroundColor: `${category.color}20` }}
            >
              <CategoryIcon className="h-5 w-5" style={{ color: category.color }} />
            </span>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          </div>
          <div className="mt-2 sm:mt-0">
            <Badge 
              variant={category.active ? "outline" : "secondary"}
            >
              {category.active ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detalles de la Categoría</CardTitle>
            <CardDescription>
              Información completa sobre esta categoría
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Descripción</h3>
              <p className="text-muted-foreground mt-1">
                {category.description || "No hay descripción disponible."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <Tag className="h-5 w-5" style={{ color: category.color }} />
                <div>
                  <h4 className="font-medium">Color</h4>
                  <div className="flex items-center mt-1">
                    <div 
                      className="w-6 h-6 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-muted-foreground">{category.color}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Fecha de Creación</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(category.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Reportes asociados</h3>
              {relatedReports.length > 0 ? (
                <ScrollArea className="h-[150px] mt-2 pr-4 border rounded-md p-3">
                  <div className="space-y-2">
                    {relatedReports.map(report => (
                      <div key={report.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{report.title}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/reports/${report.id}`)}
                        >
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No hay reportes asociados a esta categoría.</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin?tab=categories&edit=" + category.id)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Categoría
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad de la Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className={`border-l-2 pl-4 py-1 ${getActivityColor(activity.type)}`}
                      >
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay actividad registrada para esta categoría.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Total de reportes:</span>
                  </div>
                  <Badge variant="outline">{relatedReports.length}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Reportes pendientes:</span>
                  </div>
                  <Badge variant="outline">
                    {relatedReports.filter(r => r.status === 'pending').length}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Reportes resueltos:</span>
                  </div>
                  <Badge variant="outline">
                    {relatedReports.filter(r => r.status === 'resolved').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CategoryDetail;
