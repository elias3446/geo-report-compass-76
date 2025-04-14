
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import MapView from '@/components/map/MapView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { TimeFilterProvider } from '@/context/TimeFilterContext';
import { getReports } from '@/services/reportService';
import { exportReportsToCSV } from '@/components/map/utils/ExportUtils';

const MapPage = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleExport = () => {
    try {
      // Obtener los reportes
      const allReports = getReports();
      
      // Filtrar según la pestaña activa
      let filtered = [...allReports];
      if (activeFilter !== 'all') {
        if (activeFilter === "open") {
          filtered = filtered.filter(report => report.status === "Open");
        } else if (activeFilter === "progress") {
          filtered = filtered.filter(report => report.status === "In Progress");
        } else if (activeFilter === "resolved") {
          filtered = filtered.filter(report => report.status === "Resolved");
        }
      }
      
      // Verificar si hay datos para exportar
      if (filtered.length === 0) {
        toast.info("No hay datos para exportar", {
          description: "No hay ubicaciones que coincidan con los filtros actuales."
        });
        return;
      }
      
      // Utilizar la función de utilidad para exportar
      exportReportsToCSV(filtered);
      
      toast.success('Exportación exitosa', {
        description: `${filtered.length} ubicaciones de reportes exportadas a CSV`
      });
    } catch (error) {
      console.error("Error de exportación:", error);
      toast.error("Error de exportación", {
        description: "Hubo un error al exportar los datos del mapa. Por favor, inténtelo nuevamente."
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold">Mapa de Reportes</h1>
          <Button 
            onClick={handleExport} 
            className="flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            Exportar Datos
          </Button>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Vista de Mapa</CardTitle>
            <CardDescription>
              Visualización geográfica de todos los reportes
            </CardDescription>
            <Tabs 
              defaultValue="all" 
              className="mt-2"
              onValueChange={setActiveFilter}
            >
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="open">Abiertos</TabsTrigger>
                <TabsTrigger value="progress">En Progreso</TabsTrigger>
                <TabsTrigger value="resolved">Resueltos</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] md:h-[600px]">
              <TimeFilterProvider>
                <MapView 
                  height="100%" 
                  filterStatus={activeFilter} 
                  isStandalone={true} 
                />
              </TimeFilterProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MapPage;
