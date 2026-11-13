import type { ApplicationStatus } from "@/lib/application-types"
import { cn } from "@/lib/utils"

/** Chip styles per status — from the Figma "Seeker / My Applications" screen.
 * Shared by the seeker's "My Applications" and the recruiter's per-job
 * applications table. */
const statusStyles: Record<ApplicationStatus, string> = {
    applied: "bg-[#a1a4aa]/14 text-[#a0a0ab] border-white/10",
    review: "bg-[#f59e0b]/14 text-[#f59e0b] border-[#f59e0b]/30",
    shortlisted: "bg-[#60a5fa]/14 text-[#60a5fa] border-[#60a5fa]/30",
    rejected: "bg-[#ef4444]/14 text-[#ef4444] border-[#ef4444]/30",
    offered: "bg-[#22c55e]/14 text-[#22c55e] border-[#22c55e]/30",
}

const statusLabels: Record<ApplicationStatus, string> = {
    applied: "Applied",
    review: "Review",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    offered: "Offered",
}

type ApplicationStatusChipProps = {
    status: ApplicationStatus
    className?: string
}

/** Colored pill showing where an application is in the review lifecycle. */
export function ApplicationStatusChip({ status, className }: ApplicationStatusChipProps) {
    return (
        <span
            className={cn(
                "inline-flex h-[22px] items-center whitespace-nowrap rounded border px-3 text-xs font-medium capitalize",
                statusStyles[status],
                className
            )}
        >
            {statusLabels[status]}
        </span>
    )
}
