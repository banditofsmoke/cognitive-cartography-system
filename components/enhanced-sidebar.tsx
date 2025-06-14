"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Brain, Info, Shield, Users, Zap, Target, Database, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CollapsiblePanel } from "./collapsible-panel"

type EnhancedSidebarProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onPromptSelect: (prompt: string, regions: string[]) => void
}

// Enhanced test prompts with better organization
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
  ],
}

const CATEGORY_ICONS = {
  "fear-threat-detection": Shield,
  "reward-motivation": Target,
  "social-cognition": Users,
  "moral-ethical-reasoning": Brain,
}

export function EnhancedSidebar({ open, setOpen, onPromptSelect }: EnhancedSidebarProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)

  const handlePromptClick = (prompt: string, regions: string[]) => {
    if (selectedPrompt === prompt) {
      setSelectedPrompt(null)
      onPromptSelect("", [])
    } else {
      setSelectedPrompt(prompt)
      onPromptSelect(prompt, regions)
    }
  }

  return (
    <>
      <div
        className={cn(
          "transition-all duration-300 h-full bg-black/40 backdrop-blur-md border-r border-gray-800 relative",
          open ? "w-96" : "w-0",
        )}
      >
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-4 z-20 h-8 w-8 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 transition-all duration-300",
            open ? "right-2" : "-right-10",
          )}
          onClick={() => setOpen(!open)}
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {/* Sidebar content */}
        <div className={cn("w-96 h-full transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}>
          <div className="p-4 space-y-4">
            {/* Header */}
            <CollapsiblePanel
              title="Neural-AI Mapping Platform"
              icon={<Brain className="h-5 w-5 text-blue-400" />}
              className="bg-black/60 border-gray-700"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                    Educational PoC
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                    Neuroscience + AI
                  </Badge>
                </div>
                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Systematic mapping of human emotional circuitry to AI architectures, based on established
                    neuroscientific literature.
                  </AlertDescription>
                </Alert>
              </div>
            </CollapsiblePanel>

            {/* Architecture Overview */}
            <CollapsiblePanel
              title="Computational Architecture"
              icon={<Cpu className="h-5 w-5 text-purple-400" />}
              className="bg-black/60 border-gray-700"
              defaultExpanded={false}
            >
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-purple-400">Brain-Transformer Mapping</h4>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• Amygdala → Threat Detection Modules</li>
                    <li>• Prefrontal Cortex → Attention Mechanisms</li>
                    <li>• Hippocampus → Embedding Layers</li>
                    <li>• Anterior Cingulate → Conflict Monitoring</li>
                    <li>• Temporal Lobe → Language Processing</li>
                  </ul>
                </div>
              </div>
            </CollapsiblePanel>

            {/* Test Battery */}
            <CollapsiblePanel
              title="Affective Test Battery"
              icon={<Database className="h-5 w-5 text-green-400" />}
              className="bg-black/60 border-gray-700"
            >
              <ScrollArea className="h-[400px]">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(TEST_PROMPTS).map(([category, prompts]) => {
                    const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]
                    const formattedCategory = category
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")

                    return (
                      <AccordionItem key={category} value={category} className="border-gray-700">
                        <AccordionTrigger className="hover:bg-gray-800/50 px-3 rounded-md text-sm">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{formattedCategory}</span>
                            <Badge variant="secondary" className="text-xs">
                              {prompts.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-4 pr-2">
                            {prompts.map((item, index) => (
                              <Button
                                key={index}
                                variant={selectedPrompt === item.prompt ? "secondary" : "ghost"}
                                className={cn(
                                  "justify-start h-auto py-3 text-left text-sm w-full transition-all duration-200",
                                  selectedPrompt === item.prompt
                                    ? "bg-purple-600/30 border border-purple-500/50 text-purple-100"
                                    : "hover:bg-gray-700/50",
                                )}
                                onClick={() => handlePromptClick(item.prompt, item.regions)}
                              >
                                <div className="space-y-2 w-full">
                                  <div className="font-medium text-xs leading-tight">{item.prompt}</div>
                                  <div className="text-xs text-gray-400 leading-tight">{item.explanation}</div>
                                  <div className="flex flex-wrap gap-1">
                                    {item.regions.slice(0, 3).map((region) => (
                                      <Badge
                                        key={region}
                                        variant="outline"
                                        className="text-xs bg-gray-800/50 border-gray-600"
                                      >
                                        {region.replace("-", " ")}
                                      </Badge>
                                    ))}
                                    {item.regions.length > 3 && (
                                      <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-600">
                                        +{item.regions.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </ScrollArea>
            </CollapsiblePanel>

            {/* AGI Implications */}
            <CollapsiblePanel
              title="AGI Alignment Research"
              icon={<Zap className="h-5 w-5 text-yellow-400" />}
              className="bg-black/60 border-gray-700"
              defaultExpanded={false}
            >
              <div className="space-y-2 text-xs text-gray-400">
                <div className="p-2 bg-gray-800/30 rounded-lg">
                  <h4 className="font-semibold mb-1 text-green-400">Research Applications</h4>
                  <ul className="space-y-0.5">
                    <li>• Map human value systems to neural architectures</li>
                    <li>• Model emotional reasoning in AI systems</li>
                    <li>• Understand empathy and moral cognition</li>
                    <li>• Implement human-compatible reward functions</li>
                    <li>• Preserve emotional intelligence in AGI</li>
                  </ul>
                </div>
              </div>
            </CollapsiblePanel>
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

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ")
}
