'use client'
import {
    BadgeCheckIcon,
    BanknoteIcon,
    BookmarkIcon,
    BriefcaseIcon,
    MapPinIcon,
} from "lucide-react"

import { companyInitials, formatJobType, formatSalaryRange, toBulletItems } from "@/lib/job-format"
import type { JobRow } from "@/lib/job-types"
import { cn } from "cn"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { appyToJob, getApplicationsCount } from "@/lib/actions/applications"
import { toast } from "@/components/ui/toast"
import { getUserPremiumById } from "@/lib/api/users"

/** Card style shared by every block of the Figma Job Details screen. */
const card = "rounded-xl border border-white/[0.07] bg-[#141418]"

/**
 * The Figma "Public / Job Details" screen: header, salary/location/type
 * tiles, description + requirements sections and a company sidebar.
 * Static presentation — none of the actions are wired up yet.
 */
export function JobDetails({ job }: { job: JobRow }) {
    const requirements = toBulletItems(job.requirements)
    const {data:session} = useSession()
     const router = useRouter()
    const user = session?.user
   
    const handleApplyNow = async() => {
        if(!user){
            router.push(`/signin?redirect=/browse-jobs/${job._id}`)
            return
        }
        else if(user.role === 'seeker'){

            const countResult = await getApplicationsCount(`applicantId=${user.id}`);

            const premiumResult = await getUserPremiumById(user.id)

            // Free users can apply to at most 2 jobs; premium is unlimited
            if(!premiumResult.premium && countResult.count >= 2) {
                router.push(`/payment`)
                return
            }
            else{
                 const application = {
                jobId: job._id,
                userId: user.id,
                email: user.email,
                jobTitle: job.title,
                companyName: job.companyName,
                jobType: job.jobType,
                remote: job.isRemote,
            }
            const result = await appyToJob(application)
            if(result.insertedId){
                console.log('Application done');
                router.push(`/browse-jobs`)
                toast.add({
                    title:'Application Submitted',
                    description:'Your application have been submitted successfully'
                })
            }
            }


           
        }   
        else{
            console.log('Only job seekers can apply to jobs');
        }

    }
    return (
        <div className="flex flex-col gap-6">
            {/* ── Header ─────────────────────────────────────────────── */}
            <header className={cn(card, "relative overflow-hidden p-8")}>
                {/* Soft glow in the top-right corner, as in the Figma */}
                <div className="pointer-events-none absolute -top-32 right-16 size-56 rounded-full bg-white/5 blur-2xl" />

                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        {/* Company logo tile */}
                        <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#1a1a1f]">
                            <span className="text-lg font-semibold text-[#8e9192]">
                                {companyInitials(job.companyName)}
                            </span>
                        </div>

                        <div>
                            <h1 className="text-[32px] font-semibold leading-10 text-[#ededef]">
                                {job.title}
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-2.5">
                                <span className="text-[22px] font-semibold text-[#a0a0ab]">
                                    {job.companyName}
                                </span>
                                <span className="size-1 rounded-full bg-[#8e9192]" />
                                <span className="flex items-center gap-2 text-base font-semibold text-[#22c55e]">
                                    <BadgeCheckIcon className="size-4" />
                                    Verified Employer
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            
                            type="button"
                            aria-label={`Bookmark ${job.title}`}
                            className="flex size-12 items-center justify-center rounded-lg border border-white/[0.07] bg-[#222228] text-[#e5e2e3] transition-colors hover:text-white"
                        >
                            <BookmarkIcon className="size-[18px]" />
                        </button>
                        <button
                        onClick={handleApplyNow}
                            type="button"
                            className="h-12 rounded-lg bg-[#fafafa] px-4 text-base font-medium text-[#0b0b0c] transition-colors hover:bg-white"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[1fr_397px]">
                {/* ── Main content column ────────────────────────────── */}
                <div className="flex min-w-0 flex-col gap-6">
                    {/* Salary / location / type tiles */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <InfoTile
                            icon={<BanknoteIcon className="size-5 text-[#c4c7c8]" />}
                            label="Salary Range"
                            value={formatSalaryRange(job.minSalary, job.maxSalary)}
                        />
                        <InfoTile
                            icon={<MapPinIcon className="size-5 text-[#c4c7c8]" />}
                            label="Location"
                            value={job.location}
                        />
                        <InfoTile
                            icon={<BriefcaseIcon className="size-5 text-[#c4c7c8]" />}
                            label="Job Type"
                            value={formatJobType(job.jobType)}
                        />
                    </div>

                    {/* Description + requirements, separated by hairlines */}
                    <section className={card}>
                        <Section title="Job Description">
                            <p className="whitespace-pre-line text-[13px] leading-5 text-[#a0a0ab]">
                                {job.responsibilities}
                            </p>
                        </Section>

                        {requirements.length > 0 && (
                            <Section title="Requirements" divider>
                                <ul className="flex flex-col gap-3">
                                    {requirements.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-6 text-[13px] leading-5 text-[#a0a0ab]"
                                        >
                                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}
                    </section>
                </div>

                {/* ── Company overview sidebar ───────────────────────── */}
                <aside className={cn(card, "h-fit p-6")}>
                    <h2 className="text-[22px] font-semibold leading-7 text-[#ededef]">
                        Company Overview
                    </h2>

                    {/* Gradient stand-in for the Figma company photo */}
                    <div className="mt-6 flex h-[204px] items-center justify-center rounded-xl bg-gradient-to-br from-[#2b2b33] to-[#151519]">
                        <span className="text-4xl font-semibold text-[#8e9192]">
                            {companyInitials(job.companyName)}
                        </span>
                    </div>

                    <dl className="mt-6">
                        <DataRow label="Company" value={job.companyName} />
                        <DataRow label="Applicants" value={`${job.applicants} Candidates`} />
                    </dl>

                    <button
                        type="button"
                        className="mt-6 h-11 w-full rounded-[10px] border border-white/10 bg-white/5 text-[13px] font-medium text-[#ededef] transition-colors hover:bg-white/10"
                    >
                        Visit Website
                    </button>
                </aside>
            </div>
        </div>
    )
}

/** One tile of the "Bento Info Grid": icon, small label, bold value. */
function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className={cn(card, "p-6")}>
            {icon}
            <p className="mt-4 text-[13px] font-medium uppercase leading-5 text-[#a0a0ab]">{label}</p>
            <p className="mt-1 truncate text-base font-semibold leading-[27px] text-[#ededef]">{value}</p>
        </div>
    )
}

/** One content section inside the big card, optional hairline on top. */
function Section({ title, divider, children }: { title: string; divider?: boolean; children: React.ReactNode }) {
    return (
        <div className={cn("px-8 py-8", divider && "border-t border-white/[0.07]")}>
            <h2 className="text-[22px] font-semibold leading-7 text-[#ededef]">{title}</h2>
            <div className="mt-6">{children}</div>
        </div>
    )
}

/** One label/value row of the company sidebar. */
function DataRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-t border-white/[0.07] py-3.5 first:border-t-0">
            <div className="flex items-center justify-between gap-4">
                <dt className="text-[13px] leading-5 text-[#a0a0ab] uppercase">{label}</dt>
                <dd className="truncate text-base leading-6 text-[#ededef]">{value}</dd>
            </div>
        </div>
    )
}
