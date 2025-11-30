/**
 * ===============================================
 * TOAST NOTIFICATION SYSTEM
 * Global notification management
 * ===============================================
 */

// Store for active toasts
let toastId = 0;
let toastCallbacks = {};

/**
 * Register callback for toast updates
 */
export const registerToastCallback = (callback) => {
  toastCallbacks.update = callback;
};

/**
 * Show notification toast
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in ms (0 = persistent)
 */
export const showToast = (message, type = 'info', duration = 3000) => {
  const id = ++toastId;
  const toast = { id, message, type };

  if (toastCallbacks.update) {
    toastCallbacks.update((prev) => [...prev, toast]);
  }

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
};

/**
 * Remove notification toast
 */
export const removeToast = (id) => {
  if (toastCallbacks.update) {
    toastCallbacks.update((prev) => prev.filter((toast) => toast.id !== id));
  }
};

/**
 * Shorthand methods
 */
export const toast = {
  success: (message, duration = 3000) => showToast(message, 'success', duration),
  error: (message, duration = 3000) => showToast(message, 'error', duration),
  info: (message, duration = 3000) => showToast(message, 'info', duration),
  warning: (message, duration = 3000) => showToast(message, 'warning', duration),
};
