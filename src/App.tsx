import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useAppContext } from './context/AppContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Breadcrumbs } from './components/Layout/Breadcrumbs';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProjectList } from './components/Projects/ProjectList';
import { ProjectDetail } from './components/Projects/ProjectDetail';
import { UserManagement } from './components/Admin/UserManagement';
import { DepartmentManagement } from './components/Admin/DepartmentManagement';
import { SystemConfig } from './components/Admin/SystemConfig';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { currentView } = useAppContext();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectList />;
      case 'project-detail':
        return <ProjectDetail />;
      case 'admin-users':
        return <UserManagement />;
      case 'admin-departments':
        return <DepartmentManagement />;
      case 'admin-config':
        return <SystemConfig />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <Breadcrumbs />
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;