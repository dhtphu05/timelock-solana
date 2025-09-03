"use client"

import { useState } from "react"
import { X, Copy, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { useToast } from "../hooks/use-toast"

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

interface LockDetailDrawerProps {
  lock: Lock | null
  isOpen: boolean
  onClose: () => void
}

export function LockDetailDrawer({ lock, isOpen, onClose }: LockDetailDrawerProps) {
  const { toast } = useToast()
  const [withdrawTo, setWithdrawTo] = useState<"owner" | "recipient" | "custom">("recipient")
  const [customAddress, setCustomAddress] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  if (!isOpen || !lock) return null

  const timeRemaining = lock.unlockTime.getTime() - Date.now()
  const isUnlocked = timeRemaining <= 0
  const progress = Math.max(
    0,
    Math.min(
      100,
      ((Date.now() - lock.createdAt.getTime()) / (lock.unlockTime.getTime() - lock.createdAt.getTime())) * 100,
    ),
  )

  const handleWithdraw = async () => {
    setIsWithdrawing(true)

    try {
      // Mock withdrawal logic
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Withdrawal Successful",
        description: `${lock.amount} ${lock.token} has been withdrawn`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Address copied successfully",
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold crypto-gradient-text">Lock Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 2.83} 283`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold crypto-gradient-text">{Math.round(progress)}%</div>
                <div className="text-xs text-gray-400">{isUnlocked ? "Unlocked" : "Locked"}</div>
              </div>
            </div>
          </div>

          {/* Lock Info */}
          <Card className="glassmorphism mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Lock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="font-bold">
                  {lock.amount} {lock.token}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <Badge
                  variant={lock.status === "locked" ? "secondary" : lock.status === "unlocked" ? "default" : "outline"}
                >
                  {lock.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Owner:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {lock.owner.slice(0, 8)}...{lock.owner.slice(-8)}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(lock.owner)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Recipient:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {lock.recipient.slice(0, 8)}...{lock.recipient.slice(-8)}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(lock.recipient)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unlock Time:</span>
                <span className="font-mono text-sm">{lock.unlockTime.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">PDA:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">
                    {lock.pda.slice(0, 8)}...{lock.pda.slice(-8)}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(lock.pda)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bump:</span>
                <span className="font-mono">{lock.bump}</span>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Section */}
          {isUnlocked && lock.status !== "withdrawn" && (
            <Card className="glassmorphism mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Withdraw Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-to">Withdraw to:</Label>
                  <Select
                    value={withdrawTo}
                    onValueChange={(value: "owner" | "recipient" | "custom") => setWithdrawTo(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner Address</SelectItem>
                      <SelectItem value="recipient">Recipient Address</SelectItem>
                      <SelectItem value="custom">Custom Address</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {withdrawTo === "custom" && (
                  <div>
                    <Label htmlFor="custom-address">Custom Address:</Label>
                    <Input
                      id="custom-address"
                      placeholder="Enter Solana address..."
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                    />
                  </div>
                )}

                <Button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || (withdrawTo === "custom" && !customAddress)}
                  className="w-full crypto-gradient"
                >
                  {isWithdrawing ? "Withdrawing..." : `Withdraw ${lock.amount} ${lock.token}`}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Transaction History */}
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="text-lg">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium">Lock Created</div>
                      <div className="text-sm text-gray-400">{lock.createdAt.toLocaleString()}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {lock.status === "withdrawn" && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Funds Withdrawn</div>
                        <div className="text-sm text-gray-400">Recently</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
