import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Users, Map, FileText, Search, Shield, UserCog, Smartphone, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import UserTable from '@/components/admin/UserTable';
import UserForm from '@/components/admin/UserForm';
import CategoryList from '@/components/admin/CategoryList';
import CategoryForm from '@/components/admin/CategoryForm';
import SettingsForm from '@/components/admin/SettingsForm';
import ReportsTable from '@/components/admin/ReportsTable';
import RoleManageTable from '@/components/admin/RoleManageTable';
import StatusManageTable from '@/components/admin/StatusManageTable';
import { User, Category, SystemSetting, Report, UserRole } from '@/types/admin';
import { 
  getUsers, createUser, updateUser,
  getCategories, createCategory, updateCategory, deleteCategory,
  getSettings, updateSetting
} from '@/services/adminService';
import { getReports } from '@/services/reportService';
import { useUsers } from '@/contexts/UserContext';

const Admin = () => {
  // State for users tab
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUserFilter, setActiveUserFilter] = useState<string>('all');
  const { 
    users, setUsers, deleteUser, 
    totalUsers, adminUsers, supervisorUsers, mobileUsers, 
    getFilteredUsers 
  } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  
  // State for categories tab
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  
  // State for settings tab
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  
  // Reports
  const [reports, setReports] = useState<any[]>([]);
  const [reportCounts, setReportCounts] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  // Cargar datos iniciales y actualizar contadores
  const loadReportsData = () => {
    const allReports = getReports();
    setReports(allReports);
    
    // Calcular contadores basados en los datos actuales
    updateReportCounts(allReports);
  };

  // Función para actualizar los contadores de reportes
  const updateReportCounts = (reportsList: any[]) => {
    setReportCounts({
      total: reportsList.length,
      pending: reportsList.filter(r => r.status === 'Open' || r.status === 'draft').length,
      inProgress: reportsList.filter(r => r.status === 'In Progress' || r.status === 'submitted').length,
      resolved: reportsList.filter(r => r.status === 'Resolved' || r.status === 'approved').length
    });
  };

  // Load initial data
  useEffect(() => {
    const allUsers = getFilteredUsers('all');
    setFilteredUsers(allUsers);
    
    loadReportsData();
    setCategories(getCategories());
    setSettings(getSettings());
  }, [getFilteredUsers]);

  // Filter users based on search and role filter
  useEffect(() => {
    let filtered = getFilteredUsers(activeUserFilter);

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((user) => {
        // Buscar por nombre, email, rol, estado o fecha de último acceso
        const nameMatch = user.name.toLowerCase().includes(lowerQuery);
        const emailMatch = user.email.toLowerCase().includes(lowerQuery);
        const roleText = 
          user.role === 'admin' ? 'administrador' :
          user.role === 'supervisor' ? 'supervisor' :
          user.role === 'mobile' ? 'usuario móvil' :
          user.role === 'viewer' ? 'visualizador' : '';
        const roleMatch = roleText.toLowerCase().includes(lowerQuery);
        const estadoText = user.active ? 'activo' : 'inactivo';
        const estadoMatch = estadoText.includes(lowerQuery);

        // Comparar fecha último acceso (formato: dd/mm/yyyy hh:mm, "nunca" o similar)
        let lastLoginMatch = false;
        if (user.lastLogin) {
          const options: Intl.DateTimeFormatOptions = { 
            day: "2-digit", month: "2-digit",
            year: "numeric", hour: "2-digit", minute: "2-digit"
          };
          const formatted = user.lastLogin
            .toLocaleString("es-ES", options)
            .replace(',', '').replace(/\./g, '').toLowerCase();
          lastLoginMatch = formatted.includes(lowerQuery);
        } else {
          // "Nunca" (por si buscan la palabra "nunca")
          lastLoginMatch = 'nunca'.includes(lowerQuery);
        }

        return nameMatch || emailMatch || roleMatch || estadoMatch || lastLoginMatch;
      });
    }
    // Ordenar por fecha de creación descendente (más recientes primero)
    filtered = [...filtered].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    setFilteredUsers(filtered);
  }, [searchQuery, activeUserFilter, getFilteredUsers, users]);

  // User management handlers
  const handleCreateUser = (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      const newUser = createUser(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
      toast({
        title: "Usuario creado",
        description: `El usuario ${newUser.name} ha sido creado correctamente.`,
      });
    } catch (error) {
      toast({
        title: "Error al crear usuario",
        description: "Ha ocurrido un error al crear el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      if (!editingUser) return;
      const updatedUser = updateUser(editingUser.id, userData);
      if (updatedUser) {
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ));
        toast({
          title: "Usuario actualizado",
          description: `El usuario ${updatedUser.name} ha sido actualizado correctamente.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error al actualizar usuario",
        description: "Ha ocurrido un error al actualizar el usuario.",
        variant: "destructive",
      });
    }
  };

  const closeUserForm = () => {
    setUserFormOpen(false);
    setEditingUser(undefined);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(undefined);
    setTimeout(() => {
      setEditingUser(user);
      setUserFormOpen(true);
    }, 0);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
  };

  // Category management handlers
  const handleCreateCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      const newCategory = createCategory(categoryData);
      setCategories(prevCategories => [...prevCategories, newCategory]);
      toast({
        title: "Categoría creada",
        description: `La categoría ${newCategory.name} ha sido creada correctamente.`,
      });
    } catch (error) {
      toast({
        title: "Error al crear categoría",
        description: "Ha ocurrido un error al crear la categoría.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      if (!editingCategory) return;
      const updatedCategory = updateCategory(editingCategory.id, categoryData);
      if (updatedCategory) {
        setCategories(prevCategories => prevCategories.map(category => 
          category.id === updatedCategory.id ? updatedCategory : category
        ));
        toast({
          title: "Categoría actualizada",
          description: `La categoría ${updatedCategory.name} ha sido actualizada correctamente.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error al actualizar categoría",
        description: "Ha ocurrido un error al actualizar la categoría.",
        variant: "destructive",
      });
    }
  };

  const closeCategoryForm = () => {
    setCategoryFormOpen(false);
    setEditingCategory(undefined);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(undefined);
    setTimeout(() => {
      setEditingCategory(category);
      setCategoryFormOpen(true);
    }, 0);
  };

  const handleDeleteCategory = (categoryId: string) => {
    try {
      // Importamos la función de eliminación desde el servicio
      const deleted = deleteCategory(categoryId);
      
      if (deleted) {
        // Actualizar el estado local solo si la eliminación fue exitosa
        setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
        toast({
          title: "Categoría eliminada",
          description: "La categoría ha sido eliminada correctamente.",
        });
      } else {
        toast({
          title: "Error al eliminar",
          description: "No se puede eliminar la categoría porque está siendo utilizada en reportes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      toast({
        title: "Error al eliminar",
        description: "Ha ocurrido un error al eliminar la categoría.",
        variant: "destructive",
      });
    }
  };

  const handleToggleCategoryActive = (categoryId: string, active: boolean) => {
    const updatedCategory = updateCategory(categoryId, { active });
    if (updatedCategory) {
      setCategories(prevCategories => prevCategories.map(category => 
        category.id === categoryId ? { ...category, active } : category
      ));
      toast({
        title: active ? "Categoría activada" : "Categoría desactivada",
        description: `La categoría ha sido ${active ? 'activada' : 'desactivada'} correctamente.`,
      });
    }
  };

  // Settings handlers
  const handleSaveSettings = (updatedSettings: SystemSetting[]) => {
    updatedSettings.forEach(setting => {
      updateSetting(setting.id, setting.value);
    });
    setSettings([...updatedSettings]);
  };

  // Report handlers
  const handleUpdateReportStatus = (reportId: string, status: string) => {
    try {
      // Update the local state for immediate UI feedback
      const updatedReports = reports.map(report => {
        if (report.id.toString() === reportId) {
          return { ...report, status };
        }
        return report;
      });
      
      setReports(updatedReports);
      updateReportCounts(updatedReports);
      
      toast({
        title: "Estado actualizado",
        description: `El estado del reporte ha sido actualizado correctamente.`,
      });
    } catch (error) {
      console.error('Error al actualizar el estado del reporte:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el estado del reporte",
        variant: "destructive"
      });
    }
  };

  const handleAssignReport = (reportId: string, userId: string) => {
    try {
      // Update the local state for immediate UI feedback
      const updatedReports = reports.map(report => {
        if (report.id.toString() === reportId) {
          return { ...report, assignedTo: userId };
        }
        return report;
      });
      
      setReports(updatedReports);
      
      toast({
        title: "Reporte asignado",
        description: `El reporte ha sido asignado correctamente.`,
      });
    } catch (error) {
      console.error('Error al asignar el reporte:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al asignar el reporte",
        variant: "destructive"
      });
    }
  };

  // Manejar la eliminación de un reporte
  const handleReportDeleted = (reportId: number) => {
    // Filtrar el reporte eliminado de la lista local
    const updatedReports = reports.filter(report => report.id !== reportId);
    setReports(updatedReports);
    
    // Actualizar los contadores
    updateReportCounts(updatedReports);

    console.log("Reporte eliminado y contadores actualizados:", {
      reportId,
      newTotalReports: updatedReports.length
    });
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Administración</h1>
        <p className="text-muted-foreground mt-1">
          Gestión de usuarios, reportes y configuración del sistema
        </p>
      </div>
      
      <Tabs defaultValue="users" className="space-y-4">
        
      <TabsList>
        <TabsTrigger value="users">Usuarios</TabsTrigger>
        <TabsTrigger value="reports">Reportes</TabsTrigger>
        <TabsTrigger value="categories">Categorías</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="report-status">Estados de Reporte</TabsTrigger>
        <TabsTrigger value="settings">Configuración</TabsTrigger>
      </TabsList>

      
        <TabsContent value="users" className="space-y-4">
          <div className="border rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
                <p className="text-gray-500">Administra los usuarios del sistema</p>
              </div>
              <Button 
                className="flex items-center"
                onClick={() => {
                  setEditingUser(undefined);
                  setUserFormOpen(true);
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Buscar usuarios..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              <Button 
                variant={activeUserFilter === 'all' ? 'default' : 'outline'} 
                className="flex items-center justify-center"
                onClick={() => setActiveUserFilter('all')}
              >
                <Users className="mr-2 h-4 w-4" />
                Todos ({totalUsers})
              </Button>
              <Button 
                variant={activeUserFilter === 'admin' ? 'default' : 'outline'} 
                className="flex items-center justify-center"
                onClick={() => setActiveUserFilter('admin')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Administradores ({adminUsers})
              </Button>
              <Button 
                variant={activeUserFilter === 'supervisor' ? 'default' : 'outline'} 
                className="flex items-center justify-center"
                onClick={() => setActiveUserFilter('supervisor')}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Supervisores ({supervisorUsers})
              </Button>
              <Button 
                variant={activeUserFilter === 'mobile' ? 'default' : 'outline'} 
                className="flex items-center justify-center"
                onClick={() => setActiveUserFilter('mobile')}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Usuarios Móviles ({mobileUsers})
              </Button>
            </div>
            
            <UserTable 
              onEdit={handleEditUser}
              filteredUsers={filteredUsers}
            />

            {userFormOpen && (
              <UserForm 
                open={userFormOpen}
                onClose={closeUserForm}
                onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                initialData={editingUser}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestión de Reportes</CardTitle>
                <CardDescription>
                  Administra y supervisa todos los reportes del sistema
                </CardDescription>
              </div>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Exportar Reportes
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{reportCounts.total}</div>
                    <p className="text-xs text-muted-foreground">Total reportes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 flex items-center gap-2">
                    <div>
                      <div className="text-2xl font-bold">{reportCounts.pending}</div>
                      <p className="text-xs text-muted-foreground">Pendientes</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500 ml-auto" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{reportCounts.inProgress}</div>
                    <p className="text-xs text-muted-foreground">En progreso</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{reportCounts.resolved}</div>
                    <p className="text-xs text-muted-foreground">Resueltos</p>
                  </CardContent>
                </Card>
              </div>
              
              <ReportsTable 
                onUpdateStatus={handleUpdateReportStatus}
                onAssignReport={handleAssignReport}
                onReportDeleted={handleReportDeleted}
                currentUser={{ id: 'admin', name: 'Administrador' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Categorías de Reportes</h2>
            <Button 
              onClick={() => {
                setEditingCategory(undefined);
                setCategoryFormOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Categoría
            </Button>
          </div>
          
          <CategoryList 
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onToggleActive={handleToggleCategoryActive}
          />

          {categoryFormOpen && (
            <CategoryForm 
              open={categoryFormOpen}
              onClose={closeCategoryForm}
              onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
              initialData={editingCategory}
            />
          )}
        </TabsContent>
        
      <TabsContent value="roles" className="space-y-4">
        <RoleManageTable />
      </TabsContent>
      <TabsContent value="report-status" className="space-y-4">
        <StatusManageTable />
      </TabsContent>

      
        <TabsContent value="settings" className="space-y-4">
          <SettingsForm 
            settings={settings}
            onSave={handleSaveSettings}
          />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Admin;
