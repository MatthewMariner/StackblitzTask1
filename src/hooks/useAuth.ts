import { useState, useEffect } from 'react';
import { User } from '../types';
import { getStoredData, updateUser } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<User>({ username: '', isAuthenticated: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getStoredData();
    setUser(data.user);
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple validation - in production, this would be handled by a backend
    if (username.trim() && password.trim()) {
      const newUser: User = {
        username: username.trim(),
        isAuthenticated: true,
      };
      
      const success = updateUser(newUser);
      if (success) {
        setUser(newUser);
        return true;
      }
    }
    return false;
  };

  const logout = (): boolean => {
    const newUser: User = {
      username: '',
      isAuthenticated: false,
    };
    
    const success = updateUser(newUser);
    if (success) {
      setUser(newUser);
      return true;
    }
    return false;
  };

  return { user, isLoading, login, logout };
};