import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchApi('/api/admin/auth/me')
      .then(data => {
        if (mounted && data.success) setUser(data.user);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
      
    return () => { mounted = false; };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await fetchApi('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.success) {
      setUser(data.user);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetchApi('/api/admin/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);