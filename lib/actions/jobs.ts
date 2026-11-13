"use server";

import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth, db } from "@/lib/auth";
import type { NewJobData } from "@/lib/job-types";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const INTERNAL_KEY = process.env.INTERNAL_API_KEY as string;

// Free recruiters can post this many jobs; premium users are unlimited
const FREE_JOB_LIMIT = 5;

const createJob = async (data: NewJobData) => {
    // ── 1. Who is asking? ────────────────────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return { error: "signin-required" as const, message: "Please sign in to post a job." };
    }

    // ── 2. Did they pay? (premium is set by the payment verify route) ───
    const user = await db
        .collection("user")
        .findOne({
            $or: [
                { _id: session.user.id as unknown as ObjectId },
                // better-auth may store the id as string or ObjectId
                { _id: new ObjectId(session.user.id) },
            ],
        } as never)
        .catch(() => null);
    if (!user?.premium) {
        // Free plan: at most FREE_JOB_LIMIT posts per recruiter, then pay
        const posted = await db
            .collection("jobs")
            .countDocuments({ recruiterId: session.user.id });
        if (posted >= FREE_JOB_LIMIT) {
            return {
                error: "premium-required" as const,
                message: `You've used all ${FREE_JOB_LIMIT} free job posts. A one-time premium payment is required to post more.`,
            };
        }
    }

    // ── 3. Forward to the backend with the shared internal key ──────────
    const res = await fetch(`${BaseUrl}/jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-internal-key": INTERNAL_KEY,
        },
        body: JSON.stringify(data),
    });

    const raw = await res.text();
    if (!res.ok) {
        // Backend errors (e.g. 403 Unauthorized) — surface instead of
        // returning a body with no `error` field, which the form would
        // mistake for success.
        return { error: "server-error" as const, message: `Job service failed (HTTP ${res.status}).` };
    }
    try {
        return JSON.parse(raw);
    } catch {
        return { error: "server-error" as const, message: `Job service failed (HTTP ${res.status}).` };
    }
};

const getJobs = async () => {
    const res = await fetch(`${BaseUrl}/jobs`);
    return res.json();
};

const deleteJob = async (id: string) => {
    const res = await fetch(`${BaseUrl}/jobs/${id}`, {
        method: "DELETE",
    });
    return res.json();
};

export { createJob, getJobs, deleteJob };
