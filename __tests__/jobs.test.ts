import { GET, POST } from '@/app/api/jobs/route'

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock('@/models/Job', () => ({
    __esModule: true,
    default: {
        find: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([
                { _id: '1', company: 'Google', position: 'Engineer', status: 'pending' }
            ])
        }),
        create: jest.fn().mockResolvedValue({
             _id: '2', company: 'Apple', position: 'Dev', status: 'pending'
        })
    }
}))

jest.mock('@/middleware/auth', () => ({
    authMiddleware: jest.fn().mockReturnValue({id: 'user123'})
}))

describe('Jobs API', () => {
    
    test('GET /api/jobs return jobs', async () => {
        const req = new Request('http://localhost/api/jobs', {
            method: 'GET',
            headers: {Authorization: 'Bearer faketoken'}
        })

        const res = await GET(req)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.jobs).toHaveLength(1)
        expect(data.jobs[0].company).toBe('Google')
    })

    test('POST /api/jobs creates a job', async () => {
        const req = new Request('http://localhost/api/jobs', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer faketoken',
                'Content-Type': 'application/json'},
            body: JSON.stringify({
                company: 'Apple',
                position: 'Dev',
                status: 'pending',
                location: 'CA',
                salary: '100k',
                notes: '',
                url: ''
            })
        })

        const res = await POST(req)
        const data = await res.json()

        expect(res.status).toBe(201)
        expect(data.job.company).toBe('Apple')
    })
})