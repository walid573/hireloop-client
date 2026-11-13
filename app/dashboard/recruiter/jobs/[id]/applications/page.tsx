import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Users } from "lucide-react"

import { ApplicationStatusChip } from "@/app/components/applications/application-status-chip"
import { getApplications } from "@/lib/actions/applications"
import { getJobById } from "@/lib/api/jobs"
import { getSession } from "@/lib/core/server"
import type { ApplicationRow, ApplicationStatus } from "@/lib/application-types"
import { cn } from "@/lib/utils"

const headingClass = "px-3 py-3.5 text-xs font-medium tracking-wide text-white/50 uppercase"
const cellClass = "px-3 py-3.5"

/** "2026-11-13T…Z" → "Nov 13, 2026". Fixed en-US so SSR and client agree. */
const formatAppliedDate = (appliedAt: string) => {
    const date = new Date(appliedAt)
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

const workMode = (application: ApplicationRow) => (application.remote ? "Remote" : "On-site")

/** DB docs from before the status lifecycle may lack `status` — treat as applied. */
const toRow = (application: ApplicationRow): ApplicationRow => ({
    ...application,
    status: (application.status ?? "applied") as ApplicationStatus,
})

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [session, job] = await Promise.all([getSession(), getJobById(id)])
    if (!job) notFound()
    // Only the recruiter who owns this job may see its applicants.
    if (job.recruiterId && job.recruiterId !== session?.user.id) notFound()

    const raw = await getApplications(`jobId=${id}`)
    const applications = (Array.isArray(raw) ? raw : []).map(toRow)

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <Link href="/dashboard/recruiter/jobs" className="text-white/50 transition-colors hover:text-white/80">
                    Manage Jobs
                </Link>
                <span aria-hidden className="text-white/30">/</span>
                <Link href="/dashboard/recruiter/jobs" className="text-white/50 transition-colors hover:text-white/80">
                    Job Listings &amp; Postings
                </Link>
                <span aria-hidden className="text-white/30">/</span>
                <span className="text-white/90">Applications</span>
            </nav>

            {/* Page heading */}
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        Applications — {job.title}
                    </h1>
                    <p className="text-sm text-white/60">
                        {job.companyName} · {applications.length} applicant
                        {applications.length === 1 ? "" : "s"}
                    </p>
                </div>
                <Link
                    href="/dashboard/recruiter/jobs"
                    className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/25 hover:text-white"
                >
                    <ArrowLeft aria-hidden className="size-4" />
                    Back to jobs
                </Link>
            </header>

            {/* Applications table */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]/95 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]">
                <div className="overflow-x-auto">
                    <table className="table-fixed w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th scope="col" className={cn(headingClass, "px-5")}>
                                    Applicant
                                </th>
                                <th scope="col" className={headingClass}>
                                    Type &amp; mode
                                </th>
                                <th scope="col" className={headingClass}>
                                    Applied on
                                </th>
                                <th scope="col" className={cn(headingClass, "px-5")}>
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-white/50">
                                        No applications yet — applicants will appear here as soon as
                                        seekers apply to this job.
                                    </td>
                                </tr>
                            )}
                            {applications.map((application) => (
                                <tr
                                    key={application._id}
                                    className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                                >
                                    {/* Applicant */}
                                    <td className={cn(cellClass, "px-5")}>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-sm font-semibold text-[#8B85FF] sm:flex"
                                                aria-hidden
                                            >
                                                <Users className="size-4" />
                                            </span>
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate font-medium text-[#EDEDEF]">
                                                    {application.email}
                                                </span>
                                                <span className="truncate text-xs text-white/50">
                                                    {formatAppliedDate(application.appliedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Type & mode */}
                                    <td className={cellClass}>
                                        <span className="capitalize text-white/80">
                                            {application.jobType}
                                        </span>
                                        <span className="block text-xs text-white/50">
                                            {workMode(application)}
                                        </span>
                                    </td>

                                    {/* Applied on */}
                                    <td className={cn(cellClass, "whitespace-nowrap text-white/80")}>
                                        {formatAppliedDate(application.appliedAt)}
                                    </td>

                                    {/* Status — updates come later (recruiter actions) */}
                                    <td className={cn(cellClass, "px-5")}>
                                        <ApplicationStatusChip status={application.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
