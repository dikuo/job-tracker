import { JobStatus } from '@/models/Job';

export default interface Job {
  _id: string;
  company: string;
  position: string;
  status: JobStatus;
  userId: string;
  notes: string[];
  location: string[];
  salaryMin?: number;
  salaryMax?: number;
  url?: string;
  createdAt: string;
  updatedAt: string;
}