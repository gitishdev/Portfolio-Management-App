import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, Users, AlertTriangle, CheckCircle, Clock, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProjectForm } from './ProjectForm';
import { Risk } from '../../types';

export const ProjectDetail: React.FC = () => {
  const { selectedProject, setCurrentView, updateProject } = useAppContext();
  const { hasPermission } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingRisks, setEditingRisks] = useState(false);
  const [sectionValues, setSectionValues] = useState({
    executiveGuidance: '',
    previousMonthProgress: '',
    upcomingMonthPlan: ''
  });
  const [risks, setRisks] = useState<Risk[]>([]);

  React.useEffect(() => {
    if (selectedProject) {
      setSectionValues({
        executiveGuidance: selectedProject.executiveGuidance,
        previousMonthProgress: selectedProject.previousMonthProgress,
        upcomingMonthPlan: selectedProject.upcomingMonthPlan
      });
      setRisks(selectedProject.risks);
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No project selected</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const budgetUtilization = Math.round((selectedProject.budgetSpentYTD / selectedProject.budgetApproved) * 100);

  const handleSaveProject = (projectData: Partial<typeof selectedProject>) => {
    updateProject(selectedProject.id, projectData);
    setShowEditForm(false);
  };

  const handleEditSection = (section: string) => {
    setEditingSection(section);
  };

  const handleSaveSection = (section: string) => {
    updateProject(selectedProject.id, { [section]: sectionValues[section as keyof typeof sectionValues] });
    setEditingSection(null);
  };

  const handleCancelEdit = () => {
    setSectionValues({
      executiveGuidance: selectedProject.executiveGuidance,
      previousMonthProgress: selectedProject.previousMonthProgress,
      upcomingMonthPlan: selectedProject.upcomingMonthPlan
    });
    setEditingSection(null);
  };

  const handleAddRisk = () => {
    const newRisk: Risk = {
      id: Date.now().toString(),
      description: '',
      owner: '',
      impact: 'Medium',
      resolutionTimeline: '',
      status: 'Open'
    };
    setRisks([...risks, newRisk]);
  };

  const handleUpdateRisk = (index: number, field: keyof Risk, value: string) => {
    const updatedRisks = [...risks];
    updatedRisks[index] = { ...updatedRisks[index], [field]: value };
    setRisks(updatedRisks);
  };

  const handleRemoveRisk = (index: number) => {
    setRisks(risks.filter((_, i) => i !== index));
  };

  const handleSaveRisks = () => {
    updateProject(selectedProject.id, { risks });
    setEditingRisks(false);
  };

  const handleCancelRiskEdit = () => {
    setRisks(selectedProject.risks);
    setEditingRisks(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('projects')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>
        
        {hasPermission('project.update') && (
          <button
            onClick={() => setShowEditForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Project</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header Section - Compact Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{selectedProject.projectName}</h1>
              <StatusBadge status={selectedProject.status} />
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <span>Asset ID: <span className="font-medium">{selectedProject.assetId}</span></span>
              <span>•</span>
              <span>Department: <span className="font-medium">{selectedProject.department}</span></span>
              <span>•</span>
              <span>Phase: <span className="font-medium">{selectedProject.executionPhase}</span></span>
            </div>

            {/* Budget Overview */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Budget Overview</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Approved:</span>
                  <p className="font-bold text-blue-900">{formatCurrency(selectedProject.budgetApproved)}</p>
                </div>
                <div>
                  <span className="text-blue-700">Spent YTD:</span>
                  <p className="font-bold text-blue-900">{formatCurrency(selectedProject.budgetSpentYTD)}</p>
                </div>
                <div>
                  <span className="text-blue-700">Remaining:</span>
                  <p className="font-bold text-blue-900">{formatCurrency(selectedProject.budgetRemaining)}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-blue-700">Utilization</span>
                  <span className="text-sm font-bold text-blue-900">{budgetUtilization}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${budgetUtilization}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Leadership Team */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Leadership Team</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Product Manager:</span>
                  <p className="font-medium text-gray-900">{selectedProject.productManager}</p>
                </div>
                <div>
                  <span className="text-gray-500">Engineering Manager:</span>
                  <p className="font-medium text-gray-900">{selectedProject.engineeringManager}</p>
                </div>
                <div>
                  <span className="text-gray-500">Project Manager:</span>
                  <p className="font-medium text-gray-900">{selectedProject.projectManager}</p>
                </div>
                <div>
                  <span className="text-gray-500">Team Composition:</span>
                  <p className="font-medium text-gray-900">{selectedProject.employees} employees, {selectedProject.contractors} contractors</p>
                </div>
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Asset Approval:</span>
                  <p className="font-medium text-gray-900">{formatDate(selectedProject.assetApprovalDate)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Target Launch:</span>
                  <p className="font-medium text-gray-900">{formatDate(selectedProject.targetLaunchDate)}</p>
                  <p className="text-xs text-gray-600">{selectedProject.targetLaunchQuarter || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Section - Priority Order */}
        <div className="space-y-6">
          {/* Executive Guidance Needed */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-yellow-900">Executive Guidance Needed</h2>
              {hasPermission('project.update') && (
                <button
                  onClick={() => editingSection === 'executiveGuidance' ? handleSaveSection('executiveGuidance') : handleEditSection('executiveGuidance')}
                  className="flex items-center space-x-2 px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  {editingSection === 'executiveGuidance' ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{editingSection === 'executiveGuidance' ? 'Save' : 'Edit'}</span>
                </button>
              )}
            </div>
            {editingSection === 'executiveGuidance' ? (
              <div className="space-y-3">
                <textarea
                  value={sectionValues.executiveGuidance}
                  onChange={(e) => setSectionValues({ ...sectionValues, executiveGuidance: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveSection('executiveGuidance')}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-yellow-800 leading-relaxed">{selectedProject.executiveGuidance}</p>
            )}
          </div>

          {/* Previous Month Progress */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-900">Previous Month Progress</h2>
              {hasPermission('project.update') && (
                <button
                  onClick={() => editingSection === 'previousMonthProgress' ? handleSaveSection('previousMonthProgress') : handleEditSection('previousMonthProgress')}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingSection === 'previousMonthProgress' ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{editingSection === 'previousMonthProgress' ? 'Save' : 'Edit'}</span>
                </button>
              )}
            </div>
            {editingSection === 'previousMonthProgress' ? (
              <div className="space-y-3">
                <textarea
                  value={sectionValues.previousMonthProgress}
                  onChange={(e) => setSectionValues({ ...sectionValues, previousMonthProgress: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveSection('previousMonthProgress')}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-green-800 leading-relaxed">{selectedProject.previousMonthProgress}</p>
            )}
          </div>

          {/* Upcoming Month Plan */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Upcoming Month Plan</h2>
              {hasPermission('project.update') && (
                <button
                  onClick={() => editingSection === 'upcomingMonthPlan' ? handleSaveSection('upcomingMonthPlan') : handleEditSection('upcomingMonthPlan')}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSection === 'upcomingMonthPlan' ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{editingSection === 'upcomingMonthPlan' ? 'Save' : 'Edit'}</span>
                </button>
              )}
            </div>
            {editingSection === 'upcomingMonthPlan' ? (
              <div className="space-y-3">
                <textarea
                  value={sectionValues.upcomingMonthPlan}
                  onChange={(e) => setSectionValues({ ...sectionValues, upcomingMonthPlan: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveSection('upcomingMonthPlan')}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-blue-800 leading-relaxed">{selectedProject.upcomingMonthPlan}</p>
            )}
          </div>

          {/* Status Justification */}
          {selectedProject.statusJustification && (
            <div className="bg-red-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Status Justification
              </h2>
              <p className="text-red-800 leading-relaxed">{selectedProject.statusJustification}</p>
            </div>
          )}

          {/* Risk Management */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Risk Management</h2>
              {hasPermission('project.update') && (
                <button
                  onClick={() => editingRisks ? handleSaveRisks() : setEditingRisks(true)}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {editingRisks ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{editingRisks ? 'Save' : 'Edit'}</span>
                </button>
              )}
            </div>
            
            {editingRisks ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Manage project risks</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddRisk}
                      className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Risk</span>
                    </button>
                    <button
                      onClick={handleSaveRisks}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Save All
                    </button>
                    <button
                      onClick={handleCancelRiskEdit}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {risks.map((risk, index) => (
                  <div key={risk.id} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Risk {index + 1}</h4>
                      <button
                        onClick={() => handleRemoveRisk(index)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={risk.description}
                          onChange={(e) => handleUpdateRisk(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                        <input
                          value={risk.owner}
                          onChange={(e) => handleUpdateRisk(index, 'owner', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
                        <select
                          value={risk.impact}
                          onChange={(e) => handleUpdateRisk(index, 'impact', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Timeline</label>
                        <input
                          type="date"
                          value={risk.resolutionTimeline}
                          onChange={(e) => handleUpdateRisk(index, 'resolutionTimeline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={risk.status}
                          onChange={(e) => handleUpdateRisk(index, 'status', e.target.value)}
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

                {risks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                    <p>No risks added yet. Click "Add Risk" to get started.</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {selectedProject.risks.length > 0 ? (
                  <div className="space-y-4">
                    {selectedProject.risks.map((risk) => (
                      <div key={risk.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{risk.description}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Owner: <span className="font-medium">{risk.owner}</span></span>
                              <span>•</span>
                              <span>Impact: <span className={`font-medium ${
                                risk.impact === 'High' ? 'text-red-600' :
                                risk.impact === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                              }`}>{risk.impact}</span></span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {risk.status === 'Resolved' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : risk.status === 'In Progress' ? (
                              <Clock className="w-5 h-5 text-yellow-500" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="text-sm font-medium text-gray-700">{risk.status}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Resolution Timeline: {formatDate(risk.resolutionTimeline)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p>No active risks identified</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showEditForm && (
        <ProjectForm
          project={selectedProject}
          onClose={() => setShowEditForm(false)}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};