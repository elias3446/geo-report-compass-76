
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getReportsByCategoryId } from '@/services/adminService';

interface Category {
  id: string;
  name: string;
  description: string;
  reports: number;
  status: 'active' | 'inactive';
}

interface ReportCategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const ReportCategoryTable: React.FC<ReportCategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Verificar si una categoría tiene reportes asociados
  const checkCategoryHasReports = (categoryId: string): boolean => {
    const reports = getReportsByCategoryId(categoryId);
    return reports.length > 0;
  };

  const handleDelete = (categoryId: string) => {
    setSelectedCategoryId(null);
    onDelete(categoryId);
  };

  return (
    <div className="border rounded-lg">
      <ScrollArea className="h-[500px]">
        <Table className="table-fixed w-full">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[25%] pl-4">Nombre</TableHead>
              <TableHead className="w-[35%]">Descripción</TableHead>
              <TableHead className="w-[15%] text-center">Reportes</TableHead>
              <TableHead className="w-[15%] text-center">Estado</TableHead>
              <TableHead className="w-[10%] text-right pr-4">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="w-[25%] pl-4 font-medium whitespace-normal align-top">{category.name}</TableCell>
                <TableCell className="w-[35%] truncate whitespace-normal align-top">{category.description}</TableCell>
                <TableCell className="w-[15%] text-center align-top">{category.reports}</TableCell>
                <TableCell className="w-[15%] text-center align-top">
                  <Badge 
                    variant={category.status === 'active' ? 'success' : 'secondary'}
                  >
                    {category.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="w-[10%] text-right pr-4 align-top">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {checkCategoryHasReports(category.id) 
                              ? "No se puede eliminar esta categoría porque tiene reportes asociados." 
                              : "Esta acción eliminará permanentemente la categoría y no se puede deshacer."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setSelectedCategoryId(null)}>
                            Cancelar
                          </AlertDialogCancel>
                          {!checkCategoryHasReports(category.id) && (
                            <AlertDialogAction 
                              onClick={() => handleDelete(category.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          )}
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default ReportCategoryTable;
