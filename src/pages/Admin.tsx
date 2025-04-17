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
import { User, Category, SystemSetting, Report, UserRole } from '@/types/admin';
import { 
  getUsers, getUsersByRole, searchUsers, getUsersStats, createUser, updateUser,
  getCategories, createCategory, updateCategory,
  getSettings, updateSetting
} from '@/services/adminService';
import { useReports } from '@/contexts/ReportContext';

const Admin = () => {
  // State for users tab
  const [searchQuery, setSearchQuery] = useState('');
  const [activeUserFilter, setActiveUserFilter] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  
  // State for categories tab
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  
  // State for settings tab
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  
  // Stats
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    supervisors: 0,
    mobile: 0
  });

  // Load initial data
  useEffect(() => {
    const allUsers = getUsers();
    setUsers(allUsers);
    setUserStats(getUsersStats());
    setCategories(getCategories());
    setSettings(getSettings());
  }, []);

  // Filter users based on search and role filter
  useEffect(() => {
    let filteredUsers = [];
    
    if (searchQuery) {
      filteredUsers = searchUsers(searchQuery);
    } else if (activeUserFilter === 'all') {
      filteredUsers = getUsers();
    } else {
      filteredUsers = getUsersByRole(activeUserFilter as UserRole);
    }
    
    setUsers(filteredUsers);
  }, [searchQuery, activeUserFilter]);

  // User management handlers
  const handleCreateUser = (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      const newUser = createUser(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
      setUserStats(getUsersStats());
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
        setUserStats(getUsersStats());
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
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    setUserStats(getUsersStats());
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente.",
    });
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
    setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada correctamente.",
    });
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

  const handleSaveSettings = (updatedSettings: SystemSetting[]) => {
    updatedSettings.forEach(setting => {
      updateSetting(setting.id, setting.value);
    });
    setSettings([...updatedSettings]);
  };

  const handleViewReport = (reportId: string) => {
    toast({
      title: "Ver reporte",
      description: `Navegando al detalle del reporte ${reportId}.`,
    });
  };

  const handleUpdateReportStatus = (reportId: string, status: string) => {
    const { updateReport } = useReports();
    updateReport(reportId, { status: status as 'draft' | 'submitted' | 'approved' | 'rejected' });
    
    toast({
      title: "Estado actualizado",
      description: `El estado del reporte ha sido actualizado correctamente.`,
    });
  };

  const handleAssignReport = (reportId: string, userId: string) => {
    const { updateReport } = useReports();
    updateReport(reportId, { assignedTo: userId });
    
    toast({
      title: "Reporte asignado",
      description: `El reporte ha sido asignado correctamente.`,
    });
  };

  // Get reports from context for the Reports tab
  const { reports: contextReports } = useReports();
  
  // Calculate report counts
  const reportCounts = {
    total: contextReports.length,
    pending: contextReports.filter(r => r.status === 'draft').length,
    inProgress: contextReports.filter(r => r.status === 'submitted').length,
    resolved: contextReports.filter(r => r.status === 'approved').length
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
                Todos ({userStats.total})
              </Button>
              <Button 
                variant={activeUserFilter === 'admin' ? 'default' : 'outline'} 
                className="flex items-center justify-center"
                onClick={() => setActiveUserFilter('admin')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Administradores ({userStats.admins})
              </Button>
              <Button 
                variant={activeUserFilter === 'supervisor' ? 'default' : 'outline'} 
                className="flex items-center justify-center"
                onClick={() => setActiveUserFilter('supervisor')}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Supervisores ({userStats.supervisors})
              </Button>
              <Button 
                variant={activeUserFilter === 'mobile' ? 'default' : 'outline'} 
                className="flex items-center justify-center"
                onClick={() => setActiveUserFilter('mobile')}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Usuarios Móviles ({userStats.mobile})
              </Button>
            </div>
            
            <UserTable 
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
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
                onViewReport={handleViewReport}
                onUpdateStatus={handleUpdateReportStatus}
                onAssignReport={handleAssignReport}
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
