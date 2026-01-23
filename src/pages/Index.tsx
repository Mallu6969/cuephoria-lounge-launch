import { useState } from 'react';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ShotSelector from '@/components/ShotSelector';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [firstRender, setFirstRender] = useState(false);

  const handleModelLoaded = () => {
    setModelLoaded(true);
    // Wait a bit for first render, then hide loader
    if (!firstRender) {
      setFirstRender(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] overflow-x-hidden">
      <Loader isLoading={isLoading} />
      
      <Navbar />
      
      {/* Hero Section */}
      <Hero onModelLoaded={handleModelLoaded} />
      
      {/* Shot Selector Section */}
      <section className="relative z-10 -mt-20">
        <ShotSelector />
      </section>
    </div>
  );
};

export default Index;
