import React from 'react';
import { Trophy, Medal, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = ({ teams, hideInternalHeader }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      {!hideInternalHeader && (
        <div className="text-center mb-12">
          <h2 className="text-sm font-black tracking-widest text-slate-600 dark:text-slate-500 uppercase mb-3">Live Rankings</h2>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white">Leaderboard</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Tournament Progress Tracking</p>
        </div>
      )}

      <div className="hidden md:block glass-premium rounded-[2rem] overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-[80px_1fr_120px] items-center border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 tracking-wide px-6 py-3">
          <div className="font-bold text-slate-500 dark:text-slate-400 text-left uppercase text-[10px] tracking-widest">Rank</div>
          <div className="font-bold text-slate-500 dark:text-slate-400 text-left uppercase text-[10px] tracking-widest">Team Name</div>
          <div className="font-bold text-slate-500 dark:text-slate-400 text-right uppercase text-[10px] tracking-widest">Total Points</div>
        </div>

        <motion.div
          layout
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
          className="divide-y divide-black/5 dark:divide-white/5"
        >
          {(teams || []).map((team, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const isUser = team.isUser;

            return (
              <motion.div 
                layout
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                key={team.id}
                className={`grid grid-cols-[80px_1fr_120px] items-center px-6 py-2.5 transition-all duration-500 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] relative group ${
                  isUser 
                    ? 'bg-[#001a2c]/60 dark:bg-[#001a2c]/60 ring-2 ring-[#00d4ff]/40 z-10 shadow-[0_0_30px_rgba(0,212,255,0.15)] backdrop-blur-md' 
                    : ''
                }`}
              >
                {isUser && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 via-transparent to-[#00d4ff]/5 animate-pulse pointer-events-none" />
                )}
                
                {/* Column 1: Rank (Fixed 80px) */}
                <div className="flex flex-col items-start gap-1 z-10">
                  {rank === 1 ? (
                    <div className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white border border-black/20 dark:border-white/30 flex items-center justify-center shadow-sm">
                      <Trophy size={14} />
                    </div>
                  ) : rank === 2 ? (
                    <div className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/20 flex items-center justify-center shadow-sm">
                      <Medal size={14} />
                    </div>
                  ) : rank === 3 ? (
                    <div className="w-7 h-7 rounded-full bg-black/[0.02] dark:bg-white/5 text-slate-600 dark:text-slate-500 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-sm">
                      <Medal size={14} />
                    </div>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 font-medium px-2">{rank}</span>
                  )}
                  
                  {/* Trend Indicator */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-start z-10"
                  >
                    {team.trend === 'up' ? (
                      <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <TrendingUp size={11} className="text-emerald-500" strokeWidth={3} />
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{Math.abs(team.rankDiff || 0)}</span>
                      </div>
                    ) : team.trend === 'down' ? (
                      <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                        <TrendingDown size={11} className="text-rose-500" strokeWidth={3} />
                        <span className="text-[10px] font-black text-rose-600 dark:text-rose-400">{Math.abs(team.rankDiff || 0)}</span>
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 opacity-40">
                        <Minus size={10} className="text-slate-400 dark:text-slate-600" strokeWidth={3} />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Column 2: Team Name (flex-1) */}
                <div className="flex items-center gap-3 truncate z-10">
                  <span className={`font-bold text-[15px] truncate transition-colors ${isUser ? 'text-[#00d2ff] drop-shadow-[0_0_8px_rgba(0,210,255,0.4)]' : 'text-slate-700 dark:text-slate-300'}`}>
                    {team.teamName}
                  </span>
                </div>

                {/* Column 3: Total Points (Fixed 120px) */}
                <div className="flex flex-col items-end z-10">
                  <span className={`font-black text-[18px] tracking-tight ${isUser ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {(team.totalPoints || 0).toLocaleString()}
                  </span>
                  {team.matchPoints !== 0 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md border shadow-sm ${
                        team.matchPoints > 0 
                          ? 'bg-emerald-500/10 border-emerald-500/20' 
                          : 'bg-rose-500/10 border-rose-500/20'
                      }`}
                    >
                      {team.matchPoints > 0 ? (
                        <TrendingUp size={8} className="text-emerald-500" />
                      ) : (
                        <TrendingDown size={8} className="text-rose-500" />
                      )}
                      <span className={`text-[10px] font-black ${
                        team.matchPoints > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {team.matchPoints > 0 ? '+' : ''}{team.matchPoints.toLocaleString()}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        <motion.div
           initial="hidden"
           animate="visible"
           variants={{
             hidden: { opacity: 0 },
             visible: {
               opacity: 1,
               transition: { staggerChildren: 0.1 }
             }
           }}
           className="grid grid-cols-1 gap-4"
        >
          {(teams || []).map((team, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const isUser = team.isUser;

            return (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                key={team.id}
                className={`glass-premium rounded-3xl p-5 relative overflow-hidden transition-all active:scale-[0.98] ${
                  isUser ? 'ring-2 ring-[#00d4ff] bg-[#001a2c]/80 shadow-[0_0_30px_rgba(0,212,255,0.3)]' : ''
                }`}
              >
                {isUser && (
                  <div className="absolute inset-0 bg-[#00d4ff]/5 animate-pulse pointer-events-none" />
                )}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    {/* Rank Indicator */}
                    <div className="relative">
                      {rank === 1 ? (
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg">
                          <Trophy size={20} />
                        </div>
                      ) : rank === 2 ? (
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-white shadow-lg">
                          <Medal size={20} />
                        </div>
                      ) : rank === 3 ? (
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center text-white shadow-lg">
                          <Medal size={20} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 font-black text-lg">
                          {rank}
                        </div>
                      )}
                      
                      {/* Mini Trend badge */}
                      <div className="absolute -bottom-1 -right-1">
                        {team.trend === 'up' ? (
                          <div className="bg-emerald-500 rounded-full p-0.5 border-2 border-[#111]">
                            <TrendingUp size={10} className="text-white" />
                          </div>
                        ) : team.trend === 'down' ? (
                          <div className="bg-rose-500 rounded-full p-0.5 border-2 border-[#111]">
                            <TrendingDown size={10} className="text-white" />
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-lg tracking-tight ${isUser ? 'text-[#00d2ff] drop-shadow-[0_0_10px_rgba(0,210,255,0.3)]' : 'text-slate-900 dark:text-white font-bold'}`}>
                          {team.teamName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {team.rankDiff !== 0 ? `${Math.abs(team.rankDiff)} spots ${team.trend === 'up' ? 'up' : 'down'}` : 'Position Solid'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-black tracking-tighter ${isUser ? 'text-[#001a2c] dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                      {team.totalPoints.toLocaleString()}
                    </div>
                    {team.matchPoints !== 0 && (
                      <div className={`flex items-center justify-end gap-1 font-bold text-xs mt-0.5 ${
                        team.matchPoints > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {team.matchPoints > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        <span>{team.matchPoints > 0 ? '+' : ''}{team.matchPoints.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtle Background rank for flair */}
                <div className="absolute -bottom-6 -right-4 text-8xl font-black text-white/[0.03] italic select-none pointer-events-none">
                  #{rank}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
