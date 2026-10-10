import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('civicsphere_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('civicsphere_token'));
  const [loading, setLoading] = useState(false);

  const login = (authToken, authUser) => {
    localStorage.setItem('civicsphere_token', authToken);
    localStorage.setItem('civicsphere_user', JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem('civicsphere_token');
    localStorage.removeItem('civicsphere_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('civicsphere_user', JSON.stringify(merged));
      return merged;
    });
  };

  const role = user?.role || '';
  const isAdmin = role === 'ROLE_ADMIN';
  const isCandidate = role === 'ROLE_CANDIDATE';
  const isCitizen = role === 'ROLE_CITIZEN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        role,
        isAdmin,
        isCandidate,
        isCitizen,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
