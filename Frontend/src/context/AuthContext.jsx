import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Restore session from localStorage on page load
    const storedUser  = localStorage.getItem("parkinsense_user");
    const storedToken = localStorage.getItem("parkinsense_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }
  }, []);

  // Called after a successful API login – receives { user, token }
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken ?? null);
    localStorage.setItem("parkinsense_user",  JSON.stringify(userData));
    if (authToken) localStorage.setItem("parkinsense_token", authToken);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("parkinsense_user");
    localStorage.removeItem("parkinsense_token");
  };

  const openAuthModal  = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
