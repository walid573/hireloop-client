import type { JobRow } from "@/app/dashboard/recruiter/jobs/page";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * The DB stores the flat "Post a New Job" payload exactly as the form sends it
 * (company, remote, salaryMin…), while the table reads companyName, isRemote,
 * minSalary… Normalise here so both naming schemes always work.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeJob(raw: any): JobRow {
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

export const getJobs = async (): Promise<JobRow[]> => {
    const res = await fetch(`${BaseUrl}/jobs`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(normalizeJob);
}
