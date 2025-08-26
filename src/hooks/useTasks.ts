import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData } from '../types';
import { getStoredData, updateTasks, generateId } from '../utils/storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getStoredData();
    setTasks(data.tasks);
    setIsLoading(false);
  }, []);

  const syncTasks = useCallback((newTasks: Task[]) => {
    const success = updateTasks(newTasks);
    if (success) {
      setTasks(newTasks);
      return true;
    }
    return false;
  }, []);

  const addTask = useCallback((taskData: TaskFormData): boolean => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    return syncTasks(updatedTasks);
  }, [tasks, syncTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>): boolean => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    return syncTasks(updatedTasks);
  }, [tasks, syncTasks]);

  const deleteTask = useCallback((id: string): boolean => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    return syncTasks(updatedTasks);
  }, [tasks, syncTasks]);

  const toggleTaskCompletion = useCallback((id: string): boolean => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;
    
    return updateTask(id, { isCompleted: !task.isCompleted });
  }, [tasks, updateTask]);

  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  return {
    tasks,
    activeTasks,
    completedTasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};