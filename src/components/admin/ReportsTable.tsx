
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getReports, Report } from '@/services/reportService';
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
import { EyeIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { registerAdminActivity } from '@/services/activityService';
import { getUsers } from '@/services/userService';
import { User } from '@/types/admin';

interface ReportsTableProps {
  onUpdateStatus: (reportId: string, status: string) => void;
  onAssignReport: (reportId: string, userId: string) => void;
  currentUser?: { id: string; name: string };
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
  currentUser = { id: 'admin', name: 'Administrador' }
}) => {
  const navigate = useNavigate();
  const reports = getReports();
  const [users, setUsers] = useState<User[]>([]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    // Obtener usuarios activos
    const activeUsers = getUsers().filter(user => user.active);
    setUsers(activeUsers);
    console.log('Usuarios activos cargados:', activeUsers);
  }, []);

  const handleViewReport = (reportId: number) => {
    navigate(`/reports/${reportId}`);
  };

  const handleUpdateStatus = (reportId: number, newStatus: string) => {
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
    
    onUpdateStatus(reportId.toString(), newStatus);
  };

  const handleAssignReport = (reportId: number, userId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const assignedUser = users.find(u => u.id === userId);
    const userName = assignedUser ? assignedUser.name : 'No asignado';
    
    registerAdminActivity({
      type: 'report_assigned',
      title: 'Reporte asignado',
      description: `Se ha asignado el reporte "${report.title}" a ${userName}`,
      userId: currentUser.id,
      userName: currentUser.name,
      relatedItemId: reportId.toString(),
      relatedReportId: reportId.toString()
    });
    
    onAssignReport(reportId.toString(), userId);
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
              <TableHead className="sticky top-0 bg-background">ID</TableHead>
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
                <TableCell className="font-mono text-xs">
                  {report.id.toString().substring(0, 8)}
                </TableCell>
                <TableCell className="font-medium">
                  {report.title}
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
                    defaultValue={report.assignedTo || "unassigned"}
                    onValueChange={(value) => handleAssignReport(report.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sin asignar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Sin asignar</SelectItem>
                      {users.length > 0 ? (
                        users.map(user => (
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
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewReport(report.id)}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
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
