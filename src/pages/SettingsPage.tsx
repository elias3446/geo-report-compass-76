
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DatabaseDiagram from '@/components/database/DatabaseDiagram';
import ProfileSettings from '@/components/settings/ProfileSettings';
import DatabaseStatus from '@/components/settings/DatabaseStatus';
import CategoriesManager from '@/components/settings/CategoriesManager';
import UserManagement from '@/components/settings/UserManagement';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const SettingsPage = () => {
  const { signOut, user, isAdmin, isWebSupervisor } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  // Check if user has admin permissions
  const hasAdminAccess = isAdmin() || isWebSupervisor();

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Cuenta</TabsTrigger>
            {isAdmin() && (
              <TabsTrigger value="users">Usuarios</TabsTrigger>
            )}
            {hasAdminAccess && (
              <>
                <TabsTrigger value="categories">Categorías</TabsTrigger>
                <TabsTrigger value="database">Base de Datos</TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="account">
            <div className="grid gap-6">
              <ProfileSettings />
            </div>
          </TabsContent>
          
          {isAdmin() && (
            <TabsContent value="users">
              <div className="grid gap-6">
                <UserManagement />
              </div>
            </TabsContent>
          )}
          
          {hasAdminAccess && (
            <TabsContent value="categories">
              <div className="grid gap-6">
                <CategoriesManager />
              </div>
            </TabsContent>
          )}
          
          {hasAdminAccess && (
            <TabsContent value="database">
              <div className="grid gap-6">
                <DatabaseStatus />
                <DatabaseDiagram />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
