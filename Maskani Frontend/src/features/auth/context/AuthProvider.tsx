import { useState } from "react";
import type { ReactNode } from "react";

import type { LoginRequest, User } from "../types/auth.types";
import { login as loginApi } from "../api/authApi";
import api from "../../../lib/api/apiClient";
import { tokenService } from "../../../lib/auth/tokenStorage";
import { AuthContext } from "./authContext";

interface Props {
  children: ReactNode;
}

function getInitialToken(): string | null {
  const savedToken = tokenService.getToken();

  if (savedToken) {
    api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
  }

  return savedToken;
}

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [user, setUser] = useState<User | null>(() => tokenService.getUser());

  async function login(data: LoginRequest): Promise<User> {
    const response = await loginApi(data);

    tokenService.setToken(response.token);
    tokenService.setUser(response.user);
    api.defaults.headers.common.Authorization = `Bearer ${response.token}`;

    setToken(response.token);
    setUser(response.user);

    return response.user;
  }

  function logout(): void {
    tokenService.clear();
    delete api.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: token !== null,
        login,
        logout,
        loading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
