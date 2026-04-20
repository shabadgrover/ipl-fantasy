import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const MSTBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mt-24 mb-10 w-full max-w-5xl mx-auto p-[1px] rounded-[2rem] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-purple-500/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden group"
    >
      {/* Animated Border/Glow effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" />
      
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
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Content Side */}
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div 
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2.5 mb-5"
          >
            <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.9)] animate-pulse" />
            <span className="text-[11px] font-black tracking-[0.3em] uppercase text-purple-400/90">
              Tournament Milestone
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95]">
            MST <span className="text-slate-700 mx-1">—</span> <br className="hidden md:block" />
            MID SEASON <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-500">TRANSFER</span>
          </h2>
          
          <div className="mt-8 flex items-center gap-3 md:hidden">
             <div className="h-px w-8 bg-slate-800" />
             <Zap size={16} className="text-blue-500" fill="currentColor" />
             <div className="h-px w-8 bg-slate-800" />
          </div>
        </div>

        {/* Status Side */}
        <div className="relative z-10 flex flex-col items-center md:items-end w-full md:w-auto">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative px-8 py-5 rounded-[1.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl group/status overflow-hidden"
          >
            {/* Subtle inner shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent translate-y-full group-hover/status:translate-y-0 transition-transform duration-700" />
            
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] animate-shine-sweep">
              COMING SOON
            </span>
          </motion.div>
          
          <p className="mt-5 text-base font-medium text-slate-500 tracking-tight flex items-center gap-2">
            <Zap size={16} className="text-blue-400 mb-0.5" fill="currentColor" />
            Revamp your strategy for the playoffs.
          </p>

          <div className="hidden md:flex mt-10 gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-1 w-12 rounded-full bg-slate-800 overflow-hidden">
                {i === 1 && <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-full w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default MSTBanner;
