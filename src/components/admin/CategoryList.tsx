
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
  ToggleRightIcon,
  Eye 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Icons } from '../ui/icons';
import { registerAdminActivity } from '@/services/activityService';
import { Link } from 'react-router-dom';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onToggleActive: (categoryId: string, active: boolean) => void;
  currentUser?: { id: string; name: string }; // Usuario actual para el registro de actividad
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  onEdit, 
  onDelete,
  onToggleActive,
  currentUser = { id: 'admin', name: 'Administrador' } // Valor por defecto
}) => {
  const handleDelete = (category: Category) => {
    // Registrar la actividad antes de eliminar
    registerAdminActivity({
      type: 'category_deleted',
      title: 'Categoría eliminada',
      description: `Se ha eliminado la categoría "${category.name}"`,
      userId: currentUser.id,
      userName: currentUser.name,
      relatedItemId: category.id
    });
    
    // Llamar a la función original de eliminación
    onDelete(category.id);
  };

  const handleToggleActive = (category: Category, active: boolean) => {
    // Registrar la actividad antes de cambiar el estado
    registerAdminActivity({
      type: 'category_updated',
      title: 'Estado de categoría cambiado',
      description: `Se ha ${active ? 'activado' : 'desactivado'} la categoría "${category.name}"`,
      userId: currentUser.id,
      userName: currentUser.name,
      relatedItemId: category.id
    });
    
    // Llamar a la función original de toggle
    onToggleActive(category.id, active);
  };

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
                <Link to={`/categories/${category.id}`} className="hover:underline text-blue-600">
                  {category.name}
                </Link>
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
                asChild
              >
                <Link to={`/categories/${category.id}`}>
                  <Eye className="mr-1 h-4 w-4" />
                  Ver
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleToggleActive(category, !category.active)}
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
                onClick={() => handleDelete(category)}
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
