import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import all locale files
import enLanding from '@/locales/en/landing.json';
import ptLanding from '@/locales/pt/landing.json';
import enMiguel from '@/locales/en/miguel.json';
import ptMiguel from '@/locales/pt/miguel.json';

export type Language = 'en' | 'pt';

interface Translations {
  landing: typeof enLanding;
  miguel: typeof enMiguel;
}

const translations: Record<Language, Translations> = {
  en: {
    landing: enLanding,
    miguel: enMiguel,
  },
  pt: {
    landing: ptLanding,
    miguel: ptMiguel,
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
    // Check URL path first
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/en')) return 'en';
      if (path.startsWith('/pt')) return 'pt';
      
      // Then check localStorage
      const stored = localStorage.getItem('nello-language');
      if (stored === 'en' || stored === 'pt') return stored;
      
      // Then check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('pt')) return 'pt';
    }
    return 'en'; // Default to English for global launch
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nello-language', lang);
  };

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language;
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
