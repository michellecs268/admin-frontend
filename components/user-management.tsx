"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, UserX, Mail } from "lucide-react"

const users = [
  {
    id: "P001",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    role: "Player",
    status: "Suspended",
    joinDate: "2024-01-15",
  },
  {
    id: "G001",
    name: "Dr. Sarah Chen",
    email: "s.chen@university.edu",
    role: "Geologist",
    status: "Active",
    joinDate: "2024-01-10",
  },
  {
    id: "P002",
    name: "Mike Wilson",
    email: "mike.w@email.com",
    role: "Player",
    status: "Suspended",
    joinDate: "2024-02-01",
  },
  {
    id: "P003",
    name: "Emma Davis",
    email: "emma.davis@email.com",
    role: "Player",
    status: "Active",
    joinDate: "2024-01-20",
  },
  {
    id: "G002",
    name: "Dr. Tom Brown",
    email: "t.brown@research.org",
    role: "Geologist",
    status: "Active",
    joinDate: "2024-01-25",
  },
]

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSuspendUser = (userId: string) => {
    console.log(`Suspending user ${userId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-press-start">User Management</CardTitle>
        <CardDescription>Manage player and geologist accounts, view activity, and handle suspensions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="player">Player</SelectItem>
              <SelectItem value="geologist">Geologist</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.name}</p>
                    <Badge variant={user.role === "Geologist" ? "default" : "secondary"}>{user.role}</Badge>
                    <Badge
                      variant={user.status === "Active" ? "default" : "destructive"}
                      className={user.status === "Active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {user.id} • Joined: {user.joinDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSuspendUser(user.id)} className="text-red-600">
                      <UserX className="h-4 w-4 mr-2" />
                      {user.status === "Active" ? "Suspend User" : "Reactivate User"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
