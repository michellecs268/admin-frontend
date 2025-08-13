"use client"

import { useState, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Trash2, MapPin, Map, List } from "lucide-react"
import API from "@/lib/api"

interface Rock {
  rockId: string
  rockName: string
}

interface Spawn {
  id: string
  rockId: string
  lat: number
  lng: number
  confidence?: number
  spawnedAt?: string
}

export function RockDistribution() {
  const [rocks, setRocks] = useState<Rock[]>([])
  const [spawns, setSpawns] = useState<Spawn[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("map")

  // Form states
  const [selectedRock, setSelectedRock] = useState("")
  const [locationSearch, setLocationSearch] = useState("")
  const [showRockDropdown, setShowRockDropdown] = useState(false)
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  useEffect(() => {
    fetchRocks()
    fetchSpawns()
  }, [])

  const fetchRocks = async () => {
    const res = await API.get<Rock[]>("/admin/rocks")
    setRocks(res.data)
  }

  const fetchSpawns = async () => {
    const res = await API.get<Spawn[]>("/admin/spawns")
    setSpawns(res.data)
  }

  const handleAddDistribution = async () => {
    if (!selectedRock || !latitude || !longitude) {
      alert("Please fill in all required fields")
      return
    }

    const newSpawn = {
      rockId: selectedRock,
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      confidence: 1
    }

    const res = await API.post<{ message: string; id: string }>("/admin/spawns", newSpawn)
    setSpawns(prev => [...prev, { id: res.data.id, ...newSpawn }])

    setIsAddDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedRock("")
    setLocationSearch("")
    setLatitude("")
    setLongitude("")
    setShowRockDropdown(false)
  }

  const handleDeleteDistribution = async (spawnId: string) => {
    await API.delete(`/admin/spawns/${spawnId}`)
    setSpawns(prev => prev.filter(s => s.id !== spawnId))
    setSelectedLocation(null)
  }

  const filteredSpawns = spawns.filter(spawn => {
    const rockName = rocks.find(r => r.rockId === spawn.rockId)?.rockName || ""
    return rockName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const MapView = () => {
    if (!isLoaded) return <div className="h-[600px] flex items-center justify-center">Loading Map...</div>

    return (
      <div className="relative h-[600px]">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: 1.3521, lng: 103.8198 }}
          zoom={11}
        >
          {filteredSpawns.map(spawn => {
            const rockName = rocks.find(r => r.rockId === spawn.rockId)?.rockName || "Unknown Rock"
            return (
              <Marker
                key={spawn.id}
                position={{ lat: spawn.lat, lng: spawn.lng }}
                onClick={() => setSelectedLocation({ ...spawn, rockName })}
              />
            )
          })}

          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="p-2 max-w-xs">
                <h4 className="font-semibold">{selectedLocation.rockName}</h4>
                <p className="text-sm text-gray-500">
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => handleDeleteDistribution(selectedLocation.id)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-press-start">Rock Distribution Management</CardTitle>
              <CardDescription>Manage geological locations on the interactive map</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Rock Distribution</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="rockType">Rock</Label>
                    <div className="relative">
                      <Input
                        placeholder="Search rock..."
                        value={locationSearch}
                        onChange={e => {
                          setLocationSearch(e.target.value)
                          setShowRockDropdown(true)
                        }}
                        onClick={() => setShowRockDropdown(prev => !prev)}
                      />
                      {showRockDropdown && (
                        <div className="absolute z-10 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                          {rocks
                            .filter(r => r.rockName.toLowerCase().includes(locationSearch.toLowerCase()))
                            .map(r => (
                              <div
                                key={r.rockId}
                                className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedRock === r.rockId ? "bg-gray-200" : ""}`}
                                onClick={() => {
                                  setSelectedRock(r.rockId)
                                  setLocationSearch(r.rockName)
                                  setShowRockDropdown(false)
                                }}
                              >
                                {r.rockName}
                              </div>
                            ))}
                          {rocks.filter(r => r.rockName.toLowerCase().includes(locationSearch.toLowerCase())).length === 0 && (
                            <div className="p-2 text-sm text-gray-500">No rocks found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" value={latitude} onChange={e => setLatitude(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" value={longitude} onChange={e => setLongitude(e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
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
                placeholder="Search by rock name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" /> Map View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" /> List View
              </TabsTrigger>
            </TabsList>
            <TabsContent value="map">
              <MapView />
            </TabsContent>
            <TabsContent value="list">
              <div className="space-y-4">
                {filteredSpawns.map(spawn => {
                  const rockName = rocks.find(r => r.rockId === spawn.rockId)?.rockName || "Unknown Rock"
                  return (
                    <Card key={spawn.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Map className="h-5 w-5 text-green-600" />
                              <h3 className="text-lg font-semibold">{rockName}</h3>
                              <Badge variant="default">Active</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4" />
                              <span>{spawn.lat}°, {spawn.lng}°</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleDeleteDistribution(spawn.id)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
