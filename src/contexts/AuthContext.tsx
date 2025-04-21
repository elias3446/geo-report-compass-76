
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthRole = "admin" | "user" | null;

interface AuthContextType {
  user: string | null;
  role: AuthRole;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER = { user: "admin", pass: "admin", role: "admin" as AuthRole };
const NORMAL_USER = { user: "user", pass: "user", role: "user" as AuthRole };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<AuthRole>(null);

  useEffect(() => {
    // Restaurar sesión desde localStorage
    const storedUser = localStorage.getItem("auth:user");
    const storedRole = localStorage.getItem("auth:role") as AuthRole;
    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
    }
  }, []);

  const login = async (username: string, password: string) => {
    if (username === ADMIN_USER.user && password === ADMIN_USER.pass) {
      setUser(ADMIN_USER.user);
      setRole(ADMIN_USER.role);
      localStorage.setItem("auth:user", ADMIN_USER.user);
      localStorage.setItem("auth:role", ADMIN_USER.role);
      return true;
    }
    if (username === NORMAL_USER.user && password === NORMAL_USER.pass) {
      setUser(NORMAL_USER.user);
      setRole(NORMAL_USER.role);
      localStorage.setItem("auth:user", NORMAL_USER.user);
      localStorage.setItem("auth:role", NORMAL_USER.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("auth:user");
    localStorage.removeItem("auth:role");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe estar dentro de AuthProvider");
  return ctx;
};
