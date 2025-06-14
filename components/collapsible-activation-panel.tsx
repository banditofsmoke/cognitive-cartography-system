"use client"

import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CollapsiblePanel } from "./collapsible-panel"
import { Activity, Zap } from "lucide-react"

type CollapsibleActivationPanelProps = {
  activeRegions: string[]
  intensity: number
  onIntensityChange: (value: number[]) => void
}

// Enhanced region mapping with Yudkowsky-style descriptions
const COGNITIVE_REGION_INFO: Record<string, { name: string; function: string; component: string; insight: string }> = {
  "reasoning-module-1": {
    name: "Abstract Reasoning",
    function: "Long-term consequence modeling and logical inference",
    component: "Transformer Reasoning Layer",
    insight: "Where humans transcend immediate sensory experience through symbolic manipulation",
  },
  "reasoning-module-2": {
    name: "Meta-Reasoning",
    function: "Reasoning about reasoning - the recursive depth of cognition",
    component: "Self-Attention Mechanism",
    insight: "The neural substrate of thinking about thinking - consciousness examining itself",
  },
  "attention-head-1": {
    name: "Executive Attention",
    function: "Top-down attentional control and cognitive flexibility",
    component: "Multi-Head Attention",
    insight: "The spotlight of consciousness - what gets attended to shapes what gets processed",
  },
  "prefrontal-cortex": {
    name: "Prefrontal Executive",
    function: "Goal-directed behavior and temporal abstraction",
    component: "Goal-Conditioned Policy",
    insight: "The neural architecture of agency - where intentions become actions",
  },
  "anterior-cingulate": {
    name: "Conflict Monitor",
    function: "Detecting conflicts between competing goals and values",
    component: "Error Detection Network",
    insight: "The computational substrate of moral uncertainty and value conflicts",
  },
  amygdala: {
    name: "Threat Detection",
    function: "Rapid threat assessment and fear conditioning",
    component: "Anomaly Detection System",
    insight: "Evolution's gift - a hypervigilant module optimized for ancestral dangers",
  },
  hippocampus: {
    name: "Memory Consolidation",
    function: "Converting experiences into retrievable patterns",
    component: "Embedding Layer",
    insight: "The biological implementation of associative memory - where moments become knowledge",
  },
  "visual-processing": {
    name: "Visual Feature Extraction",
    function: "Hierarchical processing of visual information",
    component: "Convolutional Network",
    insight: "The neural network that evolution built - hierarchical feature detection incarnate",
  },
  "language-processing": {
    name: "Linguistic Computation",
    function: "Converting thoughts into communicable symbols",
    component: "Language Model",
    insight: "Where internal representations become shareable tokens - the basis of human cooperation",
  },
  "multimodal-integration": {
    name: "Cross-Modal Binding",
    function: "Integrating information across sensory modalities",
    component: "Fusion Layer",
    insight: "Where separate data streams converge into unified world-models - solving the binding problem",
  },
}

export function CollapsibleActivationPanel({
  activeRegions,
  intensity,
  onIntensityChange,
}: CollapsibleActivationPanelProps) {
  return (
    <div className="space-y-3">
      {/* Intensity Control */}
      <CollapsiblePanel
        title="Neural Signal Intensity"
        icon={<Zap className="h-4 w-4 text-yellow-400" />}
        className="bg-black/40 backdrop-blur-md border-gray-800"
        defaultExpanded={true}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Activation Strength</span>
            <span className="text-sm font-medium text-yellow-400">{Math.round(intensity * 100)}%</span>
          </div>
          <Slider
            value={[intensity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={onIntensityChange}
            className="[&>span]:bg-yellow-600"
          />
          <div className="text-xs text-gray-500">
            Controls particle density, signal flow speed, and region luminosity
          </div>
        </div>
      </CollapsiblePanel>

      {/* Active Regions */}
      <CollapsiblePanel
        title="Active Cognitive Regions"
        icon={<Activity className="h-4 w-4 text-blue-400" />}
        className="bg-black/40 backdrop-blur-md border-gray-800"
        defaultExpanded={true}
      >
        <div className="space-y-3">
          {activeRegions.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm text-blue-400 mb-2">
                Neural Load: {activeRegions.length} regions • {Math.round(intensity * 100)}% intensity
              </div>
              {activeRegions.slice(0, 6).map((region) => {
                const info = COGNITIVE_REGION_INFO[region] || {
                  name: region.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                  function: "Cognitive processing module",
                  component: "Neural Network Component",
                  insight: "Part of the computational architecture of mind",
                }

                return (
                  <TooltipProvider key={region}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-help">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-400/30">
                              {info.name}
                            </Badge>
                            <span className="text-xs text-blue-400 font-mono">
                              {Math.round(intensity * 70 + Math.random() * 30)}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mb-1">{info.function}</div>
                          <div className="flex justify-between items-center">
                            <Badge variant="secondary" className="text-[10px] h-5 bg-gray-800/50">
                              {info.component}
                            </Badge>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 h-1 rounded-full ${
                                    i < intensity * 5 ? "bg-blue-400" : "bg-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs bg-black/90 border-blue-500/30">
                        <div className="space-y-2">
                          <p className="font-medium text-blue-300">{info.name}</p>
                          <p className="text-sm text-gray-300">{info.function}</p>
                          <div className="pt-2 border-t border-gray-700">
                            <span className="text-xs text-gray-400">AI Component:</span>
                            <p className="text-sm font-medium text-purple-300">{info.component}</p>
                          </div>
                          <div className="pt-2 border-t border-gray-700">
                            <span className="text-xs text-yellow-400">Rationalist Insight:</span>
                            <p className="text-xs italic text-yellow-200">{info.insight}</p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
              {activeRegions.length > 6 && (
                <div className="text-xs text-gray-400 text-center p-2 bg-gray-800/30 rounded">
                  +{activeRegions.length - 6} additional regions processing
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">Neural networks at rest</div>
              <div className="text-xs mt-1">Select a cognitive scenario to observe dynamic activation patterns</div>
            </div>
          )}
        </div>
      </CollapsiblePanel>
    </div>
  )
}
