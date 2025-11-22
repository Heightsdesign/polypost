import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { "welcome": "Welcome to Polypost" } },
    fr: { translation: { "welcome": "Bienvenue sur Polypost" } },
    de: { translation: { "welcome": "Willkommen bei Polypost" } },
    es: { translation: { "welcome": "Bienvenido a Polypost" } },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
