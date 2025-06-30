import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demonstration
const mockUsers: AuthUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Admin',
    department: 'IT',
    permissions: [
      'user.create', 'user.read', 'user.update', 'user.delete',
      'project.create', 'project.read', 'project.update', 'project.delete',
      'admin.config', 'admin.users', 'admin.departments', 'admin.fiscal'
    ]
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@company.com',
    role: 'Manager',
    department: 'Engineering',
    permissions: [
      'project.create', 'project.read', 'project.update',
      'user.read'
    ]
  },
  {
    id: '3',
    name: 'Team Member',
    email: 'member@company.com',
    role: 'Team Member',
    department: 'Engineering',
    permissions: [
      'project.read', 'project.update'
    ]
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call your API
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('authUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};