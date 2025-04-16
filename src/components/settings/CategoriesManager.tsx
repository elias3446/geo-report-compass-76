
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  default_priority: string;
  icon: string | null;
  color: string | null;
  active: boolean;
}

const CategoriesManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    default_priority: 'medium',
    icon: '',
    color: '',
    active: true,
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      default_priority: 'medium',
      icon: '',
      color: '',
      active: true,
    });
    setCurrentCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      default_priority: category.default_priority || 'medium',
      icon: category.icon || '',
      color: category.color || '',
      active: category.active,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (currentCategory) {
        // Update
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description || null,
            default_priority: formData.default_priority,
            icon: formData.icon || null,
            color: formData.color || null,
            active: formData.active,
          })
          .eq('id', currentCategory.id);

        if (error) throw error;
        
        toast({
          title: "Categoría actualizada",
          description: "La categoría ha sido actualizada exitosamente",
        });
      } else {
        // Create
        const { error } = await supabase
          .from('categories')
          .insert([{
            name: formData.name,
            description: formData.description || null,
            default_priority: formData.default_priority,
            icon: formData.icon || null,
            color: formData.color || null,
            active: formData.active,
          }]);

        if (error) throw error;
        
        toast({
          title: "Categoría creada",
          description: "La categoría ha sido creada exitosamente",
        });
      }

      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la categoría: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente",
      });
      
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestión de Categorías</CardTitle>
            <CardDescription>
              Administra las categorías para los reportes
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{currentCategory ? "Editar" : "Nueva"} Categoría</DialogTitle>
                <DialogDescription>
                  {currentCategory 
                    ? "Actualiza los detalles de la categoría" 
                    : "Introduce la información para la nueva categoría"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default_priority">Prioridad por defecto</Label>
                    <Select
                      value={formData.default_priority}
                      onValueChange={(value) => handleSelectChange("default_priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="critical">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icono (nombre de Lucide o emoji)</Label>
                    <Input
                      id="icon"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="color">Color (código hexadecimal)</Label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                    />
                    {formData.color && (
                      <div className="flex items-center mt-2">
                        <div 
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: formData.color }}
                        />
                        <span>{formData.color}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="active">Estado</Label>
                    <Select
                      value={formData.active ? "true" : "false"}
                      onValueChange={(value) => handleSelectChange("active", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Activa</SelectItem>
                        <SelectItem value="false">Inactiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No hay categorías definidas. Crea una para empezar.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {category.color && (
                          <div 
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell>{category.description || "-"}</TableCell>
                    <TableCell>
                      <span className={`capitalize ${
                        category.default_priority === 'critical' ? 'text-destructive font-medium' :
                        category.default_priority === 'high' ? 'text-amber-500 font-medium' :
                        category.default_priority === 'medium' ? 'text-primary' :
                        'text-muted-foreground'
                      }`}>
                        {category.default_priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          {/* Same form as for creating new categories */}
                          <DialogHeader>
                            <DialogTitle>Editar Categoría</DialogTitle>
                            <DialogDescription>
                              Actualiza los detalles de la categoría
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Nombre</Label>
                                <Input
                                  id="edit-name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Descripción</Label>
                                <Input
                                  id="edit-description"
                                  name="description"
                                  value={formData.description}
                                  onChange={handleInputChange}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit-default_priority">Prioridad por defecto</Label>
                                <Select
                                  value={formData.default_priority}
                                  onValueChange={(value) => handleSelectChange("default_priority", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una prioridad" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Baja</SelectItem>
                                    <SelectItem value="medium">Media</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                    <SelectItem value="critical">Crítica</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit-icon">Icono (nombre de Lucide o emoji)</Label>
                                <Input
                                  id="edit-icon"
                                  name="icon"
                                  value={formData.icon}
                                  onChange={handleInputChange}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit-color">Color (código hexadecimal)</Label>
                                <Input
                                  id="edit-color"
                                  name="color"
                                  value={formData.color}
                                  onChange={handleInputChange}
                                />
                                {formData.color && (
                                  <div className="flex items-center mt-2">
                                    <div 
                                      className="w-6 h-6 rounded-full mr-2"
                                      style={{ backgroundColor: formData.color }}
                                    />
                                    <span>{formData.color}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="edit-active">Estado</Label>
                                <Select
                                  value={formData.active ? "true" : "false"}
                                  onValueChange={(value) => handleSelectChange("active", value === "true")}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un estado" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">Activa</SelectItem>
                                    <SelectItem value="false">Inactiva</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline">Cancelar</Button>
                              </DialogClose>
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                  </>
                                ) : (
                                  "Guardar"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoriesManager;
