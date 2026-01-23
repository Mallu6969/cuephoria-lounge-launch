import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

const TOTAL_FRAMES = 40;
const SCROLL_HEIGHT = 400; // 400vh

const HeadphoneScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const animationFrameRef = useRef<number>();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0-1) to frame index (0-39)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  // Text overlay opacity based on scroll position
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 0.5, 0]);
  const precisionOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.5, 0.65], [0, 1, 1, 0]);
  const titaniumOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.8, 0.9], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];
      
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const frameNum = String(i).padStart(3, '0');
        const img = new Image();
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          img.onload = () => {
            setLoadingProgress((i / TOTAL_FRAMES) * 100);
            resolve(img);
          };
          img.onerror = reject;
          // Images should be in public/images/ folder for Vite to serve them
          img.src = `/images/ezgif-frame-${frameNum}.jpg`;
        });
        imagePromises.push(promise);
        imagesRef.current[i - 1] = img;
      }

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  // Draw frame to canvas
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const updateCanvasSize = () => {
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    const drawFrame = (frame: number) => {
      const clampedFrame = Math.max(0, Math.min(frame, TOTAL_FRAMES - 1));
      const img = imagesRef.current[clampedFrame];

      if (img && img.complete && canvas) {
        // Update canvas size if needed
        updateCanvasSize();

        // Calculate scaling to maintain aspect ratio and center
        const imgAspect = img.width / img.height;
        const canvasAspect = canvas.width / canvas.height;

        let drawWidth = canvas.width / (window.devicePixelRatio || 1);
        let drawHeight = canvas.height / (window.devicePixelRatio || 1);
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > canvasAspect) {
          // Image is wider - fit to height
          drawHeight = canvas.height / (window.devicePixelRatio || 1);
          drawWidth = drawHeight * imgAspect;
          offsetX = (canvas.width / (window.devicePixelRatio || 1) - drawWidth) / 2;
        } else {
          // Image is taller - fit to width
          drawWidth = canvas.width / (window.devicePixelRatio || 1);
          drawHeight = drawWidth / imgAspect;
          offsetY = (canvas.height / (window.devicePixelRatio || 1) - drawHeight) / 2;
        }

        // Clear and draw
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    // Initial canvas size
    updateCanvasSize();

    // Handle resize
    const handleResize = () => {
      updateCanvasSize();
      frameIndex.get(); // Trigger redraw
    };

    window.addEventListener('resize', handleResize);

    // Subscribe to frame changes
    const unsubscribe = frameIndex.on('change', (latest) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        const frame = Math.round(latest);
        drawFrame(frame);
      });
    });

    // Initial draw
    drawFrame(Math.round(frameIndex.get()));

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imagesLoaded, frameIndex]);

  return (
    <div className="relative w-full">
      {/* Loading Spinner */}
      {!imagesLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-white/90"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-white/60" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-white/60 text-sm tracking-tight">
              Loading {Math.round(loadingProgress)}%
            </p>
          </div>
        </div>
      )}

      {/* Scroll Container */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${SCROLL_HEIGHT}vh` }}
      >
        {/* Sticky Canvas */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ imageRendering: 'high-quality', objectFit: 'contain' }}
          />
        </div>

        {/* Text Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Title - 0% Scroll */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white/90 tracking-tight text-center px-4">
              Zenith X.<br />
              <span className="text-white/60">Pure Sound.</span>
            </h1>
          </motion.div>

          {/* Precision Engineering - 30% Scroll */}
          <motion.div
            style={{ opacity: precisionOpacity }}
            className="absolute inset-0 flex items-center"
          >
            <div className="w-full px-8 md:px-16">
              <h2 className="text-4xl md:text-6xl font-bold text-white/90 tracking-tight">
                Precision<br />Engineering.
              </h2>
            </div>
          </motion.div>

          {/* Titanium Drivers - 60% Scroll */}
          <motion.div
            style={{ opacity: titaniumOpacity }}
            className="absolute inset-0 flex items-center justify-end"
          >
            <div className="w-full px-8 md:px-16 text-right">
              <h2 className="text-4xl md:text-6xl font-bold text-white/90 tracking-tight">
                Titanium<br />Drivers.
              </h2>
            </div>
          </motion.div>

          {/* CTA - 90% Scroll */}
          <motion.div
            style={{ opacity: ctaOpacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center px-4">
              <h2 className="text-5xl md:text-7xl font-bold text-white/90 tracking-tight mb-6">
                Hear Everything.
              </h2>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white/90 font-medium tracking-tight transition-all duration-300">
                Experience Zenith X
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeadphoneScroll;

