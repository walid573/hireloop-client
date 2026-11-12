import type { ReactNode } from "react"
import { cn } from "cn"

/** Chip variants pulled from the Figma Browse Jobs cards. */
const chipVariants = {
    default: "border-white/10 bg-[#1a1a1f] text-[#ededef]",
    success: "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
    warning: "border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]",
} as const

type JobChipProps = {
    variant?: keyof typeof chipVariants
    /** Leading icon element; style its color via className as in the Figma chips. */
    icon?: ReactNode
    className?: string
    children: ReactNode
}

export function JobChip({ variant = "default", icon, className, children }: JobChipProps) {
    return (
        <span
            className={cn(
                "inline-flex h-7 items-center gap-2 rounded border px-3 text-[13px] font-medium leading-5 whitespace-nowrap",
                chipVariants[variant],
                className
            )}
        >
            {icon}
            {children}
        </span>
    )
}
