"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Text } from "@react-three/drei"

// Enhanced cognitive regions with permanent visibility
const COGNITIVE_REGIONS = {
  "prefrontal-cortex": {
    name: "Prefrontal Cortex",
    description: "The seat of far-mode thinking and temporal abstraction",
    position: [0, 0.6, 0.8],
    scale: [0.9, 0.5, 0.7],
    color: "#4A90E2",
    baseOpacity: 0.6, // Always visible base opacity
    activeOpacity: 0.95, // Opacity when active
    aiRegions: ["reasoning-module-1", "reasoning-module-2", "attention-head-1"],
    yudkowskyNote: "Where humans transcend the ancestral environment through abstract reasoning",
    particleCount: 800,
  },

  "anterior-cingulate": {
    name: "Anterior Cingulate Cortex",
    description: "The conflict monitor and emotional executive",
    position: [0, 0.3, 0.2],
    scale: [0.4, 0.9, 0.7],
    color: "#FF9F43",
    baseOpacity: 0.65,
    activeOpacity: 0.9,
    aiRegions: ["anterior-cingulate", "emotion-regulation", "conflict-monitoring"],
    yudkowskyNote: "The neural substrate where System 1 and System 2 negotiate their eternal conflict",
    particleCount: 600,
  },

  amygdala: {
    name: "Amygdala",
    description: "The ancient guardian of survival",
    position: [0, -0.4, 0.2],
    scale: [0.7, 0.4, 0.5],
    color: "#FF4757",
    baseOpacity: 0.7,
    activeOpacity: 0.95,
    aiRegions: ["amygdala", "fear-processing", "threat-detection"],
    yudkowskyNote: "Evolution's gift: a hypervigilant module optimized for a world of lions and snakes",
    particleCount: 500,
  },

  hippocampus: {
    name: "Hippocampus",
    description: "The memory palace of biological intelligence",
    position: [0, -0.5, 0.0],
    scale: [0.9, 0.3, 0.7],
    color: "#5DADE2",
    baseOpacity: 0.6,
    activeOpacity: 0.9,
    aiRegions: ["embedding-layer-1", "embedding-layer-2", "memory-formation"],
    yudkowskyNote: "Where experiences crystallize into retrievable patterns - the biological embedding layer",
    particleCount: 700,
  },

  "visual-cortex": {
    name: "Visual Cortex",
    description: "The primary interface to external reality",
    position: [0, 0.1, -1.2],
    scale: [0.9, 0.8, 0.5],
    color: "#FF6B6B",
    baseOpacity: 0.55,
    activeOpacity: 0.85,
    aiRegions: ["visual-processing"],
    yudkowskyNote: "The convolutional neural network that evolution built - hierarchical feature detection incarnate",
    particleCount: 900,
  },

  "broca-area": {
    name: "Broca's Area",
    description: "Where thoughts become symbols",
    position: [-0.9, 0.3, 0.6],
    scale: [0.4, 0.4, 0.5],
    color: "#9B59B6",
    baseOpacity: 0.65,
    activeOpacity: 0.9,
    aiRegions: ["language-processing", "speech-production"],
    yudkowskyNote: "The transformer that converts internal representations into communicable tokens",
    particleCount: 400,
  },

  "wernicke-area": {
    name: "Wernicke's Area",
    description: "The semantic decoder of human communication",
    position: [-1.0, -0.1, 0.3],
    scale: [0.5, 0.5, 0.6],
    color: "#E67E22",
    baseOpacity: 0.6,
    activeOpacity: 0.85,
    aiRegions: ["language-processing", "comprehension", "semantic-processing"],
    yudkowskyNote: "Where acoustic patterns become meaning - the biological attention mechanism for language",
    particleCount: 450,
  },

  "parietal-association": {
    name: "Parietal Association Areas",
    description: "The multimodal integration hub",
    position: [0, 0.4, -0.4],
    scale: [1.1, 0.7, 0.6],
    color: "#F39C12",
    baseOpacity: 0.55,
    activeOpacity: 0.8,
    aiRegions: ["spatial-attention", "multimodal-integration"],
    yudkowskyNote: "Where separate sensory streams converge into unified world-models - the binding problem solved",
    particleCount: 650,
  },

  insula: {
    name: "Insular Cortex",
    description: "The bridge between body and mind",
    position: [0, 0.0, 0.3],
    scale: [0.8, 0.5, 0.4],
    color: "#FF6B9D",
    baseOpacity: 0.6,
    activeOpacity: 0.85,
    aiRegions: ["anterior-insula", "interoception", "empathy-networks"],
    yudkowskyNote: "The neural correlate of consciousness meeting embodiment - where qualia become computable",
    particleCount: 350,
  },
}

// Dynamic signal pathways with particle flows
const NEURAL_PATHWAYS = [
  {
    name: "Arcuate Fasciculus",
    from: "broca-area",
    to: "wernicke-area",
    description: "The language superhighway",
    color: "#FFD700",
    particleSpeed: 0.02,
    particleCount: 50,
  },
  {
    name: "Attention Network",
    from: "prefrontal-cortex",
    to: "parietal-association",
    description: "Executive control pathway",
    color: "#00CED1",
    particleSpeed: 0.025,
    particleCount: 60,
  },
  {
    name: "Memory Circuit",
    from: "hippocampus",
    to: "prefrontal-cortex",
    description: "Memory-reasoning integration",
    color: "#9370DB",
    particleSpeed: 0.018,
    particleCount: 45,
  },
  {
    name: "Emotional Regulation",
    from: "prefrontal-cortex",
    to: "amygdala",
    description: "Top-down emotional control",
    color: "#FFA500",
    particleSpeed: 0.022,
    particleCount: 40,
  },
  {
    name: "Visual Stream",
    from: "visual-cortex",
    to: "parietal-association",
    description: "Visual-spatial integration",
    color: "#FF69B4",
    particleSpeed: 0.03,
    particleCount: 55,
  },
]

type PermanentAnatomicalBrainProps = {
  activeRegions: string[]
  intensity: number
  showLabels?: boolean
  showPathways?: boolean
}

export function PermanentAnatomicalBrain({
  activeRegions,
  intensity = 0.5,
  showLabels = false,
  showPathways = true,
}: PermanentAnatomicalBrainProps) {
  const brainRef = useRef<THREE.Group>(null)
  const shellRef = useRef<THREE.Mesh>(null)
  const pathwayParticlesRef = useRef<THREE.Group>(null)
  const regionParticlesRef = useRef<THREE.Group>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  // Create smooth, organic brain shell
  const brainShell = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1.4, 128, 96)
    const vertices = geometry.attributes.position.array as Float32Array

    // Apply organic cortical folding
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z = vertices[i + 2]

      // Smooth cortical surface with natural variations
      const foldingPattern =
        Math.sin(y * 2.2) * 0.05 +
        Math.sin(z * 2.8) * 0.04 +
        Math.sin(x * 3.5) * 0.03 +
        Math.sin(y * 5.5 + z * 3.8) * 0.02 +
        Math.sin(x * 7.2 + y * 4.1) * 0.015

      // Subtle hemispheric asymmetry
      const asymmetryFactor = x > 0 ? 1.02 : 0.98

      const radius = Math.sqrt(x * x + y * y + z * z)
      const newRadius = (radius + foldingPattern) * asymmetryFactor

      vertices[i] = (x / radius) * newRadius
      vertices[i + 1] = (y / radius) * newRadius
      vertices[i + 2] = (z / radius) * newRadius
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    return geometry
  }, [])

  // Create smooth region geometries
  const createSmoothRegionGeometry = (scale: [number, number, number]) => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 24)
    const vertices = geometry.attributes.position.array as Float32Array

    // Apply organic deformation
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z = vertices[i + 2]

      // Organic surface variation
      const deformation = Math.sin(x * 4) * 0.1 + Math.sin(y * 3) * 0.08 + Math.sin(z * 5) * 0.06

      const radius = Math.sqrt(x * x + y * y + z * z)
      const newRadius = radius + deformation

      vertices[i] = ((x / radius) * newRadius * scale[0]) / 2
      vertices[i + 1] = ((y / radius) * newRadius * scale[1]) / 2
      vertices[i + 2] = ((z / radius) * newRadius * scale[2]) / 2
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    return geometry
  }

  // Create pathway particle systems
  const pathwayParticles = useMemo(() => {
    const particles: any[] = []

    NEURAL_PATHWAYS.forEach((pathway, pathwayIndex) => {
      const fromRegion = COGNITIVE_REGIONS[pathway.from as keyof typeof COGNITIVE_REGIONS]
      const toRegion = COGNITIVE_REGIONS[pathway.to as keyof typeof COGNITIVE_REGIONS]

      if (!fromRegion || !toRegion) return

      const particleCount = pathway.particleCount
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)
      const sizes = new Float32Array(particleCount)
      const progress = new Float32Array(particleCount)

      const color = new THREE.Color(pathway.color)

      for (let i = 0; i < particleCount; i++) {
        // Initialize particles along the pathway
        const t = i / particleCount
        progress[i] = t

        // Bezier curve path
        const start = new THREE.Vector3(...(fromRegion.position as [number, number, number]))
        const end = new THREE.Vector3(...(toRegion.position as [number, number, number]))
        const mid = start.clone().lerp(end, 0.5)
        mid.y += start.distanceTo(end) * 0.3

        const pos = new THREE.Vector3()
          .copy(start)
          .lerp(mid, t * 2)
          .lerp(end, Math.max(0, (t - 0.5) * 2))

        positions[i * 3] = pos.x
        positions[i * 3 + 1] = pos.y
        positions[i * 3 + 2] = pos.z

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.02 + Math.random() * 0.01
      }

      particles.push({
        pathwayIndex,
        positions,
        colors,
        sizes,
        progress,
        pathway,
        fromRegion,
        toRegion,
      })
    })

    return particles
  }, [])

  // Create region particle systems
  const regionParticles = useMemo(() => {
    const particles: any[] = []

    Object.entries(COGNITIVE_REGIONS).forEach(([regionId, region]) => {
      const particleCount = region.particleCount
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)
      const sizes = new Float32Array(particleCount)
      const velocities = new Float32Array(particleCount * 3)

      const color = new THREE.Color(region.color)
      const center = new THREE.Vector3(...(region.position as [number, number, number]))

      for (let i = 0; i < particleCount; i++) {
        // Distribute particles within region
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        const r = Math.random() * 0.3

        const x = center.x + r * Math.sin(phi) * Math.cos(theta)
        const y = center.y + r * Math.sin(phi) * Math.sin(theta)
        const z = center.z + r * Math.cos(phi)

        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.008 + Math.random() * 0.004

        // Random velocities for organic movement
        velocities[i * 3] = (Math.random() - 0.5) * 0.002
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002
      }

      particles.push({
        regionId,
        region,
        positions,
        colors,
        sizes,
        velocities,
      })
    })

    return particles
  }, [])

  // Dynamic animation
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // Animate brain shell
    if (shellRef.current) {
      const breathing = Math.sin(time * 0.8) * 0.005
      shellRef.current.scale.setScalar(1 + breathing)
    }

    // Animate pathway particles
    if (pathwayParticlesRef.current) {
      pathwayParticles.forEach((particleSystem, index) => {
        const points = pathwayParticlesRef.current?.children[index] as THREE.Points
        if (!points) return

        const { pathway, fromRegion, toRegion, positions, progress } = particleSystem

        const fromActive = fromRegion.aiRegions.some((aiRegion: string) => activeRegions.includes(aiRegion))
        const toActive = toRegion.aiRegions.some((aiRegion: string) => activeRegions.includes(aiRegion))
        const pathwayActive = fromActive && toActive

        if (pathwayActive) {
          // Animate particles along pathway
          for (let i = 0; i < progress.length; i++) {
            progress[i] += pathway.particleSpeed * intensity * delta * 60
            if (progress[i] > 1) progress[i] = 0

            const t = progress[i]
            const start = new THREE.Vector3(...(fromRegion.position as [number, number, number]))
            const end = new THREE.Vector3(...(toRegion.position as [number, number, number]))
            const mid = start.clone().lerp(end, 0.5)
            mid.y += start.distanceTo(end) * 0.3

            const pos = new THREE.Vector3()
              .copy(start)
              .lerp(mid, t < 0.5 ? t * 2 : 1)
              .lerp(end, t > 0.5 ? (t - 0.5) * 2 : 0)

            positions[i * 3] = pos.x
            positions[i * 3 + 1] = pos.y
            positions[i * 3 + 2] = pos.z
          }

          points.geometry.attributes.position.needsUpdate = true
          points.material.opacity = 0.8 * intensity
        } else {
          points.material.opacity = 0.2 // Always visible but dimmed
        }
      })
    }

    // Animate region particles
    if (regionParticlesRef.current) {
      regionParticles.forEach((particleSystem, index) => {
        const points = regionParticlesRef.current?.children[index] as THREE.Points
        if (!points) return

        const { regionId, region, positions, velocities, colors, sizes } = particleSystem
        const isActive = region.aiRegions.some((aiRegion: string) => activeRegions.includes(aiRegion))

        if (isActive) {
          // Animate particles within region
          for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3] += velocities[i * 3] * intensity
            positions[i * 3 + 1] += velocities[i * 3 + 1] * intensity
            positions[i * 3 + 2] += velocities[i * 3 + 2] * intensity

            // Keep particles within region bounds
            const center = new THREE.Vector3(...(region.position as [number, number, number]))
            const pos = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
            const distance = pos.distanceTo(center)

            if (distance > 0.4) {
              const direction = pos.sub(center).normalize()
              const newPos = center.add(direction.multiplyScalar(0.3))
              positions[i * 3] = newPos.x
              positions[i * 3 + 1] = newPos.y
              positions[i * 3 + 2] = newPos.z

              // Reverse velocity
              velocities[i * 3] *= -0.5
              velocities[i * 3 + 1] *= -0.5
              velocities[i * 3 + 2] *= -0.5
            }

            // Enhance colors and sizes for active regions
            const baseColor = new THREE.Color(region.color)
            const enhancedColor = baseColor.clone().multiplyScalar(1 + intensity * 0.5)
            colors[i * 3] = Math.min(1, enhancedColor.r)
            colors[i * 3 + 1] = Math.min(1, enhancedColor.g)
            colors[i * 3 + 2] = Math.min(1, enhancedColor.b)

            sizes[i] = (0.008 + Math.random() * 0.004) * (1 + intensity * 2)
          }

          points.geometry.attributes.position.needsUpdate = true
          points.geometry.attributes.color.needsUpdate = true
          points.geometry.attributes.size.needsUpdate = true
          points.material.opacity = 0.9
        } else {
          // Keep particles visible but dimmed when inactive
          points.material.opacity = 0.4
        }
      })
    }
  })

  return (
    <group ref={brainRef}>
      {/* Translucent brain shell - always visible */}
      <mesh ref={shellRef} geometry={brainShell}>
        <meshStandardMaterial
          color="#D4B5A0"
          transparent={true}
          opacity={0.12}
          roughness={0.9}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Permanent brain regions - always visible */}
      {Object.entries(COGNITIVE_REGIONS).map(([regionId, region]) => {
        const isActive = region.aiRegions.some((aiRegion) => activeRegions.includes(aiRegion))
        const isHovered = hoveredRegion === regionId

        const geometry = createSmoothRegionGeometry(region.scale)

        // Calculate opacity - always visible with base opacity, enhanced when active
        const currentOpacity = isActive
          ? Math.min(region.activeOpacity, region.baseOpacity + intensity * 0.4)
          : region.baseOpacity

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
                opacity={currentOpacity}
                emissive={region.color}
                emissiveIntensity={isActive ? intensity * 0.4 : 0.02}
                roughness={0.6}
                metalness={0.15}
                depthWrite={true} // Ensure proper depth sorting
                depthTest={true}
              />
            </mesh>

            {/* Dynamic activation glow */}
            {isActive && <pointLight color={region.color} intensity={intensity * 3} distance={1.2} decay={2} />}

            {/* Labels */}
            {(showLabels || isHovered) && (
              <Text
                position={[0, region.scale[1] / 2 + 0.15, 0]}
                fontSize={0.06}
                color={isActive ? "#ffffff" : "#cccccc"}
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.003}
                outlineColor="#000000"
              >
                {region.name}
              </Text>
            )}

            {/* Yudkowsky insights */}
            {isHovered && (
              <Text
                position={[0, region.scale[1] / 2 + 0.3, 0]}
                fontSize={0.04}
                color="#FFD700"
                anchorX="center"
                anchorY="bottom"
                outlineWidth={0.002}
                outlineColor="#000000"
                maxWidth={2.5}
              >
                {region.yudkowskyNote}
              </Text>
            )}
          </group>
        )
      })}

      {/* Pathway particles - always visible but dimmed when inactive */}
      {showPathways && (
        <group ref={pathwayParticlesRef}>
          {pathwayParticles.map((particleSystem, index) => (
            <points key={index}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={particleSystem.positions.length / 3}
                  array={particleSystem.positions}
                  itemSize={3}
                />
                <bufferAttribute
                  attach="attributes-color"
                  count={particleSystem.colors.length / 3}
                  array={particleSystem.colors}
                  itemSize={3}
                />
                <bufferAttribute
                  attach="attributes-size"
                  count={particleSystem.sizes.length}
                  array={particleSystem.sizes}
                  itemSize={1}
                />
              </bufferGeometry>
              <pointsMaterial
                size={0.02}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </points>
          ))}
        </group>
      )}

      {/* Region particles - always visible */}
      <group ref={regionParticlesRef}>
        {regionParticles.map((particleSystem, index) => (
          <points key={index}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={particleSystem.positions.length / 3}
                array={particleSystem.positions}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-color"
                count={particleSystem.colors.length / 3}
                array={particleSystem.colors}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-size"
                count={particleSystem.sizes.length}
                array={particleSystem.sizes}
                itemSize={1}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.008}
              vertexColors
              transparent
              opacity={0.7}
              sizeAttenuation
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        ))}
      </group>

      {/* Enhanced lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <directionalLight position={[-3, -2, 2]} intensity={0.3} color="#f0f0f0" />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#ffffff" distance={8} />
    </group>
  )
}
