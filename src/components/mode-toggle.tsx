"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  // To avoid hydration mismatch, we need to make sure we don't render the switch until the component has mounted
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <Switch
        id="theme-toggle"
        checked={theme === "dark"}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
      <Moon className="h-[1.2rem] w-[1.2rem]" />
    </div>
  )
}
