import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Breadcrumbs: React.FC = () => {
  const { breadcrumbs, setCurrentView, setBreadcrumbs } = useAppContext();

  const handleBreadcrumbClick = (path: string, index: number) => {
    setCurrentView(path);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <button
        onClick={() => {
          setCurrentView('dashboard');
          setBreadcrumbs([]);
        }}
        className="flex items-center hover:text-gray-900 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => handleBreadcrumbClick(crumb.path, index)}
            className={`hover:text-gray-900 transition-colors ${
              index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''
            }`}
          >
            {crumb.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};