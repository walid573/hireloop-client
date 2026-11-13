// ── Single source of truth for job types ───────────────────────────
//
// WRITE shape (NewJobData) — the flat payload the "Post a New Job" form
// (app/dashboard/recruiter/jobs/new) collects and createJob() stores.
//
// READ shape (JobFormData/JobRow) — the normalized shape the database
// API returns and the dashboards render (see lib/api/jobs normalizeJob;
// it maps write keys → read keys).

export interface NewJobData {
  title: string
  company: string
  companyId?: string
  recruiterId: string
  category: string
  jobType: string
  remote: boolean
  location: string
  deadline: string
  salaryMin: string
  salaryMax: string
  salaryFrequency: string
  responsibilities: string
  requirements: string
}

export type JobType = "full-time" | "part-time" | "contract" | "internship"

export type JobStatus = "active" | "expired"

export type JobFormData = {
  title: string
  companyName: string
  category: string
  jobType: JobType
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  salaryFrequency: string
  responsibilities: string
  requirements: string
}

export type JobRow = JobFormData & {
  _id: string
  /** Who posted the job (the recruiter's user id) — used for ownership checks. */
  recruiterId?: string
  applicants: number
  status: JobStatus
  /** Relativized post date, e.g. "Posted 4d ago". */
  posted: string
}
