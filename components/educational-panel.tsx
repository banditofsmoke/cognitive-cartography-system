"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Database, Cpu, Network } from "lucide-react"

type EducationalPanelProps = {
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
      "Each brain region will contain specialized embedding models:",
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
  "neural-pathways": {
    title: "White Matter Connectivity",
    icon: Network,
    content: [
      "Information flow through anatomical pathways:",
      "• Arcuate Fasciculus → Language Processing",
      "• Corpus Callosum → Hemispheric Communication",
      "• Superior Longitudinal → Attention Networks",
      "• Uncinate Fasciculus → Memory-Emotion Links",
      "• Cingulum → Executive Control",
    ],
  },
}

const BRODMANN_DETAILS = {
  BA9: "Dorsolateral Prefrontal - Working Memory & Attention",
  BA10: "Anterior Prefrontal - Strategic Planning",
  BA44: "Broca's Area - Speech Production",
  BA45: "Broca's Area - Language Comprehension",
  BA22: "Wernicke's Area - Language Understanding",
  BA17: "Primary Visual - Basic Feature Detection",
  BA18: "Secondary Visual - Feature Integration",
  BA19: "Associative Visual - Complex Processing",
  BA7: "Superior Parietal - Spatial Attention",
  BA39: "Angular Gyrus - Semantic Integration",
  BA40: "Supramarginal - Phonological Processing",
}

export function EducationalPanel({ activeRegions }: EducationalPanelProps) {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-400" />
          Educational Overview
        </CardTitle>
        <Badge variant="outline" className="w-fit bg-blue-500/20 text-blue-400 border-blue-400/30">
          Neuroscience + AI Concepts
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="concept" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50">
            <TabsTrigger value="concept">Concepts</TabsTrigger>
            <TabsTrigger value="active">Active Regions</TabsTrigger>
          </TabsList>

          <TabsContent value="concept" className="mt-4">
            <div className="space-y-4">
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

          <TabsContent value="active" className="mt-4">
            <div className="space-y-3">
              {activeRegions.length > 0 ? (
                <>
                  <div className="text-sm font-medium text-blue-400">
                    Currently Active: {activeRegions.length} regions
                  </div>
                  {activeRegions.map((region) => {
                    const brodmannKey = region
                      .replace("attention-head-", "BA")
                      .replace("reasoning-module-", "BA")
                      .replace("language-processing", "BA44")
                    const description =
                      BRODMANN_DETAILS[brodmannKey as keyof typeof BRODMANN_DETAILS] || "AI Processing Component"

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
      </CardContent>
    </Card>
  )
}
