import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        await connectDB()
        
        const { username, email, password } = await req.json()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({
                error: 'The user existed already.'
            }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        return NextResponse.json({
            message: 'The user successfully created!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            error: String(error)
        }, { status: 500 })
    }
}