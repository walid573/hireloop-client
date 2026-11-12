import { notFound } from "next/navigation"

import { JobDetails } from "@/app/components/jobs/job-details"
import { getJobs } from "@/lib/api/jobs"

/**
 * Job details for /browse-jobs/[id]. The backend has no single-job endpoint,
 * so reuse the /jobs list and pick the one entry.
 */
export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const jobs = await getJobs()
    const job = jobs.find((item) => item._id === id)

    if (!job) notFound()

    return (
        <main className="min-h-screen bg-[#08080a] py-6 antialiased">
            <div className="mx-auto w-full max-w-7xl px-4">
                <JobDetails job={job} />
            </div>
        </main>
    )
}
