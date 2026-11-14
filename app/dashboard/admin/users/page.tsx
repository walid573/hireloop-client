import { ShieldCheck } from "lucide-react"

import { UserRoleSelect } from "@/app/components/users/user-role-select"
import { getUsers } from "@/lib/api/users"
import type { UserRow, UserRole } from "@/lib/user-types"
import { cn } from "@/lib/utils"

const headingClass = "px-3 py-3.5 text-xs font-medium tracking-wide text-white/50 uppercase"
const cellClass = "px-3 py-3.5"

/** Raw user doc as better-auth returns it — the mongo adapter keeps extra
 * fields (role, premium) alongside the core profile. */
interface ApiUser {
    id?: string
    name?: string
    email?: string
    role?: string
    emailVerified?: boolean
    premium?: boolean
    createdAt?: string
}

/** listUsers returns a bare array; tolerate a `{ users }` wrapper just in case. */
const toRows = (raw: unknown): UserRow[] => {
    const wrapper = raw as ApiUser[] | { users?: ApiUser[] } | null
    const list = Array.isArray(wrapper) ? wrapper : wrapper?.users ?? []
    return list.map((user) => ({
        id: String(user.id ?? user.email ?? ""),
        name: user.name ?? "Unnamed",
        email: user.email ?? "—",
        // Accounts from before roles existed have no role → seeker fallback
        role: (user.role ?? "seeker") as UserRole,
        emailVerified: Boolean(user.emailVerified),
        premium: Boolean(user.premium),
        createdAt: user.createdAt ?? "",
    }))
}

/** ISO date → "Nov 13, 2026". Fixed en-US so SSR and client agree. */
const formatJoined = (createdAt: string) => {
    const date = new Date(createdAt)
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

export default async function AdminUsersPage() {
    // listUsers is admin-only (better-auth admin plugin) — non-admin sessions
    // get an error, which we degrade to an empty table instead of a crash.
    let users: UserRow[] = []
    let loadError = false
    try {
        users = toRows(await getUsers())
    } catch {
        loadError = true
    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <span className="text-white/50">Admin</span>
                <span aria-hidden className="text-white/30">/</span>
                <span className="text-white/90">Users Management</span>
            </nav>

            {/* Page heading */}
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <h1 className="font-heading text-[28px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
                        Users Management
                    </h1>
                    <p className="text-sm text-white/60">
                        {loadError
                            ? "Couldn't load users — sign in as an admin and try again."
                            : `${users.length} registered account${users.length === 1 ? "" : "s"} across all roles.`}
                    </p>
                </div>
            </header>

            {/* Users table */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]/95 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]">
                <div className="overflow-x-auto">
                    <table className="table-fixed w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th scope="col" className={cn(headingClass, "px-5", "lg:w-[30%]")}>
                                    User
                                </th>
                                <th scope="col" className={cn(headingClass, "lg:w-[16%]")}>
                                    Role
                                </th>
                                <th scope="col" className={cn(headingClass, "lg:w-[14%]")}>
                                    Premium
                                </th>
                                <th scope="col" className={cn(headingClass, "lg:w-[14%]")}>
                                    Verified
                                </th>
                                <th scope="col" className={cn(headingClass, "px-5", "lg:w-[16%]")}>
                                    Joined
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-white/50">
                                        {loadError
                                            ? "Users could not be loaded — the list is admin-only."
                                            : "No users yet — accounts appear here as people sign up."}
                                    </td>
                                </tr>
                            )}
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                                >
                                    {/* User */}
                                    <td className={cn(cellClass, "px-5")}>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-[#5C53FE]/15 text-sm font-semibold text-[#8B85FF] sm:flex"
                                                aria-hidden
                                            >
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate font-medium text-[#EDEDEF]">
                                                    {user.name}
                                                </span>
                                                <span className="truncate text-xs text-white/50">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role — dropdown toggle; update logic wired later */}
                                    <td className={cellClass}>
                                        <UserRoleSelect userId={user.id} role={user.role} />
                                    </td>

                                    {/* Premium */}
                                    <td className={cellClass}>
                                        {user.premium ? (
                                            <span className="inline-flex h-[22px] items-center whitespace-nowrap rounded border border-[#22c55e]/30 bg-[#22c55e]/14 px-2.5 text-xs font-medium text-[#22c55e]">
                                                Premium
                                            </span>
                                        ) : (
                                            <span className="text-white/40">—</span>
                                        )}
                                    </td>

                                    {/* Verified */}
                                    <td className={cellClass}>
                                        {user.emailVerified ? (
                                            <span className="flex items-center gap-1.5 text-white/80">
                                                <ShieldCheck aria-hidden className="size-4 text-[#22c55e]" />
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="text-white/40">No</span>
                                        )}
                                    </td>

                                    {/* Joined */}
                                    <td className={cn(cellClass, "px-5 whitespace-nowrap text-white/80")}>
                                        {formatJoined(user.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
