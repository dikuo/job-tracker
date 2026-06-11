import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { authMiddleware } from "@/middleware/auth";

export async function GET(req: Request) {
    try {
        const user = authMiddleware(req)

        if (user instanceof NextResponse) {
            return user
        }

        await connectDB()

        const jobs = await Job.find({
            userId: (user as any).id
        }).sort({ createdAt: -1 })

        return NextResponse.json({ jobs })

    } catch (error) {
        return NextResponse.json(
            { error: String(error) }, 
            { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = authMiddleware(req)

        if (user instanceof NextResponse) {
            return user
        }

        await connectDB()

        const { company, position, status, location, salaryMin, salaryMax, notes, url } = await req.json()

        const job = await Job.create({
            company,
            position,
            status,
            location,
            salaryMin,
            salaryMax,
            notes,
            url,
            userId: (user as any).id
        })

        return NextResponse.json(
            {job},
            {status: 201}
        )
    }
    catch (error) {
        return NextResponse.json(
            {error: String(error)},
            {status: 500}
        )
    }
}