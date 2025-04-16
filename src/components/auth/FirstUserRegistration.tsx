
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Shield } from "lucide-react";

const FirstUserRegistration = () => {
  const { createFirstAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simple validation
    if (!email || !password || !firstName || !lastName) {
      setError("Todos los campos son obligatorios");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }
    
    try {
      const { error: registrationError } = await createFirstAdmin(
        email, 
        password,
        firstName,
        lastName
      );
      
      if (registrationError) {
        setError(registrationError.message || "Error al crear el administrador");
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido al crear el administrador");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Configuración Inicial</CardTitle>
        <CardDescription className="text-center">
          Crea el primer usuario administrador para comenzar a utilizar el sistema.
          Este usuario tendrá acceso completo a todas las funciones.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input 
                id="firstName" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input 
                id="lastName" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input 
              id="confirmPassword" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando administrador...
              </>
            ) : (
              "Crear Administrador"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FirstUserRegistration;
