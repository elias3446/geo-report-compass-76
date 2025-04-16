
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isWebSupervisor: () => boolean;
  isMobileCitizen: () => boolean;
  isMobileTechnician: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, session, user: session?.user || null, loading: false }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({ ...prev, session, user: session?.user || null }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string, 
    password: string,
    metadata?: { first_name?: string; last_name?: string }
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        toast({
          title: "Error al registrarse",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Registro exitoso",
        description: "Se ha enviado un correo de confirmación a tu dirección de email."
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error durante el registro",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Error al iniciar sesión",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Sesión iniciada",
        description: "Has iniciado sesión correctamente"
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Ocurrió un error durante el inicio de sesión",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente"
      });
    } catch (error: any) {
      toast({
        title: "Error al cerrar sesión",
        description: error.message || "Ocurrió un error al cerrar sesión",
        variant: "destructive"
      });
    }
  };

  // Role helper functions - these would ideally check against the user_roles table
  // but for simplicity, we'll implement them more fully later
  const isAdmin = () => {
    return state.user?.app_metadata?.role === 'admin';
  };

  const isWebSupervisor = () => {
    return state.user?.app_metadata?.role === 'web_supervisor';
  };

  const isMobileCitizen = () => {
    return state.user?.app_metadata?.role === 'mobile_citizen';
  };

  const isMobileTechnician = () => {
    return state.user?.app_metadata?.role === 'mobile_technician';
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        isAdmin,
        isWebSupervisor,
        isMobileCitizen,
        isMobileTechnician
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
