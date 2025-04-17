
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserFormData } from '@/hooks/useUserForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
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

interface UserFormFieldsProps {
  form: UseFormReturn<UserFormData>;
  isMobileUser: boolean;
  isEditing: boolean;
}

const UserFormFields = ({ form, isMobileUser, isEditing }: UserFormFieldsProps) => {
  return (
    <>
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
          required: isEditing ? false : 'La contraseña es obligatoria',
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
                placeholder={isEditing ? "Dejar en blanco para mantener la actual" : "Contraseña"}
                {...field} 
              />
            </FormControl>
            <FormDescription>
              {isEditing ? "Deja en blanco para mantener la contraseña actual" : "Mínimo 6 caracteres"}
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
    </>
  );
};

export default UserFormFields;
