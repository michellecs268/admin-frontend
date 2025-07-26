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
import { Search, Plus, Edit, Trash2, MapPin, Trophy } from "lucide-react"

const quests = [
  {
    id: "QUEST001",
    title: "Mountain Explorer",
    description: "Discover and scan 5 different igneous rocks in mountainous regions",
    type: "GPS-based",
    difficulty: "Easy",
    reward: "Mountain Badge + 100 XP",
    location: "Rocky Mountains, CO",
    status: "Active",
    dateCreated: "2024-01-10",
  },
  {
    id: "QUEST002",
    title: "Sedimentary Specialist",
    description: "Find and identify 10 sedimentary rocks in different locations",
    type: "Collection",
    difficulty: "Medium",
    reward: "Geologist Badge + 250 XP",
    location: "Various",
    status: "Active",
    dateCreated: "2024-01-15",
  },
  {
    id: "QUEST003",
    title: "Cave Crystal Hunter",
    description: "Explore limestone caves and find crystal formations",
    type: "GPS-based",
    difficulty: "Hard",
    reward: "Crystal Hunter Badge + 500 XP",
    location: "Mammoth Cave, KY",
    status: "Draft",
    dateCreated: "2024-01-20",
  },
]

export function QuestManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredQuests = quests.filter((quest) => {
    const matchesSearch =
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || quest.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddQuest = () => {
    console.log("Adding new quest")
    setIsAddDialogOpen(false)
  }

  const handleEditQuest = (questId: string) => {
    console.log(`Editing quest ${questId}`)
  }

  const handleDeleteQuest = (questId: string) => {
    console.log(`Deleting quest ${questId}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-press-start">Quest Management</CardTitle>
              <CardDescription>Create, edit, and manage geological exploration quests</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quest
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Quest</DialogTitle>
                  <DialogDescription>Design a new geological exploration quest for users</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quest Title</Label>
                    <Input id="title" placeholder="e.g., Mountain Explorer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe the quest objectives..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Quest Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gps-based">GPS-based</SelectItem>
                          <SelectItem value="collection">Collection</SelectItem>
                          <SelectItem value="identification">Identification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="e.g., Rocky Mountains, CO" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reward">Reward</Label>
                      <Input id="reward" placeholder="e.g., Mountain Badge + 100 XP" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddQuest}>Create Quest</Button>
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
                placeholder="Search quests by title or description..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {filteredQuests.map((quest) => (
              <Card key={quest.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold">{quest.title}</h3>
                        <Badge
                          variant={quest.status === "Active" ? "default" : "secondary"}
                          className={quest.status === "Active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        >
                          {quest.status}
                        </Badge>
                        <Badge variant="outline">{quest.difficulty}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{quest.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Type</p>
                          <p className="text-muted-foreground">{quest.type}</p>
                        </div>
                        <div>
                          <p className="font-medium">Location</p>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{quest.location}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Date Created</p>
                          <p className="text-muted-foreground">{quest.dateCreated}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm">
                          <span className="font-medium">Reward:</span> {quest.reward}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEditQuest(quest.id)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteQuest(quest.id)}>
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
