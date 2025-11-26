import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { ApiService } from '../services/apiService'; // Changed from MockService
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  canEdit: boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('mahsa_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Using real API
      const loggedInUser = await ApiService.login(username, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('mahsa_current_user', JSON.stringify(loggedInUser));
        addToast(`Welcome back, ${loggedInUser.fullName}`, 'success');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'Login failed', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mahsa_current_user');
    addToast('Logged out successfully');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = await ApiService.updateProfile(updates);
      setUser(updatedUser);
      localStorage.setItem('mahsa_current_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      addToast(error.message || 'Failed to update profile', 'error');
    }
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await ApiService.changePassword(oldPass, newPass);
      return true;
    } catch (error: any) {
      addToast(error.message || 'Failed to change password', 'error');
      return false;
    }
  };

  const isAdmin = user?.role === UserRole.ADMIN;
  const isStaff = user?.role === UserRole.STAFF;
  const canEdit = isAdmin || isStaff; 

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin, isStaff, canEdit, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};