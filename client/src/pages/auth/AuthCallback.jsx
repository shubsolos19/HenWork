import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import api from '@/lib/api';
import Loader from '@/components/shared/Loader';

export default function AuthCallback() {
  const navigate = useNavigate();
  const syncAttempted = useRef(false);
  const [dots, setDots] = useState(' .');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDots(' . .'), 1000);
    const t2 = setTimeout(() => setDots(' . . .'), 2000);
    const t3 = setTimeout(() => setIsSuccess(true), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    let navTimeout;

    const handleAuth = async (session) => {
      if (session && !syncAttempted.current) {
        syncAttempted.current = true;
        try {
          // Sync Google profile picture on login/signup
          await api.post('/auth/sync', {}, {
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });
        } catch (err) {
          console.error('Failed to sync Google profile:', err);
        } finally {
          const elapsedTime = Date.now() - startTime;
          const timeToNavigate = Math.max(0, 4000 - elapsedTime);

          navTimeout = setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, timeToNavigate);
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
      if (navTimeout) clearTimeout(navTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 z-50 relative overflow-hidden">
      <div className="flex flex-col items-center gap-16 relative w-full h-full max-w-md">
        <div className="relative w-full h-40 flex items-center justify-center">
          <Loader />
        </div>

        <p className="text-white font-medium text-center tracking-wider text-sm h-6 flex items-center justify-center">
          {isSuccess ? (
            'Success 💗'
          ) : (
            <>
              Authenticating
              <span className="inline-block w-8 text-left">{dots}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
