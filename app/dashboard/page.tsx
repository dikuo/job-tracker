'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/context/ThemeContext"

interface Job {
    _id: string
    company: string
    position: string
    status: string
    location: string[]
    salary?: number
    notes: string[]
    createdAt: string
    updatedAt: string
}

export default function DashboardPage() {
    const router = useRouter()

    const { token, user, ready } = useTheme()
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!ready) return
        if (!token) {
            router.push('/login')
            return
        }

        const fetchData = async () => {
            try {
                const res = await fetch('/api/jobs', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                const data = await res.json()

                if (!res.ok) {
                    setError(data.error ?? 'Failed to load jobs.')
                    return
                }

                setJobs(data.jobs)

            } catch (error) {
                setError("Something went wrong.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [ready, token])

    if (!ready) return null

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading...⏳</p>
            </div>
        )
    }

    return (
        <div className="page-bg">
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Welcome back, {user?.username}! 👋
                    </h1>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                        Here's your job search overview
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total:
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {jobs.length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Applied:
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {jobs.filter(j => j.status === 'applied').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Interviewed:
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {jobs.filter(j => j.status === 'interviewed').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Offered:
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                            {jobs.filter(j => j.status === 'offered').length}
                        </p>
                    </div>
                </div>
                <Link href='/jobs' className="inline-block px-6 py-3 btn-primary">
                    View All Jobs →
                </Link>
            </main>
        </div>
    )
}