import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isDevelopment = () => {
  const hostname = window.location.hostname;
  return hostname.includes('localhost') || 
         hostname.includes('lovableproject.com') || 
         hostname.includes('lovable.app') ||
         hostname.includes('preview');
};

// Unregister any existing service workers in dev/preview
if (isDevelopment() && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => {
      reg.unregister();
      console.log('🧹 Unregistered SW in dev environment');
    });
  });
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  const skipSW = isDevelopment();

  // Only import and use registerSW in production
  useEffect(() => {
    if (skipSW) return;

    // Dynamically import to avoid SW registration in dev
    import('virtual:pwa-register').then(({ registerSW }) => {
      const updateSW = registerSW({
        immediate: true,
        onRegisteredSW(swUrl: string, r: ServiceWorkerRegistration | undefined) {
          console.log('SW registered:', swUrl);
          if (r) {
            setInterval(() => {
              r.update();
            }, 60 * 60 * 1000);
          }
        },
        onNeedRefresh() {
          setNeedRefresh(true);
        },
        onRegisterError(error: any) {
          console.error('SW registration error:', error);
        },
      });
      // Store updateSW for later use
      (window as any).__updateSW = updateSW;
    });
  }, [skipSW]);

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };
    checkInstalled();

    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      const isNotInStandalone = !(window.navigator as any).standalone;
      setIsIOS(isIOSDevice && isNotInStandalone);
    };
    checkIOS();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error prompting install:', error);
      return false;
    }
  };

  const updateApp = useCallback(async () => {
    const updateSW = (window as any).__updateSW;
    if (updateSW) await updateSW(true);
  }, []);

  const dismissUpdate = useCallback(() => {
    setNeedRefresh(false);
  }, []);

  return {
    isInstallable: isInstallable || isIOS,
    isInstalled,
    isIOS,
    promptInstall,
    needRefresh,
    updateApp,
    dismissUpdate
  };
};
