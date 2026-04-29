import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Leaderboard = ({ teams, hideInternalHeader }) => {
  const getRankClass = (rank) => {
    if (rank === 1) return 'text-metallic-gold';
    if (rank === 2) return 'text-metallic-silver';
    if (rank === 3) return 'text-metallic-bronze';
    return 'text-metallic-steel';
  };


  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      {!hideInternalHeader && (
        <div className="text-center mb-12">
          <h2 className="text-sm font-black tracking-widest text-slate-600 dark:text-slate-500 uppercase mb-3">Live Rankings</h2>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white">Leaderboard</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Tournament Progress Tracking</p>
        </div>
      )}

      <div className="relative bg-league-blue rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex">
        {/* Left Side Vertical Text */}
        <div className="hidden lg:flex w-24 items-center justify-center border-r border-white/5 bg-black/20 shrink-0">
          <span className="vertical-text-league text-4xl tracking-[0.2em] opacity-30">
            2026 · SEASON 1 
          </span>
        </div>

        <div className="flex-1 p-6 md:p-12 overflow-x-auto">
          {/* Header */}
          <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
            <div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-shiny pr-4">
                AFTERMATCH40 
              </h3>
            </div>
            <div className="flex gap-8 text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">
              <span className="w-20 text-right">Total Points</span>
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-1">
            {(teams || []).map((team, index) => {
              const rank = index + 1;
              const isUser = team.isUser;

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-center gap-4 py-2.5 px-3 rounded-lg group transition-all duration-300 ${
                    isUser ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Team Name and Trend */}
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <span className={`text-sm md:text-xl font-black font-outfit uppercase tracking-tight truncate ${getRankClass(rank)}`}>
                      {team.teamName}
                    </span>
                    
                    {/* Trend Indicator */}
                    <div className="flex items-center gap-1 opacity-80 scale-75 md:scale-100">
                      {team.trend === 'up' ? (
                        <TrendingUp size={12} className="text-emerald-400" strokeWidth={3} />
                      ) : team.trend === 'down' ? (
                        <TrendingDown size={12} className="text-rose-400" strokeWidth={3} />
                      ) : (
                        <Minus size={12} className="text-white/20" strokeWidth={3} />
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="shrink-0 text-right">
                    <div className={`text-base md:text-xl font-black tracking-tight ${getRankClass(rank)}`}>
                      {team.totalPoints.toLocaleString()}
                    </div>
                    {team.matchPoints !== 0 && (
                      <div className={`text-[10px] font-bold ${team.matchPoints > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {team.matchPoints > 0 ? '+' : ''}{team.matchPoints.toLocaleString()}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
