"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/lib/application-types"

import {
    APPLICATION_STATUSES,
    statusLabels,
    statusStyles,
} from "./application-status-chip"
import { updateApplicationStatus } from "@/lib/actions/applications"

type ApplicationStatusSelectProps = {
    /** The application this select belongs to — passed to the update call. */
    applicationId: string
    /** Current status from the DB. */
    status: ApplicationStatus
}

/** Inline dropdown the recruiter uses to move an application through the
 * review lifecycle (Applied → Review → Shortlisted/Rejected → Offered).
 *
 * Updates optimistically: the new status shows immediately and reverts
 * if the persist call fails. */
export function ApplicationStatusSelect({ applicationId, status }: ApplicationStatusSelectProps) {
    const [current, setCurrent] = useState<ApplicationStatus>(status)
    const [saving, setSaving] = useState(false)

    const handleStatusChange = async (next: ApplicationStatus) => {
        if (next === current) return

        const previous = current
        setCurrent(next) // optimistic — show the choice right away
        setSaving(true)
        try {
            const result = await updateApplicationStatus(applicationId, { status: next })
            console.log('update result', result)
        } catch {
            setCurrent(previous) // persist failed → roll the UI back
        } finally {
            setSaving(false)
        }
    }

    return (
        <select
            aria-label="Update application status"
            value={current}
            disabled={saving}
            onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
            className={cn(
                "h-[22px] cursor-pointer rounded border px-2 text-xs font-medium capitalize outline-none",
                "disabled:cursor-wait disabled:opacity-60",
                statusStyles[current]
            )}
        >
            {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#141418] text-[#ededef]">
                    {statusLabels[s]}
                </option>
            ))}
        </select>
    )
}
