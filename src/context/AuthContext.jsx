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

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const { token, user } = await authApi.login({ username, password });
      setToken(token);
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

 const register = async (username, email, password, confirmPassword) => {
  setLoading(true);
  try {
    const { token, user } = await authApi.register(username, email, password, confirmPassword);
    setToken(token);
    setUser(user);
    return user;
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
    isAdmin: user?.roles?.includes("admin"),
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

