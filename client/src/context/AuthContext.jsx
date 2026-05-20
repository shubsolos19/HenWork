import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { setTokenGetter } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    let loadTimeout;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);
      loadTimeout = setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      if (loadTimeout) clearTimeout(loadTimeout);
    };
  }, []);

  // Keep axios token getter in sync
  useEffect(() => {
    setTokenGetter(() => session?.access_token ?? null);
  }, [session]);

  const signUp = useCallback(async ({ email, password, firstName, lastName, redirectTo }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: redirectTo
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Force clear state immediately so PublicRoute sees user=null
    // without waiting for the async onAuthStateChange callback
    setUser(null);
    setSession(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, []);

  const value = { user, session, loading, signUp, signIn, signOut, signInWithGoogle };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
