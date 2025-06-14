"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Text } from "@react-three/drei"

// Enhanced cognitive regions with proper activation mapping
const COGNITIVE_REGIONS = {
  "prefrontal-cortex": {
    name: "Prefrontal Cortex",
    description: "Executive control and abstract reasoning",
    position: [0, 0.6, 0.8],
    scale: [0.9, 0.5, 0.7],
    color: "#4A90E2",
    baseOpacity: 0.4,
    activeOpacity: 0.95,
    aiRegions: ["reasoning-module-1", "reasoning-module-2", "attention-head-1", "prefrontal-cortex"],
    particleCount: 1200,
  },

  "anterior-cingulate": {
    name: "Anterior Cingulate",
    description: "Conflict monitoring and emotional regulation",
    position: [0, 0.3, 0.2],
    scale: [0.4, 0.9, 0.7],
    color: "#FF9F43",
    baseOpacity: 0.45,
    activeOpacity: 0.9,
    aiRegions: ["anterior-cingulate", "emotion-regulation", "conflict-monitoring"],
    particleCount: 800,
  },

  amygdala: {
    name: "Amygdala",
    description: "Threat detection and fear processing",
    position: [0, -0.4, 0.2],
    scale: [0.7, 0.4, 0.5],
    color: "#FF4757",
    baseOpacity: 0.5,
    activeOpacity: 0.95,
    aiRegions: ["amygdala", "fear-processing", "threat-detection"],
    particleCount: 600,
  },

  hippocampus: {
    name: "Hippocampus",
    description: "Memory formation and consolidation",
    position: [0, -0.5, 0.0],
    scale: [0.9, 0.3, 0.7],
    color: "#5DADE2",
    baseOpacity: 0.4,
    activeOpacity: 0.9,
    aiRegions: ["embedding-layer-1", "embedding-layer-2", "memory-formation", "hippocampus"],
    particleCount: 900,
  },

  "visual-cortex": {
    name: "Visual Cortex",
    description: "Visual processing and feature extraction",
    position: [0, 0.1, -1.2],
    scale: [0.9, 0.8, 0.5],
    color: "#FF6B6B",
    baseOpacity: 0.35,
    activeOpacity: 0.85,
    aiRegions: ["visual-processing"],
    particleCount: 1000,
  },

  "language-areas": {
    name: "Language Areas",
    description: "Speech and language processing",
    position: [-0.95, 0.1, 0.45],
    scale: [0.6, 0.6, 0.7],
    color: "#9B59B6",
    baseOpacity: 0.45,
    activeOpacity: 0.9,
    aiRegions: ["language-processing", "speech-production", "comprehension", "semantic-processing"],
    particleCount: 700,
  },

  "parietal-association": {
    name: "Parietal Areas",
    description: "Spatial processing and integration",
    position: [0, 0.4, -0.4],
    scale: [1.1, 0.7, 0.6],
    color: "#F39C12",
    baseOpacity: 0.4,
    activeOpacity: 0.8,
    aiRegions: ["spatial-attention", "multimodal-integration"],
    particleCount: 800,
  },

  insula: {
    name: "Insula",
    description: "Interoception and empathy",
    position: [0, 0.0, 0.3],
    scale: [0.8, 0.5, 0.4],
    color: "#FF6B9D",
    baseOpacity: 0.4,
    activeOpacity: 0.85,
    aiRegions: ["anterior-insula", "interoception", "empathy-networks"],
    particleCount: 500,
  },
}

// Enhanced neural pathways with better flow
const NEURAL_PATHWAYS = [
  {
    name: "Executive Control",
    from: "prefrontal-cortex",
    to: "anterior-cingulate",
    color: "#00CED1",
    particleSpeed: 0.04,
    particleCount: 80,
    thickness: 0.025,
  },
  {
    name: "Memory Integration",
    from: "hippocampus",
    to: "prefrontal-cortex",
    color: "#9370DB",
    particleSpeed: 0.035,
    particleCount: 70,
    thickness: 0.022,
  },
  {
    name: "Emotional Regulation",
    from: "prefrontal-cortex",
    to: "amygdala",
    color: "#FFA500",
    particleSpeed: 0.045,
    particleCount: 60,
    thickness: 0.02,
  },
  {
    name: "Language Network",
    from: "language-areas",
    to: "prefrontal-cortex",
    color: "#FFD700",
    particleSpeed: 0.038,
    particleCount: 65,
    thickness: 0.018,
  },
  {
    name: "Visual Integration",
    from: "visual-cortex",
    to: "parietal-association",
    color: "#FF69B4",
    particleSpeed: 0.042,
    particleCount: 75,
    thickness: 0.02,
  },
]

type EnhancedFixedBrainProps = {
  activeRegions: string[]
  intensity: number
  showLabels?: boolean
  showPathways?: boolean
  isProcessing?: boolean
}

export function EnhancedFixedBrain({
  activeRegions,
  intensity = 0.5,
  showLabels = false,
  showPathways = true,
  isProcessing = false,
}: EnhancedFixedBrainProps) {
  const brainRef = useRef<THREE.Group>(null)
  const shellRef = useRef<THREE.Mesh>(null)
  const pathwayParticlesRef = useRef<THREE.Group>(null)
  const regionParticlesRef = useRef<THREE.Group>(null)
  const regionMeshesRef = useRef<THREE.Group>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [processingRegions, setProcessingRegions] = useState<string[]>([])

  // Update processing regions when activeRegions change
  useEffect(() => {
    if (activeRegions.length > 0) {
      setProcessingRegions(activeRegions)
    }
  }, [activeRegions])

  // Create smooth brain shell
  const brainShell = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1.4, 128, 96)
    const vertices = geometry.attributes.position.array as Float32Array

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z = vertices[i + 2]

      const foldingPattern =
        Math.sin(y * 2.2) * 0.05 +
        Math.sin(z * 2.8) * 0.04 +
        Math.sin(x * 3.5) * 0.03 +
        Math.sin(y * 5.5 + z * 3.8) * 0.02

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

  // Create region geometries
  const createRegionGeometry = (scale: [number, number, number]) => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 24)
    const vertices = geometry.attributes.position.array as Float32Array

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z = vertices[i + 2]

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

  // Enhanced pathway particles
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
      const speeds = new Float32Array(particleCount)

      const color = new THREE.Color(pathway.color)

      for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount
        progress[i] = t
        speeds[i] = 0.5 + Math.random() * 1.0

        const start = new THREE.Vector3(...(fromRegion.position as [number, number, number]))
        const end = new THREE.Vector3(...(toRegion.position as [number, number, number]))
        const distance = start.distanceTo(end)
        const mid = start.clone().lerp(end, 0.5)
        mid.y += distance * 0.3

        const pos = new THREE.Vector3()
        if (t < 0.5) {
          pos.lerpVectors(start, mid, t * 2)
        } else {
          pos.lerpVectors(mid, end, (t - 0.5) * 2)
        }

        positions[i * 3] = pos.x
        positions[i * 3 + 1] = pos.y
        positions[i * 3 + 2] = pos.z

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.02 + Math.random() * 0.015
      }

      particles.push({
        pathwayIndex,
        positions,
        colors,
        sizes,
        progress,
        speeds,
        pathway,
        fromRegion,
        toRegion,
      })
    })

    return particles
  }, [])

  // Enhanced region particles
  const regionParticles = useMemo(() => {
    const particles: any[] = []

    Object.entries(COGNITIVE_REGIONS).forEach(([regionId, region]) => {
      const particleCount = region.particleCount
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)
      const sizes = new Float32Array(particleCount)
      const velocities = new Float32Array(particleCount * 3)
      const phases = new Float32Array(particleCount)

      const color = new THREE.Color(region.color)
      const center = new THREE.Vector3(...(region.position as [number, number, number]))

      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        const r = Math.random() * 0.4

        const x = center.x + r * Math.sin(phi) * Math.cos(theta)
        const y = center.y + r * Math.sin(phi) * Math.sin(theta)
        const z = center.z + r * Math.cos(phi)

        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z

        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = 0.01 + Math.random() * 0.008
        phases[i] = Math.random() * Math.PI * 2

        const tangent = new THREE.Vector3(
          Math.sin(theta + Math.PI / 2),
          (Math.random() - 0.5) * 0.5,
          Math.cos(theta + Math.PI / 2),
        ).normalize()

        velocities[i * 3] = tangent.x * 0.004
        velocities[i * 3 + 1] = tangent.y * 0.003
        velocities[i * 3 + 2] = tangent.z * 0.004
      }

      particles.push({
        regionId,
        region,
        positions,
        colors,
        sizes,
        velocities,
        phases,
      })
    })

    return particles
  }, [])

  // Enhanced animation with proper activation
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // Animate brain shell
    if (shellRef.current) {
      const breathing = Math.sin(time * 0.8) * 0.005
      shellRef.current.scale.setScalar(1 + breathing)
    }

    // Animate region meshes with proper activation
    if (regionMeshesRef.current) {
      regionMeshesRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const regionEntries = Object.entries(COGNITIVE_REGIONS)
        const [regionId, region] = regionEntries[index]

        if (mesh && mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial
          const isActive = region.aiRegions.some((aiRegion) => processingRegions.includes(aiRegion))

          if (isActive) {
            const pulse = Math.sin(time * 3 + index) * 0.3 + 0.7
            material.opacity = Math.min(region.activeOpacity, region.baseOpacity + intensity * pulse * 0.6)
            material.emissiveIntensity = intensity * pulse * 0.8

            // Enhanced color pulsing
            const baseColor = new THREE.Color(region.color)
            const enhancedColor = baseColor.clone().multiplyScalar(1 + pulse * intensity * 0.5)
            material.color.copy(enhancedColor)
          } else {
            material.opacity = region.baseOpacity
            material.emissiveIntensity = 0.05
            material.color.copy(new THREE.Color(region.color))
          }
        }
      })
    }

    // Animate pathway particles with enhanced flow
    if (pathwayParticlesRef.current) {
      pathwayParticles.forEach((particleSystem, index) => {
        const points = pathwayParticlesRef.current?.children[index] as THREE.Points
        if (!points) return

        const { pathway, fromRegion, toRegion, positions, progress, speeds, colors, sizes } = particleSystem

        const fromActive = fromRegion.aiRegions.some((aiRegion: string) => processingRegions.includes(aiRegion))
        const toActive = toRegion.aiRegions.some((aiRegion: string) => processingRegions.includes(aiRegion))
        const pathwayActive = fromActive && toActive

        if (pathwayActive) {
          for (let i = 0; i < progress.length; i++) {
            progress[i] += pathway.particleSpeed * speeds[i] * intensity * delta * 60
            if (progress[i] > 1) progress[i] = 0

            const t = progress[i]
            const start = new THREE.Vector3(...(fromRegion.position as [number, number, number]))
            const end = new THREE.Vector3(...(toRegion.position as [number, number, number]))
            const distance = start.distanceTo(end)
            const mid = start.clone().lerp(end, 0.5)
            mid.y += distance * 0.3

            const pos = new THREE.Vector3()
            if (t < 0.5) {
              pos.lerpVectors(start, mid, t * 2)
            } else {
              pos.lerpVectors(mid, end, (t - 0.5) * 2)
            }

            positions[i * 3] = pos.x
            positions[i * 3 + 1] = pos.y
            positions[i * 3 + 2] = pos.z

            // Enhanced pulsing colors
            const colorPulse = Math.sin(t * Math.PI * 2 + time * 2) * 0.5 + 0.5
            const baseColor = new THREE.Color(pathway.color)
            const pulseColor = baseColor.clone().multiplyScalar(0.5 + colorPulse * 0.8)

            colors[i * 3] = pulseColor.r
            colors[i * 3 + 1] = pulseColor.g
            colors[i * 3 + 2] = pulseColor.b

            sizes[i] = (0.02 + Math.random() * 0.015) * (1 + colorPulse * intensity)
          }

          points.geometry.attributes.position.needsUpdate = true
          points.geometry.attributes.color.needsUpdate = true
          points.geometry.attributes.size.needsUpdate = true
          points.material.opacity = 0.9 * intensity
        } else {
          points.material.opacity = 0.15
        }
      })
    }

    // Animate region particles with enhanced effects
    if (regionParticlesRef.current) {
      regionParticles.forEach((particleSystem, index) => {
        const points = regionParticlesRef.current?.children[index] as THREE.Points
        if (!points) return

        const { regionId, region, positions, velocities, colors, sizes, phases } = particleSystem
        const isActive = region.aiRegions.some((aiRegion: string) => processingRegions.includes(aiRegion))

        for (let i = 0; i < positions.length / 3; i++) {
          const phase = phases[i] + time * 3
          const pulseFactor = Math.sin(phase) * 0.5 + 0.5

          if (isActive) {
            // Enhanced orbital movement
            positions[i * 3] += velocities[i * 3] * intensity * (1 + pulseFactor)
            positions[i * 3 + 1] += velocities[i * 3 + 1] * intensity * (1 + pulseFactor)
            positions[i * 3 + 2] += velocities[i * 3 + 2] * intensity * (1 + pulseFactor)

            // Keep particles within bounds
            const center = new THREE.Vector3(...(region.position as [number, number, number]))
            const pos = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
            const distance = pos.distanceTo(center)

            if (distance > 0.45) {
              const direction = pos.sub(center).normalize()
              const newPos = center.add(direction.multiplyScalar(0.4))
              positions[i * 3] = newPos.x
              positions[i * 3 + 1] = newPos.y
              positions[i * 3 + 2] = newPos.z

              velocities[i * 3] *= -0.7
              velocities[i * 3 + 1] *= -0.7
              velocities[i * 3 + 2] *= -0.7
            }

            // Enhanced pulsing colors
            const baseColor = new THREE.Color(region.color)
            const enhancedColor = baseColor.clone().multiplyScalar(1 + pulseFactor * intensity * 1.2)
            colors[i * 3] = Math.min(1, enhancedColor.r)
            colors[i * 3 + 1] = Math.min(1, enhancedColor.g)
            colors[i * 3 + 2] = Math.min(1, enhancedColor.b)

            sizes[i] = (0.01 + Math.random() * 0.008) * (1 + pulseFactor * intensity * 3)
          } else {
            // Dimmed inactive state
            const baseColor = new THREE.Color(region.color)
            colors[i * 3] = baseColor.r * 0.3
            colors[i * 3 + 1] = baseColor.g * 0.3
            colors[i * 3 + 2] = baseColor.b * 0.3
            sizes[i] = 0.008
          }
        }

        points.geometry.attributes.position.needsUpdate = true
        points.geometry.attributes.color.needsUpdate = true
        points.geometry.attributes.size.needsUpdate = true
        points.material.opacity = isActive ? 0.9 : 0.4
      })
    }
  })

  return (
    <group ref={brainRef}>
      {/* Translucent brain shell */}
      <mesh ref={shellRef} geometry={brainShell}>
        <meshStandardMaterial
          color="#D4B5A0"
          transparent={true}
          opacity={0.06}
          roughness={0.9}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Brain regions with enhanced activation */}
      <group ref={regionMeshesRef}>
        {Object.entries(COGNITIVE_REGIONS).map(([regionId, region]) => {
          const isActive = region.aiRegions.some((aiRegion) => processingRegions.includes(aiRegion))
          const isHovered = hoveredRegion === regionId
          const geometry = createRegionGeometry(region.scale)

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
                  opacity={isActive ? region.activeOpacity : region.baseOpacity}
                  emissive={region.color}
                  emissiveIntensity={isActive ? intensity * 0.6 : 0.03}
                  roughness={0.6}
                  metalness={0.15}
                  depthWrite={true}
                  depthTest={true}
                  alphaTest={0.01}
                />
              </mesh>

              {/* Enhanced activation glow */}
              {isActive && <pointLight color={region.color} intensity={intensity * 5} distance={1.8} decay={2} />}

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
            </group>
          )
        })}
      </group>

      {/* Enhanced pathway particles */}
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

      {/* Enhanced region particles */}
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
              size={0.01}
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#f0f0f0" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#ffffff" distance={10} />
    </group>
  )
}
