import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Info } from 'lucide-react';
import MSTRulesModal from './MSTRulesModal';

const MSTBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const dynamicTexts = ["LIVE NOW"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mt-24 mb-10 w-full max-w-5xl mx-auto p-[1px] rounded-[2rem] bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-emerald-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden group"
      >
        {/* Animated Border/Glow effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-sm" />
        
        <div className="relative bg-[#0a0a0a] backdrop-blur-3xl rounded-[2rem] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
          
          {/* Background Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.15] mix-blend-screen pointer-events-none transition-transform duration-1000 group-hover:scale-110"
            style={{ 
              backgroundImage: `url('/mst-banner-bg.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          {/* Atmospheric Glows */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Content Side */}
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
            <motion.div 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2.5 mb-5"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse" />
              <span className="text-[11px] font-black tracking-[0.3em] uppercase text-emerald-400/90">
                LIVE NOW
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95]">
              MST <span className="text-slate-700 mx-1">—</span> <br className="hidden md:block" />
              MID SEASON <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-400 to-green-500">TRANSFER</span>
            </h2>
            
            <div className="mt-8 flex items-center gap-3 md:hidden">
               <div className="h-px w-8 bg-slate-800" />
               <Zap size={16} className="text-emerald-500" fill="currentColor" />
               <div className="h-px w-8 bg-slate-800" />
            </div>
          </div>

          {/* Status Side */}
          <div className="relative z-10 flex flex-col items-center md:items-end w-full md:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255, 255, 255, 0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="relative min-w-[320px] px-12 py-6 rounded-[2rem] bg-[#0a0a0a] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] group/btn overflow-hidden transition-all duration-300"
            >
              {/* Animated Premium Border */}
              <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine-sweep" />
              </div>

              <div className="relative h-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={textIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                    className="absolute text-2xl md:text-3xl font-black tracking-tighter uppercase whitespace-nowrap flex items-center justify-center gap-1.5"
                  >
                    {dynamicTexts[textIndex].split(" ").map((word, i, arr) => (
                      <span 
                        key={i} 
                        className={
                          i === arr.length - 1 
                            ? "text-shiny-white brightness-125" 
                            : "text-shiny opacity-90"
                        }
                      >
                        {word}
                      </span>
                    ))}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Decorative Corner Glow - Muted */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 blur-xl rounded-full opacity-30" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-slate-500/10 blur-xl rounded-full opacity-30" />
            </motion.button>
            
            <p className="mt-5 text-base font-medium text-slate-500 tracking-tight flex items-center gap-2">
              <Zap size={16} className="text-emerald-600 mb-0.5" fill="currentColor" />
              Revamp your strategy for the playoffs.
            </p>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all active:scale-95"
            >
              <Info size={14} />
              View Rules & Info
            </button>

            <div className="hidden md:flex mt-10 gap-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-1 w-12 rounded-full bg-slate-800 overflow-hidden">
                  {i === 1 && <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-full w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                  />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <MSTRulesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default MSTBanner;
