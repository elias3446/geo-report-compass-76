import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface Status {
  id: string;
  name: string;
  description: string;
}

const StatusManageTable: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([
    { id: "draft", name: "Borrador", description: "Reporte guardado pero no enviado" },
    { id: "submitted", name: "Enviado", description: "Reporte enviado, pendiente de aprobación" },
    { id: "in-progress", name: "En Progreso", description: "Reporte en proceso de atención" },
    { id: "resolved", name: "Resuelto", description: "Reporte completado" }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStatus) {
      setStatuses(statuses.map(status => 
        status.id === editingStatus.id ? { ...status, ...formData } : status
      ));
      toast.success("Estado actualizado correctamente");
    } else {
      const newStatus: Status = {
        id: `status_${uuidv4().split('-')[0]}`,
        ...formData
      };
      setStatuses([...statuses, newStatus]);
      toast.success("Estado creado correctamente");
    }
    handleCloseDialog();
  };

  const handleDelete = (statusId: string) => {
    if (statusId === "draft" || statusId === "submitted") {
      toast.error("No se puede eliminar un estado del sistema");
      return;
    }
    setStatuses(statuses.filter(status => status.id !== statusId));
    toast.success("Estado eliminado correctamente");
  };

  const handleEdit = (status: Status) => {
    setEditingStatus(status);
    setFormData({ name: status.name, description: status.description });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStatus(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Estados de Reporte</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Estado
        </Button>
      </div>
      
      <ScrollArea className="h-[500px] border rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.map(status => (
              <TableRow key={status.id}>
                <TableCell>
                  <Badge variant="outline">{status.id}</Badge>
                </TableCell>
                <TableCell className="font-medium">{status.name}</TableCell>
                <TableCell>{status.description}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(status)}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(status.id)}
                    disabled={status.id === "draft" || status.id === "submitted"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStatus ? "Editar Estado" : "Nuevo Estado"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre del estado"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Input
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del estado"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingStatus ? "Guardar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatusManageTable;
