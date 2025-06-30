import React, { useState } from 'react';
import { Save, Settings, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ProjectPhase, ColumnConfig, FiscalConfig } from '../../types';

export const SystemConfig: React.FC = () => {
  const { adminConfig, updateProjectPhases, updateColumnConfig, updateFiscalConfig } = useAppContext();
  const { hasPermission } = useAuth();
  
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>(adminConfig.projectPhases);
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(adminConfig.columnConfig);
  const [fiscalConfig, setFiscalConfigState] = useState<FiscalConfig>(adminConfig.fiscalConfig);
  const [activeTab, setActiveTab] = useState<'phases' | 'columns' | 'fiscal'>('phases');

  const handleSavePhases = () => {
    updateProjectPhases(projectPhases);
  };

  const handleSaveColumns = () => {
    updateColumnConfig(columnConfig);
  };

  const handleSaveFiscal = () => {
    updateFiscalConfig(fiscalConfig);
  };

  const addPhase = () => {
    const newPhase: ProjectPhase = {
      id: Date.now().toString(),
      name: 'New Phase',
      order: projectPhases.length + 1,
      isActive: true
    };
    setProjectPhases([...projectPhases, newPhase]);
  };

  const updatePhase = (id: string, updates: Partial<ProjectPhase>) => {
    setProjectPhases(phases => phases.map(phase => 
      phase.id === id ? { ...phase, ...updates } : phase
    ));
  };

  const deletePhase = (id: string) => {
    setProjectPhases(phases => phases.filter(phase => phase.id !== id));
  };

  const movePhase = (id: string, direction: 'up' | 'down') => {
    const currentIndex = projectPhases.findIndex(p => p.id === id);
    if (currentIndex === -1) return;

    const newPhases = [...projectPhases];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < newPhases.length) {
      [newPhases[currentIndex], newPhases[targetIndex]] = [newPhases[targetIndex], newPhases[currentIndex]];
      
      // Update order numbers
      newPhases.forEach((phase, index) => {
        phase.order = index + 1;
      });
      
      setProjectPhases(newPhases);
    }
  };

  const toggleColumnVisibility = (key: string) => {
    setColumnConfig(columns => columns.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  const moveColumn = (key: string, direction: 'up' | 'down') => {
    const currentIndex = columnConfig.findIndex(c => c.key === key);
    if (currentIndex === -1) return;

    const newColumns = [...columnConfig];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex >= 0 && targetIndex < newColumns.length) {
      [newColumns[currentIndex], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[currentIndex]];
      
      // Update order numbers
      newColumns.forEach((column, index) => {
        column.order = index + 1;
      });
      
      setColumnConfig(newColumns);
    }
  };

  const updateQuarterDates = (quarter: string, field: 'start' | 'end', value: string) => {
    const newFiscalConfig = { ...fiscalConfig };
    newFiscalConfig.quarters = { ...newFiscalConfig.quarters };
    
    if (field === 'start') {
      // Update the start date
      newFiscalConfig.quarters[quarter as keyof typeof newFiscalConfig.quarters] = {
        ...newFiscalConfig.quarters[quarter as keyof typeof newFiscalConfig.quarters],
        start: value
      };
      
      // Calculate end date (3 months later)
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3);
      endDate.setDate(endDate.getDate() - 1); // Last day of the quarter
      
      newFiscalConfig.quarters[quarter as keyof typeof newFiscalConfig.quarters] = {
        ...newFiscalConfig.quarters[quarter as keyof typeof newFiscalConfig.quarters],
        end: endDate.toISOString().split('T')[0]
      };
      
      // Cascade to subsequent quarters
      const quarters = ['q1', 'q2', 'q3', 'q4'];
      const currentQuarterIndex = quarters.indexOf(quarter);
      
      if (currentQuarterIndex < 3) {
        let nextStartDate = new Date(endDate);
        nextStartDate.setDate(nextStartDate.getDate() + 1);
        
        for (let i = currentQuarterIndex + 1; i < quarters.length; i++) {
          const nextQuarter = quarters[i];
          const nextEndDate = new Date(nextStartDate);
          nextEndDate.setMonth(nextEndDate.getMonth() + 3);
          nextEndDate.setDate(nextEndDate.getDate() - 1);
          
          newFiscalConfig.quarters[nextQuarter as keyof typeof newFiscalConfig.quarters] = {
            start: nextStartDate.toISOString().split('T')[0],
            end: nextEndDate.toISOString().split('T')[0]
          };
          
          nextStartDate = new Date(nextEndDate);
          nextStartDate.setDate(nextStartDate.getDate() + 1);
        }
      }
    } else {
      // Manual end date update
      newFiscalConfig.quarters[quarter as keyof typeof newFiscalConfig.quarters] = {
        ...newFiscalConfig.quarters[quarter as keyof typeof newFiscalConfig.quarters],
        end: value
      };
    }
    
    setFiscalConfigState(newFiscalConfig);
  };

  if (!hasPermission('admin.config')) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to access project configuration.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Configuration</h1>
        <p className="text-gray-600">
          Configure project phases, column visibility, and fiscal settings
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'phases', label: 'Project Phases' },
              { id: 'columns', label: 'Column Configuration' },
              { id: 'fiscal', label: 'Fiscal Configuration' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'phases' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Project Execution Phases</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={addPhase}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Phase
                  </button>
                  <button
                    onClick={handleSavePhases}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {projectPhases.sort((a, b) => a.order - b.order).map((phase, index) => (
                  <div key={phase.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => movePhase(phase.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => movePhase(phase.id, 'down')}
                        disabled={index === projectPhases.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 w-8">
                      {phase.order}
                    </div>
                    
                    <input
                      type="text"
                      value={phase.name}
                      onChange={(e) => updatePhase(phase.id, { name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={phase.isActive}
                        onChange={(e) => updatePhase(phase.id, { isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                    
                    <button
                      onClick={() => deletePhase(phase.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'columns' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Project Portfolio Columns</h2>
                <button
                  onClick={handleSaveColumns}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

              <div className="space-y-3">
                {columnConfig.sort((a, b) => a.order - b.order).map((column, index) => (
                  <div key={column.key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveColumn(column.key, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveColumn(column.key, 'down')}
                        disabled={index === columnConfig.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 w-8">
                      {column.order}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{column.label}</div>
                      <div className="text-sm text-gray-500">{column.key}</div>
                    </div>
                    
                    <button
                      onClick={() => toggleColumnVisibility(column.key)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        column.visible
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {column.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span>{column.visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fiscal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Fiscal Year Configuration</h2>
                <button
                  onClick={handleSaveFiscal}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiscal Year
                  </label>
                  <input
                    type="number"
                    value={fiscalConfig.fiscalYear}
                    onChange={(e) => setFiscalConfigState({
                      ...fiscalConfig,
                      fiscalYear: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Quarter
                  </label>
                  <select
                    value={fiscalConfig.currentQuarter}
                    onChange={(e) => setFiscalConfigState({
                      ...fiscalConfig,
                      currentQuarter: parseInt(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Q1</option>
                    <option value={2}>Q2</option>
                    <option value={3}>Q3</option>
                    <option value={4}>Q4</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Quarter Definitions</h3>
                
                {Object.entries(fiscalConfig.quarters).map(([quarter, dates]) => (
                  <div key={quarter} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{quarter.toUpperCase()}</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dates.start}
                        onChange={(e) => updateQuarterDates(quarter, 'start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={dates.end}
                        onChange={(e) => updateQuarterDates(quarter, 'end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};