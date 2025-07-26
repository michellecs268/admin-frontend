"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react"

const pendingPosts = [
  {
    id: "POST001",
    user: "Alex Johnson",
    userRole: "Player",
    rockType: "Granite",
    location: "Rocky Mountains, CO",
    confidence: 0.87,
    timestamp: "2024-01-15 14:30",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "POST002",
    user: "Mike Wilson",
    userRole: "Player",
    rockType: "Limestone",
    location: "Grand Canyon, AZ",
    confidence: 0.92,
    timestamp: "2024-01-15 13:45",
    image: "/placeholder.svg?height=100&width=100",
  },
]

const reports = [
  {
    id: "REP001",
    reportedBy: "Dr. Sarah Chen",
    reporterRole: "Geologist",
    postId: "POST003",
    originalUser: "Tom Brown",
    issue: "Incorrect rock identification",
    description: "This appears to be schist, not granite as labeled",
    status: "Pending",
    timestamp: "2024-01-15 12:00",
  },
  {
    id: "REP002",
    reportedBy: "Emma Davis",
    reporterRole: "Player",
    postId: "POST004",
    originalUser: "John Smith",
    issue: "Inappropriate content",
    description: "Contains offensive language in description",
    status: "Pending",
    timestamp: "2024-01-15 11:30",
  },
]

export function PostsReports() {
  const [activeTab, setActiveTab] = useState("posts")

  const handleApprovePost = (postId: string) => {
    console.log(`Approving post ${postId}`)
  }

  const handleRejectPost = (postId: string) => {
    console.log(`Rejecting post ${postId}`)
  }

  const handleApproveReport = (reportId: string) => {
    console.log(`Approving report ${reportId}`)
  }

  const handleRejectReport = (reportId: string) => {
    console.log(`Rejecting report ${reportId}`)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="posts">Pending Posts</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <Card>
          <CardHeader>
            <CardTitle className="font-press-start">Pending Post Approvals</CardTitle>
            <CardDescription>Review and approve rock identification posts from players</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <div key={post.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Rock specimen"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{post.rockType}</h3>
                      <Badge variant="outline">{Math.round(post.confidence * 100)}% confidence</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Submitted by {post.user} ({post.userRole})
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">Location: {post.location}</p>
                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="default" onClick={() => handleApprovePost(post.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRejectPost(post.id)}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle className="font-press-start">Content Reports</CardTitle>
            <CardDescription>
              Review reports submitted by users about incorrect or inappropriate content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <h3 className="font-medium">{report.issue}</h3>
                      <Badge variant="destructive">{report.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" onClick={() => handleApproveReport(report.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectReport(report.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{report.description}</p>
                  <div className="text-xs text-muted-foreground">
                    <p>
                      Reported by: {report.reportedBy} ({report.reporterRole})
                    </p>
                    <p>Original post by: {report.originalUser}</p>
                    <p>
                      Report ID: {report.id} • {report.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
