import { createContext } from "react";

import type { LoginRequest, User } from "../types/auth.types";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login(data: LoginRequest): Promise<User>;
  logout(): void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
