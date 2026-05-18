import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { TOAST_DURATIONS, TOAST_POSITIONS } from '@/config/toastConfig';
import { Notification } from '@/components/ui/toast';

const ToastContext = createContext(null);

export function ToastProvider({ children, defaultPosition = 'topRight' }) {
  const [notifications, setNotifications] = useState([]);
  const [position, setPosition] = useState(defaultPosition);
  const nextIdRef = useRef(1);

  useEffect(() => {
    // Inject custom animation keyframe styles once
    const styleId = 'toast-shrink-keyframes-provider';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes shrinkWidth {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const showToast = (options) => {
    // If simple string is passed instead of options object, handle it
    const opts = typeof options === 'string' ? { message: options } : options;
    const { type = 'info', title, message, duration, id } = opts;
    const finalId = id || nextIdRef.current++;
    const defaultDuration = TOAST_DURATIONS[type] !== undefined ? TOAST_DURATIONS[type] : 4000;
    const finalDuration = duration !== undefined ? duration : defaultDuration;

    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === finalId);
      if (exists) {
        return prev.map((n) =>
          n.id === finalId
            ? { ...n, type, title: title || type.charAt(0).toUpperCase() + type.slice(1), message, duration: finalDuration, exiting: false }
            : n
        );
      } else {
        return [...prev, { id: finalId, type, title: title || type.charAt(0).toUpperCase() + type.slice(1), message, duration: finalDuration }];
      }
    });

    return finalId;
  };

  const dismissToast = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, exiting: true } : n))
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 250);
  };

  const getPositionClass = () => {
    return TOAST_POSITIONS[position] || TOAST_POSITIONS.topRight;
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, setPosition }}>
      {children}
      
      {/* Toast Render Layer */}
      <div className={`fixed p-4 space-y-2 w-full max-w-sm z-[9999] pointer-events-none flex flex-col ${
        position.startsWith('bottom') ? 'flex-col-reverse justify-end' : 'flex-col'
      } ${
        position.includes('left') || position.includes('Left')
          ? 'items-start'
          : position.includes('center') || position.includes('Center')
          ? 'items-center'
          : 'items-end'
      } ${getPositionClass()}`}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            duration={notification.duration}
            exiting={notification.exiting}
            onClose={() => dismissToast(notification.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToastContext = () => {
  const context = useContext(ToastContext);
  return context;
};
