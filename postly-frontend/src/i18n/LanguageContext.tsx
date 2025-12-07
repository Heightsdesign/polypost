// src/i18n/LanguageContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { SupportedLang } from "./translations";
import { t as translate } from "./translations";
import api from "../api";

type LanguageContextType = {
  lang: SupportedLang;
  t: (key: string) => string;
  setLang: (lang: SupportedLang, opts?: { persist?: boolean; syncProfile?: boolean }) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = "postly_lang";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLang>("en");

  const setLang = (
    newLang: SupportedLang,
    opts?: { persist?: boolean; syncProfile?: boolean }
  ) => {
    setLangState(newLang);

    if (opts?.persist) {
      localStorage.setItem(LOCAL_STORAGE_KEY, newLang);
    }

    if (opts?.syncProfile) {
      // only works if user is authenticated; ignore errors silently
      api.patch("/profile/", { preferred_language: newLang }).catch(() => {});
    }
  };

  useEffect(() => {
    (async () => {
      // 1) manual override from localStorage (always wins)
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY) as SupportedLang | null;
      if (stored && ["en", "fr", "es", "pt"].includes(stored)) {
        setLangState(stored);
        return;
      }

      // 2) try to get logged-in profile; if this works, we don't care about IP anymore
      try {
        const res = await api.get("/profile/"); // adjust to your actual profile endpoint
        const profileLang = res.data?.preferred_language as SupportedLang | undefined;

        if (profileLang && ["en", "fr", "es", "pt"].includes(profileLang)) {
          setLangState(profileLang);
          return;
        }
      } catch {
        // not logged in or no profile endpoint; fall through
      }

      // 3) unauthenticated → IP-based detection (for landing + register)
      try {
        const res = await api.get("/detect-language/");
        const detected = res.data?.language as SupportedLang | undefined;
        if (detected && ["en", "fr", "es", "pt"].includes(detected)) {
          setLangState(detected);
          return;
        }
      } catch {
        // ignore errors
      }

      // 4) fallback to browser or English
      const browser = navigator.language.slice(0, 2) as SupportedLang;
      if (["en", "fr", "es", "pt"].includes(browser)) {
        setLangState(browser);
      } else {
        setLangState("en");
      }
    })();
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        t: (key) => translate(lang, key),
        setLang,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
