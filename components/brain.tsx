"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Text } from "@react-three/drei"

// Anatomically precise Brodmann areas with smooth surface coordinates
const BRODMANN_AREAS = {
  // Primary Motor Cortex (Precentral Gyrus)
  BA4: {
    name: "Primary Motor Cortex",
    hemisphere: "bilateral",
    coordinates: [
      { pos: [-0.42, 0.75, 0.58], intensity: 0.8 },
      { pos: [-0.48, 0.55, 0.72], intensity: 0.9 },
      { pos: [-0.38, 0.95, 0.42], intensity: 0.7 },
      { pos: [0.42, 0.75, 0.58], intensity: 0.8 },
      { pos: [0.48, 0.55, 0.72], intensity: 0.9 },
      { pos: [0.38, 0.95, 0.42], intensity: 0.7 },
    ],
    color: "#FF6B6B",
    aiRegions: ["motor-control", "fine-tuning"],
  },

  // Primary Somatosensory Cortex (Postcentral Gyrus)
  BA3: {
    name: "Primary Somatosensory Cortex",
    hemisphere: "bilateral",
    coordinates: [
      { pos: [-0.55, 0.7, 0.5], intensity: 0.8 },
      { pos: [-0.6, 0.5, 0.7], intensity: 0.9 },
      { pos: [-0.5, 0.9, 0.3], intensity: 0.7 },
      { pos: [0.55, 0.7, 0.5], intensity: 0.8 },
      { pos: [0.6, 0.5, 0.7], intensity: 0.9 },
      { pos: [0.5, 0.9, 0.3], intensity: 0.7 },
    ],
    color: "#4ECDC4",
    aiRegions: ["sensory-processing"],
  },

  // Primary Visual Cortex (Calcarine Sulcus)
  BA17: {
    name: "Primary Visual Cortex",
    hemisphere: "bilateral",
    coordinates: [
      { pos: [-0.28, 0.18, -1.32], intensity: 0.9 },
      { pos: [-0.08, -0.02, -1.42], intensity: 1.0 },
      { pos: [-0.38, 0.38, -1.22], intensity: 0.8 },
      { pos: [0.28, 0.18, -1.32], intensity: 0.9 },
      { pos: [0.08, -0.02, -1.42], intensity: 1.0 },
      { pos: [0.38, 0.38, -1.22], intensity: 0.8 },
    ],
    color: "#FF9F43",
    aiRegions: ["visual-processing"],
  },

  // Broca's Area (Left Hemisphere)
  BA44: {
    name: "Broca's Area",
    hemisphere: "left",
    coordinates: [
      { pos: [-1.05, 0.28, 0.75], intensity: 0.9 },
      { pos: [-1.15, 0.08, 0.85], intensity: 0.8 },
      { pos: [-0.95, 0.48, 0.65], intensity: 0.7 },
    ],
    color: "#6C5CE7",
    aiRegions: ["language-processing", "speech-production"],
  },

  BA45: {
    name: "Broca's Area (Pars Triangularis)",
    hemisphere: "left",
    coordinates: [
      { pos: [-1.0, 0.4, 1.0], intensity: 0.8 },
      { pos: [-1.1, 0.2, 1.1], intensity: 0.9 },
      { pos: [-0.9, 0.6, 0.9], intensity: 0.7 },
    ],
    color: "#A29BFE",
    aiRegions: ["language-processing", "semantic-processing"],
  },

  // Wernicke's Area (Left Hemisphere)
  BA22: {
    name: "Wernicke's Area",
    hemisphere: "left",
    coordinates: [
      { pos: [-1.25, -0.18, 0.38], intensity: 0.9 },
      { pos: [-1.35, -0.38, 0.48], intensity: 0.8 },
      { pos: [-1.15, 0.02, 0.28], intensity: 0.7 },
    ],
    color: "#FD79A8",
    aiRegions: ["language-processing", "comprehension"],
  },

  // Dorsolateral Prefrontal Cortex
  BA9: {
    name: "Dorsolateral Prefrontal Cortex",
    hemisphere: "bilateral",
    coordinates: [
      { pos: [-0.68, 1.15, 0.95], intensity: 0.8 },
      { pos: [-0.78, 0.95, 1.15], intensity: 0.9 },
      { pos: [-0.58, 1.35, 0.75], intensity: 0.7 },
      { pos: [0.68, 1.15, 0.95], intensity: 0.8 },
      { pos: [0.78, 0.95, 1.15], intensity: 0.9 },
      { pos: [0.58, 1.35, 0.75], intensity: 0.7 },
    ],
    color: "#00B894",
    aiRegions: ["reasoning-module-1", "working-memory", "attention-head-1"],
  },

  // Anterior Cingulate Cortex
  BA24: {
    name: "Anterior Cingulate Cortex",
    hemisphere: "bilateral",
    coordinates: [
      { pos: [-0.08, 0.75, 0.55], intensity: 0.8 },
      { pos: [0.0, 0.85, 0.45], intensity: 0.9 },
      { pos: [0.08, 0.75, 0.55], intensity: 0.8 },
      { pos: [-0.18, 0.65, 0.65], intensity: 0.7 },
      { pos: [0.18, 0.65, 0.65], intensity: 0.7 },
    ],
    color: "#E17055",
    aiRegions: ["anterior-cingulate", "emotion-regulation", "conflict-monitoring"],
  },

  // Emotional processing regions
  AMYGDALA: {
    name: "Amygdala",
    hemisphere: "bilateral",
    coordinates: [
      { pos: [-0.75, -0.18, 0.28], intensity: 0.9 },
      { pos: [-0.85, -0.38, 0.38], intensity: 0.8 },
      { pos: [0.75, -0.18, 0.28], intensity: 0.9 },
      { pos: [0.85, -0.38, 0.38], intensity: 0.8 },
    ],
    color: "#FF7675",
    aiRegions: ["amygdala", "fear-processing", "threat-detection"],
  },

  INSULA: {
    name: "Insular Cortex",
    hemisphere: "bilateral",
    coordinates: [
      { pos: [-0.85, 0.08, 0.18], intensity: 0.8 },
      { pos: [-0.75, -0.12, 0.38], intensity: 0.9 },
      { pos: [0.85, 0.08, 0.18], intensity: 0.8 },
      { pos: [0.75, -0.12, 0.38], intensity: 0.9 },
    ],
    color: "#E84393",
    aiRegions: ["anterior-insula", "interoception", "empathy-networks"],
  },

  HIPPOCAMPUS: {
    name: "Hippocampus",
    hemisphere: "bilateral",
    coordinates: [
      { pos: [-0.55, -0.28, 0.08], intensity: 0.8 },
      { pos: [-0.65, -0.48, 0.28], intensity: 0.9 },
      { pos: [0.55, -0.28, 0.08], intensity: 0.8 },
      { pos: [0.65, -0.48, 0.28], intensity: 0.9 },
    ],
    color: "#00CEC9",
    aiRegions: ["embedding-layer-1", "memory-formation", "spatial-navigation"],
  },
}

// Smooth cortical folding patterns
const CORTICAL_FEATURES = {
  sulci: [
    {
      name: "Central Sulcus",
      path: [
        [-0.48, 1.15, 0.75],
        [-0.48, 0.75, 0.55],
        [-0.48, 0.35, 0.35],
        [-0.48, -0.05, 0.15],
      ],
      depth: 0.08,
      width: 0.04,
    },
    {
      name: "Lateral Sulcus",
      path: [
        [-1.35, 0.55, 0.75],
        [-1.15, 0.35, 0.55],
        [-0.95, 0.15, 0.35],
        [-0.75, -0.05, 0.15],
      ],
      depth: 0.12,
      width: 0.06,
    },
    {
      name: "Calcarine Sulcus",
      path: [
        [-0.35, 0.35, -1.35],
        [-0.15, 0.15, -1.45],
        [0.0, -0.05, -1.55],
        [0.15, 0.15, -1.45],
        [0.35, 0.35, -1.35],
      ],
      depth: 0.1,
      width: 0.05,
    },
  ],
}

type BrainProps = {
  activeRegions: string[]
  intensity: number
  showLabels?: boolean
  showAnatomicalDetails?: boolean
}

export function Brain({
  activeRegions,
  intensity = 0.5,
  showLabels = false,
  showAnatomicalDetails = true,
}: BrainProps) {
  const brainRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  // Create smooth, unified brain geometry
  const brainGeometry = useMemo(() => {
    const group = new THREE.Group()

    // Create unified brain surface
    const brainGeometry = new THREE.SphereGeometry(1.25, 128, 96)
    const vertices = brainGeometry.attributes.position.array as Float32Array

    // Apply smooth cortical folding
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z = vertices[i + 2]

      // Smooth cortical folding with natural variations
      const foldingPattern =
        Math.sin(y * 2.5) * 0.04 +
        Math.sin(z * 3.2) * 0.03 +
        Math.sin(x * 4.1) * 0.025 +
        Math.sin(y * 6.8 + z * 4.2) * 0.015 +
        Math.sin(x * 8.5 + y * 5.3) * 0.01

      // Add subtle asymmetry
      const asymmetryFactor = x > 0 ? 1.015 : 0.985

      const radius = Math.sqrt(x * x + y * y + z * z)
      const newRadius = (radius + foldingPattern) * asymmetryFactor

      vertices[i] = (x / radius) * newRadius
      vertices[i + 1] = (y / radius) * newRadius
      vertices[i + 2] = (z / radius) * newRadius
    }

    brainGeometry.attributes.position.needsUpdate = true
    brainGeometry.computeVertexNormals()

    // Main brain surface with organic material
    const brainMesh = new THREE.Mesh(
      brainGeometry,
      new THREE.MeshStandardMaterial({
        color: "#D4B5A0",
        transparent: true,
        opacity: 0.92,
        roughness: 0.85,
        metalness: 0.08,
        side: THREE.DoubleSide,
      }),
    )

    // Integrated cerebellum
    const cerebellumGeometry = new THREE.SphereGeometry(0.58, 64, 48)
    const cerebellumVertices = cerebellumGeometry.attributes.position.array as Float32Array

    // Smooth cerebellar foliation
    for (let i = 0; i < cerebellumVertices.length; i += 3) {
      const x = cerebellumVertices[i]
      const y = cerebellumVertices[i + 1]
      const z = cerebellumVertices[i + 2]

      const foliation = Math.sin(y * 8) * 0.025 + Math.sin(x * 6) * 0.02 + Math.sin(z * 5) * 0.015

      const radius = Math.sqrt(x * x + y * y + z * z)
      const newRadius = radius + foliation

      cerebellumVertices[i] = (x / radius) * newRadius
      cerebellumVertices[i + 1] = (y / radius) * newRadius
      cerebellumVertices[i + 2] = (z / radius) * newRadius
    }

    cerebellumGeometry.attributes.position.needsUpdate = true
    cerebellumGeometry.computeVertexNormals()

    const cerebellum = new THREE.Mesh(
      cerebellumGeometry,
      new THREE.MeshStandardMaterial({
        color: "#C8A888",
        transparent: true,
        opacity: 0.95,
        roughness: 0.9,
        metalness: 0.05,
      }),
    )
    cerebellum.position.set(0, -0.85, -0.82)
    cerebellum.scale.set(1.25, 0.75, 1.05)

    // Smooth brainstem integration
    const brainstemGeometry = new THREE.CylinderGeometry(0.15, 0.22, 0.9, 16)
    const brainstem = new THREE.Mesh(
      brainstemGeometry,
      new THREE.MeshStandardMaterial({
        color: "#B8958F",
        transparent: true,
        opacity: 0.98,
        roughness: 0.8,
        metalness: 0.12,
      }),
    )
    brainstem.position.set(0, -1.05, -0.35)

    group.add(brainMesh)
    group.add(cerebellum)
    group.add(brainstem)

    return group
  }, [])

  // Enhanced surface particle system
  const surfaceParticles = useMemo(() => {
    const particleCount = 18000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    const regions = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      // Distribute on smooth cortical surface
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      let radius = 1.28 + Math.random() * 0.05
      let x = radius * Math.sin(phi) * Math.cos(theta)
      let y = radius * Math.sin(phi) * Math.sin(theta)
      let z = radius * Math.cos(phi)

      // Apply same folding as brain surface
      const foldingPattern =
        Math.sin(y * 2.5) * 0.04 +
        Math.sin(z * 3.2) * 0.03 +
        Math.sin(x * 4.1) * 0.025 +
        Math.sin(y * 6.8 + z * 4.2) * 0.015

      radius += foldingPattern
      const norm = Math.sqrt(x * x + y * y + z * z)
      x = (x / norm) * radius
      y = (y / norm) * radius
      z = (z / norm) * radius

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Assign to nearest brain region
      let assignedRegion = 0
      let minDistance = Number.POSITIVE_INFINITY

      Object.entries(BRODMANN_AREAS).forEach(([key, area], index) => {
        area.coordinates.forEach((coord) => {
          const distance = Math.sqrt((x - coord.pos[0]) ** 2 + (y - coord.pos[1]) ** 2 + (z - coord.pos[2]) ** 2)
          if (distance < minDistance) {
            minDistance = distance
            assignedRegion = index
          }
        })
      })

      regions[i] = assignedRegion

      // Set particle properties
      const regionKeys = Object.keys(BRODMANN_AREAS)
      const regionKey = regionKeys[assignedRegion] || regionKeys[0]
      const region = BRODMANN_AREAS[regionKey as keyof typeof BRODMANN_AREAS]

      const color = new THREE.Color(region.color)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = 0.8 + Math.random() * 0.4

      // Surface tangent velocity
      const normal = new THREE.Vector3(x, y, z).normalize()
      const tangent = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .cross(normal)
        .normalize()

      velocities[i * 3] = tangent.x * 0.008
      velocities[i * 3 + 1] = tangent.y * 0.008
      velocities[i * 3 + 2] = tangent.z * 0.008
    }

    return { positions, colors, sizes, velocities, regions }
  }, [])

  // Smooth animation
  useFrame((state, delta) => {
    if (brainRef.current) {
      const t = state.clock.getElapsedTime()
      // Subtle organic breathing
      const breathing = Math.sin(t * 0.8) * 0.003
      brainRef.current.scale.setScalar(1 + breathing)
    }

    // Animate particles along surface
    if (particlesRef.current && particlesRef.current.geometry.attributes.position) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array
      const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array
      const time = state.clock.getElapsedTime()

      for (let i = 0; i < positions.length / 3; i++) {
        const regionIndex = surfaceParticles.regions[i]
        const regionKeys = Object.keys(BRODMANN_AREAS)
        const regionKey = regionKeys[regionIndex] || regionKeys[0]
        const region = BRODMANN_AREAS[regionKey as keyof typeof BRODMANN_AREAS]

        const isActive = region.aiRegions.some((aiRegion) => activeRegions.includes(aiRegion))

        if (isActive) {
          const activityWave = Math.sin(time * 3 + i * 0.05) * 0.5 + 0.5
          sizes[i] = (1.2 + activityWave * intensity * 2) * 0.8

          const baseColor = new THREE.Color(region.color)
          const enhancedColor = baseColor.clone().multiplyScalar(1 + activityWave * intensity * 0.8)

          colors[i * 3] = Math.min(1, enhancedColor.r)
          colors[i * 3 + 1] = Math.min(1, enhancedColor.g)
          colors[i * 3 + 2] = Math.min(1, enhancedColor.b)

          // Flow along surface
          const vx = surfaceParticles.velocities[i * 3] * intensity * 0.5
          const vy = surfaceParticles.velocities[i * 3 + 1] * intensity * 0.5
          const vz = surfaceParticles.velocities[i * 3 + 2] * intensity * 0.5

          positions[i * 3] += vx * delta
          positions[i * 3 + 1] += vy * delta
          positions[i * 3 + 2] += vz * delta

          // Maintain surface constraint
          const x = positions[i * 3]
          const y = positions[i * 3 + 1]
          const z = positions[i * 3 + 2]
          const currentRadius = Math.sqrt(x * x + y * y + z * z)
          const targetRadius = 1.28 + Math.sin(y * 2.5) * 0.04
          const scale = targetRadius / currentRadius

          positions[i * 3] *= scale
          positions[i * 3 + 1] *= scale
          positions[i * 3 + 2] *= scale
        } else {
          sizes[i] = 0.6
          const baseColor = new THREE.Color(region.color)
          colors[i * 3] = baseColor.r * 0.4
          colors[i * 3 + 1] = baseColor.g * 0.4
          colors[i * 3 + 2] = baseColor.b * 0.4
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.geometry.attributes.color.needsUpdate = true
      particlesRef.current.geometry.attributes.size.needsUpdate = true
    }
  })

  // Render smooth brain regions
  const renderBrainRegions = () => {
    return Object.entries(BRODMANN_AREAS).map(([key, area]) => {
      const isActive = area.aiRegions.some((aiRegion) => activeRegions.includes(aiRegion))
      const isHovered = hoveredRegion === key

      return (
        <group key={key}>
          {area.coordinates.map((coord, index) => {
            const position = coord.pos as [number, number, number]

            return (
              <group
                key={`${key}-${index}`}
                position={position}
                onPointerOver={() => setHoveredRegion(key)}
                onPointerOut={() => setHoveredRegion(null)}
              >
                {/* Smooth activation indicator */}
                <mesh>
                  <sphereGeometry args={[0.025, 16, 12]} />
                  <meshStandardMaterial
                    color={area.color}
                    transparent={true}
                    opacity={isActive ? 0.9 : 0.3}
                    emissive={area.color}
                    emissiveIntensity={isActive ? intensity * coord.intensity : 0.05}
                    roughness={0.6}
                    metalness={0.2}
                  />
                </mesh>

                {/* Soft glow */}
                {isActive && (
                  <pointLight color={area.color} intensity={intensity * coord.intensity * 2} distance={0.4} decay={2} />
                )}

                {/* Clean labels */}
                {(showLabels || isHovered) && (
                  <Text
                    position={[0, 0.08, 0]}
                    fontSize={0.05}
                    color={isActive ? "#ffffff" : "#cccccc"}
                    anchorX="center"
                    anchorY="bottom"
                    outlineWidth={0.003}
                    outlineColor="#000000"
                  >
                    {area.name}
                  </Text>
                )}
              </group>
            )
          })}
        </group>
      )
    })
  }

  return (
    <group>
      <group ref={brainRef}>
        {/* Unified brain geometry */}
        <primitive object={brainGeometry} />

        {/* Smooth brain regions */}
        {renderBrainRegions()}

        {/* Surface particles */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={surfaceParticles.positions.length / 3}
              array={surfaceParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={surfaceParticles.colors.length / 3}
              array={surfaceParticles.colors}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={surfaceParticles.sizes.length}
              array={surfaceParticles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.015}
            vertexColors
            transparent
            opacity={0.85}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Soft ambient enhancement */}
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 2, 2]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-2, -1, 1]} intensity={0.4} color="#f0f0f0" />
      </group>
    </group>
  )
}
