import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ramNaamUser')) || null;
    } catch {
      return null;
    }
  });

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('ramNaamToken', data.token);
    localStorage.setItem('ramNaamUser', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('ramNaamToken', data.token);
    localStorage.setItem('ramNaamUser', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('ramNaamToken');
    localStorage.removeItem('ramNaamUser');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
