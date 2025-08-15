"use client"

import { useState, useEffect } from "react"
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
import { Search, Plus, Edit, Trash2, Trophy } from "lucide-react"
import API from "@/lib/api"

interface Quest {
  id: string
  questId: string
  title: string
  description: string
  type: "Scanning" | "Collection" | "Community" | "Learning" | "GPS-based"
  difficulty: "Easy" | "Medium"
  reward: string
  status: "Draft" | "Active" | "Past"
  date?: any
  createdAt?: any
  updatedAt?: any
  updatedBy?: string
}

export function QuestManagement() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null)
  const [newQuest, setNewQuest] = useState({
    title: "",
    description: "",
    type: "" as Quest["type"],
    difficulty: "" as Quest["difficulty"],
    reward: "",
    status: "Active" as Quest["status"],
    date: ""
  })

  useEffect(() => {
    fetchQuests()
  }, [])

  const fetchQuests = async () => {
    try {
      const res = await API.get<Quest[]>("/admin/quests")
      setQuests(res.data || [])
    } catch (err) {
      console.error("Failed to load quests:", err)
    }
  }

  const handleAddQuest = async () => {
    try {
      await API.post("/admin/add-quest", {
        questId: Date.now().toString(),
        ...newQuest,
        date: new Date(newQuest.date)
      })
      setNewQuest({
        title: "",
        description: "",
        type: "" as Quest["type"],
        difficulty: "" as Quest["difficulty"],
        reward: "",
        status: "Active",
        date: ""
      })
      setIsAddDialogOpen(false)
      fetchQuests()
    } catch (err) {
      console.error("Failed to create quest:", err)
    }
  }

  const handleEditQuest = (quest: Quest) => {
    setSelectedQuest({
      ...quest,
      date: quest.date
        ? new Date(quest.date.seconds ? quest.date.seconds * 1000 : quest.date)
          .toISOString()
          .split("T")[0]
        : ""
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedQuest) return
    try {
      await API.put(`/admin/edit-quest/${selectedQuest.questId}`, {
        ...selectedQuest,
        date: new Date(selectedQuest.date)
      })
      setIsEditDialogOpen(false)
      setSelectedQuest(null)
      fetchQuests()
    } catch (err) {
      console.error("Failed to update quest:", err)
    }
  }

  const handleDeleteQuest = async (questId: string) => {
    try {
      await API.delete(`/admin/delete-quest/${questId}`)
      fetchQuests()
    } catch (err) {
      console.error("Failed to delete quest:", err)
    }
  }

  const formatDate = (input: any) => {
    try {
      const date = input?.seconds ? new Date(input.seconds * 1000) : new Date(input)
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "N/A"
    }
  }

  const filteredQuests = quests.filter((quest) => {
    return (
      (quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (difficultyFilter === "all" || quest.difficulty === difficultyFilter)
    )
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-press-start">Quest Management</CardTitle>
              <CardDescription>Create and manage geological quests</CardDescription>
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
                  <DialogDescription>Design a new quest</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quest Title</Label>
                    <Input
                      id="title"
                      value={newQuest.title}
                      onChange={(e) => setNewQuest((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newQuest.description}
                      onChange={(e) => setNewQuest((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newQuest.type}
                        onValueChange={(value) => setNewQuest((prev) => ({ ...prev, type: value as Quest["type"] }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scanning">Scanning</SelectItem>
                          <SelectItem value="Collection">Collection</SelectItem>
                          <SelectItem value="Community">Community</SelectItem>
                          <SelectItem value="Learning">Learning</SelectItem>
                          <SelectItem value="GPS-based">GPS-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={newQuest.difficulty}
                        onValueChange={(value) => setNewQuest((prev) => ({ ...prev, difficulty: value as Quest["difficulty"] }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward</Label>
                    <Input
                      id="reward"
                      value={newQuest.reward}
                      onChange={(e) => setNewQuest((prev) => ({ ...prev, reward: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newQuest.status}
                      onValueChange={(value) => setNewQuest((prev) => ({ ...prev, status: value as Quest["status"] }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Publish Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newQuest.date}
                      onChange={(e) => setNewQuest((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddQuest}>Create Quest</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quests by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Type</p>
                          <p className="text-muted-foreground">{quest.type}</p>
                        </div>
                        <div>
                          <p className="font-medium">Date Created</p>
                          <p className="text-muted-foreground">{formatDate(quest.createdAt)}</p>
                        </div>
                        <div>
                          <p className="font-medium">Publish Date</p>
                          <p className="text-muted-foreground">{formatDate(quest.date)}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm">
                          <span className="font-medium">Reward:</span> {quest.reward}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEditQuest(quest)}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Quest</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={selectedQuest?.title || ""}
                onChange={(e) =>
                  setSelectedQuest((prev) => prev && { ...prev, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={selectedQuest?.description || ""}
                onChange={(e) =>
                  setSelectedQuest((prev) => prev && { ...prev, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={selectedQuest?.type}
                  onValueChange={(value) =>
                    setSelectedQuest((prev) => prev && { ...prev, type: value as Quest["type"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scanning">Scanning</SelectItem>
                    <SelectItem value="Collection">Collection</SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                    <SelectItem value="GPS-based">GPS-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select
                  value={selectedQuest?.difficulty}
                  onValueChange={(value) =>
                    setSelectedQuest((prev) => prev && { ...prev, difficulty: value as Quest["difficulty"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-reward">Reward</Label>
              <Input
                id="edit-reward"
                value={selectedQuest?.reward || ""}
                onChange={(e) =>
                  setSelectedQuest((prev) => prev && { ...prev, reward: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={selectedQuest?.status}
                onValueChange={(value) =>
                  setSelectedQuest((prev) => prev && { ...prev, status: value as Quest["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Publish Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={selectedQuest?.date || ""}
                onChange={(e) =>
                  setSelectedQuest((prev) => prev && { ...prev, date: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
