'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/context/ThemeContext"
import InputField from "@/components/InputField"

export default function RegisterPage() {
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const {ready, token} = useTheme()

    useEffect(() => {
        if (!ready) return
        if (token) {
            router.push('/dashboard')
        }
    }, [token, ready])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error)
                return
            }

            router.push('/login')
        } catch (error) {
            console.log(error)
            setError('Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    if (!ready) return null
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-300">
            <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Create account
                    </h1>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                        Sign up to get started
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField 
                        label="Username"
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        placeholder="janedoe" 
                        required
                    />
                    <InputField 
                        label="Email"
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="you@example.com"
                        required
                    />
                    <InputField 
                        label="Password"
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="********"
                        required
                    />
                    <button type="submit" disabled={loading} className="w-full py-2.5 px-4 btn-primary disabled:opacity-50 mt-2">
                        {loading ? 'Creating...' : 'Create account'}
                    </button>

                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href={'/login'} className="text-gray-900 dark:text-white font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}