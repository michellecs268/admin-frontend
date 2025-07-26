"use client"

import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  Users,
  Mountain,
  Trophy,
  MessageSquare,
  ChevronUp,
  LogOut,
  MapPin,
  Megaphone,
  BookOpen,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/dashboard",
  },
  {
    title: "User Management",
    icon: Users,
    url: "/dashboard/users",
  },
  {
    title: "Rock Database",
    icon: Mountain,
    url: "/dashboard/rocks",
  },
  {
    title: "Posts & Reports",
    icon: MessageSquare,
    url: "/dashboard/posts",
  },
  {
    title: "Quests",
    icon: Trophy,
    url: "/dashboard/quests",
  },
  {
    title: "Rock Distribution",
    icon: MapPin,
    url: "/dashboard/distribution",
  },
  {
    title: "Announcements",
    icon: Megaphone,
    url: "/dashboard/announcements",
  },
  {
    title: "Facts Management",
    icon: BookOpen,
    url: "/dashboard/facts",
  },
]

export function AdminSidebar() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <img src="/images/rockland-logo.png" alt="RockQuest Logo" className="h-10 w-10 object-contain" />
          <div>
            <h2 className="text-lg font-semibold font-press-start">RockQuest</h2>
            <p className="text-sm text-muted-foreground">Admin</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span>Admin User</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
