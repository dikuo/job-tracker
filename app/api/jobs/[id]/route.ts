import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Job from "@/models/Job"
import { authMiddleware } from "@/middleware/auth"

export async function GET(
    req: Request,
    { params }: { params: { id: string}}
) {
    try {
        const user = authMiddleware(req)

        if (user instanceof NextResponse) {
            return user
        }

        await connectDB()

        const { id } = await params

        const job = await Job.findById(id)

        if (!job) {
            return NextResponse.json({ 
                error: 'This job is not existed.' 
            }, { status: 404 }
            )
        }

        if (job.userId.toString() !== (user as any).id) {
            return NextResponse.json({
                error: 'You don\'t have this job.'
            }, { status: 403 })
        }

        return NextResponse.json({ job })

    } catch (error) {
        return NextResponse.json({
            error: String(error)
        }, { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: {id: string}}
) {
    try {
        const user = authMiddleware(req)

        if (user instanceof NextResponse) {
            return user
        }

        await connectDB()
        
        const { company, position, status, location, salary, notes } = await req.json()
        
        const { id } = await params
        const job = await Job.findById(id)

        if (!job) {
            return NextResponse.json({
                error: 'This job is not existed.'
            }, { status: 404 })
        }

        if (job.userId.toString() !== (user as any).id) {
            return NextResponse.json({
                error: 'You don\'t have this job.'
            }, { status: 403 })
        }

        const updatedJob = await Job.findByIdAndUpdate(id, {
            $set: { company, position, status, location, salary, notes }
        }, { new: true, runValidators: true })

        return NextResponse.json({ job: updatedJob })

    } catch (error) {
        return NextResponse.json({
            error: String(error)
        }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: {id: string }}
) {

    try {
        const user = authMiddleware(req)
    
        if (user instanceof NextResponse) {
            return user
        }
    
        await connectDB()
    
        const { id } = await params
    
        const job = await Job.findById(id)
        if (!job) {
            return NextResponse.json({
                error: 'This job is not existed.'
            }, { status: 404 })
        }
    
        if (job.userId.toString() !== (user as any).id) {
            return NextResponse.json({
                error: 'You don\'t have this job.'
            }, { status: 403 })
        }
    
        await Job.findByIdAndDelete(id)
    
        return NextResponse.json({message: 'This job is deleted.'})
    } 
    catch (error) {
        return NextResponse.json({
            error: String(error)
        }, { status: 500 })
    }
}