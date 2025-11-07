import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Individual geometric shape component with bloom effect
function GeometricShape({ 
  position, 
  geometry, 
  baseScale, 
  rotationSpeed, 
  mousePosition,
  pulsePhase,
  index 
}) {
  const meshRef = useRef();
  const initialPosition = useMemo(() => new THREE.Vector3(...position), [position]);
  const initialRotation = useMemo(() => [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  ], []);
  
  const baseScaleRef = useRef(baseScale);
  const targetScaleRef = useRef(baseScale);
  const bloomIntensityRef = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gentle floating animation with subtle movement
    const floatSpeed = 0.4;
    const floatAmount = 0.5;
    meshRef.current.position.x = initialPosition.x + Math.sin(time * floatSpeed + position[0] * 0.5) * floatAmount;
    meshRef.current.position.y = initialPosition.y + Math.cos(time * floatSpeed * 0.7 + position[1] * 0.5) * floatAmount;
    meshRef.current.position.z = initialPosition.z + Math.sin(time * floatSpeed * 0.5 + position[2] * 0.5) * floatAmount * 0.6;

    // Base continuous rotation
    meshRef.current.rotation.x = initialRotation[0] + time * rotationSpeed[0];
    meshRef.current.rotation.y = initialRotation[1] + time * rotationSpeed[1];
    meshRef.current.rotation.z = initialRotation[2] + time * rotationSpeed[2];

    // Gentle pulsing animation (synchronized with phase offset)
    const pulseSpeed = 1.5;
    const pulseAmount = 0.2;
    const pulse = 1 + Math.sin(time * pulseSpeed + pulsePhase) * pulseAmount;
    baseScaleRef.current = baseScale * pulse;

    // Mouse interaction - "bloom" effect
    if (mousePosition) {
      // Convert mouse position to 3D space
      const mouse3D = new THREE.Vector3(
        mousePosition.x * 15,
        mousePosition.y * 15,
        meshRef.current.position.z
      );
      
      const distance = meshRef.current.position.distanceTo(mouse3D);
      const maxDistance = 8;
      const minDistance = 1;
      
      // Calculate bloom influence (stronger when closer)
      const normalizedDistance = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)));
      const influence = 1 - normalizedDistance;
      bloomIntensityRef.current = influence;
      
      // Scale up when mouse is near (bloom effect)
      const bloomScale = 0.6; // Maximum scale increase
      targetScaleRef.current = baseScaleRef.current * (1 + influence * bloomScale);
      
      // Rotate to face cursor elegantly
      if (influence > 0.05) {
        const direction = new THREE.Vector3()
          .subVectors(mouse3D, meshRef.current.position)
          .normalize();
        
        // Create a quaternion to rotate towards the mouse
        const targetQuaternion = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        targetQuaternion.setFromUnitVectors(up, direction);
        
        // Smoothly interpolate rotation
        const rotationInfluence = influence * 0.15;
        meshRef.current.quaternion.slerp(targetQuaternion, rotationInfluence);
      }
    } else {
      bloomIntensityRef.current = 0;
      targetScaleRef.current = baseScaleRef.current;
    }

    // Smooth scale interpolation
    const currentScale = meshRef.current.scale.x;
    const targetScale = targetScaleRef.current;
    const scaleDiff = targetScale - currentScale;
    meshRef.current.scale.setScalar(currentScale + scaleDiff * 0.12);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <primitive object={geometry} />
      <meshBasicMaterial 
        color="#ffffff" 
        wireframe 
        transparent 
        opacity={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Synchronized loading animation component
function LoadingShapes({ isLoading }) {
  const groupRef = useRef();
  const shapesRef = useRef([]);

  useFrame((state) => {
    if (!groupRef.current || !isLoading) return;
    
    const time = state.clock.getElapsedTime();
    
    // Synchronized rotation
    groupRef.current.rotation.y = time * 0.6;
    groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    
    // Synchronized pulsing
    const pulse = 1 + Math.sin(time * 2) * 0.3;
    shapesRef.current.forEach((shape, i) => {
      if (shape) {
        const delay = i * 0.2;
        const individualPulse = 1 + Math.sin(time * 2 + delay) * 0.2;
        shape.scale.setScalar(individualPulse * pulse);
      }
    });
  });

  if (!isLoading) return null;

  const geometries = [
    new THREE.OctahedronGeometry(1.2),
    new THREE.IcosahedronGeometry(1.2),
    new THREE.TetrahedronGeometry(1.2),
    new THREE.DodecahedronGeometry(1.2),
  ];

  return (
    <group ref={groupRef}>
      {geometries.map((geo, i) => {
        const angle = (i * Math.PI * 2) / geometries.length;
        const radius = 2.5;
        return (
          <mesh 
            key={i} 
            ref={(el) => { if (el) shapesRef.current[i] = el; }}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.5,
              0
            ]}
            rotation={[angle, angle * 0.5, 0]}
          >
            <primitive object={geo} />
            <meshBasicMaterial 
              color="#ffffff" 
              wireframe 
              transparent 
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Main scene component
function Scene({ mousePosition, isLoading }) {
  const { viewport } = useThree();
  
  // Generate scattered geometric shapes
  const shapes = useMemo(() => {
    const geometries = [
      new THREE.OctahedronGeometry(1),
      new THREE.IcosahedronGeometry(1),
      new THREE.TetrahedronGeometry(1),
      new THREE.DodecahedronGeometry(1),
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.ConeGeometry(0.7, 1.4, 6),
      new THREE.TorusGeometry(0.5, 0.3, 8, 16),
    ];

    // Create more shapes for better coverage
    const shapeCount = 30;
    return Array.from({ length: shapeCount }, (_, i) => {
      const spreadX = viewport.width * 1.2;
      const spreadY = viewport.height * 1.2;
      const spreadZ = 12;
      
      return {
        position: [
          (Math.random() - 0.5) * spreadX,
          (Math.random() - 0.5) * spreadY,
          (Math.random() - 0.5) * spreadZ - 3,
        ],
        geometry: geometries[Math.floor(Math.random() * geometries.length)],
        baseScale: 0.4 + Math.random() * 0.6,
        rotationSpeed: [
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
        ],
        pulsePhase: (i / shapeCount) * Math.PI * 2, // Staggered pulse phases
      };
    });
  }, [viewport]);

  return (
    <>
      <ambientLight intensity={0.6} />
      {!isLoading && shapes.map((shape, i) => (
        <GeometricShape
          key={i}
          position={shape.position}
          geometry={shape.geometry}
          baseScale={shape.baseScale}
          rotationSpeed={shape.rotationSpeed}
          mousePosition={mousePosition}
          pulsePhase={shape.pulsePhase}
          index={i}
        />
      ))}
      <LoadingShapes isLoading={isLoading} />
    </>
  );
}

// Main component
export default function GeometricBloom({ isLoading = false, className = '' }) {
  const [mousePosition, setMousePosition] = useState(null);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    // Fade out interaction smoothly
    setTimeout(() => {
      setMousePosition(null);
    }, 800);
  };

  return (
    <div 
      className={`fixed inset-0 -z-10 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        background: 'transparent',
        pointerEvents: 'auto'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene mousePosition={mousePosition} isLoading={isLoading} />
      </Canvas>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white text-xl font-light tracking-widest opacity-60">
            LOADING
          </div>
        </div>
      )}
    </div>
  );
}