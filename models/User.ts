import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
} 

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "username is required."],
        unique: true,
        trim: true,
        minlength: [3, "username must have at least 3 characters."]
    },
    email: {
        type: String,
        required: [true, "email is required."],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "password is required."],
        minlength: [6, "password must have at least 6 characters."]
    }
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User