import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; freelanceTitle?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'light') document.documentElement.classList.add('light');
  }, []);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get('/api/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => { setToken(null); localStorage.removeItem('token'); })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token: t, user: u } = res.data.data;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
  };

  const register = async (data: { name: string; email: string; password: string; freelanceTitle?: string }) => {
    const res = await api.post('/api/auth/register', data);
    const { token: t, user: u } = res.data.data;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
