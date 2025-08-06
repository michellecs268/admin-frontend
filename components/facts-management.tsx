"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Trash2, BookOpen } from "lucide-react"
import API from "@/lib/api"

interface Fact {
  id: string
  title: string
  description: string
  createdBy: string
  createdAt: string | null
  author?: string
  authorRole?: string
}

export function FactsManagement() {
  const [facts, setFacts] = useState<Fact[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchFacts()
  }, [])

  const fetchFacts = async () => {
    try {
      const res = await API.get<Fact[]>("/admin/facts")
      const data = res.data.map((fact) => ({
        id: fact.id,
        title: fact.title,
        description: fact.description,
        createdBy: fact.createdBy || "Unknown",
        createdAt: fact.createdAt || null,
        author: fact.author || "Unknown",
        authorRole: fact.authorRole || "Geologist"
      }))
      setFacts(data)
    } catch (error) {
      console.error("Failed to fetch facts", error)
    }
  }
  

  const handleDeleteFact = async (factId: string) => {
    try {
      await API.delete(`/admin/delete-fact/${factId}`)
      setFacts((prev) => prev.filter((fact) => fact.id !== factId))
    } catch (error) {
      console.error("Failed to delete fact", error)
    }
  }

  const filteredFacts = facts.filter((fact) => {
    const term = searchTerm.toLowerCase()
    return (
      fact.title.toLowerCase().includes(term) ||
      fact.description.toLowerCase().includes(term) ||
      fact.author?.toLowerCase().includes(term)
    )
  })

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Unknown"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }) // e.g. "6 Aug 2025"
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
                      </div>

                      <p className="text-muted-foreground mb-4">{fact.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg?height=24&width=24" />
                              <AvatarFallback>
                              {(fact.author ?? "??")
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

                          <div className="text-sm text-muted-foreground">
                            Added: {formatDate(fact.createdAt)}
                          </div>
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
