import { useEffect, useRef } from 'react';

interface PoolBalls3DProps {
  onLoaded?: () => void;
}

// Declare Sketchfab Viewer API types
declare global {
  interface Window {
    Sketchfab: any;
  }
}

const PoolBalls3D = ({ onLoaded }: PoolBalls3DProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const apiRef = useRef<any>(null);
  const hasLoadedRef = useRef(false);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const scriptLoadedRef = useRef(false);

  // Initialize Sketchfab Viewer
  const initializeViewer = () => {
    if (!iframeRef.current || !window.Sketchfab || apiRef.current) return;

    const iframe = iframeRef.current;
    const client = new window.Sketchfab(iframe);
    const modelUID = '2c91f8b8fa184ee881b6f31b27b0bc42';

    client.init(modelUID, {
      success: (api: any) => {
        apiRef.current = api;
        
        // Wait for viewer to be ready
        api.addEventListener('viewerready', () => {
          // Set initial camera position - further away to make model appear smaller
          api.setCameraLookAt([0, 0, 8], [0, 0, 0], () => {});
          
          if (!hasLoadedRef.current && onLoaded) {
            hasLoadedRef.current = true;
            setTimeout(() => {
              onLoaded();
            }, 500);
          }
        });
      },
      error: (error: any) => {
        console.error('Sketchfab viewer error:', error);
      },
      autostart: 1,
      preload: 1,
      ui_controls: 0,
      ui_infos: 0,
      ui_stop: 0,
      ui_watermark: 0,
      ui_help: 0,
    });
  };

  // Load Sketchfab Viewer API script
  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      initializeViewer();
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize when script is loaded (using a state to trigger re-initialization)
  useEffect(() => {
    const checkAndInit = () => {
      if (scriptLoadedRef.current && window.Sketchfab && iframeRef.current && !apiRef.current) {
        initializeViewer();
      }
    };
    
    // Check periodically until initialized
    const interval = setInterval(checkAndInit, 100);
    checkAndInit(); // Also check immediately
    
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // Calculate target rotation (capped for smooth movement)
      targetRotation.current.y = x * 0.5; // Horizontal rotation
      targetRotation.current.x = y * 0.3; // Vertical rotation
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth rotation animation
  useEffect(() => {
    const animate = () => {
      if (!apiRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Smooth interpolation (lerp)
      const lerpFactor = 0.05;
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor;

      // Convert normalized rotation to camera position
      // Using spherical coordinates for smooth rotation
      const radius = 8; // Increased distance to make model appear smaller
      const longitude = currentRotation.current.y * Math.PI; // Full rotation
      const latitude = currentRotation.current.x * (Math.PI / 3); // Limited vertical movement

      // Calculate camera position in 3D space
      const cameraX = Math.sin(latitude) * Math.cos(longitude) * radius;
      const cameraY = Math.cos(latitude) * radius;
      const cameraZ = Math.sin(latitude) * Math.sin(longitude) * radius;

      // Apply rotation to Sketchfab camera
      apiRef.current.setCameraLookAt(
        [cameraX, cameraY, cameraZ],
        [0, 0, 0], // Look at origin
        () => {}
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none">
      <iframe
        ref={iframeRef}
        title="Skull Biting 8 Ball"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'transparent',
        }}
      />
    </div>
  );
};

export default PoolBalls3D;
