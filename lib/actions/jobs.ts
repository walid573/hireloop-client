import { NewJobData } from "@/app/dashboard/recruiter/jobs/new/page";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const createJob = async(data: NewJobData)=>{
    const res = await fetch(`${BaseUrl}/jobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    return res.json()
}