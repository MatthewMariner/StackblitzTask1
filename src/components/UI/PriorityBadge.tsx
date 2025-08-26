import React from 'react';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
  className?: string;
}

const priorityConfig = {
  low: {
    label: 'Low',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  medium: {
    label: 'Medium', 
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  high: {
    label: 'High',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const config = priorityConfig[priority];
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
};