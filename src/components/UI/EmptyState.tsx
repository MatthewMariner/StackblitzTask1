import React from 'react';
import { CheckCircle2, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  type: 'active' | 'completed';
  onCreateTask?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onCreateTask }) => {
  if (type === 'completed') {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="mx-auto w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No completed tasks yet</h3>
        <p className="text-gray-600">
          Complete some tasks to see them here and track your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <PlusCircle className="mx-auto w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No active tasks</h3>
      <p className="text-gray-600 mb-6">
        Get started by creating your first task for the Bolt onboarding journey.
      </p>
      {onCreateTask && (
        <button
          onClick={onCreateTask}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Create Your First Task
        </button>
      )}
    </div>
  );
};