import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  useEffect(() => {
    // Try localStorage and fallback to sessionStorage
    const storedUser  = localStorage.getItem("parkinsense_user") || sessionStorage.getItem("parkinsense_user");
    const storedToken = localStorage.getItem("parkinsense_token") || sessionStorage.getItem("parkinsense_token");
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
  const login = (userData, authToken, rememberMe = true) => {
    setUser(userData);
    setToken(authToken ?? null);
    
    // Use localStorage for persistence, sessionStorage for tab-only sessions
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("parkinsense_user",  JSON.stringify(userData));
    if (authToken) storage.setItem("parkinsense_token", authToken);
    
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("parkinsense_user");
    localStorage.removeItem("parkinsense_token");
    sessionStorage.removeItem("parkinsense_user");
    sessionStorage.removeItem("parkinsense_token");
  };

  const openAuthModal  = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openEditProfileModal  = () => setIsEditProfileModalOpen(true);
  const closeEditProfileModal = () => setIsEditProfileModalOpen(false);

  // Update local state when profile changes
  const updateProfile = (updatedUserData) => {
    setUser(updatedUserData);
    // Update whichever storage contains the user data
    if (localStorage.getItem("parkinsense_user")) {
        localStorage.setItem("parkinsense_user", JSON.stringify(updatedUserData));
    }
    if (sessionStorage.getItem("parkinsense_user")) {
        sessionStorage.setItem("parkinsense_user", JSON.stringify(updatedUserData));
    }
  };

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
        isEditProfileModalOpen,
        openEditProfileModal,
        closeEditProfileModal,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
