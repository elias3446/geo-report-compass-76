
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon, PlusCircle, Trash2, Save } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSupabaseStatus } from '@/hooks/useSupabaseStatus';

// Define the report priority type to match the database enum
type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

interface Category {
  id: string;
  name: string;
  description: string | null;
  default_priority: ReportPriority;
  icon: string | null;
  color: string | null;
  active: boolean;
}

const CategoriesManager: React.FC = () => {
  const { toast } = useToast();
  const { status } = useSupabaseStatus();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    default_priority: 'medium',
    icon: '',
    color: '#3B82F6', // Default blue
    active: true
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'connected') {
      fetchCategories();
    }
  }, [status]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      setCategories(data as Category[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al cargar categorías: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        toast({
          title: "Error",
          description: "El nombre de la categoría es obligatorio",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory.name,
          description: newCategory.description || null,
          default_priority: newCategory.default_priority,
          icon: newCategory.icon || null,
          color: newCategory.color || null,
          active: newCategory.active
        })
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data as Category]);
      setIsAddDialogOpen(false);
      
      // Reset the form
      setNewCategory({
        name: '',
        description: '',
        default_priority: 'medium',
        icon: '',
        color: '#3B82F6',
        active: true
      });

      toast({
        title: "Éxito",
        description: "Categoría añadida correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al añadir categoría: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async () => {
    try {
      if (!editingCategory) return;

      if (!editingCategory.name.trim()) {
        toast({
          title: "Error",
          description: "El nombre de la categoría es obligatorio",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .update({
          name: editingCategory.name,
          description: editingCategory.description,
          default_priority: editingCategory.default_priority,
          icon: editingCategory.icon,
          color: editingCategory.color,
          active: editingCategory.active
        })
        .eq('id', editingCategory.id)
        .select()
        .single();

      if (error) throw error;

      // Update the category in the state
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? (data as Category) : cat
      ));
      
      setIsEditDialogOpen(false);
      setEditingCategory(null);

      toast({
        title: "Éxito",
        description: "Categoría actualizada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al actualizar categoría: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      if (!confirm("¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.")) {
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove the category from the state
      setCategories(categories.filter(cat => cat.id !== id));

      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al eliminar categoría: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const priorityOptions: { value: ReportPriority; label: string }[] = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Categorías</CardTitle>
          <CardDescription>Administra las categorías de reportes</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nueva Categoría</DialogTitle>
              <DialogDescription>
                Completa los detalles para añadir una nueva categoría de reportes
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={newCategory.description || ''}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Prioridad por Defecto
                </Label>
                <Select
                  value={newCategory.default_priority}
                  onValueChange={(value: ReportPriority) => setNewCategory({...newCategory, default_priority: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icono (clase CSS)
                </Label>
                <Input
                  id="icon"
                  value={newCategory.icon || ''}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  placeholder="ej: map-pin, alert-triangle"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={newCategory.color || '#3B82F6'}
                    onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                    className="w-24"
                  />
                  <Input
                    value={newCategory.color || '#3B82F6'}
                    onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                    placeholder="#HEX o nombre de color"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  Activa
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="active"
                    checked={newCategory.active}
                    onCheckedChange={(checked) => setNewCategory({...newCategory, active: checked})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleAddCategory}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <ReloadIcon className="mr-2 h-6 w-6 animate-spin" />
            <span>Cargando categorías...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No hay categorías registradas. Añade una nueva categoría para comenzar.
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      {priorityOptions.find(opt => opt.value === category.default_priority)?.label || category.default_priority}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color || '#3B82F6' }}
                        />
                        {category.color}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {category.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCategory(category);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoría</DialogTitle>
              <DialogDescription>
                Actualiza los detalles de la categoría
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Descripción
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-priority" className="text-right">
                    Prioridad por Defecto
                  </Label>
                  <Select
                    value={editingCategory.default_priority}
                    onValueChange={(value: ReportPriority) => 
                      setEditingCategory({...editingCategory, default_priority: value})
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona una prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-icon" className="text-right">
                    Icono (clase CSS)
                  </Label>
                  <Input
                    id="edit-icon"
                    value={editingCategory.icon || ''}
                    onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                    placeholder="ej: map-pin, alert-triangle"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-color" className="text-right">
                    Color
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="edit-color"
                      type="color"
                      value={editingCategory.color || '#3B82F6'}
                      onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                      className="w-24"
                    />
                    <Input
                      value={editingCategory.color || '#3B82F6'}
                      onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                      placeholder="#HEX o nombre de color"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-active" className="text-right">
                    Activa
                  </Label>
                  <div className="col-span-3">
                    <Switch
                      id="edit-active"
                      checked={editingCategory.active}
                      onCheckedChange={(checked) => 
                        setEditingCategory({...editingCategory, active: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleUpdateCategory}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CategoriesManager;
