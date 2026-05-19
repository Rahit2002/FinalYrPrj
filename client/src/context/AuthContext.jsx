import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("seva_token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("seva_user") || "null"));

  const login = (token, user) => {
    localStorage.setItem("seva_token", token);
    localStorage.setItem("seva_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("seva_token");
    localStorage.removeItem("seva_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
