import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: "#E0DED3", minHeight: "100vh" }}>
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1">
          <DashboardHeader />
          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  )
}
