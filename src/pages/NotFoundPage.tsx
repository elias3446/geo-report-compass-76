
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted p-4">
      <div className="bg-card border rounded-lg shadow-sm max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-geo-blue/10 flex items-center justify-center mx-auto mb-6">
          <MapPin className="h-8 w-8 text-geo-blue" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            className="gap-2"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </Button>
          
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
