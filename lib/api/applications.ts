'use server'
import type { ApplicationRow, NewApplicationData } from "@/lib/application-types";
import { authFetch, protectedMutation } from "../core/server";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function appyToJob(data: NewApplicationData){
    
    const application: Omit<ApplicationRow, "_id"> = {
        ...data,
        status: "applied",
        appliedAt: new Date().toISOString(),
    };
    const api = `${BaseUrl}/applications`
    const res = await protectedMutation(api,"POST",data)
   
    return res.json()

}


export const getApplications = async (query = ""): Promise<ApplicationRow[]> => {
    const api = `${BaseUrl}/applications?${query}`
    const res = await authFetch(api)
    return res.json()
}
export const getApplicationsCount = async (query = ""): Promise<{ count: number }> => {
    const res = await fetch(`${BaseUrl}/applications/count?${query}`)
    return res.json()
}
