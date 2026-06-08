'use client'

import { useTheme } from "@/context/ThemeContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Navbar() {
    const router = useRouter()

    const { darkMode, toggleDark, user, setUser, token, setToken } = useTheme()

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Job Tracker
            </span>
            {token && (
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/job-search"
                        className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                        Job Search 🔍
                    </Link>
                    <Link
                        href="/jobs"
                        className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    >
                        My Jobs 💼
                    </Link>
                </div>
            )}
            <div className="flex items-center gap-4">
                {token && (
                    <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                        {user.username}
                    </span>
                )}
                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800" onClick={toggleDark}>
                    {darkMode ? '☀️' : '🌙'}
                </button>
                {token && (
                    <button className="text-sm text-red-600 hover:text-red-700"
                        onClick={() => {
                            localStorage.removeItem('token')
                            localStorage.removeItem('user')
                            setUser({ username: '' })
                            setToken('')
                            router.push('/login')
                        }
                        }>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    )
}

