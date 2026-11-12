import { BrowseJobsView } from "@/app/browse-jobs/browse-jobs-view"
import { getJobs } from "@/lib/api/jobs"

export default async function BrowseJobsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const search = await searchParams
    const urlSearch = new URLSearchParams(search as Record<string, string>).toString()

    // GET /jobs?… — the backend filters `search` and `category` but ignores
    // other params, so anything it doesn't support is applied here for now.
    let jobs = await getJobs(urlSearch || undefined)
    if (typeof search.jobType === "string" && search.jobType) {
        const wanted = search.jobType.toLowerCase()
        jobs = jobs.filter((job) => job.jobType === wanted)
    }

    return (
        <main className="min-h-screen bg-[#08080a] py-6 antialiased">
            <BrowseJobsView jobs={jobs} />
        </main>
    )
}
