import React, { useState } from 'react';
import { Edit2, Trash2, Clock, Calendar } from 'lucide-react';
import { Task } from '../../types';
import { PriorityBadge } from '../UI/PriorityBadge';
import { TaskForm } from './TaskForm';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => boolean;
  onUpdate: (id: string, updates: Partial<Task>) => boolean;
  onDelete: (id: string) => boolean;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onUpdate,
  onDelete,
  onShowNotification,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleToggleComplete = () => {
    const success = onToggleComplete(task.id);
    if (success) {
      onShowNotification(
        task.isCompleted ? 'Task marked as active' : 'Task completed! Great job!',
        'success'
      );
    } else {
      onShowNotification('Failed to update task', 'error');
    }
  };

  const handleUpdate = (updates: Partial<Task>) => {
    const success = onUpdate(task.id, updates);
    if (success) {
      setIsEditing(false);
      onShowNotification('Task updated successfully', 'success');
      return true;
    } else {
      onShowNotification('Failed to update task', 'error');
      return false;
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const success = onDelete(task.id);
    
    if (success) {
      onShowNotification('Task deleted successfully', 'success');
    } else {
      onShowNotification('Failed to delete task', 'error');
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <TaskForm
          onSubmit={(formData) => handleUpdate(formData)}
          onCancel={() => setIsEditing(false)}
          initialData={task}
          mode="edit"
        />
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
      task.isCompleted ? 'opacity-75' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={handleToggleComplete}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                aria-label={`Mark task "${task.title}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
              />
              <h3 className={`text-lg font-semibold text-gray-900 ${
                task.isCompleted ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              <PriorityBadge priority={task.priority} />
            </div>
            
            {task.description && (
              <p className={`text-gray-700 mb-4 leading-relaxed ${
                task.isCompleted ? 'line-through text-gray-500' : ''
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(task.createdAt)}</span>
              </div>
              {task.updatedAt !== task.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDate(task.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit task"
              aria-label={`Edit task "${task.title}"`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete task"
              aria-label={`Delete task "${task.title}"`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};