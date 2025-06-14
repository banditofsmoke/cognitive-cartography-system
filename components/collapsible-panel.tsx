"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type CollapsiblePanelProps = {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function CollapsiblePanel({
  title,
  icon,
  children,
  defaultExpanded = true,
  className,
  headerClassName,
  contentClassName,
}: CollapsiblePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [isMinimized, setIsMinimized] = useState(false)

  if (isMinimized) {
    return (
      <Card className={cn("w-fit", className)}>
        <CardHeader className="p-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)} className="h-6 w-6 p-0">
              <Maximize2 className="h-3 w-3" />
            </Button>
            {icon && <div className="text-sm">{icon}</div>}
            <span className="text-sm font-medium truncate max-w-[100px]">{title}</span>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className={cn("transition-all duration-300 ease-in-out", className)}>
      <CardHeader className={cn("pb-2", headerClassName)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <div className="text-lg">{icon}</div>}
            <h3 className="text-sm font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-6 w-6 p-0">
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <CardContent className={cn("pt-0", contentClassName)}>{children}</CardContent>
      </div>
    </Card>
  )
}
