// ── Single source of truth for user (account) types ────────────────
//
// READ shape (UserRow) — the normalized user the "Admin / User
// Management" page renders. Accounts created before roles existed have
// no `role` in the DB and are coerced to seekers (see toUserRole users
// of ROLE_META).

export type UserRole = "seeker" | "recruiter" | "admin"

export interface UserRow {
    id: string
    name: string
    email: string
    role: UserRole
    createdAt: string
    /** better-auth admin-plugin ban flag — undefined means active. */
    banned: boolean
}

/** Display metadata per role — labels and chip classes shared by the
 * users table, the role select, and role coercion. */
export const ROLE_META: Record<UserRole, { label: string; chip: string }> = {
    seeker: { label: "Seeker", chip: "bg-[#a1a4aa]/14 text-[#a0a0ab] border-white/10" },
    recruiter: { label: "Recruiter", chip: "bg-[#5C53FE]/15 text-[#8B85FF] border-[#5C53FE]/30" },
    admin: { label: "Admin", chip: "bg-[#f59e0b]/14 text-[#f59e0b] border-[#f59e0b]/30" },
}

/** All roles in display order. */
export const USER_ROLES = Object.keys(ROLE_META) as UserRole[]
