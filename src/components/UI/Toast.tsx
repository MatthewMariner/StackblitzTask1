import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { NotificationType } from '../../types';

interface ToastProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 border-green-200 text-green-800',
    iconColor: 'text-green-500',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 border-red-200 text-red-800',
    iconColor: 'text-red-500',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
    iconColor: 'text-blue-500',
  },
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${config.className}`}>
      <Icon className={`w-5 h-5 ${config.iconColor}`} />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};