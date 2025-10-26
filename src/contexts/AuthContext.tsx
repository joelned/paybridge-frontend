import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import { setAuthInterceptors } from '../services/api/axiosConfig';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isDevMode = import.meta.env.DEV;
  const useStorageFallback = import.meta.env.VITE_AUTH_FALLBACK_STORAGE === 'true';
  const devAuthBypass = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true' && isDevMode;

  useEffect(() => {
    // Set up axios interceptors
    setAuthInterceptors(() => logout());

    const initAuth = async () => {
      try {
        // Dev bypass for local development
        if (devAuthBypass) {
          const mockUser: User = {
            id: 'dev-user',
            email: 'dev@example.com',
            username: 'dev',
            userType: 'ADMIN',
            roles: ['ADMIN']
          };
          setUser(mockUser);
          setIsLoading(false);
          return;
        }

        // Try to restore authentication state
        const storedUser = authService.getCurrentUser();
        
        if (storedUser) {
          // User data exists in localStorage, verify with backend
          try {
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
              // Try to get fresh user data from backend
              try {
                const freshUserData = await authService.getCurrentUserFromBackend();
                setUser(freshUserData || storedUser);
              } catch (error) {
                // If backend call fails, use stored data
                console.warn('Using stored user data due to backend error:', error);
                setUser(storedUser);
              }
            } else {
              // Authentication failed, clear stored data
              authService.clearStoredData();
            }
          } catch (error) {
            // Network error - assume user is still authenticated
            console.warn('Auth check failed, using stored user data:', error);
            setUser(storedUser);
          }
        } else {
          // No stored user data, check if there's a valid session
          try {
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
              // Valid session but no stored data, get from backend
              const userData = await authService.getCurrentUserFromBackend();
              if (userData) {
                setUser(userData);
              }
            }
          } catch (error) {
            // No stored data and auth check failed - user is not authenticated
            console.log('No authentication found');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [devAuthBypass, isDevMode, useStorageFallback]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      
      setUser(loggedInUser);

      // Always store user data in localStorage for session restoration
      authService.storeAuthData('', loggedInUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    authService.logout().catch(console.error);
  };



  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
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