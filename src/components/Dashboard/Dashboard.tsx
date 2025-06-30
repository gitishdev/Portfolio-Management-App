import React, { useMemo } from 'react';
import { BudgetOverview } from './BudgetOverview';
import { ProjectMetrics } from './ProjectMetrics';
import { useAppContext } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const { projects, searchQuery } = useAppContext();

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    
    return projects.filter(project =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.productManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.engineeringManager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectManager.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive overview of your portfolio performance and project metrics
          {searchQuery && (
            <span className="ml-2 text-blue-600">
              • Filtered by "{searchQuery}" ({filteredProjects.length} results)
            </span>
          )}
        </p>
      </div>

      <BudgetOverview />
      <ProjectMetrics />
    </div>
  );
};