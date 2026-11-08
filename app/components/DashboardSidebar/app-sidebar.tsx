'use client'
import type { LucideIcon } from "lucide-react"
import {
  Bookmark,
  Briefcase,
  ChartColumn,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import Link from "next/link"

type Role = "seeker" | "recruiter" | "admin"

interface MenuItem {
  name: string
  url: string
  icon: LucideIcon
}

const menuItemByRole: Record<Role, MenuItem[]> = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { name: "Find Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
    { name: "My Applications", url: "/dashboard/seeker/applications", icon: ClipboardList },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
    { name: "Messages", url: "/dashboard/seeker/messages", icon: MessagesSquare },
    { name: "Profile", url: "/dashboard/seeker/profile", icon: UserRound },
  ],
  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { name: "Post a Job", url: "/dashboard/recruiter/jobs/new", icon: FilePlus2 },
    { name: "My Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
    { name: "Candidates", url: "/dashboard/recruiter/candidates", icon: UsersRound },
    { name: "Messages", url: "/dashboard/recruiter/messages", icon: MessagesSquare },
    { name: "Profile", url: "/dashboard/recruiter/profile", icon: UserRound },
  ],
  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Recruiters", url: "/dashboard/admin/recruiters", icon: ShieldCheck },
    { name: "Reports", url: "/dashboard/admin/reports", icon: ChartColumn },
    { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

export function AppSidebar() {
  const { data: session, isPending } = useSession()
  const role = (session?.user?.role || "seeker") as Role
  const items = menuItemByRole[role] ?? menuItemByRole.seeker
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton render={<Link href={item.url} />}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
