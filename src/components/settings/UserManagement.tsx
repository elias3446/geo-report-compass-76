
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Edit, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  active: boolean;
}

const UserManagement = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('mobile_citizen');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Load users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
          
        if (profilesError) {
          throw profilesError;
        }
        
        // Fetch roles for each profile
        const usersWithRoles = await Promise.all(
          profiles.map(async (profile) => {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', profile.id)
              .single();
              
            if (roleError && roleError.code !== 'PGRST116') {
              console.error("Error fetching role:", roleError);
            }
            
            return {
              ...profile,
              role: roleData?.role || 'unknown'
            };
          })
        );
        
        setUsers(usersWithRoles);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setSelectedRole(user.role);
    setOpenEditDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }
    
    try {
      // First remove from user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
        
      if (roleError) {
        throw roleError;
      }
      
      // Then update the profile to set as inactive
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ active: false })
        .eq('id', userId);
        
      if (profileError) {
        throw profileError;
      }
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: false } : user
      ));
      
      toast({
        title: "Usuario desactivado",
        description: "El usuario ha sido desactivado correctamente"
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive"
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create the user with auth
      const { error: signUpError } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      // Reset form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setSelectedRole('mobile_citizen');
      setOpenCreateDialog(false);
      
      // Refresh the user list
      // This is a simplified approach - in production, you'd want to fetch the new user data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado correctamente"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', editingUser.id);
        
      if (profileError) {
        throw profileError;
      }
      
      // Update role if changed
      if (editingUser.role !== selectedRole) {
        const { error: deleteRoleError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', editingUser.id);
          
        if (deleteRoleError) {
          throw deleteRoleError;
        }
        
        const { error: insertRoleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: editingUser.id,
            role: selectedRole
          });
          
        if (insertRoleError) {
          throw insertRoleError;
        }
      }
      
      // Update local state
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, first_name: firstName, last_name: lastName, role: selectedRole } 
          : user
      ));
      
      setOpenEditDialog(false);
      
      toast({
        title: "Usuario actualizado",
        description: "El usuario ha sido actualizado correctamente"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Administrar usuarios de la plataforma</CardDescription>
        </div>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="h-8">
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Complete los campos para crear un nuevo usuario en el sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" this
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={setSelectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="web_supervisor">Supervisor Web</SelectItem>
                      <SelectItem value="mobile_technician">Técnico Móvil</SelectItem>
                      <SelectItem value="mobile_citizen">Ciudadano Móvil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Crear Usuario</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No hay usuarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.first_name} {user.last_name}</TableCell>
                      <TableCell>{user.email || "Sin correo"}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' && 'Administrador'}
                          {user.role === 'web_supervisor' && 'Supervisor Web'}
                          {user.role === 'mobile_technician' && 'Técnico Móvil'}
                          {user.role === 'mobile_citizen' && 'Ciudadano Móvil'}
                          {user.role === 'unknown' && 'Sin rol asignado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.active ? 'success' : 'destructive'}>
                          {user.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Actualice la información del usuario.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName">Nombre</Label>
                    <Input 
                      id="editFirstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName">Apellido</Label>
                    <Input 
                      id="editLastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRole">Rol</Label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={setSelectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="web_supervisor">Supervisor Web</SelectItem>
                      <SelectItem value="mobile_technician">Técnico Móvil</SelectItem>
                      <SelectItem value="mobile_citizen">Ciudadano Móvil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Actualizar Usuario</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
