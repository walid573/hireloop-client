// Admin User Management — dashboard/admin/users, from the Figma
// "Admin / Manage Users": page header with role filter + export, a
// four-cell stats bento, and the users table with per-row role toggles.
//
// Data comes from better-auth's listUsers (admin session required). Role
// changes in the table are client-side for now — the admin-side DB
// update is wired up later.

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { getUsers } from "@/lib/api/users"
import { ROLE_META, type UserRow, type UserRole } from "@/lib/types/users"
import { UsersTable } from "./_components/users-table"

/** better-auth's role is a plain string — coerce to the known union. */
const toUserRole = (role: string | undefined): UserRole =>
    (role && role in ROLE_META ? role : "seeker") as UserRole

export default async function AdminUsersPage() {
    // listUsers is admin-only — non-admin sessions error, which we degrade
    // to an empty table instead of a crash.
    let rows: UserRow[] = []
    let loadError = false
    try {
        // listUsers returns the users array directly (admin plugin).
        const result = await getUsers()
        const users = Array.isArray(result) ? result : result.users

        rows = (users ?? []).map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: toUserRole(user.role),
            createdAt: new Date(user.createdAt).toISOString(),
            banned: Boolean(user.banned),
        }))
    } catch {
        loadError = true
    }

    // Stats bento — computed from the actual list, mirroring the Figma.
    const total = rows.length
    const active = rows.filter((user) => !user.banned)
    const recruiters = rows.filter((user) => user.role === "recruiter").length
    const suspended = rows.filter((user) => user.banned).length

    const dayAgo = new Date()
    dayAgo.setDate(dayAgo.getDate() - 1)

    const newSignups = rows.filter(
        (user) => new Date(user.createdAt).getTime() > dayAgo.getTime(),
    ).length

    const percent = (count: number) =>
        `${Math.round((count / Math.max(total, 1)) * 100)}% of total`

    const stats = [
        { label: "Total Active Users", value: String(active.length), note: `+${newSignups} in last 24h`, tone: "text-[#22C55E]" },
        { label: "Recruiter Growth", value: String(recruiters), note: percent(recruiters), tone: "text-[#22C55E]" },
        { label: "Suspended Accounts", value: String(suspended), note: percent(suspended), tone: "text-[#A0A0AB]" },
        { label: "New Signups (24h)", value: String(newSignups), note: "Steady activity", tone: "text-[#F59E0B]" },
    ]

    return (
        <PageContainer width="wide">
            <PageHeader
                title="User Management"
                subtitle="Review, filter, and manage platform access for all users."
            />

            {/* Stats bento */}
            <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {stats.map(({ label, value, note, tone }) => (
                    <div
                        key={label}
                        className="border border-white/10 bg-[#141418] px-6 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.35)] shadow-[inset_0_1px_rgba(255,255,255,0.035)]"
                    >
                        <dt className="text-[13px] text-[#A0A0AB]">{label}</dt>
                        <dd className="mt-2.5 text-[26px] font-semibold leading-8 text-[#EDEDEF]">
                            {value}
                        </dd>
                        <dd className={`mt-1.5 text-[13px] ${tone}`}>{note}</dd>
                    </div>
                ))}
            </dl>

            <div className="mt-6">
                {loadError && (
                    <p className="mb-4 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#ef4444]">
                        Users could not be loaded — sign in as an admin and try again.
                    </p>
                )}
                <UsersTable users={rows} />
            </div>
        </PageContainer>
    )
}
