"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const INTERNAL_KEY = process.env.INTERNAL_API_KEY as string;

/** Change an account's role (admin only). The session check lives here on
 * the Next server; the backend route itself only accepts requests carrying
 * the shared internal key, so browsers can never call it directly. */
export const updateUserRole = async (userId: string, role: "seeker" | "recruiter" | "admin") => {
    // ── 1. Who is asking? Only admins may change roles. ─────────────────
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") {
        return { error: "unauthorized" as const, message: "Only admins can change user roles." };
    }

    // ── 2. Forward to the backend with the shared internal key ──────────
    const response = await fetch(`${BaseUrl}/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "x-internal-key": INTERNAL_KEY,
        },
        body: JSON.stringify({ role }),
    })

    const raw = await response.text();
    if (!response.ok) {
        return { error: "server-error" as const, message: `User service failed (HTTP ${response.status}).` };
    }
    try {
        return JSON.parse(raw);
    } catch {
        return { error: "server-error" as const, message: `User service failed (HTTP ${response.status}).` };
    }
}
