
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Edit, Trash2, MapPin, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Zone {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  report_count?: number;
}

const ZonesManager = () => {
  const { toast } = useToast();
  
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  
  // Form states
  const [zoneName, setZoneName] = useState('');
  const [zoneDescription, setZoneDescription] = useState('');
  const [zoneActive, setZoneActive] = useState(true);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  // Load zones
  useEffect(() => {
    const fetchZones = async () => {
      setLoading(true);
      try {
        // Fetch zones
        const { data: zonesData, error: zonesError } = await supabase
          .from('zones')
          .select('*');
          
        if (zonesError) {
          throw zonesError;
        }
        
        // Fetch report counts for each zone
        const zonesWithCounts = await Promise.all(
          zonesData.map(async (zone) => {
            const { count, error: countError } = await supabase
              .from('reports')
              .select('*', { count: 'exact', head: true })
              .eq('zone_id', zone.id);
              
            if (countError) {
              console.error("Error fetching report count:", countError);
              return { ...zone, report_count: 0 };
            }
            
            return { ...zone, report_count: count || 0 };
          })
        );
        
        setZones(zonesWithCounts);
      } catch (error) {
        console.error("Error fetching zones:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las zonas",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchZones();
  }, [toast]);

  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    setZoneName(zone.name);
    setZoneDescription(zone.description || '');
    setZoneActive(zone.active);
    setOpenEditDialog(true);
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta zona?")) {
      return;
    }
    
    try {
      const { data: reportsCount, error: countError } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('zone_id', zoneId);
        
      if (countError) {
        throw countError;
      }
      
      // If there are reports associated with this zone, don't allow deletion
      if (reportsCount && reportsCount > 0) {
        toast({
          title: "No se puede eliminar",
          description: "Esta zona tiene reportes asociados. Desactívela en lugar de eliminarla.",
          variant: "destructive"
        });
        return;
      }
      
      const { error: deleteError } = await supabase
        .from('zones')
        .delete()
        .eq('id', zoneId);
        
      if (deleteError) {
        throw deleteError;
      }
      
      // Update the local state
      setZones(zones.filter(zone => zone.id !== zoneId));
      
      toast({
        title: "Zona eliminada",
        description: "La zona ha sido eliminada correctamente"
      });
    } catch (error) {
      console.error("Error deleting zone:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la zona",
        variant: "destructive"
      });
    }
  };

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('zones')
        .insert({
          name: zoneName,
          description: zoneDescription || null,
          active: zoneActive
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      // Add the new zone to the state
      if (data && data.length > 0) {
        setZones([...zones, { ...data[0], report_count: 0 }]);
      }
      
      // Reset form
      setZoneName('');
      setZoneDescription('');
      setZoneActive(true);
      setOpenCreateDialog(false);
      
      toast({
        title: "Zona creada",
        description: "La zona ha sido creada correctamente"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la zona",
        variant: "destructive"
      });
    }
  };

  const handleUpdateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone) return;
    
    try {
      const { error } = await supabase
        .from('zones')
        .update({
          name: zoneName,
          description: zoneDescription || null,
          active: zoneActive
        })
        .eq('id', editingZone.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setZones(zones.map(zone => 
        zone.id === editingZone.id 
          ? { 
              ...zone, 
              name: zoneName, 
              description: zoneDescription, 
              active: zoneActive 
            } 
          : zone
      ));
      
      setOpenEditDialog(false);
      
      toast({
        title: "Zona actualizada",
        description: "La zona ha sido actualizada correctamente"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la zona",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Zonas</CardTitle>
          <CardDescription>Administrar zonas geográficas</CardDescription>
        </div>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="h-8">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Zona
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Zona</DialogTitle>
              <DialogDescription>
                Complete los campos para crear una nueva zona geográfica.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateZone}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="zoneName">Nombre de la Zona</Label>
                  <Input 
                    id="zoneName" 
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    placeholder="Ej: Zona Norte"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoneDescription">Descripción</Label>
                  <Textarea 
                    id="zoneDescription" 
                    value={zoneDescription}
                    onChange={(e) => setZoneDescription(e.target.value)}
                    placeholder="Descripción de la zona"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="zoneActive" 
                    checked={zoneActive}
                    onCheckedChange={setZoneActive}
                  />
                  <Label htmlFor="zoneActive">Zona Activa</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Crear Zona</Button>
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
                  <TableHead>Descripción</TableHead>
                  <TableHead>Reportes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No hay zonas registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  zones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell>{zone.name}</TableCell>
                      <TableCell>{zone.description || "Sin descripción"}</TableCell>
                      <TableCell>{zone.report_count || 0} reportes</TableCell>
                      <TableCell>
                        <Badge variant={zone.active ? 'success' : 'destructive'}>
                          {zone.active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditZone(zone)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteZone(zone.id)}>
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
              <DialogTitle>Editar Zona</DialogTitle>
              <DialogDescription>
                Actualice la información de la zona.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateZone}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editZoneName">Nombre de la Zona</Label>
                  <Input 
                    id="editZoneName" 
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editZoneDescription">Descripción</Label>
                  <Textarea 
                    id="editZoneDescription" 
                    value={zoneDescription}
                    onChange={(e) => setZoneDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="editZoneActive" 
                    checked={zoneActive}
                    onCheckedChange={setZoneActive}
                  />
                  <Label htmlFor="editZoneActive">Zona Activa</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Actualizar Zona</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ZonesManager;
