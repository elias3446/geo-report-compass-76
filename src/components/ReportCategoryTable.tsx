import React from 'react';
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
import { EditIcon, TrashIcon, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="border rounded-lg">
      <div className="overflow-auto max-h-[500px]">
        <Table className="table-fixed w-full">
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[25%] pl-4">Nombre</TableHead>
              <TableHead className="w-[35%]">Descripción</TableHead>
              <TableHead className="w-[15%] text-center">Reportes asignados</TableHead>
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
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onDelete(category.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportCategoryTable;
