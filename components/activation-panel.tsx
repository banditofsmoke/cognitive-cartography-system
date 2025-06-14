"use client"

import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ActivationPanelProps = {
  activeRegions: string[]
  intensity: number
  onIntensityChange: (value: number[]) => void
}

// Map region IDs to human-readable names and transformer components
const REGION_INFO: Record<string, { name: string; function: string; component: string }> = {
  "attention-head-1": {
    name: "Attention Head 1",
    function: "Self-attention for semantic relationships",
    component: "Multi-head Attention",
  },
  "attention-head-2": {
    name: "Attention Head 2",
    function: "Self-attention for syntactic patterns",
    component: "Multi-head Attention",
  },
  "attention-head-3": {
    name: "Attention Head 3",
    function: "Cross-attention for context",
    component: "Multi-head Attention",
  },
  "reasoning-module-1": {
    name: "Reasoning Module 1",
    function: "Logical inference processing",
    component: "Feed-forward Network",
  },
  "reasoning-module-2": {
    name: "Reasoning Module 2",
    function: "Abstract concept formation",
    component: "Feed-forward Network",
  },
  "language-processing": {
    name: "Language Processing",
    function: "Natural language understanding",
    component: "Encoder Layer",
  },
  "embedding-layer-1": {
    name: "Embedding Layer 1",
    function: "Token embedding storage",
    component: "Embedding Matrix",
  },
  "embedding-layer-2": {
    name: "Embedding Layer 2",
    function: "Positional encoding",
    component: "Positional Encoding",
  },
  "visual-processing": {
    name: "Visual Processing",
    function: "Image feature extraction",
    component: "Vision Encoder",
  },
  "multimodal-integration": {
    name: "Multimodal Integration",
    function: "Cross-modal feature fusion",
    component: "Cross-attention Layer",
  },
  "fine-tuning": {
    name: "Fine-tuning Module",
    function: "Parameter optimization",
    component: "Gradient Descent",
  },
}

export function ActivationPanel({ activeRegions, intensity, onIntensityChange }: ActivationPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Activation Intensity</span>
          <span className="text-sm font-medium">{Math.round(intensity * 100)}%</span>
        </div>
        <Slider
          value={[intensity]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={onIntensityChange}
          className="[&>span]:bg-blue-600"
        />
      </div>

      <div>
        <h3 className="text-sm text-gray-400 mb-2">Active Regions</h3>
        {activeRegions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {activeRegions.map((region) => {
              const info = REGION_INFO[region] || {
                name: region,
                function: "Unknown function",
                component: "Unknown component",
              }

              return (
                <TooltipProvider key={region}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col gap-1 p-2 rounded-md bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-gray-900/50 text-blue-400 border-blue-400/30">
                            {info.name}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {Math.round(intensity * 70 + Math.random() * 30)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">{info.function}</p>
                          <Badge variant="secondary" className="text-[10px] h-5">
                            {info.component}
                          </Badge>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-medium">{info.name}</p>
                        <p className="text-sm">{info.function}</p>
                        <div className="pt-2 border-t border-gray-800">
                          <span className="text-xs text-gray-400">Transformer Component:</span>
                          <p className="text-sm font-medium">{info.component}</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-500 p-4 text-center border border-gray-800 rounded-md">
            No active regions
            <p className="text-xs text-gray-600 mt-1">Enter a query to activate brain regions</p>
          </div>
        )}
      </div>
    </div>
  )
}
