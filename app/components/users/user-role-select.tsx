"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import type { UserRole } from "@/lib/user-types"

/** Chip styles per role — purple for recruiters, amber for admins, neutral
 * for seekers (matches the dashboard chip language). */
const roleStyles: Record<UserRole, string> = {
    seeker: "bg-[#a1a4aa]/14 text-[#a0a0ab] border-white/10",
    recruiter: "bg-[#5C53FE]/15 text-[#8B85FF] border-[#5C53FE]/30",
    admin: "bg-[#f59e0b]/14 text-[#f59e0b] border-[#f59e0b]/30",
}

const roleLabels: Record<UserRole, string> = {
    seeker: "Seeker",
    recruiter: "Recruiter",
    admin: "Admin",
}

const USER_ROLES: UserRole[] = ["seeker", "recruiter", "admin"]

type UserRoleSelectProps = {
    /** The user this select belongs to — passed to the update call. */
    userId: string
    /** Current role from the DB. */
    role: UserRole
}

/** Inline dropdown the admin uses to change an account's role.
 *
 * Updates optimistically: the new role shows immediately and reverts
 * if the persist call fails. The DB write is intentionally left for
 * later — see the TODO in `handleRoleChange`. */
export function UserRoleSelect({ userId, role }: UserRoleSelectProps) {
    const [current, setCurrent] = useState<UserRole>(role)
    const [saving, setSaving] = useState(false)

    const handleRoleChange = async (next: UserRole) => {
        if (next === current) return

        const previous = current
        setCurrent(next) // optimistic — show the choice right away
        setSaving(true)
        try {
            // ── TODO: persist the role update to the DB here ────────────
            // e.g. await setUserRole(userId, next)
            // (userId is already in scope for the call)
        } catch {
            setCurrent(previous) // persist failed → roll the UI back
        } finally {
            setSaving(false)
        }
    }

    return (
        <select
            aria-label={`Change role for ${userId}`}
            value={current}
            disabled={saving}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            className={cn(
                "h-[26px] cursor-pointer rounded border px-2 text-xs font-medium capitalize outline-none",
                "disabled:cursor-wait disabled:opacity-60",
                roleStyles[current]
            )}
        >
            {USER_ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#141418] text-[#ededef]">
                    {roleLabels[r]}
                </option>
            ))}
        </select>
    )
}
