"use client"

import { Droplets, Gift } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useWallet } from "./wallet-provider"
import { useToast } from "../hooks/use-toast"

export function DevnetTools() {
  const { network, connected } = useWallet()
  const { toast } = useToast()

  if (network !== "devnet" || !connected) return null

  const handleFaucet = async () => {
    toast({
      title: "SOL Faucet",
      description: "2 SOL has been added to your wallet",
    })
  }

  const handleAirdrop = async () => {
    toast({
      title: "USDC Airdrop",
      description: "100 USDC has been added to your wallet",
    })
  }

  return (
    <Card className="glassmorphism mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Devnet Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Button onClick={handleFaucet} variant="outline" className="flex-1 bg-transparent">
            <Droplets className="h-4 w-4 mr-2" />
            SOL Faucet
          </Button>
          <Button onClick={handleAirdrop} variant="outline" className="flex-1 bg-transparent">
            <Gift className="h-4 w-4 mr-2" />
            USDC Airdrop
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
