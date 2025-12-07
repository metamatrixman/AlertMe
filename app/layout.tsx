import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ecobank - The Pan African Bank",
  description: "Ecobank mobile banking app - seamless financial services across Africa",
  generator: "v0.dev",
  manifest: "/manifest.json",
  themeColor: "#004A9F",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ecobank",
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icon-192.png" },
  ],
}

const PWAScript = `
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/api/sw")
        .then((registration) => {
          console.log("[v0] Service Worker registered successfully")
        })
        .catch((error) => {
          console.log("[v0] Service Worker registration skipped:", error?.message)
        })
    })
  }
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <script dangerouslySetInnerHTML={{ __html: PWAScript }} />
      </head>
      <body className={`${geistSans.className} antialiased`}>{children}</body>
    </html>
  )
}
