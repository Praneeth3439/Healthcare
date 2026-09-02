import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<boolean>;
  register: (data: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    city?: string;
    state?: string;
    userType: UserRole;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'healthcare_auth_user';
const LOCAL_STORAGE_TOKEN_KEY = 'healthcare_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        // Default authenticated demo profile for smooth exploration
        const demoUser: UserProfile = {
          id: 'usr-demo-001',
          fullName: 'Dr. Sarah Jenkins',
          email: 'sarah.jenkins@healthcare.org',
          phoneNumber: '+91 98765 43210',
          city: 'New Delhi',
          state: 'Delhi',
          userType: 'Healthcare Professional',
          createdAt: new Date().toISOString(),
        };
        setUser(demoUser);
        setToken('mock-jwt-token-cognito-demo');
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(demoUser));
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, 'mock-jwt-token-cognito-demo');
      }
    } catch (e) {
      console.error('Error restoring auth state', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulates Cognito User Pool Authentication
    await new Promise((resolve) => setTimeout(resolve, 600));

    const loggedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
      email,
      city: 'Delhi',
      state: 'Delhi',
      userType: 'Patient',
      createdAt: new Date().toISOString(),
    };

    const mockToken = `jwt-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    setUser(loggedUser);
    setToken(mockToken);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(loggedUser));
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, mockToken);
    setIsLoading(false);
    return true;
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    city?: string;
    state?: string;
    userType: UserRole;
  }): Promise<boolean> => {
    setIsLoading(true);
    // Simulates Cognito SignUp
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      city: data.city || 'Bengaluru',
      state: data.state || 'Karnataka',
      userType: data.userType,
      createdAt: new Date().toISOString(),
    };

    const mockToken = `jwt-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, mockToken);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
