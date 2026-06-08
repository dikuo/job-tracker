import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url)
        const q = searchParams.get('q')
        const location = searchParams.get('location')
        const page = searchParams.get('page') || '1'
        const url = `https://api.adzuna.com/v1/api/jobs/us/search/${page}?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&what=${q}&where=${location}&results_per_page=20&sort_by=date&sort_direction=down`
        const res = await fetch(url)
        const data = await res.json()
        return NextResponse.json({results: data.results, count: data.count})

    } catch (err) {
        console.error('Adzuna error:', err) 
        return NextResponse.json({error: 'Something went wrong.'})
    }
}