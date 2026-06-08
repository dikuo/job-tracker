'use client'

import { useState, createContext, useContext, useEffect } from "react"
import { AdzunaJob } from "@/types"

interface ThemeContextType {
    darkMode: boolean,
    toggleDark: () => void
    user: { username: string }
    setUser: (user: { username: string }) => void
    token: string
    setToken: (token: string) => void
    ready: boolean
    jobSearchResults: AdzunaJob[]
    setJobSearchResults: (results: AdzunaJob[]) => void
}

const ThemeContext = createContext<ThemeContextType>({
    darkMode: false,
    toggleDark: () => { },
    user: { username: '' },
    setUser: () => { },
    token: '',
    setToken: () => { },
    ready: false,
    jobSearchResults: [],
    setJobSearchResults: () => []
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false)
    const [user, setUser] = useState<{ username: string }>({ username: '' })
    const [token, setToken] = useState('')
    const [ready, setReady] = useState(false)
    const [jobSearchResults, setJobSearchResults] = useState<AdzunaJob[]>([])
    
    const toggleDark = () => {
        const mode = !darkMode
        setDarkMode(mode)
        localStorage.setItem('darkMode', String(mode))
    }

    useEffect(() => {
        const userStored = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        const darkStored = localStorage.getItem('darkMode')

        if (userStored && token) {
            setUser(JSON.parse(userStored))
            setToken(token)
        }

        if (darkStored === 'true') setDarkMode(true)

        setReady(true)
    }, [])

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDark, user, setUser, token, setToken, ready, jobSearchResults, setJobSearchResults }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}