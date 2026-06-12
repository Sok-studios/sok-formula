import { createContext, useContext, useState } from 'react'
import { T } from '../data/translations.js'

const LangCtx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en')
  return (
    <LangCtx.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LangCtx.Provider>
  )
}

export const useLang = () => useContext(LangCtx)
