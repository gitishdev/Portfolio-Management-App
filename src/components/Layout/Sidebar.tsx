import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Building2,
  Cog,
  Shield
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, setBreadcrumbs } = useAppContext();
  const { hasPermission } = useAuth();

  const handleNavigation = (view: string, breadcrumbPath?: { label: string; path: string }[]) => {
    setCurrentView(view);
    setBreadcrumbs(breadcrumbPath || []);
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      view: 'dashboard',
      permission: 'project.read'
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: FolderOpen, 
      view: 'projects',
      permission: 'project.read'
    },
  ];

  const adminMenuItems = [
    {
      id: 'admin-users',
      label: 'User Management',
      icon: Users,
      view: 'admin-users',
      permission: 'admin.users'
    },
    {
      id: 'admin-departments',
      label: 'Departments',
      icon: Building2,
      view: 'admin-departments',
      permission: 'admin.departments'
    },
    {
      id: 'admin-config',
      label: 'Project Config',
      icon: Cog,
      view: 'admin-config',
      permission: 'admin.config'
    }
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">PortfolioHub</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            hasPermission(item.permission) && (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.view)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentView === item.view
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          ))}

          {hasPermission('admin.users') && (
            <>
              <div className="pt-6 pb-2">
                <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Administration
                </div>
              </div>
              
              {adminMenuItems.map((item) => (
                hasPermission(item.permission) && (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.view, [{ label: 'Administration', path: 'admin' }])}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      currentView === item.view
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};