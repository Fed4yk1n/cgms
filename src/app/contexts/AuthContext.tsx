import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'citizen' | 'official' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  'citizen@demo.com': { id: '1', name: 'Rahul Sharma', email: 'citizen@demo.com', role: 'citizen' },
  'official@demo.com': { id: '2', name: 'Priya Singh', email: 'official@demo.com', role: 'official', department: 'Public Works' },
  'admin@demo.com': { id: '3', name: 'Admin Kumar', email: 'admin@demo.com', role: 'admin' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string, role: UserRole): Promise<boolean> => {
    const found = MOCK_USERS[email];
    if (found) {
      setUser(found);
    } else {
      setUser({ id: Date.now().toString(), name: email.split('@')[0], email, role });
    }
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
