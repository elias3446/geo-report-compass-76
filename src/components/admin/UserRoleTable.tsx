
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Puedes extender esta información si tienes descripciones más detalladas para los roles.
const roles = [
  {
    id: "admin",
    nombre: "Administrador",
    descripcion: "Acceso total al sistema. Puede gestionar usuarios, reportes y configuraciones."
  },
  {
    id: "supervisor",
    nombre: "Supervisor Web",
    descripcion: "Supervisa reportes y gestiona incidencias desde la plataforma web."
  },
  {
    id: "mobile",
    nombre: "Usuario Móvil",
    descripcion: "Reporta incidencias y sigue su estado desde la app móvil."
  },
  {
    id: "viewer",
    nombre: "Visualizador",
    descripcion: "Solo visualiza los reportes, sin capacidad de edición."
  }
];

const UserRoleTable: React.FC = () => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-lg">Roles de Usuario</h3>
      <button disabled className="px-4 py-2 bg-muted-foreground text-muted rounded opacity-60 cursor-not-allowed">Agregar Rol</button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rol</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map(rol => (
          <TableRow key={rol.id}>
            <TableCell>
              <Badge variant="outline">{rol.id}</Badge>
            </TableCell>
            <TableCell className="font-medium">{rol.nombre}</TableCell>
            <TableCell>{rol.descripcion}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default UserRoleTable;
