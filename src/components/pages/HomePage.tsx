// HPI 1.7-V
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

// --- Types & Interfaces ---
interface Position {
  top: string | number;
  left: string | number;
  position: 'static' | 'fixed';
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
}

// --- Assets (Canonical Data Sources) ---
const ASSETS = {
  background: "https://static.wixstatic.com/media/469523_051bb0afd8ce46a9b958da6c217bdf16~mv2.jpg",
  yesImage: "https://static.wixstatic.com/media/469523_c40c529f55854e9fa024d9dbc3bbbb70~mv2.jpg",
};

// --- Components ---

const FloatingHeartsBackground = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    // Generate random hearts for background atmosphere
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // vw
      y: Math.random() * 100, // vh
      scale: 0.5 + Math.random() * 1,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', x: `${heart.x}vw`, opacity: 0, scale: heart.scale }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.8, 0],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          className="absolute text-pink-300/40"
        >
          <Heart fill="currentColor" className="w-8 h-8 md:w-12 md:h-12" />
        </motion.div>
      ))}
    </div>
  );
};

export default function HomePage() {
  const [yesPressed, setYesPressed] = useState(false);
  const [noBtnState, setNoBtnState] = useState<Position>({ top: 'auto', left: 'auto', position: 'static' });
  const [isHoveringNo, setIsHoveringNo] = useState(false);
  
  // Refs for crash prevention and measurements
  const containerRef = useRef<HTMLDivElement>(null);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  // Handle the "Run Away" logic
  const moveNoButton = () => {
    if (!containerRef.current) return;

    // Calculate safe area within viewport (padding of 50px)
    const padding = 50;
    const maxX = window.innerWidth - 150; // Approx button width
    const maxY = window.innerHeight - 60; // Approx button height

    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);

    setNoBtnState({
      position: 'fixed',
      left: randomX,
      top: randomY,
    });
    setIsHoveringNo(true);
  };

  const handleReset = () => {
    setYesPressed(false);
    setNoBtnState({ top: 'auto', left: 'auto', position: 'static' });
    setIsHoveringNo(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-clip font-sans selection:bg-pink-200 selection:text-pink-900">
      {/* 1. Background Layer */}
      <div className="fixed inset-0 z-[-1]">
        <Image
          src={ASSETS.background}
          alt="Decorative envelope pattern background"
          className="w-full h-full object-cover opacity-40"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-pink-50/50 to-rose-100/60 backdrop-blur-[2px]" />
      </div>
      {/* 2. Atmospheric Motion Layer */}
      <FloatingHeartsBackground />
      {/* 3. Main Content Layer */}
      <main 
        ref={containerRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 md:px-8"
      >
        <AnimatePresence mode="wait">
          {!yesPressed ? (
            <motion.div
              key="question-card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
              className="w-full max-w-3xl mx-auto text-center"
            >
              {/* Decorative Header Element */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 mb-8 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-pink-100 text-pink-600 font-medium text-sm md:text-base"
              >
                <Sparkles className="w-4 h-4" />
                <span>A very important question</span>
                <Sparkles className="w-4 h-4" />
              </motion.div>

              {/* Main Question */}
              <div className="relative mb-12 md:mb-16">
                <motion.h1 
                  className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight drop-shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Will you be my <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 inline-block mt-2 pb-2">
                    Valentine?
                  </span>
                </motion.h1>
                
                {/* Cute decorative underline */}
                <motion.div 
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-2 bg-pink-300 rounded-full opacity-50"
                  initial={{ width: 0 }}
                  animate={{ width: 120 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
              </div>

              {/* Interaction Area */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 min-h-[120px]">
                
                {/* YES Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={() => setYesPressed(true)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xl md:text-2xl px-12 py-8 h-auto rounded-2xl shadow-lg shadow-green-200 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all duration-100 w-full md:w-auto min-w-[200px]"
                  >
                    Yes <Heart className="ml-3 w-6 h-6 fill-current animate-pulse" />
                  </Button>
                </motion.div>

                {/* NO Button - The Runner */}
                <motion.button
                  ref={noBtnRef}
                  onMouseEnter={moveNoButton}
                  onTouchStart={(e) => {
                    e.preventDefault(); // Prevent click on mobile
                    moveNoButton();
                  }}
                  onClick={moveNoButton} // Fallback
                  style={{
                    position: noBtnState.position,
                    top: noBtnState.top,
                    left: noBtnState.left,
                    transition: 'all 0.3s ease-out', // Smooth movement
                    zIndex: 50,
                  }}
                  className={`
                    bg-gray-200 hover:bg-gray-300 text-gray-600 text-xl md:text-2xl px-12 py-8 h-auto rounded-2xl shadow-sm border-b-4 border-gray-400 font-medium min-w-[200px]
                    ${isHoveringNo ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  No
                </motion.button>

                {/* Ghost element to preserve layout when No button goes fixed */}
                {noBtnState.position === 'fixed' && (
                  <div className="w-[200px] h-[88px] opacity-0 pointer-events-none" aria-hidden="true" />
                )}
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="success-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="w-full max-w-4xl mx-auto flex flex-col items-center text-center"
            >
              {/* Success Image Container */}
              <motion.div 
                className="relative w-full max-w-md aspect-square mb-8 md:mb-12"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ 
                  type: "spring",
                  bounce: 0.6,
                  delay: 0.2 
                }}
              >
                <div className="absolute inset-0 bg-pink-200 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border-8 border-white transform transition-transform hover:scale-105 duration-500">
                  <Image
                    src={ASSETS.yesImage}
                    alt="Cute character holding flowers saying yes"
                    className="w-full h-full object-cover"
                    width={800}
                    height={800}
                  />
                </div>
                
                {/* Floating decorative elements around image */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-white p-4 rounded-full shadow-lg text-4xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  💖
                </motion.div>
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-white p-3 rounded-full shadow-lg text-3xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                >
                  🥰
                </motion.div>
              </motion.div>

              {/* Success Text */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-heading text-6xl md:text-8xl font-bold text-pink-600 mb-6 drop-shadow-sm"
              >
                I knew it!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-paragraph text-xl md:text-2xl mb-12 max-w-lg text-[#c679acff]"
              >Best decision you've made all day.</motion.p>

              {/* Reset Action */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button 
                  variant="ghost" 
                  onClick={handleReset}
                  className="text-pink-400 hover:text-pink-600 hover:bg-pink-50 gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Play again
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {/* 4. Footer (Minimal & Themed) */}
      <footer className="fixed bottom-0 w-full py-4 text-center z-20 pointer-events-none">
        <p className="font-paragraph text-sm text-pink-400/80 font-medium">
          Made with ❤️ for you
        </p>
      </footer>
      {/* 5. Custom Styles for specific animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}