"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ModelSelectorProps = {
  value: string
  onChange: (value: string) => void
}

const AVAILABLE_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", description: "Advanced reasoning model" },
  { id: "claude-3", name: "Claude 3", description: "Balanced reasoning model" },
  { id: "llama-3", name: "Llama 3", description: "Open source model" },
  { id: "gemini-pro", name: "Gemini Pro", description: "Multimodal capabilities" },
]

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-gray-900/50 border-gray-800">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent className="bg-gray-900 border-gray-800">
        {AVAILABLE_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex flex-col">
              <span>{model.name}</span>
              <span className="text-xs text-gray-400">{model.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
