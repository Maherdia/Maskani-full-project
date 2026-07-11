import { createContext } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Owner' | 'Student' | 'Admin' | 'User';
  ownerLicenseId?: string;
  adminCode?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 