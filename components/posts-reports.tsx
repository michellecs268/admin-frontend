"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react"
import API from "@/lib/api"

interface Report {
  id: string
  reportedBy: string
  reason: string
  status: string
  reviewedBy?: string
  reviewedAt?: string
  reportedAt?: string
  moderatedAt?: string
  moderatedBy?: string
}

export function PostsReports() {
  const [reportFilter, setReportFilter] = useState("pending")
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    const res = await API.get<Report[]>("/admin/reports")
    setReports(res.data)
  }

  const handleReviewReport = async (reportId: string, action: "approve" | "reject") => {
    try {
      await API.post(`/admin/review-report/${reportId}`, { action })
      fetchReports()
    } catch (err) {
      console.error("Failed to review report:", err)
    }
  }

  const renderReportCard = (report: Report, showActions = true) => (
    <div key={report.id} className="p-4 border rounded-lg flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium">{report.reason}</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Reported by: {report.reportedBy}</p>
          <p>
            Report ID: {report.id} •{" "}
            {report.reviewedAt
              ? new Date(report.reviewedAt).toLocaleString("en-GB")
              : "Pending"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
              <p><strong>Reason:</strong> {selectedReport?.reason}</p>
              <p><strong>Status:</strong> {selectedReport?.status}</p>
              <p><strong>Reported By:</strong> {selectedReport?.reportedBy}</p>
              <p>
                <strong>Reported At:</strong>{" "}
                {selectedReport?.reportedAt
                  ? new Date(selectedReport.reportedAt).toLocaleString("en-GB")
                  : "N/A"}
              </p>
              {selectedReport?.reviewedAt && (
                <p>
                  <strong>Reviewed At:</strong>{" "}
                  {new Date(selectedReport.reviewedAt).toLocaleString("en-GB")}
                </p>
              )}
              {selectedReport?.moderatedAt && (
                <p>
                  <strong>Moderated At:</strong>{" "}
                  {new Date(selectedReport.moderatedAt).toLocaleString("en-GB")}
                </p>
              )}
              {selectedReport?.moderatedBy && (
                <p><strong>Moderated By:</strong> {selectedReport.moderatedBy}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {showActions && (
          <>
            <Button
              size="sm"
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => handleReviewReport(report.id, "approve")}
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleReviewReport(report.id, "reject")}
            >
              <XCircle className="h-4 w-4 mr-1" /> Reject
            </Button>
          </>
        )}
      </div>
    </div>
  )

  return (
    <Tabs value={reportFilter} onValueChange={setReportFilter} className="space-y-6">
      <TabsList>
        <TabsTrigger value="pending">Pending Reports</TabsTrigger>
        <TabsTrigger value="approve">Approved</TabsTrigger>
        <TabsTrigger value="reject">Rejected</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <Card>
          <CardHeader>
            <CardTitle className="font-press-start">Content Reports</CardTitle>
            <CardDescription>Review reports submitted by users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.filter(r => r.status === "pending").map((report) => renderReportCard(report, true))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="approve">
        <Card>
          <CardHeader>
            <CardTitle className="font-press-start">Approved Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.filter(r => r.status === "approve").map((report) => renderReportCard(report, false))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reject">
        <Card>
          <CardHeader>
            <CardTitle className="font-press-start">Rejected Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.filter(r => r.status === "reject").map((report) => renderReportCard(report, false))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
