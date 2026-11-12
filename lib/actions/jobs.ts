import type { NewJobData } from "@/lib/job-types";

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

export const getJobs = async()=>{
    const res = await fetch(`${BaseUrl}/jobs`);
    return res.json()
}




export const deleteJob = async(id: string)=>{
    const res = await fetch(`${BaseUrl}/jobs/${id}`, {
        method: 'DELETE',})
    return res.json()
}