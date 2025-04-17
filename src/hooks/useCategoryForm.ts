
import { useForm } from 'react-hook-form';
import { Category } from '@/types/admin';
import { registerAdminActivity } from '@/services/activityService';

export const useCategoryForm = (
  initialData: Category | undefined,
  onSubmit: (data: Omit<Category, 'id' | 'createdAt'>) => void,
  onClose: () => void,
  currentUser: { id: string; name: string } = { id: 'admin', name: 'Administrador' }
) => {
  const defaultValues = initialData 
    ? { ...initialData } 
    : {
        name: '',
        description: '',
        color: '#3b82f6',
        icon: 'category',
        active: true,
      };
      
  const form = useForm<Omit<Category, 'id' | 'createdAt'>>({
    defaultValues
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (data: Omit<Category, 'id' | 'createdAt'>) => {
    if (initialData) {
      registerAdminActivity({
        type: 'category_updated',
        title: 'Categoría actualizada',
        description: `Se ha actualizado la categoría "${data.name}"`,
        userId: currentUser.id,
        userName: currentUser.name,
        relatedItemId: initialData.id
      });
    } else {
      registerAdminActivity({
        type: 'category_created',
        title: 'Categoría creada',
        description: `Se ha creado una nueva categoría "${data.name}"`,
        userId: currentUser.id,
        userName: currentUser.name
      });
    }
    
    onSubmit(data);
    handleClose();
  };

  return {
    form,
    handleClose,
    handleSubmit
  };
};
