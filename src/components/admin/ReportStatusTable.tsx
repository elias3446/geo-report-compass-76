
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Puedes ajustar nombres o descripciones según tu flujo de negocio.
const reportStates = [
  {
    id: "draft",
    nombre: "Borrador",
    descripcion: "Reporte guardado pero no enviado."
  },
  {
    id: "submitted",
    nombre: "Enviado",
    descripcion: "Reporte creado y enviado, pendiente de aprobación."
  },
  {
    id: "approved",
    nombre: "Aprobado",
    descripcion: "Reporte revisado y aprobado por un supervisor."
  },
  {
    id: "rejected",
    nombre: "Rechazado",
    descripcion: "Reporte rechazado, posiblemente con observaciones."
  },
  {
    id: "pending",
    nombre: "Pendiente",
    descripcion: "Reporte recibido, pendiente de revisión."
  },
  {
    id: "in-progress",
    nombre: "En Progreso",
    descripcion: "Reporte en curso de solución."
  },
  {
    id: "resolved",
    nombre: "Resuelto",
    descripcion: "La incidencia del reporte ha sido solucionada."
  },
];

const ReportStatusTable: React.FC = () => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-lg">Estados de Reporte</h3>
      <button disabled className="px-4 py-2 bg-muted-foreground text-muted rounded opacity-60 cursor-not-allowed">Agregar Estado</button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Estado</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reportStates.map(st => (
          <TableRow key={st.id}>
            <TableCell>
              <Badge variant="outline">{st.id}</Badge>
            </TableCell>
            <TableCell className="font-medium">{st.nombre}</TableCell>
            <TableCell>{st.descripcion}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ReportStatusTable;

