import React, { useState, useEffect } from 'react';
import { Login } from './components/Auth/Login';
import { Header } from './components/Layout/Header';
import { TaskList } from './components/Tasks/TaskList';
import { Toast } from './components/UI/Toast';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { NotificationType } from './types';

type ViewType = 'active' | 'completed';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

function App() {
  const { user, isLoading: authLoading, login, logout } = useAuth();
  const {
    activeTasks,
    completedTasks,
    isLoading: tasksLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTasks();

  const [currentView, setCurrentView] = useState<ViewType>('active');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleLogout = () => {
    const success = logout();
    if (success) {
      showNotification('Logged out successfully', 'info');
    } else {
      showNotification('Failed to log out', 'error');
    }
  };

  // Show welcome message for new users
  useEffect(() => {
    if (user.isAuthenticated && activeTasks.length === 3 && completedTasks.length === 1) {
      // Check if this looks like the default sample data (indicating a new user)
      setTimeout(() => {
        showNotification(
          `Welcome to Bolt, ${user.username}! We've prepared some sample tasks to get you started.`,
          'info'
        );
      }, 500);
    }
  }, [user.isAuthenticated, user.username, activeTasks.length, completedTasks.length]);

  // Show loading screen while initializing
  if (authLoading || (user.isAuthenticated && tasksLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user.isAuthenticated) {
    return <Login onLogin={login} />;
  }

  const currentTasks = currentView === 'active' ? activeTasks : completedTasks;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header username={user.username} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <nav className="flex space-x-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => setCurrentView('active')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Tasks
            {activeTasks.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                {activeTasks.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentView('completed')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              currentView === 'completed'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed
            {completedTasks.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-600 rounded-full">
                {completedTasks.length}
              </span>
            )}
          </button>
        </nav>

        {/* Task List */}
        <TaskList
          tasks={currentTasks}
          isLoading={tasksLoading}
          type={currentView}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onToggleComplete={toggleTaskCompletion}
          onShowNotification={showNotification}
        />
      </main>

      {/* Toast Notifications */}
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

export default App;