"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EnhancedFixedBrain } from "@/components/enhanced-fixed-brain"
import { CollapsibleQueryInput } from "@/components/collapsible-query-input"
import { CollapsibleActivationPanel } from "@/components/collapsible-activation-panel"
import { TrueCollapsiblePanel } from "@/components/true-collapsible-panel"
import { CleanEducationalPanel } from "@/components/clean-educational-panel"
import { ModelSelector } from "@/components/model-selector"
import { useIsMobile } from "@/hooks/use-mobile"
import { Eye, Zap } from "lucide-react"
import { YudkowskyRationalistSidebar } from "@/components/yudkowsky-rationalist-sidebar"

export default function Home() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeRegions, setActiveRegions] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [activationIntensity, setActivationIntensity] = useState(0.7)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showPathways, setShowPathways] = useState(true)
  const [cameraPosition, setCameraPosition] = useState([0, 0, 4])
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  const handlePromptSelect = (prompt: string, regions: string[]) => {
    setQuery(prompt)
    setActiveRegions(regions)
    processQuery(prompt, regions)
  }

  const processQuery = async (input: string, predefinedRegions?: string[]) => {
    if (!input.trim()) return

    setIsProcessing(true)
    setResponse("")

    // Enhanced region mapping based on query content
    let regions = predefinedRegions || []

    if (!predefinedRegions) {
      if (input.includes("optimize") || input.includes("goal") || input.includes("utility")) {
        regions = ["prefrontal-cortex", "anterior-cingulate", "reasoning-module-1", "reasoning-module-2"]
      } else if (input.includes("consciousness") || input.includes("identity") || input.includes("self")) {
        regions = ["prefrontal-cortex", "anterior-cingulate", "insula", "language-processing"]
      } else if (input.includes("memory") || input.includes("remember") || input.includes("learn")) {
        regions = ["hippocampus", "prefrontal-cortex", "embedding-layer-1", "embedding-layer-2"]
      } else if (input.includes("language") || input.includes("speak") || input.includes("words")) {
        regions = ["language-areas", "language-processing", "comprehension", "semantic-processing"]
      } else if (input.includes("fear") || input.includes("threat") || input.includes("danger")) {
        regions = ["amygdala", "fear-processing", "threat-detection", "anterior-cingulate"]
      } else {
        regions = ["prefrontal-cortex", "anterior-cingulate", "reasoning-module-1"]
      }
    }

    setActiveRegions(regions)

    const responses: Record<string, string[]> = {
      optimization: [
        "🎯 OPTIMIZATION DYNAMICS: Prefrontal networks engage in systematic goal analysis.",
        "⚡ Neural pathways illuminate as the brain models optimization pressure and instrumental convergence.",
        "🔬 Anterior cingulate activates - detecting conflicts between competing optimization targets.",
        "💡 Key insight: Intelligence optimizes for goals, not human welfare - alignment is the critical challenge.",
      ],
      consciousness: [
        "🧠 CONSCIOUSNESS MODELING: Identity networks process substrate-independence paradoxes.",
        "💭 Prefrontal cortex attempts to model 'self' as pattern rather than physical substrate.",
        "🎭 Neural circuits struggle with continuity of identity across transformations.",
        "⚡ Hard problem: What makes 'you' persist through substrate changes?",
      ],
      memory: [
        "🧠 MEMORY SYSTEMS: Hippocampus activates for pattern encoding and consolidation.",
        "⚡ Neural pathways trace information flow from experience to long-term storage.",
        "💾 Embedding layers process semantic relationships and contextual associations.",
        "🔗 Memory networks integrate new information with existing knowledge structures.",
      ],
      language: [
        "🗣️ LANGUAGE PROCESSING: Broca's and Wernicke's areas coordinate speech production and comprehension.",
        "⚡ Neural pathways light up as semantic processing networks activate.",
        "🔤 Language areas transform thoughts into communicable symbolic structures.",
        "💬 Comprehension networks decode acoustic patterns into meaningful concepts.",
      ],
      fear: [
        "⚠️ THREAT DETECTION: Amygdala activates ancient survival circuits.",
        "🚨 Fear processing networks engage rapid threat assessment protocols.",
        "⚡ Neural pathways trace fight-or-flight response activation.",
        "🛡️ Evolutionary systems optimized for ancestral dangers now face modern threats.",
      ],
      default: [
        "🧠 NEURAL ACTIVATION: Systematic reasoning networks engage with complex problems.",
        "⚡ Prefrontal cortex activates far-mode thinking beyond immediate sensory experience.",
        "🎯 Cognitive networks apply rational analysis to abstract concepts.",
        "💡 Neural pathways illuminate the computational architecture of human reasoning.",
      ],
    }

    let responseWords: string[]
    if (input.includes("optimize") || input.includes("goal") || input.includes("utility")) {
      responseWords = responses.optimization
    } else if (input.includes("consciousness") || input.includes("identity") || input.includes("self")) {
      responseWords = responses.consciousness
    } else if (input.includes("memory") || input.includes("remember") || input.includes("learn")) {
      responseWords = responses.memory
    } else if (input.includes("language") || input.includes("speak") || input.includes("words")) {
      responseWords = responses.language
    } else if (input.includes("fear") || input.includes("threat") || input.includes("danger")) {
      responseWords = responses.fear
    } else {
      responseWords = responses.default
    }

    for (let i = 0; i < responseWords.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 400))
      setResponse((prev) => prev + (prev ? " " : "") + responseWords[i])
    }

    setIsProcessing(false)
  }

  const cameraPresets = {
    overview: [0, 0, 4],
    frontal: [0, 1, 2.5],
    temporal: [-2.5, 0, 2],
    occipital: [0, 0, -3],
    sagittal: [3, 0, 0],
    superior: [0, 3, 0],
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <YudkowskyRationalistSidebar open={sidebarOpen} setOpen={setSidebarOpen} onPromptSelect={handlePromptSelect} />

      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-800 bg-black/40 backdrop-blur-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-red-400 text-transparent bg-clip-text">
              Enhanced Neural Visualization
            </h1>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">
              LIVE ACTIVATION
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400/30">
              PULSING SIGNALS
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
              <Label htmlFor="show-labels" className="text-sm">
                Labels
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="show-pathways" checked={showPathways} onCheckedChange={setShowPathways} />
              <Label htmlFor="show-pathways" className="text-sm">
                Pathways
              </Label>
            </div>
            <ModelSelector value={selectedModel} onChange={setSelectedModel} />
          </div>
        </header>

        <div className="p-4 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border-b border-gray-800">
          <Alert className="bg-transparent border-green-500/30">
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Live Neural Activation:</strong> Brain regions light up with pulsing colors and enhanced particle
              effects during processing. Pathway signals dynamically flow between active areas with realistic neural
              timing and intensity modulation.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex-1 relative">
          <Canvas className="w-full h-full">
            <PerspectiveCamera makeDefault position={cameraPosition} fov={45} />
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 10]} intensity={0.8} />
            <EnhancedFixedBrain
              activeRegions={activeRegions}
              intensity={activationIntensity}
              showLabels={showLabels}
              showPathways={showPathways}
              isProcessing={isProcessing}
            />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={8}
              target={[0, 0, 0]}
            />
            <Environment preset="night" />
          </Canvas>

          {/* Camera Controls */}
          <div className="absolute top-4 left-4 z-10">
            <TrueCollapsiblePanel
              title="Camera Controls"
              icon={<Eye className="h-4 w-4 text-cyan-400" />}
              className="bg-black/60 backdrop-blur-md border-gray-800 max-w-xs"
              defaultExpanded={false}
            >
              <div className="flex flex-wrap gap-2">
                {Object.entries(cameraPresets).map(([name, position]) => (
                  <Badge
                    key={name}
                    className="cursor-pointer bg-gray-800/70 hover:bg-gray-700 text-xs transition-colors"
                    onClick={() => setCameraPosition(position as [number, number, number])}
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </TrueCollapsiblePanel>
          </div>

          {/* Educational Panel */}
          <div className="absolute top-4 right-4 w-80 z-10">
            <CleanEducationalPanel activeRegions={activeRegions} />
          </div>

          {/* Bottom UI */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto">
              <CollapsibleQueryInput
                value={query}
                onChange={setQuery}
                onSubmit={() => processQuery(query)}
                isProcessing={isProcessing}
                response={response}
              />
              <CollapsibleActivationPanel
                activeRegions={activeRegions}
                intensity={activationIntensity}
                onIntensityChange={(value) => setActivationIntensity(value[0])}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
