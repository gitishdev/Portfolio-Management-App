import { Project, User, Department, ProjectPhase, ColumnConfig } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    assetId: 'AST-2024-001',
    projectName: 'Next-Gen Mobile Platform',
    assetApprovalDate: '2024-01-15',
    executionPhase: 'Development',
    budgetApproved: 2500000,
    budgetSpentYTD: 1250000,
    budgetRemaining: 1250000,
    capexAllocated: 1750000,
    opexAllocated: 750000,
    capexSpent: 875000,
    opexSpent: 375000,
    capexRemaining: 875000,
    opexRemaining: 375000,
    targetLaunchDate: '2024-06-30',
    targetLaunchQuarter: 'Q2 2024',
    status: 'Green',
    department: 'Engineering',
    productManager: 'Sarah Johnson',
    engineeringManager: 'Mike Chen',
    projectManager: 'Lisa Rodriguez',
    employees: 8,
    contractors: 4,
    previousMonthProgress: 'Completed API integration and user authentication modules. Performance testing showed 40% improvement.',
    upcomingMonthPlan: 'Focus on UI/UX implementation and beta testing preparation.',
    executiveGuidance: 'Need additional QA resources for comprehensive testing.',
    createdBy: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    risks: [
      {
        id: '1',
        description: 'Third-party API rate limiting may impact performance',
        owner: 'Mike Chen',
        impact: 'Medium',
        resolutionTimeline: '2024-03-15',
        status: 'In Progress'
      }
    ]
  },
  {
    id: '2',
    assetId: 'AST-2024-002',
    projectName: 'Cloud Infrastructure Modernization',
    assetApprovalDate: '2024-02-01',
    executionPhase: 'Planning',
    budgetApproved: 3800000,
    budgetSpentYTD: 950000,
    budgetRemaining: 2850000,
    capexAllocated: 2660000,
    opexAllocated: 1140000,
    capexSpent: 665000,
    opexSpent: 285000,
    capexRemaining: 1995000,
    opexRemaining: 855000,
    targetLaunchDate: '2024-09-15',
    targetLaunchQuarter: 'Q3 2024',
    status: 'Amber',
    department: 'Infrastructure',
    productManager: 'David Kim',
    engineeringManager: 'Jennifer Walsh',
    projectManager: 'Carlos Martinez',
    employees: 6,
    contractors: 2,
    previousMonthProgress: 'Completed initial architecture review and vendor selection process.',
    upcomingMonthPlan: 'Begin migration planning and security audit preparation.',
    executiveGuidance: 'Require budget approval for additional security tools.',
    statusJustification: 'Delayed due to extended vendor evaluation process and security compliance requirements.',
    createdBy: '2',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    risks: [
      {
        id: '2',
        description: 'Potential data migration challenges with legacy systems',
        owner: 'Jennifer Walsh',
        impact: 'High',
        resolutionTimeline: '2024-04-01',
        status: 'Open'
      }
    ]
  },
  {
    id: '3',
    assetId: 'AST-2024-003',
    projectName: 'Customer Analytics Platform',
    assetApprovalDate: '2024-01-20',
    executionPhase: 'Testing',
    budgetApproved: 1800000,
    budgetSpentYTD: 1620000,
    budgetRemaining: 180000,
    capexAllocated: 1260000,
    opexAllocated: 540000,
    capexSpent: 1134000,
    opexSpent: 486000,
    capexRemaining: 126000,
    opexRemaining: 54000,
    targetLaunchDate: '2024-04-15',
    targetLaunchQuarter: 'Q2 2024',
    status: 'Green',
    department: 'Data Science',
    productManager: 'Emily Zhang',
    engineeringManager: 'Robert Taylor',
    projectManager: 'Maria Santos',
    employees: 5,
    contractors: 3,
    previousMonthProgress: 'Completed data pipeline optimization and machine learning model training.',
    upcomingMonthPlan: 'Final user acceptance testing and deployment preparation.',
    executiveGuidance: 'Support needed for stakeholder training sessions.',
    createdBy: '1',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    risks: []
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Admin',
    department: 'IT',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-03-01T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Manager',
    department: 'Engineering',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-02-28T14:20:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'Team Member',
    department: 'Engineering',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-03-01T09:15:00Z'
  }
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical implementation',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Infrastructure',
    description: 'IT infrastructure and cloud services',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Product',
    description: 'Product management and strategy',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Data Science',
    description: 'Data analysis and machine learning',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockProjectPhases: ProjectPhase[] = [
  { id: '1', name: 'Planning', order: 1, isActive: true },
  { id: '2', name: 'Design', order: 2, isActive: true },
  { id: '3', name: 'Development', order: 3, isActive: true },
  { id: '4', name: 'Testing', order: 4, isActive: true },
  { id: '5', name: 'Implementation', order: 5, isActive: true },
  { id: '6', name: 'Deployment', order: 6, isActive: true },
  { id: '7', name: 'Maintenance', order: 7, isActive: true }
];

export const mockColumnConfig: ColumnConfig[] = [
  { key: 'projectName', label: 'Project Name', visible: true, order: 1 },
  { key: 'department', label: 'Department', visible: true, order: 2 },
  { key: 'executionPhase', label: 'Execution Phase', visible: true, order: 3 },
  { key: 'budgetApproved', label: 'Budget', visible: true, order: 4 },
  { key: 'targetLaunchDate', label: 'Target Launch', visible: true, order: 5 },
  { key: 'status', label: 'Status', visible: true, order: 6 },
  { key: 'actions', label: 'Actions', visible: true, order: 7 },
  { key: 'assetId', label: 'Asset ID', visible: false, order: 8 },
  { key: 'assetApprovalDate', label: 'Approval Date', visible: false, order: 9 },
  { key: 'leadership', label: 'Leadership', visible: false, order: 10 }
];