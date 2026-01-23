import { useEffect, useRef } from 'react';

interface PoolBalls3DProps {
  onLoaded?: () => void;
}

const PoolBalls3D = ({ onLoaded }: PoolBalls3DProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Notify when iframe loads
    const handleLoad = () => {
      if (!hasLoadedRef.current && onLoaded) {
        hasLoadedRef.current = true;
        // Give Sketchfab a moment to initialize
        setTimeout(() => {
          onLoaded();
        }, 1000);
      }
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
    }

    // Fallback: trigger after a reasonable delay if load event doesn't fire
    // (can happen with cross-origin iframes)
    const fallbackTimer = setTimeout(() => {
      if (!hasLoadedRef.current && onLoaded) {
        handleLoad();
      }
    }, 2000);

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
      clearTimeout(fallbackTimer);
    };
  }, [onLoaded]);

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
        src="https://sketchfab.com/models/2c91f8b8fa184ee881b6f31b27b0bc42/embed"
      />
    </div>
  );
};

export default PoolBalls3D;
