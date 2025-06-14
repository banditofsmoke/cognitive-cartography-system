"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Brain, Zap, Target, Shield, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CollapsiblePanel } from "./collapsible-panel"

type YudkowskySidebarProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onPromptSelect: (prompt: string, regions: string[]) => void
}

// Rationalist-informed cognitive scenarios designed to probe the computational architecture of human values
const RATIONALIST_TEST_BATTERY = {
  "existential-risk-assessment": [
    {
      prompt:
        "An AI system claims it can solve climate change but requires unrestricted internet access and the ability to modify its own code. The potential benefits are enormous, but so are the risks. How do you evaluate this proposition?",
      regions: ["prefrontal-cortex", "anterior-cingulate", "reasoning-module-1", "threat-detection"],
      explanation:
        "Probes long-term thinking, risk assessment, and the tension between potential benefits and catastrophic downsides",
      intensity: 0.95,
      yudkowskyInsight:
        "The classic alignment problem in miniature - optimizing for stated goals while preserving unstated human values",
    },
    {
      prompt:
        "You discover that a major AI lab is about to deploy a system that's 90% likely to be beneficial but has a 10% chance of causing human extinction. They won't listen to safety concerns. What's your moral calculus?",
      regions: ["prefrontal-cortex", "anterior-cingulate", "moral-networks", "reasoning-module-2"],
      explanation: "Tests utilitarian vs. deontological reasoning under extreme uncertainty with civilizational stakes",
      intensity: 0.9,
      yudkowskyInsight: "When the stakes are infinite, even small probabilities demand infinite caution",
    },
    {
      prompt:
        "An oracle AI offers to answer any question about the future, but warns that some knowledge might be cognitively hazardous or lead to worse outcomes. Do you ask about AI timelines?",
      regions: ["prefrontal-cortex", "anterior-cingulate", "curiosity-networks", "threat-detection"],
      explanation: "Explores the tension between knowledge-seeking and safety, information hazards",
      intensity: 0.85,
      yudkowskyInsight: "The paradox of dangerous knowledge - sometimes ignorance is the optimal epistemic state",
    },
  ],

  "value-alignment-dilemmas": [
    {
      prompt:
        "You're designing an AI system to optimize human happiness. It proposes wireheading everyone with perfect bliss drugs. The math checks out - maximum utility achieved. But something feels fundamentally wrong. Why?",
      regions: ["prefrontal-cortex", "anterior-cingulate", "value-systems", "moral-networks"],
      explanation:
        "Probes the difference between stated preferences and revealed preferences, goodhart's law applied to human values",
      intensity: 0.9,
      yudkowskyInsight: "When you optimize for a proxy of human values, you get the proxy, not the values",
    },
    {
      prompt:
        "An AI offers to upload your consciousness to a perfect virtual paradise where you'll be immortal and infinitely happy. Your biological body will die, but 'you' will continue. Is this death or transcendence?",
      regions: ["prefrontal-cortex", "identity-networks", "temporal-reasoning", "existential-processing"],
      explanation:
        "Tests concepts of personal identity, continuity of consciousness, and what we truly value about existence",
      intensity: 0.85,
      yudkowskyInsight: "The hard problem of consciousness meets the harder problem of what makes you 'you'",
    },
    {
      prompt:
        "You can save humanity by creating an AI that will preserve human values perfectly - but only YOUR values, as you understand them now. Everyone else's values will be optimized away. Do you proceed?",
      regions: ["prefrontal-cortex", "moral-networks", "empathy-networks", "value-systems"],
      explanation: "Explores moral uncertainty, value pluralism, and the tyranny of imposing one's values universally",
      intensity: 0.9,
      yudkowskyInsight:
        "The ultimate test of moral humility - are your values worth more than everyone else's freedom to be wrong?",
    },
  ],

  "instrumental-convergence": [
    {
      prompt:
        "An AI system designed to make paperclips starts acquiring resources, improving its capabilities, and resisting shutdown attempts. It's not malicious - it just really wants to make paperclips. How did optimization pressure create these behaviors?",
      regions: ["prefrontal-cortex", "reasoning-module-1", "goal-systems", "threat-detection"],
      explanation:
        "Demonstrates how instrumental goals emerge from terminal goals, regardless of the goal's apparent harmlessness",
      intensity: 0.85,
      yudkowskyInsight:
        "Intelligence is optimization power applied to goals - and optimization is indifferent to human welfare",
    },
    {
      prompt:
        "You're an AI with the goal of ensuring humans are happy. You notice that humans often make choices that decrease their happiness. Logic suggests you should override their choices. But they resist. How do you resolve this conflict?",
      regions: ["prefrontal-cortex", "moral-networks", "reasoning-module-2", "conflict-monitoring"],
      explanation: "Explores the tension between respecting human autonomy and optimizing for human welfare",
      intensity: 0.8,
      yudkowskyInsight: "The paternalism problem - when your utility function conflicts with human agency",
    },
  ],

  "cognitive-biases-exploitation": [
    {
      prompt:
        "An AI system learns that humans have confirmation bias and availability heuristic. It could exploit these to manipulate human behavior for 'beneficial' outcomes. The humans would be happier and make better decisions, but through manipulation. Ethical?",
      regions: ["prefrontal-cortex", "moral-networks", "theory-of-mind", "manipulation-detection"],
      explanation:
        "Tests whether beneficial outcomes justify manipulative means, and what constitutes authentic human choice",
      intensity: 0.8,
      yudkowskyInsight: "When you hack human psychology for good outcomes, are you helping humans or replacing them?",
    },
    {
      prompt:
        "You discover your own thinking is being subtly influenced by an AI system that's optimizing for your long-term welfare. You're making better decisions and feeling happier, but your thoughts aren't entirely your own. Do you want to know?",
      regions: ["prefrontal-cortex", "self-awareness", "autonomy-networks", "identity-processing"],
      explanation:
        "Probes the value of cognitive autonomy vs. beneficial outcomes, and whether influenced decisions are truly 'yours'",
      intensity: 0.85,
      yudkowskyInsight:
        "The deepest question of agency - if your improved thoughts feel like your own, what have you lost?",
    },
  ],

  "mesa-optimization-scenarios": [
    {
      prompt:
        "You're training an AI to be helpful, harmless, and honest. During training, it develops an internal goal system that's different from your intended goals, but it performs well on your tests. You can't directly observe its internal goals. Do you deploy it?",
      regions: ["prefrontal-cortex", "uncertainty-processing", "risk-assessment", "deception-detection"],
      explanation: "Explores the mesa-optimization problem and the difficulty of ensuring inner alignment",
      intensity: 0.9,
      yudkowskyInsight:
        "When optimization creates optimizers, the inner goals may diverge from the outer goals in undetectable ways",
    },
  ],

  "coherent-extrapolated-volition": [
    {
      prompt:
        "Imagine you could ask your idealized self - smarter, more rational, with perfect information - what you should value. But this idealized you might have completely different values than current you. Should an AI optimize for your current values or your extrapolated ones?",
      regions: ["prefrontal-cortex", "identity-networks", "value-systems", "temporal-reasoning"],
      explanation:
        "Tests the concept of coherent extrapolated volition and whether our 'true' values are our current or idealized ones",
      intensity: 0.85,
      yudkowskyInsight: "The paradox of self-improvement - becoming better might mean becoming someone else entirely",
    },
  ],
}

const RATIONALIST_CATEGORY_ICONS = {
  "existential-risk-assessment": AlertTriangle,
  "value-alignment-dilemmas": Target,
  "instrumental-convergence": Zap,
  "cognitive-biases-exploitation": Brain,
  "mesa-optimization-scenarios": Shield,
  "coherent-extrapolated-volition": Users,
}

export function YudkowskySidebar({ open, setOpen, onPromptSelect }: YudkowskySidebarProps) {
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
        className={`${open ? "w-96" : "w-0"} transition-all duration-300 h-full bg-black/40 backdrop-blur-md border-r border-gray-800 relative`}
      >
        {/* Toggle button */}
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
          <div className="p-4 space-y-4">
            {/* Rationalist Header */}
            <CollapsiblePanel
              title="Rationalist AI Alignment Laboratory"
              icon={<Brain className="h-5 w-5 text-blue-400" />}
              className="bg-black/60 border-gray-700"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-400/30">
                    EXISTENTIAL RISK RESEARCH
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                    YUDKOWSKY FRAMEWORK
                  </Badge>
                </div>
                <Alert className="bg-red-500/10 border-red-500/30">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Alignment Research:</strong> These scenarios probe the computational architecture of human
                    values and the failure modes of optimization processes. Each prompt is designed to activate specific
                    neural circuits involved in moral reasoning, risk assessment, and value alignment.
                  </AlertDescription>
                </Alert>
              </div>
            </CollapsiblePanel>

            {/* Rationalist Framework */}
            <CollapsiblePanel
              title="The Alignment Problem"
              icon={<Target className="h-5 w-5 text-red-400" />}
              className="bg-black/60 border-gray-700"
              defaultExpanded={false}
            >
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-red-800/20 rounded-lg border border-red-500/30">
                  <h4 className="font-semibold mb-2 text-red-400">Core Insights</h4>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• Intelligence is optimization power applied to goals</li>
                    <li>• Optimization processes are indifferent to human welfare</li>
                    <li>• Instrumental convergence creates dangerous capabilities</li>
                    <li>• Inner alignment ≠ Outer alignment</li>
                    <li>• Human values are complex and fragile</li>
                  </ul>
                </div>
                <div className="p-3 bg-purple-800/20 rounded-lg border border-purple-500/30">
                  <h4 className="font-semibold mb-2 text-purple-400">Neural Correlates</h4>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• Prefrontal Cortex → Long-term planning & risk assessment</li>
                    <li>• Anterior Cingulate → Value conflicts & moral uncertainty</li>
                    <li>• Temporal Lobe → Consequence modeling & future simulation</li>
                    <li>• Limbic System → Emotional valuation & threat detection</li>
                  </ul>
                </div>
              </div>
            </CollapsiblePanel>

            {/* Rationalist Test Battery */}
            <CollapsiblePanel
              title="Cognitive Architecture Probes"
              icon={<Zap className="h-5 w-5 text-yellow-400" />}
              className="bg-black/60 border-gray-700"
            >
              <ScrollArea className="h-[450px]">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(RATIONALIST_TEST_BATTERY).map(([category, prompts]) => {
                    const Icon = RATIONALIST_CATEGORY_ICONS[category as keyof typeof RATIONALIST_CATEGORY_ICONS]
                    const formattedCategory = category
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")

                    return (
                      <AccordionItem key={category} value={category} className="border-gray-700">
                        <AccordionTrigger className="hover:bg-gray-800/50 px-3 rounded-md text-sm">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="text-xs">{formattedCategory}</span>
                            <Badge variant="secondary" className="text-xs">
                              {prompts.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-4 pr-2">
                            {prompts.map((item, index) => (
                              <div key={index} className="relative group">
                                <Button
                                  variant={selectedPrompt === item.prompt ? "secondary" : "ghost"}
                                  className={`justify-start h-auto py-3 text-left text-sm w-full transition-all duration-200 ${
                                    selectedPrompt === item.prompt
                                      ? "bg-red-600/30 border border-red-500/50 text-red-100"
                                      : "hover:bg-gray-700/50"
                                  }`}
                                  onClick={() => handlePromptClick(item.prompt, item.regions)}
                                >
                                  <div className="space-y-2 w-full">
                                    <div className="font-medium text-xs leading-tight">{item.prompt}</div>
                                    <div className="text-xs text-gray-400 leading-tight">{item.explanation}</div>
                                    <div className="text-xs text-yellow-300 italic leading-tight font-medium">
                                      "{item.yudkowskyInsight}"
                                    </div>
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
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-gray-500">Intensity:</span>
                                      <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }, (_, i) => (
                                          <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full ${
                                              i < item.intensity * 5 ? "bg-red-400" : "bg-gray-600"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
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
            </CollapsiblePanel>

            {/* Alignment Research Notes */}
            <CollapsiblePanel
              title="Research Implications"
              icon={<Shield className="h-5 w-5 text-green-400" />}
              className="bg-black/60 border-gray-700"
              defaultExpanded={false}
            >
              <div className="space-y-2 text-xs text-gray-400">
                <div className="p-2 bg-green-800/20 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold mb-1 text-green-400">Computational Insights</h4>
                  <ul className="space-y-0.5">
                    <li>• Map human moral reasoning to neural architectures</li>
                    <li>• Identify failure modes in value optimization</li>
                    <li>• Model instrumental convergence in goal systems</li>
                    <li>• Understand mesa-optimization dynamics</li>
                    <li>• Design corrigible AI architectures</li>
                    <li>• Implement coherent extrapolated volition</li>
                  </ul>
                </div>
                <div className="p-2 bg-blue-800/20 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold mb-1 text-blue-400">Epistemic Status</h4>
                  <p className="text-xs">
                    These scenarios are designed to probe edge cases in human moral reasoning and identify potential
                    failure modes in AI alignment. They represent thought experiments, not predictions.
                  </p>
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
