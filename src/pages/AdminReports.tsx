
import React from "react";
import ReportsTable from "@/components/admin/ReportsTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminReports = () => (
  <Card>
    <CardHeader>
      <CardTitle>Gestión de Reportes</CardTitle>
    </CardHeader>
    <CardContent>
      <ReportsTable
        onUpdateStatus={() => {}}
        onAssignReport={() => {}}
      />
    </CardContent>
  </Card>
);

export default AdminReports;
