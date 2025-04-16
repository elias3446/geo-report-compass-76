
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseStatus = () => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to make a simple database call to check the connection
        await supabase.from('profiles').select('count', { count: 'exact', head: true });
        setStatus('connected');
        setError(null);
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setStatus('error');
        setError(err.message || 'Error connecting to Supabase');
      }
    };

    checkConnection();
  }, []);

  return { status, error };
};
