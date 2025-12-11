// src/context/AuthProvider.jsx
import { useEffect, useState } from "react";
import api, { setToken } from "../lib/api";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/api/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (data) => {
    const res = await api.post("/api/auth/register", data);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const continueAsGuest = async () => {
    const res = await api.post("/api/auth/guest");
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, continueAsGuest, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
