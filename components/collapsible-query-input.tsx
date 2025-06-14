"use client"

import type React from "react"
import { Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CollapsiblePanel } from "./collapsible-panel"

type CollapsibleQueryInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isProcessing: boolean
  response: string
}

export function CollapsibleQueryInput({
  value,
  onChange,
  onSubmit,
  isProcessing,
  response,
}: CollapsibleQueryInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  // Detect query type for UI feedback
  const getQueryType = (query: string) => {
    if (!query) return null

    if (
      query.includes("optimize") ||
      query.includes("utility") ||
      query.includes("goal") ||
      query.includes("maximize")
    ) {
      return { type: "optimization", label: "Optimization", color: "bg-red-500" }
    }

    if (
      query.includes("consciousness") ||
      query.includes("upload") ||
      query.includes("identity") ||
      query.includes("self")
    ) {
      return { type: "consciousness", label: "Consciousness", color: "bg-purple-500" }
    }

    if (
      query.includes("value") ||
      query.includes("moral") ||
      query.includes("ethical") ||
      query.includes("preference")
    ) {
      return { type: "values", label: "Values", color: "bg-blue-500" }
    }

    if (
      query.includes("mesa") ||
      query.includes("inner") ||
      query.includes("recursive") ||
      query.includes("alignment")
    ) {
      return { type: "alignment", label: "Alignment", color: "bg-orange-500" }
    }

    if (query.includes("threat") || query.includes("risk") || query.includes("danger") || query.includes("safety")) {
      return { type: "risk", label: "Risk", color: "bg-yellow-500" }
    }

    return { type: "general", label: "General", color: "bg-gray-500" }
  }

  const queryType = getQueryType(value)

  return (
    <CollapsiblePanel
      title="Cognitive Query Interface"
      icon={<MessageSquare className="h-4 w-4 text-green-400" />}
      className="bg-black/40 backdrop-blur-md border-gray-800"
      defaultExpanded={true}
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a rationalist scenario to visualize neural activation patterns..."
              className="min-h-[80px] bg-gray-900/50 border-gray-800 focus-visible:ring-blue-500 pr-16 text-sm"
            />
            {queryType && value && (
              <Badge className={`absolute right-2 top-2 ${queryType.color} text-xs`}>{queryType.label}</Badge>
            )}
          </div>
          <Button
            onClick={onSubmit}
            disabled={isProcessing || !value.trim()}
            className="bg-blue-600 hover:bg-blue-700 self-start mt-1"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            Processing cognitive scenario...
          </div>
        )}

        {/* Response display */}
        {(isProcessing || response) && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-3">
              <div className="text-sm leading-relaxed">
                {response}
                {isProcessing && <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Query suggestions */}
        {!value && (
          <div className="text-xs text-gray-500">
            <div className="mb-1">Try scenarios like:</div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs bg-gray-800/50">
                AI optimization
              </Badge>
              <Badge variant="outline" className="text-xs bg-gray-800/50">
                Value alignment
              </Badge>
              <Badge variant="outline" className="text-xs bg-gray-800/50">
                Mesa-optimization
              </Badge>
              <Badge variant="outline" className="text-xs bg-gray-800/50">
                Consciousness upload
              </Badge>
            </div>
          </div>
        )}
      </div>
    </CollapsiblePanel>
  )
}
