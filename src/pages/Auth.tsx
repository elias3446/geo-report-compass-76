import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import FirstUserRegistration from '@/components/auth/FirstUserRegistration';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp, checkFirstUser, checkAdminExists } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstUser, setIsFirstUser] = useState<boolean | null>(null);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Check if this is the first user setup or if admin exists
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // First check if admin exists - this is the priority check
        const adminExists = await checkAdminExists();
        setHasAdmin(adminExists);
        
        // Only if no admin exists, we check if this is the first user
        if (!adminExists) {
          const firstUser = await checkFirstUser();
          setIsFirstUser(firstUser);
        } else {
          setIsFirstUser(false);
        }
      } catch (err) {
        console.error("Error checking authentication state:", err);
        setIsFirstUser(false);
        setHasAdmin(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuthState();
  }, [checkFirstUser, checkAdminExists]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) {
        setError(error.message || 'Error al iniciar sesión');
      } else {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente.",
        });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If this is the first user and no admin exists, show the first user registration form
  if (isFirstUser && !hasAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <div className="w-full max-w-md px-4">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-bold">Plataforma de Reportes Urbanos</h1>
            <p className="text-muted-foreground">Configuración inicial del sistema</p>
          </div>
          
          <FirstUserRegistration />
        </div>
      </div>
    );
  }

  // Otherwise show the regular login form
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold">Plataforma de Reportes Urbanos</h1>
          <p className="text-muted-foreground">Inicia sesión para acceder</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger id="login-tab" value="login">Iniciar Sesión</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>
                  Ingresa tus credenciales para acceder a la plataforma
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="tu@correo.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Contraseña</Label>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
