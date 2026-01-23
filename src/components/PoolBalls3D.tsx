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
  const animationFrameRef = useRef<number | null>(null);
  const scriptLoadedRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  // Initialize Sketchfab Viewer
  const initializeViewer = () => {
    if (!iframeRef.current || !window.Sketchfab || apiRef.current) return;

    const iframe = iframeRef.current;
    const client = new window.Sketchfab(iframe);
    const modelUID = '2c148dd8c1cb839f1fb014213069d443e7551382';

    client.init(modelUID, {
      success: (api: any) => {
        apiRef.current = api;
        startTimeRef.current = Date.now();
        
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

  // Initialize when script is loaded
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

  // Continuous idle rotation animation (Y-axis only, 25 seconds per rotation)
  useEffect(() => {
    const animate = () => {
      if (!apiRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Calculate rotation based on elapsed time
      // One full rotation (360 degrees = 2π radians) every 25 seconds
      const elapsed = (Date.now() - startTimeRef.current) / 1000; // seconds
      const rotationSpeed = (2 * Math.PI) / 25; // radians per second
      const yRotation = elapsed * rotationSpeed;

      // Convert Y-axis rotation to camera position using spherical coordinates
      const radius = 8;
      const cameraX = Math.sin(yRotation) * radius;
      const cameraY = 0; // Keep camera at same height
      const cameraZ = Math.cos(yRotation) * radius;

      // Apply rotation to Sketchfab camera (only Y-axis rotation)
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
    <div className="hero-3d">
      <div className="sketchfab-container">
        <iframe
          ref={iframeRef}
          title="Skull Biting 8 Ball"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          className="sketchfab-iframe"
        />
      </div>
    </div>
  );
};

export default PoolBalls3D;
