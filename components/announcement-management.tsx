"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Megaphone, Calendar } from "lucide-react"

const announcements = [
  {
    id: "ANN001",
    title: "New Rock Database Update",
    content: "We've added 50 new rock specimens to our database, including rare minerals from the Himalayas.",
    type: "Update",
    status: "Published",
    publishDate: "2024-01-15",
    author: "Admin",
    views: 1247,
  },
  {
    id: "ANN002",
    title: "Maintenance Scheduled",
    content:
      "The app will undergo maintenance on January 25th from 2-4 AM EST. Some features may be temporarily unavailable.",
    type: "Maintenance",
    status: "Scheduled",
    publishDate: "2024-01-25",
    author: "Admin",
    views: 0,
  },
  {
    id: "ANN003",
    title: "New Quest: Crystal Cave Explorer",
    content: "Explore the mysterious crystal caves and discover rare geological formations in our latest quest!",
    type: "Feature",
    status: "Draft",
    publishDate: "2024-01-30",
    author: "Admin",
    views: 0,
  },
]

export function AnnouncementManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || announcement.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddAnnouncement = () => {
    console.log("Adding new announcement")
    setIsAddDialogOpen(false)
  }

  const handleEditAnnouncement = (announcementId: string) => {
    console.log(`Editing announcement ${announcementId}`)
  }

  const handleDeleteAnnouncement = (announcementId: string) => {
    console.log(`Deleting announcement ${announcementId}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-press-start">Announcement Management</CardTitle>
              <CardDescription>Create and manage announcements for all users</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>Create an announcement to share with all users</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Announcement title..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="Announcement content..." rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <Input id="publishDate" type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAnnouncement}>Create Announcement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Megaphone className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        <Badge
                          variant={
                            announcement.status === "Published"
                              ? "default"
                              : announcement.status === "Scheduled"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            announcement.status === "Published" ? "bg-green-600 hover:bg-green-700 text-white" : ""
                          }
                        >
                          {announcement.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{announcement.content}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Type</p>
                          <p className="text-muted-foreground">{announcement.type}</p>
                        </div>
                        <div>
                          <p className="font-medium">Publish Date</p>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{announcement.publishDate}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Author</p>
                          <p className="text-muted-foreground">{announcement.author}</p>
                        </div>
                        <div>
                          <p className="font-medium">Views</p>
                          <p className="text-muted-foreground">{announcement.views}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEditAnnouncement(announcement.id)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
