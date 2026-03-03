import { useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

const VERSION_CHECK_INTERVAL = 30 * 60 * 1000; // Check every 30 minutes
const INITIAL_CHECK_DELAY = 5 * 60 * 1000; // Wait 5 minutes after page load

// Detect if we're in development/preview mode
const isDevelopment = () => {
  const hostname = window.location.hostname;
  return hostname.includes('localhost') || 
         hostname.includes('lovableproject.com') || 
         hostname.includes('lovable.app') ||
         hostname.includes('preview');
};

export const useVersionCheck = () => {
  // Completely skip in development/preview
  const skipCheck = isDevelopment();
  const hasNotified = useRef(false);
  const lastHash = useRef<string | null>(null);
  
  const checkForUpdates = useCallback(async () => {
    if (skipCheck) return;
    
    // Don't check again if we already notified user
    if (hasNotified.current) return;
    
    try {
      const response = await fetch('/?_v=' + Date.now(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) return;
      
      const html = await response.text();
      
      // Extract the main bundle hash
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
        // New version detected — show a non-intrusive toast instead of reloading
        hasNotified.current = true;
        lastHash.current = mainScript;
        sessionStorage.setItem('app-main-hash', mainScript);
        
        toast('Nova versão disponível', {
          description: 'Atualize para a versão mais recente.',
          duration: Infinity,
          action: {
            label: 'Atualizar',
            onClick: () => {
              // Clear caches and reload only when user clicks
              if ('caches' in window) {
                caches.keys().then(names => {
                  names.forEach(name => caches.delete(name));
                });
              }
              sessionStorage.removeItem('app-main-hash');
              window.location.reload();
            },
          },
        });
      }
    } catch (error) {
      // Silently fail
      console.debug('Version check failed:', error);
    }
  }, []);

  useEffect(() => {
    if (skipCheck) return;
    
    // Initialize hash from session storage
    const stored = sessionStorage.getItem('app-main-hash');
    if (stored) {
      lastHash.current = stored;
    }
    
    const initialCheck = setTimeout(checkForUpdates, INITIAL_CHECK_DELAY);
    const interval = setInterval(checkForUpdates, VERSION_CHECK_INTERVAL);
    
    // Check when tab becomes visible (debounced)
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
