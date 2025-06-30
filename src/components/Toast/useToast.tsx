import { useCallback } from 'react';
import { toast, createToast, ToastConfig } from './Toast';
import {
  showFeedback,
  createFeedback,
  FeedbackConfig,
  ShowFeedbackOptions,
} from './Feedback';

export interface UseToastOptions {
  toastConfig?: ToastConfig;
  feedbackConfig?: FeedbackConfig;
}

/**
 * Hook for using toast notifications with optional custom configuration
 */
export function useToast(options: UseToastOptions = {}) {
  const toastInstance = options.toastConfig
    ? createToast(options.toastConfig)
    : toast;
  const feedbackInstance = options.feedbackConfig
    ? createFeedback(options.feedbackConfig)
    : undefined;

  const show = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'info' | 'warning' = 'info'
    ) => {
      return toastInstance[type](message);
    },
    [toastInstance]
  );

  const success = useCallback(
    (message: string) => toastInstance.success(message),
    [toastInstance]
  );
  const error = useCallback(
    (message: string) => toastInstance.error(message),
    [toastInstance]
  );
  const info = useCallback(
    (message: string) => toastInstance.info(message),
    [toastInstance]
  );
  const warning = useCallback(
    (message: string) => toastInstance.warning(message),
    [toastInstance]
  );

  const feedback = useCallback(
    (keyOrMessage: string, options?: ShowFeedbackOptions) => {
      if (feedbackInstance) {
        return feedbackInstance(keyOrMessage, options);
      }
      return showFeedback(keyOrMessage, options);
    },
    [feedbackInstance]
  );

  return {
    // Basic toast methods
    show,
    success,
    error,
    info,
    warning,

    // Feedback system
    feedback,

    // Direct access to toast instance
    toast: toastInstance,

    // Convenience methods for feedback
    showSuccess: useCallback(
      (keyOrMessage: string, options?: Omit<ShowFeedbackOptions, 'type'>) =>
        feedback(keyOrMessage, { ...options, type: 'success' }),
      [feedback]
    ),
    showError: useCallback(
      (keyOrMessage: string, options?: Omit<ShowFeedbackOptions, 'type'>) =>
        feedback(keyOrMessage, { ...options, type: 'error' }),
      [feedback]
    ),
    showInfo: useCallback(
      (keyOrMessage: string, options?: Omit<ShowFeedbackOptions, 'type'>) =>
        feedback(keyOrMessage, { ...options, type: 'info' }),
      [feedback]
    ),
    showWarning: useCallback(
      (keyOrMessage: string, options?: Omit<ShowFeedbackOptions, 'type'>) =>
        feedback(keyOrMessage, { ...options, type: 'warning' }),
      [feedback]
    ),
  };
}

export default useToast;
