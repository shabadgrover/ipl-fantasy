import React from 'react';
import { motion } from 'framer-motion';

const Home = ({ onNavigate, snapshotData }) => {
  return (
    <div className="w-full flex flex-col relative bg-[#f5f5f7] dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-500 overflow-hidden">
      
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 dark:bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section (Original Centered Layout) */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center px-4"
        >
          <span className="text-slate-500 dark:text-slate-500 tracking-[0.3em] text-sm uppercase font-bold text-shiny">
            Season 2026
          </span>

          {/* BIG TITLE */}
          <h1 className="text-[clamp(3.5rem,10vw,12rem)] font-black tracking-tight leading-[0.9] mt-6 text-slate-900 dark:text-white text-shiny">
            IPL FANTASY
          </h1>
          <h1 className="text-[clamp(3.5rem,10vw,12rem)] font-black tracking-tight leading-[0.9] text-slate-900 dark:text-white text-shiny">
            LEAGUE
          </h1>

          {/* TAGLINE */}
          <p className="text-xl md:text-3xl text-slate-600 dark:text-slate-400 mt-10 font-medium">
            Compete. Track. Dominate.
          </p>

          {/* BUTTON */}
          <div className="mt-14">
            <button
              onClick={() => onNavigate('leaderboard')}
              className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-full text-lg font-black hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.6)] border border-transparent hover:border-[#00d4ff]/50"
            >
              Explore the Data
            </button>
          </div>
        </motion.div>
      </div>


    </div>
  );
};

export default Home;