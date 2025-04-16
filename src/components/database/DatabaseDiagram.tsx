
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Constants } from '@/integrations/supabase/types';

const DatabaseDiagram = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Estructura de la Base de Datos</CardTitle>
        <CardDescription>
          Diagrama de entidad-relación para la Plataforma de Reportes Urbanos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tables">
          <TabsList className="mb-4">
            <TabsTrigger value="tables">Tablas</TabsTrigger>
            <TabsTrigger value="enums">Enumeraciones</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="tables">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Usuarios y Perfiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tabla</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">profiles</TableCell>
                        <TableCell>Información básica del usuario</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">user_roles</TableCell>
                        <TableCell>Roles asignados a cada usuario</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Reportes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tabla</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">reports</TableCell>
                        <TableCell>Reportes creados por usuarios</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">report_history</TableCell>
                        <TableCell>Historial de cambios en reportes</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">attachments</TableCell>
                        <TableCell>Archivos adjuntos a reportes</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Configuración</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tabla</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">categories</TableCell>
                        <TableCell>Categorías de reportes</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">zones</TableCell>
                        <TableCell>Zonas geográficas</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Interacción</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tabla</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">notifications</TableCell>
                        <TableCell>Notificaciones para usuarios</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">feedback</TableCell>
                        <TableCell>Valoraciones de reportes resueltos</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="enums">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Tipo de usuario (user_role)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Valor</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Constants.public.Enums.user_role.map((role) => (
                        <TableRow key={role}>
                          <TableCell className="font-medium">{role}</TableCell>
                          <TableCell>
                            {role === 'admin' && 'Administrador del sistema'}
                            {role === 'web_supervisor' && 'Supervisor de zona (web)'}
                            {role === 'mobile_citizen' && 'Ciudadano (app móvil)'}
                            {role === 'mobile_technician' && 'Técnico de campo (app móvil)'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Estado de reporte (report_status)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Valor</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Constants.public.Enums.report_status.map((status) => (
                        <TableRow key={status}>
                          <TableCell className="font-medium">{status}</TableCell>
                          <TableCell>
                            {status === 'pending' && 'Pendiente'}
                            {status === 'in_progress' && 'En progreso'}
                            {status === 'assigned' && 'Asignado'}
                            {status === 'resolved' && 'Resuelto'}
                            {status === 'closed' && 'Cerrado'}
                            {status === 'rejected' && 'Rechazado'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Prioridad de reporte (report_priority)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Valor</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Constants.public.Enums.report_priority.map((priority) => (
                        <TableRow key={priority}>
                          <TableCell className="font-medium">{priority}</TableCell>
                          <TableCell>
                            {priority === 'low' && 'Baja'}
                            {priority === 'medium' && 'Media'}
                            {priority === 'high' && 'Alta'}
                            {priority === 'critical' && 'Crítica'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <div className="grid gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Administrador</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    El administrador tiene acceso completo al sistema y puede gestionar todos los aspectos de la plataforma.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Supervisión global del sistema</li>
                    <li>Gestión de usuarios (web y móvil)</li>
                    <li>Visualización y administración de todos los reportes</li>
                    <li>Asignación de reportes a usuarios o zonas</li>
                    <li>Generación de informes y estadísticas</li>
                    <li>Configuración del sistema (categorías, zonas, etc.)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Supervisor de Zona (Web)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    El supervisor de zona es responsable de gestionar los reportes dentro de su área geográfica asignada.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Visualización de reportes asignados a su zona</li>
                    <li>Actualización de estados de reportes</li>
                    <li>Agregado de observaciones y comentarios</li>
                    <li>Coordinación con técnicos</li>
                    <li>Visualización de métricas y estadísticas locales</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Ciudadano (Móvil)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Los ciudadanos pueden crear reportes desde la aplicación móvil y hacer seguimiento de sus casos.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Creación de reportes con geolocalización</li>
                    <li>Adjuntar evidencia (imágenes, audio)</li>
                    <li>Visualización del estado de sus reportes</li>
                    <li>Recepción de notificaciones</li>
                    <li>Participación en encuestas de calidad</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Técnico de Campo (Móvil)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Los técnicos son asignados a reportes específicos para su resolución en campo.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Recibir asignaciones de reportes</li>
                    <li>Actualizar estado de las tareas asignadas</li>
                    <li>Adjuntar evidencia de trabajos realizados</li>
                    <li>Comunicación con supervisores</li>
                    <li>Visualización de reportes históricos en su zona</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatabaseDiagram;
