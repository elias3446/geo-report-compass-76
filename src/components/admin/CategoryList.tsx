
import React from 'react';
import { Category } from '../../types/admin';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trash2Icon, 
  EditIcon, 
  ToggleLeftIcon, 
  ToggleRightIcon 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Icons } from '../ui/icons';

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
  if (!categories.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No hay categorías disponibles.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Card key={category.id} className="overflow-hidden">
          <div className="h-2" style={{ backgroundColor: category.color }} />
          <CardHeader className="pb-3">
            <div className="flex justify-between">
              <CardTitle className="flex items-center">
                <span 
                  className="mr-2 flex h-8 w-8 items-center justify-center rounded-full" 
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {/* Use createElement to properly render the icon component */}
                  {React.createElement(Icons[category.icon] || Icons.category)}
                </span>
                {category.name}
              </CardTitle>
              <Badge variant={category.active ? "outline" : "secondary"}>
                {category.active ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onToggleActive(category.id, !category.active)}
              >
                {category.active ? (
                  <ToggleRightIcon className="mr-1 h-4 w-4" />
                ) : (
                  <ToggleLeftIcon className="mr-1 h-4 w-4" />
                )}
                {category.active ? 'Desactivar' : 'Activar'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(category)}
              >
                <EditIcon className="mr-1 h-4 w-4" />
                Editar
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive" 
                onClick={() => onDelete(category.id)}
              >
                <Trash2Icon className="mr-1 h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategoryList;
