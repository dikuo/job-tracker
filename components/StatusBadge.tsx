const statusClasses :Record<string, string> = {
    applied: 'bg-blue-100 text-blue-700',
    interviewed: 'bg-yellow-100 text-yellow-700',
    offered: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
}

export default function StatusBadge ({ status, className = ''} : {status:string; className?: string}) {
    return (
        <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${statusClasses[status] ?? ''} ${className}`.trim()}>
            {status}
        </span>
    )
}