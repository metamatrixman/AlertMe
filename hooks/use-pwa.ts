"use client"

import { useState, useEffect, useCallback } from "react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAState {
  isInstalled: boolean
  isStandalone: boolean
  isFullscreen: boolean
  canInstall: boolean
  isOnline: boolean
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isStandalone: false,
    isFullscreen: false,
    canInstall: false,
    isOnline: true,
  })
  
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  // Check if running in standalone mode
  const checkStandalone = useCallback(() => {
    if (typeof window === "undefined") return false
    
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://")
    )
  }, [])

  // Check if fullscreen is active
  const checkFullscreen = useCallback(() => {
    if (typeof document === "undefined") return false
    
    return !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    )
  }, [])

  // Request fullscreen
  const requestFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return false
    
    const elem = document.documentElement
    
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen()
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen()
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen()
      } else if ((elem as any).mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen()
      }
      return true
    } catch (error) {
      console.error("[Ecobank Express] Fullscreen request failed:", error)
      return false
    }
  }, [])

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return false
    
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen()
      }
      return true
    } catch (error) {
      console.error("[Ecobank Express] Exit fullscreen failed:", error)
      return false
    }
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (checkFullscreen()) {
      return exitFullscreen()
    } else {
      return requestFullscreen()
    }
  }, [checkFullscreen, exitFullscreen, requestFullscreen])

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) {
      console.log("[Ecobank Express] No install prompt available")
      return false
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === "accepted") {
        console.log("[Ecobank Express] PWA installed successfully")
        setDeferredPrompt(null)
        setState(prev => ({ ...prev, canInstall: false, isInstalled: true }))
        return true
      } else {
        console.log("[Ecobank Express] PWA installation dismissed")
        return false
      }
    } catch (error) {
      console.error("[Ecobank Express] PWA installation failed:", error)
      return false
    }
  }, [deferredPrompt])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Initial state
    setState(prev => ({
      ...prev,
      isStandalone: checkStandalone(),
      isFullscreen: checkFullscreen(),
      isOnline: navigator.onLine,
    }))

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setState(prev => ({ ...prev, canInstall: true }))
      console.log("[Ecobank Express] Install prompt available")
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setState(prev => ({ ...prev, canInstall: false, isInstalled: true }))
      console.log("[Ecobank Express] App was installed")
    }

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setState(prev => ({ ...prev, isFullscreen: checkFullscreen() }))
    }

    // Listen for online/offline
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, isStandalone: e.matches }))
    }

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)
    
    mediaQuery.addEventListener("change", handleDisplayModeChange)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
      
      mediaQuery.removeEventListener("change", handleDisplayModeChange)
    }
  }, [checkStandalone, checkFullscreen])

  return {
    ...state,
    requestFullscreen,
    exitFullscreen,
    toggleFullscreen,
    installPWA,
  }
}
