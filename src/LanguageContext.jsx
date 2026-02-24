import { createContext, useContext, useState, useCallback } from 'react'
import translations from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('sr') // Serbian default

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'sr' ? 'en' : 'sr'))
  }, [])

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
