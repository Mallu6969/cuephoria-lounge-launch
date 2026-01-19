import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

interface PoolBallProps {
  position: [number, number, number];
  color: string;
  number?: number;
  speed?: number;
}

const PoolBall = ({ position, color, speed = 1 }: PoolBallProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[0.5, 32, 32]} position={position}>
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          envMapIntensity={0.8}
        />
      </Sphere>
    </Float>
  );
};

const PoolBalls3D = () => {
  const balls = useMemo(() => [
    { position: [-3, 2, -2] as [number, number, number], color: '#00e5ff' }, // Cyan
    { position: [3, -1, -3] as [number, number, number], color: '#a855f7' }, // Purple
    { position: [-2, -2, -4] as [number, number, number], color: '#f43f5e' }, // Pink
    { position: [2, 1.5, -2.5] as [number, number, number], color: '#3b82f6' }, // Blue
    { position: [0, -1.5, -3] as [number, number, number], color: '#facc15' }, // Yellow
    { position: [-1, 2.5, -4] as [number, number, number], color: '#22c55e' }, // Green
    { position: [4, 0, -5] as [number, number, number], color: '#ff6b6b' }, // Red
    { position: [-4, 0.5, -3.5] as [number, number, number], color: '#ffffff' }, // White (cue ball)
  ], []);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00e5ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          color="#ffffff"
        />
        
        {balls.map((ball, index) => (
          <PoolBall
            key={index}
            position={ball.position}
            color={ball.color}
            speed={0.5 + index * 0.1}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default PoolBalls3D;
