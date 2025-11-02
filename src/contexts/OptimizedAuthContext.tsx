import React, { createContext, useContext, useMemo, ReactNode, useCallback } from 'react';
import { User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  user: User | null;
  isLoading: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const OptimizedAuthProvider = React.memo(({ 
  children, 
  user, 
  isLoading, 
  onLogin, 
  onLogout, 
  onUpdateUser 
}: AuthProviderProps) => {
  // Memoize derived state
  const isAuthenticated = useMemo(() => !!user, [user]);

  // Memoize callbacks to prevent unnecessary re-renders
  const login = useCallback(async (email: string, password: string) => {
    try {
      await onLogin(email, password);
    } catch (error) {
      // Re-throw to let calling component handle
      throw error;
    }
  }, [onLogin]);

  const logout = useCallback(async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if backend call fails
    }
  }, [onLogout]);

  const updateUser = useCallback((updates: Partial<User>) => {
    onUpdateUser(updates);
  }, [onUpdateUser]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  }), [user, isAuthenticated, isLoading, login, logout, updateUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
});

OptimizedAuthProvider.displayName = 'OptimizedAuthProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an OptimizedAuthProvider');
  }
  return context;
};

// Selector hooks for specific auth state
export const useAuthUser = () => {
  const { user } = useAuth();
  return user;
};

export const useAuthStatus = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
};