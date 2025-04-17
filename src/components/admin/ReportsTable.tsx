
import React from 'react';
import { format } from 'date-fns';
import { useReports, GeoReport } from '@/contexts/ReportContext';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
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
  onViewReport: (reportId: string) => void;
  onUpdateStatus: (reportId: string, status: string) => void;
  onAssignReport: (reportId: string, userId: string) => void;
  currentUser?: { id: string; name: string };
}

const statusColors = {
  'draft': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'submitted': 'bg-blue-100 text-blue-800 border-blue-200',
  'approved': 'bg-green-100 text-green-800 border-green-200',
  'rejected': 'bg-red-100 text-red-800 border-red-200'
};

const statusLabels = {
  'draft': 'Borrador',
  'submitted': 'Enviado',
  'approved': 'Aprobado',
  'rejected': 'Rechazado'
};

const ReportsTable: React.FC<ReportsTableProps> = ({ 
  onViewReport,
  onUpdateStatus,
  onAssignReport,
  currentUser = { id: 'admin', name: 'Administrador' }
}) => {
  const { reports } = useReports();
  const users = getUsers(); // Obtener la lista de usuarios registrados

  const handleUpdateStatus = (reportId: string, newStatus: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    registerAdminActivity({
      type: 'report_status_changed',
      title: 'Estado de reporte cambiado',
      description: `Se ha cambiado el estado del reporte "${report.title}" a ${statusLabels[newStatus as keyof typeof statusLabels]}`,
      userId: currentUser.id,
      userName: currentUser.name,
      relatedItemId: reportId,
      relatedReportId: reportId
    });
    
    onUpdateStatus(reportId, newStatus);
  };

  const handleAssignReport = (reportId: string, userId: string) => {
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
      relatedItemId: reportId,
      relatedReportId: reportId
    });
    
    onAssignReport(reportId, userId);
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-mono text-xs">
                {report.id.substring(0, 8)}
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
                  <SelectTrigger className={`w-[140px] ${statusColors[report.status as keyof typeof statusColors]}`}>
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
              <TableCell>{report.location.name}</TableCell>
              <TableCell>
                <Select
                  defaultValue={report.assignedTo || "unassigned"}
                  onValueChange={(value) => handleAssignReport(report.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Asignar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">No asignado</SelectItem>
                    {users
                      .filter(user => user.active) // Solo mostrar usuarios activos
                      .map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{format(new Date(report.date), 'dd/MM/yyyy')}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewReport(report.id)}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable;
