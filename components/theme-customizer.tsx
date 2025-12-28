"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Palette, Check } from "lucide-react"
import { hexToHsl } from "@/lib/theme-utils"

interface ThemeCustomizerProps {
  onBack: () => void
}

interface Theme {
  id: string
  name: string
  description: string
  primary: string
  secondary: string
  accent: string
  background: string
  preview: {
    headerBg: string
    cardBg: string
    buttonBg: string
    textColor: string
  }
}

export function ThemeCustomizer({ onBack }: ThemeCustomizerProps) {
  const [selectedTheme, setSelectedTheme] = useState("ecobank")

  // Helper function to convert hex to RGB values
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  // Based on the knowledge base theme definitions [^1]
  const themes: Theme[] = [
    {
      id: "ecobank",
      name: "Ecobank",
      description: "Bold green and blue, showcasing a pan-African connection",
      primary: "#004A9F",
      secondary: "#00B2A9",
      accent: "#A4D233",
      background: "#FAFAFA",
      preview: {
        headerBg: "#004A9F",
        cardBg: "#FFFFFF",
        buttonBg: "#A4D233",
        textColor: "#212121",
      },
    },
    {
      id: "access",
      name: "Access Bank",
      description: "Corporate and vibrant blue with accents of green",
      primary: "#0072C6",
      secondary: "#4CAF50",
      accent: "#00B2A9",
      background: "#F5F5F5",
      preview: {
        headerBg: "#0072C6",
        cardBg: "#FFFFFF",
        buttonBg: "#4CAF50",
        textColor: "#212121",
      },
    },
    {
      id: "zenith",
      name: "Zenith Bank",
      description: "Professional and modern blue and white interface",
      primary: "#1565C0",
      secondary: "#FFFFFF",
      accent: "#0072C6",
      background: "#FAFAFA",
      preview: {
        headerBg: "#1565C0",
        cardBg: "#FFFFFF",
        buttonBg: "#0072C6",
        textColor: "#212121",
      },
    },
    {
      id: "firstbank",
      name: "First Bank",
      description: "Classic with a blend of navy blue and gold",
      primary: "#003366",
      secondary: "#FFD700",
      accent: "#FFC107",
      background: "#EEEEEE",
      preview: {
        headerBg: "#003366",
        cardBg: "#FFFFFF",
        buttonBg: "#FFD700",
        textColor: "#212121",
      },
    },
    {
      id: "gtbank",
      name: "GTBank",
      description: "Minimalist white and orange design with a tech-savvy feel",
      primary: "#FF6F00",
      secondary: "#FFFFFF",
      accent: "#FF8F00",
      background: "#FAFAFA",
      preview: {
        headerBg: "#FF6F00",
        cardBg: "#FFFFFF",
        buttonBg: "#FF8F00",
        textColor: "#212121",
      },
    },
    {
      id: "uba",
      name: "UBA",
      description: "Bold red and black with a pan-African flair",
      primary: "#E53935",
      secondary: "#212121",
      accent: "#FF5722",
      background: "#F5F5F5",
      preview: {
        headerBg: "#E53935",
        cardBg: "#FFFFFF",
        buttonBg: "#FF5722",
        textColor: "#212121",
      },
    },
    {
      id: "fidelity",
      name: "Fidelity Bank",
      description: "Trustworthy green and white, projecting stability",
      primary: "#4CAF50",
      secondary: "#FFFFFF",
      accent: "#66BB6A",
      background: "#FAFAFA",
      preview: {
        headerBg: "#4CAF50",
        cardBg: "#FFFFFF",
        buttonBg: "#66BB6A",
        textColor: "#212121",
      },
    },
    {
      id: "stanbic",
      name: "Stanbic IBTC",
      description: "Corporate blue and yellow theme representing professionalism",
      primary: "#004A9F",
      secondary: "#FFC107",
      accent: "#FFEB3B",
      background: "#F5F5F5",
      preview: {
        headerBg: "#004A9F",
        cardBg: "#FFFFFF",
        buttonBg: "#FFC107",
        textColor: "#212121",
      },
    },
    {
      id: "wema",
      name: "Wema Bank",
      description: "Modern purple and white interface with a youthful appeal",
      primary: "#7B1FA2",
      secondary: "#FFFFFF",
      accent: "#9C27B0",
      background: "#FAFAFA",
      preview: {
        headerBg: "#7B1FA2",
        cardBg: "#FFFFFF",
        buttonBg: "#9C27B0",
        textColor: "#212121",
      },
    },
    {
      id: "union",
      name: "Union Bank",
      description: "Classic blue with a touch of orange, blending tradition and modernity",
      primary: "#1565C0",
      secondary: "#FF6F00",
      accent: "#FF8F00",
      background: "#EEEEEE",
      preview: {
        headerBg: "#1565C0",
        cardBg: "#FFFFFF",
        buttonBg: "#FF6F00",
        textColor: "#212121",
      },
    },
    {
      id: "sterling",
      name: "Sterling Bank",
      description: "Clean green and white theme focused on innovation",
      primary: "#4CAF50",
      secondary: "#FFFFFF",
      accent: "#8BC34A",
      background: "#F5F5F5",
      preview: {
        headerBg: "#4CAF50",
        cardBg: "#FFFFFF",
        buttonBg: "#8BC34A",
        textColor: "#212121",
      },
    },
    {
      id: "dark",
      name: "Dark Theme",
      description: "Modern dark interface with yellow accents",
      primary: "#1F1F1F",
      secondary: "#FFC107",
      accent: "#FFEB3B",
      background: "#121212",
      preview: {
        headerBg: "#1F1F1F",
        cardBg: "#2D2D2D",
        buttonBg: "#FFC107",
        textColor: "#FFFFFF",
      },
    },
    {
      id: "light",
      name: "Light Theme",
      description: "Clean light interface with red accents",
      primary: "#FFFFFF",
      secondary: "#E53935",
      accent: "#FF5722",
      background: "#FAFAFA",
      preview: {
        headerBg: "#FFFFFF",
        cardBg: "#FFFFFF",
        buttonBg: "#E53935",
        textColor: "#212121",
      },
    },
  ]

  // Helper function to convert hex to RGB values
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
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
  const hexToHsl = (hex: string): string => {
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

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    // Apply theme to document root
    const theme = themes.find((t) => t.id === themeId)
    if (theme) {
      // Convert hex colors to HSL and apply to CSS variables
      const primaryHsl = hexToHsl(theme.primary)
      const secondaryHsl = hexToHsl(theme.secondary)
      const accentHsl = hexToHsl(theme.accent)
      const backgroundHsl = hexToHsl(theme.background)

      document.documentElement.style.setProperty("--primary", primaryHsl)
      document.documentElement.style.setProperty("--secondary", secondaryHsl)
      document.documentElement.style.setProperty("--accent", accentHsl)
      document.documentElement.style.setProperty("--background", backgroundHsl)

      // Also set the Tailwind color values directly for components that use hardcoded colors
      document.documentElement.style.setProperty("--primary-color", theme.primary)
      document.documentElement.style.setProperty("--secondary-color", theme.secondary)
      document.documentElement.style.setProperty("--accent-color", theme.accent)
      document.documentElement.style.setProperty("--background-color", theme.background)

      // Save theme preference
      localStorage.setItem("ecobank-theme", JSON.stringify({ themeId, ...theme }))
      
      // Trigger a change event to notify other components
      window.dispatchEvent(new CustomEvent("themeChanged", { detail: { themeId, theme } }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Theme Customizer</h1>
        <Palette className="h-5 w-5 text-[#004A9F]" />
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Current Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Current Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{themes.find((t) => t.id === selectedTheme)?.name}</div>
                <div className="text-sm text-gray-600">{themes.find((t) => t.id === selectedTheme)?.description}</div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Themes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTheme === theme.id ? "border-[#004A9F] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {theme.name}
                      {selectedTheme === theme.id && <Check className="h-4 w-4 text-[#004A9F]" />}
                    </div>
                    <div className="text-sm text-gray-600">{theme.description}</div>
                  </div>
                </div>

                {/* Theme Preview */}
                <div className="bg-gray-100 rounded-lg p-3 space-y-2">
                  {/* Header Preview */}
                  <div
                    className="h-8 rounded flex items-center px-3"
                    style={{ backgroundColor: theme.preview.headerBg }}
                  >
                    <div className="w-2 h-2 bg-white/80 rounded-full mr-2"></div>
                    <div className="text-xs text-white font-medium">Header</div>
                  </div>

                  {/* Card Preview */}
                  <div
                    className="h-12 rounded p-2 flex items-center justify-between"
                    style={{ backgroundColor: theme.preview.cardBg }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="w-16 h-1 bg-gray-300 rounded"></div>
                        <div className="w-12 h-1 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div
                      className="px-3 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: theme.preview.buttonBg,
                        color: theme.id === "dark" ? "#000" : "#fff",
                      }}
                    >
                      Button
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 text-center">
                      <div className="w-full h-4 rounded mb-1" style={{ backgroundColor: theme.primary }}></div>
                      <div className="text-xs text-gray-600">Primary</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="w-full h-4 rounded mb-1" style={{ backgroundColor: theme.secondary }}></div>
                      <div className="text-xs text-gray-600">Secondary</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="w-full h-4 rounded mb-1" style={{ backgroundColor: theme.accent }}></div>
                      <div className="text-xs text-gray-600">Accent</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Apply Theme Button */}
        <Button
          onClick={() => handleThemeSelect(selectedTheme)}
          className="w-full bg-[#004A9F] hover:bg-[#003875] text-white py-3"
        >
          Apply Selected Theme
        </Button>
      </div>
    </div>
  )
}
