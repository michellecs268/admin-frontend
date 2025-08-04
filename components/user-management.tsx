"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation" // ✅ NEW
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MoreHorizontal, UserX, Mail } from "lucide-react"
import API from "@/lib/api"

type User = {
  id: string
  name: string
  email: string
  role: string
  status: string
  joinDate: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const router = useRouter() // ✅ NEW

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/login")
      return
    }

    API.get("/admin/users")
      .then((res) => {
        const raw = res.data as any[]
        const mappedUsers = raw.map((u) => ({
          id: u.id,
          name: u.username || u.name,
          email: u.emailAddress,
          role: u.type,
          status: u.isActive ? "Active" : "Suspended",
          joinDate: u.joinDate || u.join_date || "N/A",
        }))
        setUsers(mappedUsers)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err)
        if (err?.response?.status === 401) {
          localStorage.removeItem("adminToken")
          router.push("/login")
        }
        setLoading(false)
      })
  }, [router])

  const handleConfirmSuspend = async () => {
    if (!selectedUser) return
    const isActive = selectedUser.status === "Active"
    const endpoint = isActive
      ? `/admin/suspend-user/${selectedUser.id}`
      : `/admin/unsuspend-user/${selectedUser.id}`

    try {
      await API.put(endpoint)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: isActive ? "Suspended" : "Active" }
            : u
        )
      )
      setSelectedUser(null)
    } catch (err) {
      console.error("Failed to update user status:", err)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) return <p className="p-4">Loading users...</p>

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-press-start">User Management</CardTitle>
          <CardDescription>
            Manage player and geologist accounts, view activity, and handle suspensions
          </CardDescription>
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
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
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
                      <Badge variant={user.role === "Geologist" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                      <Badge
                        variant={user.status === "Active" ? "default" : "destructive"}
                        className={
                          user.status === "Active"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : ""
                        }
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault()
                              setSelectedUser(user)
                            }}
                            className="text-red-600"
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            {user.status === "Active" ? "Suspend User" : "Reactivate User"}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {user.status === "Active"
                                ? "Suspend this user?"
                                : "Reactivate this user?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to{" "}
                              {user.status === "Active" ? "suspend" : "reactivate"}{" "}
                              <strong>{user.name}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmSuspend}>
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
