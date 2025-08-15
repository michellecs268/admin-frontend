"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import API from "@/lib/api"

interface Rock {
  rockId: string
  rockName: string
  rockType: string
  description?: string
  createdAt?: { seconds: number }
}

export function RockDatabase() {
  const [rocks, setRocks] = useState<Rock[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewRock, setViewRock] = useState<Rock | null>(null)
  const [newRock, setNewRock] = useState<Rock>({ rockId: "", rockName: "", rockType: "", description: "" })
  const [editRockId, setEditRockId] = useState<string | null>(null)

  useEffect(() => {
    fetchRocks()
  }, [])

  const fetchRocks = async () => {
    try {
      const res = await API.get<Rock[]>("/admin/rocks")
      setRocks(res.data || [])
    } catch (err) {
      console.error("Failed to load rocks", err)
    }
  }

  const handleAddRock = async () => {
    try {
      await API.post("/admin/add-rock", newRock)
      setIsAddDialogOpen(false)
      setNewRock({ rockId: "", rockName: "", rockType: "", description: "" })
      fetchRocks()
    } catch (err) {
      console.error("Failed to add rock", err)
    }
  }

  const handleDeleteRock = async (rockId: string) => {
    try {
      await API.delete(`/admin/delete-rock/${rockId}`)
      fetchRocks()
    } catch (err) {
      console.error("Failed to delete rock", err)
    }
  }

  const handleEditRock = (rock: Rock) => {
    setEditRockId(rock.rockId)
    setNewRock({
      rockId: rock.rockId,
      rockName: rock.rockName,
      rockType: rock.rockType,
      description: rock.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateRock = async () => {
    if (!editRockId) return
    try {
      if (editRockId !== newRock.rockId) {
        await API.delete(`/admin/delete-rock/${editRockId}`)
        await API.post("/admin/add-rock", newRock)
      } else {
        await API.put(`/admin/edit-rock/${editRockId}`, newRock)
      }
      setIsEditDialogOpen(false)
      setNewRock({ rockId: "", rockName: "", rockType: "", description: "" })
      fetchRocks()
    } catch (err) {
      console.error("Failed to update rock", err)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp)
      return date.toLocaleDateString("en-GB")
    } catch {
      return "Invalid Date"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-press-start">Rock Database Management</CardTitle>
              <CardDescription>Manage rock information, add new specimens, and update geological data</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (open) setNewRock({ rockId: "", rockName: "", rockType: "", description: "" }) }}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Rock</Button></DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Add New Rock</DialogTitle><DialogDescription>Enter the details for the new rock specimen</DialogDescription></DialogHeader>
                <RockForm rock={newRock} setRock={setNewRock} key="add" />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddRock}>Add Rock</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Edit Rock</DialogTitle><DialogDescription>Update the selected rock's details</DialogDescription></DialogHeader>
                <RockForm rock={newRock} setRock={setNewRock} key="edit" />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpdateRock}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Rock Details</DialogTitle>
                  <DialogDescription>Full information for the selected rock</DialogDescription>
                </DialogHeader>
                {viewRock && (
                  <div className="space-y-4 text-sm">
                    <div><strong>Rock ID</strong><br />{viewRock.rockId}</div>
                    <div><strong>Rock Name</strong><br />{viewRock.rockName}</div>
                    <div><strong>Type</strong><br />{viewRock.rockType}</div>
                    <div><strong>Description</strong><br />{viewRock.description}</div>
                    <div><strong>Created At</strong><br />{formatDate(viewRock.createdAt)}</div>
                  </div>
                )}
                <DialogFooter><Button onClick={() => setIsViewDialogOpen(false)}>Close</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rocks by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rock Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="igneous">Igneous</SelectItem>
                <SelectItem value="sedimentary">Sedimentary</SelectItem>
                <SelectItem value="metamorphic">Metamorphic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rocks.filter((rock) => {
              const matchesSearch = rock.rockName.toLowerCase().includes(searchTerm.toLowerCase()) || rock.rockType.toLowerCase().includes(searchTerm.toLowerCase())
              const matchesType = typeFilter === "all" || rock.rockType.toLowerCase() === typeFilter
              return matchesSearch && matchesType
            }).map((rock) => (
              <Card key={rock.rockId}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{rock.rockName}</h3>
                        <Badge variant="outline">{rock.rockType}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{rock.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      <div><strong>ID:</strong> {rock.rockId}</div>
                      <div>Added: {formatDate(rock.createdAt)}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setViewRock(rock); setIsViewDialogOpen(true) }}><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditRock(rock)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteRock(rock.rockId)}><Trash2 className="h-4 w-4" /></Button>
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

function RockForm({ rock, setRock }: { rock: Rock; setRock: React.Dispatch<React.SetStateAction<Rock>> }) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rockId">Rock ID</Label>
          <Input id="rockId" value={rock.rockId} onChange={(e) => setRock((prev) => ({ ...prev, rockId: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rockName">Rock Name</Label>
          <Input id="rockName" value={rock.rockName} onChange={(e) => setRock((prev) => ({ ...prev, rockName: e.target.value }))} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rockType">Rock Type</Label>
        <Select value={rock.rockType} onValueChange={(value) => setRock((prev) => ({ ...prev, rockType: value }))}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Igneous">Igneous</SelectItem>
            <SelectItem value="Sedimentary">Sedimentary</SelectItem>
            <SelectItem value="Metamorphic">Metamorphic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={rock.description} onChange={(e) => setRock((prev) => ({ ...prev, description: e.target.value }))} />
      </div>
    </div>
  )
}
