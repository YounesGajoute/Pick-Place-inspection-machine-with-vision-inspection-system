"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Video,
  Settings,
  ImageOff,
  TrendingUp,
  Wrench,
  PenTool as Tool,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/camera", icon: Video, label: "Live Camera" },
  { href: "/config", icon: Settings, label: "Configuration" },
  { href: "/failures", icon: ImageOff, label: "Failures" },
  { href: "/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/diagnostics", icon: Wrench, label: "Diagnostics" },
  { href: "/settings", icon: Tool, label: "Settings" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}

        <div className="my-2 border-t border-sidebar-border" />

        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10">
          <AlertTriangle className="h-5 w-5" />
          Emergency Stop
        </button>
      </nav>
    </aside>
  )
}
