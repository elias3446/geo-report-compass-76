
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
  checkFirstUser: () => Promise<boolean>;
  createFirstAdmin: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any | null }>;
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

  // Check if this is the first user in the system
  const checkFirstUser = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Error checking first user:", error);
        return false;
      }
      
      return count === 0;
    } catch (err) {
      console.error("Error in checkFirstUser:", err);
      return false;
    }
  };

  // Create the first admin user
  const createFirstAdmin = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      // Check if there are existing users
      const isFirstUser = await checkFirstUser();
      if (!isFirstUser) {
        return { error: new Error("Ya existe un usuario en el sistema. No se puede crear el primer administrador.") };
      }

      // Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (signUpError) {
        return { error: signUpError };
      }
      
      // Sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) {
        return { error: signInError };
      }
      
      // Get the user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: new Error("No se pudo obtener el usuario después del registro") };
      }
      
      // Call the SQL function to make this user an admin
      const { error: adminError } = await supabase.rpc('create_initial_admin', {
        admin_email: email
      });
      
      if (adminError) {
        console.error("Error making user admin:", adminError);
        return { error: adminError };
      }
      
      toast({
        title: "Administrador creado",
        description: "Se ha creado el primer usuario administrador exitosamente"
      });
      
      return { error: null };
    } catch (error: any) {
      console.error("Error in createFirstAdmin:", error);
      return { error };
    }
  };

  const signUp = async (
    email: string, 
    password: string,
    metadata?: { first_name?: string; last_name?: string }
  ) => {
    try {
      // First check if this would be the first user - if so, only allow admin creation
      const isFirstUser = await checkFirstUser();
      if (isFirstUser) {
        return { 
          error: new Error("Es el primer usuario del sistema. Por favor utilice el formulario de registro inicial para crear un administrador.")
        };
      }
      
      // Normal signup flow requires an admin to be logged in
      if (!isAdmin()) {
        return {
          error: new Error("Solo los administradores pueden crear nuevos usuarios")
        };
      }
      
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
        description: "Usuario creado correctamente."
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
        isMobileTechnician,
        checkFirstUser,
        createFirstAdmin
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
