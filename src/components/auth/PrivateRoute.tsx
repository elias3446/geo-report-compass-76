
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading, checkFirstUser } = useAuth();
  const location = useLocation();
  const [isFirstUser, setIsFirstUser] = useState<boolean | null>(null);
  const [isCheckingFirstUser, setIsCheckingFirstUser] = useState(true);

  useEffect(() => {
    const checkIsFirstUser = async () => {
      if (!loading) {
        try {
          const firstUser = await checkFirstUser();
          setIsFirstUser(firstUser);
        } catch (err) {
          console.error("Error checking if first user:", err);
          setIsFirstUser(false);
        } finally {
          setIsCheckingFirstUser(false);
        }
      }
    };
    
    checkIsFirstUser();
  }, [loading, checkFirstUser]);

  if (loading || isCheckingFirstUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If this is the first user setup, redirect to auth page
  if (isFirstUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!user) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
