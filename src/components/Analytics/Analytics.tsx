import React from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">
          Advanced analytics and performance insights for your portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Portfolio ROI</p>
              <p className="text-3xl font-bold">24.5%</p>
              <p className="text-blue-100 text-sm">YTD Performance</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Success Rate</p>
              <p className="text-3xl font-bold">87%</p>
              <p className="text-green-100 text-sm">On-time delivery</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Cost Efficiency</p>
              <p className="text-3xl font-bold">92%</p>
              <p className="text-purple-100 text-sm">Budget utilization</p>
            </div>
            <PieChart className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Risk Score</p>
              <p className="text-3xl font-bold">Low</p>
              <p className="text-orange-100 text-sm">Portfolio risk</p>
            </div>
            <Activity className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Trends</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Advanced analytics charts will be displayed here</p>
            <p className="text-sm">Integration with charting library required</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Projects</h3>
          <div className="space-y-3">
            {[
              { name: 'Next-Gen Mobile Platform', score: 95 },
              { name: 'Customer Portal Redesign', score: 92 },
              { name: 'Security Compliance Upgrade', score: 88 },
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{project.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${project.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{project.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization</h3>
          <div className="space-y-4">
            {[
              { department: 'Engineering', utilization: 85 },
              { department: 'Product', utilization: 78 },
              { department: 'Data Science', utilization: 92 },
              { department: 'Infrastructure', utilization: 73 },
            ].map((dept, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{dept.department}</span>
                  <span className="text-gray-600">{dept.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept.utilization}%` }}
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