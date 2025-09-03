"use client"

import { Clock, Eye, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

interface Lock {
  id: string
  token: "SOL" | "USDC"
  amount: number
  recipient: string
  unlockTime: Date
  status: "locked" | "unlocked" | "withdrawn"
  pda: string
  bump: number
  owner: string
  createdAt: Date
}

interface MobileLockCardProps {
  lock: Lock
  onViewDetails: (lock: Lock) => void
  onWithdraw: (lockId: string) => void
}

export function MobileLockCard({ lock, onViewDetails, onWithdraw }: MobileLockCardProps) {
  const timeRemaining = lock.unlockTime.getTime() - Date.now()
  const isUnlocked = timeRemaining <= 0

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return "Unlocked"

    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <Card className="glassmorphism">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-lg font-bold crypto-gradient-text">
              {lock.amount} {lock.token}
            </div>
            <div className="text-sm text-gray-400">
              To: {lock.recipient.slice(0, 8)}...{lock.recipient.slice(-8)}
            </div>
          </div>
          <Badge variant={lock.status === "locked" ? "secondary" : lock.status === "unlocked" ? "default" : "outline"}>
            {lock.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">{formatTimeRemaining(timeRemaining)}</span>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          PDA: {lock.pda.slice(0, 12)}...{lock.pda.slice(-12)}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(lock)} className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>

          {isUnlocked && lock.status !== "withdrawn" && (
            <Button size="sm" onClick={() => onWithdraw(lock.id)} className="flex-1 crypto-gradient">
              Withdraw
            </Button>
          )}

          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
