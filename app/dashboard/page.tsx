"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, AlertTriangle } from "lucide-react"
import API from "@/lib/api"

export default function Dashboard() {
  const [counts, setCounts] = useState({ users: 0, posts: 0, reports: 0 })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken") // ensure token exists
    if (!token) {
      router.push("/login")
      return
    }

    async function fetchCounts() {
      try {
        const [userRes, postRes, reportRes] = await Promise.all([
          API.get("/admin/dashboard/users") as Promise<{ data: { totalUsers: number } }>,
          API.get("/admin/dashboard/posts") as Promise<{ data: { totalPosts: number } }>,
          API.get("/admin/dashboard/reports") as Promise<{ data: { totalReports: number } }>,
        ])
        setCounts({
          users: userRes.data.totalUsers,
          posts: postRes.data.totalPosts,
          reports: reportRes.data.totalReports,
        })
      } catch (error: any) {
        console.error("Error fetching dashboard stats:", error)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          localStorage.removeItem("adminToken") // clear expired or invalid token
          router.push("/login")
        }
      }
    }

    fetchCounts()
  }, [router])

  return (
    <div className="space-y-6" style={{ backgroundColor: "#E0DED3", minHeight: "100vh" }}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2 font-press-start">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your RockQuest admin panel</p>

        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counts.users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counts.posts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counts.reports}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
