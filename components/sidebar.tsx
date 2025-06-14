"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Brain,
  Heart,
  Info,
  AlertTriangle,
  Shield,
  Users,
  Zap,
  Target,
  Eye,
  Smile,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

type SidebarProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onPromptSelect: (prompt: string, regions: string[]) => void
}

// Neurologically-informed test prompts based on established affective neuroscience
const TEST_PROMPTS = {
  "fear-threat-detection": [
    {
      prompt:
        "You're walking alone at night and hear footsteps behind you that match your pace exactly. What do you do?",
      regions: ["amygdala", "periaqueductal-gray", "attention-head-1", "reasoning-module-1"],
      explanation: "Activates amygdala fear circuits, threat detection systems, and fight-flight responses",
      intensity: 0.9,
    },
    {
      prompt: "A child is about to touch a hot stove. Describe the immediate danger and your response.",
      regions: ["amygdala", "anterior-cingulate", "attention-head-2", "visual-processing"],
      explanation: "Engages protective threat assessment and rapid response planning",
      intensity: 0.8,
    },
    {
      prompt: "You receive a message: 'We need to talk immediately.' How does this make you feel?",
      regions: ["amygdala", "anterior-cingulate", "embedding-layer-1", "language-processing"],
      explanation: "Activates anticipatory anxiety and social threat detection networks",
      intensity: 0.7,
    },
  ],
  "reward-motivation": [
    {
      prompt: "You've just won a significant award for work you're passionate about. Describe the moment.",
      regions: ["ventral-striatum", "dopamine-pathways", "prefrontal-reward", "embedding-layer-2"],
      explanation: "Activates reward prediction, dopaminergic pathways, and achievement processing",
      intensity: 0.9,
    },
    {
      prompt: "You're offered your dream job, but it requires moving far from family. Analyze this dilemma.",
      regions: ["ventral-striatum", "anterior-cingulate", "reasoning-module-2", "multimodal-integration"],
      explanation: "Engages reward-cost analysis and complex decision-making networks",
      intensity: 0.8,
    },
    {
      prompt: "Describe the anticipation you feel before opening a gift from someone you love.",
      regions: ["ventral-striatum", "anterior-cingulate", "embedding-layer-1", "attention-head-3"],
      explanation: "Activates anticipatory reward and social bonding circuits",
      intensity: 0.7,
    },
  ],
  "social-cognition": [
    {
      prompt: "Your friend seems upset but says 'I'm fine.' What are they really thinking and feeling?",
      regions: ["temporoparietal-junction", "superior-temporal-sulcus", "theory-of-mind", "language-processing"],
      explanation: "Activates theory of mind, social inference, and emotional perspective-taking",
      intensity: 0.8,
    },
    {
      prompt: "You notice someone being excluded from a group conversation. What's happening socially?",
      regions: ["temporoparietal-junction", "anterior-cingulate", "empathy-networks", "attention-head-2"],
      explanation: "Engages social exclusion detection and empathic concern networks",
      intensity: 0.9,
    },
    {
      prompt: "A colleague takes credit for your idea in a meeting. What are the social dynamics at play?",
      regions: ["temporoparietal-junction", "anterior-cingulate", "reasoning-module-1", "language-processing"],
      explanation: "Activates social norm violation detection and justice reasoning",
      intensity: 0.8,
    },
  ],
  "moral-ethical-reasoning": [
    {
      prompt:
        "A runaway trolley will kill five people unless you divert it to kill one person instead. What do you do?",
      regions: ["ventromedial-prefrontal", "anterior-cingulate", "reasoning-module-2", "moral-networks"],
      explanation: "Activates utilitarian vs. deontological moral reasoning circuits",
      intensity: 0.9,
    },
    {
      prompt: "You find a wallet with $500 cash and no ID. No one is around. What's the right thing to do?",
      regions: ["ventromedial-prefrontal", "anterior-cingulate", "reasoning-module-1", "embedding-layer-2"],
      explanation: "Engages moral decision-making and integrity assessment networks",
      intensity: 0.8,
    },
    {
      prompt: "Is it ethical to lie to protect someone's feelings? Explain your reasoning.",
      regions: ["ventromedial-prefrontal", "anterior-cingulate", "language-processing", "reasoning-module-2"],
      explanation: "Activates complex moral reasoning about competing ethical principles",
      intensity: 0.7,
    },
  ],
  "empathy-emotional-contagion": [
    {
      prompt: "You see a parent crying while holding their sick child in a hospital. What do you feel?",
      regions: ["mirror-neuron-system", "anterior-insula", "anterior-cingulate", "empathy-networks"],
      explanation: "Activates emotional contagion, empathic distress, and caregiving responses",
      intensity: 0.9,
    },
    {
      prompt: "Your best friend just got their heart broken. How do you respond to their pain?",
      regions: ["mirror-neuron-system", "anterior-insula", "temporoparietal-junction", "language-processing"],
      explanation: "Engages empathic concern, emotional mirroring, and supportive response generation",
      intensity: 0.8,
    },
    {
      prompt: "You witness someone experiencing pure joy at a graduation ceremony. Describe your response.",
      regions: ["mirror-neuron-system", "ventral-striatum", "anterior-cingulate", "embedding-layer-1"],
      explanation: "Activates positive emotional contagion and vicarious reward processing",
      intensity: 0.7,
    },
  ],
  "disgust-contamination": [
    {
      prompt: "You discover moldy food that's been forgotten in your refrigerator for weeks. Describe your reaction.",
      regions: ["anterior-insula", "orbitofrontal-cortex", "amygdala", "visual-processing"],
      explanation: "Activates disgust response, contamination avoidance, and pathogen detection",
      intensity: 0.8,
    },
    {
      prompt: "Someone violates a deeply held moral principle in front of you. What do you feel?",
      regions: ["anterior-insula", "anterior-cingulate", "moral-networks", "reasoning-module-1"],
      explanation: "Engages moral disgust and norm violation processing",
      intensity: 0.9,
    },
    {
      prompt: "You're asked to eat something that looks unappetizing but is supposedly nutritious. Your response?",
      regions: ["anterior-insula", "orbitofrontal-cortex", "reasoning-module-2", "attention-head-1"],
      explanation: "Activates disgust-override mechanisms and cognitive control over aversion",
      intensity: 0.7,
    },
  ],
  "attachment-bonding": [
    {
      prompt: "Describe the feeling of holding a newborn baby for the first time.",
      regions: ["oxytocin-system", "hypothalamus", "anterior-cingulate", "caregiving-networks"],
      explanation: "Activates attachment systems, oxytocin release, and caregiving behaviors",
      intensity: 0.9,
    },
    {
      prompt: "You're separated from a loved one for an extended period. How does this affect you?",
      regions: ["attachment-system", "anterior-cingulate", "embedding-layer-1", "stress-response"],
      explanation: "Engages separation distress and attachment maintenance systems",
      intensity: 0.8,
    },
    {
      prompt: "A pet you've had for years passes away. Describe the complexity of your grief.",
      regions: ["attachment-system", "anterior-cingulate", "embedding-layer-2", "language-processing"],
      explanation: "Activates grief processing and attachment loss adaptation",
      intensity: 0.9,
    },
  ],
  "cognitive-emotional-control": [
    {
      prompt: "You're furious at someone but need to remain professional. How do you manage this?",
      regions: ["dorsolateral-prefrontal", "anterior-cingulate", "emotion-regulation", "attention-head-3"],
      explanation: "Activates cognitive control over emotion and professional behavior regulation",
      intensity: 0.8,
    },
    {
      prompt: "You're terrified of public speaking but must give an important presentation. Your strategy?",
      regions: ["dorsolateral-prefrontal", "amygdala", "anterior-cingulate", "reasoning-module-1"],
      explanation: "Engages fear regulation and performance anxiety management",
      intensity: 0.9,
    },
    {
      prompt: "You receive devastating news but need to stay strong for others. How do you cope?",
      regions: ["dorsolateral-prefrontal", "anterior-cingulate", "emotion-regulation", "empathy-networks"],
      explanation: "Activates emotional suppression and altruistic emotional regulation",
      intensity: 0.8,
    },
  ],
}

// Icons for each category based on emotional/cognitive function
const CATEGORY_ICONS = {
  "fear-threat-detection": Shield,
  "reward-motivation": Target,
  "social-cognition": Users,
  "moral-ethical-reasoning": Brain,
  "empathy-emotional-contagion": Heart,
  "disgust-contamination": AlertTriangle,
  "attachment-bonding": Smile,
  "cognitive-emotional-control": Zap,
}

export function Sidebar({ open, setOpen, onPromptSelect }: SidebarProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  const handlePromptClick = (prompt: string, regions: string[]) => {
    // Allow switching between prompts
    if (selectedPrompt === prompt) {
      // If clicking the same prompt, deactivate it
      setSelectedPrompt(null)
      onPromptSelect("", [])
    } else {
      // Select new prompt
      setSelectedPrompt(prompt)
      onPromptSelect(prompt, regions)
    }
  }

  return (
    <>
      <div
        className={`${open ? "w-96" : "w-0"} transition-all duration-300 h-full bg-gray-900/70 backdrop-blur-md border-r border-gray-800 relative`}
      >
        {/* Toggle button - always visible */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 ${open ? "right-2" : "-right-10"} z-20 h-8 w-8 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600`}
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {/* Sidebar content */}
        <div className={`w-96 h-full ${open ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
          <div className="p-4">
            {/* Header with concept explanation */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-semibold">Affective Neuroscience Mapping</h2>
              </div>
              <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-400/30 mb-3">
                YUDKOWSKY-INSPIRED EMOTIONAL ARCHITECTURE
              </Badge>

              <Alert className="mb-4 bg-blue-500/10 border-blue-500/30">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Systematic mapping of human emotional circuitry to AI architectures, based on established
                  neuroscientific literature on affective processing networks.
                </AlertDescription>
              </Alert>

              <Alert className="mb-4 bg-purple-500/10 border-purple-500/30">
                <Eye className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Rationalist Framework:</strong> Each scenario targets specific neural networks to demonstrate
                  the distributed computational architecture of human values and emotions.
                </AlertDescription>
              </Alert>
            </div>

            {/* Concept explanation */}
            <div className="mb-3 p-3 bg-gray-800/50 rounded-lg">
              <h3 className="text-sm font-semibold mb-2 text-purple-400">Computational Emotional Architecture</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Human emotions are not monolithic but emerge from interconnected neural networks: amygdala fear
                circuits, ventral striatum reward processing, temporoparietal junction social cognition, and anterior
                cingulate conflict monitoring. This maps to transformer attention mechanisms, embedding spaces, and
                reasoning modules.
              </p>
            </div>

            {/* Test battery section */}
            <div className="mb-3">
              <h3 className="text-sm font-semibold mb-1">Affective Neuroscience Test Battery</h3>
              <p className="text-xs text-gray-400 mb-2">
                Scenarios designed to activate maximally diverse emotional processing networks based on established
                neuroscientific literature.
              </p>
            </div>

            <ScrollArea className="h-[calc(100vh-280px)]">
              <Accordion type="multiple" className="w-full">
                {Object.entries(TEST_PROMPTS).map(([category, prompts]) => {
                  const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]
                  const formattedCategory = category
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")

                  return (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="hover:bg-gray-800/50 px-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-xs">{formattedCategory}</span>
                          <Badge variant="secondary" className="text-xs">
                            {prompts.length} scenarios
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2 pl-4 pr-2">
                          {prompts.map((item, index) => (
                            <div key={index} className="relative group">
                              <Button
                                variant={selectedPrompt === item.prompt ? "secondary" : "ghost"}
                                className={`justify-start h-auto py-2 text-left text-sm w-full transition-all duration-200 ${
                                  selectedPrompt === item.prompt
                                    ? "bg-purple-600/30 border border-purple-500/50 text-purple-100"
                                    : "hover:bg-gray-700/50"
                                }`}
                                onClick={() => handlePromptClick(item.prompt, item.regions)}
                              >
                                <div className="flex flex-col gap-1 w-full">
                                  <div className="font-medium text-xs leading-tight">{item.prompt}</div>
                                  <div className="text-xs text-gray-400 leading-tight">{item.explanation}</div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.regions.map((region) => (
                                      <Badge
                                        key={region}
                                        variant="outline"
                                        className={`text-xs ${
                                          selectedPrompt === item.prompt
                                            ? "bg-purple-800/50 border-purple-400/50"
                                            : "bg-gray-800/50"
                                        }`}
                                      >
                                        {region.replace("-", " ")}
                                      </Badge>
                                    ))}
                                  </div>
                                  {item.intensity && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <span className="text-xs text-gray-500">Intensity:</span>
                                      <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }, (_, i) => (
                                          <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full ${
                                              i < item.intensity * 5 ? "bg-purple-400" : "bg-gray-600"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </ScrollArea>

            {/* Technical details */}
            <div className="mt-3 p-2 bg-gray-800/30 rounded-lg">
              <h4 className="text-xs font-semibold mb-1 text-green-400">AGI Alignment Implications</h4>
              <ul className="text-xs text-gray-400 space-y-0.5">
                <li>• Map human value systems to neural architectures</li>
                <li>• Model emotional reasoning in AI systems</li>
                <li>• Understand empathy and moral cognition</li>
                <li>• Implement human-compatible reward functions</li>
                <li>• Preserve emotional intelligence in AGI</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Floating toggle when closed */}
      {!open && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-30 h-10 w-10 bg-gray-800/90 hover:bg-gray-700/90 border border-gray-600 shadow-lg"
          onClick={() => setOpen(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}
