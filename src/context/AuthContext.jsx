import { createContext, useContext, useState, useEffect } from "react";
import { isLoggedIn, isTokenExpired } from "../Utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      setAuthenticated(false);
      localStorage.removeItem("token");
    } else {
      setAuthenticated(true);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
