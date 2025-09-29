import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress noisy ResizeObserver runtime error that appears in some browsers/dev builds
// See: 'ResizeObserver loop completed with undelivered notifications.'
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event: ErrorEvent) => {
    const msg = event?.message || '';
    if (typeof msg === 'string' && msg.includes('ResizeObserver loop completed with undelivered notifications')) {
      // Prevent the error from bubbling to dev overlays / error reporters
      try {
        event.stopImmediatePropagation();
        event.preventDefault();
      } catch (e) {
        // ignore
      }
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
