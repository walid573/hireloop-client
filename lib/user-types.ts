// ── Single source of truth for user (account) types ────────────────
//
// READ shape (UserRow) — the normalized user the "Admin / Users
// Management" page renders. Accounts created before roles existed have
// no `role` in the DB and are treated as seekers.

export type UserRole = "seeker" | "recruiter" | "admin"

export interface UserRow {
    id: string
    name: string
    email: string
    role: UserRole
    emailVerified: boolean
    /** One-time premium payment flag (set by the payment verify route). */
    premium: boolean
    /** Account creation date (ISO string; may be missing on legacy docs). */
    createdAt: string
}
