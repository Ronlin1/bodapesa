import React from 'react';
import { Language } from '../types';
import { cn } from '../lib/utils';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ current, onChange }) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'sw', label: 'Kiswahili' },
    { code: 'lg', label: 'Luganda' },
  ];

  return (
    <div className="flex bg-black p-1 rounded-2xl border border-yellow-400">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-black uppercase transition-all",
            current === lang.code 
              ? "bg-yellow-400 text-black scale-105" 
              : "text-yellow-400 hover:bg-yellow-400/10"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
