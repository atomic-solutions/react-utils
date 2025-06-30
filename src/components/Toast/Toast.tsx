'use client';

import React from 'react';
import {
  toast as toastify,
  ToastContainer as ToastifyContainer,
  ToastOptions as ToastifyOptions,
  ToastContainerProps as ToastifyContainerProps,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Re-export types for consumers
export type ToastOptions = ToastifyOptions;
export type ToastContainerProps = ToastifyContainerProps;

// Toast configuration interface
export interface ToastConfig {
  position?: ToastifyOptions['position'];
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: 'light' | 'dark' | 'colored' | 'auto';
  className?: string;
  progressClassName?: string;
  newestOnTop?: boolean;
  rtl?: boolean;
  limit?: number;
}

// Default configuration
const defaultConfig: ToastConfig = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  newestOnTop: true,
  theme: 'light',
};

// Toast type-specific configurations
const createToastConfig = (baseConfig: ToastConfig) => ({
  success: {
    ...baseConfig,
    className: 'toast-success',
    progressClassName: 'toast-success-progress',
  },
  error: {
    ...baseConfig,
    className: 'toast-error',
    progressClassName: 'toast-error-progress',
    autoClose: 7000, // Errors stay longer
  },
  info: {
    ...baseConfig,
    className: 'toast-info',
    progressClassName: 'toast-info-progress',
  },
  warning: {
    ...baseConfig,
    className: 'toast-warning',
    progressClassName: 'toast-warning-progress',
  },
});

// Create toast factory with custom configuration
export function createToast(customConfig: ToastConfig = {}) {
  const config = { ...defaultConfig, ...customConfig };
  const typeConfigs = createToastConfig(config);

  return {
    success: (message: string, options?: ToastOptions) =>
      toastify.success(message, { ...typeConfigs.success, ...options }),

    error: (message: string, options?: ToastOptions) =>
      toastify.error(message, { ...typeConfigs.error, ...options }),

    info: (message: string, options?: ToastOptions) =>
      toastify.info(message, { ...typeConfigs.info, ...options }),

    warning: (message: string, options?: ToastOptions) =>
      toastify.warning(message, { ...typeConfigs.warning, ...options }),

    // For custom toasts
    custom: (message: string, options?: ToastOptions) =>
      toastify(message, { ...config, ...options }),

    // Direct access to original toastify for advanced use cases
    toastify,
  };
}

// Default toast instance
export const toast = createToast();

// Toast Container component with sensible defaults
export interface ToastContainerConfig extends ToastConfig {
  containerId?: string;
  style?: React.CSSProperties;
}

export const ToastContainer: React.FC<ToastContainerConfig> = ({
  position = 'top-right',
  autoClose = 5000,
  hideProgressBar = false,
  closeOnClick = true,
  pauseOnHover = true,
  draggable = true,
  newestOnTop = true,
  theme = 'light',
  containerId,
  style,
  className,
  limit,
  rtl = false,
  ...props
}) => {
  return (
    <ToastifyContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      closeOnClick={closeOnClick}
      pauseOnHover={pauseOnHover}
      draggable={draggable}
      newestOnTop={newestOnTop}
      theme={theme}
      containerId={containerId}
      style={style}
      className={className}
      limit={limit}
      rtl={rtl}
      {...props}
    />
  );
};

// CSS is imported automatically with ToastContainer

// Default styles for different toast types
export const defaultToastStyles = `
  .toast-success {
    background: #10b981;
    color: white;
  }
  
  .toast-success-progress {
    background: #065f46;
  }
  
  .toast-error {
    background: #ef4444;
    color: white;
  }
  
  .toast-error-progress {
    background: #991b1b;
  }
  
  .toast-info {
    background: #3b82f6;
    color: white;
  }
  
  .toast-info-progress {
    background: #1e40af;
  }
  
  .toast-warning {
    background: #f59e0b;
    color: white;
  }
  
  .toast-warning-progress {
    background: #92400e;
  }
`;

export default toast;
