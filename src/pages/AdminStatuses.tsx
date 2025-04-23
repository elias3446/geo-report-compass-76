
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

const initialStatuses = [
  { id: "draft", name: "Borrador", description: "Guardado, NO enviado" },
  { id: "submitted", name: "Enviado", description: "Reportado, pendiente de aprobación" },
  { id: "approved", name: "Aprobado", description: "Aprobado por supervisor" },
  { id: "rejected", name: "Rechazado", description: "No aprobado, debe corregirse" },
];

const AdminStatuses = () => {
  const [statuses, setStatuses] = useState(initialStatuses);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estados de Reporte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[500px]">
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminStatuses;
