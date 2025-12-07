import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Prevent back/forward cache issues
window.addEventListener('pagehide', () => {
  // Clear any pending requests
  if (window.fetch) {
    // Page is being unloaded
  }
});

// Restore from back/forward cache
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from bfcache
    console.log('Page restored from cache');
  }
});

// Register service worker for offline support and caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
