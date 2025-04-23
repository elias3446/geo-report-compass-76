
import React, { useState } from "react";
import ReportCategoryTable from "@/components/ReportCategoryTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import { createCategory, getCategories } from "@/services/adminService";
import { Category } from "@/types/admin";

// Para persistencia simple en runtime
const initialCategories: Category[] = getCategories();

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateCategory = (data: Omit<Category, "id" | "createdAt">) => {
    const nueva = createCategory(data);
    setCategories(prev => [...prev, nueva]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categorías de Reportes</CardTitle>
        <Button variant="default" onClick={() => setIsFormOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Nueva Categoría
        </Button>
      </CardHeader>
      <CardContent>
        <ReportCategoryTable
          categories={categories}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </CardContent>
      <CategoryForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleCreateCategory} />
    </Card>
  );
};

export default AdminCategories;
