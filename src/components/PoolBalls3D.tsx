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
  const isMobile = useIsMobile();
  const scaleFactor = isMobile ? 40.0 : 60.0;
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const idleRotation = useRef({ x: 0, y: 0 });

  // Hide unwanted meshes
  useEffect(() => {
    const unwantedNames = ['table', 'floor', 'base', 'plane'];
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();
        if (unwantedNames.some(unwanted => name.includes(unwanted))) {
          child.visible = false;
        } else {
          // Enhance materials for realism
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.roughness = 0.3;
            child.material.metalness = 0.1;
            child.material.envMapIntensity = 1.2;
          }
        }
      }
    });

    // Center the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    
    // Scale the model
    scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

    if (onLoaded) {
      onLoaded();
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
    if (!groupRef.current) return;

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
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
};

// Lighting setup
const Lighting = () => {
  return (
    <>
      {/* Hemisphere Light - warm sky, deep blue ground */}
      <hemisphereLight
        args={['#ffffff', '#1E3A5F', 0.6]}
        position={[0, 10, 0]}
      />
      
      {/* Strong Directional Light - pool table lamp */}
      <directionalLight
        position={[0, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Rim light for separation */}
      <pointLight
        position={[-5, 0, -5]}
        intensity={0.3}
        color="#3FD0C9"
      />
    </>
  );
};

interface PoolBalls3DProps {
  onLoaded?: () => void;
}

const PoolBalls3D = ({ onLoaded }: PoolBalls3DProps) => {
  return (
    <div className="fixed inset-0 w-screen h-screen -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
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
