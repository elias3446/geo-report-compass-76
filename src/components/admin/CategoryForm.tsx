
import React from 'react';
import { useForm } from 'react-hook-form';
import { Category } from '../../types/admin';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { registerAdminActivity } from '@/services/activityService';

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Category, 'id' | 'createdAt'>) => void;
  initialData?: Category;
  currentUser?: { id: string; name: string }; // Usuario actual para el registro de actividad
}

const iconOptions = [
  { value: 'lightbulb', label: 'Bombilla' },
  { value: 'trash', label: 'Basura' },
  { value: 'road', label: 'Carretera' },
  { value: 'tree', label: 'Árbol' },
  { value: 'bench', label: 'Banco' },
  { value: 'water', label: 'Agua' },
  { value: 'construction', label: 'Construcción' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'category', label: 'Categoría' }
];

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData,
  currentUser = { id: 'admin', name: 'Administrador' } // Valor por defecto
}) => {
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

  // Esta función maneja el cierre y reseteo del formulario
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (data: Omit<Category, 'id' | 'createdAt'>) => {
    // Registrar la actividad antes de enviar los datos
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
          description: '',
          color: '#3b82f6',
          icon: 'category',
          active: true,
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
            <FormField
              control={form.control}
              name="name"
              rules={{ required: 'El nombre es obligatorio' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la categoría" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción de la categoría" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icono</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un icono" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Categoría activa</FormLabel>
                    <FormDescription>
                      Determina si la categoría estará disponible en la aplicación
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
