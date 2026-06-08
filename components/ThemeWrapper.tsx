'use client'

import { useTheme } from "@/context/ThemeContext"
import Navbar from "./Navbar"
import { useEffect } from "react"

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { darkMode } = useTheme()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}