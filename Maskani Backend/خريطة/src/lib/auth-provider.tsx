import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext, User } from './auth-context';
import { authAPI } from './api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            // Verify token with server
            const verifiedUser = await authAPI.getCurrentUser();
            if (verifiedUser) {
              setUser(verifiedUser);
              setIsAuthenticated(true);
            } else {
              // Clear invalid data
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } catch (error) {
            console.error('Error verifying token:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    try {
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maskani-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 