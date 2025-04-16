
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading, checkFirstUser, checkAdminExists } = useAuth();
  const location = useLocation();
  const [isFirstUser, setIsFirstUser] = useState<boolean | null>(null);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      if (!loading) {
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
      }
    };
    
    checkAuthState();
  }, [loading, checkFirstUser, checkAdminExists]);

  if (loading || isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If this is the first user setup and no admin exists, redirect to auth page
  if (isFirstUser && !hasAdmin) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If an admin exists, follow normal authentication flow
  if (!user) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
