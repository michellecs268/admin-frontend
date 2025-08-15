"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function DashboardHeader() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const pagesMap: Record<string, string> = {
    "Dashboard": "/dashboard",
    "User Management": "/dashboard/users",
    "Post Management": "/dashboard/posts",
    "Report Management": "/dashboard/reports",
    "Quests": "/dashboard/quests",
    "Rock Database": "/dashboard/rocks",
    "Rock Distribution": "/dashboard/distribution",
    "Announcements": "/dashboard/announcements",
    "Facts Management": "/dashboard/facts"
  }

  const pageNames = Object.keys(pagesMap)

  const filteredSuggestions = pageNames.filter(page =>
    page.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleSelect = (page: string) => {
    router.push(pagesMap[page])
    setSearchValue("")
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredSuggestions.length > 0) {
      handleSelect(filteredSuggestions[0])
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 relative">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex flex-1 items-center gap-2 relative">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={handleKeyDown}
          />

          {/* Dropdown Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="absolute z-50 bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg max-h-36 overflow-y-auto">
              {filteredSuggestions.map((page, idx) => (
                <li
                  key={idx}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(page)}
                >
                  {page}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  )
}
