import React from 'react';

interface StatusBadgeProps {
  status: 'Green' | 'Amber' | 'Red';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const baseClasses = `inline-flex items-center font-medium rounded-full ${
    size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'
  }`;

  const statusClasses = {
    Green: `${baseClasses} bg-green-100 text-green-800`,
    Amber: `${baseClasses} bg-yellow-100 text-yellow-800`,
    Red: `${baseClasses} bg-red-100 text-red-800`,
  };

  return (
    <span className={statusClasses[status]}>
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          status === 'Green' ? 'bg-green-500' : status === 'Amber' ? 'bg-yellow-500' : 'bg-red-500'
        }`}
      />
      {status}
    </span>
  );
};