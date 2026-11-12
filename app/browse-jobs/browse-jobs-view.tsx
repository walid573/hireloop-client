"use client"

import React from "react"

import { JobCard } from "@/app/components/jobs/job-card"
import {
    JobFiltersSidebar,
    type FilterGroupData,
} from "@/app/components/jobs/job-filters-sidebar"
import { JobPagination } from "@/app/components/jobs/job-pagination"
import { JobSearchBar } from "@/app/components/jobs/job-search-bar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formatJobType } from "@/lib/job-format"
import type { JobRow, JobType } from "@/lib/job-types"
import { useRouter } from "next/navigation"

const SORT_OPTIONS = [
    { value: "most-recent", label: "Most Recent" },
    { value: "highest-salary", label: "Highest Salary" },
    { value: "nearest-deadline", label: "Nearest Deadline" },
] as const

const JOB_TYPES: JobType[] = ["full-time", "part-time", "contract", "internship"]

function buildFilterGroups(jobs: JobRow[]): FilterGroupData[] {
    // Categories present in the data (JobFormData.category), most common first.
    const categories = [...new Set(jobs.map((job) => job.category))]

    return [
        {
            id: "jobType",
            title: "Job Type",
            options: JOB_TYPES.map((jobType) => ({
                value: jobType,
                label: formatJobType(jobType),
                count: jobs.filter((job) => job.jobType === jobType).length,
            })),
        },
        {
            id: "category",
            title: "Job Category",
            options: categories.map((category) => ({
                value: category,
                label: category,
                count: jobs.filter((job) => job.category === category).length,
            })),
        },
    ]
}

/**
 * The interactive shell of the Figma "Public / Browse Jobs" screen.
 *
 * Search is wired to the URL (?search=…) through handleSearch; the filters
 * keep their own local state until their query is implemented.
 */
export function BrowseJobsView({ jobs }: { jobs: JobRow[] }) {
    const [search, setSearch] = React.useState("")
    const router = useRouter()
    // One chosen option per filter group (e.g. jobType → "full-time").
    const [selected, setSelected] = React.useState<Record<string, string>>({})
    const [sort, setSort] = React.useState<string>(SORT_OPTIONS[0].value)
    const [page, setPage] = React.useState(1)

    const filterGroups = buildFilterGroups(jobs)

    // One choice per filter group — the URL is also kept in sync so the
    // server page can re-filter the job list (?jobType=…&category=…).
    const handleSelect = (groupId: string, value: string | null) => {
        setSelected((prev) => {
            const next = { ...prev }
            if (value === null) delete next[groupId]
            else next[groupId] = value
            return next
        })

        // Toggle the one param for this group; keep everything else (?search= …).
        const params = new URLSearchParams(window.location.search)
        if (value === null) params.delete(groupId)
        else params.set(groupId, value)
        router.push(`/browse-jobs?${params.toString()}`)
    }

    
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const search = data.search as string;
        const params = new URLSearchParams();
        params.set("search", search);
        router.push(`/browse-jobs?${params.toString()}`);
    }

    // Filtering itself is not wired up yet, so the shell is always "page 1 of 7"
    // until then.
    const PAGE_COUNT = 7

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col">
            <JobSearchBar value={search} onChange={setSearch} onSearch={handleSearch} />

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
                <JobFiltersSidebar
                    groups={filterGroups}
                    selected={selected}
                    onSelect={handleSelect}
                    className="shrink-0 lg:w-[296px]"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Result count + sort */}
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="truncate text-[22px] font-semibold leading-7 text-[#ededef]">
                            Found {jobs.length} Professional Jobs
                        </h2>

                        <div className="flex shrink-0 items-center gap-3">
                            <span className="text-[13px] font-medium leading-5 text-[#6e6e78]">
                                Sort by:
                            </span>
                            <Select value={sort} onValueChange={(value) => setSort(String(value ?? ""))}>
                                <SelectTrigger
                                    className="h-9 min-w-[141px] rounded-lg border-white/10 bg-[#0c0c0f] px-3 text-[13px] font-medium text-[#ededef] dark:bg-[#0c0c0f]"
                                    aria-label="Sort jobs"
                                >
                                    <SelectValue>
                                        {SORT_OPTIONS.find((option) => option.value === sort)?.label}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border border-[#33333a] bg-[#1e1e21] text-[13px] text-[#ededef] dark:bg-[#1e1e21]">
                                    {SORT_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="text-[#a0a0ab] focus:text-[#ededef]"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Job cards */}
                    <div className="mt-6 grid gap-3">
                        {jobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                        {jobs.length === 0 && (
                            <p className="rounded-xl border border-white/[0.07] bg-[#141418] p-6 text-[13px] text-[#a0a0ab]">
                                No jobs match your search yet.
                            </p>
                        )}
                    </div>

                    <JobPagination
                        page={page}
                        pageCount={PAGE_COUNT}
                        onNavigate={setPage}
                        className="mt-6"
                    />
                </div>
            </div>
        </div>
    )
}
