import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RoleManageTable from "@/components/admin/RoleManageTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Modal para rol
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const availablePermissions = [
  { id: "users_view", label: "Ver usuarios" },
  { id: "users_manage", label: "Gestionar usuarios" },
  { id: "reports_view", label: "Ver reportes" },
  { id: "reports_manage", label: "Gestionar reportes" },
  { id: "categories_manage", label: "Gestionar categorías" },
  { id: "settings_view", label: "Ver configuración" },
  { id: "settings_manage", label: "Gestionar configuración" }
];

const AdminRoles = () => {
  const [roles, setRoles] = useState([
    { id: "admin", name: "Administrador", description: "Acceso total al sistema", permissions: ["users_manage", "reports_manage", "categories_manage", "settings_manage"] },
    { id: "supervisor", name: "Supervisor", description: "Gestión de reportes", permissions: ["reports_view", "reports_manage", "users_view"] },
    { id: "viewer", name: "Visualizador", description: "Solo lectura", permissions: ["reports_view", "users_view"] },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", permissions: [] as string[] });

  const handlePermissionToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter(pid => pid !== id)
        : [...prev.permissions, id]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setRoles(prev => [
      ...prev,
      {
        id: `role_${Date.now()}`,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      }
    ]);
    toast.success("Rol creado correctamente");
    setFormData({ name: "", description: "", permissions: [] });
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Gestión de Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[500px]">
          <RoleManageTable roles={roles} />
        </div>
      </CardContent>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              required
              placeholder="Nombre del rol"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              required
              placeholder="Descripción"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <div>
              <span className="text-sm font-medium">Permisos</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availablePermissions.map(p => (
                  <label key={p.id} className="flex gap-2 items-center">
                    <Checkbox
                      checked={formData.permissions.includes(p.id)}
                      onCheckedChange={() => handlePermissionToggle(p.id)}
                      id={p.id}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Rol</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminRoles;
