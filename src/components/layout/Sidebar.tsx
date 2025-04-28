
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from 'react-router-dom';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Home,
  Users,
  FileText,
  BarChart,
  Scissors,
  DollarSign,
  Settings,
  User,
  Clock,
  List
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <SidebarComponent>
      <SidebarContent>
        <div className="px-3 py-4">
          <div className="flex items-center px-2">
            <div className="bg-primary text-white p-2 rounded mr-2">
              <FileText size={20} />
            </div>
            <h1 className="text-xl font-bold text-primary">Mohil ERP</h1>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => isActive ? 'bg-primary/10 text-primary' : ''}
                  >
                    <Home size={18} />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/employees" 
                      className={({ isActive }) => isActive ? 'bg-primary/10 text-primary' : ''}
                    >
                      <User size={18} />
                      <span>Employees</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {!isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/workers" 
                      className={({ isActive }) => isActive ? 'bg-primary/10 text-primary' : ''}
                    >
                      <Users size={18} />
                      <span>Workers</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/products" 
                    className={({ isActive }) => isActive ? 'bg-primary/10 text-primary' : ''}
                  >
                    <Scissors size={18} />
                    <span>Products</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/production" 
                    className={({ isActive }) => isActive ? 'bg-primary/10 text-primary' : ''}
                  >
                    <Clock size={18} />
                    <span>Production</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Reports & Finance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/reports" 
                    className={({ isActive }) => isActive ? 'bg-primary/10 text-primary' : ''}
                  >
                    <BarChart size={18} />
                    <span>Reports</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/salary" 
                    className={({ isActive }) => isActive ? 'bg-primary/10 text-primary' : ''}
                  >
                    <DollarSign size={18} />
                    <span>Salary</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/users" 
                      className={({ isActive }) => isActive ? 'bg-primary/10 text-primary' : ''}
                    >
                      <User size={18} />
                      <span>User Management</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/settings" 
                      className={({ isActive }) => isActive ? 'bg-primary/10 text-primary' : ''}
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
