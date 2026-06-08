'use client'

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import InputField from "@/components/InputField";

export default function EditPage() {
    const router = useRouter()
    const { id } = useParams()

    const [loading, setLoading] = useState(true)
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('')
    const [location, setLocation] = useState<string[]>([])
    const [salary, setSalary] = useState('')
    const [url, setURL] = useState('')
    const [notes, setNotes] = useState<string[]>([])

    const { token, ready } = useTheme()

    useEffect(() => {
        if (!ready) return
        if (!token) {
            router.push('/login')
            return
        }

        const fetchAndFill = async () => {
            try {
                const res = await fetch(`/api/jobs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                const data = await res.json()
                const { job } = data

                setCompany(job.company)
                setPosition(job.position)
                setStatus(job.status)
                setLocation(job.location)
                setSalary(String(job.salary))
                setURL(job.url)
                setNotes(job.notes)

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchAndFill()
    }, [id, token, ready])

    const handleSubmit = async () => {
        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    company,
                    position,
                    status,
                    location,
                    salary: Number(salary),
                    url,
                    notes
                })
            })

            if (res.ok) {
                router.push(`/jobs/${id}`)
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (!ready) return null

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

                {/* Back button */}
                <button
                    onClick={() => router.push(`/jobs/${id}`)}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 mb-6 group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform duration-200">👈</span>
                    Back to Job
                </button>

                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Edit Job
                </h1>

                <div className="space-y-4">
                    <InputField
                        label="Company"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        placeholder="Apple"
                    />
                    <InputField
                        label="Position"
                        value={position}
                        onChange={e => setPosition(e.target.value)}
                        placeholder="Software Engineer"
                    />
                    <InputField
                        label="Salary"
                        value={salary}
                        onChange={e => setSalary(e.target.value)}
                        placeholder="$100,000"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="input-base"
                        >
                            <option value="applied">Applied</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="offered">Offered</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <InputField
                        label="Location"
                        value={location.join(', ')}
                        onChange={e => setLocation(e.target.value.split(',').map(l => l.trim()))}
                        placeholder="On-site, Bay Area"
                    />
                    <InputField
                        label="URL"
                        value={url}
                        onChange={e => setURL(e.target.value)}
                        placeholder="www.apple.com/career"
                    />
                    <InputField
                        label="Notes"
                        value={notes.join(', ')}
                        onChange={e => setNotes(e.target.value.split(',').map(l => l.trim()))}
                        placeholder="Good company, follow-up needed"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-2.5 mt-6 btn-primary"
                >
                    Save Changes
                </button>

            </main>
        </div>
    )
}