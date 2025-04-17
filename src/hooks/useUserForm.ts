
import { useForm } from 'react-hook-form';
import { User, UserRole, MobileUserType } from '../types/admin';
import { registerAdminActivity } from '@/services/activityService';

export interface UserFormData extends Omit<User, 'id' | 'createdAt' | 'lastLogin'> {
  password?: string;
}

interface UseUserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData) => void;
  onClose: () => void;
  currentUser?: { id: string; name: string };
}

export const useUserForm = ({
  initialData,
  onSubmit,
  onClose,
  currentUser = { id: 'admin', name: 'Administrador' }
}: UseUserFormProps) => {
  const defaultValues: UserFormData = initialData 
    ? { ...initialData } 
    : {
        name: '',
        email: '',
        role: 'mobile',
        active: true,
        mobileUserType: 'citizen',
        password: '',
      };
  
  const form = useForm<UserFormData>({
    defaultValues
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (data: UserFormData) => {
    if (data.role !== 'mobile') {
      delete data.mobileUserType;
    }
    
    if (initialData) {
      registerAdminActivity({
        type: 'user_updated',
        title: 'Usuario actualizado',
        description: `Se ha actualizado la información del usuario "${data.name}"`,
        userId: currentUser.id,
        userName: currentUser.name,
        relatedItemId: initialData.id
      });
    } else {
      registerAdminActivity({
        type: 'user_created',
        title: 'Usuario creado',
        description: `Se ha creado un nuevo usuario "${data.name}" con rol ${data.role}`,
        userId: currentUser.id,
        userName: currentUser.name
      });
    }
    
    onSubmit(data);
    handleClose();
  };

  const selectedRole = form.watch('role');
  const isMobileUser = selectedRole === 'mobile';

  return {
    form,
    handleClose,
    handleSubmit,
    isMobileUser,
    isEditing: !!initialData
  };
};
