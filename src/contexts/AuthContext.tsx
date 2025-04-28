
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { User, LoginCredentials, AuthState, UserRole } from '@/types/auth';

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@mohil.com',
    password: 'admin123',
    role: 'admin' as UserRole
  },
  {
    id: '2',
    name: 'Supervisor User',
    email: 'supervisor@mohil.com',
    password: 'supervisor123',
    role: 'supervisor' as UserRole
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  registerSupervisor: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false
  });
  const { toast } = useToast();

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    try {
      // For demo purposes, find the user in our mock data
      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        // Create a User object without the password
        const authenticatedUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        setAuthState({
          user: authenticatedUser,
          isAuthenticated: true,
          isLoading: false
        });
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        return true;
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Login error",
        description: "There was a problem logging in",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const registerSupervisor = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if the current user is an admin
    if (authState.user?.role !== 'admin') {
      toast({
        title: "Permission denied",
        description: "Only admins can register supervisors",
        variant: "destructive"
      });
      return false;
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call to register supervisor
    try {
      // For demo purposes, we'll just show a success message
      // In a real app, this would add to the database
      toast({
        title: "Supervisor registered",
        description: `${name} has been registered as a supervisor`,
      });
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Registration error",
        description: "There was a problem registering the supervisor",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const value = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    logout,
    registerSupervisor
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
