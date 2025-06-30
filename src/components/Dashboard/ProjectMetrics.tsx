import React from 'react';
import { Activity, Users, Target, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const ProjectMetrics: React.FC = () => {
  const { projects, workforceData, adminConfig } = useAppContext();

  const activeProjects = projects.length;
  const projectsByStatus = {
    Green: projects.filter(p => p.status === 'Green').length,
    Amber: projects.filter(p => p.status === 'Amber').length,
    Red: projects.filter(p => p.status === 'Red').length,
  };

  const currentQuarterProjects = projects.filter(p => 
    p.targetLaunchQuarter === `Q${adminConfig.fiscalConfig.currentQuarter} ${adminConfig.fiscalConfig.fiscalYear}`
  ).length;

  const totalWorkforce = workforceData.employees + workforceData.contractors;
  const contractorPercentage = Math.round((workforceData.contractors / totalWorkforce) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Project Metrics</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Real-time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Active Projects</p>
              <p className="text-3xl font-bold">{activeProjects}</p>
              <p className="text-blue-100 text-sm">Company-wide</p>
            </div>
            <Target className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Current Quarter</p>
              <p className="text-3xl font-bold">{currentQuarterProjects}</p>
              <p className="text-green-100 text-sm">Q{adminConfig.fiscalConfig.currentQuarter} launches</p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Workforce</p>
              <p className="text-3xl font-bold">{totalWorkforce}</p>
              <p className="text-purple-100 text-sm">{contractorPercentage}% contractors</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Budget Utilization</p>
              <p className="text-3xl font-bold">45%</p>
              <p className="text-orange-100 text-sm">YTD average</p>
            </div>
            <Activity className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-900">On Track</span>
              </div>
              <div className="text-green-700 font-bold">{projectsByStatus.Green}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-yellow-900">At Risk</span>
              </div>
              <div className="text-yellow-700 font-bold">{projectsByStatus.Amber}</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-900">Critical</span>
              </div>
              <div className="text-red-700 font-bold">{projectsByStatus.Red}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Workforce Distribution</h3>
          <div className="space-y-3">
            {workforceData.departmentBreakdown.map((dept) => (
              <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{dept.department}</span>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {dept.employees + dept.contractors}
                  </div>
                  <div className="text-xs text-gray-500">
                    {dept.employees}E + {dept.contractors}C
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};