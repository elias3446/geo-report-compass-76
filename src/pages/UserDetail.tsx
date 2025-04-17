
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
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Edit, 
  AlertCircle,
  Shield
} from "lucide-react";
import { getUserById } from "@/services/adminService";
import { User as UserType, UserRole } from "@/types/admin";
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getActivitiesByUserId } from "@/services/activityService";
import { AdminActivity } from "@/services/activityService";

const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  supervisor: 'bg-blue-100 text-blue-800 border-blue-200',
  mobile: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200'
};

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundUser = getUserById(id);
      setUser(foundUser || null);
      
      if (foundUser) {
        const userActivities = getActivitiesByUserId(id);
        setActivities(userActivities);
      }
      
      setLoading(false);
    }
  }, [id]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Nunca';
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "user_created":
        return "border-green-500";
      case "user_updated":
        return "border-blue-500";
      case "user_deleted":
        return "border-red-500";
      case "report_created":
        return "border-purple-500";
      case "report_updated":
        return "border-yellow-500";
      case "report_resolved":
        return "border-teal-500";
      default:
        return "border-gray-500";
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-96">
          <p>Cargando detalles del usuario...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold">Usuario no encontrado</h2>
          <p className="text-muted-foreground mt-2">
            El usuario que buscas no existe o ha sido eliminado.
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
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <Badge 
              variant="outline" 
              className={roleColors[user.role]}
            >
              {user.role === 'admin' && 'Administrador'}
              {user.role === 'supervisor' && 'Supervisor'}
              {user.role === 'mobile' && 'Usuario Móvil'}
              {user.role === 'viewer' && 'Visualizador'}
            </Badge>
            <Badge 
              variant={user.active ? "success" : "destructive"}
            >
              {user.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>
              Datos completos del usuario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl">
                  {user.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-1" />{user.email}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Rol</h4>
                  <p className="text-sm text-muted-foreground">
                    {user.role === 'admin' && 'Administrador'}
                    {user.role === 'supervisor' && 'Supervisor'}
                    {user.role === 'mobile' && 'Usuario Móvil'}
                    {user.role === 'viewer' && 'Visualizador'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Fecha de Creación</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Último Acceso</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(user.lastLogin)}</p>
                </div>
              </div>
              
              {user.mobileUserType && (
                <div className="flex items-start space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Tipo de Usuario Móvil</h4>
                    <p className="text-sm text-muted-foreground">
                      {user.mobileUserType === 'citizen' ? 'Ciudadano' : 'Técnico'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/admin?tab=users&edit=" + user.id)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar Usuario
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad del Usuario</CardTitle>
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
                    <p className="text-sm text-muted-foreground">No hay actividad registrada para este usuario.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserDetail;
