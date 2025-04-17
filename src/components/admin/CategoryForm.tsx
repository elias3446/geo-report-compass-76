
import React from 'react';
import { CategoryFormProps } from '@/types/categoryForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { CategoryFormFields } from './CategoryFormFields';
import { useCategoryForm } from '@/hooks/useCategoryForm';

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData,
  currentUser = { id: 'admin', name: 'Administrador' }
}) => {
  const { form, handleClose, handleSubmit } = useCategoryForm(
    initialData,
    onSubmit,
    onClose,
    currentUser
  );

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({ ...initialData });
      } else {
        form.reset({
          name: '',
          description: '',
          color: '#3b82f6',
          icon: 'category',
          active: true,
        });
      }
    }
  }, [open, initialData, form]);

  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Categoría' : 'Crear Nueva Categoría'}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Modifica los detalles de la categoría seleccionada' 
              : 'Completa el formulario para crear una nueva categoría'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <CategoryFormFields form={form} />
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {initialData ? 'Guardar Cambios' : 'Crear Categoría'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
