import * as Types from "@/@types/auth.types";
import * as Storage from "@/service/Storage";
import * as UserService from "@/service/UserService";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextData {
  token: string | null;
  role: String | null;
  isLoading: boolean;
  signIn: (dto: Types.UserRequestDTO) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuthData() {
      try {
        const storedToken = await Storage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          await loadRoleFromToken(storedToken);
        }
      } catch (e) {
        console.error("Falha ao carregar dados de autenticação", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAuthData();
  }, []);

  const loadRoleFromToken = async (token: string) => {
    try {
      const decodedToken: { sub: string; scope: "ADMIN" | "DEFAULT" } = jwtDecode(token);

      setRole(decodedToken.scope);
    } catch (error) {
      console.error("Falha ao buscar dados do usuário", error);
      await signOut();
    }
  };

  const signIn = async (dto: Types.UserRequestDTO) => {
    setIsLoading(true);
    try {
      const newToken = await UserService.login(dto);
      setToken(newToken);
      await Storage.setItem("token", newToken);

      await loadRoleFromToken(newToken);
    } catch (error) {
      console.error("Falha no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      setToken(null);
      setRole(null);
      await Storage.removeItem("token");
    } catch (e) {
      console.error("Falha no logout", e);
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthContext.Provider value={{ token, role, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
