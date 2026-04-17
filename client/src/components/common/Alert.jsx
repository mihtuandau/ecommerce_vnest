import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const types = {
    success: {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-900',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-gray-900',
      border: 'border-gray-900',
      text: 'text-white',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-gray-200',
      border: 'border-gray-400',
      text: 'text-gray-900',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-900',
      icon: Info,
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`p-4 border rounded-lg ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.text} flex-shrink-0`} />
        <p className={`text-sm flex-1 ${config.text}`}>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className={`${config.text} hover:opacity-70 transition-opacity`}
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;





