import React, { useMemo, useState } from 'react';
import { Calendar, Users, Filter, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProjectForm } from './ProjectForm';
import { Project } from '../../types';

type SortField = 'assetId' | 'projectName' | 'department' | 'assetApprovalDate' | 'executionPhase' | 'budgetApproved' | 'targetLaunchDate' | 'status';
type SortDirection = 'asc' | 'desc';

export const ProjectList: React.FC = () => {
  const { 
    projects, 
    searchQuery, 
    statusFilter, 
    setStatusFilter, 
    departmentFilter, 
    setDepartmentFilter,
    setCurrentView,
    setSelectedProject,
    adminConfig,
    createProject,
    updateProject,
    deleteProject
  } = useAppContext();

  const { hasPermission } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState<SortField>('projectName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const visibleColumns = useMemo(() => {
    return adminConfig.columnConfig
      .filter(col => col.visible)
      .sort((a, b) => a.order - b.order);
  }, [adminConfig.columnConfig]);

  const sortedAndFilteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      const matchesDepartment = departmentFilter === 'All' || project.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'assetApprovalDate' || sortField === 'targetLaunchDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'budgetApproved') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, searchQuery, statusFilter, departmentFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedAndFilteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedAndFilteredProjects.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const formatCurrency = (amount: number) => {
    const millions = amount / 1000000;
    if (millions >= 1000) {
      return `$${(millions / 1000).toFixed(2)}B`;
    }
    return `$${millions.toFixed(2)}M`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('project-detail');
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
    }
  };

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      createProject(projectData as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);
    }
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode; className?: string }> = ({ 
    field, 
    children, 
    className = "" 
  }) => (
    <th 
      className={`text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        {getSortIcon(field)}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Portfolio</h1>
          <p className="text-gray-600">
            Manage and monitor all active projects across your organization
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {hasPermission('project.create') && (
            <button
              onClick={handleCreateProject}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Green">Green</option>
                <option value="Amber">Amber</option>
                <option value="Red">Red</option>
              </select>
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Departments</option>
                {adminConfig.departments.filter(d => d.isActive).map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-500">entries</span>
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedAndFilteredProjects.length)} of {sortedAndFilteredProjects.length} projects
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {visibleColumns.map(column => {
                    switch (column.key) {
                      case 'projectName':
                        return <SortableHeader key={column.key} field="projectName" className="w-64">Project Name</SortableHeader>;
                      case 'department':
                        return <SortableHeader key={column.key} field="department" className="w-32">Department</SortableHeader>;
                      case 'executionPhase':
                        return <SortableHeader key={column.key} field="executionPhase" className="w-32">Execution Phase</SortableHeader>;
                      case 'budgetApproved':
                        return <SortableHeader key={column.key} field="budgetApproved" className="w-32">Budget</SortableHeader>;
                      case 'targetLaunchDate':
                        return <SortableHeader key={column.key} field="targetLaunchDate" className="w-32">Target Launch</SortableHeader>;
                      case 'status':
                        return <SortableHeader key={column.key} field="status" className="w-24">Status</SortableHeader>;
                      case 'actions':
                        return <th key={column.key} className="text-left py-3 px-4 font-medium text-gray-900 w-24">Actions</th>;
                      case 'assetId':
                        return <SortableHeader key={column.key} field="assetId" className="w-32">Asset ID</SortableHeader>;
                      case 'assetApprovalDate':
                        return <SortableHeader key={column.key} field="assetApprovalDate" className="w-32">Approval Date</SortableHeader>;
                      case 'leadership':
                        return <th key={column.key} className="text-left py-3 px-4 font-medium text-gray-900 w-40">Leadership</th>;
                      default:
                        return null;
                    }
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    {visibleColumns.map(column => {
                      switch (column.key) {
                        case 'projectName':
                          return (
                            <td key={column.key} className="py-4 px-4">
                              <button
                                onClick={() => handleProjectClick(project)}
                                className="text-gray-900 hover:text-blue-600 font-medium hover:underline text-left truncate block w-full"
                                title={project.projectName}
                              >
                                {project.projectName}
                              </button>
                            </td>
                          );
                        case 'department':
                          return (
                            <td key={column.key} className="py-4 px-4 truncate">
                              <span className="text-sm text-gray-600">{project.department || '-'}</span>
                            </td>
                          );
                        case 'executionPhase':
                          return (
                            <td key={column.key} className="py-4 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate">
                                {project.executionPhase || '-'}
                              </span>
                            </td>
                          );
                        case 'budgetApproved':
                          return (
                            <td key={column.key} className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {project.budgetApproved ? formatCurrency(project.budgetApproved) : '-'}
                                </div>
                                {project.budgetSpentYTD > 0 && (
                                  <div className="text-xs text-gray-500 truncate">
                                    Spent: {formatCurrency(project.budgetSpentYTD)}
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        case 'targetLaunchDate':
                          return (
                            <td key={column.key} className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {formatDate(project.targetLaunchDate)}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {project.targetLaunchQuarter || '-'}
                                </div>
                              </div>
                            </td>
                          );
                        case 'status':
                          return (
                            <td key={column.key} className="py-4 px-4">
                              <StatusBadge status={project.status} size="sm" />
                            </td>
                          );
                        case 'actions':
                          return (
                            <td key={column.key} className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                {hasPermission('project.update') && (
                                  <button
                                    onClick={(e) => handleEditProject(project, e)}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Edit project"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                )}
                                {hasPermission('project.delete') && (
                                  <button
                                    onClick={(e) => handleDeleteProject(project.id, e)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete project"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        case 'assetId':
                          return (
                            <td key={column.key} className="py-4 px-4 truncate">
                              <button
                                onClick={() => handleProjectClick(project)}
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                              >
                                {project.assetId || '-'}
                              </button>
                            </td>
                          );
                        case 'assetApprovalDate':
                          return (
                            <td key={column.key} className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="text-sm text-gray-600 truncate">{formatDate(project.assetApprovalDate)}</span>
                              </div>
                            </td>
                          );
                        case 'leadership':
                          return (
                            <td key={column.key} className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <span className="text-xs text-gray-600 truncate">PM: {project.productManager || '-'}</span>
                                </div>
                                <div className="text-xs text-gray-600 truncate">EM: {project.engineeringManager || '-'}</div>
                                <div className="text-xs text-gray-600">Team: {(project.employees || 0) + (project.contractors || 0)}</div>
                              </div>
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages} • {sortedAndFilteredProjects.length} total projects
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showProjectForm && (
        <ProjectForm
          project={editingProject || undefined}
          onClose={() => setShowProjectForm(false)}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};