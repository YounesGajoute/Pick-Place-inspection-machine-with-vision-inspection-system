import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pick & Place Control System",
  description: "Industrial automation dashboard for dual pick-and-place system with vision inspection",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AppHeader />
          <AppSidebar />
          <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)]">{children}</main>
          <footer className="ml-64 border-t border-border bg-card px-6 py-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>v1.2.3 | Last Update: 2s ago</span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse-status" />
                Connected
              </span>
            </div>
          </footer>
          <Toaster />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
