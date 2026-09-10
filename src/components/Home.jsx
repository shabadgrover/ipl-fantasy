import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import kohliImg from '../assets/kohli.png';
import gillImg from '../assets/gill.png';

/* ─────────────────────────────────────────────
   Floating ambient glow blob
───────────────────────────────────────────── */
const GlowBlob = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-[120px] pointer-events-none ${className}`}
    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

/* ─────────────────────────────────────────────
   Animated VS badge
───────────────────────────────────────────── */
const VSBadge = () => (
  <motion.div
    initial={{ scale: 0, rotate: -20 }}
    whileInView={{ scale: 1, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.6 }}
    className="relative z-20 flex flex-col items-center justify-center select-none"
  >
    {/* Pulsing ring */}
    <motion.div
      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
      className="absolute w-28 h-28 rounded-full border border-amber-400/40"
    />
    <motion.div
      animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
      className="absolute w-20 h-20 rounded-full border border-amber-300/30"
    />

    {/* Core badge */}
    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#0e0e0e] border-2 border-amber-400/70 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.35)]">
      <span
        className="font-black text-xl md:text-2xl tracking-widest"
        style={{
          background: 'linear-gradient(135deg,#fbbf24 0%,#f59e0b 50%,#fbbf24 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        VS
      </span>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Player card
───────────────────────────────────────────── */
const PlayerCard = ({ side, player }) => {
  const isLeft = side === 'left';

  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -120 : 120, rotateY: isLeft ? 25 : -25 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.35, ease: 'easeOut' } }}
      className="relative flex-1 max-w-xs md:max-w-sm"
      style={{ perspective: 1000 }}
    >
      {/* Glassy card shell */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px -20px rgba(0,0,0,0.8), 0 0 60px -10px ${player.glowColor}`,
        }}
      >
        {/* Diagonal light streak */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLeft
              ? 'linear-gradient(120deg, rgba(255,255,255,0.06) 0%, transparent 50%)'
              : 'linear-gradient(240deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: player.accentGradient }}
        />

        <div className="flex flex-col items-center gap-4">
          {/* Crown / laurel label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-2"
          >
            <span className="text-xs tracking-[0.35em] uppercase font-bold" style={{ color: player.accentColor }}>
              {player.title}
            </span>
          </motion.div>

          {/* Player photo */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full"
            style={{ aspectRatio: '3/4', maxHeight: '340px' }}
          >
            {/* Glow halo behind image */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                boxShadow: `0 0 80px 20px ${player.glowColor}`,
                background: `radial-gradient(ellipse at 50% 100%, ${player.accentColor}30, transparent 70%)`,
              }}
            />
            {/* Photo */}
            <img
              src={player.image}
              alt={`${player.firstName} ${player.lastName}`}
              className="relative w-full h-full object-cover object-top rounded-xl"
              style={{
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                filter: `drop-shadow(0 0 32px ${player.accentColor}66)`,
              }}
            />
            {/* Bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none rounded-b-xl"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(5,5,5,0.95))',
              }}
            />
            {/* Jersey number badge */}
            <div
              className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
              style={{
                background: `linear-gradient(135deg, ${player.accentColor}cc, ${player.accentColor}66)`,
                border: `1px solid ${player.accentColor}88`,
                boxShadow: `0 0 16px ${player.glowColor}`,
                color: '#fff',
              }}
            >
              {player.jersey}
            </div>
          </motion.div>

          {/* Name */}
          <div className="text-center mt-1 px-6">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65 }}
              className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-1"
            >
              {player.firstName}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="font-black uppercase tracking-tight leading-none"
              style={{
                fontSize: 'clamp(2.4rem,5vw,3.2rem)',
                background: player.nameGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {player.lastName}
            </motion.h2>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px my-1"
            style={{ background: `linear-gradient(to right, transparent, ${player.accentColor}60, transparent)` }}
          />

          {/* Nickname */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85 }}
            className="text-white/50 text-sm font-medium tracking-widest uppercase italic"
          >
            {player.nickname}
          </motion.p>

          {/* Team badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.95 }}
            className="px-5 py-2 mb-6 rounded-full text-[11px] font-black tracking-[0.25em] uppercase"
            style={{
              background: `linear-gradient(135deg, ${player.accentColor}18, ${player.accentColor}08)`,
              border: `1px solid ${player.accentColor}30`,
              color: player.accentColor,
            }}
          >
            {player.team}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   King vs Prince Section
───────────────────────────────────────────── */
const KingVsPrinceSection = () => {
  const kohli = {
    title: '👑 The King',
    firstName: 'Virat',
    lastName: 'Kohli',
    nickname: '"Chase Master"',
    team: 'Royal Challengers Bengaluru',
    jersey: '18',
    image: kohliImg,
    accentColor: '#ef4444',
    accentGradient: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
    numGradient: 'linear-gradient(135deg, #ef4444, #dc2626, #ef4444)',
    nameGradient: 'linear-gradient(135deg, #ffffff 0%, #fca5a5 60%, #ef4444 100%)',
    glowColor: 'rgba(239,68,68,0.25)',
  };

  const gill = {
    title: '⚡ The Prince',
    firstName: 'Shubman',
    lastName: 'Gill',
    nickname: '"The Crown Prince"',
    team: 'Gujarat Titans',
    jersey: '77',
    image: gillImg,
    accentColor: '#3b82f6',
    accentGradient: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
    numGradient: 'linear-gradient(135deg, #3b82f6, #2563eb, #3b82f6)',
    nameGradient: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 60%, #3b82f6 100%)',
    glowColor: 'rgba(59,130,246,0.25)',
  };

  return (
    <section className="relative w-full bg-[#050505] overflow-hidden py-24 md:py-36">

      {/* Ambient floating glows */}
      <GlowBlob className="w-[500px] h-[500px] bg-red-600/20 -left-32 top-1/4" delay={0} />
      <GlowBlob className="w-[500px] h-[500px] bg-blue-600/20 -right-32 top-1/4" delay={1.5} />
      <GlowBlob className="w-[300px] h-[300px] bg-amber-500/10 left-1/2 -translate-x-1/2 top-10" delay={3} />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Thin horizontal center rule */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/[0.04] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-xs tracking-[0.5em] uppercase font-bold text-amber-400/70 mb-4">
            IPL 2026 Final
          </p>
          <h2
            className="font-black uppercase leading-none"
            style={{
              fontSize: 'clamp(2.8rem,7vw,6.5rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 40%, #737373 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            The King
          </h2>
          <h2
            className="font-black uppercase leading-none"
            style={{
              fontSize: 'clamp(2.8rem,7vw,6.5rem)',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            vs The Prince
          </h2>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="h-[2px] w-48 mx-auto mt-6 origin-center"
            style={{ background: 'linear-gradient(90deg, #ef4444, #fbbf24, #3b82f6)' }}
          />
        </motion.div>

        {/* Cards + VS layout */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 md:space-x-0">

          {/* Kohli */}
          <div className="w-full md:w-auto flex justify-center md:justify-end md:flex-1 md:pr-8">
            <PlayerCard side="left" player={kohli} />
          </div>

          {/* VS */}
          <VSBadge />

          {/* Gill */}
          <div className="w-full md:w-auto flex justify-center md:justify-start md:flex-1 md:pl-8">
            <PlayerCard side="right" player={gill} />
          </div>
        </div>

        {/* Bottom caption */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="text-center text-white/20 text-xs tracking-[0.4em] uppercase mt-16 font-medium"
        >
          One throne. Two legends. Who reigns in your fantasy?
        </motion.p>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   Main Home
───────────────────────────────────────────── */
const Home = ({ onNavigate, snapshotData }) => {
  return (
    <div className="w-full flex flex-col relative bg-[#f5f5f7] dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-500 overflow-hidden">

      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/5 dark:bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

      {/* ── Hero Section (unchanged) ── */}
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

          <h1 className="text-[clamp(3.5rem,10vw,12rem)] font-black tracking-tight leading-[0.9] mt-6 text-slate-900 dark:text-white text-shiny">
            IPL FANTASY
          </h1>
          <h1 className="text-[clamp(3.5rem,10vw,12rem)] font-black tracking-tight leading-[0.9] text-slate-900 dark:text-white text-shiny">
            LEAGUE
          </h1>

          <p className="text-xl md:text-3xl text-slate-600 dark:text-slate-400 mt-10 font-medium max-w-2xl mx-auto leading-relaxed">
            Season 1 has officially concluded. Congratulations to all managers on a fantastic tournament!
          </p>

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

      {/* ── Removed King vs Prince Section ── */}

    </div>
  );
};

export default Home;
