
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const initialStatuses = [
  { id: "draft", name: "Borrador", description: "Guardado, NO enviado" },
  { id: "submitted", name: "Enviado", description: "Reportado, pendiente de aprobación" },
  { id: "approved", name: "Aprobado", description: "Aprobado por supervisor" },
  { id: "rejected", name: "Rechazado", description: "No aprobado, debe corregirse" },
];

const AdminStatuses = () => {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatuses(prev => [
      ...prev,
      {
        id: `status_${Date.now()}`,
        name: formData.name,
        description: formData.description
      }
    ]);
    toast.success("Estado creado correctamente");
    setFormData({ name: "", description: "" });
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Estados de Reporte</CardTitle>
        <Button variant="default" onClick={() => setIsOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Nuevo Estado
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[500px]">
          <Table>
            <TableHeader>
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
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Estado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              required
              placeholder="Nombre del estado"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              required
              placeholder="Descripción"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Estado</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminStatuses;

