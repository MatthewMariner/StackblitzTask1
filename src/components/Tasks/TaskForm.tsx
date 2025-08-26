import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { TaskFormData } from '../../types';

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => boolean;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
  mode?: 'create' | 'edit';
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Task title must be less than 100 characters';
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    const success = onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
    });

    setIsSubmitting(false);

    if (success) {
      if (mode === 'create') {
        // Reset form for create mode
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
        });
        setErrors({});
      }
      onCancel(); // Close the form
    } else {
      setErrors({ submit: 'Failed to save task. Please try again.' });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {mode === 'create' ? 'Create New Task' : 'Edit Task'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter a clear, concise task title"
            maxLength={100}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Provide additional details about this task (optional)"
            maxLength={500}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          <p className="mt-1 text-xs text-gray-500">{formData.description.length}/500 characters</p>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="low">Low - Can be done later</option>
            <option value="medium">Medium - Should be done soon</option>
            <option value="high">High - Needs immediate attention</option>
          </select>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {mode === 'create' ? 'Create Task' : 'Update Task'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};