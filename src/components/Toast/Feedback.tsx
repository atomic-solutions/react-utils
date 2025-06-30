import { toast, createToast, ToastConfig, ToastOptions } from './Toast';

// Message configuration interface
export interface MessageConfig {
  labelText: string;
  type: FeedbackType;
  duration?: number;
}

// Base feedback messages (can be extended per project)
export const baseFeedbackMessages = {
  // Generic messages
  success: {
    labelText: 'Operation completed successfully!',
    type: 'success',
  } as MessageConfig,
  error: {
    labelText: 'Error! Please try again.',
    type: 'error',
  } as MessageConfig,
  info: { labelText: 'Information', type: 'info' } as MessageConfig,
  warning: { labelText: 'Warning!', type: 'warning' } as MessageConfig,
} as const;

export type BaseFeedbackMessageKey = keyof typeof baseFeedbackMessages;
export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

// Feedback configuration
export interface FeedbackConfig<
  TMessages extends Record<string, MessageConfig> = Record<
    string,
    MessageConfig
  >,
> {
  messages?: TMessages;
  toastConfig?: ToastConfig;
  defaultType?: FeedbackType;
}

export interface ShowFeedbackOptions {
  type?: FeedbackType;
  duration?: number;
  toastOptions?: ToastOptions;
}

// Create feedback system with custom messages and configuration
export function createFeedback<
  TMessages extends Record<string, MessageConfig> = typeof baseFeedbackMessages,
>(config: FeedbackConfig<TMessages> = {}) {
  const messages = {
    ...baseFeedbackMessages,
    ...config.messages,
  } as TMessages & typeof baseFeedbackMessages;
  const toastInstance = config.toastConfig
    ? createToast(config.toastConfig)
    : toast;

  type MessageKey = keyof typeof messages;

  /**
   * Show user feedback using predefined message keys or custom messages
   * @param keyOrMessage - Either a predefined message key or a custom message string
   * @param options - Optional configuration for feedback type and duration (overrides static config)
   */
  return function showFeedback(
    keyOrMessage: MessageKey | string,
    options: ShowFeedbackOptions = {}
  ): void {
    // Check if it's a predefined key
    const isPredefinedKey = keyOrMessage in messages;

    if (isPredefinedKey) {
      // Use static configuration from message config
      const messageConfig = messages[keyOrMessage as MessageKey];
      const message = messageConfig.labelText;
      const type = options.type || messageConfig.type; // Dynamic overrides static
      const duration = options.duration || messageConfig.duration; // Dynamic overrides static

      const finalToastOptions = {
        ...(duration ? { autoClose: duration } : {}),
        ...options.toastOptions,
      };

      toastInstance[type](message, finalToastOptions);
    } else {
      // Custom message - use provided options or defaults
      const message = keyOrMessage as string;
      const type = options.type || config.defaultType || 'info';
      const duration = options.duration;

      const finalToastOptions = {
        ...(duration ? { autoClose: duration } : {}),
        ...options.toastOptions,
      };

      toastInstance[type](message, finalToastOptions);
    }
  };
}

// Default feedback instance
export const showFeedback = createFeedback();

// Convenience methods using default instance
export const showSuccess = (
  keyOrMessage: string,
  options?: Omit<ShowFeedbackOptions, 'type'>
) => showFeedback(keyOrMessage, { ...options, type: 'success' });

export const showError = (
  keyOrMessage: string,
  options?: Omit<ShowFeedbackOptions, 'type'>
) => showFeedback(keyOrMessage, { ...options, type: 'error' });

export const showInfo = (
  keyOrMessage: string,
  options?: Omit<ShowFeedbackOptions, 'type'>
) => showFeedback(keyOrMessage, { ...options, type: 'info' });

export const showWarning = (
  keyOrMessage: string,
  options?: Omit<ShowFeedbackOptions, 'type'>
) => showFeedback(keyOrMessage, { ...options, type: 'warning' });

// Create a feedback object for backward compatibility
export const feedback = {
  showFeedback,
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
};
