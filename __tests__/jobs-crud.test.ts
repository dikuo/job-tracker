import { GET, PUT, DELETE } from "@/app/api/jobs/[id]/route"

jest.mock("@/lib/mongodb", () => ({
    __esModule: true,
    default: jest.fn()
}))

jest.mock("@/middleware/auth", () => ({
    authMiddleware: jest.fn().mockReturnValue({ id: 'user123' })
}))

jest.mock("@/models/Job", () => ({
    __esModule: true,
    default: {
        findById: jest.fn().mockResolvedValue({
            _id: '1',
            company: 'Google',
            position: 'Engineer',
            status: 'pending',
            userId: { toString: () => 'user123' }
        }),
        findByIdAndUpdate: jest.fn().mockResolvedValue({
            _id: '1',
            company: 'Google',
            position: 'Engineer',
            status: 'offered',
            userId: { toString: () => 'user123' }
        }),
        findByIdAndDelete: jest.fn().mockResolvedValue({
            message: 'This job is deleted.'
        })
    }
}))

describe('Specific Job API', () => {

    test('GET /api/jobs/:id', async () => {
        const req = new Request('http://localhost/api/jobs/:id', {
            method: 'GET',
            headers: { Authorization: 'Bearer faketoken' }
        })

        const res = await GET(req, { params: Promise.resolve({ id: '1' }) })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.job.company).toBe('Google')
    })

    test('PUT /api/jobs/:id', async () => {
        const req = new Request('http://localhost/api/jobs/:id', {
            method: 'PUT',
            headers: { 
                Authorization: 'Bearer faketoken',
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                company: 'Google',
                position: 'Engineer',
                status: 'offered',
                location: 'CA',
                salaryMin: '100000',
                salaryMax: '100000',
                notes: 'Updated'
            })
        })

        const res = await PUT(req, { params: Promise.resolve({ id: '1' }) })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.job.status).toBe('offered')
    })

    test('DELETE /api/jobs/:id', async () => {
        const req = new Request('http://localhost/api/jobs/:id', {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer faketoken'
            }
        })

        const res = await DELETE(req,  { params: Promise.resolve({ id: '1' }) })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.message).toBe('This job is deleted.')
    })
})