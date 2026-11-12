import { BookmarkIcon, BriefcaseIcon, BanknoteIcon } from "lucide-react"
import Link from "next/link"

import { JobChip } from "@/app/components/jobs/job-chip"
import { companyInitials, formatJobType, formatSalaryRange } from "@/lib/job-format"
import type { JobRow } from "@/lib/job-types"

/**
 * Job listing card from the Figma "Public / Browse Jobs" screen:
 * 64px logo tile, title + "Company • Location" line, salary/type chips
 * and a bookmark button on the right.
 */
export function JobCard({ job, className }: { job: JobRow; className?: string }) {
    return (
        <article
            className={`flex gap-5 rounded-xl border border-white/[0.07] bg-[#141418] p-6 ${className ?? ""}`}
        >
            {/* Company logo tile */}
            <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#222228]">
                <span className="text-sm font-semibold text-[#8e9192]">
                    {companyInitials(job.companyName)}
                </span>
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h3 className="truncate text-[22px] font-semibold leading-7 text-[#ededef]">
                            <Link
                                href={`/browse-jobs/${job._id}`}
                                className="transition-colors hover:text-white"
                            >
                                {job.title}
                            </Link>
                        </h3>
                        <p className="mt-2 truncate text-[16px] font-semibold leading-[27px] text-[#6e6e78]">
                            {job.companyName} • {job.location}
                        </p>
                    </div>

                    {/* Bookmark (handler intentionally empty — wired later) */}
                    <button
                        type="button"
                        aria-label={`Bookmark ${job.title}`}
                        onClick={() => {}}
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[#8e9192] transition-colors hover:text-[#ededef]"
                    >
                        <BookmarkIcon className="size-[18px]" />
                    </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <JobChip
                        icon={<BanknoteIcon className="size-4 text-[#e5e2e3]" />}
                    >
                        {formatSalaryRange(job.minSalary, job.maxSalary)}
                    </JobChip>
                    <JobChip
                        icon={<BriefcaseIcon className="size-3.5 text-[#e5e2e3]" />}
                    >
                        {formatJobType(job.jobType)}
                    </JobChip>
                </div>
            </div>
        </article>
    )
}
