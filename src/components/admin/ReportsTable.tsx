
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getReports, updateReport, deleteReport } from '@/services/reportService';
import { getUserById } from '@/services/userService';
import { getUsers } from '@/services/adminService';
import { useUsers } from '@/contexts/UserContext';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { EyeIcon, MoreHorizontalIcon, Edit, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { registerAdminActivity } from '@/services/activityService';
import { User } from '@/types/admin';
import { toast } from 'sonner';

interface ReportsTableProps {
  onUpdateStatus: (reportId: string, status: string) => void;
  onAssignReport: (reportId: string, userId: string) => void;
  currentUser?: { id: string; name: string };
  onReportDeleted?: (reportId: number) => void;
}

const statusColors = {
  'draft': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'submitted': 'bg-blue-100 text-blue-800 border-blue-200',
  'approved': 'bg-green-100 text-green-800 border-green-200',
  'rejected': 'bg-red-100 text-red-800 border-red-200',
  'Open': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'Resolved': 'bg-green-100 text-green-800 border-green-200'
};

const statusLabels = {
  'draft': 'Borrador',
  'submitted': 'Enviado',
  'approved': 'Aprobado',
  'rejected': 'Rechazado',
  'Open': 'Abierto',
  'In Progress': 'En Progreso',
  'Resolved': 'Resuelto'
};

const ReportsTable: React.FC<ReportsTableProps> = ({ 
  onUpdateStatus,
  onAssignReport,
  currentUser = { id: 'admin', name: 'Administrador' },
  onReportDeleted
}) => {
  const navigate = useNavigate();
  const [reports, setReports] = useState(getReports());
  const { users } = useUsers();
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  
  // Load active users from UserContext
  useEffect(() => {
    const filteredUsers = users.filter(user => user.active);
    setActiveUsers(filteredUsers);
  }, [users]);

  // Navigation and report viewing
  const handleViewReport = (reportId: number) => {
    console.log(`Navigating to report detail: /reports/${reportId}`);
    navigate(`/reports/${reportId}`);
  };

  const handleEditReport = (reportId: number) => {
    console.log(`Navigating to edit report: /reports/${reportId}/edit`);
    navigate(`/reports/${reportId}/edit`);
  };

  // Función para eliminar un reporte directamente sin diálogo de confirmación
  const handleDeleteReport = (reportId: number, reportTitle: string) => {
    try {
      const success = deleteReport(reportId);
      
      if (success) {
        // Registrar la actividad
        registerAdminActivity({
          type: 'report_deleted',
          title: 'Reporte eliminado',
          description: `Se ha eliminado el reporte "${reportTitle}"`,
          userId: currentUser.id,
          userName: currentUser.name,
          relatedItemId: reportId.toString(),
          relatedReportId: reportId.toString()
        });
        
        // Actualizar la lista de reportes
        setReports(prevReports => prevReports.filter(r => r.id !== reportId));
        
        // Notificar al componente padre sobre la eliminación
        if (onReportDeleted) {
          onReportDeleted(reportId);
        }
        
        // Notificar éxito
        toast.success('Reporte eliminado correctamente');
      } else {
        toast.error('Error al eliminar el reporte');
      }
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
      toast.error('Error al eliminar el reporte');
    }
  };

  // Other interaction functions
  const handleTitleClick = (reportId: number) => {
    console.log(`Title clicked, navigating to report detail: /reports/${reportId}`);
    navigate(`/reports/${reportId}`);
  };

  const handleUpdateStatus = (reportId: number, newStatus: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      registerAdminActivity({
        type: 'report_status_changed',
        title: 'Estado de reporte cambiado',
        description: `Se ha cambiado el estado del reporte "${report.title}" a ${statusLabels[newStatus as keyof typeof statusLabels]}`,
        userId: currentUser.id,
        userName: currentUser.name,
        relatedItemId: reportId.toString(),
        relatedReportId: reportId.toString()
      });
      
      const updatedReport = updateReport(reportId, { status: newStatus });
      if (updatedReport) {
        setReports(prevReports => 
          prevReports.map(r => r.id === reportId ? { ...r, status: newStatus } : r)
        );
      }
      
      onUpdateStatus(reportId.toString(), newStatus);
    } catch (error) {
      console.error('Error al actualizar el estado del reporte:', error);
      toast.error('Error al actualizar el estado del reporte');
    }
  };

  const handleAssignReport = async (reportId: number, userId: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      const assignedUser = activeUsers.find(u => u.id === userId);
      const userName = assignedUser ? assignedUser.name : 'No asignado';
      
      const updatedReport = updateReport(reportId, { assignedTo: userId });
      
      if (updatedReport) {
        setReports(prevReports => 
          prevReports.map(r => r.id === reportId ? { ...r, assignedTo: userId } : r)
        );

        registerAdminActivity({
          type: 'report_assigned',
          title: 'Reporte asignado',
          description: `Se ha asignado el reporte "${report.title}" a ${userName}`,
          userId: currentUser.id,
          userName: currentUser.name,
          relatedItemId: reportId.toString(),
          relatedReportId: reportId.toString()
        });
        
        toast.success(`Reporte asignado a ${userName}`);
        
        onAssignReport(reportId.toString(), userId);
      }
    } catch (error) {
      console.error('Error al asignar el reporte:', error);
      toast.error('Error al asignar el reporte');
    }
  };

  const getAssignedUserName = (userId: string | undefined): string => {
    if (!userId || userId === "unassigned") return "Sin asignar";
    
    // Primero buscamos en los usuarios activos
    const activeUser = activeUsers.find(u => u.id === userId);
    if (activeUser) return activeUser.name;
    
    // Si no se encuentra en los activos, probablemente fue eliminado
    return "Usuario no disponible";
  };

  // Check if a user is still active
  const isUserActive = (userId: string | undefined): boolean => {
    if (!userId || userId === "unassigned") return false;
    return activeUsers.some(u => u.id === userId);
  };

  if (!reports.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No se encontraron reportes.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 bg-background">Título</TableHead>
              <TableHead className="sticky top-0 bg-background">Categoría</TableHead>
              <TableHead className="sticky top-0 bg-background">Estado</TableHead>
              <TableHead className="sticky top-0 bg-background">Ubicación</TableHead>
              <TableHead className="sticky top-0 bg-background">Asignado a</TableHead>
              <TableHead className="sticky top-0 bg-background">Fecha</TableHead>
              <TableHead className="sticky top-0 bg-background">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-left font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={() => handleTitleClick(report.id)}
                  >
                    {report.title}
                  </Button>
                </TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={report.status}
                    onValueChange={(value) => handleUpdateStatus(report.id, value)}
                  >
                    <SelectTrigger className={`w-[140px] ${statusColors[report.status as keyof typeof statusColors] || ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>
                  <Select
                    value={isUserActive(report.assignedTo) ? report.assignedTo : "unassigned"}
                    onValueChange={(value) => handleAssignReport(report.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        {getAssignedUserName(report.assignedTo)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Sin asignar</SelectItem>
                      {activeUsers.length > 0 ? (
                        activeUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>Cargando usuarios...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{format(new Date(report.createdAt), 'dd/MM/yyyy')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewReport(report.id)}>
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditReport(report.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteReport(report.id, report.title)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default ReportsTable;
