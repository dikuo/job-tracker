import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw Error("MONGODB_URI not defined in the .env.local")
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

async function connectDB() {

    console.log('Connecting to:', MONGODB_URI)
    if (cached.conn) { return cached.conn }

    if (!cached.promise) {
        cached.promise = mongoose
                        .connect(MONGODB_URI, {bufferCommands: false})
                        .then(m => m.connection);                                  
    }

    cached.conn = await cached.promise
    return cached.conn
}


export default connectDB