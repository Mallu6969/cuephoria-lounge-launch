import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

interface EightBallModelProps {
  onLoaded?: () => void;
}

const EightBallModel = ({ onLoaded }: EightBallModelProps) => {
  const { scene } = useGLTF('/flying-8-ball/source/Flying_8_Bal_NEW.glb');
  const groupRef = useRef<THREE.Group>(null);
  const sceneRef = useRef<THREE.Group | null>(null);
  const isMobile = useIsMobile();
  const scaleFactor = isMobile ? 40.0 : 60.0;
  const [modelReady, setModelReady] = useState(false);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const idleRotation = useRef({ x: 0, y: 0 });

  // Process and setup the model
  useEffect(() => {
    if (!scene || !groupRef.current) return;

    // Clone the scene to avoid mutating the original
    const clonedScene = scene.clone();
    
    const unwantedNames = ['table', 'floor', 'base', 'plane'];
    let visibleCount = 0;

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();
        const shouldHide = unwantedNames.some(unwanted => name.includes(unwanted));
        
        if (shouldHide) {
          child.visible = false;
        } else {
          visibleCount++;
          // Enhance materials for realism
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.roughness = 0.3;
            child.material.metalness = 0.1;
            child.material.envMapIntensity = 1.2;
          } else if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.roughness = 0.3;
                mat.metalness = 0.1;
                mat.envMapIntensity = 1.2;
              }
            });
          }
        }
      }
    });

    // If all meshes were hidden, make them visible again (safety check)
    if (visibleCount === 0) {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.visible = true;
        }
      });
    }

    // Center the model
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Center the model at origin
    clonedScene.position.sub(center);
    
    // Scale the model - adjust scale based on size to ensure visibility
    const maxSize = Math.max(size.x, size.y, size.z);
    const adjustedScale = maxSize > 0 ? scaleFactor / maxSize : scaleFactor;
    clonedScene.scale.set(adjustedScale, adjustedScale, adjustedScale);

    // Store reference and add to group
    sceneRef.current = clonedScene;
    groupRef.current.add(clonedScene);

    setModelReady(true);
    
    // Call onLoaded after a short delay to ensure render
    if (onLoaded) {
      setTimeout(() => {
        onLoaded();
      }, 200);
    }
  }, [scene, scaleFactor, onLoaded]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth rotation with lerp
  useFrame((state, delta) => {
    if (!groupRef.current || !modelReady) return;

    // Calculate target rotation from mouse position (capped for realistic inertia)
    targetRotation.current.y = mousePosition.x * 0.3;
    targetRotation.current.x = mousePosition.y * 0.3;

    // Idle breathing motion when cursor is idle
    const mouseIdle = Math.abs(mousePosition.x) < 0.1 && Math.abs(mousePosition.y) < 0.1;
    if (mouseIdle) {
      idleRotation.current.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      idleRotation.current.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    } else {
      idleRotation.current.x = 0;
      idleRotation.current.y = 0;
    }

    // Lerp to target rotation (smooth interpolation)
    const lerpFactor = 0.05;
    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      targetRotation.current.x + idleRotation.current.x,
      lerpFactor
    );
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      targetRotation.current.y + idleRotation.current.y,
      lerpFactor
    );

    groupRef.current.rotation.x = currentRotation.current.x;
    groupRef.current.rotation.y = currentRotation.current.y;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Scene will be added via useEffect */}
    </group>
  );
};

// Lighting setup
const Lighting = () => {
  return (
    <>
      {/* Hemisphere Light - warm sky, deep blue ground */}
      <hemisphereLight
        args={['#ffffff', '#1E3A5F', 0.8]}
        position={[0, 10, 0]}
      />
      
      {/* Strong Directional Light - pool table lamp */}
      <directionalLight
        position={[0, 8, 5]}
        intensity={1.5}
        castShadow={false}
      />
      
      {/* Additional fill light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.5}
      />
      
      {/* Rim light for separation */}
      <pointLight
        position={[-5, 0, -5]}
        intensity={0.4}
        color="#3FD0C9"
      />
      
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />
    </>
  );
};

interface PoolBalls3DProps {
  onLoaded?: () => void;
}

const PoolBalls3D = ({ onLoaded }: PoolBalls3DProps) => {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Lighting />
        <Environment preset="city" />
        <EightBallModel onLoaded={onLoaded} />
      </Canvas>
    </div>
  );
};

// Preload the model
useGLTF.preload('/flying-8-ball/source/Flying_8_Bal_NEW.glb');

export default PoolBalls3D;
