import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'en' | 'ru';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('lang') as Lang;
    return stored === 'ru' ? 'ru' : 'en';
  });

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'ru' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
