
import React, { useState } from "react";
import ReportsTable from "@/components/admin/ReportsTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// Puedes crear un formulario de reporte simple
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AdminReports = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reporte creado correctamente");
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      date: "",
    });
    setIsOpen(false);
    // Aquí agregarias a la lista global (simulado sin lógica real)
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Gestión de Reportes</CardTitle>
        <Button variant="default" onClick={() => setIsOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Nuevo Reporte
        </Button>
      </CardHeader>
      <CardContent>
        <ReportsTable
          onUpdateStatus={() => {}}
          onAssignReport={() => {}}
        />
      </CardContent>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Reporte</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              required
              placeholder="Título"
              value={formData.title}
              onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
            />
            <Input
              required
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
            />
            <Input
              required
              placeholder="Categoría"
              value={formData.category}
              onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
            />
            <Input
              required
              placeholder="Ubicación"
              value={formData.location}
              onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
            />
            <Input
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Reporte</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminReports;
