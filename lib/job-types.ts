type JobStatus = "Active" | "Expired" | "Closed"

// What the "Post a Job" form collects (see dashboard/recruiter/jobs/new)
export interface NewJobData {
  title: string
  company: string
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

// A row on the "Manage Job Posts" table = collected data + recruiter-side tracking fields
export interface JobRow extends NewJobData {
  _id: number
  status: JobStatus
  applicants: number
  postedAt: string
  postedRelative: string
}
