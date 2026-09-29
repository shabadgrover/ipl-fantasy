import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => authService.getCurrentToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session on mount
  useEffect(() => {
    let isMounted = true;

    const restore = async () => {
      try {
        const session = await authService.restoreSession();
        if (isMounted) {
          if (session) {
            setUser(session.user);
            setToken(session.token);
          } else {
            setUser(null);
            setToken(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restore();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const result = await authService.login({ email, password });
      setUser(result.user);
      setToken(result.token);
      return result;
    } catch (err) {
      setError(err?.message || 'Login failed');
      throw err;
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setError(null);
    try {
      const result = await authService.register({ name, email, password });
      setUser(result.user);
      setToken(result.token);
      return result;
    } catch (err) {
      setError(err?.message || 'Registration failed');
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      clearError,
    }),
    [user, token, loading, error, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
