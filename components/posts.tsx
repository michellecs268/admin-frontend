"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Eye, Trash2 } from "lucide-react"
import API from "@/lib/api"

interface Post {
  id: string
  rockName: string
  shortDescription?: string
  information: string
  imageUrl: string
  type?: string
  uploadedBy?: string
  createdBy?: string
  creatorName?: string
  creatorRole?: string
  createdAt?: any
  updatedAt?: any
  verified: boolean
  flaggedAt?: any
  flaggedBy?: string
  flaggedReason?: string
}

export function Posts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [deletePostId, setDeletePostId] = useState<string | null>(null) // For confirmation dialog

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await API.get<Post[]>("/admin/posts")
      setPosts(res.data || [])
    } catch (err) {
      console.error("Failed to fetch posts:", err)
    }
  }

  const confirmDeletePost = async () => {
    if (!deletePostId) return
    try {
      await API.delete(`/admin/delete-post/${deletePostId}`)
      setPosts((prev) => prev.filter((p) => p.id !== deletePostId))
    } catch (err) {
      console.error("Failed to delete post:", err)
    } finally {
      setDeletePostId(null)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-press-start">Post Management</CardTitle>
        <CardDescription>View and manage all user posts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{post.rockName}</h3>
              <p className="text-sm text-muted-foreground">{post.shortDescription}</p>
              <p className="text-xs text-gray-500">
                Created: {formatDate(post.createdAt)} • By: {post.creatorName || "Unknown"} ({post.creatorRole || "N/A"})
              </p>
            </div>
            <div className="flex gap-2">
              {/* View Details */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPost(post)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{selectedPost?.rockName}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {selectedPost?.imageUrl && (
                      <img
                        src={selectedPost.imageUrl}
                        alt={selectedPost.rockName}
                        className="w-full rounded-lg"
                      />
                    )}
                    <p><strong>Short Description:</strong> {selectedPost?.shortDescription}</p>
                    <p><strong>Information:</strong> {selectedPost?.information}</p>
                    <p><strong>Created At:</strong> {formatDate(selectedPost?.createdAt)}</p>
                    <p><strong>Verified:</strong> {selectedPost?.verified ? "Yes" : "No"}</p>
                    {selectedPost?.flaggedReason && (
                      <p><strong>Flagged Reason:</strong> {selectedPost.flaggedReason}</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation */}
              <Dialog open={deletePostId === post.id} onOpenChange={(open) => !open && setDeletePostId(null)}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeletePostId(post.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to delete the post "<strong>{post.rockName}</strong>"? This action cannot be undone.</p>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeletePostId(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmDeletePost}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
