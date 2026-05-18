import { useToastContext } from '@/components/ToastProvider';

// For imperative usage outside React components
let imperativeShowToast = null;

export const toast = {
  success: (title, message) => {
    if (imperativeShowToast) {
      return imperativeShowToast({ type: 'success', title, message });
    }
    console.warn('toast.success was called before ToastProvider initialized');
    return null;
  },
  error: (title, message) => {
    if (imperativeShowToast) {
      return imperativeShowToast({ type: 'error', title, message });
    }
    console.warn('toast.error was called before ToastProvider initialized');
    return null;
  },
  info: (title, message) => {
    if (imperativeShowToast) {
      return imperativeShowToast({ type: 'info', title, message });
    }
    console.warn('toast.info was called before ToastProvider initialized');
    return null;
  },
  warning: (title, message) => {
    if (imperativeShowToast) {
      return imperativeShowToast({ type: 'warning', title, message });
    }
    console.warn('toast.warning was called before ToastProvider initialized');
    return null;
  },
  loading: (title, message) => {
    if (imperativeShowToast) {
      return imperativeShowToast({ type: 'loading', title, message });
    }
    console.warn('toast.loading was called before ToastProvider initialized');
    return null;
  }
};

export function useToast() {
  const context = useToastContext();
  
  if (!context) {
    // Graceful fallback outside provider
    const fallback = (options) => {
      console.warn('showToast was called outside ToastProvider context:', options);
      return null;
    };
    fallback.success = (title, message) => fallback({ type: 'success', title, message });
    fallback.error = (title, message) => fallback({ type: 'error', title, message });
    fallback.info = (title, message) => fallback({ type: 'info', title, message });
    fallback.warning = (title, message) => fallback({ type: 'warning', title, message });
    fallback.loading = (title, message) => fallback({ type: 'loading', title, message });
    return fallback;
  }

  const show = context.showToast;
  
  // Attach shorthand methods
  show.success = (title, message) => show({ type: 'success', title, message });
  show.error = (title, message) => show({ type: 'error', title, message });
  show.info = (title, message) => show({ type: 'info', title, message });
  show.warning = (title, message) => show({ type: 'warning', title, message });
  show.loading = (title, message) => show({ type: 'loading', title, message });

  // Store imperative reference
  if (!imperativeShowToast) {
    imperativeShowToast = show;
  }

  return show;
}
