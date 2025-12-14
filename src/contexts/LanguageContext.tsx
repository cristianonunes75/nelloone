import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import all locale files
import enLanding from '@/locales/en/landing.json';
import ptLanding from '@/locales/pt/landing.json';
import ptPtLanding from '@/locales/pt-pt/landing.json';
import enMiguel from '@/locales/en/miguel.json';
import ptMiguel from '@/locales/pt/miguel.json';
import ptPtMiguel from '@/locales/pt-pt/miguel.json';
import enUser from '@/locales/en/user.json';
import ptUser from '@/locales/pt/user.json';
import ptPtUser from '@/locales/pt-pt/user.json';

export type Language = 'en' | 'pt' | 'pt-pt';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Translations {
  landing: Record<string, any>;
  miguel: Record<string, any>;
}

const translations: Record<Language, Translations & { user: typeof enUser }> = {
  en: {
    landing: enLanding,
    miguel: enMiguel,
    user: enUser,
  },
  pt: {
    landing: ptLanding,
    miguel: ptMiguel,
    user: ptUser,
  },
  'pt-pt': {
    landing: ptPtLanding,
    miguel: ptPtMiguel,
    user: ptPtUser,
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      
      // Check URL path first - /pt-pt/ prefix means European Portuguese
      if (path.startsWith('/pt-pt')) return 'pt-pt';
      // /en/ prefix means English
      if (path.startsWith('/en')) return 'en';
      
      // Check localStorage
      const stored = localStorage.getItem('nello-language');
      if (stored === 'en' || stored === 'pt' || stored === 'pt-pt') return stored;
      
      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang === 'pt-pt') return 'pt-pt';
      if (browserLang.startsWith('pt')) return 'pt';
      
      // Default: if no prefix and no preference, default to PT (Brazilian market)
      return 'pt';
    }
    return 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nello-language', lang);
  };

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language === 'pt-pt' ? 'pt-PT' : language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
