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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Trash2, MapPin, Map, List } from "lucide-react"

const distributions = [
  {
    id: "DIST001",
    rockType: "Granite",
    location: "Rocky Mountains, Colorado",
    coordinates: { lat: 39.7392, lng: -104.9903 },
    description: "Large granite formations easily accessible via hiking trails",
    dateAdded: "2024-01-10",
    status: "Active",
  },
  {
    id: "DIST002",
    rockType: "Limestone",
    location: "Mammoth Cave, Kentucky",
    coordinates: { lat: 37.1862, lng: -86.1004 },
    description: "Extensive limestone cave system with guided tours available",
    dateAdded: "2024-01-12",
    status: "Active",
  },
  {
    id: "DIST003",
    rockType: "Obsidian",
    location: "Yellowstone National Park",
    coordinates: { lat: 44.428, lng: -110.5885 },
    description: "Volcanic glass formations in protected park area",
    dateAdded: "2024-01-15",
    status: "Pending Review",
  },
]

export function RockDistribution() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("map")

  const filteredDistributions = distributions.filter((dist) => {
    const matchesSearch =
      dist.rockType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dist.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || dist.status.toLowerCase().replace(" ", "") === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddDistribution = () => {
    console.log("Adding new rock distribution")
    setIsAddDialogOpen(false)
  }

  const handleEditDistribution = (distId: string) => {
    console.log(`Editing distribution ${distId}`)
  }

  const handleDeleteDistribution = (distId: string) => {
    console.log(`Deleting distribution ${distId}`)
  }

  const MapView = () => (
    <div className="relative h-[600px] bg-slate-100 rounded-lg border overflow-hidden">
      {/* Placeholder map*/}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-4">
          <Map className="h-16 w-16 mx-auto text-slate-400" />
          <div>
            <h3 className="text-lg font-semibold text-slate-600">Interactive Map</h3>
            <p className="text-sm text-slate-500">Map integration will display geological locations here</p>
            <p className="text-xs text-slate-400 mt-2">Click on the map to add new rock distribution points</p>
          </div>
        </div>
      </div>
      {/* Simple visual markers */}
      <div className="absolute inset-0">
        {filteredDistributions.map((dist, index) => (
          <div
            key={dist.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${30 + index * 20}%`,
              top: `${40 + index * 15}%`,
            }}
            onClick={() => setSelectedLocation(dist)}
          >
            <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg bg-blue-500" />
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
              {dist.rockType}
            </div>
          </div>
        ))}
      </div>
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold">{selectedLocation.rockType}</h4>
            <Button size="sm" variant="ghost" onClick={() => setSelectedLocation(null)} className="h-6 w-6 p-0">
              ×
            </Button>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="text-muted-foreground">{selectedLocation.location}</span>
            </div>
            <p className="text-muted-foreground text-xs">{selectedLocation.description}</p>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => handleEditDistribution(selectedLocation.id)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleDeleteDistribution(selectedLocation.id)}>
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-press-start">Rock Distribution Management</CardTitle>
              <CardDescription>
                Manage geological locations and rock distribution data on the interactive map
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Rock Distribution</DialogTitle>
                  <DialogDescription>Add a new geological location to the distribution map</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="rockType">Rock Type</Label>
                    <Input id="rockType" placeholder="e.g., Granite" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., Rocky Mountains, Colorado" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" placeholder="e.g., 39.7392" type="number" step="any" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" placeholder="e.g., -104.9903" type="number" step="any" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Brief description of the location..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDistribution}>Add Location</Button>
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
                placeholder="Search by rock type or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pendingreview">Pending Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                Map View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
            </TabsList>
            <TabsContent value="map">
              <MapView />
            </TabsContent>
            <TabsContent value="list">
              <div className="space-y-4">
                {filteredDistributions.map((dist) => (
                  <Card key={dist.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Map className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">{dist.rockType}</h3>
                            <Badge
                              variant={dist.status === "Active" ? "default" : "destructive"}
                              className={dist.status === "Active" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                            >
                              {dist.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{dist.location}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{dist.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">Coordinates</p>
                              <p className="text-muted-foreground">
                                {dist.coordinates.lat}°, {dist.coordinates.lng}°
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Date Added</p>
                              <p className="text-muted-foreground">{dist.dateAdded}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => handleEditDistribution(dist.id)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteDistribution(dist.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
