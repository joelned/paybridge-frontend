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
  const [user, setUser] = useState<User | null>(() => authService.getCachedUser());
  const [isLoading, setIsLoading] = useState(true);
  const initializingRef = useRef(false);

  const handleAuthError = useCallback(() => {
    setUser(null);
    authService.clearStoredData();
  }, []);

  useEffect(() => {
    if (initializingRef.current) return;

    initializingRef.current = true;
    setAuthErrorHandler(handleAuthError);

    const initAuth = async () => {
      try {
        // Load cached user and validate cookie-backed session with backend.
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
        authService.clearStoredData();
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
    if (initializingRef.current) return;

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
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
