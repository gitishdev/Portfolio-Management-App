import React from 'react';
import { Users, UserPlus, UserMinus, TrendingUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Workforce: React.FC = () => {
  const { workforceData } = useAppContext();

  const totalWorkforce = workforceData.employees + workforceData.contractors;
  const contractorPercentage = Math.round((workforceData.contractors / totalWorkforce) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Workforce Management</h1>
        <p className="text-gray-600">
          Monitor and manage workforce allocation across departments and projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Workforce</p>
              <p className="text-3xl font-bold">{totalWorkforce}</p>
              <p className="text-blue-100 text-sm">Active members</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Employees</p>
              <p className="text-3xl font-bold">{workforceData.employees}</p>
              <p className="text-green-100 text-sm">Full-time staff</p>
            </div>
            <UserPlus className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Contractors</p>
              <p className="text-3xl font-bold">{workforceData.contractors}</p>
              <p className="text-purple-100 text-sm">{contractorPercentage}% of total</p>
            </div>
            <UserMinus className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Utilization</p>
              <p className="text-3xl font-bold">84%</p>
              <p className="text-orange-100 text-sm">Average across teams</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Department Breakdown</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workforceData.departmentBreakdown.map((dept) => (
            <div key={dept.department} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{dept.department}</h3>
                <div className="text-sm text-gray-500">
                  {dept.employees + dept.contractors} total
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Employees</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ 
                          width: `${(dept.employees / (dept.employees + dept.contractors)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{dept.employees}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Contractors</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ 
                          width: `${(dept.contractors / (dept.employees + dept.contractors)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{dept.contractors}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <span className="font-medium text-green-900">New Hires (Q1)</span>
                <p className="text-sm text-green-700">Engineering & Product teams</p>
              </div>
              <div className="text-green-700 font-bold">+12</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <span className="font-medium text-blue-900">Planned Hires (Q2)</span>
                <p className="text-sm text-blue-700">Data Science expansion</p>
              </div>
              <div className="text-blue-700 font-bold">+8</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <span className="font-medium text-purple-900">Contract Extensions</span>
                <p className="text-sm text-purple-700">Infrastructure projects</p>
              </div>
              <div className="text-purple-700 font-bold">+5</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Distribution</h3>
          <div className="space-y-4">
            {[
              { skill: 'Software Development', count: 45 },
              { skill: 'Data Analysis', count: 28 },
              { skill: 'Product Management', count: 22 },
              { skill: 'DevOps/Infrastructure', count: 18 },
              { skill: 'Security', count: 12 },
            ].map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{skill.skill}</span>
                  <span className="text-gray-600">{skill.count} people</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(skill.count / 45) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};