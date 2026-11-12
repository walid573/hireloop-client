"use client"

import React from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "cn"

type JobSearchBarProps = {
    value: string
    onChange?: (value: string) => void
    /** Submitted as a real form event (button click or Enter); the handler
     * decides what to do with the ?search=… value. */
    onSearch?: (event: React.FormEvent<HTMLFormElement>) => void
    className?: string
}

/** "Section - Search & Quick Filters" from the Figma Browse Jobs screen. */
export function JobSearchBar({ value, onChange, onSearch, className }: JobSearchBarProps) {
    return (
        <form
            onSubmit={onSearch}
            role="search"
            className={cn(
                "flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#141418] p-4 sm:flex-row sm:p-6",
                className
            )}
        >
            <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#8e9192]" />
                {/* Plain input: controlled value for instant typing; the named
                    field flows through FormData when the handler reads it. */}
                <Input
                    name="search"
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    placeholder="Search by job title, keywords..."
                    aria-label="Search jobs"
                    className="h-[59px] rounded-lg border-white/[0.07] bg-[#1a1a1f] pl-11 text-[13px] text-[#ededef] placeholder:text-[#a0a0ab] dark:bg-[#1a1a1f]"
                />
            </div>

            <button
                type="submit"
                className="h-[59px] shrink-0 rounded-lg bg-white px-6 text-sm font-semibold whitespace-nowrap text-[#2f3131] transition-colors hover:bg-[#f0f0f0]"
            >
                Search Jobs
            </button>
        </form>
    )
}
