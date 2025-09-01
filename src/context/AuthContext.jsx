import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser]   = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  // LocalStorage güncelle
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Login
  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ Username: username, Password: password });
      if (!res.token) throw new Error("Token missing from server response");
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.register(data); // { token, user }
      if (!res.token) throw new Error("Token missing from server response");
      setToken(res.token);
      setUser(res.user);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.Roles?.includes("admin"),
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
