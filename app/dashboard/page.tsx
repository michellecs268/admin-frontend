"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Trophy,
  Mountain,
  MapPin,
  Megaphone,
  BookOpen
} from "lucide-react"
import API from "@/lib/api"

interface DashboardCounts {
  totalUsers: number
  totalPosts: number
  totalReports: number
  totalQuests: number
  totalRocks: number
  totalRockDistributions: number
  totalAnnouncements: number
  totalFacts: number
}

export default function Dashboard() {
  const [counts, setCounts] = useState<DashboardCounts>({
    totalUsers: 0,
    totalPosts: 0,
    totalReports: 0,
    totalQuests: 0,
    totalRocks: 0,
    totalRockDistributions: 0,
    totalAnnouncements: 0,
    totalFacts: 0
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/login")
      return
    }

    async function fetchCounts() {
      try {
        const res = await API.get<DashboardCounts>("/admin/dashboard")
        setCounts(res.data)
      } catch (error: any) {
        console.error("Error fetching dashboard stats:", error)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          localStorage.removeItem("adminToken")
          router.push("/login")
        }
      }
    }

    fetchCounts()
  }, [router])

  const cardData = [
    { title: "Total Users", value: counts.totalUsers, icon: Users, path: "/dashboard/users" },
    { title: "Total Posts", value: counts.totalPosts, icon: MessageSquare, path: "/dashboard/posts" },
    { title: "Pending Reports", value: counts.totalReports, icon: AlertTriangle, path: "/dashboard/reports" },
    { title: "Total Quests", value: counts.totalQuests, icon: Trophy, path: "/dashboard/quests" },
    { title: "Total Rocks", value: counts.totalRocks, icon: Mountain, path: "/dashboard/rocks" },
    { title: "Rock Distributions", value: counts.totalRockDistributions, icon: MapPin, path: "/dashboard/distribution" },
    { title: "Announcements", value: counts.totalAnnouncements, icon: Megaphone, path: "/dashboard/announcements" },
    { title: "Facts", value: counts.totalFacts, icon: BookOpen, path: "/dashboard/facts" },
  ]

  return (
    <div className="space-y-6" style={{ backgroundColor: "#E0DED3", minHeight: "100vh" }}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2 font-press-start">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your RockQuest admin panel</p>

        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {cardData.map((item, idx) => (
            <Card
              key={idx}
              onClick={() => router.push(item.path)}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
