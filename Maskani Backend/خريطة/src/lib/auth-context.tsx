
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext, User } from './auth-context';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from localStorage on initialization
    const storedUser = localStorage.getItem('user');
    console.log('Stored user data:', storedUser);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Add effect to log auth state changes
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const login = (userData: User) => {
    console.log('Logging in user:', userData);
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('User data saved to localStorage');
  };

  const logout = () => {
    console.log('Logging out user');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 