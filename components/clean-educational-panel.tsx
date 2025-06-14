"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Activity, Zap, Network } from "lucide-react"
import { TrueCollapsiblePanel } from "./true-collapsible-panel"

type CleanEducationalPanelProps = {
  activeRegions: string[]
}

const REGION_MAPPING = {
  "prefrontal-cortex": "Executive Control & Abstract Reasoning",
  "anterior-cingulate": "Conflict Monitoring & Emotional Regulation",
  amygdala: "Threat Detection & Fear Processing",
  hippocampus: "Memory Formation & Consolidation",
  "visual-cortex": "Visual Processing & Feature Extraction",
  "language-areas": "Speech & Language Processing",
  "parietal-association": "Spatial Processing & Integration",
  insula: "Interoception & Empathy",
  "reasoning-module-1": "Logical Inference & Problem Solving",
  "reasoning-module-2": "Meta-Reasoning & Abstract Thought",
  "attention-head-1": "Selective Attention & Focus",
  "embedding-layer-1": "Pattern Recognition & Memory Encoding",
  "embedding-layer-2": "Semantic Representation & Context",
  "language-processing": "Natural Language Understanding",
  "visual-processing": "Image Analysis & Object Recognition",
  "emotion-regulation": "Emotional Control & Modulation",
  "conflict-monitoring": "Decision Conflict & Error Detection",
  "fear-processing": "Threat Assessment & Survival Response",
  "threat-detection": "Danger Recognition & Alert Systems",
  "memory-formation": "Experience Encoding & Storage",
  "speech-production": "Verbal Expression & Articulation",
  comprehension: "Language Understanding & Interpretation",
  "semantic-processing": "Meaning Extraction & Context",
  "spatial-attention": "Location Awareness & Spatial Focus",
  "multimodal-integration": "Cross-Sensory Information Binding",
  "anterior-insula": "Body Awareness & Emotional Integration",
  interoception: "Internal Body State Monitoring",
  "empathy-networks": "Social Understanding & Perspective-Taking",
}

export function CleanEducationalPanel({ activeRegions }: CleanEducationalPanelProps) {
  const activeCount = activeRegions.length
  const processingLoad = Math.min(100, activeCount * 12)

  return (
    <TrueCollapsiblePanel
      title="Neural Activity Monitor"
      icon={<Brain className="h-4 w-4 text-blue-400" />}
      className="bg-black/60 backdrop-blur-md border-gray-800"
      defaultExpanded={true}
    >
      <div className="space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-blue-500/20 rounded border border-blue-500/30 text-center">
            <div className="text-blue-400 font-bold text-lg">{activeCount}</div>
            <div className="text-gray-300">Active Regions</div>
          </div>
          <div className="p-2 bg-green-500/20 rounded border border-green-500/30 text-center">
            <div className="text-green-400 font-bold text-lg">{processingLoad}%</div>
            <div className="text-gray-300">Neural Load</div>
          </div>
          <div className="p-2 bg-purple-500/20 rounded border border-purple-500/30 text-center">
            <div className="text-purple-400 font-bold text-lg">9</div>
            <div className="text-gray-300">Brain Areas</div>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
            <TabsTrigger value="active" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Active ({activeCount})
            </TabsTrigger>
            <TabsTrigger value="mapping" className="text-xs">
              <Network className="h-3 w-3 mr-1" />
              Brain-AI Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-3">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activeRegions.length > 0 ? (
                activeRegions.map((region) => {
                  const description = REGION_MAPPING[region as keyof typeof REGION_MAPPING] || "Neural Processing"
                  const intensity = Math.round(60 + Math.random() * 35)

                  return (
                    <div key={region} className="p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-400/30 text-xs">
                          {region.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                        <span className="text-xs text-blue-400 font-mono">{intensity}%</span>
                      </div>
                      <div className="text-xs text-gray-400">{description}</div>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${i < intensity / 20 ? "bg-blue-400" : "bg-gray-600"}`}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">No active regions</div>
                  <div className="text-xs mt-1">Select a scenario to observe neural activation</div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="mt-3">
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-gray-800/30 rounded">
                <h4 className="font-semibold mb-2 text-purple-400 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Brain → AI Architecture
                </h4>
                <div className="space-y-1 text-gray-300">
                  <div>• Prefrontal Cortex → Reasoning Modules</div>
                  <div>• Hippocampus → Embedding Layers</div>
                  <div>• Language Areas → NLP Components</div>
                  <div>• Visual Cortex → Computer Vision</div>
                  <div>• Anterior Cingulate → Conflict Resolution</div>
                </div>
              </div>

              <div className="p-2 bg-gray-800/30 rounded">
                <h4 className="font-semibold mb-2 text-green-400">Signal Flow</h4>
                <div className="text-gray-400 text-xs">
                  Particles trace neural pathways between active regions, visualizing information flow and cognitive
                  processing dynamics.
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TrueCollapsiblePanel>
  )
}
