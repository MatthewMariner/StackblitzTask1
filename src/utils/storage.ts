import { AppData, Task, User } from '../types';

const STORAGE_KEY = 'bolt_onboarding_app';

const defaultData: AppData = {
  tasks: [
    {
      id: 'sample-1',
      title: 'Complete Bolt tutorial',
      description: 'Go through the getting started guide and familiarize yourself with the platform',
      priority: 'high',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sample-2',
      title: 'Set up development environment',
      description: 'Install necessary tools and configure your workspace for optimal productivity',
      priority: 'medium',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sample-3',
      title: 'Review documentation',
      description: 'Read through the comprehensive documentation to understand best practices',
      priority: 'low',
      isCompleted: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date().toISOString(),
    },
  ],
  user: {
    username: '',
    isAuthenticated: false,
  },
};

export const getStoredData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setStoredData(defaultData);
      return defaultData;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultData;
  }
};

export const setStoredData = (data: AppData): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

export const updateTasks = (tasks: Task[]): boolean => {
  try {
    const data = getStoredData();
    data.tasks = tasks;
    return setStoredData(data);
  } catch (error) {
    console.error('Error updating tasks:', error);
    return false;
  }
};

export const updateUser = (user: User): boolean => {
  try {
    const data = getStoredData();
    data.user = user;
    return setStoredData(data);
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};