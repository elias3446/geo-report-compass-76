
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

const initialRoles = [
  { id: "admin", name: "Administrador", description: "Acceso total al sistema", permissions: ["users_manage", "reports_manage", "categories_manage", "settings_manage"] },
  { id: "supervisor", name: "Supervisor", description: "Gestión de reportes", permissions: ["reports_view", "reports_manage", "users_view"] },
  { id: "viewer", name: "Visualizador", description: "Solo lectura", permissions: ["reports_view", "users_view"] },
];

const AdminRoles = () => {
  const [roles, setRoles] = useState(initialRoles);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Roles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[500px]">
          <Table>
            <TableHeader>
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
                      {role.permissions.map(p => <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>)}
                    </div>
                  </TableCell>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRoles;
