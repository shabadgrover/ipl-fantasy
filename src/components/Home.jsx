import React from 'react';
import { Trophy, Zap, Users, Play, Calendar, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = ({ onNavigate }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#f5f5f7] dark:bg-black overflow-hidden pt-16 transition-colors duration-300">
      {/* Subtle Cinematic Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-black/5 dark:bg-white/[0.03] rounded-[100%] blur-[100px] pointer-events-none transition-colors duration-300" />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10 w-full px-4"
      >
        <span className="inline-block text-slate-600 dark:text-slate-500 font-medium tracking-[0.2em] text-sm md:text-base uppercase mb-8 opacity-60">
          Season 2026
        </span>
        
        <h1 className="text-[clamp(4rem,10vw,12rem)] font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
          IPL FANTASY
        </h1>
        <h1 className="text-[clamp(4rem,10vw,12rem)] font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
          LEAGUE
        </h1>
        
        <p className="text-xl md:text-3xl font-medium text-slate-600 dark:text-slate-400 mt-12 max-w-2xl mx-auto tracking-tight leading-relaxed">
          Compete. Track. Dominate.
        </p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          <button 
            onClick={() => onNavigate('leaderboard')}
            className="btn-minimal text-lg px-12 py-5"
          >
            Explore the Data
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
