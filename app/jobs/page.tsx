'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/context/ThemeContext"
import StatusBadge from "@/components/StatusBadge"

interface Job {
    _id: string
    company: string
    position: string
    status: string
    createdAt: string
}

export default function JobPage() {
    const router = useRouter()

    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState('')

    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('applied')
    const [locationInput, setLocationInput] = useState('')
    const [salary, setSalary] = useState('')
    const [notesInput, setNotesInput] = useState('')
    const [search, setSearch] = useState('')

    const { token, ready } = useTheme()

    useEffect(() => {
        if (!ready) return
        if (!token) {
            router.push('/login')
            return
        }

        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/jobs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const data = await res.json()

                if (!res.ok) {
                    setError(data.error ?? 'Failed to load jobs.')
                    return
                }

                setJobs(data.jobs)

            } catch (err) {
                setError('Something went wrong.')
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [ready, token])

    const filteredJobs = jobs.filter(j =>
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.position.toLowerCase().includes(search.toLowerCase())
    )

    const handleAddJob = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    company,
                    position,
                    status,
                    location: locationInput.split(',').map(l => l.trim()).filter(l => l !== ''),
                    salary: Number(salary),
                    notes: notesInput.split(',').map(n => n.trim()).filter(n => n !== '')
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error ?? 'Failed to add job.')
                return
            }

            setJobs([...jobs, data.job])

            setCompany('')
            setPosition('')
            setStatus('applied')
            setSalary('')
            setShowForm(false)
            setLocationInput('')
            setNotesInput('')

        } catch (err) {
            setError('Something went wrong.')
        }
    }

    const handleDeleteJob = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()

        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()

            if (res.ok) {
                setJobs(jobs.filter(j => j._id !== id))
            }
            else {
                setError(data.error ?? 'Failed to delete this job.')
            }

        } catch (err) {
            setError('Something went wrong.')
        }
    }

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
                <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        My Jobs
                    </h1>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="🔍 Search..."
                        className="flex-1 px-3.5 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
                    />
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-primary px-4 py-2 whitespace-nowrap"
                    >
                        {showForm ? 'Cancel' : '+ Add Job'}
                    </button>
                </div>
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}
                {showForm && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 border border-gray-100 dark:border-gray-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Add New Job
                        </h2>
                        <form onSubmit={handleAddJob} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Company
                                    </label>
                                    <input type="text"
                                        value={company}
                                        onChange={e => setCompany(e.target.value)}
                                        placeholder="Apple"
                                        required
                                        className="input-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Position
                                    </label>
                                    <input type="text"
                                        value={position}
                                        onChange={e => setPosition(e.target.value)}
                                        placeholder="Software engineer"
                                        required
                                        className="input-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Status
                                    </label>
                                    <select value={status}
                                        onChange={e => setStatus(e.target.value)}
                                        className="input-base" >
                                        <option value="applied">Applied</option>
                                        <option value="interviewed">Interviewed</option>
                                        <option value="offered">Offered</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Salary
                                    </label>
                                    <input type="text"
                                        value={salary}
                                        onChange={e => setSalary(e.target.value)}
                                        placeholder="$100,000"
                                        className="input-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Location
                                    </label>
                                    <input type="text"
                                        value={locationInput}
                                        onChange={e => setLocationInput(e.target.value)}
                                        placeholder="On-site, Bay Area"
                                        className="input-base"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Notes
                                    </label>
                                    <input type="text"
                                        value={notesInput}
                                        onChange={e => setNotesInput(e.target.value)}
                                        placeholder="Great company, Follow up needed"
                                        className="input-base"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-2.5 btn-primary mt-2">
                                Submit
                            </button>
                        </form>
                    </div>
                )}

                {filteredJobs.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        {search ? `No results for "${search}" 🔍` : 'No jobs yet! Add your first job!'}
                    </p>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map(j => (
                            <div key={j._id}
                                className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition"
                                onClick={() => router.push(`/jobs/${j._id}`)}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {j.company}
                                    </h3>
                                    <button onClick={(e) => handleDeleteJob(e, j._id)} className="text-red-500 hover:text-red-700 text-sm">
                                        Delete
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {j.position}
                                </p>
                                <StatusBadge status={j.status} />
                                <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                                    {new Date(j.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
