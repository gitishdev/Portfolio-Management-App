import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const BudgetOverview: React.FC = () => {
  const { budgetData } = useAppContext();

  const formatToMillions = (amount: number) => {
    if (amount === 0) return '$0.00M';
    const millions = amount / 1000000;
    if (millions >= 1000) {
      return `$${(millions / 1000).toFixed(2)}B`;
    }
    return `$${millions.toFixed(2)}M`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const utilizationPercentage = budgetData.totalBudget > 0 
    ? Math.round((budgetData.actualSpend / budgetData.totalBudget) * 100) 
    : 0;
  
  const capexPercentage = budgetData.totalBudget > 0 
    ? Math.round((budgetData.capex / budgetData.totalBudget) * 100) 
    : 70;
  
  const opexPercentage = budgetData.totalBudget > 0 
    ? Math.round((budgetData.opex / budgetData.totalBudget) * 100) 
    : 30;

  const capexSpendPercentage = budgetData.capex > 0 
    ? Math.round((budgetData.capexSpent / budgetData.capex) * 100) 
    : 0;
  
  const opexSpendPercentage = budgetData.opex > 0 
    ? Math.round((budgetData.opexSpent / budgetData.opex) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <PieChart className="w-4 h-4" />
          <span>FY 2024</span>
        </div>
      </div>

      {/* Main Budget Cards - Two Groups Side by Side */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Group 1: Total Budget Allocated with CAPEX/OPEX Allocation */}
        <div className="flex space-x-4">
          {/* Total Budget Allocated */}
          <div className="bg-blue-50 rounded-lg p-6 flex-1">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-2">Total Budget Allocated</p>
              <p className="text-4xl font-bold text-blue-900">{formatToMillions(budgetData.totalBudget)}</p>
            </div>
          </div>

          {/* CAPEX and OPEX Allocation - Stacked Vertically */}
          <div className="flex flex-col space-y-3 flex-shrink-0">
            {/* CAPEX Allocation */}
            <div className="bg-purple-50 rounded-lg p-4 w-40">
              <div className="text-center">
                <p className="text-purple-600 text-sm font-medium mb-1">Capex Allocated</p>
                <p className="text-xl font-bold text-purple-900">{formatToMillions(budgetData.capex)}</p>
                <p className="text-purple-600 text-xs">{capexPercentage}% of total</p>
              </div>
            </div>

            {/* OPEX Allocation */}
            <div className="bg-orange-50 rounded-lg p-4 w-40">
              <div className="text-center">
                <p className="text-orange-600 text-sm font-medium mb-1">Opex Allocated</p>
                <p className="text-xl font-bold text-orange-900">{formatToMillions(budgetData.opex)}</p>
                <p className="text-orange-600 text-xs">{opexPercentage}% of total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Group 2: Actual Spend with CAPEX/OPEX Spend */}
        <div className="flex space-x-4">
          {/* Actual Spend */}
          <div className="bg-green-50 rounded-lg p-6 flex-1">
            <div>
              <p className="text-green-600 text-sm font-medium mb-2">Actual Spend</p>
              <p className="text-4xl font-bold text-green-900">{formatToMillions(budgetData.actualSpend)}</p>
              <p className="text-green-600 text-sm">{utilizationPercentage}% utilized</p>
            </div>
          </div>

          {/* CAPEX and OPEX Spend - Stacked Vertically with Matching Colors */}
          <div className="flex flex-col space-y-3 flex-shrink-0">
            {/* CAPEX Spend - Purple Theme */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 w-40">
              <div className="text-center">
                <p className="text-purple-600 text-xs font-medium mb-1">CAPEX SPEND</p>
                <p className="text-lg font-bold text-purple-900">{formatToMillions(budgetData.capexSpent)}</p>
                <p className="text-purple-600 text-xs">{capexSpendPercentage}% of CAPEX</p>
              </div>
            </div>

            {/* OPEX Spend - Orange Theme */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 w-40">
              <div className="text-center">
                <p className="text-orange-600 text-xs font-medium mb-1">OPEX SPEND</p>
                <p className="text-lg font-bold text-orange-900">{formatToMillions(budgetData.opexSpent)}</p>
                <p className="text-orange-600 text-xs">{opexSpendPercentage}% of OPEX</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAPEX/OPEX Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">CAPEX Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-purple-700">Allocated:</span>
              <span className="font-bold text-purple-900">{formatToMillions(budgetData.capex)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700">Spent:</span>
              <span className="font-bold text-purple-900">{formatToMillions(budgetData.capexSpent)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700">Remaining:</span>
              <span className={`font-bold ${budgetData.capex - budgetData.capexSpent < 0 ? 'text-red-600' : 'text-purple-900'}`}>
                {formatToMillions(budgetData.capex - budgetData.capexSpent)}
              </span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (budgetData.capexSpent / budgetData.capex) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-900 mb-3">OPEX Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-orange-700">Allocated:</span>
              <span className="font-bold text-orange-900">{formatToMillions(budgetData.opex)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-orange-700">Spent:</span>
              <span className="font-bold text-orange-900">{formatToMillions(budgetData.opexSpent)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-orange-700">Remaining:</span>
              <span className={`font-bold ${budgetData.opex - budgetData.opexSpent < 0 ? 'text-red-600' : 'text-orange-900'}`}>
                {formatToMillions(budgetData.opex - budgetData.opexSpent)}
              </span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2 mt-3">
              <div
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (budgetData.opexSpent / budgetData.opex) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Department Breakdown</h3>
        <div className="space-y-4">
          {budgetData.departmentBreakdown.map((dept) => (
            <div key={dept.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{dept.department}</span>
                  <span className="text-sm text-gray-500">{dept.projects} projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dept.allocated > 0 ? (dept.spent / dept.allocated) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Spent: {formatToMillions(dept.spent)}</span>
                  <span>Allocated: {formatToMillions(dept.allocated)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};