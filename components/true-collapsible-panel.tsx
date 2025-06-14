"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronUp, Minimize2, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TrueCollapsiblePanelProps = {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  defaultMinimized?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
  onStateChange?: (state: "expanded" | "collapsed" | "minimized" | "hidden") => void
}

export function TrueCollapsiblePanel({
  title,
  icon,
  children,
  defaultExpanded = true,
  defaultMinimized = false,
  className,
  headerClassName,
  contentClassName,
  onStateChange,
}: TrueCollapsiblePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded && !defaultMinimized)
  const [isMinimized, setIsMinimized] = useState(defaultMinimized)
  const [isHidden, setIsHidden] = useState(false)

  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onStateChange?.(newExpanded ? "expanded" : "collapsed")
  }

  const handleToggleMinimized = () => {
    const newMinimized = !isMinimized
    setIsMinimized(newMinimized)
    setIsExpanded(!newMinimized)
    onStateChange?.(newMinimized ? "minimized" : "expanded")
  }

  const handleHide = () => {
    setIsHidden(true)
    onStateChange?.("hidden")
  }

  const handleShow = () => {
    setIsHidden(false)
    setIsMinimized(false)
    setIsExpanded(true)
    onStateChange?.("expanded")
  }

  // If hidden, show only a small restore button
  if (isHidden) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShow}
          className="h-8 w-8 p-0 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600"
        >
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  // If minimized, show only the header bar
  if (isMinimized) {
    return (
      <Card className={cn("w-fit max-w-xs", className)}>
        <CardHeader className="p-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleToggleMinimized} className="h-6 w-6 p-0">
              <Maximize2 className="h-3 w-3" />
            </Button>
            {icon && <div className="text-sm">{icon}</div>}
            <span className="text-sm font-medium truncate max-w-[120px]">{title}</span>
            <Button variant="ghost" size="sm" onClick={handleHide} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    )
  }

  // Full panel
  return (
    <Card className={cn("transition-all duration-300 ease-in-out", className)}>
      <CardHeader className={cn("pb-2", headerClassName)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <div className="text-lg">{icon}</div>}
            <h3 className="text-sm font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleToggleExpanded} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleToggleMinimized} className="h-6 w-6 p-0">
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleHide} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && <CardContent className={cn("pt-0", contentClassName)}>{children}</CardContent>}
    </Card>
  )
}
