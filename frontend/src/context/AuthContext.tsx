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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://healthcare-api-tbqv.onrender.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

        if (!storedToken) {
          setUser(null);
          setToken(null);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
          setUser(null);
          setToken(null);
          return;
        }

        const data = await response.json();

        setUser(data.user);
        setToken(storedToken);

        localStorage.setItem(
          LOCAL_STORAGE_USER_KEY,
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error('Error restoring authentication session:', error);

        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);

        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (
    email: string,
    pass: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: pass,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem(
        LOCAL_STORAGE_USER_KEY,
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        LOCAL_STORAGE_TOKEN_KEY,
        data.token
      );

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    city?: string;
    state?: string;
    userType: UserRole;
    password: string;
  }): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          city: data.city,
          state: data.state,
          userType: data.userType,
          password: data.password,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();

      setUser(result.user);
      setToken(result.token);

      localStorage.setItem(
        LOCAL_STORAGE_USER_KEY,
        JSON.stringify(result.user)
      );

      localStorage.setItem(
        LOCAL_STORAGE_TOKEN_KEY,
        result.token
      );

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

    if (storedToken) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }).catch(() => {
        // Local logout still proceeds if the API is unavailable.
      });
    }

    setUser(null);
    setToken(null);

    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;

    const nextUser = {
      ...user,
      ...updated,
    };

    setUser(nextUser);

    localStorage.setItem(
      LOCAL_STORAGE_USER_KEY,
      JSON.stringify(nextUser)
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
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