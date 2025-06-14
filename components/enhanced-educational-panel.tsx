"use client"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Database, Cpu, Network, Activity, Zap } from "lucide-react"
import { CollapsiblePanel } from "./collapsible-panel"

type EnhancedEducationalPanelProps = {
  activeRegions: string[]
}

const CONCEPT_EXPLANATIONS = {
  "brain-ai-mapping": {
    title: "Brain-AI Architecture Mapping",
    icon: Brain,
    content: [
      "This visualization maps human brain regions to AI transformer components:",
      "• Brodmann Areas → Attention Mechanisms",
      "• Hippocampus → Embedding Layers",
      "• Prefrontal Cortex → Reasoning Modules",
      "• Visual Cortex → Feature Extraction",
      "• Cerebellum → Fine-tuning & Optimization",
    ],
  },
  "embedding-concept": {
    title: "Neural Embeddings Database",
    icon: Database,
    content: [
      "Each brain region contains specialized embedding models:",
      "• Semantic embeddings in language areas",
      "• Spatial embeddings in parietal regions",
      "• Emotional embeddings in limbic system",
      "• Memory embeddings in hippocampus",
      "• Motor embeddings in motor cortex",
    ],
  },
  "transformer-mapping": {
    title: "Transformer Architecture",
    icon: Cpu,
    content: [
      "AI components mapped to anatomical structures:",
      "• Multi-head Attention → Prefrontal Networks",
      "• Feed-forward Layers → Processing Pathways",
      "• Layer Normalization → Neural Regulation",
      "• Positional Encoding → Spatial Processing",
      "• Residual Connections → Neural Plasticity",
    ],
  },
}

const BRODMANN_DETAILS = {
  BA4: "Primary Motor Cortex - Motor Control & Movement",
  BA9: "Dorsolateral Prefrontal - Working Memory & Attention",
  BA17: "Primary Visual - Basic Feature Detection",
  BA22: "Wernicke's Area - Language Understanding",
  BA24: "Anterior Cingulate - Emotion & Conflict Monitoring",
  BA44: "Broca's Area - Speech Production",
  AMYGDALA: "Amygdala - Fear Processing & Threat Detection",
  INSULA: "Insular Cortex - Interoception & Empathy",
  HIPPOCAMPUS: "Hippocampus - Memory Formation & Navigation",
}

export function EnhancedEducationalPanel({ activeRegions }: EnhancedEducationalPanelProps) {
  return (
    <div className="space-y-4">
      {/* Main Educational Overview */}
      <CollapsiblePanel
        title="Educational Overview"
        icon={<Brain className="h-5 w-5 text-blue-400" />}
        className="bg-black/40 backdrop-blur-md border-gray-800"
      >
        <div className="space-y-3">
          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400/30">
            Neuroscience + AI Concepts
          </Badge>
          <Tabs defaultValue="concept" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
              <TabsTrigger value="concept" className="text-xs">
                Concepts
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs">
                Active Regions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="concept" className="mt-3">
              <div className="space-y-3">
                {Object.entries(CONCEPT_EXPLANATIONS).map(([key, concept]) => {
                  const Icon = concept.icon
                  return (
                    <div key={key} className="p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-blue-400" />
                        <h4 className="text-sm font-semibold">{concept.title}</h4>
                      </div>
                      <div className="text-xs text-gray-300 space-y-1">
                        {concept.content.map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-3">
              <div className="space-y-3">
                {activeRegions.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-400">
                      <Activity className="h-4 w-4" />
                      Currently Active: {activeRegions.length} regions
                    </div>
                    {activeRegions.slice(0, 6).map((region) => {
                      const description =
                        BRODMANN_DETAILS[region as keyof typeof BRODMANN_DETAILS] || "AI Processing Component"

                      return (
                        <div key={region} className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-medium text-blue-400">
                                {region.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">{description}</div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Active
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                    {activeRegions.length > 6 && (
                      <div className="text-xs text-gray-400 text-center">
                        +{activeRegions.length - 6} more regions active
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No regions currently active</div>
                    <div className="text-xs mt-1">Select a prompt from the test battery to activate brain regions</div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CollapsiblePanel>

      {/* Architecture Mapping */}
      <CollapsiblePanel
        title="Architecture Mapping"
        icon={<Network className="h-5 w-5 text-purple-400" />}
        className="bg-black/40 backdrop-blur-md border-gray-800"
        defaultExpanded={false}
      >
        <div className="space-y-2">
          <div className="text-xs text-gray-400 mb-3">Brain regions mapped to AI components:</div>
          {[
            { brain: "Prefrontal Cortex", ai: "Attention Heads", active: activeRegions.includes("BA9") },
            { brain: "Hippocampus", ai: "Embedding Layers", active: activeRegions.includes("HIPPOCAMPUS") },
            { brain: "Amygdala", ai: "Threat Detection", active: activeRegions.includes("AMYGDALA") },
            { brain: "Visual Cortex", ai: "Feature Extraction", active: activeRegions.includes("BA17") },
            { brain: "Motor Cortex", ai: "Action Planning", active: activeRegions.includes("BA4") },
          ].map((mapping, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md border transition-colors ${
                mapping.active ? "border-blue-500/50 bg-blue-500/10" : "border-gray-800 bg-gray-900/50 opacity-60"
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium">{mapping.brain}</span>
                <span className="text-gray-400">→</span>
                <span className={`font-medium ${mapping.active ? "text-blue-400" : ""}`}>{mapping.ai}</span>
              </div>
            </div>
          ))}
        </div>
      </CollapsiblePanel>

      {/* Performance Metrics */}
      <CollapsiblePanel
        title="System Metrics"
        icon={<Zap className="h-5 w-5 text-yellow-400" />}
        className="bg-black/40 backdrop-blur-md border-gray-800"
        defaultExpanded={false}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-gray-800/30 rounded">
              <div className="text-gray-400">Active Regions</div>
              <div className="text-lg font-bold text-blue-400">{activeRegions.length}</div>
            </div>
            <div className="p-2 bg-gray-800/30 rounded">
              <div className="text-gray-400">Particles</div>
              <div className="text-lg font-bold text-green-400">18K</div>
            </div>
            <div className="p-2 bg-gray-800/30 rounded">
              <div className="text-gray-400">Brodmann Areas</div>
              <div className="text-lg font-bold text-purple-400">9</div>
            </div>
            <div className="p-2 bg-gray-800/30 rounded">
              <div className="text-gray-400">AI Components</div>
              <div className="text-lg font-bold text-orange-400">12</div>
            </div>
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  )
}
