// ── Single source of truth for job-application types ───────────────
//
// WRITE shape (NewApplicationData) — the payload the seeker submits to
// POST /applications (lib/actions/applications).
//
// READ shape (ApplicationStatus/ApplicationRow) — the fields the "My
// Applications" page (dashboard/seeker/applications) displays.

export type ApplicationStatus =
    | "applied"
    | "review"
    | "shortlisted"
    | "rejected"
    | "offered"

/** Snapshot of the job at the moment the seeker applies. */
export interface NewApplicationData {
    jobId: string
    userId: string
    email: string
    jobTitle: string
    companyName: string
    jobType: string
    remote: boolean
}

/** A saved application: the submitted payload + what the recruiter-side
 * tracking adds (status, apply date). */
export type ApplicationRow = NewApplicationData & {
    _id: string
    status: ApplicationStatus
    /** When the seeker applied (ISO date; the UI renders it relatively). */
    appliedAt: string
}
