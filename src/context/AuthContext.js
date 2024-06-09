import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    const storedRole = localStorage.getItem("role");
    if (storedAuth) {
      setAuth(storedAuth);
      setRole(storedRole);
    }
  }, []);

  const login = (token, userRole) => {
    setAuth(token);
    setRole(userRole);
    localStorage.setItem("auth", token);
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setAuth(null);
    setRole(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ auth, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
