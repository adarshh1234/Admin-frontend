/**
 * API Configuration Helper
 * Resolves API Base URL for local development and production.
 */
export const API_BASE_URL: string = (() => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000';
  }
  return (import.meta.env.VITE_API_URL || 'http://localhost:5000')
    .replace(/\/api\/?$/, '')
    .replace(/\/+$/, '');
})();
