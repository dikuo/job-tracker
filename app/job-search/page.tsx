'use client'

import { useTheme } from "@/context/ThemeContext"
import { useEffect, useState } from "react"
import { AdzunaJob } from "@/types"

export default function JobSearchPage() {
    const [query, setQuery] = useState('software engineer new grad')
    const [location, setLocation] = useState('california')
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [savedUrls, setSavedUrls] = useState<string[]>([])
    const [error, setError] = useState('')

    const { token, ready, jobSearchResults, setJobSearchResults } = useTheme()

    useEffect(() => {
        if (!ready || !token) return

        const fetchSavedJob = async () => {
            try {
                const res = await fetch('/api/jobs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await res.json()
                const urls = (data.jobs || []).map((j: any) => j.url).filter(Boolean)

                if (token) {
                    setSavedUrls(urls)
                }
            } catch (err) {
                setError('Failed to load saved jobs.')
            }
        }

        fetchSavedJob()
    }, [ready, token])

    const handleSearch = async () => {
        try {
            setLoading(true)
            setPage(1)
            setError('')
            const res = await fetch(`/api/job-search?q=${query}&location=${location}`)
            const data = await res.json()
            setJobSearchResults(data.results)
            setTotalCount(data.count)
        } catch (err) {
            setError('Failed to search jobs. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const loadMore = async () => {
        try {
            setLoading(true)
            const nextPage = page + 1
            setPage(nextPage)
            const res = await fetch(`/api/job-search?q=${query}&location=${location}&page=${nextPage}`)
            const data = await res.json()
            setJobSearchResults([...jobSearchResults, ...data.results])
            setTotalCount(data.count)
        } catch (err) {
            setError('Failed to search jobs. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (job: AdzunaJob) => {
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    position: job.title,
                    company: job.company.display_name,
                    location: [job.location.display_name],
                    status: 'applied',
                    url: job.redirect_url,
                    salary: job.salary_min ?? 0
                })
            })
            const data = await res.json()
            if (res.ok) {
                setSavedUrls([...savedUrls, job.redirect_url])
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="page-bg">
            <main className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    🔍 Job Search
                </h1>
                <div className="flex gap-3 mb-8">
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onFocus={() => setQuery('')}
                        placeholder="Job title..."
                        className="flex-1 px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    <input
                        type="text"
                        value={location}
                        placeholder="Location..."
                        onChange={e => setLocation(e.target.value)}
                        onFocus={() => setLocation('')}
                        className="flex-1 px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="btn-primary px-6 py-2.5 whitespace-nowrap"
                    >
                        Search
                    </button>
                </div>
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}
                {!error && loading && <p className="text-gray-500">Searching...⏳</p>}
                {!error && !loading && jobSearchResults.length === 0 &&
                    <p className="text-gray-500 dark:text-gray-400">
                        No results yet. Start a new job search! 🔍
                    </p>
                }
                {!error &&
                    <div className="space-y-4">
                        {jobSearchResults.map(r => (
                            <div key={r.id} className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">

                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {r.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {r.company.display_name}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSave(r)}
                                            disabled={savedUrls.includes(r.redirect_url)}
                                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                            ${savedUrls.includes(r.redirect_url)
                                                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200'
                                                }`}
                                        >
                                            {savedUrls.includes(r.redirect_url) ? 'Saved ✅' : '+ Save'}
                                        </button>
                                        <a href={r.redirect_url} target="_blank"
                                            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200">
                                            Apply 🔗
                                        </a>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    📍 {r.location.display_name}
                                </p>

                                {r.salary_min && (
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        💰 ${r.salary_min.toLocaleString()} - ${r.salary_max?.toLocaleString()}
                                    </p>
                                )}

                                <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                                    📅 Posted: {new Date(r.created).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                        {jobSearchResults.length < totalCount && (
                            <button
                                onClick={loadMore}
                                className="w-full py-2.5 btn-primary mt-4"
                            >
                                {loading ? 'Loading' : 'Load More'}
                            </button>
                        )}
                    </div>}
            </main>
        </div>
    )
}