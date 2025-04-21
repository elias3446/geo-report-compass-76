
import React from 'react';
import { Category } from '@/types/admin';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import ReportCategoryTable from '../ReportCategoryTable';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from '../ui/button';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onToggleActive: (categoryId: string, active: boolean) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  // Transformar las categorías para el formato que espera ReportCategoryTable
  const formattedCategories = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    reports: 0, // Este valor debería calcularse dinámicamente
    status: category.active ? 'active' as const : 'inactive' as const
  }));

  return (
    <ReportCategoryTable
      categories={formattedCategories}
      onEdit={category => {
        // Obtener la categoría original para enviarla al editor
        const originalCategory = categories.find(c => c.id === category.id);
        if (originalCategory) {
          onEdit(originalCategory);
        }
      }}
      onDelete={onDelete}
    />
  );
};

export default CategoryList;
