import { headers } from "next/headers";
import { auth } from "../auth";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


export const getUsers = async()=>{
    const users = await auth.api.listUsers({
    query: {
        
        sortBy: "name", // The field to sort by.
        sortDirection: "desc", // The direction to sort by.
        
    },
    // This endpoint requires session cookies.
    headers: await headers(),
});
return users
}



export const getUserPremiumById = async (userId: string) => {
    const response = await fetch(`${BaseUrl}/users/${userId}/premium`)

    const raw = await response.text()
    try {
        return JSON.parse(raw) as { success: boolean; premium: boolean }
    } catch {
        // Non-JSON response (error page / backend down) — treat as not premium
        console.error(`getUserPremiumById failed (HTTP ${response.status})`)
        return { success: false, premium: false }
    }
}
