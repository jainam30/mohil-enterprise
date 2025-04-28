
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-xl font-semibold text-primary">Mohil Enterprise</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="bg-primary text-white p-2 rounded-full mr-2">
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={logout} 
          className="text-gray-500 hover:text-destructive"
        >
          <LogOut size={20} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
