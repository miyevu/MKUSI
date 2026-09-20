'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface NotificationPrefs {
  orderUpdates: boolean;
  promoSms: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  orderUpdates: true,
  promoSms: false,
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  notifications: NotificationPrefs;
  isAdmin: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  authLoading: boolean;
  signupWithPassword: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  requestAdminOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyAdminOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: { firstName?: string; lastName?: string; username?: string; bio?: string; notifications?: Partial<NotificationPrefs> }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;

function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const meta = supabaseUser.user_metadata || {};
  const email = supabaseUser.email || '';
  return {
    id: supabaseUser.id,
    firstName: meta.first_name || meta.full_name?.split(' ')[0] || '',
    lastName: meta.last_name || meta.full_name?.split(' ').slice(1).join(' ') || '',
    username: meta.username || email.split('@')[0],
    email,
    bio: meta.bio || '',
    notifications: { ...DEFAULT_NOTIFICATIONS, ...(meta.notifications || {}) },
    isAdmin: email.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ? mapSupabaseUser(session.user) : null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ? mapSupabaseUser(session.user) : null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signupWithPassword: AuthContextType['signupWithPassword'] = async ({ firstName, lastName, email, password }) => {
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: 'This email is reserved for admin access.' };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          username: email.split('@')[0],
          notifications: DEFAULT_NOTIFICATIONS,
        },
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const loginWithPassword: AuthContextType['loginWithPassword'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const loginWithGoogle: AuthContextType['loginWithGoogle'] = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const requestAdminOtp: AuthContextType['requestAdminOtp'] = async (email) => {
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: 'This email is not authorized for admin access.' };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const verifyAdminOtp: AuthContextType['verifyAdminOtp'] = async (email, code) => {
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: 'This email is not authorized for admin access.' };
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateUser: AuthContextType['updateUser'] = async (updates) => {
    if (!currentUser || currentUser.isAdmin) return { success: false, error: 'Cannot update this account.' };

    const mergedNotifications = updates.notifications
      ? { ...currentUser.notifications, ...updates.notifications }
      : currentUser.notifications;

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: updates.firstName ?? currentUser.firstName,
        last_name: updates.lastName ?? currentUser.lastName,
        username: updates.username ?? currentUser.username,
        bio: updates.bio ?? currentUser.bio,
        notifications: mergedNotifications,
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const changePassword: AuthContextType['changePassword'] = async (newPassword) => {
    if (!currentUser || currentUser.isAdmin) return { success: false, error: 'Cannot update this account.' };

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      currentUser, authLoading,
      signupWithPassword, loginWithPassword, loginWithGoogle,
      requestAdminOtp, verifyAdminOtp, logout, updateUser, changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};