
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { locales } from './locales';

export type Language = 'en' | 'pl' | 'de' | 'cs';
export type LocaleKey = keyof typeof locales.en;

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: LocaleKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Language>('en');

    const t = useCallback((key: LocaleKey): string => {
        return locales[lang][key] || locales['en'][key] || key;
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLocalization = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageSelector: React.FC = () => {
    const { lang, setLang } = useLocalization();
    const languages: Language[] = ['en', 'pl', 'de', 'cs'];

    return (
        <div className="flex space-x-2 bg-black/20 backdrop-blur-md p-1 rounded-full border border-white/20">
            {languages.map(l => (
                <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`w-10 h-10 rounded-full text-sm font-bold uppercase transition-all ${
                        lang === l 
                            ? 'bg-cyan-500/80 text-white shadow-lg' 
                            : 'bg-transparent text-gray-300 hover:bg-white/10'
                    }`}
                >
                    {l}
                </button>
            ))}
        </div>
    );
};