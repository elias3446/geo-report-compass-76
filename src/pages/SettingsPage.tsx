
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DatabaseDiagram from '@/components/database/DatabaseDiagram';

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Cuenta</TabsTrigger>
            <TabsTrigger value="database">Base de Datos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>
                  Ajusta la configuración general de la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Configuración general de la aplicación. Esta sección será implementada en futuras actualizaciones.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de la Cuenta</CardTitle>
                <CardDescription>
                  Administra tu perfil y configuración de cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Configuración de cuenta del usuario. Esta sección será implementada en futuras actualizaciones.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="database">
            <DatabaseDiagram />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
