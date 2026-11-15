"use server";

import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import { auth, db } from "@/lib/auth";
import { protectedMutation } from "../core/server";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const INTERNAL_KEY = process.env.INTERNAL_API_KEY as string;

/** Admin-only guard shared by the user actions below. Throws so pages can
 * degrade via their try/catch. */
const requireAdmin = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user.role !== "admin") {
        throw new Error("Only admins can manage users.");
    }
};

/** Apply the role picked on the sign-up form. Runs once, right after
 * signUp — better-auth's admin plugin marks `role` input:false, so it can't
 * travel through signUp.email itself. Guarded to accounts that don't have a
 * real app role yet (the plugin defaults new accounts to its generic
 * "user"), so it can never be re-called to self-promote. */
export const setInitialRole = async (role: "seeker" | "recruiter" | "admin") => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return { error: "signin-required" as const, message: "Please sign in first." };
    }

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
    const APP_ROLES = ["seeker", "recruiter", "admin"];
    if (user?.role && APP_ROLES.includes(user.role)) {
        // Role already decided — never overwrite it here
        return { success: true };
    }

    await db.collection("user").updateOne(
        { _id: user?._id },
        { $set: { role } },
    );
    return { success: true };
};

/** List all accounts (admin only, better-auth admin plugin listUsers).
 * Normalized to the shape the users page maps into UserRow. */
export const getUsers = async (): Promise<
    Array<{ id: string; name: string; email: string; role?: string; createdAt: string; banned: boolean }>
> => {
    await requireAdmin();

    const result = await auth.api.listUsers({
        query: {
            sortBy: "name", // The field to sort by.
            sortDirection: "desc", // The direction to sort by.
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    const users = Array.isArray(result) ? result : result.users;
    return (users ?? []).map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        // New sign-ups have no role until setInitialRole runs
        role: user.role ?? undefined,
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : "",
        banned: Boolean(user.banned),
    }));
};

/** Change an account's role (admin only). The session check lives here on
 * the Next server; the backend route itself only accepts requests carrying
 * the shared internal key, so browsers can never call it directly. */
export const updateUserRole = async (userId: string, role: "seeker" | "recruiter" | "admin") => {
    await requireAdmin();

    // ── 2. Forward to the backend with the shared internal key ──────────
    const api = `${BaseUrl}/users/${userId}/role`
    const response = await protectedMutation(api,"PATCH",{role})

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
