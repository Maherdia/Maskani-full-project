import { createContext } from 'react';

export interface User {
  personID: number;
  dormID?: string;
  userID: number;
  studentID?: number;
  ownerID?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  token?: string;
  [key: string]: unknown;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined); 