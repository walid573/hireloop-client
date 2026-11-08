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


const menuItemByRole: Record<string, string[]> = {
  recruiter:[] ,
  seeker: [] ,
  admin: [] 
}



export function AppSidebar() {
  const {data:session, isPending} = useSession()
  const role = session?.user?.role || 'seeker';
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup >
          <SidebarMenu>
            {
            // menuItemByRole[role].map((item) => (
            //   <SidebarMenuItem key={item.name}>
            //     <SidebarMenuButton render={<a href={item.url} />}>
            //       <item.icon/>
            //       <span>{item.name}</span>
            //     </SidebarMenuButton>
            //   </SidebarMenuItem>
            // ))
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}