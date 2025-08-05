"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Megaphone, Calendar } from "lucide-react"
import API from "@/lib/api"

interface Announcement {
  id: string
  title: string
  description: string
  type: string
  publishDate?: string
  createdBy?: string
  createdAt?: { seconds: number }
  isVisible?: boolean
  pinned?: boolean
  imageUrl?: string
  updatedAt?: string
  updatedBy?: string
}

export function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null)

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    type: "",
    publishDate: "",
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get<Announcement[]>("/admin/announcements")
      setAnnouncements(res.data || [])
    } catch (err) {
      console.error("Failed to load announcements:", err)
    }
  }

  const handleAddAnnouncement = async () => {
    try {
      await API.post("/admin/announcements", {
        announcementId: Date.now().toString(),
        title: newAnnouncement.title,
        description: newAnnouncement.content,
        type: newAnnouncement.type,
        publishDate: newAnnouncement.publishDate,
        imageUrl: "",
        isVisible: true,
        pinned: false,
      })
      setIsAddDialogOpen(false)
      setNewAnnouncement({ title: "", content: "", type: "", publishDate: "" })
      fetchAnnouncements()
    } catch (err) {
      console.error("Failed to create announcement:", err)
    }
  }

  const handleUpdateAnnouncement = async () => {
    if (!editAnnouncement) return
    try {
      const formattedDate = editAnnouncement.publishDate
        ? new Date(editAnnouncement.publishDate)
        : null

      await API.put(`/admin/announcements/${editAnnouncement.id}`, {
        title: editAnnouncement.title,
        description: editAnnouncement.description,
        publishDate: formattedDate,
        type: editAnnouncement.type,
      })
      setIsEditDialogOpen(false)
      setEditAnnouncement(null)
      fetchAnnouncements()
    } catch (err) {
      console.error("Failed to update announcement:", err)
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await API.delete(`/admin/announcements/${id}`)
      fetchAnnouncements()
    } catch (err) {
      console.error("Failed to delete announcement:", err)
    }
  }

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const formatDate = (input: { seconds: number } | string | undefined) => {
    if (!input) return "N/A"
    try {
      const date = typeof input === "string" ? new Date(input) : new Date(input.seconds * 1000)
      return date.toLocaleDateString("en-GB")
    } catch {
      return "N/A"
    }
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
                  <DialogDescription>Share updates with users</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newAnnouncement.title}
                      onChange={(e) =>
                        setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      rows={4}
                      value={newAnnouncement.content}
                      onChange={(e) =>
                        setNewAnnouncement((prev) => ({ ...prev, content: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newAnnouncement.type}
                      onValueChange={(val) =>
                        setNewAnnouncement((prev) => ({ ...prev, type: val }))
                      }
                    >
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
                    <Input
                      id="publishDate"
                      type="date"
                      value={newAnnouncement.publishDate}
                      onChange={(e) =>
                        setNewAnnouncement((prev) => ({ ...prev, publishDate: e.target.value }))
                      }
                    />
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
                      </div>
                      <p className="text-muted-foreground mb-3">{announcement.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Type</p>
                          <p className="text-muted-foreground">{announcement.type}</p>
                        </div>
                        <div>
                          <p className="font-medium">Publish Date</p>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(announcement.publishDate)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Created At</p>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(announcement.createdAt)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Created By</p>
                          <p className="text-muted-foreground">Admin</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditAnnouncement(announcement)
                        setIsEditDialogOpen(true)
                      }}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editAnnouncement?.title || ""}
                onChange={(e) =>
                  setEditAnnouncement((prev) => prev && { ...prev, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Content</Label>
              <Textarea
                id="edit-description"
                value={editAnnouncement?.description || ""}
                onChange={(e) =>
                  setEditAnnouncement((prev) => prev && { ...prev, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-publishDate">Publish Date</Label>
              <Input
                id="edit-publishDate"
                type="date"
                value={editAnnouncement?.publishDate || ""}
                onChange={(e) =>
                  setEditAnnouncement((prev) => prev && { ...prev, publishDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={editAnnouncement?.type || ""}
                onValueChange={(val) =>
                  setEditAnnouncement((prev) => prev && { ...prev, type: val })
                }
              >
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateAnnouncement}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}