"use client";
import { createContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

/** Saves token to both localStorage and a cookie (for Next.js middleware) */
function saveToken(token: string) {
  localStorage.setItem('token', token);
  // Cookie accessible to middleware (edge runtime)
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

/** Removes token from localStorage and cookie */
function clearToken() {
  localStorage.removeItem('token');
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Check expiry
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Ensure cookie is in sync
          saveToken(token);
        } else {
          clearToken();
        }
      } catch (e) {
        clearToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    saveToken(token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    // Register with default CUSTOMER role
    await axios.post('/api/auth/register', { ...data, role: 'CUSTOMER' });
  };

  const logout = () => {
    clearToken();
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
