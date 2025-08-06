"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  CheckCircle, XCircle, AlertTriangle, Eye, RefreshCcw
} from "lucide-react"
import API from "@/lib/api"

interface PendingPost {
  id: string
  rockname: string
  description: string
  information: string
  image: string
  createdBy: string
  verified: boolean
  verifiedAt?: string
  rejectedAt?: string
  rejectedReason?: string
  createdAt: string
}

interface Report {
  id: string
  reportedBy: string
  reportedItemType: string
  reportedId: string
  reason: string
  status: string
  reviewedBy?: string
  reviewedAt?: string
  reportedAt?: string
}

interface User {
  id: string
  email: string
  username: string
}

interface SpawnedRock {
  rockId: string
  confidence: number
  spawnedAt: string
}

export function PostsReports() {
  const [activeTab, setActiveTab] = useState("posts")
  const [postFilter, setPostFilter] = useState("pending")
  const [reportFilter, setReportFilter] = useState("pending")
  const [pendingPosts, setPendingPosts] = useState<PendingPost[]>([])
  const [approvedPosts, setApprovedPosts] = useState<PendingPost[]>([])
  const [rejectedPosts, setRejectedPosts] = useState<PendingPost[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [spawns, setSpawns] = useState<SpawnedRock[]>([])
  const [selectedPost, setSelectedPost] = useState<PendingPost | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  useEffect(() => {
    fetchAllPosts()
    fetchReports()
    fetchUsers()
    fetchSpawns()
  }, [])

  const fetchAllPosts = async () => {
    const res = await API.get<PendingPost[]>("/admin/review")
    const allPosts = res.data
    setPendingPosts(allPosts.filter((post) => !post.verified && !post.rejectedAt))
    setApprovedPosts(allPosts.filter((post) => post.verified))
    setRejectedPosts(allPosts.filter((post) => !post.verified && post.rejectedAt))
  }

  const fetchReports = async () => {
    const res = await API.get<Report[]>("/admin/reports")
    setReports(res.data)
  }

  const fetchUsers = async () => {
    const res = await API.get<User[]>("/admin/users")
    setUsers(res.data)
  }

  const fetchSpawns = async () => {
    const res = await API.get<SpawnedRock[]>("/admin/spawns")
    setSpawns(res.data)
  }

  const getUsername = (uid: string) => {
    const user = users.find((u) => u.id === uid)
    return user?.username || "Unknown User"
  }

  const getConfidence = (postId: string) => {
    const related = spawns.filter((s) => s.rockId === postId)
    if (related.length === 0) return null
    const latest = related.sort((a, b) => new Date(b.spawnedAt).getTime() - new Date(a.spawnedAt).getTime())[0]
    return latest.confidence
  }

  const handleApprovePost = async (postId: string) => {
    await API.post(`/admin/verify-rock/${postId}`, { action: "approve" })
    fetchAllPosts()
  }

  const handleRejectPost = async (postId: string) => {
    const reason = prompt("Enter rejection reason:")
    if (!reason) return
    await API.post(`/admin/verify-rock/${postId}`, { action: "reject", reason })
    fetchAllPosts()
  }

  const handleToggleStatus = async (post: PendingPost) => {
    if (post.verified) {
      const reason = prompt("Enter reason to reject this approved post:")
      if (!reason) return
      await API.post(`/admin/verify-rock/${post.id}`, { action: "reject", reason })
    } else if (post.rejectedAt) {
      await API.post(`/admin/verify-rock/${post.id}`, { action: "approve" })
    }
    fetchAllPosts()
  }

  const handleToggleReport = async (report: Report) => {
    const newAction = report.status === "approve" ? "reject" : "approve"
    await API.post(`/admin/review-report/${report.id}`, { action: newAction })
    fetchReports()
  }

  const handleReviewReport = async (reportId: string, action: "approve" | "reject") => {
    await API.post(`/admin/review-report/${reportId}`, { action })
    fetchReports()
  }

  const renderReportCard = (report: Report, showActions = true) => (
    <div key={report.id} className="p-4 border rounded-lg flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium">{report.reason}</h3>
        </div>
        <div className="text-sm mb-2">Reported ID: {report.reportedId}</div>
        <div className="text-xs text-muted-foreground">
          <p>Reported by: {report.reportedBy}</p>
          <p>Report ID: {report.id} • {report.reviewedAt ? new Date(report.reviewedAt).toLocaleString("en-GB") : "Pending"}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
              <Eye className="h-4 w-4 mr-1" /> View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p><strong>Reported ID:</strong> {selectedReport?.reportedId}</p>
              <p><strong>Reason:</strong> {selectedReport?.reason}</p>
              <p><strong>Type:</strong> {selectedReport?.reportedItemType}</p>
              <p><strong>Status:</strong> {selectedReport?.status}</p>
              <p><strong>Reported By:</strong> {selectedReport?.reportedBy}</p>
              <p><strong>Reported At:</strong> {selectedReport?.reportedAt ? new Date(selectedReport?.reportedAt).toLocaleString("en-GB") : "N/A"}</p>
              {selectedReport?.reviewedAt && (
                <p><strong>Reviewed At:</strong> {new Date(selectedReport.reviewedAt).toLocaleString("en-GB")}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
        {showActions ? (
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => handleReviewReport(report.id, "approve")}>
              <CheckCircle className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleReviewReport(report.id, "reject")}>
              <XCircle className="h-4 w-4 mr-1" /> Reject
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => handleToggleReport(report)}>
            <RefreshCcw className="h-4 w-4 mr-1" /> Toggle Status
          </Button>
        )}
      </div>
    </div>
  )

  const renderPostCard = (post: PendingPost, showActions = true) => (
    <div key={post.id} className="flex justify-between items-center p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <img
          src={post.image || "/placeholder.svg"}
          alt="Rock specimen"
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-lg">{post.rockname}</h3>
            {getConfidence(post.id) && (
              <Badge variant="outline">{Math.round(getConfidence(post.id)! * 100)}% confidence</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Submitted by {getUsername(post.createdBy)}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleString("en-GB")}
          </p>
          {post.rejectedReason && !post.verified && (
            <p className="text-sm text-red-500 mt-1">Reason: {post.rejectedReason}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" onClick={() => setSelectedPost(post)}>
              <Eye className="h-4 w-4 mr-1" /> View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedPost?.rockname}</DialogTitle>
            </DialogHeader>
            <img src={selectedPost?.image} alt="Rock Image" className="rounded mb-4" />
            <p className="text-sm mb-2"><strong>Description:</strong> {selectedPost?.description}</p>
            <p className="text-sm mb-2"><strong>Information:</strong> {selectedPost?.information}</p>
            <p className="text-xs text-muted-foreground">
              Submitted by {getUsername(selectedPost?.createdBy || "")} on {new Date(selectedPost?.createdAt || "").toLocaleString("en-GB")}
            </p>
          </DialogContent>
        </Dialog>
        {showActions ? (
          <>
            <Button size="sm" variant="default" onClick={() => handleApprovePost(post.id)}>
              <CheckCircle className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleRejectPost(post.id)}>
              <XCircle className="h-4 w-4 mr-1" /> Reject
            </Button>
          </>
        ) : (
          <Button size="sm" variant="secondary" onClick={() => handleToggleStatus(post)}>
            <RefreshCcw className="h-4 w-4 mr-1" /> Toggle Status
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="posts">Pending Posts</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <Card>
          <CardHeader>
            <CardTitle className="font-press-start">Post Moderation</CardTitle>
            <CardDescription>Filter and moderate rock identification posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={postFilter} onValueChange={setPostFilter} className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingPosts.map((post) => renderPostCard(post))}
                </div>
              </TabsContent>
              <TabsContent value="approved">
                <div className="space-y-4">
                  {approvedPosts.map((post) => renderPostCard(post, false))}
                </div>
              </TabsContent>
              <TabsContent value="rejected">
                <div className="space-y-4">
                  {rejectedPosts.map((post) => renderPostCard(post, false))}
                </div>
              </TabsContent>
            </Tabs>
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
            <Tabs value={reportFilter} onValueChange={setReportFilter} className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approve">Approved</TabsTrigger>
                <TabsTrigger value="reject">Rejected</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <div className="space-y-4">
                  {reports.filter(r => r.status === "pending").map((report) => renderReportCard(report, true))}
                </div>
              </TabsContent>
              <TabsContent value="approve">
                <div className="space-y-4">
                  {reports.filter(r => r.status === "approve").map((report) => renderReportCard(report, false))}
                </div>
              </TabsContent>
              <TabsContent value="reject">
                <div className="space-y-4">
                  {reports.filter(r => r.status === "reject").map((report) => renderReportCard(report, false))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
