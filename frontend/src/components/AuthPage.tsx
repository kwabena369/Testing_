// src/components/AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { isLoading, error, setError, authenticate } = useAuth();

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
    if (!validateForm()) return;

    try {
      await authenticate(email, password, isLogin);
      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Redirect to home page
      navigate('/');
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset form when switching modes
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(''); // Reset error when switching modes
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              aria-label="Email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              aria-label="Password"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                aria-label="Confirm Password"
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
