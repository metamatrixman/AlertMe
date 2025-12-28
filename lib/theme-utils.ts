/**
 * Theme utilities for handling theme persistence and initialization
 */

// Helper function to convert hex to RGB values
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Helper function to convert hex to HSL
export const hexToHsl = (hex: string): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return "0 0% 0%"

  let r = rgb.r / 255
  let g = rgb.g / 255
  let b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  const hue = Math.round(h * 360)
  const saturation = Math.round(s * 100)
  const lightness = Math.round(l * 100)

  return `${hue} ${saturation}% ${lightness}%`
}

export interface StoredTheme {
  themeId: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
}

// Initialize theme from localStorage on page load
export const initializeTheme = (): void => {
  if (typeof window === "undefined") return

  try {
    const savedTheme = localStorage.getItem("ecobank-theme")
    if (savedTheme) {
      const theme = JSON.parse(savedTheme) as StoredTheme
      applyTheme(theme)
    }
  } catch (error) {
    console.warn("Failed to initialize theme:", error)
  }
}

// Apply theme to document
export const applyTheme = (theme: StoredTheme): void => {
  if (typeof document === "undefined") return

  const primaryHsl = hexToHsl(theme.primary)
  const secondaryHsl = hexToHsl(theme.secondary)
  const accentHsl = hexToHsl(theme.accent)
  const backgroundHsl = hexToHsl(theme.background)

  document.documentElement.style.setProperty("--primary", primaryHsl)
  document.documentElement.style.setProperty("--secondary", secondaryHsl)
  document.documentElement.style.setProperty("--accent", accentHsl)
  document.documentElement.style.setProperty("--background", backgroundHsl)

  // Also set the Tailwind color values directly
  document.documentElement.style.setProperty("--primary-color", theme.primary)
  document.documentElement.style.setProperty("--secondary-color", theme.secondary)
  document.documentElement.style.setProperty("--accent-color", theme.accent)
  document.documentElement.style.setProperty("--background-color", theme.background)
}
