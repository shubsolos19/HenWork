import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import api from '@/lib/api';
import Loader from '@/components/shared/Loader';

export default function AuthCallback() {
  const navigate = useNavigate();
  const syncAttempted = useRef(false);
  const [status, setStatus] = useState('authenticating'); // 'authenticating' | 'success'

  useEffect(() => {
    const startTime = Date.now();
    let successTimeout;
    let navTimeout;

    const handleAuth = async (session) => {
      if (session && !syncAttempted.current) {
        syncAttempted.current = true;
        try {
          // Sync Google profile picture on login/signup
          await api.post('/auth/sync');
        } catch (err) {
          console.error('Failed to sync Google profile:', err);
        } finally {
          const elapsedTime = Date.now() - startTime;
          const timeToSuccess = Math.max(0, 3000 - elapsedTime);
          
          // Switch to success status at exactly the 3-second mark
          successTimeout = setTimeout(() => {
            setStatus('success');
            
            // Navigate to dashboard 2 seconds after the success status appears (total 5 seconds)
            navTimeout = setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 2000);
          }, timeToSuccess);
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
      if (successTimeout) clearTimeout(successTimeout);
      if (navTimeout) clearTimeout(navTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 z-50 relative overflow-hidden">
      <div className="flex flex-col items-center gap-16 relative w-full h-full max-w-md">
        <div className="relative w-full h-40 flex items-center justify-center">
          <Loader />
        </div>
        
        {status === 'success' ? (
          <p className="text-emerald-400 font-bold text-center tracking-widest text-xl animate-in fade-in slide-in-from-bottom-6 duration-500">
            Success
          </p>
        ) : (
          <p className="text-white font-medium animate-pulse text-center tracking-wider text-sm">
            Completing authentication...
          </p>
        )}
      </div>
    </div>
  );
}
