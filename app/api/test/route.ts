import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({
            message: "mongodb connected!"
        })
    } catch(error) {
        return NextResponse.json({
            message: "mongodb connection failed.",
            error: String(error)
        }, {status: 500})
    }
}