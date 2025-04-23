
import React from "react";
import SettingsForm from "@/components/admin/SettingsForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Aquí podrías importar settings iniciales desde contexto o api
const settings = [
  { id: "app_name", group: "general", key: "app_name", value: "GeoReport", description: "Nombre de la aplicación" },
];

const AdminSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Configuración del Sistema</CardTitle>
    </CardHeader>
    <CardContent>
      <SettingsForm settings={settings} onSave={()=>{}} />
    </CardContent>
  </Card>
);

export default AdminSettings;
