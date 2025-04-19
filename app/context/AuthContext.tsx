import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import React from "react";

const AuthContext = createContext<{ token: string; role: string; userId: string }>({ token: "", role: "", userId: "" });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<{ token: string; role: string; userId: string }>({
    token: "",
    role: "",
    userId: "",
  });

  useEffect(() => {
    const token = Cookies.get("token") || "";
    const role = Cookies.get("role") || "";
    const userId = Cookies.get("userId") || "";
    setAuth({ token, role, userId });
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
