import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const VERSION_CHECK_INTERVAL = 2 * 60 * 1000; // Check every 2 minutes

export const useVersionCheck = () => {
  const checkForUpdates = useCallback(async () => {
    try {
      // Fetch the current index.html to check for new version
      const response = await fetch('/', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) return;
      
      const html = await response.text();
      
      // Extract script/css hashes from the HTML
      const currentScripts = html.match(/src="[^"]+\.js"/g)?.join('') || '';
      const storedScripts = sessionStorage.getItem('app-scripts-hash');
      
      if (storedScripts && storedScripts !== currentScripts) {
        // New version detected!
        toast.info('Nova versão disponível!', {
          description: 'Clique para atualizar',
          duration: Infinity,
          action: {
            label: 'Atualizar',
            onClick: () => {
              // Clear all caches and reload
              if ('caches' in window) {
                caches.keys().then(names => {
                  names.forEach(name => caches.delete(name));
                });
              }
              window.location.reload();
            }
          }
        });
      } else if (!storedScripts) {
        // First visit, store the hash
        sessionStorage.setItem('app-scripts-hash', currentScripts);
      }
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.debug('Version check failed:', error);
    }
  }, []);

  useEffect(() => {
    // Check on mount (after a small delay to not slow initial load)
    const initialCheck = setTimeout(checkForUpdates, 5000);
    
    // Then check periodically
    const interval = setInterval(checkForUpdates, VERSION_CHECK_INTERVAL);
    
    // Also check when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
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
