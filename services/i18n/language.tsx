import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SupportedLanguage = "pt" | "en";

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isSwitching: boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "ce3m:language";
const GOOGLE_SCRIPT_ID = "google-translate-script";
const GOOGLE_TRANSLATE_CONTAINER_ID = "google_translate_element";
const COOKIE_KEY = "googtrans";

const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof navigator === "undefined") return "pt";
  const browserLang = navigator.language?.toLowerCase() || "";
  if (browserLang.startsWith("en")) return "en";
  if (browserLang.startsWith("pt")) return "pt";
  const fallback = navigator.languages?.find((lng) => lng.toLowerCase().startsWith("en"));
  return fallback ? "en" : "pt";
};

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") return "pt";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "pt") return stored;
  return detectBrowserLanguage();
};

const loadGoogleTranslateScript = () => {
  if (typeof window === "undefined") return;
  if (document.getElementById(GOOGLE_SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = GOOGLE_SCRIPT_ID;
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
};

const applyGoogleTranslation = (lang: SupportedLanguage) => {
  if (typeof window === "undefined") return;
  const select: HTMLSelectElement | null = document.querySelector(".goog-te-combo");
  if (!select) return;
  if (select.value === lang) return;
  select.value = lang;
  select.dispatchEvent(new Event("change"));
};

const setTranslateCookie = (lang: SupportedLanguage) => {
  if (typeof document === "undefined") return;
  const value = `/pt/${lang}`;
  const domains = [window.location.hostname, window.location.hostname.replace(/^www\./, "")].filter(Boolean);
  domains.forEach((domain) => {
    document.cookie = `${COOKIE_KEY}=${value};path=/;domain=${domain};max-age=31536000`;
  });
  document.cookie = `${COOKIE_KEY}=${value};path=/;max-age=31536000`;
};

const waitForAndApplyTranslation = (lang: SupportedLanguage) => {
  let attempts = 0;
  const maxAttempts = 20; // ~5s
  const timer = setInterval(() => {
    attempts += 1;
    setTranslateCookie(lang);
    applyGoogleTranslation(lang);
    const selectExists = document.querySelector(".goog-te-combo");
    if (selectExists || attempts >= maxAttempts) {
      clearInterval(timer);
    }
  }, 250);
};

const ensureTranslator = (lang: SupportedLanguage) => {
  if (typeof window === "undefined") return;
  const { google } = window as any;

  if (google && google.translate && google.translate.TranslateElement) {
    waitForAndApplyTranslation(lang);
    return;
  }

  (window as any).googleTranslateElementInit = () => {
    /* eslint-disable no-new */
    new google.translate.TranslateElement(
      {
        pageLanguage: "pt",
        includedLanguages: "pt,en",
        autoDisplay: false,
      },
      GOOGLE_TRANSLATE_CONTAINER_ID
    );
    waitForAndApplyTranslation(lang);
  };

  loadGoogleTranslateScript();
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);
  const [switchingTo, setSwitchingTo] = useState<SupportedLanguage | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
    setTranslateCookie(language);
    ensureTranslator(language);
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    if (lang === language) return;
    setSwitchingTo(lang);
    setTranslateCookie(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  const value = useMemo(
    () => ({ language, setLanguage, isSwitching: switchingTo !== null }),
    [language, switchingTo]
  );

  return (
    <LanguageContext.Provider value={value}>
      <style>
        {`
          @keyframes ce3m-wipe {
            0% { transform: scale(0); opacity: 1; }
            60% { transform: scale(3); opacity: 0.95; }
            100% { transform: scale(4.5); opacity: 0; }
          }
          .ce3m-wipe-circle {
            animation: ce3m-wipe 0.9s ease-in-out forwards;
            will-change: transform, opacity;
          }
        `}
      </style>
      <div
        id={GOOGLE_TRANSLATE_CONTAINER_ID}
        style={{ position: "fixed", opacity: 0, pointerEvents: "none" }}
        aria-hidden
      />
      {children}
      {switchingTo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-brand-text/50 backdrop-blur-sm" />
          <div className="absolute w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full ce3m-wipe-circle" />
          <div className="relative px-6 py-4 rounded-2xl bg-black/60 border border-white/10 shadow-2xl text-center animate-fade-in">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold opacity-80">Switching language</p>
            <p className="text-lg font-semibold mt-1">Loading {switchingTo === "en" ? "English" : "Português"}…</p>
            <p className="text-xs opacity-70 mt-2">We’ll reload to apply all texts.</p>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
