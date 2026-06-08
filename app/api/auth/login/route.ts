import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        await connectDB()
        const { email, password } = await req.json()

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({
                error: 'The user is not existed.'
            }, { status: 404 })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return NextResponse.json({
                error: 'Wrong password.'
            }, { status: 401})
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        )

        return NextResponse.json({
            message: 'You have successfully logged in.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        return NextResponse.json({
            error: String(error)
        }, { status: 500 })
    }
}