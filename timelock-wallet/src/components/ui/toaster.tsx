import React from 'react'

export function Toaster() {
  return (
    <div id="toast-container" className="fixed top-4 right-4 z-50">
      {/* Toast notifications will appear here */}
    </div>
  )
}

export function useToast() {
  const toast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const container = document.getElementById('toast-container')
    if (!container) return

    const toastEl = document.createElement('div')
    toastEl.className = `glass p-4 rounded-lg mb-2 text-white transition-all duration-300 ${
      type === 'success' ? 'bg-green-500/80' : 
      type === 'error' ? 'bg-red-500/80' : 
      'bg-blue-500/80'
    }`
    toastEl.textContent = message
    
    // Add slide-in animation
    toastEl.style.transform = 'translateX(100%)'
    toastEl.style.opacity = '0'
    
    container.appendChild(toastEl)
    
    // Trigger animation
    requestAnimationFrame(() => {
      toastEl.style.transform = 'translateX(0)'
      toastEl.style.opacity = '1'
    })
    
    setTimeout(() => {
      toastEl.style.transform = 'translateX(100%)'
      toastEl.style.opacity = '0'
      
      setTimeout(() => {
        if (container.contains(toastEl)) {
          container.removeChild(toastEl)
        }
      }, 300)
    }, 3000)
  }

  return { toast }
}