import type { ApplicationRow, NewApplicationData } from "@/lib/application-types";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function appyToJob(data: NewApplicationData){
    // POST /applications — the backend's route for submitting a job application.
    // The backend stores the body verbatim, so the action stamps the fields
    // the "My Applications" page needs (status lifecycle + apply date).
    const application: Omit<ApplicationRow, "_id"> = {
        ...data,
        status: "applied",
        appliedAt: new Date().toISOString(),
    };

    const response = await fetch(`${BaseUrl}/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(application)
    })
    return response.json()

}


export const getApplications = async (query = ""): Promise<ApplicationRow[]> => {
    const res = await fetch(`${BaseUrl}/applications?${query}`)
    return res.json()
}
export const getApplicationsCount = async (query = ""): Promise<{ count: number }> => {
    const res = await fetch(`${BaseUrl}/applications/count?${query}`)
    return res.json()
}
