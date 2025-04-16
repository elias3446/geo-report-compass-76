
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader, PlusCircle, Trash2, MapPin } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useSupabaseStatus } from '@/hooks/useSupabaseStatus';
import { Badge } from "@/components/ui/badge";

interface Zone {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  report_count?: number;
}

const ZonesManager: React.FC = () => {
  const { toast } = useToast();
  const { status } = useSupabaseStatus();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newZone, setNewZone] = useState<Omit<Zone, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    active: true
  });
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [reportCounts, setReportCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (status === 'connected') {
      fetchZones();
    }
  }, [status]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      
      // Fetch all zones
      const { data: zonesData, error: zonesError } = await supabase
        .from('zones')
        .select('*')
        .order('name');

      if (zonesError) throw zonesError;

      // Fetch report counts for each zone
      const { data: reportData, error: reportError } = await supabase
        .from('reports')
        .select('zone_id, count')
        .groupBy('zone_id');

      if (reportError) throw reportError;

      // Create a map of zone_id to report count
      const counts: Record<string, number> = {};
      reportData?.forEach((item: any) => {
        if (item.zone_id) {
          counts[item.zone_id] = parseInt(item.count);
        }
      });

      setReportCounts(counts);
      setZones(zonesData as Zone[]);
    } catch (error: any) {
      console.error('Error fetching zones:', error);
      toast({
        title: "Error",
        description: `Error al cargar zonas: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddZone = async () => {
    try {
      if (!newZone.name.trim()) {
        toast({
          title: "Error",
          description: "El nombre de la zona es obligatorio",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('zones')
        .insert({
          name: newZone.name,
          description: newZone.description || null,
          active: newZone.active
        })
        .select()
        .single();

      if (error) throw error;

      setZones([...zones, data as Zone]);
      setIsAddDialogOpen(false);
      
      // Reset the form
      setNewZone({
        name: '',
        description: '',
        active: true
      });

      toast({
        title: "Éxito",
        description: "Zona añadida correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al añadir zona: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateZone = async () => {
    try {
      if (!editingZone) return;

      if (!editingZone.name.trim()) {
        toast({
          title: "Error",
          description: "El nombre de la zona es obligatorio",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('zones')
        .update({
          name: editingZone.name,
          description: editingZone.description,
          active: editingZone.active
        })
        .eq('id', editingZone.id)
        .select()
        .single();

      if (error) throw error;

      // Update the zone in the state
      setZones(zones.map(zone => 
        zone.id === editingZone.id ? (data as Zone) : zone
      ));
      
      setIsEditDialogOpen(false);
      setEditingZone(null);

      toast({
        title: "Éxito",
        description: "Zona actualizada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al actualizar zona: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteZone = async (id: string) => {
    // Check if zone has reports
    if (reportCounts[id] && reportCounts[id] > 0) {
      toast({
        title: "No se puede eliminar",
        description: "Esta zona tiene reportes asociados. Desactívela en lugar de eliminarla.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!confirm("¿Está seguro de que desea eliminar esta zona? Esta acción no se puede deshacer.")) {
        return;
      }

      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove the zone from the state
      setZones(zones.filter(zone => zone.id !== id));

      toast({
        title: "Éxito",
        description: "Zona eliminada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al eliminar zona: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const toggleZoneActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('zones')
        .update({ active: !currentActive })
        .eq('id', id);

      if (error) throw error;

      // Update the zone in the state
      setZones(zones.map(zone => 
        zone.id === id ? { ...zone, active: !currentActive } : zone
      ));

      toast({
        title: "Éxito",
        description: `Zona ${!currentActive ? 'activada' : 'desactivada'} correctamente`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Error al actualizar zona: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Zonas</CardTitle>
          <CardDescription>Administra las zonas geográficas de reportes</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Zona
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nueva Zona</DialogTitle>
              <DialogDescription>
                Completa los detalles para añadir una nueva zona geográfica
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newZone.name}
                  onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={newZone.description || ''}
                  onChange={(e) => setNewZone({...newZone, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  Activa
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="active"
                    checked={newZone.active}
                    onCheckedChange={(checked) => setNewZone({...newZone, active: checked})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleAddZone}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <Loader className="mr-2 h-6 w-6 animate-spin" />
            <span>Cargando zonas...</span>
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No hay zonas registradas. Añade una nueva zona para comenzar.
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Reportes</TableHead>
                  <TableHead>Fecha creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((zone) => (
                  <TableRow key={zone.id}>
                    <TableCell className="font-medium">{zone.name}</TableCell>
                    <TableCell>{zone.description || '-'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={zone.active ? "success" : "secondary"}
                        className={zone.active ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                      >
                        {zone.active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {reportCounts[zone.id] || 0} reportes
                    </TableCell>
                    <TableCell>{formatDate(zone.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingZone(zone);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleZoneActive(zone.id, zone.active)}
                        >
                          {zone.active ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteZone(zone.id)}
                          disabled={reportCounts[zone.id] > 0}
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

        {/* Edit Zone Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Zona</DialogTitle>
              <DialogDescription>
                Actualiza los detalles de la zona geográfica
              </DialogDescription>
            </DialogHeader>
            {editingZone && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingZone.name}
                    onChange={(e) => setEditingZone({...editingZone, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Descripción
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingZone.description || ''}
                    onChange={(e) => setEditingZone({...editingZone, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-active" className="text-right">
                    Activa
                  </Label>
                  <div className="col-span-3">
                    <Switch
                      id="edit-active"
                      checked={editingZone.active}
                      onCheckedChange={(checked) => 
                        setEditingZone({...editingZone, active: checked})
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
              <Button onClick={handleUpdateZone}>Guardar Cambios</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ZonesManager;
