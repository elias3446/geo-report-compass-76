
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    // Si ya está logueado, redireccionar al dashboard/autenticado.
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const ok = await login(username, password);
    setIsLoading(false);
    if (ok) {
      toast.success("¡Ingreso exitoso!");
      navigate("/");
    } else {
      toast.error("Usuario o contraseña incorrecta");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-full max-w-xs space-y-6"
      >
        <div className="text-center mb-4">
          <LogIn className="mx-auto h-9 w-9 text-primary" />
          <h1 className="text-2xl font-bold mt-2">Iniciar Sesión</h1>
        </div>
        <div className="space-y-2">
          <Input
            autoFocus
            required
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <Input
            required
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Ingresando..." : "Ingresar"}
        </Button>
        <div className="text-xs text-muted-foreground mt-2">
          admin / admin &nbsp; | &nbsp; user / user
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
