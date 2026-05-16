import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const syncAttempted = useRef(false);

  useEffect(() => {
    const handleAuth = async (session) => {
      if (session && !syncAttempted.current) {
        syncAttempted.current = true;
        try {
          // Sync Google profile picture on login/signup
          await api.post('/auth/sync');
        } catch (err) {
          console.error('Failed to sync Google profile:', err);
        } finally {
          navigate('/dashboard', { replace: true });
        }
      }
    };

    // onAuthStateChange is more reliable for handling the OAuth redirect flow
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        handleAuth(session);
      }
    });

    // Fallback/Safety: check session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuth(session);
      }
    });

    // Safety timeout: if no session is detected after 5 seconds, redirect to login
    const timeout = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          navigate('/login', { replace: true });
        }
      });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-text-secondary font-medium animate-pulse">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
