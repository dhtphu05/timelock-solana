"use client"

import { Button } from "./ui/button"
import { useLocation, useNavigate } from "react-router-dom"

interface NavigationTabsProps {
  activeTab: "create" | "locks"
  onTabChange: (tab: "create" | "locks") => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleTabChange = (tab: "create" | "locks") => {
    onTabChange(tab)
    // Update URL based on tab selection
    if (tab === "create") {
      navigate("/")
    } else {
      navigate("/locks")
    }
  }

  return (
    <div className="flex justify-center mb-8">
      <div className="glassmorphism rounded-lg p-1 inline-flex">
        <Button
          variant={activeTab === "create" ? "default" : "ghost"}
          onClick={() => handleTabChange("create")}
          className={`px-6 py-2 rounded-md transition-all ${
            activeTab === "create" ? "crypto-gradient text-white shadow-lg" : "text-gray-300 hover:text-white"
          }`}
        >
          Create Lock
        </Button>
        <Button
          variant={activeTab === "locks" ? "default" : "ghost"}
          onClick={() => handleTabChange("locks")}
          className={`px-6 py-2 rounded-md transition-all ${
            activeTab === "locks" ? "crypto-gradient text-white shadow-lg" : "text-gray-300 hover:text-white"
          }`}
        >
          My Locks
        </Button>
      </div>
    </div>
  )
}
