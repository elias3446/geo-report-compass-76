
import React from 'react';
import { User } from '../../types/admin';
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
import { useUserForm, UserFormData } from '@/hooks/useUserForm';
import UserFormFields from './UserFormFields';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: User;
  currentUser?: { id: string; name: string };
}

const UserForm: React.FC<UserFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData,
  currentUser
}) => {
  const {
    form,
    handleClose,
    handleSubmit,
    isMobileUser,
    isEditing
  } = useUserForm({
    initialData,
    onSubmit,
    onClose,
    currentUser
  });

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
            {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica los detalles del usuario seleccionado' 
              : 'Completa el formulario para crear un nuevo usuario'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <UserFormFields 
              form={form}
              isMobileUser={isMobileUser}
              isEditing={isEditing}
            />
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
