import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Project, Risk } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
}

interface ProjectFormData {
  projectName: string;
  assetId: string;
  department: string;
  executionPhase: string;
  budgetApproved: number;
  budgetSpentYTD: number;
  capexAllocated: number;
  opexAllocated: number;
  capexSpent: number;
  opexSpent: number;
  targetLaunchDate: string;
  targetLaunchQuarter: string;
  status: 'Green' | 'Amber' | 'Red';
  productManager: string;
  engineeringManager: string;
  projectManager: string;
  employees: number;
  contractors: number;
  previousMonthProgress: string;
  upcomingMonthPlan: string;
  executiveGuidance: string;
  statusJustification?: string;
  risks: Risk[];
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, onSave }) => {
  const { adminConfig } = useAppContext();
  const { user } = useAuth();
  const [showStatusJustification, setShowStatusJustification] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<ProjectFormData>({
    defaultValues: project ? {
      projectName: project.projectName,
      assetId: project.assetId,
      department: project.department,
      executionPhase: project.executionPhase,
      budgetApproved: project.budgetApproved,
      budgetSpentYTD: project.budgetSpentYTD,
      capexAllocated: project.capexAllocated,
      opexAllocated: project.opexAllocated,
      capexSpent: project.capexSpent,
      opexSpent: project.opexSpent,
      targetLaunchDate: project.targetLaunchDate,
      targetLaunchQuarter: project.targetLaunchQuarter,
      status: project.status,
      productManager: project.productManager,
      engineeringManager: project.engineeringManager,
      projectManager: project.projectManager,
      employees: project.employees,
      contractors: project.contractors,
      previousMonthProgress: project.previousMonthProgress,
      upcomingMonthPlan: project.upcomingMonthPlan,
      executiveGuidance: project.executiveGuidance,
      statusJustification: project.statusJustification,
      risks: project.risks
    } : {
      projectName: '',
      assetId: '',
      department: '',
      executionPhase: 'Planning',
      budgetApproved: 0,
      budgetSpentYTD: 0,
      capexAllocated: 0,
      opexAllocated: 0,
      capexSpent: 0,
      opexSpent: 0,
      targetLaunchDate: '',
      targetLaunchQuarter: '',
      status: 'Green',
      productManager: '',
      engineeringManager: '',
      projectManager: '',
      employees: 1,
      contractors: 0,
      previousMonthProgress: '',
      upcomingMonthPlan: '',
      executiveGuidance: '',
      risks: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'risks'
  });

  const watchedStatus = watch('status');

  useEffect(() => {
    setShowStatusJustification(watchedStatus === 'Amber' || watchedStatus === 'Red');
  }, [watchedStatus]);

  const addRisk = () => {
    append({
      id: Date.now().toString(),
      description: '',
      owner: '',
      impact: 'Medium',
      resolutionTimeline: '',
      status: 'Open'
    });
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData = {
        ...data,
        budgetRemaining: data.budgetApproved - data.budgetSpentYTD,
        capexRemaining: data.capexAllocated - data.capexSpent,
        opexRemaining: data.opexAllocated - data.opexSpent,
        assetApprovalDate: project?.assetApprovalDate || new Date().toISOString().split('T')[0],
        createdBy: project?.createdBy || user?.id || '',
        risks: data.risks.map(risk => ({
          ...risk,
          id: risk.id || Date.now().toString()
        }))
      };

      onSave(projectData);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                {...register('projectName', { required: 'Project name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project name"
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset ID <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                {...register('assetId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="AST-2024-XXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                {...register('department')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Department</option>
                {adminConfig.departments.filter(d => d.isActive).map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Execution Phase <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                {...register('executionPhase')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {adminConfig.projectPhases.filter(p => p.isActive).map(phase => (
                  <option key={phase.id} value={phase.name}>{phase.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Approved <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="number"
                {...register('budgetApproved', { 
                  min: { value: 0, message: 'Budget must be positive' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
              {errors.budgetApproved && (
                <p className="mt-1 text-sm text-red-600">{errors.budgetApproved.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Launch Date <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="date"
                {...register('targetLaunchDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Launch Quarter <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                {...register('targetLaunchQuarter')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Q2 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Green">Green</option>
                <option value="Amber">Amber</option>
                <option value="Red">Red</option>
              </select>
            </div>
          </div>

          {showStatusJustification && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Justification *
              </label>
              <textarea
                {...register('statusJustification', { 
                  required: showStatusJustification ? 'Status justification is required for Amber/Red status' : false 
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain why the project status is Amber or Red..."
              />
              {errors.statusJustification && (
                <p className="mt-1 text-sm text-red-600">{errors.statusJustification.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Manager <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                {...register('productManager')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Engineering Manager <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                {...register('engineeringManager')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Manager <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                {...register('projectManager')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employees <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="number"
                {...register('employees', { 
                  min: { value: 0, message: 'Employees must be 0 or more' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
              {errors.employees && (
                <p className="mt-1 text-sm text-red-600">{errors.employees.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contractors <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="number"
                {...register('contractors', { 
                  min: { value: 0, message: 'Contractors must be 0 or more' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
              {errors.contractors && (
                <p className="mt-1 text-sm text-red-600">{errors.contractors.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Executive Guidance Needed <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                {...register('executiveGuidance')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe any executive guidance needed..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Month Progress <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                {...register('previousMonthProgress')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe progress made in the previous month..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upcoming Month Plan <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                {...register('upcomingMonthPlan')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe plans for the upcoming month..."
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Risk Management <span className="text-gray-500">(Optional)</span>
              </label>
              <button
                type="button"
                onClick={addRisk}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Risk</span>
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">Risk {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        {...register(`risks.${index}.description`)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe the risk..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Owner
                      </label>
                      <input
                        {...register(`risks.${index}.owner`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Risk owner"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Impact
                      </label>
                      <select
                        {...register(`risks.${index}.impact`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resolution Timeline
                      </label>
                      <input
                        type="date"
                        {...register(`risks.${index}.resolutionTimeline`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        {...register(`risks.${index}.status`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                  <p>No risks added yet. Click "Add Risk" to get started.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};