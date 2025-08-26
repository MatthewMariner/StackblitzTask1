import React, { useState } from 'react';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { Task, TaskFormData } from '../../types';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { EmptyState } from '../UI/EmptyState';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  type: 'active' | 'completed';
  onAddTask: (task: TaskFormData) => boolean;
  onUpdateTask: (id: string, updates: Partial<Task>) => boolean;
  onDeleteTask: (id: string) => boolean;
  onToggleComplete: (id: string) => boolean;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

type SortOption = 'created' | 'priority' | 'updated';
type FilterOption = 'all' | 'high' | 'medium' | 'low';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  type,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onShowNotification,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const priorityOrder = { high: 3, medium: 2, low: 1 };

  const sortedAndFilteredTasks = React.useMemo(() => {
    let filtered = tasks;

    // Apply filter
    if (filterBy !== 'all') {
      filtered = tasks.filter(task => task.priority === filterBy);
    }

    // Apply sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [tasks, sortBy, filterBy]);

  const handleAddTask = (task: TaskFormData) => {
    const success = onAddTask(task);
    if (success) {
      setShowForm(false);
      onShowNotification('Task created successfully!', 'success');
      return true;
    } else {
      onShowNotification('Failed to create task', 'error');
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {type === 'active' ? 'Active Tasks' : 'Completed Tasks'}
          </h2>
          <p className="text-gray-600">
            {type === 'active'
              ? 'Focus on completing these tasks to progress through your onboarding'
              : 'Great work! Here are the tasks you\'ve completed'
            }
          </p>
        </div>

        {type === 'active' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>

      {/* Filters and Sorting */}
      {tasks.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created">Sort by Created Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="updated">Sort by Last Updated</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {sortedAndFilteredTasks.length} of {tasks.length} tasks
          </div>
        </div>
      )}

      {/* Task Form */}
      {showForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowForm(false)}
          mode="create"
        />
      )}

      {/* Task List */}
      {sortedAndFilteredTasks.length === 0 ? (
        <EmptyState 
          type={type} 
          onCreateTask={type === 'active' ? () => setShowForm(true) : undefined}
        />
      ) : (
        <div className="space-y-4">
          {sortedAndFilteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onShowNotification={onShowNotification}
            />
          ))}
        </div>
      )}

      {/* Summary for active tasks */}
      {type === 'active' && tasks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">
            <span className="font-semibold">{tasks.length}</span> active task{tasks.length === 1 ? '' : 's'} in your onboarding journey
          </p>
        </div>
      )}
    </div>
  );
};