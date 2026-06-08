'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTheme } from "@/context/ThemeContext"
import StatusBadge from "@/components/StatusBadge"

interface Job {
    _id: string,
    company: string,
    position: string,
    status: string,
    location: string[],
    salary?: number,
    notes: string[],
    url?: string,
    createdAt: string
}
export default function JobDetailPage() {
    const router = useRouter()
    const { id } = useParams()

    const [job, setJob] = useState<Job | null>(null)
    const [loading, setLoading] = useState(true)
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState('')

    const { token, ready } = useTheme()

    useEffect(() => {
        if (!ready) return
        if (!token) {
            router.push('/login')
            return
        }

        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await res.json()

                if (!res.ok) {
                    setError(data.error ?? 'Failed to load job.') 
                    return
                }

                setJob(data.job)
            } catch (err) {
                setError('Something went wrong.')
            } finally {
                setLoading(false)
            }
        }

        fetchJob()
    }, [id, ready, token])

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.ok) {
                setShowConfirm(false)
                router.push('/jobs')
                return
            }
        } catch (err) {
            console.log(err)
        }
    }

    if (!ready) return null

    if (error) {
        return (
            <div className="page-bg flex items-center justify-center">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading... ⏳</p>
            </div>
        )
    }
    return (
        <div className="page-bg">
            <main className="max-w-2xl mx-auto px-6 py-8">
                <button
                    onClick={() => router.push('/jobs')}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 mb-6 group">
                    <span className="group-hover:-translate-x-1 transition-transform duration-200">👈</span>
                    Back to Jobs
                </button>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {job?.company}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {job?.position}
                        </p>
                    </div>
                    <StatusBadge status={job?.status ?? ''} />
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
                    {job?.salary && (
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                                Salary
                            </p>
                            <p className="text-gray-900 dark:text-white mt-1">
                                ${job.salary.toLocaleString()}
                            </p>
                        </div>
                    )}
                    {(job?.location?.length ?? 0) > 0 && (
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                                Location
                            </p>
                            <p className="text-gray-900 dark:text-white mt-1">
                                {job?.location.join(', ')}
                            </p>
                        </div>
                    )}
                    {(job?.notes?.length ?? 0) > 0 && (
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                                Notes
                            </p>
                            <ul>
                                {job?.notes.map(n =>
                                    <li key={n}>{n}</li>
                                )}
                            </ul>
                        </div>
                    )}
                    {job?.url && (
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                                Job Link
                            </p>
                            <a
                                href={job.url}
                                target="_blank"
                                className="text-blue-500 hover:text-blue-600 text-sm mt-1 inline-block"
                            >
                                View Original Posting 🔗
                            </a>
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                            Applied
                        </p>
                        <p className="text-gray-900 dark:text-white mt-1">
                            {new Date(job?.createdAt ?? '').toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <button onClick={() => router.push(`/jobs/${id}/edit`)} className="flex-1 py-2.5 bg-blue-400 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all duration-200">
                        ✏️ Edit
                    </button>
                    <button onClick={() => setShowConfirm(true)} className="flex-1 py-2.5 bg-red-400 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-all duration-200">
                        🗑️ Delete
                    </button>
                </div>
            </main>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setShowConfirm(false)}>
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-sm mx-4"
                        onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Do you confirm to delete?
                        </h2>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowConfirm(false)}
                                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                                ❌ Cancel
                            </button>
                            <button onClick={handleDelete}
                                className="flex-1 py-2.5 bg-red-400 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-all duration-200">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}