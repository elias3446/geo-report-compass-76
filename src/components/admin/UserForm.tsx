
import React from 'react';
import { useForm } from 'react-hook-form';
import { User, UserRole, MobileUserType } from '../../types/admin';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
  initialData?: User;
}

const UserForm: React.FC<UserFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData 
}) => {
  const defaultValues = initialData 
  ? { ...initialData } 
  : {
      name: '',
      email: '',
      role: 'mobile' as UserRole,
      active: true,
      mobileUserType: 'citizen' as MobileUserType,
      password: '',
    };
  
  const form = useForm<Omit<User, 'id' | 'createdAt' | 'lastLogin'>>({
    defaultValues
  });

  const selectedRole = form.watch('role');
  const isMobileUser = selectedRole === 'mobile';

  // Esta función maneja el cierre y reseteo del formulario
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (data: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    // Si no es usuario móvil, eliminamos el campo mobileUserType
    if (data.role !== 'mobile') {
      delete data.mobileUserType;
    }
    
    onSubmit(data);
    handleClose(); // Aseguramos que el formulario se cierre después del envío
  };

  // Resetear el formulario cuando se abre el diálogo con nuevos datos
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({ ...initialData });
      } else {
        form.reset({
          name: '',
          email: '',
          role: 'mobile',
          active: true,
          mobileUserType: 'citizen',
          password: '',
        });
      }
    }
  }, [open, initialData, form]);

  // Si el dialog no está abierto, no renderizamos nada
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
            {initialData ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Modifica los detalles del usuario seleccionado' 
              : 'Completa el formulario para crear un nuevo usuario'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'El nombre es obligatorio' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              rules={{ 
                required: 'El email es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="correo@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              rules={{ 
                required: initialData ? false : 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={initialData ? "Dejar en blanco para mantener la actual" : "Contraseña"}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {initialData ? "Deja en blanco para mantener la contraseña actual" : "Mínimo 6 caracteres"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol del Usuario</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="supervisor">Supervisor Web</SelectItem>
                      <SelectItem value="mobile">Usuario Móvil</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Define los permisos y acceso del usuario en el sistema.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isMobileUser && (
              <FormField
                control={form.control}
                name="mobileUserType"
                rules={{ required: 'El tipo de usuario móvil es obligatorio' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Usuario Móvil</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="citizen">Ciudadano</SelectItem>
                        <SelectItem value="technician">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Usuario activo</FormLabel>
                    <FormDescription>
                      Determina si el usuario puede acceder al sistema
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
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
                {initialData ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
