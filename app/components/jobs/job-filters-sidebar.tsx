"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "cn"

export type FilterOption = {
    /** Stable value the filter is keyed by, e.g. the raw jobType. */
    value: string
    /** Label can differ from the value; it is shown capitalized like the Figma. */
    label: string
    count?: number
}

export type FilterGroupData = {
    id: string
    title: string
    options: FilterOption[]
}

type JobFiltersSidebarProps = {
    title?: string
    groups: FilterGroupData[]
    /** The single chosen option value per group id (one choice at a time). */
    selected?: Record<string, string>
    /** Selecting replaces the previous choice; selecting it again clears it.
     * The owner (BrowseJobsView) decides what applying it means — local state
     * and/or a URL update. */
    onSelect?: (groupId: string, value: string | null) => void
    className?: string
}

/** "Aside - Sidebar Filters" card from the Figma Browse Jobs screen. */
export function JobFiltersSidebar({
    title = "Filters",
    groups,
    selected = {},
    onSelect,
    className,
}: JobFiltersSidebarProps) {
    return (
        <aside
            className={cn("rounded-xl border border-white/[0.07] bg-[#141418] p-6", className)}
        >
            <h2 className="text-[22px] font-semibold leading-7 text-[#ededef]">{title}</h2>

            {groups.map((group) => (
                <section key={group.id} className="mt-6 first:mt-0">
                    <h3 className="text-[16px] font-semibold leading-[27px] text-[#ededef]">
                        {group.title}
                    </h3>

                    <div className="mt-6 grid gap-1">
                        {group.options.map((option) => {
                            const checked = selected[group.id] === option.value
                            return (
                                <label
                                    key={option.value}
                                    className="flex min-h-7 cursor-pointer items-center gap-3"
                                >
                                    <Checkbox
                                        checked={checked}
                                        onCheckedChange={(next) =>
                                            onSelect?.(group.id, next ? option.value : null)
                                        }
                                    />
                                    <span className="text-[13px] font-medium leading-5 text-[#a0a0ab]">
                                        {option.label}
                                    </span>
                                    {option.count !== undefined && (
                                        <span className="ml-auto text-xs leading-5 text-[#6e6e78]">
                                            {option.count}
                                        </span>
                                    )}
                                </label>
                            )
                        })}
                    </div>
                </section>
            ))}
        </aside>
    )
}
