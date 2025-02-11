import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError('All fields are required');
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleAuth = async () => {
    setError('');
    if (!validateForm()) return;

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

      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset form when switching modes
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            onClick={handleAuth}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={toggleAuthMode}
              disabled={isLoading}
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
