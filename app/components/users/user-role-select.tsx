"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { ROLE_META, USER_ROLES, type UserRole } from "@/lib/types/users"
import { updateUserRole } from "@/lib/actions/user"

type UserRoleSelectProps = {
    /** The user this select belongs to — passed to the update call. */
    userId: string
    /** Current role from the DB. */
    role: UserRole
}

/** Inline dropdown the admin uses to change an account's role.
 *
 * Updates optimistically: the new role shows immediately and reverts
 * if the persist call fails. */
export function UserRoleSelect({ userId, role }: UserRoleSelectProps) {
    const [current, setCurrent] = useState<UserRole>(role)
    const [saving, setSaving] = useState(false)

    const handleRoleChange = async (next: UserRole) => {
        if (next === current) return

        const previous = current
        setCurrent(next) // optimistic — show the choice right away
        setSaving(true)
        try {
            const response = await updateUserRole(userId, next)
            console.log(response)
            if (response?.error) {
                // Rejected (e.g. non-admin session) → roll the UI back
                setCurrent(previous)
                console.error("Role update failed:", response.message)
            }
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
                ROLE_META[current].chip
            )}
        >
            {USER_ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#141418] text-[#ededef]">
                    {ROLE_META[r].label}
                </option>
            ))}
        </select>
    )
}
