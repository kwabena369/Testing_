// src/hooks/useAuth.ts
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const authenticate = async (email: string, password: string, isLogin: boolean) => {
    setError('');
    setIsLoading(true);

    try {
      let authResult;
      if (isLogin) {
        authResult = await supabase.auth.signInWithPassword({ email, password });
      } else {
        authResult = await supabase.auth.signUp({ email, password });
      }

      if (authResult.error) throw new Error(authResult.error.message);

      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, supabaseId: authResult.data.user?.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Backend communication failed');
      }

      const userData = await response.json();

      // Store user information in local storage
      localStorage.setItem('userId', userData.user.id);
      localStorage.setItem('userEmail', userData.email || email);

      return userData;
    } catch (err) {
      setError((err as Error).message || 'Authentication failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, setError, authenticate };
};

export default useAuth;
