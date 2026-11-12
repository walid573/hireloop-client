import type { JobRow } from "@/lib/job-types";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * The DB stores the flat "Post a New Job" payload exactly as the form sends it
 * (company, remote, salaryMin…), while the table reads companyName, isRemote,
 * minSalary… Normalise here so both naming schemes always work.
 *
 * Every field optional + both naming aliases listed — passing this to
 * normalizeJob replaces the former `any` with checked property access;
 * unknown DB extras fall through to the index signature and are ignored.
 */
interface ApiJob {
    _id?: string | number
    id?: string | number
    title?: string
    companyName?: string
    company?: string
    category?: string
    jobType?: string
    isRemote?: boolean
    remote?: boolean
    location?: string
    deadline?: string
    minSalary?: string
    maxSalary?: string
    salaryMin?: string
    salaryMax?: string
    salaryFrequency?: string
    responsibilities?: string
    requirements?: string
    status?: string
    applicants?: number | string
    posted?: string
    postedRelative?: string
    postedAt?: string
    [field: string]: unknown
}

function normalizeJob(raw: ApiJob): JobRow {
    const rawStatus = String(raw?.status ?? "active").toLowerCase();
    const status = (rawStatus === "closed" ? "expired" : rawStatus) as JobRow["status"];
    const jobType = String(raw?.jobType ?? "full-time").toLowerCase() as JobRow["jobType"];
    return {
        _id: String(raw?._id ?? raw?.id ?? raw?.title),
        title: raw?.title ?? "Untitled job",
        companyName: raw?.companyName ?? raw?.company ?? "—",
        category: raw?.category ?? "—",
        jobType,
        isRemote: raw?.isRemote ?? raw?.remote ?? false,
        location: raw?.location ?? "—",
        deadline: raw?.deadline ?? "",
        minSalary: raw?.minSalary ?? raw?.salaryMin ?? "",
        maxSalary: raw?.maxSalary ?? raw?.salaryMax ?? "",
        salaryFrequency: raw?.salaryFrequency ?? "",
        responsibilities: raw?.responsibilities ?? "",
        requirements: raw?.requirements ?? "",
        applicants: Number(raw?.applicants ?? 0),
        status,
        posted: raw?.posted ?? raw?.postedRelative ?? raw?.postedAt ?? "Recently posted",
    };
}

export const getJobs = async (query = ''): Promise<JobRow[]> => {
    const res = await fetch(`${BaseUrl}/jobs${query ? `?${query}` : ""}`);
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((item) => normalizeJob(item as ApiJob));
}

export const getJobById = async (id: string): Promise<JobRow> => {
    const res = await fetch(`${BaseUrl}/jobs/${id}`);
    return res.json()
}