
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSupabaseStatus } from '@/hooks/useSupabaseStatus';
import { ShieldCheck, ShieldAlert, Database, Loader2 } from 'lucide-react';

const DatabaseStatus = () => {
  const { status, error } = useSupabaseStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Estado de la Base de Datos
            </CardTitle>
            <CardDescription>
              Información sobre la conexión a Supabase
            </CardDescription>
          </div>
          <Badge
            variant={
              status === 'connected' ? 'default' :
              status === 'connecting' ? 'outline' : 'destructive'
            }
            className="ml-auto"
          >
            {status === 'connected' && 'Conectado'}
            {status === 'connecting' && 'Conectando...'}
            {status === 'error' && 'Error de conexión'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {status === 'connecting' && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Verificando conexión a la base de datos...</p>
          </div>
        )}
        
        {status === 'connected' && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Base de datos operativa</AlertTitle>
            <AlertDescription className="text-green-700">
              La conexión a Supabase está funcionando correctamente.
            </AlertDescription>
          </Alert>
        )}
        
        {status === 'error' && (
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Error de conexión</AlertTitle>
            <AlertDescription>
              {error || 'No se pudo conectar a la base de datos. Por favor, verifica tu configuración.'}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Información de conexión:</h4>
          <div className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
            <p>Project ID: njvgexqauvhzcamywmya</p>
            <p>URL: https://njvgexqauvhzcamywmya.supabase.co</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseStatus;
