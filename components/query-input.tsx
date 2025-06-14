"use client"

import type React from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type QueryInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isProcessing: boolean
  response: string
}

export function QueryInput({ value, onChange, onSubmit, isProcessing, response }: QueryInputProps) {
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
      query.includes("why") ||
      query.includes("how") ||
      query.includes("explain") ||
      query.includes("reason") ||
      query.includes("logic")
    ) {
      return { type: "reasoning", label: "Reasoning", color: "bg-indigo-500" }
    }

    if (
      query.includes("image") ||
      query.includes("picture") ||
      query.includes("visual") ||
      query.includes("see") ||
      query.includes("look")
    ) {
      return { type: "visual", label: "Visual", color: "bg-pink-500" }
    }

    if (query.includes("remember") || query.includes("recall") || query.includes("memory")) {
      return { type: "memory", label: "Memory", color: "bg-blue-500" }
    }

    if (query.includes("compare") || query.includes("difference") || query.includes("similar")) {
      return { type: "comparison", label: "Comparison", color: "bg-purple-500" }
    }

    return { type: "general", label: "General", color: "bg-gray-500" }
  }

  const queryType = getQueryType(value)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a query to visualize AI neural activations..."
            className="min-h-[60px] bg-gray-900/50 border-gray-800 focus-visible:ring-blue-500 pr-16"
          />
          {queryType && value && (
            <Badge className={`absolute right-2 top-2 ${queryType.color}`}>{queryType.label}</Badge>
          )}
        </div>
        <Button onClick={onSubmit} disabled={isProcessing || !value.trim()} className="bg-blue-600 hover:bg-blue-700">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {(isProcessing || response) && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-3">
            <div className="text-sm">
              {response}
              {isProcessing && <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
