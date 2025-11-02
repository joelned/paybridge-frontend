// src/contexts/AuthContext.tsx - Cookie-based auth with proper session sync
import React, { createContext, useContext, useEffect, useState, type ReactNode, useCallback, useRef } from 'react';
import { authService } from '../services/authService';
import { setAuthErrorHandler } from '../services/api/axiosConfig';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize with cached user if available
    return authService.getCachedUser();
  });
  const [isLoading, setIsLoading] = useState(true);
  const initializingRef = useRef(false);

  // Handle auth errors from axios interceptor
  const handleAuthError = useCallback(() => {
    setUser(null);
    setIsLoading(false);
  }, []);

  // Initialize auth - load from cache only
  useEffect(() => {
    if (initializingRef.current) return;
    
    initializingRef.current = true;
    setAuthErrorHandler(handleAuthError);

    const initAuth = async () => {
      try {
        // Load cached user data (no backend call)
        const cachedUser = await authService.getCurrentUser();
        setUser(cachedUser);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
        initializingRef.current = false;
      }
    };

    initAuth();
  }, [handleAuthError]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (initializingRef.current) return; // Prevent concurrent refresh
    
    // Just reload from cache since we don't have /auth/me
    const cachedUser = await authService.getCurrentUser();
    setUser(cachedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};