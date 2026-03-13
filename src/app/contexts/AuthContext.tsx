import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';

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
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  'citizen@demo.com': { id: '1', name: 'Rahul Sharma', email: 'citizen@demo.com', role: 'citizen' },
  'official@demo.com': { id: '2', name: 'Priya Singh', email: 'official@demo.com', role: 'official', department: 'Public Works' },
  'admin@demo.com': { id: '3', name: 'Admin Kumar', email: 'admin@demo.com', role: 'admin' },
};

function profileRoleToAppRole(role: string): UserRole {
  const map: Record<string, UserRole> = { Citizen: 'citizen', Official: 'official', Admin: 'admin' };
  return map[role] || 'citizen';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string, email: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: profileRoleToAppRole(data.role),
        department: data.department || undefined,
      });
    } else {
      setUser({
        id: userId,
        name: email.split('@')[0],
        email,
        role: 'citizen',
      });
    }
    setLoading(false);
  }

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    if (!supabaseConfigured) {
      const found = MOCK_USERS[email];
      if (found) {
        setUser(found);
      } else {
        setUser({ id: Date.now().toString(), name: email.split('@')[0], email, role });
      }
      return true;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!supabaseConfigured) {
      setUser({ id: Date.now().toString(), name, email, role });
      return { success: true };
    }

    const roleMap: Record<UserRole, string> = { citizen: 'Citizen', official: 'Official', admin: 'Admin' };

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: roleMap[role] } },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    if (supabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
