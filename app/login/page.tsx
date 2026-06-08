'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/context/ThemeContext"
import InputField from "@/components/InputField"

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { setUser, token, setToken, ready } = useTheme()
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
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error);
                return
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            setToken(data.token)
            setUser({ username: data.user.username })
            router.push('/dashboard')

        } catch (err) {
            console.log(err)
            setError('Something went wrong!')
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
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Sign in to your account
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg 
                                    bg-red-50 dark:bg-red-900/20
                                    text-red-600 dark:text-red-400
                                    text-sm">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <InputField
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@exmaple.com"
                        required
                    />
                    <InputField
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="********"
                        required
                    />

                    <button type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 btn-primary mt-2">
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link href={'/register'} className="text-gray-900 dark:text-white font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}