
import React from "react";
import ReportCategoryTable from "@/components/ReportCategoryTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Category = {
  id: string;
  name: string;
  description: string;
  reports: number;
  status: "active" | "inactive";
};

const categories: Category[] = [
  { id: "1", name: "Ambiental", description: "Reportes del medio ambiente", reports: 6, status: "active" },
  { id: "2", name: "Infraestructura", description: "Daños y mejoras", reports: 3, status: "inactive" },
  // ... puedes cargar esto dinamicamente ...
];

const AdminCategories = () => (
  <Card>
    <CardHeader>
      <CardTitle>Categorías de Reportes</CardTitle>
    </CardHeader>
    <CardContent>
      <ReportCategoryTable
        categories={categories}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </CardContent>
  </Card>
);

export default AdminCategories;
