export interface Project {
  id: string;
  assetId: string;
  projectName: string;
  assetApprovalDate: string;
  executionPhase: string;
  budgetApproved: number;
  budgetSpentYTD: number;
  budgetRemaining: number;
  capexAllocated: number;
  opexAllocated: number;
  capexSpent: number;
  opexSpent: number;
  capexRemaining: number;
  opexRemaining: number;
  targetLaunchDate: string;
  targetLaunchQuarter: string;
  status: 'Green' | 'Amber' | 'Red';
  department: string;
  productManager: string;
  engineeringManager: string;
  projectManager: string;
  employees: number;
  contractors: number;
  previousMonthProgress: string;
  upcomingMonthPlan: string;
  executiveGuidance: string;
  risks: Risk[];
  statusJustification?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Risk {
  id: string;
  description: string;
  owner: string;
  impact: 'Low' | 'Medium' | 'High';
  resolutionTimeline: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface BudgetData {
  totalBudget: number;
  actualSpend: number;
  capex: number;
  opex: number;
  capexSpent: number;
  opexSpent: number;
  departmentBreakdown: DepartmentBudget[];
}

export interface DepartmentBudget {
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
  projects: number;
}

export interface WorkforceData {
  employees: number;
  contractors: number;
  departmentBreakdown: {
    department: string;
    employees: number;
    contractors: number;
  }[];
}

export interface FiscalConfig {
  fiscalYear: number;
  currentQuarter: number;
  quarters: {
    q1: { start: string; end: string };
    q2: { start: string; end: string };
    q3: { start: string; end: string };
    q4: { start: string; end: string };
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Team Member';
  department: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  needsPasswordReset?: boolean;
  isFirstLogin?: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
}

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface AdminConfig {
  departments: Department[];
  projectPhases: ProjectPhase[];
  columnConfig: ColumnConfig[];
  fiscalConfig: FiscalConfig;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Team Member';
  department: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface RolePermission {
  role: 'Admin' | 'Manager' | 'Team Member';
  permissions: string[];
}