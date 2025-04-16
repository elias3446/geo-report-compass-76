
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader, PlusCircle, Lock, Unlock, UserX } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseStatus } from '@/hooks/useSupabaseStatus';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  active: boolean;
}

type UserRole = 'admin' | 'web_supervisor' | 'mobile_citizen' | 'mobile_technician';

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin, signUp } = useAuth();
  const { status } = useSupabaseStatus();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'mobile_citizen' as UserRole,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'connected') {
      fetchUsers();
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get profiles with joined user roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          active
        `);

      if (profilesError) throw profilesError;

      // Get user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get user emails from auth.users (this requires admin privileges)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error fetching auth users:", authError);
        // We'll continue anyway, but emails might be missing
      }

      // Combine the data
      const usersWithRoles = profiles.map(profile => {
        const userRole = userRoles.find(ur => ur.user_id === profile.id);
        let authUserEmail = 'No email available';
        
        // Safely access authUsers if it exists and has a users property
        if (authUsers && authUsers.users) {
          const authUser = authUsers.users.find(au => au.id === profile.id);
          if (authUser && authUser.email) {
            authUserEmail = authUser.email;
          }
        }
        
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: authUserEmail,
          role: userRole?.role || 'unknown',
          active: profile.active
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: `Error al cargar usuarios: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setError(null);
      
      // Validation
      if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
        setError("Todos los campos son obligatorios");
        return;
      }
      
      if (newUser.password !== newUser.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
      
      if (newUser.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      
      // Create the user
      const { error: signUpError } = await signUp(
        newUser.email,
        newUser.password,
        {
          first_name: newUser.firstName,
          last_name: newUser.lastName
        }
      );
      
      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // We need to set the role manually since it's not part of the signUp function
      // This requires fetching the newly created user
      const { data: newUserData } = await supabase
        .from('profiles')
        .select('id')
        .eq('first_name', newUser.firstName)
        .eq('last_name', newUser.lastName)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (newUserData) {
        // First, remove any existing roles
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', newUserData.id);
          
        // Then add the new role
        await supabase
          .from('user_roles')
          .insert({
            user_id: newUserData.id,
            role: newUser.role
          });
      }

      // Reset form and close dialog
      setNewUser({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'mobile_citizen',
      });
      setIsAddDialogOpen(false);
      
      // Refresh user list
      fetchUsers();
      
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente"
      });
    } catch (error: any) {
      console.error('Error adding user:', error);
      setError(error.message || "Error al crear usuario");
    }
  };

  const toggleUserActive = async (userId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: !currentActive })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: !currentActive } : user
      ));

      toast({
        title: "Usuario actualizado",
        description: `Usuario ${!currentActive ? 'activado' : 'desactivado'} exitosamente`
      });
    } catch (error: any) {
      console.error('Error toggling user active status:', error);
      toast({
        title: "Error",
        description: `Error al actualizar usuario: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const changeUserRole = async (userId: string, newRole: UserRole) => {
    try {
      // First, remove any existing roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
        
      // Then add the new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole
        });

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Rol actualizado",
        description: "El rol del usuario ha sido actualizado exitosamente"
      });
    } catch (error: any) {
      console.error('Error changing user role:', error);
      toast({
        title: "Error",
        description: `Error al cambiar rol: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'web_supervisor', label: 'Supervisor Web' },
    { value: 'mobile_citizen', label: 'Ciudadano (Móvil)' },
    { value: 'mobile_technician', label: 'Técnico (Móvil)' }
  ];

  if (!isAdmin()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>
            No tienes permisos de administrador para acceder a esta sección
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Administra los usuarios del sistema</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Completa los datos para crear un nuevo usuario en el sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input 
                    id="firstName" 
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input 
                    id="lastName" 
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(value: UserRole) => setNewUser({...newUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleAddUser}>Crear Usuario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Loader className="mr-2 h-6 w-6 animate-spin" />
            <span>Cargando usuarios...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No hay usuarios registrados. Añade un nuevo usuario para comenzar.
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={(value: UserRole) => changeUserRole(user.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserActive(user.id, user.active)}
                      >
                        {user.active ? (
                          <Lock className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Unlock className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
