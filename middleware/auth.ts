import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request) {
    try {
        const authHeader = req.headers.get('authorization')
    
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                error: 'No token provided.'
            }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        )

        return decoded
        
    } catch (error) {
        return NextResponse.json({
            error: 'Invalid token.'
        }, { status: 401 })
    }
    
}