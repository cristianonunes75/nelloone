import { useEffect, useCallback, useRef } from 'react';

const VERSION_CHECK_INTERVAL = 30 * 60 * 1000; // Check every 30 minutes
const INITIAL_CHECK_DELAY = 60 * 1000; // Wait 1 minute after page load

export const useVersionCheck = () => {
  const hasUpdated = useRef(false);
  const lastHash = useRef<string | null>(null);
  
  const checkForUpdates = useCallback(async () => {
    // Don't check again if we already triggered an update
    if (hasUpdated.current) return;
    
    try {
      // Fetch the current index.html to check for new version
      const response = await fetch('/?_v=' + Date.now(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) return;
      
      const html = await response.text();
      
      // Extract ONLY the main bundle hash (more stable than all scripts)
      const mainScript = html.match(/src="\/assets\/index-[a-zA-Z0-9]+\.js"/)?.[0] || '';
      
      if (!mainScript) return;
      
      // On first check, just store the hash
      if (lastHash.current === null) {
        lastHash.current = mainScript;
        sessionStorage.setItem('app-main-hash', mainScript);
        return;
      }
      
      // Compare with stored hash
      const storedHash = sessionStorage.getItem('app-main-hash');
      
      if (storedHash && storedHash !== mainScript && lastHash.current !== mainScript) {
        // New version detected - update silently
        hasUpdated.current = true;
        
        // Clear all caches and reload silently
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        sessionStorage.removeItem('app-main-hash');
        
        // Small delay to ensure caches are cleared
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.debug('Version check failed:', error);
    }
  }, []);

  useEffect(() => {
    // Initialize hash from session storage
    const stored = sessionStorage.getItem('app-main-hash');
    if (stored) {
      lastHash.current = stored;
    }
    
    // Check after a longer delay to not slow initial load
    const initialCheck = setTimeout(checkForUpdates, INITIAL_CHECK_DELAY);
    
    // Then check less frequently
    const interval = setInterval(checkForUpdates, VERSION_CHECK_INTERVAL);
    
    // Also check when tab becomes visible again (but with debounce)
    let lastVisibilityCheck = 0;
    const handleVisibilityChange = () => {
      const now = Date.now();
      if (document.visibilityState === 'visible' && now - lastVisibilityCheck > 5 * 60 * 1000) {
        lastVisibilityCheck = now;
        checkForUpdates();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkForUpdates]);
};
