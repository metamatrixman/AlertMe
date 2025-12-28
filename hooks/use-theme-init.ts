"use client"

import { useEffect } from "react"
import { initializeTheme } from "@/lib/theme-utils"

/**
 * Hook to initialize saved theme on page load
 */
export function useThemeInit() {
  useEffect(() => {
    initializeTheme()
  }, [])
}
