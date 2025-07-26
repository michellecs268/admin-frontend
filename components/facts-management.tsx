"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Trash2, BookOpen, ThumbsUp } from "lucide-react"

const facts = [
  {
    id: "FACT001",
    title: "Diamond Formation",
    content:
      "Diamonds form under extreme pressure and temperature conditions, typically 140-190 km below Earth's surface in the mantle.",
    author: "Dr. Sarah Chen",
    authorRole: "Geologist",
    category: "Minerals",
    likes: 45,
    dateAdded: "2024-01-10",
    status: "Approved",
  },
  {
    id: "FACT002",
    title: "Volcanic Glass",
    content:
      "Obsidian is formed when felsic lava extruded from a volcano cools rapidly with minimal crystal growth, creating natural glass.",
    author: "Dr. Tom Brown",
    authorRole: "Geologist",
    category: "Igneous Rocks",
    likes: 32,
    dateAdded: "2024-01-12",
    status: "Approved",
  },
  {
    id: "FACT003",
    title: "Limestone Caves",
    content:
      "Limestone caves are formed through chemical weathering when slightly acidic water dissolves the calcium carbonate in limestone.",
    author: "Dr. Emma Davis",
    authorRole: "Geologist",
    category: "Sedimentary Rocks",
    likes: 28,
    dateAdded: "2024-01-15",
    status: "Pending Review",
  },
]

export function FactsManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFacts = facts.filter((fact) => {
    const matchesSearch =
      fact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fact.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fact.author.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleDeleteFact = (factId: string) => {
    console.log(`Deleting fact ${factId}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-press-start">Facts Management</CardTitle>
          <CardDescription>Review and manage geological facts submitted by geologists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search facts by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-4">
            {filteredFacts.map((fact) => (
              <Card key={fact.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{fact.title}</h3>
                        <Badge
                          variant={fact.status === "Approved" ? "default" : "destructive"}
                          className={fact.status === "Approved" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                        >
                          {fact.status}
                        </Badge>
                        <Badge variant="outline">{fact.category}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{fact.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg?height=24&width=24" />
                              <AvatarFallback>
                                {fact.author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium">{fact.author}</p>
                              <p className="text-muted-foreground">{fact.authorRole}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{fact.likes} likes</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Added: {fact.dateAdded}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleDeleteFact(fact.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
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
