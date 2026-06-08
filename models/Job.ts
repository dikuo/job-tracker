import mongoose, { Document, Schema } from "mongoose";

export enum JobStatus {
    APPLIED = 'applied',
    INTERVIEWED = 'interviewed',
    OFFERED = 'offered',
    REJECTED = 'rejected',
    IN_PROGRESS = 'in_progress'
}

export interface IJob extends Document {
    company: string,
    position: string,
    status: JobStatus,
    userId: mongoose.Types.ObjectId,
    notes: string[],
    location: string[],
    salary?: number,
    url?: string,
    createdAt: Date,
    updatedAt: Date
}

const jobSchema = new Schema<IJob>({
    company: {
        type: String,
        required: [true, "company is required."]
    },
    position: {
        type: String,
        required: [true, "position is required."]
    },
    status: {
        type: String,
        enum: Object.values(JobStatus),
        default: JobStatus.APPLIED
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: {
        type: [String],
        default: []
    },
    location: {
        type: [String],
        default: []
    },
    salary: {
        type: Number,
    },
    url: {
        type: String,
        default: ''
    }
}, { timestamps: true })

const Job = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema)

export default Job