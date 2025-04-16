
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DatabaseDiagram = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estructura de la Base de Datos</CardTitle>
        <CardDescription>
          Diagrama del modelo entidad-relación utilizado en la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="diagram">
          <TabsList className="w-full">
            <TabsTrigger value="diagram">Diagrama</TabsTrigger>
            <TabsTrigger value="description">Descripción</TabsTrigger>
          </TabsList>
          
          <TabsContent value="diagram" className="pt-4">
            <div className="overflow-auto border rounded-md p-4 bg-background">
              <pre className="text-xs font-mono whitespace-pre">
{`
+----------------+     +----------------+     +----------------+
|    profiles    |     |   user_roles   |     |     zones      |
+----------------+     +----------------+     +----------------+
| id (PK)        |<----| user_id (FK)   |     | id (PK)        |
| first_name     |     | role           |--+  | name           |
| last_name      |     | zone_id (FK)   |---->| description    |
| phone          |     | assigned_at    |     | boundary       |
| active         |     | created_at     |     | active         |
| created_at     |     | updated_at     |     | created_at     |
| updated_at     |     +----------------+     | updated_at     |
+----------------+             |              +----------------+
        ^                      |                      ^
        |                      |                      |
+----------------+     +----------------+     +----------------+
|     reports    |     |   categories   |     |  report_history|
+----------------+     +----------------+     +----------------+
| id (PK)        |     | id (PK)        |     | id (PK)        |
| title          |     | name           |     | report_id (FK) |--+
| description    |     | description    |     | user_id (FK)   |--|--+
| location       |     | default_priority|     | previous_status|  |  |
| address        |     | icon           |     | new_status     |  |  |
| status         |     | color          |     | previous_priority  |  |
| priority       |     | active         |     | new_priority   |  |  |
| category_id (FK)|---->| created_at     |     | comments       |  |  |
| zone_id (FK)   |---->| updated_at     |     | created_at     |  |  |
| reporter_id (FK)|--+  +----------------+     +----------------+  |  |
| assigned_to (FK)|--|--+                             |            |  |
| supervisor_id   |--|--|-----------------------------|------------|--+
| created_at     |  |  |                             |            |
| updated_at     |  |  |                             v            |
+----------------+  |  |                     +----------------+   |
        |           |  |                     |  attachments   |   |
        |           |  |                     +----------------+   |
        v           |  |                     | id (PK)        |   |
+----------------+  |  |                     | report_id (FK) |---+
|   feedback     |  |  |                     | user_id (FK)   |---+
+----------------+  |  |                     | file_path      |
| id (PK)        |  |  |                     | file_type      |
| report_id (FK) |--+  |                     | description    |
| user_id (FK)   |-----+                     | created_at     |
| rating         |     |                     +----------------+
| comments       |     v
| created_at     |   +----------------+
+----------------+   | notifications  |
                     +----------------+
                     | id (PK)        |
                     | user_id (FK)   |----+
                     | report_id (FK) |----+
                     | title          |
                     | message        |
                     | read           |
                     | created_at     |
                     +----------------+
`}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="pt-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Usuarios y Roles</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>profiles:</strong> Información básica de los usuarios registrados.</li>
                <li><strong>user_roles:</strong> Asignación de roles a usuarios (admin, web_supervisor, mobile_citizen, mobile_technician).</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Zonas y Categorías</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>zones:</strong> Áreas geográficas de la ciudad para asignación de reportes.</li>
                <li><strong>categories:</strong> Clasificación de tipos de reportes (infraestructura, servicios, etc.).</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Reportes</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>reports:</strong> Información principal de los reportes (ubicación, descripción, estado).</li>
                <li><strong>report_history:</strong> Registro de cambios en los reportes (cambios de estado, prioridad).</li>
                <li><strong>attachments:</strong> Archivos adjuntos a los reportes (imágenes, documentos).</li>
                <li><strong>feedback:</strong> Valoraciones y comentarios sobre la resolución de reportes.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Comunicación</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>notifications:</strong> Alertas y mensajes para usuarios sobre reportes.</li>
              </ul>
            </div>
            
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-2">Flujo de Trabajo</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>El <strong>ciudadano</strong> (mobile_citizen) crea un reporte que se asigna a una zona.</li>
                <li>El <strong>supervisor</strong> (web_supervisor) recibe el reporte en su zona y lo revisa.</li>
                <li>El supervisor asigna el reporte a un <strong>técnico</strong> (mobile_technician).</li>
                <li>El técnico resuelve el reporte y actualiza su estado.</li>
                <li>El ciudadano recibe notificaciones sobre el progreso y puede dar feedback.</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatabaseDiagram;
