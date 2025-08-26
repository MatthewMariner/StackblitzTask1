import React from 'react';
import { LogOut, CheckSquare } from 'lucide-react';

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Bolt Onboarding</h1>
              <p className="text-xs text-gray-600">Task Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Welcome back!</p>
              <p className="text-xs text-gray-600">{username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};