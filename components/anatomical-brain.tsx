"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Text } from "@react-three/drei"

// Anatomically precise brain regions with distinct geometries
const BRAIN_REGIONS = {
  // Frontal Lobe Regions
  "prefrontal-cortex": {
    name: "Prefrontal Cortex",
    description: "Executive control, working memory, abstract reasoning",
    geometry: "frontal-lobe",
    position: [0, 0.6, 0.8],
    scale: [0.8, 0.4, 0.6],
    color: "#4A90E2",
    baseOpacity: 0.7,
    aiRegions: ["reasoning-module-1", "reasoning-module-2", "attention-head-1"],
    yudkowskyNote: "The seat of human goal-directed behavior and long-term planning",
  },

  "motor-cortex": {
    name: "Primary Motor Cortex",
    description: "Motor control and movement execution",
    geometry: "motor-strip",
    position: [0, 0.8, 0.2],
    scale: [1.2, 0.2, 0.4],
    color: "#E74C3C",
    baseOpacity: 0.6,
    aiRegions: ["motor-control", "fine-tuning"],
    yudkowskyNote: "The bridge between intention and action - where decisions become reality",
  },

  "broca-area": {
    name: "Broca's Area",
    description: "Speech production and syntactic processing",
    geometry: "language-region",
    position: [-0.9, 0.3, 0.6],
    scale: [0.3, 0.3, 0.4],
    color: "#9B59B6",
    baseOpacity: 0.8,
    aiRegions: ["language-processing", "speech-production"],
    yudkowskyNote: "Where thoughts crystallize into communicable symbolic structures",
  },

  // Parietal Lobe Regions
  "somatosensory-cortex": {
    name: "Somatosensory Cortex",
    description: "Touch, pressure, temperature processing",
    geometry: "sensory-strip",
    position: [0, 0.7, -0.1],
    scale: [1.2, 0.2, 0.3],
    color: "#1ABC9C",
    baseOpacity: 0.6,
    aiRegions: ["sensory-processing"],
    yudkowskyNote: "The interface between mind and physical reality",
  },

  "parietal-association": {
    name: "Parietal Association Areas",
    description: "Spatial processing, attention, multimodal integration",
    geometry: "parietal-lobe",
    position: [0, 0.4, -0.4],
    scale: [1.0, 0.6, 0.5],
    color: "#F39C12",
    baseOpacity: 0.7,
    aiRegions: ["spatial-attention", "multimodal-integration"],
    yudkowskyNote: "Where separate sensory streams converge into unified world-models",
  },

  // Temporal Lobe Regions
  "wernicke-area": {
    name: "Wernicke's Area",
    description: "Language comprehension and semantic processing",
    geometry: "language-region",
    position: [-1.0, -0.1, 0.3],
    scale: [0.4, 0.4, 0.5],
    color: "#E67E22",
    baseOpacity: 0.8,
    aiRegions: ["language-processing", "comprehension", "semantic-processing"],
    yudkowskyNote: "The decoder of symbolic meaning - where sounds become concepts",
  },

  "temporal-association": {
    name: "Temporal Association Areas",
    description: "Memory formation, object recognition",
    geometry: "temporal-lobe",
    position: [0, -0.3, 0.1],
    scale: [1.1, 0.5, 0.8],
    color: "#8E44AD",
    baseOpacity: 0.6,
    aiRegions: ["memory-formation", "object-recognition"],
    yudkowskyNote: "The repository of learned patterns and experiential knowledge",
  },

  // Occipital Lobe
  "visual-cortex": {
    name: "Visual Cortex",
    description: "Visual processing and feature extraction",
    geometry: "occipital-lobe",
    position: [0, 0.1, -1.2],
    scale: [0.8, 0.7, 0.4],
    color: "#FF6B6B",
    baseOpacity: 0.7,
    aiRegions: ["visual-processing"],
    yudkowskyNote: "The primary interface for gathering information about external reality",
  },

  // Limbic System
  "anterior-cingulate": {
    name: "Anterior Cingulate Cortex",
    description: "Emotion regulation, conflict monitoring, empathy",
    geometry: "cingulate",
    position: [0, 0.3, 0.2],
    scale: [0.3, 0.8, 0.6],
    color: "#FF9F43",
    baseOpacity: 0.8,
    aiRegions: ["anterior-cingulate", "emotion-regulation", "conflict-monitoring"],
    yudkowskyNote: "The emotional executive - where feelings inform rational decisions",
  },

  amygdala: {
    name: "Amygdala",
    description: "Fear processing, threat detection, emotional memory",
    geometry: "amygdala",
    position: [0, -0.4, 0.2],
    scale: [0.6, 0.3, 0.4],
    color: "#FF4757",
    baseOpacity: 0.9,
    aiRegions: ["amygdala", "fear-processing", "threat-detection"],
    yudkowskyNote: "The ancient guardian - optimized for survival in ancestral environments",
  },

  hippocampus: {
    name: "Hippocampus",
    description: "Memory consolidation, spatial navigation, learning",
    geometry: "hippocampus",
    position: [0, -0.5, 0.0],
    scale: [0.8, 0.2, 0.6],
    color: "#5DADE2",
    baseOpacity: 0.8,
    aiRegions: ["embedding-layer-1", "embedding-layer-2", "memory-formation"],
    yudkowskyNote: "The indexer of experience - where moments become lasting knowledge",
  },

  insula: {
    name: "Insular Cortex",
    description: "Interoception, empathy, emotional awareness",
    geometry: "insula",
    position: [0, 0.0, 0.3],
    scale: [0.7, 0.4, 0.3],
    color: "#FF6B9D",
    baseOpacity: 0.8,
    aiRegions: ["anterior-insula", "interoception", "empathy-networks"],
    yudkowskyNote: "The bridge between body and mind - where feelings become conscious",
  },
}

// Signal pathways between brain regions
const NEURAL_PATHWAYS = [
  {
    name: "Arcuate Fasciculus",
    from: "broca-area",
    to: "wernicke-area",
    description: "Language processing pathway",
    color: "#FFD700",
    thickness: 0.02,
  },
  {
    name: "Corticospinal Tract",
    from: "motor-cortex",
    to: "brainstem",
    description: "Motor control pathway",
    color: "#FF6347",
    thickness: 0.025,
  },
  {
    name: "Visual Stream",
    from: "visual-cortex",
    to: "temporal-association",
    description: "Object recognition pathway",
    color: "#FF69B4",
    thickness: 0.02,
  },
  {
    name: "Attention Network",
    from: "prefrontal-cortex",
    to: "parietal-association",
    description: "Executive attention pathway",
    color: "#00CED1",
    thickness: 0.03,
  },
  {
    name: "Memory Circuit",
    from: "hippocampus",
    to: "temporal-association",
    description: "Memory consolidation pathway",
    color: "#9370DB",
    thickness: 0.025,
  },
  {
    name: "Emotional Regulation",
    from: "prefrontal-cortex",
    to: "amygdala",
    description: "Top-down emotional control",
    color: "#FFA500",
    thickness: 0.02,
  },
]

type AnatomicalBrainProps = {
  activeRegions: string[]
  intensity: number
  showLabels?: boolean
  showPathways?: boolean
}

export function AnatomicalBrain({
  activeRegions,
  intensity = 0.5,
  showLabels = false,
  showPathways = true,
}: AnatomicalBrainProps) {
  const brainRef = useRef<THREE.Group>(null)
  const pathwaysRef = useRef<THREE.Group>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  // Create geometries for different brain region types
  const createRegionGeometry = (type: string, scale: [number, number, number]) => {
    switch (type) {
      case "frontal-lobe":
        return new THREE.BoxGeometry(scale[0], scale[1], scale[2]).translate(0, scale[1] / 2, 0)
      case "motor-strip":
        return new THREE.CylinderGeometry(scale[0] / 2, scale[0] / 2, scale[1], 16).rotateZ(Math.PI / 2)
      case "sensory-strip":
        return new THREE.CylinderGeometry(scale[0] / 2, scale[0] / 2, scale[1], 16).rotateZ(Math.PI / 2)
      case "parietal-lobe":
        return new THREE.SphereGeometry(scale[0] / 2, 16, 12).scale(scale[0], scale[1], scale[2])
      case "temporal-lobe":
        return new THREE.ConeGeometry(scale[0] / 2, scale[1], 12).rotateX(Math.PI / 2)
      case "occipital-lobe":
        return new THREE.SphereGeometry(scale[0] / 2, 16, 12).scale(scale[0], scale[1], scale[2])
      case "language-region":
        return new THREE.DodecahedronGeometry(scale[0] / 2).scale(scale[0], scale[1], scale[2])
      case "cingulate":
        return new THREE.TorusGeometry(scale[0] / 2, scale[1] / 8, 8, 16).rotateX(Math.PI / 2)
      case "amygdala":
        return new THREE.TetrahedronGeometry(scale[0] / 2).scale(scale[0], scale[1], scale[2])
      case "hippocampus":
        return new THREE.CylinderGeometry(scale[0] / 4, scale[0] / 2, scale[1], 8).rotateZ(Math.PI / 4)
      case "insula":
        return new THREE.OctahedronGeometry(scale[0] / 2).scale(scale[0], scale[1], scale[2])
      default:
        return new THREE.SphereGeometry(scale[0] / 2, 16, 12)
    }
  }

  // Create pathway geometry
  const createPathwayGeometry = (from: [number, number, number], to: [number, number, number], thickness: number) => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    const distance = start.distanceTo(end)

    // Create curved path
    const midpoint = start.clone().lerp(end, 0.5)
    midpoint.y += distance * 0.2 // Arc upward

    const curve = new THREE.QuadraticBezierCurve3(start, midpoint, end)
    return new THREE.TubeGeometry(curve, 32, thickness, 8, false)
  }

  // Render brain regions
  const renderBrainRegions = () => {
    return Object.entries(BRAIN_REGIONS).map(([regionId, region]) => {
      const isActive = region.aiRegions.some((aiRegion) => activeRegions.includes(aiRegion))
      const isHovered = hoveredRegion === regionId

      const geometry = createRegionGeometry(region.geometry, region.scale)

      return (
        <group
          key={regionId}
          position={region.position}
          onPointerOver={() => setHoveredRegion(regionId)}
          onPointerOut={() => setHoveredRegion(null)}
        >
          <mesh geometry={geometry}>
            <meshStandardMaterial
              color={region.color}
              transparent={true}
              opacity={isActive ? Math.min(1.0, region.baseOpacity + intensity * 0.4) : region.baseOpacity * 0.6}
              emissive={region.color}
              emissiveIntensity={isActive ? intensity * 0.6 : 0.05}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>

          {/* Activation glow */}
          {isActive && <pointLight color={region.color} intensity={intensity * 4} distance={1.5} decay={2} />}

          {/* Region labels */}
          {(showLabels || isHovered) && (
            <Text
              position={[0, region.scale[1] / 2 + 0.1, 0]}
              fontSize={0.08}
              color={isActive ? "#ffffff" : "#cccccc"}
              anchorX="center"
              anchorY="bottom"
              outlineWidth={0.005}
              outlineColor="#000000"
            >
              {region.name}
            </Text>
          )}

          {/* Yudkowsky insight on hover */}
          {isHovered && (
            <Text
              position={[0, region.scale[1] / 2 + 0.25, 0]}
              fontSize={0.05}
              color="#FFD700"
              anchorX="center"
              anchorY="bottom"
              outlineWidth={0.003}
              outlineColor="#000000"
              maxWidth={2}
            >
              {region.yudkowskyNote}
            </Text>
          )}
        </group>
      )
    })
  }

  // Render neural pathways
  const renderNeuralPathways = () => {
    if (!showPathways) return null

    return NEURAL_PATHWAYS.map((pathway, index) => {
      const fromRegion = BRAIN_REGIONS[pathway.from as keyof typeof BRAIN_REGIONS]
      const toRegion = BRAIN_REGIONS[pathway.to as keyof typeof BRAIN_REGIONS]

      if (!fromRegion || !toRegion) return null

      const fromActive = fromRegion.aiRegions.some((aiRegion) => activeRegions.includes(aiRegion))
      const toActive = toRegion.aiRegions.some((aiRegion) => activeRegions.includes(aiRegion))
      const pathwayActive = fromActive && toActive

      const geometry = createPathwayGeometry(
        fromRegion.position as [number, number, number],
        toRegion.position as [number, number, number],
        pathway.thickness,
      )

      return (
        <mesh key={index} geometry={geometry}>
          <meshStandardMaterial
            color={pathway.color}
            transparent={true}
            opacity={pathwayActive ? 0.9 : 0.3}
            emissive={pathway.color}
            emissiveIntensity={pathwayActive ? intensity * 0.8 : 0.1}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
      )
    })
  }

  // Signal flow animation
  useFrame((state, delta) => {
    if (brainRef.current) {
      const t = state.clock.getElapsedTime()
      // Subtle breathing animation
      const breathing = Math.sin(t * 0.6) * 0.005
      brainRef.current.scale.setScalar(1 + breathing)
    }

    // Animate pathway signals
    if (pathwaysRef.current) {
      pathwaysRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          const pathway = NEURAL_PATHWAYS[index]
          if (pathway) {
            const fromRegion = BRAIN_REGIONS[pathway.from as keyof typeof BRAIN_REGIONS]
            const toRegion = BRAIN_REGIONS[pathway.to as keyof typeof BRAIN_REGIONS]

            const fromActive = fromRegion?.aiRegions.some((aiRegion) => activeRegions.includes(aiRegion))
            const toActive = toRegion?.aiRegions.some((aiRegion) => activeRegions.includes(aiRegion))

            if (fromActive && toActive) {
              const t = state.clock.getElapsedTime()
              const pulse = Math.sin(t * 3 + index) * 0.5 + 0.5
              child.material.emissiveIntensity = intensity * pulse * 0.8
            }
          }
        }
      })
    }
  })

  return (
    <group ref={brainRef}>
      {/* Brain regions */}
      {renderBrainRegions()}

      {/* Neural pathways */}
      <group ref={pathwaysRef}>{renderNeuralPathways()}</group>

      {/* Enhanced lighting for anatomical visibility */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-5, -2, 2]} intensity={0.4} color="#f0f0f0" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#ffffff" distance={10} />
    </group>
  )
}
