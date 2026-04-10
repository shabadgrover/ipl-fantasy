import React from 'react';
import { motion } from 'framer-motion';

const Home = ({ onNavigate }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-[#0a0a0a] text-white overflow-hidden">

      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-white/[0.03] rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10 px-4"
      >
        <span className="text-slate-500 tracking-[0.3em] text-sm uppercase">
          Season 2026
        </span>

        {/* BIG TITLE */}
        <h1 className="text-[clamp(3.5rem,10vw,12rem)] font-black tracking-tight leading-[0.9] mt-6">
          IPL FANTASY
        </h1>
        <h1 className="text-[clamp(3.5rem,10vw,12rem)] font-black tracking-tight leading-[0.9]">
          LEAGUE
        </h1>

        {/* TAGLINE */}
        <p className="text-xl md:text-3xl text-slate-400 mt-10">
          Compete. Track. Dominate.
        </p>

        {/* BUTTON */}
        <div className="mt-14">
          <button
            onClick={() => onNavigate('leaderboard')}
            className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition"
          >
            Explore the Data
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;