import React, { createContext, useContext, useState } from 'react';
import { translations, type Language, type Translations } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'so',
  setLang: () => {},
  t: translations.so
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dhamme_language') as Language;
      if (saved && (saved === 'so' || saved === 'en' || saved === 'am')) {
        return saved;
      }
    }
    return 'so';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('dhamme_language', newLang);
    } catch (e) {
      console.warn('Unable to save language preference:', e);
    }
  };

  const t = translations[lang] || translations.so;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
