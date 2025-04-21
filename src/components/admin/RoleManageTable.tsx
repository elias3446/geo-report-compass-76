import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface Permission {
  id: string;
  label: string;
  description: string;
}

const availablePermissions: Permission[] = [
  { id: "users_view", label: "Ver usuarios", description: "Permite ver la lista de usuarios" },
  { id: "users_manage", label: "Gestionar usuarios", description: "Permite crear, editar y eliminar usuarios" },
  { id: "reports_view", label: "Ver reportes", description: "Permite ver todos los reportes" },
  { id: "reports_manage", label: "Gestionar reportes", description: "Permite editar y actualizar reportes" },
  { id: "categories_manage", label: "Gestionar categorías", description: "Permite administrar las categorías" },
  { id: "settings_view", label: "Ver configuración", description: "Permite ver la configuración del sistema" },
  { id: "settings_manage", label: "Gestionar configuración", description: "Permite modificar la configuración" }
];

const RoleManageTable: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    { 
      id: "admin", 
      name: "Administrador", 
      description: "Acceso total al sistema",
      permissions: availablePermissions.map(p => p.id)
    },
    { 
      id: "supervisor", 
      name: "Supervisor", 
      description: "Gestión de reportes",
      permissions: ["reports_view", "reports_manage", "users_view"]
    },
    { 
      id: "mobile", 
      name: "Usuario Móvil", 
      description: "Uso de app móvil",
      permissions: ["reports_view"]
    },
    { 
      id: "viewer", 
      name: "Visualizador", 
      description: "Solo lectura",
      permissions: ["reports_view", "users_view"]
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    permissions: [] as string[] 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id ? { ...role, ...formData } : role
      ));
      toast.success("Rol actualizado correctamente");
    } else {
      const newRole: Role = {
        id: `role_${uuidv4().split('-')[0]}`,
        ...formData
      };
      setRoles([...roles, newRole]);
      toast.success("Rol creado correctamente");
    }
    handleCloseDialog();
  };

  const handleDelete = (roleId: string) => {
    if (roleId === "admin") {
      toast.error("No se puede eliminar el rol de administrador");
      return;
    }
    setRoles(roles.filter(role => role.id !== roleId));
    toast.success("Rol eliminado correctamente");
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
    setFormData({ name: "", description: "", permissions: [] });
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Roles de Usuario</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Rol
        </Button>
      </div>
      
      <ScrollArea className="h-[500px] border rounded-lg">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Permisos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id}>
                <TableCell>
                  <Badge variant="outline">{role.id}</Badge>
                </TableCell>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.length > 0 ? (
                      role.permissions.map(permId => (
                        <Badge key={permId} variant="secondary" className="text-xs">
                          {availablePermissions.find(p => p.id === permId)?.label || permId}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin permisos</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(role)}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(role.id)}
                    disabled={role.id === "admin"}
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
              {editingRole ? "Editar Rol" : "Nuevo Rol"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre del rol"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Input
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del rol"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Permisos</label>
              <div className="border rounded-md p-4 space-y-3">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingRole ? "Guardar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManageTable;
