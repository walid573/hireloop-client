
import React from "react"
import { FileDownIcon } from "lucide-react"

import { ApplicationStatusChip } from "@/app/components/applications/application-status-chip"
import { JobPagination } from "@/app/components/jobs/job-pagination"
import { formatJobType } from "@/lib/job-format"
import type { ApplicationRow } from "@/lib/application-types"
import { cn } from "cn"
import { getApplications } from "@/lib/api/applications"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

/** Dummy placeholder — real data is loaded from the backend later. */

const card = "rounded-xl border border-white/[0.07] bg-[#141418]"
const headCell = "px-4 py-3 text-left text-xs text-[#6e6e78] font-medium"
const workMode = (application: ApplicationRow) => (application.remote ? "Remote" : "On-site")

export default async function MyApplicationsPage() {    
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    const applications = await getApplications(`applicantId=${session?.user?.id}`);
    return (

        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-8 pb-8 pt-6">
            {/* ── Header: title + tabs + export ──────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-[22px] font-semibold leading-7 text-[#ededef]">
                        My Applications
                    </h1>
                    <p className="mt-2 text-[13px] leading-5 text-[#ededef]">
                        Track your job applications and interview progress in real-time.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Tab switcher (visual only — wired later) */}
                    <div className="flex h-[42px] items-center rounded-lg border border-white/[0.07] bg-[#1a1a1f] p-[5px]">
                        <button
                            type="button"
                            className="h-8 rounded-lg border border-white/10 bg-[#1a1a1f] px-4 text-[13px] leading-5 text-[#ededef]"
                        >
                            Active
                        </button>
                        <button
                            type="button"
                            className="h-8 rounded-lg px-4 text-[13px] leading-5 text-[#a0a0ab]"
                        >
                            Archived
                        </button>
                    </div>

                    <button
                        type="button"
                        className="flex h-[42px] items-center gap-3 rounded-lg bg-[#fafafa] px-4 text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-white"
                    >
                        <FileDownIcon className="size-3 text-[#2f3131]" />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* ── Stats overview bento ───────────────────────────────── */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile label="Total Applied" value="24" />
                <StatTile label="Shortlisted" value="8" />
                <StatTile label="Interviews" value="3" valueClass="text-[#f59e0b]" />
                <StatTile label="Success Rate" value="12%" valueClass="text-[#22c55e]" />
            </div>

            {/* ── Applications table ─────────────────────────────────── */}
            <section className={cn(card, "overflow-hidden")}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-[#1a1a1f]">
                                <th scope="col" className={cn(headCell, "w-[30%]")}>Job Title</th>
                                <th scope="col" className={cn(headCell, "w-[20%]")}>Company</th>
                                <th scope="col" className={cn(headCell, "w-[15%]")}>Applied</th>
                                <th scope="col" className={cn(headCell, "w-[18%]")}>Status</th>
                                <th scope="col" className={cn(headCell, "w-[17%] text-right")}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr
                                    key={application._id}
                                    className="border-t border-white/[0.07] transition-colors hover:bg-white/[0.02]"
                                >
                                    {/* Job title + type • mode */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded border border-white/[0.07] bg-[#222228]">
                                                <span className="text-[11px] font-semibold text-[#a0a0ab]">
                                                    {application.companyName.slice(0, 1)}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-[13px] font-medium leading-5 text-[#ededef]">
                                                    {application.jobTitle}
                                                </p>
                                                <p className="text-xs leading-[17px] text-[#a0a0ab]">
                                                    {formatJobType(application.jobType)} • {workMode(application)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-[13px] leading-5 text-[#ededef]">
                                        {application.companyName}
                                    </td>
                                    <td className="p-4 text-[13px] leading-5 text-[#a0a0ab]">
                                        {application.appliedAt}
                                    </td>
                                    <td className="p-4">
                                        <ApplicationStatusChip status={application.status} />
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button
                                            type="button"
                                            className="text-[13px] leading-5 text-[#ededef] transition-colors hover:text-white"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer (visual only) */}
                <div className="flex items-center justify-between border-t border-white/[0.07] bg-[#1a1a1f] px-6 py-4">
                    <p className="text-[13px] leading-5 text-[#a0a0ab]">
                        Showing 1-5 of 24 applications
                    </p>
                    <JobPagination page={1} pageCount={3} />
                </div>
            </section>
        </div>
    )
}

/** One tile of the stats overview bento. */
function StatTile({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
    return (
        <div className={cn(card, "px-6 py-3.5")}>
            <p className="text-[13px] leading-5 text-[#a0a0ab]">{label}</p>
            <p className={cn("mt-2 text-[26px] font-semibold leading-8 text-[#ededef]", valueClass)}>
                {value}
            </p>
        </div>
    )
}
