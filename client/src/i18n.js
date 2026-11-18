import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ne from './locales/ne.json'

const LANGUAGE_KEY = 'yatra_language'

function readSavedLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === 'ne' ? 'ne' : 'en'
  } catch {
    return 'en'
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ne: { translation: ne },
  },
  lng: readSavedLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

document.documentElement.lang = i18n.language

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
  try {
    localStorage.setItem(LANGUAGE_KEY, language)
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for this visit only.
  }
})

export default i18n
