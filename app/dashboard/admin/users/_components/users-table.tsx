"use client"

import { cn } from "@/lib/utils"
import { UserRoleSelect } from "@/app/components/users/user-role-select"
import type { UserRow } from "@/lib/types/users"

const headingClass = "px-3 py-3.5 text-xs font-medium tracking-wide text-white/50 uppercase"
const cellClass = "px-3 py-3.5"

/** ISO date → "Nov 13, 2026". Fixed en-US so SSR and client agree. */
const formatJoined = (createdAt: string) => {
    const date = new Date(createdAt)
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
}

/** The Figma users table: account info, per-row role toggles, ban status
 * and join date. Client-side so the role dropdowns update optimistically;
 * the admin-side role update is wired up later (see UserRoleSelect). */
export function UsersTable({ users }: { users: UserRow[] }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]/95 shadow-[inset_0_3px_10px_rgba(255,255,255,0.04)]">
            <div className="overflow-x-auto">
                <table className="table-fixed w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th scope="col" className={cn(headingClass, "px-5", "lg:w-[32%]")}>
                                User
                            </th>
                            <th scope="col" className={cn(headingClass, "lg:w-[18%]")}>
                                Role
                            </th>
                            <th scope="col" className={cn(headingClass, "lg:w-[14%]")}>
                                Status
                            </th>
                            <th scope="col" className={cn(headingClass, "px-5", "lg:w-[16%]")}>
                                Joined
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-sm text-white/50">
                                    No users yet — accounts appear here as people sign up.
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

                                {/* Role — toggleable dropdown (update logic to come) */}
                                <td className={cellClass}>
                                    <UserRoleSelect userId={user.id} role={user.role} />
                                </td>

                                {/* Status */}
                                <td className={cellClass}>
                                    {user.banned ? (
                                        <span className="inline-flex h-[22px] items-center whitespace-nowrap rounded border border-[#ef4444]/30 bg-[#ef4444]/14 px-2.5 text-xs font-medium text-[#ef4444]">
                                            Suspended
                                        </span>
                                    ) : (
                                        <span className="inline-flex h-[22px] items-center whitespace-nowrap rounded border border-[#22c55e]/30 bg-[#22c55e]/14 px-2.5 text-xs font-medium text-[#22c55e]">
                                            Active
                                        </span>
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
    )
}
