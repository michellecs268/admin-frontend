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
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"

const rocks = [
  {
    id: "ROCK001",
    name: "Granite",
    type: "Igneous",
    description: "A coarse-grained igneous rock composed mainly of quartz and feldspar.",
    image: "/placeholder.svg?height=100&width=100",
    dateAdded: "2024-01-10",
  },
  {
    id: "ROCK002",
    name: "Limestone",
    type: "Sedimentary",
    description: "A sedimentary rock composed primarily of calcium carbonate.",
    image: "/placeholder.svg?height=100&width=100",
    dateAdded: "2024-01-12",
  },
  {
    id: "ROCK003",
    name: "Slate",
    type: "Metamorphic",
    description: "A fine-grained metamorphic rock formed from shale or mudstone.",
    image: "/placeholder.svg?height=100&width=100",
    dateAdded: "2024-01-15",
  },
]

export function RockDatabase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredRocks = rocks.filter((rock) => {
    const matchesSearch =
      rock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rock.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || rock.type.toLowerCase() === typeFilter
    return matchesSearch && matchesType
  })

  const handleAddRock = () => {
    console.log("Adding new rock")
    setIsAddDialogOpen(false)
  }

  const handleEditRock = (rockId: string) => {
    console.log(`Editing rock ${rockId}`)
  }

  const handleDeleteRock = (rockId: string) => {
    console.log(`Deleting rock ${rockId}`)
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rock
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Rock</DialogTitle>
                  <DialogDescription>Enter the details for the new rock specimen</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Rock Name</Label>
                      <Input id="name" placeholder="e.g., Granite" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Rock Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="igneous">Igneous</SelectItem>
                          <SelectItem value="sedimentary">Sedimentary</SelectItem>
                          <SelectItem value="metamorphic">Metamorphic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Detailed description of the rock..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRock}>Add Rock</Button>
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
            {filteredRocks.map((rock) => (
              <Card key={rock.id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={rock.image || "/placeholder.svg"}
                      alt={rock.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold truncate">{rock.name}</h3>
                        <Badge variant="outline">{rock.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{rock.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-xs text-muted-foreground">Added: {rock.dateAdded}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditRock(rock.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteRock(rock.id)}>
                        <Trash2 className="h-4 w-4" />
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
