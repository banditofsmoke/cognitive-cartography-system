"use client"

type ArchitectureMapProps = {
  activeRegions: string[]
}

// Map brain regions to transformer architecture components
const ARCHITECTURE_MAPPING = [
  {
    brainRegion: "prefrontal-cortex",
    transformerComponent: "Attention Heads",
    aiRegions: ["attention-head-1", "attention-head-2", "attention-head-3"],
    description: "Self-attention mechanisms that focus on relationships between tokens",
  },
  {
    brainRegion: "temporal-lobe",
    transformerComponent: "Language Processing",
    aiRegions: ["language-processing"],
    description: "Natural language understanding modules",
  },
  {
    brainRegion: "hippocampus",
    transformerComponent: "Embedding Layers",
    aiRegions: ["embedding-layer-1", "embedding-layer-2"],
    description: "Token and positional embedding storage",
  },
  {
    brainRegion: "prefrontal-areas",
    transformerComponent: "Reasoning Modules",
    aiRegions: ["reasoning-module-1", "reasoning-module-2"],
    description: "Logical inference and abstract concept formation",
  },
  {
    brainRegion: "occipital-lobe",
    transformerComponent: "Visual Processing",
    aiRegions: ["visual-processing"],
    description: "Image feature extraction and visual understanding",
  },
  {
    brainRegion: "parietal-lobe",
    transformerComponent: "Multimodal Integration",
    aiRegions: ["multimodal-integration"],
    description: "Cross-modal feature fusion between different input types",
  },
  {
    brainRegion: "cerebellum",
    transformerComponent: "Fine-tuning Module",
    aiRegions: ["fine-tuning"],
    description: "Parameter optimization and model refinement",
  },
]

export function ArchitectureMap({ activeRegions }: ArchitectureMapProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Brain-Transformer Architecture Map</h3>
      <div className="space-y-2 text-xs">
        {ARCHITECTURE_MAPPING.map((mapping) => {
          const isActive = mapping.aiRegions.some((region) => activeRegions.includes(region))

          return (
            <div
              key={mapping.brainRegion}
              className={`p-2 rounded-md border ${
                isActive ? "border-blue-500/50 bg-blue-500/10" : "border-gray-800 bg-gray-900/50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{mapping.brainRegion}</span>
                <span className="text-gray-400">→</span>
                <span className={`font-medium ${isActive ? "text-blue-400" : ""}`}>{mapping.transformerComponent}</span>
              </div>
              <p className="mt-1 text-gray-400 text-xs">{mapping.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
