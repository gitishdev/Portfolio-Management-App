import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Department } from '../../types';
import { DepartmentForm } from './DepartmentForm';

export const DepartmentManagement: React.FC = () => {
  const { adminConfig, createDepartment, updateDepartment, deleteDepartment } = useAppContext();
  const { hasPermission } = useAuth();
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const handleCreateDepartment = () => {
    setEditingDepartment(null);
    setShowDepartmentForm(true);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setShowDepartmentForm(true);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteDepartment(departmentId);
    }
  };

  const handleToggleDepartmentStatus = (department: Department) => {
    updateDepartment(department.id, { isActive: !department.isActive });
  };

  const handleSaveDepartment = (deptData: Partial<Department>) => {
    if (editingDepartment) {
      updateDepartment(editingDepartment.id, deptData);
    } else {
      createDepartment(deptData as Omit<Department, 'id' | 'createdAt'>);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!hasPermission('admin.departments')) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to access department management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Management</h1>
          <p className="text-gray-600">
            Manage organizational departments and their configurations
          </p>
        </div>
        <button
          onClick={handleCreateDepartment}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminConfig.departments.map((department) => (
          <div key={department.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  department.isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Building2 className={`w-5 h-5 ${
                    department.isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{department.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    department.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {department.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleEditDepartment(department)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit department"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteDepartment(department.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{department.description}</p>
            
            <div className="text-xs text-gray-500">
              Created: {formatDate(department.createdAt)}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleToggleDepartmentStatus(department)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  department.isActive
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
              >
                {department.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDepartmentForm && (
        <DepartmentForm
          department={editingDepartment || undefined}
          onClose={() => setShowDepartmentForm(false)}
          onSave={handleSaveDepartment}
        />
      )}
    </div>
  );
};