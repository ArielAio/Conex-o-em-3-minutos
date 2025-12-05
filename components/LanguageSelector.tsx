import React from "react";
import { useLanguage, SupportedLanguage } from "../services/i18n/language";

interface LanguageSelectorProps {
  onChange?: (lang: SupportedLanguage) => void;
  emphasize?: boolean;
  className?: string;
}

const LABELS: Record<SupportedLanguage, string> = {
  pt: "Português",
  en: "English",
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onChange,
  emphasize = false,
  className = "",
}) => {
  const { language, setLanguage, isSwitching } = useLanguage();

  const handleSelect = (lang: SupportedLanguage) => {
    if (lang === language || isSwitching) return;
    setLanguage(lang);
    onChange?.(lang);
  };

  return (
    <div
      className={`flex items-center gap-2 bg-white/80 border border-gray-200 rounded-full px-2 py-1 shadow-sm ${className}`}
    >
      {(Object.keys(LABELS) as SupportedLanguage[]).map((lang) => {
        const isActive = language === lang;
        return (
          <button
            key={lang}
            onClick={() => handleSelect(lang)}
            disabled={isSwitching}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-brand-primary text-brand-text shadow-md"
                : "text-gray-500 hover:text-brand-text"
            } ${emphasize ? "uppercase tracking-wide text-[11px]" : ""}`}
            aria-pressed={isActive}
            type="button"
          >
            {LABELS[lang]}
          </button>
        );
      })}
    </div>
  );
};
