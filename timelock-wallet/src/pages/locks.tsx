import React from 'react'
import { Timer } from 'lucide-react'

export function LocksPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Time Locks</h1>
      <div className="glass rounded-lg p-8">
        <div className="text-center text-white/60">
          <Timer className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No locked vaults yet.</p>
          <p className="text-sm">Create your first time lock to get started!</p>
        </div>
      </div>
    </div>
  )
}