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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 tracking-wide">
                <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300 text-center w-24">Rank</th>
                <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">Team Name</th>
                <th className="py-4 px-8 text-right font-semibold text-slate-700 dark:text-slate-300 w-48">Total Points</th>
              </tr>
            </thead>
            <motion.tbody
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
            >
              {(teams || []).map((team, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                const isUser = team.isUser;

                return (
                  <motion.tr 
                    layout
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    key={team.id}
                    className={`border-b border-black/5 dark:border-white/5 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.08] ${
                      isUser 
                        ? 'bg-primary/[0.03] dark:bg-primary/[0.05] ring-1 ring-primary/20 dark:ring-primary/20 relative z-10 shadow-[0_0_15px_rgba(0,0,0,0.03)] dark:shadow-[0_0_15px_rgba(255,255,255,0.02)]' 
                        : ''
                    }`}
                  >
                    <td className="py-4 px-6 text-center w-20">
                      <div className="flex flex-col items-center gap-1">
                        {rank === 1 ? (
                          <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white border border-black/20 dark:border-white/30 flex items-center justify-center mx-auto shadow-sm">
                            <Trophy size={16} />
                          </div>
                        ) : rank === 2 ? (
                          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/20 flex items-center justify-center mx-auto shadow-sm">
                            <Medal size={16} />
                          </div>
                        ) : rank === 3 ? (
                          <div className="w-8 h-8 rounded-full bg-black/[0.02] dark:bg-white/5 text-slate-600 dark:text-slate-500 border border-black/5 dark:border-white/10 flex items-center justify-center mx-auto shadow-sm">
                            <Medal size={16} />
                          </div>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400 font-medium">{rank}</span>
                        )}
                        
                        {/* Trend Indicator */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-center -mt-1"
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
                            <div className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 opacity-40">
                              <Minus size={10} className="text-slate-400 dark:text-slate-600" strokeWidth={3} />
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className={`font-black text-lg ${isUser ? 'text-slate-900 dark:text-white filter drop-shadow-sm' : isTop3 ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                          {team.teamName}
                        </span>
                        {isUser && (
                          <span className="text-[10px] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-widest shadow-sm">
                            Your Team
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-black text-2xl tracking-tight ${isTop3 ? 'text-slate-900 dark:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:drop-shadow-lg' : 'text-slate-800 dark:text-slate-200'}`}>
                          {(team.totalPoints || 0).toLocaleString()}
                        </span>
                        {team.matchPoints > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20"
                          >
                            <TrendingUp size={8} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">+{team.matchPoints.toLocaleString()}</span>
                          </motion.div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
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
                  isUser ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
              >
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
                        <span className={`font-black text-lg tracking-tight ${isUser ? 'text-white' : 'text-slate-200'}`}>
                          {team.teamName}
                        </span>
                        {isUser && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {team.rankDiff !== 0 ? `${Math.abs(team.rankDiff)} spots ${team.trend === 'up' ? 'up' : 'down'}` : 'Position Solid'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-white tracking-tighter">
                      {team.totalPoints.toLocaleString()}
                    </div>
                    {team.matchPoints > 0 && (
                      <div className="flex items-center justify-end gap-1 text-emerald-400 font-bold text-xs mt-0.5">
                        <TrendingUp size={10} />
                        <span>+{team.matchPoints.toLocaleString()}</span>
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
