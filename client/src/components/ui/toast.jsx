'use client';

import React from 'react';

// SVG Icons
const InfoIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SuccessIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ErrorIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LoadingSpinner = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const notificationConfig = {
  info: {
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800/50',
    iconColor: 'text-blue-500 dark:text-blue-400',
    icon: <InfoIcon className="h-6 w-6" />,
    gradient: 'from-blue-100/60 to-transparent dark:from-blue-900/20 dark:to-transparent',
  },
  success: {
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800/50',
    iconColor: 'text-green-500 dark:text-green-400',
    icon: <SuccessIcon className="h-6 w-6" />,
    gradient: 'from-green-100/60 to-transparent dark:from-green-900/20 dark:to-transparent',
  },
  warning: {
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800/50',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    icon: <WarningIcon className="h-6 w-6" />,
    gradient: 'from-yellow-100/60 to-transparent dark:from-yellow-900/20 dark:to-transparent',
  },
  error: {
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800/50',
    iconColor: 'text-red-500 dark:text-red-400',
    icon: <ErrorIcon className="h-6 w-6" />,
    gradient: 'from-red-100/60 to-transparent dark:from-red-900/20 dark:to-transparent',
  },
  loading: {
    bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    borderColor: 'border-gray-200 dark:border-gray-800/50',
    iconColor: 'text-gray-500 dark:text-gray-400',
    icon: <LoadingSpinner className="h-6 w-6" />,
    gradient: 'from-gray-100/60 to-transparent dark:from-gray-900/20 dark:to-transparent',
  },
};

export const Notification = ({ type, title, message, showIcon = true, duration, exiting, onClose }) => {
  const config = notificationConfig[type];

  // Auto-close handler using basic setTimeout
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`relative w-[340px] rounded-xl p-4 bg-white/80 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl text-left pointer-events-auto transition-all duration-300 ease-in-out transform ${
        exiting 
          ? 'opacity-0 translate-x-12 scale-95' 
          : 'opacity-100 translate-x-0 scale-100 animate-in fade-in slide-in-from-bottom-2'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-40 pointer-events-none`}></div>
      <div className="relative z-10 flex items-start space-x-3">
        {showIcon && (
          <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
            {config.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug tracking-tight">{title}</p>
          {message && (
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 font-medium leading-relaxed">{message}</p>
          )}
        </div>
        <button onClick={onClose} className="flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      {duration && (
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-black/5 dark:bg-white/5 rounded-b-xl overflow-hidden">
          <div
            style={{ animation: `shrinkWidth ${duration}ms linear forwards`, transformOrigin: 'left' }}
            className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-sky-400 dark:from-green-500 dark:via-blue-500 dark:to-sky-500 origin-left"
          />
        </div>
      )}
    </div>
  );
};

export default Notification;
