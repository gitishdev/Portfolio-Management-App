import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Project, BudgetData, WorkforceData, FiscalConfig, User, Department, ProjectPhase, ColumnConfig, AdminConfig } from '../types';
import { mockProjects, mockUsers, mockDepartments, mockProjectPhases, mockColumnConfig } from '../data/mockData';

interface AppContextType {
  projects: Project[];
  budgetData: BudgetData;
  workforceData: WorkforceData;
  users: User[];
  adminConfig: AdminConfig;
  currentView: string;
  selectedProject: Project | null;
  setCurrentView: (view: string) => void;
  setSelectedProject: (project: Project | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  breadcrumbs: { label: string; path: string }[];
  setBreadcrumbs: (breadcrumbs: { label: string; path: string }[]) => void;
  
  // CRUD operations
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string) => void;
  
  createDepartment: (department: Omit<Department, 'id' | 'createdAt'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  
  updateProjectPhases: (phases: ProjectPhase[]) => void;
  updateColumnConfig: (config: ColumnConfig[]) => void;
  updateFiscalConfig: (config: FiscalConfig) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>(mockProjectPhases);
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(mockColumnConfig);
  const [fiscalConfig, setFiscalConfigState] = useState<FiscalConfig>({
    fiscalYear: 2024,
    currentQuarter: 1,
    quarters: {
      q1: { start: '2024-01-01', end: '2024-03-31' },
      q2: { start: '2024-04-01', end: '2024-06-30' },
      q3: { start: '2024-07-01', end: '2024-09-30' },
      q4: { start: '2024-10-01', end: '2024-12-31' }
    }
  });
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; path: string }[]>([]);

  // Calculate budget data dynamically
  const budgetData: BudgetData = useMemo(() => {
    if (projects.length === 0) {
      return {
        totalBudget: 0,
        actualSpend: 0,
        capex: 0,
        opex: 0,
        capexSpent: 0,
        opexSpent: 0,
        departmentBreakdown: []
      };
    }

    const totalBudget = projects.reduce((sum, project) => {
      const approved = Number(project.budgetApproved) || 0;
      return sum + approved;
    }, 0);
    
    const actualSpend = projects.reduce((sum, project) => {
      const spent = Number(project.budgetSpentYTD) || 0;
      return sum + spent;
    }, 0);
    
    // Calculate CAPEX and OPEX from project allocations
    const capex = projects.reduce((sum, project) => {
      const allocated = Number(project.capexAllocated) || 0;
      return sum + allocated;
    }, 0);
    
    const opex = projects.reduce((sum, project) => {
      const allocated = Number(project.opexAllocated) || 0;
      return sum + allocated;
    }, 0);

    const capexSpent = projects.reduce((sum, project) => {
      const spent = Number(project.capexSpent) || 0;
      return sum + spent;
    }, 0);
    
    const opexSpent = projects.reduce((sum, project) => {
      const spent = Number(project.opexSpent) || 0;
      return sum + spent;
    }, 0);

    // Calculate department breakdown
    const deptMap = new Map<string, { allocated: number; spent: number; projects: number }>();
    
    projects.forEach(project => {
      const approved = Number(project.budgetApproved) || 0;
      const spent = Number(project.budgetSpentYTD) || 0;
      
      const existing = deptMap.get(project.department) || { allocated: 0, spent: 0, projects: 0 };
      deptMap.set(project.department, {
        allocated: existing.allocated + approved,
        spent: existing.spent + spent,
        projects: existing.projects + 1
      });
    });

    const departmentBreakdown = Array.from(deptMap.entries()).map(([department, data]) => ({
      department,
      allocated: data.allocated,
      spent: data.spent,
      remaining: data.allocated - data.spent,
      projects: data.projects
    }));

    return {
      totalBudget,
      actualSpend,
      capex,
      opex,
      capexSpent,
      opexSpent,
      departmentBreakdown
    };
  }, [projects]);

  // Calculate workforce data dynamically
  const workforceData: WorkforceData = useMemo(() => {
    if (projects.length === 0) {
      return {
        employees: 0,
        contractors: 0,
        departmentBreakdown: []
      };
    }

    const employees = projects.reduce((sum, project) => {
      const emp = Number(project.employees) || 0;
      return sum + emp;
    }, 0);
    
    const contractors = projects.reduce((sum, project) => {
      const cont = Number(project.contractors) || 0;
      return sum + cont;
    }, 0);

    // Calculate department breakdown
    const deptMap = new Map<string, { employees: number; contractors: number }>();
    
    projects.forEach(project => {
      const emp = Number(project.employees) || 0;
      const cont = Number(project.contractors) || 0;
      
      const existing = deptMap.get(project.department) || { employees: 0, contractors: 0 };
      deptMap.set(project.department, {
        employees: existing.employees + emp,
        contractors: existing.contractors + cont
      });
    });

    const departmentBreakdown = Array.from(deptMap.entries()).map(([department, data]) => ({
      department,
      employees: data.employees,
      contractors: data.contractors
    }));

    return {
      employees,
      contractors,
      departmentBreakdown
    };
  }, [projects]);

  const adminConfig: AdminConfig = {
    departments,
    projectPhases,
    columnConfig,
    fiscalConfig
  };

  // Project CRUD operations
  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const budgetApproved = Number(projectData.budgetApproved) || 0;
    const budgetSpentYTD = Number(projectData.budgetSpentYTD) || 0;
    
    // Calculate CAPEX/OPEX allocations (70/30 split by default)
    const capexAllocated = Number(projectData.capexAllocated) || Math.round(budgetApproved * 0.7);
    const opexAllocated = Number(projectData.opexAllocated) || Math.round(budgetApproved * 0.3);
    const capexSpent = Number(projectData.capexSpent) || 0;
    const opexSpent = Number(projectData.opexSpent) || 0;

    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      budgetApproved,
      budgetSpentYTD,
      budgetRemaining: budgetApproved - budgetSpentYTD,
      capexAllocated,
      opexAllocated,
      capexSpent,
      opexSpent,
      capexRemaining: capexAllocated - capexSpent,
      opexRemaining: opexAllocated - opexSpent,
      employees: Number(projectData.employees) || 0,
      contractors: Number(projectData.contractors) || 0,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(project => {
      if (project.id === id) {
        const updatedProject = { ...project, ...projectData, updatedAt: new Date().toISOString() };
        
        // Recalculate budget remaining if budget fields are updated
        if (projectData.budgetApproved !== undefined || projectData.budgetSpentYTD !== undefined) {
          const approved = Number(updatedProject.budgetApproved) || 0;
          const spent = Number(updatedProject.budgetSpentYTD) || 0;
          updatedProject.budgetRemaining = approved - spent;
        }

        // Recalculate CAPEX/OPEX remaining if those fields are updated
        if (projectData.capexAllocated !== undefined || projectData.capexSpent !== undefined) {
          const allocated = Number(updatedProject.capexAllocated) || 0;
          const spent = Number(updatedProject.capexSpent) || 0;
          updatedProject.capexRemaining = allocated - spent;
        }

        if (projectData.opexAllocated !== undefined || projectData.opexSpent !== undefined) {
          const allocated = Number(updatedProject.opexAllocated) || 0;
          const spent = Number(updatedProject.opexSpent) || 0;
          updatedProject.opexRemaining = allocated - spent;
        }
        
        // Ensure workforce fields are numbers
        if (projectData.employees !== undefined) {
          updatedProject.employees = Number(projectData.employees) || 0;
        }
        if (projectData.contractors !== undefined) {
          updatedProject.contractors = Number(projectData.contractors) || 0;
        }
        
        return updatedProject;
      }
      return project;
    }));
    
    // Update selected project if it's the one being updated
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject(prev => {
        if (!prev) return null;
        const updatedProject = { ...prev, ...projectData, updatedAt: new Date().toISOString() };
        
        // Recalculate budget remaining
        if (projectData.budgetApproved !== undefined || projectData.budgetSpentYTD !== undefined) {
          const approved = Number(updatedProject.budgetApproved) || 0;
          const spent = Number(updatedProject.budgetSpentYTD) || 0;
          updatedProject.budgetRemaining = approved - spent;
        }
        
        return updatedProject;
      });
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  // User CRUD operations
  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isFirstLogin: true,
      needsPasswordReset: true
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const resetUserPassword = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, needsPasswordReset: true, isFirstLogin: false } : user
    ));
  };

  // Department CRUD operations
  const createDepartment = (deptData: Omit<Department, 'id' | 'createdAt'>) => {
    const newDepartment: Department = {
      ...deptData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDepartments(prev => [...prev, newDepartment]);
  };

  const updateDepartment = (id: string, deptData: Partial<Department>) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === id ? { ...dept, ...deptData } : dept
    ));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
  };

  // Config updates
  const updateProjectPhases = (phases: ProjectPhase[]) => {
    setProjectPhases(phases);
  };

  const updateColumnConfig = (config: ColumnConfig[]) => {
    setColumnConfig(config);
  };

  const updateFiscalConfig = (config: FiscalConfig) => {
    setFiscalConfigState(config);
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        budgetData,
        workforceData,
        users,
        adminConfig,
        currentView,
        selectedProject,
        setCurrentView,
        setSelectedProject,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        departmentFilter,
        setDepartmentFilter,
        breadcrumbs,
        setBreadcrumbs,
        createProject,
        updateProject,
        deleteProject,
        createUser,
        updateUser,
        deleteUser,
        resetUserPassword,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        updateProjectPhases,
        updateColumnConfig,
        updateFiscalConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};