import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jobvault_token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('jobvault_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const clearSession = useCallback(() => {
    localStorage.removeItem('jobvault_token');
    localStorage.removeItem('jobvault_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleLogout = () => clearSession();
    window.addEventListener('jobvault:logout', handleLogout);
    return () => window.removeEventListener('jobvault:logout', handleLogout);
  }, [clearSession]);

  useEffect(() => {
    let active = true;
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authApi.me();
        if (active) {
          setUser(response.data);
          localStorage.setItem('jobvault_user', JSON.stringify(response.data));
        }
      } catch (error) {
        clearSession();
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadUser();
    return () => {
      active = false;
    };
  }, [token, clearSession]);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    localStorage.setItem('jobvault_token', response.data.token);
    localStorage.setItem('jobvault_user', JSON.stringify(response.data.user));
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (details) => {
    const response = await authApi.register(details);
    localStorage.setItem('jobvault_token', response.data.token);
    localStorage.setItem('jobvault_user', JSON.stringify(response.data.user));
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem('jobvault_token')) {
        await authApi.logout();
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
    setUser
  }), [token, user, loading, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
